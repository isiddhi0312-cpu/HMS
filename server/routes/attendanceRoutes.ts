import express from 'express';
import Attendance from '../models/Attendance';
import { protect, adminOnly, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Get Attendance (Filter by date, student)
router.get('/', protect, async (req: any, res) => {
  const authReq = req as AuthRequest;
  try {
    const { date, studentId } = req.query;
    let query: any = {};

    if (date) {
        // Match exact date (ignoring time)
        const start = new Date(date as string);
        start.setHours(0,0,0,0);
        const end = new Date(date as string);
        end.setHours(23,59,59,999);
        query.date = { $gte: start, $lte: end };
    }

    if (authReq.user?.role === 'student') {
        // Students can only see their own
        if (!authReq.user.studentProfile) return res.status(400).json({message: "No student profile linked"});
        query.student = authReq.user.studentProfile;
    } else if (studentId) {
        query.student = studentId;
    }

    const attendance = await Attendance.find(query).populate('student', 'fullName rollNumber');
    res.json(attendance);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Mark Attendance (Admin)
router.post('/', protect, adminOnly, async (req: any, res) => {
  const authReq = req as AuthRequest;
  try {
    const { studentId, date, status } = req.body;
    
    // Check if already marked
    const existing = await Attendance.findOne({ 
        student: studentId, 
        date: { 
            $gte: new Date(new Date(date).setHours(0,0,0,0)), 
            $lte: new Date(new Date(date).setHours(23,59,59,999)) 
        } 
    });

    if (existing) {
        existing.status = status;
        existing.markedBy = authReq.user?._id;
        await existing.save();
        return res.json(existing);
    }

    const attendance = await Attendance.create({
      student: studentId,
      date,
      status,
      markedBy: authReq.user?._id
    });
    res.status(201).json(attendance);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get Stats (For Dashboard)
router.get('/stats', protect, adminOnly, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const present = await Attendance.countDocuments({ date: { $gte: today }, status: 'Present' });
        const absent = await Attendance.countDocuments({ date: { $gte: today }, status: 'Absent' });
        
        res.json({ present, absent });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

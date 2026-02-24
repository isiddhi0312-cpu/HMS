import express from 'express';
import Complaint from '../models/Complaint';
import { protect, adminOnly, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Get Complaints
router.get('/', protect, async (req: any, res) => {
  const authReq = req as AuthRequest;
  try {
    let query = {};
    if (authReq.user?.role === 'student') {
        if (!authReq.user.studentProfile) return res.status(400).json({message: "No student profile linked"});
        query = { student: authReq.user.studentProfile };
    }
    const complaints = await Complaint.find(query).populate('student', 'fullName roomNumber').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create Complaint
router.post('/', protect, async (req: any, res) => {
  const authReq = req as AuthRequest;
  try {
    if (authReq.user?.role !== 'student') return res.status(403).json({ message: 'Only students can submit complaints' });
    if (!authReq.user.studentProfile) return res.status(400).json({message: "No student profile linked"});

    const complaint = await Complaint.create({
      ...req.body,
      student: authReq.user.studentProfile
    });
    res.status(201).json(complaint);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update Complaint (Admin - Status/Reply)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(complaint);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

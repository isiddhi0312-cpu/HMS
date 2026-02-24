import express from 'express';
import Student from '../models/Student';
import User from '../models/User';
import { protect, adminOnly, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Get all students
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const students = await Student.find().populate('user', 'name email');
    res.json(students);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get single student (Admin or the student themselves)
router.get('/:id', protect, async (req: any, res) => {
  const authReq = req as AuthRequest;
  try {
    const student = await Student.findById(req.params.id).populate('user', 'name email');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Check if requester is admin or the student owner
    if (authReq.user?.role !== 'admin' && authReq.user?.studentProfile?.toString() !== student._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(student);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create Student (Admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update Student
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Student
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

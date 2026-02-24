import express from 'express';
import Room from '../models/Room';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

// Get all rooms
router.get('/', protect, async (req, res) => {
  try {
    const rooms = await Room.find().populate('occupants', 'fullName');
    res.json(rooms);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create Room
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update Room (Assign student, etc)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(room);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Room
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

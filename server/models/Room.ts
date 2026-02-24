import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  type: { type: String, enum: ['AC', 'Non-AC'], default: 'Non-AC' },
  price: { type: Number },
}, { timestamps: true });

export default mongoose.model('Room', roomSchema);

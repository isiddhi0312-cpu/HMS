import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  category: { type: String, enum: ['Electricity', 'Water', 'Cleaning', 'Food', 'Other'], required: true },
  description: { type: String, required: true },
  image: { type: String }, // Optional image URL
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  adminReply: { type: String },
}, { timestamps: true });

export default mongoose.model('Complaint', complaintSchema);

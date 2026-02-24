import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  roomNumber: { type: String }, // Can be linked to Room model
  course: { type: String, required: true },
  contactNumber: { type: String, required: true },
  parentContactNumber: { type: String, required: true },
  profilePhoto: { type: String }, // URL or base64
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to auth user
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);

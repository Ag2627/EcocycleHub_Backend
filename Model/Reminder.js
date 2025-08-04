import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' }, // 'pending', 'viewed', 'resolved'
});

export default mongoose.model('Reminder', reminderSchema);

import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    priority: { type: String, enum: ['Low', 'Medium', 'High'] },
    due_date: String,
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);

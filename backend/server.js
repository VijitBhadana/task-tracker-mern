import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

// 🔹 Connect MongoDB
connectDB();

const app = express();

// 🔹 Middleware
app.use(cors({
  origin: '*', // frontend domain baad me restrict kar sakte ho
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// 🔹 Routes
app.use('/api/tasks', taskRoutes);

// 🔹 Health check (Render / deployment ke liye useful)
app.get('/', (req, res) => {
  res.send('Task Tracker Backend is running 🚀');
});

// 🔹 Port (Render ya local dono ke liye)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

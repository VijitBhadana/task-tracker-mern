import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

// 🔹 Connect MongoDB
connectDB();

const app = express();

// 🔴 CORS CONFIG (VERY IMPORTANT)
app.use(cors({
  origin: [
    'http://localhost:5173',                 // local frontend
    'https://task-tracker-mern-mu.vercel.app' // deployed frontend (Vercel)
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// 🔴 Preflight requests handle karo
app.options('*', cors());

app.use(express.json());

// 🔹 Routes
app.use('/api/tasks', taskRoutes);

// 🔹 Health check
app.get('/', (req, res) => {
  res.send('Task Tracker Backend is running 🚀');
});

// 🔹 Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

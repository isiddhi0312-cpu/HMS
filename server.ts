import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './server/routes/authRoutes';
import studentRoutes from './server/routes/studentRoutes';
import roomRoutes from './server/routes/roomRoutes';
import attendanceRoutes from './server/routes/attendanceRoutes';
import complaintRoutes from './server/routes/complaintRoutes';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mock Data for Offline Mode
const MOCK_STUDENTS = [
  { _id: '1', fullName: 'Aarav Sharma', rollNumber: 'CS001', course: 'CSE', contactNumber: '9876543210', roomNumber: '101' },
  { _id: '2', fullName: 'Vivaan Gupta', rollNumber: 'CS002', course: 'CSE', contactNumber: '9876543211', roomNumber: '102' },
  { _id: '3', fullName: 'Chunnu', rollNumber: '202501240', course: 'B.Tech', contactNumber: '9876543212', roomNumber: 'F-27' },
];

const MOCK_ROOMS = [
  { _id: '1', roomNumber: '101', capacity: 2, occupants: [{ _id: '1', fullName: 'Aarav Sharma' }], type: 'AC', price: 6000 },
  { _id: '2', roomNumber: '102', capacity: 2, occupants: [], type: 'Non-AC', price: 4000 },
  { _id: '3', roomNumber: 'F-27', capacity: 2, occupants: [{ _id: '3', fullName: 'Chunnu' }], type: 'Non-AC', price: 4500 },
];

const MOCK_ATTENDANCE = [
  { _id: '1', student: { _id: '1', fullName: 'Aarav Sharma' }, date: new Date(), status: 'Present' }
];

const MOCK_COMPLAINTS = [
  { _id: '1', category: 'Electricity', description: 'Fan not working', status: 'Pending', student: { fullName: 'Aarav Sharma', roomNumber: '101' }, createdAt: new Date() }
];

async function startServer() {
  const app = express();
  const PORT = 3000;
  let isOffline = false;

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // Database Connection
  const connectDB = async () => {
    try {
      if (!process.env.MONGODB_URI) throw new Error('No URI');
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      console.log('Running in OFFLINE/DEMO mode with mock data');
      isOffline = true;
    }
  };

  await connectDB();

  // Mock Middleware to intercept API calls in offline mode
  app.use('/api', (req, res, next) => {
    if (isOffline) {
      console.log(`[Mock API] ${req.method} ${req.path}`);
      
      // Students
      if (req.path === '/students' && req.method === 'GET') return res.json(MOCK_STUDENTS);
      if (req.path.startsWith('/students/') && req.method === 'DELETE') return res.json({ message: 'Deleted (Mock)' });
      if (req.path === '/students' && req.method === 'POST') return res.json({ ...req.body, _id: Date.now().toString() });

      // Rooms
      if (req.path === '/rooms' && req.method === 'GET') return res.json(MOCK_ROOMS);
      
      // Attendance
      if (req.path === '/attendance/stats' && req.method === 'GET') return res.json({ present: 1, absent: 0 });
      if (req.path === '/attendance' && req.method === 'GET') return res.json(MOCK_ATTENDANCE);
      if (req.path === '/attendance' && req.method === 'POST') return res.json({ message: 'Marked (Mock)' });

      // Complaints
      if (req.path === '/complaints' && req.method === 'GET') return res.json(MOCK_COMPLAINTS);

      // Auth (Login/Register) - already handled by frontend mock context, but just in case
      if (req.path === '/auth/login') return res.json({ token: 'mock-token', user: { name: 'Admin', role: 'admin' } });

      // Default fallback for other GETs
      if (req.method === 'GET') return res.json([]);
      if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') return res.json({ success: true, mock: true });
    }
    next();
  });

  // API Routes (Only used if DB is connected)
  app.use('/api/auth', authRoutes);
  app.use('/api/students', studentRoutes);
  app.use('/api/rooms', roomRoutes);
  app.use('/api/attendance', attendanceRoutes);
  app.use('/api/complaints', complaintRoutes);

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', db: isOffline ? 'offline (mock)' : 'connected' });
  });

  // Vite Middleware (for development)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

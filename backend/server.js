import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/students.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/students', studentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Student Management API is running' });
});

// Start server - listen on 0.0.0.0 to accept connections from outside container
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`API endpoints available at http://0.0.0.0:${PORT}/api/students`);
});

export default app;


const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const followRoutes = require('./routes/follows');

const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// CORS configuration with credentials support
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        origin === allowedOrigin ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Standard body parsing & cookie parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// API Routes (supports both with and without /api prefix for Vercel service compatibility)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/users', '/users'], userRoutes);
app.use(['/api/posts', '/posts'], postRoutes);
app.use(['/api/comments', '/comments'], commentRoutes);
app.use(['/api/follows', '/follows'], followRoutes);

// 404 Handler for undefined routes
app.use(notFoundHandler);

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;

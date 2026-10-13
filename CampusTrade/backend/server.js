import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created /uploads directory');
}

// Connect to Database
connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://remarkable-mandazi-aa142f.netlify.app'
];

if (process.env.FRONTEND_URL) {
  const formattedUrl = process.env.FRONTEND_URL.trim().replace(/\/$/, "");
  if (!allowedOrigins.includes(formattedUrl)) {
    allowedOrigins.push(formattedUrl);
  }
}

app.use(cors({
  origin: function (origin, callback) {
    // NUCLEAR FIX: Temporarily allow every origin to find the real issue
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n📨 ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0 && req.method !== 'GET') {
    const bodyPreview = JSON.stringify(req.body).substring(0, 200);
    console.log('📦 Body:', bodyPreview);
  }
  next();
});

// Serve static files from uploads folder
app.use('/uploads', express.static(uploadsDir));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'CampusTrade API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404: Route not found - ${req.method} ${req.path}`);
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('\n❌ GLOBAL ERROR:', {
    message: err.message,
    status: err.status || 500,
    code: err.code,
    stack: err.stack?.split('\n').slice(0, 5).join('\n')
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { error: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`\n✅ CampusTrade Server running on port ${PORT}`);
    console.log(`📁 Uploads served from: ${uploadsDir}`);
    console.log(`🌐 API Base: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION:', err.message);
  server.close(() => process.exit(1));
});

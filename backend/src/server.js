const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/database');
const { handleMulterError } = require('./middleware/upload');

// Initialize express
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:4173', 'https://stasiygp.imavi.org', process.env.FRONTEND_URL, /\.vercel\.app$/].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 1. Tambahkan trust proxy jika dideploy ke VPS/Cloud (Nginx, Heroku, dsb)
app.set('trust proxy', true);

// 2. Middleware Logger untuk mencatat IP
app.use((req, res, next) => {
  const visitorIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(`[${new Date().toLocaleString()}] Access from IP: ${visitorIp} | Method: ${req.method} | URL: ${req.url}`);
  next();
});
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api', require('./routes/crud'));
app.use('/api/liturgy', require('./routes/liturgy'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(handleMulterError);

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}/api`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;

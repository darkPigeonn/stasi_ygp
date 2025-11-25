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
  origin: ['http://localhost:5173', 'http://localhost:5174', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

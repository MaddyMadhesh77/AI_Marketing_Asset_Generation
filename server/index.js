const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads (optional - if you want to serve uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const marketingRoutes = require('./routes/marketingRoutes');

// API Routes
app.use('/api/marketing', marketingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Marketing Generator API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Marketing Generator API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      generateAll: 'POST /api/marketing/generate',
      generateCopy: 'POST /api/marketing/generate-copy',
      generateImage: 'POST /api/marketing/generate-image'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
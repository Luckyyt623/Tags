require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(helmet());
app.use(compression());
app.use(morgan('dev')); // Changed to 'dev' for better Render logs

// CORS configuration - simplified for Render
app.use(cors({
  origin: '*',
  methods: ['GET'],
  allowedHeaders: ['Content-Type']
}));

// Rate limiting - reduced for Render's shared environment
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Reduced from 100 to 50 for Render
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Database mock - simplified for initial deployment
const tagsDatabase = {
  tags: [
    {
      id: "default",
      imageUrl: "https://cdn.stellarslither.com/cosmetic/25a632021237be6a0d083bc4c85fcb72b04ad9c539c1afe839117d6c89ecc206.webp",
      angle: -90,
      leftPos: 88,
      topPos: 150,
      width: 175,
      height: 175,
      borderColor: "#FFD700",
      borderShadow: "#000000"
    }
  ],
  metadata: {
    lastUpdated: new Date().toISOString(),
    version: "1.0.0"
  }
};

// API Endpoints - simplified caching
app.get('/api/get-tags', (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=3600');
    res.status(200).json(tagsDatabase);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Basic error handling
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
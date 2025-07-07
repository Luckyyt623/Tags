require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and performance middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || '*',
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
  maxAge: 86400
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Database mock (replace with real DB in production)
const tagsDatabase = {
  tags: [
    {
      _id: "684d6204531b8388770f08f9",
      id: 4168,
      imageUrl: "https://raw.githubusercontent.com/Luckyyt623/All-images/main/Picsart_25-06-29_19-55-16-551.png",
      angle: -90,
      leftPos: 88,
      topPos: 150,
      width: 175,
      height: 175,
      borderColor: "#FFD700",
      borderShadow: "#000000",
      cacheMaxAge: 86400 // 24 hours
    },
    // Add more tags as needed
  ],
  metadata: {
    lastUpdated: new Date().toISOString(),
    version: "1.0.0",
    ttl: 3600 // Default cache duration
  }
};

// API Endpoints
app.get('/api/v1/tags', (req, res) => {
  try {
    // Check for If-None-Match header for cache validation
    const clientETag = req.headers['if-none-match'];
    const serverETag = `W/"${tagsDatabase.metadata.lastUpdated}"`;
    
    if (clientETag === serverETag) {
      return res.status(304).end(); // Not Modified
    }

    res.set({
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${tagsDatabase.metadata.ttl}`,
      'ETag': serverETag,
      'Last-Modified': tagsDatabase.metadata.lastUpdated
    });

    res.status(200).json({
      success: true,
      data: tagsDatabase.tags,
      metadata: tagsDatabase.metadata
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Server startup
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Tags endpoint: http://localhost:${PORT}/api/v1/tags`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
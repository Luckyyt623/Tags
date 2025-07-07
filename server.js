const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced CORS configuration
const corsOptions = {
  origin: '*',
  methods: 'GET',
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200
};

// Better to use the cors middleware
app.use(require('cors')(corsOptions));

// Add compression middleware
app.use(require('compression')());

// Add rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Add security headers
const helmet = require('helmet');
app.use(helmet());

// Static tag database (consider moving to a database later)
const tags = {
  tags: [
    {
      id: "india",
      imageUrl: "https://raw.githubusercontent.com/Luckyyt623/All-images/main/Picsart_25-06-29_19-55-16-551.png",
      width: 60,
      height: 60,
      leftPos: -30,
      topPos: -30,
      angle: 0,
      borderColor: "#ffffff",
      borderShadow: "#000000",
      // Added cache control
      cacheMaxAge: 3600 // 1 hour
    },
    {
      id: "usa",
      imageUrl: "https://raw.githubusercontent.com/Luckyyt623/All-images/main/Picsart_25-07-06_18-00-00-000.png",
      width: 60,
      height: 60,
      leftPos: -30,
      topPos: -30,
      angle: 0,
      borderColor: "#ff0000",
      borderShadow: "#0000ff",
      cacheMaxAge: 3600
    }
  ],
  // Added metadata
  lastUpdated: new Date().toISOString(),
  ttl: 3600 // Cache duration in seconds
};

// API endpoint with better caching headers
app.get('/api/get-tags', (req, res) => {
  res.type('application/json');
  res.set('Cache-Control', `public, max-age=${tags.ttl}`);
  res.status(200).json(tags);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server with better logging
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🔄 Tags endpoint: http://localhost:${PORT}/api/get-tags`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
  });
});
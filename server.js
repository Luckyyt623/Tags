const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Allow CORS for all origins
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Static tag database (you can replace this with DB later)
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
      borderShadow: "#000000"
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
      borderShadow: "#0000ff"
    }
  ]
};

// API endpoint
app.get('/api/get-tags', (req, res) => {
  res.type('application/json');
  res.status(200).json(tags);
});

// Home test endpoint
app.get('/', (req, res) => {
  res.send('<h1>✅ Slither Tag API is Running</h1><p>Use <code>/api/get-tags</code> to fetch tag data.</p>');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
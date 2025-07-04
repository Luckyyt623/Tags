const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so any browser extension can access this API
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// JSON tag list
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
    }
  ]
};

// API endpoint
app.get("/api/get-tags", (req, res) => {
  res.json(tags);
});

// Home route
app.get("/", (req, res) => {
  res.send("Slither Tag API is running.");
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
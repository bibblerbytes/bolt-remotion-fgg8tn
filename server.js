const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'public/assets/' });

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = `/assets/${req.file.filename}`;
  res.json({ filePath });
});

app.get('/api/assets', (req, res) => {
  const assetsDir = path.join(__dirname, 'public', 'assets');
  fs.readdir(assetsDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading assets directory');
    }
    const assetPaths = files.map(file => `/assets/${file}`);
    res.json(assetPaths);
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
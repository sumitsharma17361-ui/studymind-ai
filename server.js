const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve Frontend static files directly from root directory
app.use(express.static(path.join(__dirname)));

// Database Connection
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('[Database] MongoDB Connected Successfully'))
    .catch(err => console.error('[Database] Connection Error:', err));
}

// 🔓 Public Route for AI Roadmap Generation
app.post('/api/public-roadmap', async (req, res) => {
  try {
    const { generateStudyRoadmap } = require('./services/geminiService');
    const { subject, targetWeeks, level } = req.body;
    const roadmap = await generateStudyRoadmap(subject, targetWeeks, level);
    res.status(200).json(roadmap);
  } catch (error) {
    console.error('Public Roadmap Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate roadmap' });
  }
});

// Server Port
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`[Server] StudyMind AI running on port ${PORT}`);
});

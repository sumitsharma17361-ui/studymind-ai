const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('[Database] MongoDB Connected Successfully'))
    .catch(err => console.error('[Database] Connection Error:', err));
}

// Home Route / Status Check
app.get('/', (req, res) => {
  res.status(200).json({
    status: "200 OK",
    message: "StudyMind AI API is Live!",
    endpoints: ["/api/auth", "/api/roadmaps", "/api/notes", "/api/public-roadmap"]
  });
});

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

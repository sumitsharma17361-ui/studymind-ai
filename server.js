require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/roadmaps', require('./routes/roadmapRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
// 🔓 Public Route (Bina Login ke AI UI chalane ke liye)
app.post('/api/public-roadmap', async (req, res) => {
  try {
    const { generateStudyRoadmap } = require('./services/geminiService');
    const { subject, targetWeeks, level } = req.body;
    const roadmap = await generateStudyRoadmap(subject, targetWeeks, level);
    res.status(200).json(roadmap);
  } catch (error) {
    console.error('Public Roadmap Error:', error);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
});

app.listen(PORT, () => {
  console.log(`[Server] StudyMind AI running on port ${PORT}`);
});

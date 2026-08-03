const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  week: Number,
  title: String,
  topics: [String],
  keyConcepts: [String],
  completed: { type: Boolean, default: false }
});

const roadmapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  targetWeeks: { type: Number, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  modules: [moduleSchema],
  progress: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Roadmap', roadmapSchema);


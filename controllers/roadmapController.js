const Roadmap = require('../models/Roadmap');
const { generateStudyRoadmap } = require('../services/geminiService');

exports.createRoadmap = async (req, res) => {
  try {
    const { subject, targetWeeks, level } = req.body;
    if (!subject || !targetWeeks) {
      return res.status(400).json({ success: false, message: 'Subject and target weeks are required' });
    }

    const modules = await generateStudyRoadmap(subject, targetWeeks, level || 'Intermediate');

    const roadmap = await Roadmap.create({
      user: req.user.id,
      subject,
      targetWeeks,
      level: level || 'Intermediate',
      modules
    });

    res.status(201).json({ success: true, data: roadmap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: roadmaps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleModuleStatus = async (req, res) => {
  try {
    const { roadmapId, moduleId } = req.params;
    const roadmap = await Roadmap.findOne({ _id: roadmapId, user: req.user.id });
    if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found' });

    const module = roadmap.modules.id(moduleId);
    if (!module) return res.status(404).json({ success: false, message: 'Module not found' });

    module.completed = !module.completed;

    const completedCount = roadmap.modules.filter(m => m.completed).length;
    roadmap.progress = Math.round((completedCount / roadmap.modules.length) * 100);

    await roadmap.save();
    res.json({ success: true, data: roadmap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

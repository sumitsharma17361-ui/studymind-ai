const Note = require('../models/Note');

exports.createNote = async (req, res) => {
  try {
    const { title, content, roadmap, tags } = req.body;
    const note = await Note.create({
      user: req.user.id,
      title,
      content,
      roadmap: roadmap || null,
      tags: tags || []
    });
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).populate('roadmap', 'subject').sort({ createdAt: -1 });
    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

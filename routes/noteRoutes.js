const express = require('express');
const router = express.Router();
const { createNote, getNotes } = require('../controllers/noteController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', createNote);
router.get('/', getNotes);

module.exports = router;

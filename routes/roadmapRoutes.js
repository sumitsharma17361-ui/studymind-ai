const express = require('express');
const router = express.Router();
const { createRoadmap, getRoadmaps, toggleModuleStatus } = require('../controllers/roadmapController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', createRoadmap);
router.get('/', getRoadmaps);
router.patch('/:roadmapId/modules/:moduleId', toggleModuleStatus);

module.exports = router;

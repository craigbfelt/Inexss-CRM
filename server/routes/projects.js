const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { auth, brandRepAuth, restrictedRoleCheck } = require('../middleware/auth');

router.post('/', auth, restrictedRoleCheck, projectController.createProject);
router.get('/', auth, brandRepAuth, projectController.getAllProjects);
router.get('/:id', auth, brandRepAuth, projectController.getProjectById);
router.put('/:id', auth, restrictedRoleCheck, projectController.updateProject);
router.delete('/:id', auth, restrictedRoleCheck, projectController.deleteProject);

module.exports = router;

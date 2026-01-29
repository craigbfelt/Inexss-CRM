const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const { auth, brandRepAuth, restrictedRoleCheck } = require('../middleware/auth');

router.post('/', auth, restrictedRoleCheck, meetingController.createMeeting);
router.get('/', auth, brandRepAuth, meetingController.getAllMeetings);
router.get('/report/monthly', auth, brandRepAuth, meetingController.getMonthlyReport);
router.get('/:id', auth, brandRepAuth, meetingController.getMeetingById);
router.put('/:id', auth, restrictedRoleCheck, meetingController.updateMeeting);
router.delete('/:id', auth, restrictedRoleCheck, meetingController.deleteMeeting);

module.exports = router;

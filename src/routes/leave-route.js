const express = require('express');
const leaveController = require('../controller/leaveController');
const router = express.Router();

// request leave
router.get('/', leaveController.getAllLeaveRequests);
router.post('/create', leaveController.createLeaveRequest);
router.delete(
  '/:leaveRequestId',
  leaveController.deleteLeaveRequestsByLeaveRequestId
);
// user leave
router.get('/:userLeaveId', leaveController.getLeaveRequestsByUserLeaveId);
router.post('/create/:userId', leaveController.createUserLeave);
router.patch('/:userId', leaveController.updateUserLeave);
router.patch(
  '/status/accept/:userLeaveId',
  leaveController.updateStatusRequestAcceptByUserLeaveId
);
router.patch(
  '/status/reject/:userLeaveId',
  leaveController.updateStatusRequestRejectByUserLeaveId
);
router.delete('/delete/:userLeaveId', leaveController.deleteUserLeave);

// profile leave
router.post('/profile', leaveController.createProfileLeave);

module.exports = router;

const express = require('express');

// Controller

const leaveController = require('../controller/leaveController');

// Middlewares
const authenticatedMiddleware = require('../middleware/authenticate/authenticate');

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
router.post(
  '/createUserLeave',
  authenticatedMiddleware,
  leaveController.createUserLeave
);
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

// leave profile
router.post(
  '/createLeaveProfile',
  authenticatedMiddleware,
  leaveController.createLeaveProfile
);

module.exports = router;

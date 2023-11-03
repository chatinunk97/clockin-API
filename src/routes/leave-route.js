const express = require('express');

// Controller

const leaveController = require('../controller/leaveController');

// Middlewares
const authenticatedMiddleware = require('../middleware/authenticate/authenticate');

const router = express.Router();

// request leave
router.get('/', leaveController.getAllLeaveRequests);
router.post(
  '/createRequestLeave',
  authenticatedMiddleware,
  leaveController.createRequestLeave
);
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
router.patch(
  '/updateUserLeave/:userLeaveId',
  authenticatedMiddleware,
  leaveController.updateUserLeave
);
router.patch(
  '/status/accept/:userLeaveId',
  leaveController.updateStatusRequestAcceptByUserLeaveId
);
router.patch(
  '/status/reject/:userLeaveId',
  leaveController.updateStatusRequestRejectByUserLeaveId
);
router.delete(
  '/deleteUserLeave/:userLeaveId',
  authenticatedMiddleware,
  leaveController.deleteUserLeave
);

// leave profile
router.post(
  '/createLeaveProfile',
  authenticatedMiddleware,
  leaveController.createLeaveProfile
);

module.exports = router;

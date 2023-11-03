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
router.patch(
  '/updateRequestLeave',
  authenticatedMiddleware,
  leaveController.updateRequestLeave
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

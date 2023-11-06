const express = require('express');

// Controller
const leaveController = require('../controller/leaveController');

// Middlewares
const authenticatedMiddleware = require('../middleware/authenticate/authenticate');

const router = express.Router();

// request leave
router.get(
  '/getAllRequestLeaves',
  authenticatedMiddleware,
  leaveController.getAllRequestLeaves
);
router.get(
  '/getRequestLeave/:requestLeaveId',
  leaveController.getRequestLeaveById
);
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
  '/deleteRequestLeave/:leaveRequestId',
  authenticatedMiddleware,
  leaveController.deleteLeaveRequests
);

// user leave
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

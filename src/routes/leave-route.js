const express = require("express");
const leaveController = require("../controller/leave-controller");
const router = express.Router();

router.get("/", leaveController.getAllLeaveRequests);
router.post("/create", leaveController.createLeaveRequest);
router.get("/get/:userLeaveId", leaveController.getLeaveRequestsByUserLeaveId);
router.post("/create/:userId", leaveController.createUserLeave);
router.post("/profile", leaveController.createProfileLeave);
router.patch(
  "/update/status/accept/:userLeaveId",
  leaveController.updateStatusRequestAcceptByUserLeaveId
);
router.patch(
  "/update/status/reject/:userLeaveId",
  leaveController.updateStatusRequestRejectByUserLeaveId
);

module.exports = router;

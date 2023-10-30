const express = require("express");
const leaveController = require("../controllers/leave-controller");
const router = express.Router();

router.get("/", leaveController.getAllLeaveRequests);
router.post("/create", leaveController.createLeaveRequest);
router.get("/get/:userLeaveId", leaveController.getLeaveRequestsByUserLeaveId);
router.post("/create/:userLeaveId", leaveController.createUserLeave);
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

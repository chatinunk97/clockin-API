const express = require("express");

// Controller
const clockController = require("../controller/clockController");

// Middlewares
const authenticatedMiddleware = require("../middleware/authenticate/authenticate");

// Routes
const router = express.Router();

router.post("/clockIn", authenticatedMiddleware, clockController.clockIn);
router.patch("/clockOut", authenticatedMiddleware, clockController.clockOut);
router.patch(
  "/clockReason",
  authenticatedMiddleware,
  clockController.clockReason
);
router.get(
  "/location",
  authenticatedMiddleware,
  clockController.companyProfile
);
router.get("/", authenticatedMiddleware, clockController.getClock);
router.get(
  "/latestClock",
  authenticatedMiddleware,
  clockController.latestClock
);
router.get("/getAllStatus", authenticatedMiddleware, clockController.allStatus);
router.get(
  "/statusClockIn",
  authenticatedMiddleware,
  clockController.statusClockIn
);

module.exports = router;

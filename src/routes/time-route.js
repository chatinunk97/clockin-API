const express = require("express");

// Controller
const timeProfileController = require("../controller/timeProfileController");

// Middlewares

const authenticatedMiddleware = require("../middleware/authenticate/authenticate");

const router = express.Router();

router.post(
  "/createTimeProfile",
  authenticatedMiddleware,
  timeProfileController.createTimeProfile
);

router.get(
  "/:timeProfileId",
  authenticatedMiddleware,
  timeProfileController.getTimeProfileById
);
router.get(
  "/getTimeProfile",
  authenticatedMiddleware,
  timeProfileController.getAllTimeProfile
);

router.patch(
  "/updateTimeProfile/:timeProfileId",
  authenticatedMiddleware,
  timeProfileController.updateTimeProfile
);

module.exports = router;

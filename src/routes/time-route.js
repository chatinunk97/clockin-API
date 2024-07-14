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
  "/getAllTimeProfile",
  authenticatedMiddleware,
  timeProfileController.getAllTimeProfile
);

router.patch(
  "/updateTimeProfile/:timeProfileId",
  authenticatedMiddleware,
  timeProfileController.updateTimeProfile
);

router.delete(
  "/deleteTimeProfile/:id",
  authenticatedMiddleware,
  timeProfileController.deleteTimeProfile
);

module.exports = router;

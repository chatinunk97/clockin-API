const express = require("express");

// Controller
const flexibleController = require("../controller/flexibleController");

// Middlewares

const authenticatedMiddleware = require("../middleware/authenticate/authenticate");

const router = express.Router();

router.post(
  "/createFlexible",
  authenticatedMiddleware,
  flexibleController.createFlexible
);

// router.patch(
//   "/updateFlexible",
//   authenticatedMiddleware,
//   flexibleController.updateFlexible
// );

module.exports = router;

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

router.patch(
  "/updateFlexible/:id",
  authenticatedMiddleware,
  flexibleController.updateFlexible
);

router.get(
  "/getFlexible/:id",
  authenticatedMiddleware,
  flexibleController.getFlexibleByid
);

router.delete(
  "/deleteFlexible/:id",
  authenticatedMiddleware,
  flexibleController.deleteFlexibleByid
);

module.exports = router;

const express = require("express");

// Controller
const OTController = require("../controller/OTController");

// Middlewares
const authenticatedMiddleware = require("../middleware/authenticate/authenticate");

// Routes
const router = express.Router();

router.post("/requestOT", authenticatedMiddleware, OTController.requestOT);
router.patch(
  "/requestOT",
  authenticatedMiddleware,
  OTController.updateRequestOT
);
router.get("/requestOT", authenticatedMiddleware, OTController.getAllRequestOT);
router.get(
  "/getAllRequestOTByMonth",
  authenticatedMiddleware,
  OTController.getAllRequestOTByMonth
);
router.get(
  "/getRequestOTByUserId",
  authenticatedMiddleware,
  OTController.getRequestOTByUserId
);
router.get(
  "/myRequestOT",
  authenticatedMiddleware,
  OTController.getAllMyRequestOT
);

module.exports = router;

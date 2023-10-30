const express = require("express");

//Middlewares
const uploadMiddleware = require("../middleware/defaultMiddleware/upload");
const adminController = require("../controller/adminController");

const router = express.Router();

router.post("/createPackage", adminController.createPackage);
router.post("/registerCompany", adminController.registerCompany);
router.post(
  "/createPayment",
  uploadMiddleware.single("paySlip"),
  adminController.createPayment
);

module.exports = router;

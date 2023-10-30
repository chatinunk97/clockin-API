const express = require("express");

//Middlewares
const uploadMiddleware = require("../middleware/defaultMiddleware/upload");
const adminController = require("../controller/adminController");

const router = express.Router();

router.post("/createPackage", adminController.createPackage);
router.post(
  "/registerCompany",
  uploadMiddleware.single("paySlip"),
  adminController.registerCompany
);
router.post(
  "/createAdmin",
  uploadMiddleware.single("profileImage"),
  adminController.createAdmin
);

router.delete("/deleteAdmin/:id", adminController.deleteAdmin);

module.exports = router;

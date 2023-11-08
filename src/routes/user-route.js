const express = require("express");

// Controller
const userController = require("../controller/userController");
const superAdminController = require("../controller/superAdminController");

// Middlewares
const uploadMiddleware = require("../middleware/defaultMiddleware/upload");
const authenticatedMiddleware = require("../middleware/authenticate/authenticate");

const router = express.Router();

//________________________Routes for super admin operations________________________
router.post(
  "/createPackage",
  authenticatedMiddleware,
  superAdminController.createPackage
);
router.get("/showpackage", superAdminController.getallPackage);
router.post(
  "/registerCompany",
  uploadMiddleware.single("paySlip"),
  superAdminController.registerCompany
);

//________________________Routes for admin operations________________________
router.post(
  "/createUser",
  authenticatedMiddleware,
  uploadMiddleware.single("profileImage"),
  userController.createUser
);
router.post("/login", userController.login);
router.patch(
  "/updateUser",
  authenticatedMiddleware,
  uploadMiddleware.single("profileImage"),
  userController.updateUser
);
router.delete(
  "/deleteUser/:id",
  authenticatedMiddleware,
  userController.deleteUser
);
router.patch(
  "/resetPassword",
  authenticatedMiddleware,
  userController.resetPassword
);
router.get(
  "/getUser/:userId",
  authenticatedMiddleware,
  userController.getUserById
);
router.get("/getAllUser", authenticatedMiddleware, userController.getAllUser);

router.get("/me", authenticatedMiddleware, userController.getMe);

module.exports = router;

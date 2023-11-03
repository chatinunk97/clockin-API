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
router.post(
  "/createSuperAdmin",
  authenticatedMiddleware,
  uploadMiddleware.single("profileImage"),
  superAdminController.createSuperAdmin
);
router.patch(
  "/updateSuperAdmin",
  authenticatedMiddleware,
  uploadMiddleware.single("profileImage"),
  superAdminController.updateSuperAdmin
);
router.delete(
  "/deleteSuperAdmin/:id",
  authenticatedMiddleware,
  superAdminController.deleteSuperAdmin
);
router.post(
  "/loginSuperAdmin",
  authenticatedMiddleware,
  superAdminController.loginSuperAdmin
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
router.get("/me", authenticatedMiddleware, userController.getMe);
router.get("/:userId", authenticatedMiddleware, userController.getUserById);

router.delete(
  "/deleteUser/:id",
  authenticatedMiddleware,
  userController.deleteUser
);
router.get("/getAllUser", authenticatedMiddleware, userController.getAllUser);

module.exports = router;

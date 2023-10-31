const express = require("express");
const authUserController = require("../controller/userController");
const uploadMiddleware = require("../middleware/defaultMiddleware/upload");

const router = express.Router();

// Routes for user operations
router.post(
  "/",
  uploadMiddleware.single("profileImage"),
  authUserController.createUser
);
router.patch(
  "/updateUser",
  uploadMiddleware.single("profileImage"),
  authUserController.updateUser
);
router.get("/:userId", authUserController.getUserById);
router.delete("/:userId", authUserController.deleteUsers);
// Add more routes as needed...

module.exports = router;

const express = require("express");
const authUserController = require("../controller/authUserController");

const router = express.Router();

// Routes for user operations
router.post("/", authUserController.createUser);
// router.put("/:userId", authUserController.updateUser);
// router.get("/:userId", authUserController.getUserById);
router.delete("/:userId", authUserController.deleteUsers);
// Add more routes as needed...

module.exports = router;

const express = require('express');

//Middlewares
const uploadMiddleware = require('../middleware/defaultMiddleware/upload');
const adminController = require('../controller/adminController');

const router = express.Router();

router.post(
  '/createAdmin',
  uploadMiddleware.single('profileImage'),
  adminController.createAdmin
);
router.post('/loginAdmin', adminController.loginAdmin);
router.patch(
  '/updateAdmin',
  uploadMiddleware.single('profileImage'),
  adminController.updateAdmin
);
router.delete('/deleteAdmin/:id', adminController.deleteAdmin);

router.patch('/resetPasswordAdmin', adminController.resetPasswordAdmin);

module.exports = router;

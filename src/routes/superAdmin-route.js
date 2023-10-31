const express = require('express');

//Middlewares
const uploadMiddleware = require('../middleware/defaultMiddleware/upload');
const superAdminController = require('../controller/superAdminController');

const router = express.Router();

router.post('/createPackage', superAdminController.createPackage);
router.post(
  '/registerCompany',
  uploadMiddleware.single('paySlip'),
  superAdminController.registerCompany
);
router.post(
  '/createSuperAdmin',
  uploadMiddleware.single('profileImage'),
  superAdminController.createSuperAdmin
);
router.patch(
  '/updateSuperAdmin',
  uploadMiddleware.single('profileImage'),
  superAdminController.updateSuperAdmin
);
router.delete('/deleteSuperAdmin/:id', superAdminController.deleteSuperAdmin);
router.post('/loginSuperAdmin', superAdminController.loginSuperAdmin);

module.exports = router;

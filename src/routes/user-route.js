const express = require('express');

// Controller
const adminController = require('../controller/adminController');
const superAdminController = require('../controller/superAdminController');

// Middlewares
const uploadMiddleware = require('../middleware/defaultMiddleware/upload');
const authenticatedMiddleware = require('../middleware/authenticate/authenticate');

const router = express.Router();

//________________________Routes for super admin operations________________________
router.post(
  '/createPackage',
  authenticatedMiddleware,
  superAdminController.createPackage
);
router.post(
  '/registerCompany',
  authenticatedMiddleware,
  uploadMiddleware.single('paySlip'),
  superAdminController.registerCompany
);
router.post(
  '/createSuperAdmin',
  authenticatedMiddleware,
  uploadMiddleware.single('profileImage'),
  superAdminController.createSuperAdmin
);
router.patch(
  '/updateSuperAdmin',
  authenticatedMiddleware,
  uploadMiddleware.single('profileImage'),
  superAdminController.updateSuperAdmin
);
router.delete(
  '/deleteSuperAdmin/:id',
  authenticatedMiddleware,
  superAdminController.deleteSuperAdmin
);
router.post(
  '/loginSuperAdmin',
  authenticatedMiddleware,
  superAdminController.loginSuperAdmin
);

//________________________Routes for admin operations________________________
router.post(
  '/createUser',
  authenticatedMiddleware,
  uploadMiddleware.single('profileImage'),
  adminController.createUser
);
router.post('/login', adminController.login);
router.patch(
  '/updateUser',
  authenticatedMiddleware,
  uploadMiddleware.single('profileImage'),
  adminController.updateUser
);
router.delete('/deleteUserByAdmin/:id', adminController.deleteUserByAdmin);

module.exports = router;

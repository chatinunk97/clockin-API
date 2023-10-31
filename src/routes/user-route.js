const express = require('express');
// Controller
const userController = require('../controller/userController');
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

//________________________Routes for user operations________________________
router.post('/', userController.createUser);
// router.put("/:userId", authUserController.updateUser);
// router.get("/:userId", authUserController.getUserById);
router.delete('/:userId', userController.deleteUsers);
// Add more routes as needed...

module.exports = router;

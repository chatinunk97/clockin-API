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
module.exports = router;

const express = require('express');

//Middlewares
const uploadMiddleware = require('../middleware/defaultMiddleware/upload');
const authAdminController = require('../controller/authAdminController');

const router = express.Router();

router.post('/createPackage', authAdminController.createPackage);
router.post('/registerCompany', authAdminController.registerCompany);
router.post(
  '/createPayment',
  uploadMiddleware.single('paySlip'),
  authAdminController.createPayment
);

module.exports = router;

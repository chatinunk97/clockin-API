const prisma = require('../models/prisma');

exports.createPackage = async (req, res, next) => {
  try {
    const package = await prisma.package.create({
      data: req.body,
    });

    res.status(201).json({ message: 'Package was created', package });
  } catch (error) {
    next(error);
  }
};

exports.registerCompany = async (req, res, next) => {
  try {
    const company = await prisma.companyProfile.create({
      data: req.body,
      include: {
        package: true,
      },
    });

    res.status(201).json({ message: 'Company was created', company });
  } catch (error) {
    next(error);
  }
};

exports.createPayment = async (req, res, next) => {
  try {
    res.status(201).json({ message: 'Payment was created' });
  } catch (error) {
    next(error);
  }
};

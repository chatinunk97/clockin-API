const prisma = require("../models/prisma");
const { registerCompanySchema } = require("../validators/admin-validators");
const createError = require("../utils/create-error");
const { upload } = require("../utils/cloudinary");

exports.createPackage = async (req, res, next) => {
  try {
    const package = await prisma.package.create({
      data: req.body,
    });

    res.status(201).json({ message: "Package was created", package });
  } catch (error) {
    next(error);
  }
};

exports.registerCompany = async (req, res, next) => {
  try {
    const { value, error } = registerCompanySchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const company = await prisma.companyProfile.create({
      data: {
        companyName: value.companyName,
        packageId: value.packageId,
      },
    });

    const companyLocation = await prisma.companyLocation.create({
      data: {
        latitudeCompany: value.latitudeCompany,
        longitudeCompany: value.longitudeCompany,
        companyProfileId: company.id,
      },
    });

    res
      .status(201)
      .json({ message: "Company was created", company, companyLocation });
  } catch (error) {
    next(error);
  }
};

exports.createPayment = async (req, res, next) => {
  try {
    console.log(req.file);
    console.log(req.body);
    if (!req.file) {
      return next(createError("Pay slip is required"));
    }
    const url = await upload(req.file.path);

    const payment = await prisma.payment.create({
      data: {
        companyProfileId: req.body.id,
        paySlip: url,
      },
    });
    res.status(201).json({ message: "Payment was created", payment });
  } catch (error) {
    next(error);
  }
};

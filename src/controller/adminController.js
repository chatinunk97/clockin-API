const fs = require("fs/promises");
const prisma = require("../models/prisma");
const {
  registerCompanySchema,
  createAdminSchema,
  deleteAdminSchema,
} = require("../validators/admin-validators");
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
    if (!req.file) {
      return next(createError("Pay slip is required"));
    }

    const url = await upload(req.file.path);
    req.body.paySlip = url;

    console.log(req.body);
    const { value, error } = registerCompanySchema.validate(req.body);
    if (error) {
      return next(error);
    }
    console.log(value, "========================");

    const company = await prisma.companyProfile.create({
      data: {
        companyName: value.companyName,
        packageId: value.packageId,
        companyLocations: {
          create: {
            latitudeCompany: value.latitudeCompany,
            longitudeCompany: value.longitudeCompany,
          },
        },
        payment: {
          create: {
            paySlip: value.paySlip,
          },
        },
        user: {
          create: {
            employeeId: value.employeeId,
            firstName: value.firstName,
            lastName: value.lastName,
            email: value.email,
            mobile: value.mobile,
            password: value.password,
            position: "ADMIN",
          },
        },
      },
      include: {
        companyLocations: true,
        payment: true,
        user: true,
      },
    });

    res.status(201).json({
      message: "Company was created",
      company,
    });
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};

exports.createAdmin = async (req, res, next) => {
  try {
    if (req.file) {
      const url = await upload(req.file.path);
      req.body.profileImage = url;
    }
    const { value, error } = createAdminSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    value.position = "ADMIN";
    const admin = await prisma.user.create({
      data: value,
    });
    res.status(201).json({ message: "Good", admin });
  } catch (error) {
    next(error);
  }
};

exports.deleteAdmin = async (req, res, next) => {
  try {
    const { value, error } = deleteAdminSchema.validate(req.params);
    if (error) {
      return next(error);
    }

    const foundAdmin = await prisma.user.findFirst({
      where: {
        position: "ADMIN",
        id: value.id,
      },
    });

    await prisma.user.delete({
      where: {
        id: foundAdmin.id,
      },
    });

    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

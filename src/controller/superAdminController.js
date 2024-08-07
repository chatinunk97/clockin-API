const fs = require("fs/promises");
const bcrypt = require("bcrypt");

const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const {
  registerCompanySchema,
  idValidator,
} = require("../validators/superAdmin-validators");
const { upload } = require("../utils/cloudinary");
const { updatePaymentSchema } = require("../validators/user-validators");

exports.createPackage = async (req, res, next) => {
  try {
    if (req.user.position !== "SUPERADMIN") {
      return next(createError("You do not have permission to access", 403));
    }
    const package = await prisma.package.create({
      data: req.body,
    });

    res.status(201).json({ message: "Package was created", package });
  } catch (error) {
    next(error);
  }
};

exports.getallPackage = async (req, res, next) => {
  try {
    const packages = await prisma.package.findMany({
      select: {
        id: true,
        price: true,
        userCount: true,
        companyProfile: false,
      },
    });
    res.status(200).json({ packages });
  } catch (err) {
    next(err);
  }
};

exports.registerCompany = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);
    const foundUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { mobile: data.mobile }],
      },
    });
    if (foundUser) {
      if (foundUser.email === data.email) {
        return next(createError("This Email is already in use", 400));
      } else if (foundUser.mobile === data.mobile) {
        return next(createError("Phone number is already in use", 400));
      }
    }

    if (!req.file) {
      return next(createError("Pay slip is required", 400));
    }

    const url = await upload(req.file.path);
    data.paySlip = url;
    const { value, error } = registerCompanySchema.validate(data);
    if (error) {
      return next(error);
    }
    value.password = await bcrypt.hash(value.password, 10);
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
            packageId: value.packageId,
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
        leaveProfile: {
          createMany: {
            data: [
              {
                leaveName: "Annual Leave",
                defaultDateAmount: 0,
              },
              {
                leaveName: "Sick Leave",
                defaultDateAmount: 30,
              },
              {
                leaveName: "Business Leave",
                defaultDateAmount: 3,
              },
            ],
          },
        },
        timeProfile: {
          createMany: {
            data: [
              {
                start: "09:00",
                end: "17:00",
                typeTime: "DEFAULT",
              },
              {
                start: "09:00",
                end: "12:00",
                typeTime: "FIRSTHALF",
              },
              {
                start: "13:00",
                end: "17:00",
                typeTime: "SECONDHALF",
              },
            ],
          },
        },
      },
      include: {
        companyLocations: true,
        payment: true,
        leaveProfile: true,
        user: true,
        timeProfile: true,
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

exports.getAllCompanyProfile = async (req, res, next) => {
  try {
    if (req.user.position !== "SUPERADMIN") {
      return next(createError("You do not have permission to access", 403));
    }
    const companyProfiles = await prisma.companyProfile.findMany({
      include: {
        package: { select: { userCount: true } },
        payment: {
          where: {
            statusPayment: "PENDING",
          },
        },
      },
    });
    res.status(200).json({ companyProfiles });
  } catch (error) {
    next(error);
  }
};
exports.getCompanyById = async (req, res, next) => {
  try {
    if (req.user.position !== "SUPERADMIN") {
      return next(createError("You do not have permission to access", 403));
    }
    const { value, error } = idValidator.validate(req.params);
    if (error) {
      return next(error);
    }
    const companyProfiles = await prisma.companyProfile.findFirst({
      where: {
        id: value.id,
      },
      include: {
        package: { select: { userCount: true } },
        payment: {
          where: {
            statusPayment: "PENDING",
          },
        },
      },
    });
    res.status(200).json({ companyProfiles });
  } catch (error) {
    next(error);
  }
};

exports.getAllPayment = async (req, res, next) => {
  try {
    if (req.user.position !== "SUPERADMIN") {
      return next(createError("You do not have permission to access", 403));
    }
    const payments = await prisma.payment.findMany({
      where: {
        companyProfileId: req.body.companyProfileId,
      },
    });

    res.status(201).json({ payments });
  } catch (error) {
    next(error);
  }
};

exports.updatePayment = async (req, res, next) => {
  try {
    if (req.user.position !== "SUPERADMIN") {
      return next(createError("You do not have permission to access", 403));
    }

    const { value, error } = updatePaymentSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const foundPayment = await prisma.payment.findFirst({
      where: {
        id: req.body.id,
      },
    });
    if (!foundPayment) {
      return next(createError("Not found", 400));
    }
    if (foundPayment.statusPayment === "ACCEPT") {
      return next(createError("This payment is already accepted"));
    }

    const payment = await prisma.payment.update({
      where: {
        id: req.body.id,
      },
      data: value,
    });

    if (payment.statusPayment === "ACCEPT") {
      await prisma.companyProfile.update({
        where: {
          id: payment.companyProfileId,
        },
        data: {
          isActive: true,
        },
      });
    }

    res.status(200).json({ payment });
  } catch (error) {
    next(error);
  }
};

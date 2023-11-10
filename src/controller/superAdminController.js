const fs = require("fs/promises");
const bcrypt = require("bcrypt");

const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const {
  registerCompanySchema,
} = require("../validators/superAdmin-validators");
const { upload } = require("../utils/cloudinary");

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
    console.log(data);
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
      },
      include: {
        companyLocations: true,
        payment: true,
        leaveProfile: true,
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

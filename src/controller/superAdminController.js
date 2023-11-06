const fs = require('fs/promises');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const prisma = require('../models/prisma');
const createError = require('../utils/create-error');
const {
  registerCompanySchema,
  createSuperAdminSchema,
  updateSuperAdminSchema,
  deleteSuperAdminSchema,
  loginSuperAdminSchema,
} = require('../validators/superAdmin-validators');
const { upload } = require('../utils/cloudinary');

exports.createPackage = async (req, res, next) => {
  try {
    if (req.user.position !== 'SUPERADMIN') {
      return next(createError('You do not have permission to access', 403));
    }
    const package = await prisma.package.create({
      data: req.body,
    });

    res.status(201).json({ message: 'Package was created', package });
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
    if (!req.file) {
      return next(createError('Pay slip is required', 400));
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
            position: 'ADMIN',
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

    const leaveProfile = await prisma.leaveProfile.createMany({
      data: [
        {
          leaveName: 'Annual Leave',

          defaultDateAmount: 0,
          companyProfileId: company.id,
        },
        {
          leaveName: 'Sick Leave',
          defaultDateAmount: 30,
          companyProfileId: company.id,
        },
        {
          leaveName: 'Business Leave',
          defaultDateAmount: 3,
          companyProfileId: company.id,
        },
      ],
    });

    res.status(201).json({
      message: 'Company was created',
      company,
      leaveProfile,
    });
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};

exports.createSuperAdmin = async (req, res, next) => {
  try {
    if (req.user.position !== 'SUPERADMIN') {
      return next(createError('You do not have permission to access', 403));
    }

    if (req.file) {
      const url = await upload(req.file.path);
      req.body.profileImage = url;
    }
    const { value, error } = createSuperAdminSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    value.password = await bcrypt.hash(value.password, 14);
    value.position = 'SUPERADMIN';
    const superAdmin = await prisma.user.create({
      data: value,
    });

    const payload = { superAdminId: superAdmin.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || 'CATBORNTOBEGOD'
    );

    delete superAdmin.password;
    res
      .status(201)
      .json({ message: 'Super admin was created', superAdmin, accessToken });
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};

exports.deleteSuperAdmin = async (req, res, next) => {
  try {
    if (req.user.position !== 'SUPERADMIN') {
      return next(createError('You do not have permission to access', 403));
    }

    const { value, error } = deleteSuperAdminSchema.validate(req.params);
    if (error) {
      return next(error);
    }

    const foundSuperAdmin = await prisma.user.findFirst({
      where: {
        position: 'SUPERADMIN',
        id: value.id,
      },
    });

    await prisma.user.delete({
      where: {
        id: foundSuperAdmin.id,
      },
    });

    res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};

exports.loginSuperAdmin = async (req, res, next) => {
  try {
    // if (req.user.position !== 'SUPERADMIN') {
    //   return next(createError('You do not have permission to access', 403));
    // }

    const { value, error } = loginSuperAdminSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const superAdmin = await prisma.user.findFirst({
      where: {
        position: 'SUPERADMIN',
        email: value.email,
      },
    });
    if (!superAdmin) {
      return next(createError('Somethings went wrong, please try again', 400));
    }

    const isMatch = await bcrypt.compare(value.password, superAdmin.password);
    if (!isMatch) {
      return next(createError('Somethings went wrong, please try again', 400));
    }

    const payload = {
      superAdminId: superAdmin.id,
      position: superAdmin.position,
    };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || 'CATBORNTOBEGOD'
    );

    superAdmin.accessToken = accessToken;
    delete superAdmin.password;

    res.status(200).json({ superAdmin });
  } catch (error) {
    next(error);
  }
};

exports.updateSuperAdmin = async (req, res, next) => {
  console.log('req.user', req.user);
  try {
    if (req.user.position !== 'SUPERADMIN') {
      return next(createError('You do not have permission to access', 403));
    }

    const foundSuperAdmin = await prisma.user.findFirst({
      where: {
        position: 'SUPERADMIN',
        id: +req.body.id,
      },
    });

    if (!foundSuperAdmin) {
      return next(createError('Super admin is not exists', 400));
    }

    if (req.file) {
      const url = await upload(req.file.path);
      req.body.profileImage = url;
    }

    const { value, error } = updateSuperAdminSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const superAdmin = await prisma.user.update({
      data: value,
      where: {
        id: value.id,
      },
    });

    res.status(200).json({ message: 'Super admin was updated', superAdmin });
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};

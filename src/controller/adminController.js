const fs = require('fs/promises');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../models/prisma');
const {
  registerCompanySchema,
  createAdminSchema,
  deleteAdminSchema,
  loginAdminSchema,
  updateAdminSchema,
} = require('../validators/admin-validators');
const createError = require('../utils/create-error');
const { upload } = require('../utils/cloudinary');

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
    if (!req.file) {
      return next(createError('Pay slip is required'));
    }

    const url = await upload(req.file.path);
    req.body.paySlip = url;

    console.log(req.body);
    const { value, error } = registerCompanySchema.validate(req.body);
    if (error) {
      return next(error);
    }

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
        user: true,
      },
    });

    res.status(201).json({
      message: 'Company was created',
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

    value.password = await bcrypt.hash(value.password, 14);
    value.position = 'ADMIN';
    const admin = await prisma.user.create({
      data: value,
    });

    const payload = { adminId: admin.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || 'CATBORNTOBEGOD'
    );

    delete admin.password;
    res.status(201).json({ message: 'Admin was created', admin, accessToken });
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
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
        position: 'ADMIN',
        id: value.id,
      },
    });

    await prisma.user.delete({
      where: {
        id: foundAdmin.id,
      },
    });

    res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};

exports.loginAdmin = async (req, res, next) => {
  try {
    const { value, error } = loginAdminSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const admin = await prisma.user.findFirst({
      where: {
        position: 'ADMIN',
        email: value.email,
      },
    });
    if (!admin) {
      return next(createError('Somethings went wrong, please try again', 400));
    }

    const isMatch = await bcrypt.compare(value.password, foundAdmin.password);
    if (!isMatch) {
      return next(createError('Somethings went wrong, please try again', 400));
    }

    const payload = { adminId: foundAdmin.id, position: foundAdmin.position };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || 'CATBORNTOBEGOD'
    );

    admin.accessToken = accessToken;
    delete admin.password;

    res.status(200).json({ admin });
  } catch (error) {
    next(error);
  }
};

exports.updateAdmin = async (req, res, next) => {
  try {
    const foundAdmin = await prisma.user.findFirst({
      where: {
        position: 'ADMIN',
        id: +req.body.id,
      },
    });

    if (!foundAdmin) {
      return next(createError('Admin is not exists'));
    }
    console.log(req.file);
    if (req.file) {
      const url = await upload(req.file.path);
      foundAdmin.profileImage = url;
    }
    console.log(foundAdmin, '+++++++++++foundAdmin+++++++++++++');
    const { value, error } = updateAdminSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    if (value.password) {
      admin.password = await bcrypt.hash(value.password, 14);
    }
    console.log(value, '----------value-------------');
    const admin = await prisma.user.update({
      data: value,
      where: {
        id: value.id,
      },
    });

    console.log(admin);
    res.status(200).json({ message: 'Admin was updated', admin });
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};

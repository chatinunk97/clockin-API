const fs = require('fs/promises');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../models/prisma');
const {
  createAdminSchema,
  deleteAdminSchema,
  loginAdminSchema,
  updateAdminSchema,
} = require('../validators/admin-validators');
const createError = require('../utils/create-error');
const { upload } = require('../utils/cloudinary');

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
      return next(createError('Admin is not exists', 400));
    }

    if (req.file) {
      const url = await upload(req.file.path);
      req.body.profileImage = url;
    }

    const { value, error } = updateAdminSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const admin = await prisma.user.update({
      data: value,
      where: {
        id: value.id,
      },
    });

    res.status(200).json({ message: 'Admin was updated', admin });
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};

exports.resetPasswordAdmin = async (req, res, next) => {
  try {
    const foundAdmin = await prisma.user.findFirst({
      where: {
        position: 'ADMIN',
        id: +req.body.id,
      },
    });

    if (!foundAdmin) {
      return next(createError('Admin is not exists', 400));
    }
    res.status(200).json({ message: 'dfsdghfddfs' });
  } catch (error) {
    next(error);
  }
};

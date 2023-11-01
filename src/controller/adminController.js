const fs = require('fs/promises');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../models/prisma');
const {
  loginSchema,
  createUserSchemaByAdmin,
  createUserSchemaByHR,
  updateUserSchemaByHR,
  updateUserSchemaByAdmin,
  deleteAdminSchema,
  updateUserSchema,
} = require('../validators/admin-validators');
const createError = require('../utils/create-error');
const { upload } = require('../utils/cloudinary');

exports.createUser = async (req, res, next) => {
  try {
    let validate;
    if (req.user.position === 'ADMIN') {
      validate = createUserSchemaByAdmin.validate(req.body);
    } else if (req.user.position === 'HR') {
      validate = createUserSchemaByHR.validate(req.body);
    } else {
      return next(createError('You do not have permission to access', 403));
    }

    if (req.file) {
      const url = await upload(req.file.path);
      validate.value.profileImage = url;
    }

    if (validate.error) {
      return next(validate.error);
    }

    validate.value.password = await bcrypt.hash(validate.value.password, 14);
    const user = await prisma.user.create({
      data: validate.value,
    });

    const payload = { userId: user.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || 'CATBORNTOBEGOD'
    );

    user.accessToken = accessToken;
    delete user.password;

    res.status(201).json({ message: 'User was created', user });
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};

exports.deleteUserByAdmin = async (req, res, next) => {
  try {
    if (req.body.role !== 'ADMIN') {
      return next(createError('You do not have permission to access', 403));
    }

    const { value, error } = deleteAdminSchema.validate(req.params);
    if (error) {
      return next(error);
    }

    const foundUser = await prisma.user.findFirst({
      where: {
        id: value.id,
      },
    });

    if (foundUser === req.user.id) {
      return next(createError('You can not delete your own account', 403));
    }

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

exports.login = async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const user = await prisma.user.findFirst({
      where: {
        email: value.email,
      },
    });
    if (!user) {
      return next(createError('Somethings went wrong, please try again', 400));
    }
    const isMatch = await bcrypt.compare(value.password, user.password);
    if (!isMatch) {
      return next(createError('Somethings went wrong, please try again', 400));
    }

    const payload = { userId: user.id, position: user.position };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || 'CATBORNTOBEGOD'
    );

    user.accessToken = accessToken;
    delete user.password;

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const foundUser = await prisma.user.findFirst({
      where: {
        id: +req.body.id,
      },
    });

    if (!foundUser) {
      return next(createError('User is not exists', 400));
    }
    console.log(foundUser, '+++++++++++++foundUser++++++++++++++++');
    console.log(req.body, '______________req.body________________');
    if (req.file) {
      const url = await upload(req.file.path);
      req.body.profileImage = url;
    }

    let validate;
    if (req.user.position === 'ADMIN') {
      validate = updateUserSchemaByAdmin.validate(req.body);
    } else if (req.user.position === 'HR' && req.body.position !== 'HR') {
      console.log('first');
      validate = updateUserSchemaByHR.validate(req.body);
    } else if (
      req.user.position === 'HR' &&
      req.body.position === 'HR' &&
      req.user.id === req.body.id
    ) {
      console.log('second');
      validate = updateUserSchemaByHR.validate(req.body);
    } else if (req.user.id === req.body.id) {
      validate = updateUserSchema.validate(req.body);
    } else {
      return next(createError('You do not have permission to access', 403));
    }

    if (validate.error) {
      return next(validate.error);
    }

    const user = await prisma.user.update({
      data: validate.value,
      where: {
        id: validate.value.id,
      },
    });

    delete user.password;

    res.status(200).json({ message: 'User was updated', user });
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await prisma.user.findMany({
      where: { id: +req.params.userId },
    });

    if (!user || user.length === 0) {
      throw createError(404, 'User not found');
    }
    console.log(user);
    res.status(200).json({ message: 'Get user', user: user });
  } catch (error) {
    next(error);
  }
};

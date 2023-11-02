const fs = require("fs/promises");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const prisma = require("../models/prisma");
const {
  loginSchema,
  createUserSchemaByAdmin,
  createUserSchemaByHR,
  updateUserSchemaByHR,
  updateUserSchemaByAdmin,
  updateUserSchema,
  deleteUserSchema,
} = require("../validators/user-validators");
const createError = require("../utils/create-error");
const { upload } = require("../utils/cloudinary");

exports.createUser = async (req, res, next) => {
  try {
    let validate;
    if (req.user.position === "ADMIN") {
      validate = createUserSchemaByAdmin.validate(req.body);
    } else if (req.user.position === "HR") {
      validate = createUserSchemaByHR.validate(req.body);
    } else {
      return next(createError("You do not have permission to access", 403));
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
      process.env.JWT_SECRET_KEY || "CATBORNTOBEGOD"
    );

    user.accessToken = accessToken;
    delete user.password;

    res.status(201).json({ message: "User was created", user });
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};

exports.deleteUser = async (req, res, next) => {
  console.log(req.user);
  try {
    if (req.user.position === "USER" || req.user.position === "MANAGER") {
      return next(createError("You do not have permission to access", 403));
    }

    const { value, error } = deleteUserSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    const foundUser = await prisma.user.findUnique({
      where: {
        id: value.id,
      },
    });
    if (!foundUser) {
      return next(createError("User not found", 400));
    }
    if (req.user.position === "ADMIN") {
      if (foundUser.position === req.user.position) {
        return next(createError("Can not change same position", 400));
      }
    }

    if (req.user.position === "HR") {
      if (
        foundUser.position === req.user.position ||
        foundUser.position === "ADMIN"
      ) {
        return next(createError("Can not change same position", 400));
      }
    }
    await prisma.user.update({
      data: {
        isActive: false,
      },
      where: {
        id: foundUser.id,
      },
    });
    res.status(200).json({ message: "Successfully" });
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
      return next(createError("Invalid credentials", 400));
    }
    const isMatch = await bcrypt.compare(value.password, user.password);
    if (!isMatch) {
      return next(createError("Invalid credentials", 400));
    }

    const payload = { userId: user.id, position: user.position };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "CATBORNTOBEGOD"
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
      return next(createError("User is not exists", 400));
    }

    if (req.file) {
      const url = await upload(req.file.path);
      foundUser.profileImage = url;
    }

    delete foundUser.createdAt;
    delete foundUser.updatedAt;
    delete foundUser.password;

    let validate;
    if (req.user.position === "ADMIN") {
      validate = updateUserSchemaByAdmin.validate(foundUser);
    } else if (req.user.position === "HR" && foundUser.position !== "HR") {
      console.log("first");
      validate = updateUserSchemaByHR.validate(foundUser);
    } else if (
      req.user.position === "HR" &&
      foundUser.position === "HR" &&
      req.user.id === foundUser.id
    ) {
      console.log("second");
      validate = updateUserSchemaByHR.validate(foundUser);
    } else if (req.user.id === foundUser.id) {
      validate = updateUserSchema.validate(foundUser);
    } else {
      return next(createError("You do not have permission to access", 403));
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

    res.status(200).json({ message: "User was updated", user });
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
      throw createError(404, "User not found");
    }
    console.log(user);
    res.status(200).json({ message: "Get user", user: user });
  } catch (error) {
    next(error);
  }
};

exports.getMe = (req, res) => {
  res.status(200).json({ user: req.user });
};

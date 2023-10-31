const fs = require("fs/promises");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");
const {
  createUserSchema,
  updateUserSchema,
} = require("../validators/user-validator.js");
const createError = require("../utils/create-error");
const { upload } = require("../utils/cloudinary");

exports.createUser = async (req, res, next) => {
  try {
    console.log(req.file);
    console.log(req.body);
    if (req.file) {
      const url = await upload(req.file.path);
      console.log(url);
      req.body.profileImage = url;
    }
    const { error, value } = createUserSchema.validate(req.body);

    if (error) {
      throw createError(400, error.message);
    }

    const hashedPassword = await bcrypt.hash(value.password, 10);
    const newUser = await prisma.user.create({
      data: {
        ...value,
        password: hashedPassword,
      },
    });

    const token = generateAuthToken(newUser);

    res.status(201).json({
      user: newUser,
      token,
    });
  } catch (error) {
    next(error);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    if (req.file) {
      const url = await upload(req.file.path);
      req.body.profileImage = url;
    }

    const { value, error } = updateUserSchema.validate(req.body);

    if (error) {
      throw next(error);
    }
    const updateUser = await prisma.user.update({
      where: { id: value.id },
      data: value,
    });

    res.status(201).json({ message: "Update User SUCCESS", updateUser });
  } catch (err) {
    console.log("####");
    next(err);
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

exports.deleteUsers = async (req, res, next) => {
  try {
    const userId = await prisma.user.findFirst({
      where: {
        id: +req.params.userId,
      },
    });

    // if (userId !== req.user.Id) {
    //   return next(
    //     createError("You can only delete your own user account", 403)
    //   );
    // }

    if (!userId) {
      return next(createError("user is not exist", 404));
    }
    console.log(userId);
    const deletedUser = await prisma.user.delete({
      where: {
        id: +req.params.userId,
      },
    });

    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    next(error);
  }
};

function generateAuthToken(user) {
  const token = jwt.sign({ userId: user.id }, "your-secret-key", {
    expiresIn: "1h",
  });
  return token;
}

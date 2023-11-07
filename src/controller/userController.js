const fs = require("fs/promises");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const prisma = require("../models/prisma");
const nodemailerSender = require("../config/nodemailer");
const {
  loginSchema,
  createUserSchemaByAdmin,
  createUserSchemaByHR,
  updateUserSchemaByHR,
  updateUserSchemaByAdmin,
  updateUserSchema,
  deleteUserSchema,
  resetPasswordSchema,
} = require("../validators/user-validators");
const createError = require("../utils/create-error");
const { upload } = require("../utils/cloudinary");
const { nanoid } = require("nanoid");

exports.createUser = async (req, res, next) => {
  try {
    let validate;
    const data = JSON.parse(req.body.data);
    if (req.file) {
      const url = await upload(req.file.path);
      data.profileImage = url;
    }
    const alphabet =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    data.password = nanoid(10, alphabet);
    console.log(data.password);
    if (req.user.position === "ADMIN") {
      validate = createUserSchemaByAdmin.validate(data);
    } else if (req.user.position === "HR") {
      validate = createUserSchemaByHR.validate(data);
    } else {
      return next(createError("You do not have permission to access", 403));
    }

    if (validate.error) {
      return next(validate.error);
    }

    const foundLeaveProfiles = await prisma.leaveProfile.findMany({
      where: {
        companyProfileId: req.user.companyProfileId,
      },
    });

    const newLeaveProfiles = foundLeaveProfiles.map((item) => ({
      leaveProfileId: item.id,
      dateAmount: item.defaultDateAmount,
    }));

    validate.value.password = await bcrypt.hash(validate.value.password, 14);

    const user = await prisma.user.create({
      data: {
        profileImage: validate.value.profileImage,
        employeeId: validate.value.employeeId,
        firstName: validate.value.firstName,
        lastName: validate.value.lastName,
        email: validate.value.email,
        mobile: validate.value.mobile,
        password: validate.value.password,
        position: validate.value.position,
        companyProfileId: req.user.companyProfileId,
        userType: validate.value.userType,
        isActive: validate.value.isActive,
        checkLocation: validate.value.checkLocation,
        userRelationshipUser: {
          create: {
            userBossId: validate.value.userBossId,
          },
        },
        userLeave: {
          createMany: {
            data: newLeaveProfiles,
          },
        },
      },

      include: {
        userRelationshipBoss: true,
        userRelationshipUser: true,
        userLeave: true,
      },
    });

    const payload = { userId: user.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "CATBORNTOBEGOD",
      { expiresIn: "1h" }
    );

    user.accessToken = accessToken;
    nodemailerSender(user.email, accessToken);
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
    const { loginType } = req.body;
    delete req.body.loginType;
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
    if (loginType === "dashboard" && user.position === "USER") {
      return next(createError("You do not have permission", 400));
    }
    const payload = { userId: user.id, position: user.position };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "CATBORNTOBEGOD"
    );
    if (loginType === "dashboard") {
      user.accessToken_db = accessToken;
    } else {
      user.accessToken = accessToken;
    }

    delete user.password;

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);
    const foundUser = await prisma.user.findFirst({
      where: {
        id: +data.id,
      },
    });

    if (!foundUser) {
      return next(createError("User is not exists", 400));
    }

    const foundRelationship = await prisma.userRelationship.findFirst({
      where: { userId: +data.id },
    });
    console.log(foundRelationship, "=============================");
    if (req.file) {
      const url = await upload(req.file.path);
      data.profileImage = url;
    }
    console.log(data, "=============================");
    let validate;
    if (req.user.position === "ADMIN") {
      validate = updateUserSchemaByAdmin.validate(data);
    } else if (req.user.position === "HR" && foundUser.position !== "HR") {
      validate = updateUserSchemaByHR.validate(data);
    } else if (
      req.user.position === "HR" &&
      foundUser.position === "HR" &&
      req.user.id === foundUser.id
    ) {
      validate = updateUserSchemaByHR.validate(data);
    } else {
      return next(createError("You do not have permission to access", 403));
    }

    if (validate.error) {
      return next(validate.error);
    }
    console.log(validate.value, "=============================");

    const user = await prisma.user.update({
      where: { id: validate.value.id },
      data: {
        profileImage: validate.value.profileImage,
        employeeId: validate.value.employeeId,
        firstName: validate.value.firstName,
        lastName: validate.value.lastName,
        email: validate.value.email,
        mobile: validate.value.mobile,
        position: validate.value.position,
        companyProfileId: req.user.companyProfileId,
        userType: validate.value.userType,
        isActive: validate.value.isActive,
        checkLocation: validate.value.checkLocation,
        userRelationshipUser: {
          update: {
            where: { id: foundRelationship.id },
            data: {
              userBossId: validate.value.userBossId,
            },
          },
        },
      },
      include: {
        userRelationshipUser: true,
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
    const user = await prisma.user.findUnique({
      where: { id: +req.params.userId },
      include: { clock: true },
    });

    if (!user || user.length === 0) {
      throw createError(404, "User not found");
    }

    delete user.password;
    res.status(200).json({ message: "Get user", user: user });
  } catch (error) {
    next(error);
  }
};

exports.getAllUser = async (req, res, next) => {
  try {
    const allUser = await prisma.user.findMany({
      where: {
        companyProfileId: +req.user.companyProfileId,
      },
      select: {
        id: true,
        profileImage: true,
        employeeId: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        position: true,
        userType: true,
        isActive: true,
        checkLocation: true,
        companyProfileId: true,
      },
      include: {
        userRelationshipBoss: {
          select: {
            userBossId: true,
            user: true,
          },
        },
      },
      orderBy: {
        isActive: "desc",
      },
    });

    res.status(200).json({ allUser });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { value, error } = resetPasswordSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    value.password = await bcrypt.hash(value.password, 14);
    await prisma.user.update({
      data: {
        password: value.password,
      },
      where: { id: req.user.id },
    });

    res.status(200).json({ message: "Password was reset" });
  } catch (error) {
    next(error);
  }
};

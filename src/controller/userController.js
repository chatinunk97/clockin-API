const fs = require("fs/promises");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const prisma = require("../models/prisma");
const nodemailerSender = require("../config/nodemailer");
const {
  createUserSchemaByAdmin,
  createUserSchemaByHR,
  updateUserSchemaByHR,
  updateUserSchemaByAdmin,
  deleteUserSchema,
  resetPasswordSchema,
  loginSchema,
  paymentSchema,
} = require("../validators/user-validators");
const createError = require("../utils/create-error");
const { upload } = require("../utils/cloudinary");
const { nanoid } = require("nanoid");

exports.createUser = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);
    if (!data.userBossId) {
      console.log("############################ NO USER BOSS ID FOUND");
      const adminId = await prisma.user.findFirst({
        where: {
          position: "ADMIN",
          companyProfileId: req.user.companyProfileId,
        },
      });
      data.userBossId = adminId.id;
    }

    delete data.no;
    delete data.result;
    delete data.error;
    delete data.loading;
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

    let validate;
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
    console.log(req.body);
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
      include: {
        companyProfile: {
          select: { isActive: true },
        },
      },
    });
    if (!user) {
      return next(createError("Invalid credentials", 400));
    }
    if (!user.companyProfile.isActive) {
      return next(
        createError(
          "Your company account is not Active, please contact your admin",
          403
        )
      );
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

    if (req.file) {
      const url = await upload(req.file.path);
      data.profileImage = url;
    }

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
      include: {
        clock: true,
        // userRelationshipBoss: ,
        userRelationshipUser: {
          select: {
            userBossId: true,
          },
        },
      },
    });

    if (!user || user.length === 0) {
      throw createError(404, "User not found");
    }
    console.log(user);

    delete user.password;
    const userBossId = user.userRelationshipUser[0].userBossId;
    const bossInfo = await prisma.user.findUnique({
      where: { id: userBossId },
    });
    delete bossInfo.password;
    res.status(200).json({ message: "Get user", user, bossInfo });
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
        userRelationshipUser: true,
        companyProfile: {
          select: {
            companyName: true,
          },
        },
      },
      orderBy: {
        isActive: "desc",
      },
    });

    for (const user of allUser) {
      if (user.userRelationshipUser.length > 0) {
        const userBossId = user.userRelationshipUser[0].userBossId; // Assuming one boss for simplicity
        const boss = await prisma.user.findUnique({
          where: { id: userBossId },
          select: {
            firstName: true,
            lastName: true,
          },
        });
        delete boss.password;
        user.bossInfo = boss; // Add bossInfo to the user object
      }
    }

    res.status(200).json({ allUser });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  console.log(req.user);
  try {
    const user = req.user;
    const company = await prisma.companyProfile.findFirst({
      where: {
        id: req.user.companyProfileId,
      },
      include: { companyLocations: true },
    });
    user.companyProfile = company;
    res.status(200).json({ user });
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

exports.getPosition = async (req, res, next) => {
  try {
    const allUser = await prisma.user.findMany({
      where: {
        companyProfileId: +req.user.companyProfileId,
      },
      select: {
        userType: true,
        isActive: true,
      },
    });

    // สร้างออบเจกต์เพื่อเก็บผลรวมของ userType แต่ละชนิด
    const userTypeTotals = {};
    let totalUserCount = 0;

    // นับ userType แต่ละชนิดและเพิ่มผลรวม
    allUser.forEach((user) => {
      const userType = user.userType;
      if (userType in userTypeTotals) {
        userTypeTotals[userType]++;
      } else {
        userTypeTotals[userType] = 1;
      }
      totalUserCount++;
    });

    res.status(200).json({ userTypeTotals, totalUserCount });
  } catch (error) {
    next(error);
  }
};

exports.payment = async (req, res, next) => {
  try {
    if (req.user.position !== "ADMIN") {
      return next(createError("You do not have permission to access", 403));
    }
    const data = JSON.parse(req.body.data);

    const { value, error } = paymentSchema.validate(data);

    if (error) {
      return next(error);
    }

    if (!req.file) {
      return next(createError("Pay slip is required", 400));
    }

    const url = await upload(req.file.path);
    value.paySlip = url;

    const company = await prisma.companyProfile.update({
      where: {
        id: req.user.companyProfileId,
      },
      data: {
        packageId: value.packageId,
        payment: {
          create: {
            paySlip: value.paySlip,
            packageId: value.packageId,
          },
        },
      },
      include: {
        payment: true,
        package: true,
      },
    });

    res.status(201).json({ company });
  } catch (error) {
    next(error);
  }
};

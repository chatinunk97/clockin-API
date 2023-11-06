const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const {
  createRequestLeaveSchema,
  createUserLeaveSchema,
  updateUserLeaveSchema,
  deleteUserLeaveSchema,
  createLeaveProfileSchema,
  updateRequestSchema,
  deleteRequestsSchema,
  deleteLeaveProfile,
  updateLeaveProfileSchema,
  getRequestLeaveByIdSchema,
} = require("../validators/leave-validators");

// ########## request leave ##########
exports.createRequestLeave = async (req, res, next) => {
  try {
    const { value, error } = createRequestLeaveSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const requestLeave = await prisma.requestLeave.create({
      data: value,
    });

    res.status(201).json({ requestLeave });
  } catch (error) {
    next(error);
  }
};

exports.getRequestLeaveById = async (req, res, next) => {
  try {
    const { value, error } = getRequestLeaveByIdSchema.validate(req.params);

    if (error) {
      error.statusCode = 400;
      return next(error);
    }

    const requestLeave = await prisma.requestLeave.findUnique({
      where: {
        id: value.requestLeaveId,
      },
    });
    res.status(200).json({ requestLeave });
  } catch (error) {
    next(error);
  }
};

exports.getAllRequestLeaves = async (req, res, next) => {
  try {
    const requestLeaves = await prisma.requestLeave.findMany({
      where: {
        userLeave: {
          user: {
            userRelationshipBoss: {
              every: {
                userBossId: req.user.id,
              },
            },
          },
        },
      },
      include: {
        userLeave: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(200).json({ requestLeaves });
  } catch (error) {
    next(error);
  }
};

exports.updateRequestLeave = async (req, res, next) => {
  try {
    const { value, error } = updateRequestSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const found = await prisma.requestLeave.findFirst({
      where: { userLeaveId: +value.userLeaveId },
    });

    if (!found) {
      return next(createError("Request leave not found"));
    }

    const requestLeave = await prisma.requestLeave.update({
      data: value,
      where: {
        id: found.id,
      },
    });

    console.log(requestLeave);

    requestLeave.startDate;
    if (requestLeave.statusRequest === "ACCEPT") {
      await prisma.userLeave.update({
        where: { id: requestLeave.userLeaveId },
        data: {
          dateAmount: {
            decrement,
          },
        },
      });
    } else if (
      requestLeave.statusRequest === "ACCEPT" &&
      requestLeave.halfDate === true
    ) {
      await prisma.flexibleTime.create({
        data: {},
      });
    }

    res.status(200).json({ requestLeave });
  } catch (error) {
    next(error);
  }
};

exports.deleteLeaveRequests = async (req, res, next) => {
  try {
    const { value, error } = deleteRequestsSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    await prisma.requestLeave.delete({
      where: {
        id: value.leaveRequestId,
      },
    });
    res.status(200).json({ message: "Request Leave was deleted" });
  } catch (error) {
    next(error);
  }
};

// ########## user leave ##########

exports.createUserLeave = async (req, res, next) => {
  try {
    if (!(req.user.position == "ADMIN" || req.user.position == "HR")) {
      return next(createError("You do not have permission to access", 403));
    }
    const { value, error } = createUserLeaveSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const userLeave = await prisma.userLeave.create({
      data: {
        dateAmount: value.dateAmount,
        user: { connect: { id: value.userId } },
        leaveProfile: { connect: { id: value.leaveProfileId } },
      },
    });
    res.status(200).json({ userLeave });
  } catch (error) {
    next(error);
  }
};

exports.updateUserLeave = async (req, res, next) => {
  try {
    if (!(req.user.position == "ADMIN" || req.user.position == "HR")) {
      return next(createError("You do not have permission to access", 403));
    }

    const { value, error } = updateUserLeaveSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const userLeave = await prisma.userLeave.update({
      data: {
        dateAmount: value.dateAmount,
        user: { connect: { id: value.userId } },
        leaveProfile: { connect: { id: value.leaveProfileId } },
      },
      where: {
        id: +req.params.userLeaveId,
      },
    });
    res.status(200).json({ userLeave });
  } catch (error) {
    next(error);
  }
};

exports.deleteUserLeave = async (req, res, next) => {
  try {
    if (!(req.user.position == "ADMIN" || req.user.position == "HR")) {
      return next(createError("You do not have permission to access", 403));
    }

    const { value, error } = deleteUserLeaveSchema.validate(req.params);
    console.log("value", value);

    if (error) {
      return next(error);
    }

    const foundRequestLeave = await prisma.requestLeave.findFirst({
      where: { userLeaveId: +value.userLeaveId },
    });

    if (foundRequestLeave) {
      return next(createError("userLeaveId has request leave", 400));
    }

    if (foundRequestLeave === null) {
      await prisma.userLeave.delete({
        where: {
          id: value.userLeaveId,
        },
      });
    }

    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

// ########## leave profile ##########
exports.createLeaveProfile = async (req, res, next) => {
  try {
    if (req.user.position !== "ADMIN") {
      return next(createError("You do not have permission to access", 403));
    }

    req.body.companyProfileId = req.user.companyProfileId;

    const { value, error } = createLeaveProfileSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const leaveProfile = await prisma.leaveProfile.create({
      data: value,
    });
    res.status(201).json({ leaveProfile });
  } catch (error) {
    next(error);
  }
};

exports.getAllLeaveProfile = async (req, res, next) => {
  try {
    if (req.user.position !== "ADMIN") {
      return next(createError("You do not have permission to access", 403));
    }
    const allLeaveProfile = await prisma.leaveProfile.findMany({
      where: {
        companyProfileId: req.user.companyProfileId,
      },
    });
    res
      .status(200)
      .json({ message: "Get all leave profiles", allLeaveProfile });
  } catch (error) {
    next(error);
  }
};

exports.deleteLeaveProfile = async (req, res, next) => {
  try {
    if (req.user.position !== "ADMIN") {
      return next(createError("You do not have permission to access", 403));
    }
    // Validate request parameters
    const { error } = deleteLeaveProfile.validate(req.params);
    if (error) {
      return next(error);
    }

    // Find the leave profile record to check its existence
    const foundLeaveProfile = await prisma.leaveProfile.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    // Check if the leave profile record exists
    if (!foundLeaveProfile) {
      throw createError("Leave profile not found", 404);
    }

    // Delete the leave profile record
    await prisma.leaveProfile.delete({
      where: {
        id: +req.params.id,
      },
    });

    res.status(200).json({ message: "Leave profile deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.updateLeaveProfile = async (req, res, next) => {
  try {
    if (req.user.position !== "ADMIN") {
      return next(createError("You do not have permission to access", 403));
    }

    const { value, error } = updateLeaveProfileSchema.validate(req.body);

    if (error) {
      return next(createError(error.details[0].message, 400));
    }

    const updateLeaveProfile = await prisma.leaveProfile.update({
      where: {
        id: +req.params.id, // Assuming the URL parameter is named timeProfileId
      },
      data: value,
    });
    res
      .status(200)
      .json({ message: "LeaveProfile was updated", updateLeaveProfile });
  } catch (error) {
    next(error);
  }
};

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
      where: { id: +value.id },
    });

    if (!found) {
      return next(createError("Request leave not found"));
    }

    const requestLeave = await prisma.requestLeave.update({
      data: value,
      where: {
        id: +value.id,
      },
    });

    console.log(requestLeave);
    if (
      requestLeave.statusRequest === "ACCEPT" &&
      requestLeave.halfDate === true
    ) {
      const startDate = new Date(requestLeave.startDate);
      const endDate = new Date(requestLeave.endDate);

      const dateAmount = (endDate - startDate) / (1000 * 60 * 60 * 24);
    } else if (requestLeave.statusRequest === "ACCEPT") {
      const startDate = new Date(requestLeave.startDate);
      const endDate = new Date(requestLeave.endDate);

      const dateAmount = (endDate - startDate) / (1000 * 60 * 60 * 24);
      const newUserLeave = await prisma.userLeave.update({
        where: { id: requestLeave.userLeaveId },
        data: {
          dateAmount: {
            decrement: dateAmount,
          },
        },
      });
      console.log(newUserLeave);
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

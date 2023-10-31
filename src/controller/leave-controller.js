const prisma = require("../models/prisma");
const {
  createRequestLeaveSchema,
  createUserLeaveSchema,
  createProfileLeaveSchema,
  updateUserLeaveSchema,
  deleteUserLeaveSchema,
  updateStatusRequestAcceptByUserLeaveIdSchema,
  updateStatusRequestRejectByUserLeaveIdSchema,
  deleteLeaveRequestsByUserLeaveIdSchema,
  getLeaveRequestsByUserLeaveId,
} = require("../validators/leave-validator");

// ########## request leave ##########
exports.createLeaveRequest = async (req, res, next) => {
  try {
    const { value, error } = createRequestLeaveSchema.validate(req.body);
    // console.log("value", value);
    // console.log(req.body);

    if (error) {
      error.statusCode = 400;
      return next(error);
    }

    const result = await prisma.requestLeave.create({
      data: value,
    });

    res.status(201).json({ result });
  } catch (error) {
    next(error);
  }
};

exports.getLeaveRequestsByUserLeaveId = async (req, res, next) => {
  try {
    const { value, error } = getLeaveRequestsByUserLeaveId.validate(req.params);
    // console.log("value", value);
    // console.log("req.params", req.params);

    if (error) {
      error.statusCode = 400;
      return next(error);
    }

    const result = await prisma.requestLeave.findMany({
      where: {
        userLeaveId: value.userLeaveId,
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        halfDate: true,
        statusRequest: true,
        messageLeave: true,
      },
    });
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

exports.getAllLeaveRequests = async (req, res, next) => {
  try {
    const result = await prisma.requestLeave.findMany({
      select: {
        id: true,
        userLeaveId: true,
        startDate: true,
        endDate: true,
        halfDate: true,
        statusRequest: true,
      },
    });
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

exports.updateStatusRequestAcceptByUserLeaveId = async (req, res, next) => {
  try {
    const { value, error } =
      updateStatusRequestAcceptByUserLeaveIdSchema.validate(req.params);

    if (error) {
      error.statusCode = 400;
      return next(error);
    }

    // Find userLeaveId
    const found = await prisma.requestLeave.findFirst({
      where: { userLeaveId: +value.userLeaveId },
    });
    if (!found) {
      return res.status(404).json({ message: "userLeaveId not found" });
    }

    // Update the status to 'accept'
    const result = await prisma.requestLeave.update({
      data: {
        statusRequest: "ACCEPT",
      },
      where: {
        id: found.id,
      },
    });
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

exports.updateStatusRequestRejectByUserLeaveId = async (req, res, next) => {
  try {
    const { value, error } =
      updateStatusRequestRejectByUserLeaveIdSchema.validate(req.params);

    if (error) {
      error.statusCode = 400;
      return next(error);
    }

    // Find userLeaveId
    const found = await prisma.requestLeave.findFirst({
      where: { userLeaveId: +value.userLeaveId },
    });
    if (!found) {
      return res.status(404).json({ message: "userLeaveId not found" });
    }

    // Update the status to 'reject'
    const result = await prisma.requestLeave.update({
      data: {
        statusRequest: "REJECT",
      },
      where: {
        id: found.id,
      },
    });
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

exports.deleteLeaveRequestsByLeaveRequestId = async (req, res, next) => {
  try {
    const { value, error } = deleteLeaveRequestsByUserLeaveIdSchema.validate(
      req.params
    );
    // console.log("value", value);
    // console.log("req.params", req.params);

    if (error) {
      error.statusCode = 400;
      return next(error);
    }

    // Delete userLeaveId
    const result = await prisma.requestLeave.delete({
      where: {
        id: value.leaveRequestId,
      },
    });
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

exports.createUserLeave = async (req, res, next) => {
  try {
    const { value, error } = createUserLeaveSchema.validate(req.body);
    // console.log("value", value);
    // console.log("req.body", req.body);
    if (error) {
      error.statusCode = 400;
      return next(error);
    }

    const result = await prisma.userLeave.create({
      data: {
        userId: +req.params.userId,
        leaveProfileId: req.body.leaveProfileId,
        dateAmount: req.body.dateAmount,
      },
    });
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

exports.updateUserLeave = async (req, res, next) => {
  try {
    const { value, error } = updateUserLeaveSchema.validate(req.body);
    // console.log("value", value);
    // console.log("req.body", req.body);

    if (error) {
      error.statusCode = 400;
      return next(error);
    }

    const result = await prisma.userLeave.update({
      data: {
        leaveProfileId: req.body.leaveProfileId,
        dateAmount: req.body.dateAmount,
      },
      where: {
        id: +req.params.userId,
      },
    });
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

exports.deleteUserLeave = async (req, res, next) => {
  try {
    const { value, error } = deleteUserLeaveSchema.validate(req.params);
    console.log("value", value);
    // console.log("req.params", req.params);

    if (error) {
      error.statusCode = 400;
      return next(error);
    }

    // Find userLeaveId in table requestLeave
    const found = await prisma.requestLeave.findFirst({
      where: { userLeaveId: +value.userLeaveId },
    });
    // console.log("founddddd", found);

    // Delete in table userLeave
    if (found === null) {
      await prisma.userLeave.delete({
        where: {
          id: value.userLeaveId,
        },
      });
    }

    if (found) {
      return res.status(404).json({ message: "userLeaveId has request leave" });
    }

    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

// ########## profile leave ##########
exports.createProfileLeave = async (req, res, next) => {
  try {
    const { value, error } = createProfileLeaveSchema.validate(req.body);
    // console.log("value", value);
    // console.log("req.body", req.body);

    if (error) {
      error.statusCode = 400;
      return next(error);
    }

    const result = await prisma.leaveProfile.create({
      data: value,
    });
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

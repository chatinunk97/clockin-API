const prisma = require("../models/prisma");
const {
  createRequestLeaveSchema,
  createUserLeaveSchema,
  createProfileLeaveSchema,
  updateStatusRequestAcceptByUserLeaveIdSchema,
  updateStatusRequestRejectByUserLeaveIdSchema,
  getLeaveRequestsByUserLeaveId,
} = require("../validators/leave-validator");

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
    console.log("value", value);
    console.log(req.params);

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
    console.log("value", value);
    console.log("req.params", req.params);

    if (error) {
      error.statusCode = 400;
      return next(error);
    }

    // Find userLeaveId
    const found = await prisma.requestLeave.findUnique({
      where: { id: value.userLeaveId },
    });
    if (!found) {
      return res.status(404).json({ message: "userLeaveId not found" });
    }

    // Update the status to 'accept'
    const result = await prisma.requestLeave.update({
      where: {
        id: userLeaveId,
      },
      data: {
        statusRequest: "ACCEPT",
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
    const found = await prisma.requestLeave.findUnique({
      where: { id: value.userLeaveId },
    });
    if (!found) {
      return res.status(404).json({ message: "userLeaveId not found" });
    }

    // Update the status to 'reject'
    const result = await prisma.requestLeave.update({
      where: {
        id: userLeaveId,
      },
      data: {
        statusRequest: "REJECT",
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
      data: value,
    });
    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

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

const prisma = require('../models/prisma');
const createError = require('../utils/create-error');
const {
  createRequestLeaveSchema,
  createUserLeaveSchema,
  updateUserLeaveSchema,
  deleteUserLeaveSchema,
  getLeaveRequestsByUserLeaveId,
  createLeaveProfileSchema,
  updateRequestSchema,
  deleteRequestsSchema,
} = require('../validators/leave-validators');

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

exports.getAllRequestLeaves = async (req, res, next) => {
  try {
    console.log(req.user);
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

    // const requestLeaves = await prisma.user.findMany({
    //   where: {
    //     companyProfileId: req.user.companyProfileId,
    //     userRelationshipBoss: {
    //       every: {
    //         userBossId: req.user.id,
    //       },
    //     },
    //   },
    // });
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
      return next(createError('Request leave not found'));
    }

    const requestLeave = await prisma.requestLeave.update({
      data: value,
      where: {
        id: found.id,
      },
    });

    console.log(requestLeave);

    requestLeave.startDate;
    if (requestLeave.statusRequest === 'ACCEPT') {
      await prisma.userLeave.update({
        where: { id: requestLeave.userLeaveId },
        data: {
          dateAmount: {
            decrement,
          },
        },
      });
    } else if (
      requestLeave.statusRequest === 'ACCEPT' &&
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
    res.status(200).json({ message: 'Request Leave was deleted' });
  } catch (error) {
    next(error);
  }
};

// ########## user leave ##########

exports.createUserLeave = async (req, res, next) => {
  try {
    if (!(req.user.position == 'ADMIN' || req.user.position == 'HR')) {
      return next(createError('You do not have permission to access', 403));
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
    if (!(req.user.position == 'ADMIN' || req.user.position == 'HR')) {
      return next(createError('You do not have permission to access', 403));
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
    if (!(req.user.position == 'ADMIN' || req.user.position == 'HR')) {
      return next(createError('You do not have permission to access', 403));
    }

    const { value, error } = deleteUserLeaveSchema.validate(req.params);
    console.log('value', value);

    if (error) {
      return next(error);
    }

    const foundRequestLeave = await prisma.requestLeave.findFirst({
      where: { userLeaveId: +value.userLeaveId },
    });

    if (foundRequestLeave) {
      return next(createError('userLeaveId has request leave', 400));
    }

    if (foundRequestLeave === null) {
      await prisma.userLeave.delete({
        where: {
          id: value.userLeaveId,
        },
      });
    }

    res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};

// ########## leave profile ##########
exports.createLeaveProfile = async (req, res, next) => {
  try {
    if (req.user.position !== 'ADMIN') {
      return next(createError('You do not have permission to access', 403));
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

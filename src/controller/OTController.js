const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const {
  createOTSchema,
  getRequestOTByIdSchema,
} = require("../validators/OT-validators");

exports.requestOT = async (req, res, next) => {
  try {
    const foundClock = await prisma.clock.findFirst({
      where: {
        id: req.body.clockId,
      },
    });

    if (!foundClock) {
      return next(createError("Not found", 400));
    }
    req.body.userId = +req.user.id;
    const { value, error } = createOTSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const OT = await prisma.requestOT.create({
      data: value,
    });
    res.status(201).json({ message: "OT was requested", OT });
  } catch (error) {
    next(error);
  }
};

exports.updateRequestOT = async (req, res, next) => {
  try {
    const foundOT = await prisma.requestOT.findFirst({
      where: { id: +req.body.id },
    });

    if (!foundOT) {
      return next(createError("Not found", 400));
    }

    const OT = await prisma.requestOT.update({
      data: {
        statusOT: req.body.statusOT, // Corrected field name to 'statusOT'
      },
      where: { id: +req.body.id },
    });

    res.status(200).json({ message: "OT status was updated", OT });
  } catch (error) {
    next(error);
  }
};

exports.getAllRequestOT = async (req, res, next) => {
  try {
    const OT = await prisma.requestOT.findMany({
      where: {
        User: {
          userRelationshipUser: {
            every: {
              userBossId: req.user.id,
            },
          },
        },
      },
      include: {
        User: true,
      },
    });
    res.status(200).json({ OT });
  } catch (error) {
    next(error);
  }
};
exports.getAllRequestOTByMonth = async (req, res, next) => {
  try {
    console.log(req.query.date);
    const OT = await prisma.requestOT.findMany({
      where: {
        statusOT: "ACCEPT",
        clock: { clockInTime: { startsWith: req.query.date } },
        User: { companyProfileId: req.user.companyProfileId },
      },
    });
    res.status(200).json({ OT });
  } catch (error) {
    next(error);
  }
};

exports.getRequestOTByUserId = async (req, res, next) => {
  try {
    const MyRequestOT = await prisma.requestOT.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        User: true,
      },
    });
    res.status(200).json({ MyRequestOT });
  } catch (error) {
    next(error);
  }
};

exports.getAllMyRequestOT = async (req, res, next) => {
  try {
    const OT = await prisma.requestOT.findMany({
      where: { userId: req.user.id },
      include: {
        clock: true,
      },
    });
    res.status(201).json({ OT });
  } catch (error) {
    next(error);
  }
};

exports.getOTById = async (req, res, next) => {
  try {
    console.log(req.params);
    const { value, error } = getRequestOTByIdSchema.validate(req.params);

    if (error) {
      error.statusCode = 400;
      return next(error);
    }

    const requestOTId = await prisma.requestOT.findUnique({
      where: {
        id: value.requestOTId,
      },
      include: {
        User: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        clock: true,
      },
    });

    console.log(requestOTId, "sldpslpdsl");
    res.status(200).json({ requestOTId });
  } catch (error) {
    next(error);
  }
};

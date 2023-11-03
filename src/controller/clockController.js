const {
  clockInSchema,
  clockOutSchema,
} = require('../validators/clock-validators');
const prisma = require('../models/prisma');
const createError = require('../utils/create-error');

exports.clockIn = async (req, res, next) => {
  try {
    const { value, error } = clockInSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const foundTimeProfile = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        flexibleTime: true,
      },
    });

    console.log(foundTimeProfile);

    value.userId = req.user.id;

    const clockIn = await prisma.clock.create({
      data: {
        clockInTime: value.clockInTime,
        clockOutTime: value.clockOutTime,
        latitudeClockIn: value.latitudeClockIn,
        longitudeClockIn: value.longitudeClockIn,
        user: { connect: { id: value.userId } },
      },
    });
    res.status(201).json({ clockIn });
  } catch (error) {
    next(error);
  }
};

exports.clockOut = async (req, res, next) => {
  try {
    const { value, error } = clockOutSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const foundClock = await prisma.clock.findFirst({
      where: {
        id: value.id,
      },
    });

    if (!foundClock) {
      return next(createError('Not found', 400));
    }

    const clock = await prisma.clock.update({
      data: value,
      where: {
        id: value.id,
      },
    });

    res.status(200).json({ clock });
  } catch (error) {
    next(error);
  }
};

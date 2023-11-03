const { clockInSchema } = require('../validators/clock-validators');
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
    value.clockOutTime = null;

    const clockIn = await prisma.clock.create({
      data: value,
    });
    res.status(201).json({ clockIn });
  } catch (error) {
    next(error);
  }
};

exports.clockOut = async (req, res, next) => {
  try {
    const foundClock = await prisma.clock.findFirst({
      where: {
        id: req.body.id,
      },
    });

    if (!foundClock) {
      return next(createError('Not found', 400));
    }

    req.body.clockOutTime = new Date().toJSON();
    const clock = await prisma.clock.update({
      data: req.body,
      where: {
        id: req.body.id,
      },
    });

    res.status(200).json({ message: 'Hello', clock });
  } catch (error) {
    next(error);
  }
};

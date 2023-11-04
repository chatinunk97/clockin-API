const {
  clockInSchema,
  clockOutSchema,
} = require("../validators/clock-validators");
const prisma = require("../models/prisma");
const createError = require("../utils/create-error");

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
    const newestClockId = await prisma.clock.aggregate({
      _max: {
        id: true,
      },
      where: { userId: +req.user.id },
    });
    const foundClock = await prisma.clock.findFirst({
      where: {
        id: newestClockId._max.id,
      },
    });
    if (!foundClock) {
      return next(createError("Not found", 400));
    }
    const clock = await prisma.clock.update({
      data: value,
      where: {
        id: foundClock.id
      },
    });

    res.status(200).json({ clock });
  } catch (error) {
    next(error);
  }
};

// exports.getNewestClock = async (req, res, next) => {
//   try {
//     const newestClock = await prisma.clock.aggregate({
//       _max : {
//         id : true
//       },
//       where: { userId: +req.user.id },
//     });
//     res.status(200).json({ clockId : newestClock['_max'].id});
//   } catch (error) {
//     next(error);
//   }
// };

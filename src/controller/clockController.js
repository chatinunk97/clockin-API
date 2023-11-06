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
    //Check for flexible Time on that date

    console.log(value);
    //Use default time if no flexible Time
    const foundTimeProfile = await prisma.timeProfile.findFirst({
      where: {
        companyProfile: req.user.companyProfile,
      },
    });

    //Create Start work time using clock in date + time profile Time
    const startTime = new Date(
      value.clockInTime.split("T")[0] + " " + foundTimeProfile.start
    );
    const clockInTime = new Date(value.clockInTime);
    if (clockInTime > startTime) {
      const clockInDate = new Date(value.clockInTime);
      const todayDate = new Date();
      if (
        clockInDate.setHours(0, 0, 0, 0) == todayDate.setHours(0, 0, 0, 0)
      ) {
        console.log("already has data for today");
      } else {
        console.log("LATE!!!");
        value.statusClockIn = "LATE";
      }
    }

    value.user = { connect: { id: req.user.id } };
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
        id: foundClock.id,
      },
    });

    res.status(200).json({ clock });
  } catch (error) {
    next(error);
  }
};

exports.getClock = async (req, res, next) => {
  try {
    const allClock = await prisma.clock.findMany({
      where: { userId: +req.user.id },
    });
    return res.json({ allClock });
  } catch (error) {
    next(error);
  }
};

exports.companyProfile = async (req, res, next) => {
  try {
    const companyLocation = await prisma.companyLocation.findMany({
      where: { companyProfileId: req.user.companyProfileId },
    });
    res.json(companyLocation);
  } catch (error) {
    next(error);
  }
};

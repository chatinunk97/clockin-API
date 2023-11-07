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

    //Get default time
    const result = await prisma.timeProfile.findFirst({
      where: {
        AND: [
          { companyProfileId: req.user.companyProfileId },
          { typeTime: "DEFAULT" },
        ],
      },
    });
    //Compare Time and check today clockin (you can only be late once a day)
    const startTime = new Date(
      value.clockInTime.split("T")[0] + " " + result?.start
    );
    const clockInTime = new Date(value.clockInTime);

    //Check for today previous clock in if true don't check late
    const todayClockIn = await prisma.clock.findFirst({
      where: {
        clockInTime: { startsWith: `%${value.clockInTime.split("T")[0]}` },
      },
    });

    if (clockInTime > startTime && !todayClockIn) {
      console.log(`You're late !`);
      value.statusClockIn = "LATE";
    }

    value.user = { connect: { id: req.user.id } };
    const clockIn = await prisma.clock.create({
      data: value,
    });
    res.json({ clockIn });
  } catch (error) {
    next(error);
  }
};

exports.clockOut = async (req, res, next) => {
  try {
    res.json({ message: "Reached Clock Out" });
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
    const companyLocation = await prisma.companyLocation.findFirst({
      where: { companyProfileId: req.user.companyProfileId },
    });
    res.json(companyLocation);
  } catch (error) {
    next(error);
  }
};

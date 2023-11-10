const {
  clockInSchema,
  clockOutSchema,
  dateFilterSchema,
  todayFilterSchema,
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
    const { value, error } = clockOutSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const latestClock = await prisma.clock.findFirst({
      orderBy: {
        id: "desc",
      },
      take: 1,
      where: { userId: req.user.id },
    });
    if (!latestClock) {
      return next(createError("No previois clock in found", 400));
    }
    await prisma.clock.update({
      where: { id: latestClock.id },
      data: value,
    });
    res.json({ message: "Reached Clock Out" });
  } catch (error) {
    next(error);
  }
};

exports.latestClock = async (req, res, next) => {
  try {
    const { value, error } = todayFilterSchema.validate(req.query);
    if (error) {
      return next(error);
    }
    console.log(value);
    const latestClock = await prisma.clock.findFirst({
      orderBy: {
        id: "desc",
      },
      take: 1,
      where: {
        userId: req.user.id,
        clockInTime: { gte: value.today.toISOString() },
      },
    });
    res.json(latestClock);
  } catch (error) {
    next(error);
  }
};
exports.getClock = async (req, res, next) => {
  try {
    console.log(req.query);
    const { value, error } = dateFilterSchema.validate(req.query);
    if (error) {
      return next(error);
    }
    let clockInFilter = {};
    if (value.dateStart) {
      console.log("first");
      clockInFilter.gte = value.dateStart.toISOString();
    }
    if (value.dateEnd) {
      clockInFilter.lte = value.dateEnd.toISOString();
    }
    const allClock = await prisma.clock.findMany({
      where: { userId: +req.user.id, clockInTime: clockInFilter },
    });
    res.status(200).json(allClock);
  } catch (error) {
    next(error);
  }
};

exports.companyProfile = async (req, res, next) => {
  try {
    const companyLocation = await prisma.companyLocation.findFirst({
      where: { companyProfileId: req.user.companyProfileId },
    });
    res.status(200).json(companyLocation);
  } catch (error) {
    next(error);
  }
};

exports.allStatus = async (req, res, next) => {
  try {
    const status = await prisma.clock.findMany({
      select: {
        statusClockIn: true,
      },
      where: {
        user: { companyProfileId: req.user.companyProfileId },
      },
    });

    let countLate = 0;
    let countOntime = 0;

    // Count the number of occurrences for each status
    for (let i = 0; i < status.length; i++) {
      if (status[i].statusClockIn === "LATE") {
        countLate++;
      } else {
        countOntime++;
      }
    }

    // Calculate total count
    const totalCount = countLate + countOntime;

    // Calculate percentages
    const percentageLate = Math.round((countLate / totalCount) * 100);
    const percentageOntime = Math.round((countOntime / totalCount) * 100);

    console.log("countLate", countLate);
    console.log("countOntime", countOntime);
    console.log("percentageLate", percentageLate);
    console.log("percentageOntime", percentageOntime);

    res
      .status(200)
      .json({ countLate, countOntime, percentageLate, percentageOntime });
  } catch (error) {
    next(error);
  }
};

exports.statusClockIn = async (req, res, next) => {
  try {
    const lateClockInsCount = await prisma.clock.count({
      where: {
        user: { companyProfileId: req.user.companyProfileId },
        statusClockIn: "LATE",
      },
    });

    res.status(200).json({ lateClockInsCount });
  } catch (error) {
    next(error);
  }
};

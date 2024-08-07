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
    //Search For Flexible time
    console.log(value);
    const flexibleTime = await prisma.flexibleTime.findFirst({
      where: { AND: [{ userId: req.user.id }, { date: value.today }] },
      include: {
        timeProfile: {
          select: {
            start: true,
          },
        },
      },
    });
    const result = await prisma.timeProfile.findFirst({
      where: {
        AND: [
          { companyProfileId: req.user.companyProfileId },
          { typeTime: "DEFAULT" },
        ],
      },
    });
    if (result) {
      start = result.start;
    } else {
      return next(
        createError(
          "Your company time profile has not yet been set. Please contact your Admin",
          400
        )
      );
    }
    if (flexibleTime) {
      start = flexibleTime.timeProfile.start;
    }

    //Compare Time and check today clockin (you can only be late once a day)
    const startTime = new Date(value.clockInTime.split("T")[0] + " " + start);
    const clockInTime = new Date(value.clockInTime);

    //Check for today previous clock in if true don't check late
    console.log(new Date(value.clockInTime.split("T")[0]).toISOString());
    console.log(req.user.id);
    const todayClockIn = await prisma.clock.findFirst({
      where: {
        AND: [
          {
            clockInTime: {
              gte: new Date(value.clockInTime.split("T")[0]).toISOString(),
            },
          },
          { user: { id: req.user.id } },
        ],
      },
    });
    console.log(todayClockIn);
    if (clockInTime > startTime && !todayClockIn) {
      console.log(`You're late !`);
      value.statusClockIn = "LATE";
    }

    value.user = { connect: { id: req.user.id } };
    delete value.today;
    const clockIn = await prisma.clock.create({
      data: value,
    });
    res.json({ clockIn });
  } catch (error) {
    next(error);
  }
};
exports.clockReason = async (req, res, next) => {
  try {
    const updatedClock = await prisma.clock.update({
      data: {
        reasonLate: req.body.reason,
      },
      where: {
        id: +req.body.clockId,
      },
    });
    res.json(updatedClock);
  } catch (error) {
    next(error);
  }
};
exports.clockOut = async (req, res, next) => {
  try {
    console.log(req.body);
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
    value.reasonLocation =
      "IN : " + value.reasonLocation + "OUT : " + latestClock.reasonLocation;
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
    const { value, error } = dateFilterSchema.validate(req.query);
    if (error) {
      return next(error);
    }
    console.log(value, "the value is fk here");
    const filterDate = value.dateStart;
    filterDate.setUTCHours(0);
    filterDate.setUTCMinutes(0);
    filterDate.setUTCSeconds(0);
    filterDate.setUTCMilliseconds(0);

    const filterEndDate = new Date(filterDate);
    filterEndDate.setDate(filterEndDate.getDate() + 1);

    const allClock = await prisma.clock.findMany({
      where: {
        userId: req.user.id,
        AND: [
          {
            clockInTime: {
              gte: filterDate.toISOString(),
            },
          },
          {
            clockInTime: {
              lte: filterEndDate.toISOString(),
            },
          },
        ],
      },
    });

    const filterClock = allClock.filter((el) => {
      if (new Date(el.clockInTime) > new Date(value.dateStart)) {
        return el;
      }
    });
    res.status(200).json(filterClock);
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
    const statusCounts = await prisma.clock.groupBy({
      by: ["statusClockIn"],
      where: {
        user: { companyProfileId: req.user.companyProfileId },
        clockInTime: { startsWith: req.query.date },
      },
      _count: true,
    });

    const requestLeaveCounts = await prisma.requestLeave.groupBy({
      by: ["statusRequest"],
      where: {
        startDate: { startsWith: req.query.date },
        userLeave: {
          user: { companyProfileId: req.user.companyProfileId },
        },
      },
      _count: true,
    });

    res.status(200).json({
      statusCounts,
      requestLeaveCounts,
    });
  } catch (error) {
    next(error);
  }
};
exports.statusClockIn = async (req, res, next) => {
  try {
    console.log(req.query, "+++++++++++++statusClockIn+++++++++++++++++");
    const lateClockInsCount = await prisma.clock.count({
      where: {
        user: { companyProfileId: req.user.companyProfileId },
        clockInTime: { startsWith: req.query.date },
        statusClockIn: "LATE",
      },
    });
    console.log(lateClockInsCount);
    res.status(200).json({ lateClockInsCount });
  } catch (error) {
    next(error);
  }
};

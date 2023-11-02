const prisma = require('../models/prisma');
const createError = require('../utils/create-error');

exports.requestOT = async (req, res, next) => {
  try {
    const foundClock = await prisma.clock.findFirst({
      where: {
        id: req.body.clockId,
      },
    });

    if (!foundClock) {
      return next(createError('Not found', 400));
    }

    req.body.userId = req.user.id;
    const OT = await prisma.requestOT.create({
      data: req.body,
    });
    res.status(201).json({ message: 'OT was requested', OT });
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
      return next(createError('Not found', 400));
    }

    const OT = await prisma.requestOT.update({
      data: req.body,
      where: { id: +req.body.id },
    });

    res.status(200).json({ message: 'OT was updated', OT });
  } catch (error) {
    next(error);
  }
};

exports.getAllRequestOT = async (req, res, next) => {
  try {
    const OT = await prisma.requestOT.findMany({
      where: {},
    });
    res.status(200).json({ message: 'Yooooo' });
  } catch (error) {
    next(error);
  }
};

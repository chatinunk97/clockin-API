const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const flexiblaTimeSchema = require("../validators/flexible-validator");

exports.createFlexible = async (req, res, next) => {
  try {
    if (req.user.userType !== "PARTTIME") {
      return next(createError("It's not your business", 403));
    }
    // if (!req.timeProfile || req.timeProfile.typeTime !== "NOTSPECIFIED") {
    //   return next(createError("It's for part time's, Jackass.", 403));
    // }

    const { value, error } = flexiblaTimeSchema.validate(req.body);
    if (error) {
      return next(createError(error.details[0].message, 400));
    }

    const flexible = await prisma.flexibleTime.create({
      data: value,
    });

    res.status(201).json({ message: "Flexible was created", flexible });
  } catch (error) {
    next(error);
  }
};

// exports.updateFlexible

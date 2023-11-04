const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const flexiblaTimeSchema = require("../validators/flexible-validator");

exports.createFlexible = async (req, res, next) => {
  try {
    console.log(req.body);
    if (req.user.position !== "HR") {
      return next(createError("It's not your business, Jackass", 403));
    }
    const { value, error } = flexiblaTimeSchema.validate(req.body);
    if (error) {
      return next(createError(error.details[0].message, 400));
    }

    console.log(value);
    const flexible = await prisma.flexibleTime.create({
      data: value,
    });

    res.status(201).json({ message: "Flexible was created", flexible });
  } catch (error) {
    next(error);
  }
};

// exports.updateFlexible = async ()

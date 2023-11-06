const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const {
  timeProfileSchema,
  updateTimeProfileSchema,
} = require("../validators/timeProfile-validators");

exports.createTimeProfile = async (req, res, next) => {
  try {
    if (req.user.position !== "ADMIN") {
      return next(createError("You do not have permission to access", 403));
    }

    req.body.companyProfileId = req.user.companyProfileId;
    console.log(req.body);
    const { value, error } = timeProfileSchema.validate(req.body);
    if (error) {
      return next(createError(error.details[0].message, 400));
    }
    const timeProfile = await prisma.timeProfile.create({
      data: value,
    });

    res.status(201).json({ message: "TimeProfile was created", timeProfile });
  } catch (error) {
    next(error);
  }
};

exports.updateTimeProfile = async (req, res, next) => {
  try {
    if (req.user.position !== "ADMIN") {
      return next(createError("You do not have permission to access", 403));
    }

    const { value, error } = updateTimeProfileSchema.validate(req.body);

    if (error) {
      return next(createError(error.details[0].message, 400));
    }

    const updatedTimeProfile = await prisma.timeProfile.update({
      where: {
        id: +req.params.timeProfileId, // Assuming the URL parameter is named timeProfileId
      },
      data: value,
    });
    res
      .status(200)
      .json({ message: "TimeProfile was updated", updatedTimeProfile });
  } catch (error) {
    next(error);
  }
};

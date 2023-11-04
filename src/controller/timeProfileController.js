const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const {
  timeProfileSchema,
  updateTimeProfileSchema,
  deleteTimeProfileSchema,
} = require("../validators/timeProfile-validators");

exports.createTimeProfile = async (req, res, next) => {
  try {
    if (req.user.position !== "ADMIN") {
      return next(createError("You do not have permission to access", 403));
    }

    req.body.companyProfileId = req.user.companyProfileId;

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
    // req.body.companyProfileId = req.user.companyProfileId;
    console.log(req.params);
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

exports.getTimeProfileById = async (req, res, next) => {
  try {
    const timeProfile = await prisma.timeProfile.findMany({
      where: {
        id: +req.params.timeProfileId,
      },
    });

    if (timeProfile.length === 0) {
      throw createError("Time profile not found", 404);
    }
    res
      .status(200)
      .json({ message: "Get timeProfile", timeProfile: timeProfile });
  } catch (error) {
    next(error);
  }
};

exports.getAllTimeProfile = async (req, res, next) => {
  try {
    const allTimeProfiles = await prisma.timeProfile.findMany({
      where: {
        companyProfileId: req.user.companyProfileId,
      },
    });

    res.status(200).json({ message: "Get all time profiles", allTimeProfiles });
  } catch (error) {
    next(error);
  }
};

exports.deleteTimeProfile = async (req, res, next) => {
  try {
    console.log(req.user.position);
    if (req.user.position !== "ADMIN") {
      return next(
        createError("You do not have permission to delete a time profile", 403)
      );
    }

    const { error } = deleteTimeProfileSchema.validate(req.params);
    if (error) {
      return next(error);
    }

    // Find the time profile
    const foundTimeProfile = await prisma.timeProfile.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    // Check if the time profile exists
    if (!foundTimeProfile) {
      throw createError("Time Profile not found", 404);
    }

    // Delete the time profile
    await prisma.timeProfile.delete({
      where: {
        id: +req.params.id,
      },
    });

    res.status(200).json({ message: "Time Profile deleted successfully" });
  } catch (error) {
    next(error);
  }
};

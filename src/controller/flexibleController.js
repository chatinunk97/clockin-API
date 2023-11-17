const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const {
  createFlexibleTimeSchema,
  deleteFlexibleTimeSchema,
  updateFlexibleTimeSchema,
} = require("../validators/flexible-validator");

exports.createFlexible = async (req, res, next) => {
  try {
    if (req.user.position !== "HR") {
      return next(
        createError("You don't have permission to access this section", 403)
      );
    }

    const { value, error } = createFlexibleTimeSchema.validate(req.body);
    if (error) {
      return next(createError(error.details[0].message, 400));
    }
    const flexible = await prisma.flexibleTime.create({
      data: value,
      include: {
        timeProfile: true,
      },
    });

    res.status(201).json({ message: "Flexible was created", flexible });
  } catch (error) {
    next(error);
  }
};

exports.updateFlexible = async (req, res, next) => {
  try {
    // Check user permissions
    if (req.user.position !== "HR") {
      return next(
        createError("You don't have permission to access this section")
      );
    }

    // Validate request body
    const { value, error } = updateFlexibleTimeSchema.validate(req.body);
    if (error) {
      return next(createError(error.details[0].message, 400));
    }
    // Update flexible time record
    const updatedFlexible = await prisma.flexibleTime.update({
      data: value,
      where: {
        id: +req.params.id,
      },
    });

    res.status(200).json({ message: "Flexible was updated", updatedFlexible });
  } catch (error) {
    next(error);
  }
};

exports.getFlexibleByUserId = async (req, res, next) => {
  try {
    const flexible = await prisma.flexibleTime.findMany({
      where: {
        userId: +req.params.id,
      },
      include: {
        timeProfile: true,
      },
    });
    console.log(flexible, "ggdfgdf");
    if (!flexible) {
      throw createError("flexible time not found", 404);
    }
    res.status(200).json({ flexible });
  } catch (error) {
    next(error);
  }
};

exports.deleteFlexible = async (req, res, next) => {
  try {
    // Validate the request parameters
    const { error } = deleteFlexibleTimeSchema.validate(req.params);
    if (error) {
      return next(error);
    }
    // Find the flexible time record to check its existence
    const foundFlexible = await prisma.flexibleTime.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    // Check if the flexible time record exists
    if (!foundFlexible) {
      throw createError("Flexible not found", 404);
    }

    // Delete the flexible time record
    await prisma.flexibleTime.delete({
      where: {
        id: +req.params.id,
      },
    });

    res.status(200).json({ message: "Flexible deleted successfully" });
  } catch (error) {
    next(error);
  }
};

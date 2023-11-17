const Joi = require("joi");

const createFlexibleTimeSchema = Joi.object({
  userId: Joi.number().integer().required(),
  date: Joi.string().required(),
  timeProfileId: Joi.number().integer().required(),
});

exports.createFlexibleTimeSchema = createFlexibleTimeSchema;

const updateFlexibleTimeSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  userId: Joi.number().integer(),
  date: Joi.string().required(),
  timeProfileId: Joi.number().integer().required(),
});

exports.updateFlexibleTimeSchema = updateFlexibleTimeSchema;

const deleteFlexibleTimeSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
exports.deleteFlexibleTimeSchema = deleteFlexibleTimeSchema;

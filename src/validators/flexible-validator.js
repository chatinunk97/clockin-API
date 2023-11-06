const Joi = require("joi");

const flexibleTimeSchema = Joi.object({
  userId: Joi.number().integer().required(),
  date: Joi.string().required(),
  timeProfileId: Joi.number().integer().required(),
});

module.exports = flexibleTimeSchema;

const updateFlexibleTimeSchema = Joi.object({
  // userId: Joi.number().integer(),
  date: Joi.string().required(),
  timeProfileId: Joi.number().integer().required(),
});

module.exports = updateFlexibleTimeSchema;

const deleteFlexibleTimeSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
module.exports = deleteFlexibleTimeSchema;

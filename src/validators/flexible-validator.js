const Joi = require("joi");

const flexiblaTimeSchema = Joi.object({
  userId: Joi.number().integer().required(),
  date: Joi.date().iso().required(),
  timeProfileId: Joi.number().integer().required(),
});

module.exports = flexiblaTimeSchema;

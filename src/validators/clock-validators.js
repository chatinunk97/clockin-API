const Joi = require('joi');

const clockInSchema = Joi.object({
  latitudeClockIn: Joi.number().required(),
  longitudeClockIn: Joi.number().required(),
});
exports.clockInSchema = clockInSchema;

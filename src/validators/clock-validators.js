const Joi = require('joi');

const clockInSchema = Joi.object({
  clockInTime: Joi.string().required(),
  latitudeClockIn: Joi.number().required(),
  longitudeClockIn: Joi.number().required(),
});
exports.clockInSchema = clockInSchema;

const clockOutSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  clockOutTime: Joi.string().required(),
  latitudeClockOut: Joi.number().required(),
  longitudeClockOut: Joi.number().required(),
});
exports.clockOutSchema = clockOutSchema;

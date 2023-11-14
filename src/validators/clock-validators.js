const Joi = require("joi");

const clockInSchema = Joi.object({
  clockInTime: Joi.string().required(),
  latitudeClockIn: Joi.number().required(),
  longitudeClockIn: Joi.number().required(),
  today: Joi.string().required(),
  reasonLocation : Joi.string()
});
exports.clockInSchema = clockInSchema;

const clockOutSchema = Joi.object({
  clockOutTime: Joi.string().required(),
  latitudeClockOut: Joi.number().required(),
  longitudeClockOut: Joi.number().required(),
});
exports.clockOutSchema = clockOutSchema;

const dateFilterSchema = Joi.object({
  dateStart: Joi.date().allow("", null),
  dateEnd: Joi.date().allow("", null),
});
exports.dateFilterSchema = dateFilterSchema;

const todayFilterSchema = Joi.object({
  today: Joi.date().allow("", null),
});
exports.todayFilterSchema = todayFilterSchema;

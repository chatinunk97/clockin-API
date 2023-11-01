const Joi = require("joi");

const TypetimeEnum = ["DEFAULT", "FIRSTHALF", "SECONDHAFT", "NOTSPECIFIED"];

const timeProfileSchema = Joi.object({
  start: Joi.date().format("DD/MM/YYYY").utc().required(),
  end: Joi.date().format("DD/MM/YYYY").utc().required(),
  typeTime: Joi.string()
    .valid(...TypetimeEnum)
    .required(),
});

module.exports = timeProfileSchema;

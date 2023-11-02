const Joi = require("joi");

const TypetimeEnum = ["DEFAULT", "FIRSTHALF", "SECONDHAFT", "NOTSPECIFIED"];

const timeProfileSchema = Joi.object({
  companyProfileId: Joi.number().integer().positive(),
  start: Joi.date().required(),
  end: Joi.date().required(),
  typeTime: Joi.string()
    .valid(...TypetimeEnum)
    .required(),
});
exports.timeProfileSchema = timeProfileSchema;

// const getTimeProfileSchema = Joi.object({
//   companyProfileId: Joi.number().integer().positive(),
//   start: Joi.date().required(),
//   end: Joi.date().required(),
//   typeTime: Joi.string()
//     .valid(...TypetimeEnum)
//     .required(),
// });
// exports.getTimeProfileSchema = getTimeProfileSchema;

const updateTimeProfileSchema = Joi.object({
  // companyProfileId: Joi.number().integer().positive(),
  start: Joi.date().required(),
  end: Joi.date().required(),
  typeTime: Joi.string()
    .valid(...TypetimeEnum)
    .required(),
});
exports.updateTimeProfileSchema = updateTimeProfileSchema;

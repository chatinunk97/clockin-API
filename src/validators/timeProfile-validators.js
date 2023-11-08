const Joi = require("joi");

const TypetimeEnum = ["DEFAULT", "FIRSTHALF", "SECONDHALF", "NOTSPECIFIED"];

const timeProfileSchema = Joi.object({
  companyProfileId: Joi.number().integer().positive(),
  start: Joi.string()
    .regex(/^([0-9]{2})\:([0-9]{2})$/)
    .required(),
  end: Joi.string()
    .regex(/^([0-9]{2})\:([0-9]{2})$/)
    .required(),
  typeTime: Joi.string()
    .valid(...TypetimeEnum)
    .required(),
});

const updateTimeProfileSchema = Joi.object({
  // companyProfileId: Joi.number().integer().positive(),
  start: Joi.string()
    .regex(/^([0-9]{2})\:([0-9]{2})$/)
    .required(),
  end: Joi.string()
    .regex(/^([0-9]{2})\:([0-9]{2})$/)
    .required(),
  typeTime: Joi.string()
    .valid(...TypetimeEnum)
    .required(),
});

const deleteTimeProfileSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

module.exports = {
  timeProfileSchema,
  updateTimeProfileSchema,
  deleteTimeProfileSchema,
};

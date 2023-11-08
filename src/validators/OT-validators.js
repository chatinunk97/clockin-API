const Joi = require("joi");

const createrOTSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  messageOT: Joi.string().required(),
  clockId: Joi.number().integer().positive().required(),
});

const updateOTSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  userId: Joi.number().integer().positive().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  messageOT: Joi.string().required(),
  clockId: Joi.number().integer().positive().required(),
});

module.exports = {
  createrOTSchema,
  updateOTSchema,
};

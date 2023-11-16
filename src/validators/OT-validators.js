const Joi = require("joi");

const createOTSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  messageOT: Joi.string().required(),
  clockId: Joi.number().integer().positive().required(),
  totalTime: Joi.number().integer().positive().required(),
});

const updateOTSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  userId: Joi.number().integer().positive().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  messageOT: Joi.string().required(),
  clockId: Joi.number().integer().positive().required(),
});
const getRequestOTByIdSchema = Joi.object({
  requestOTId: Joi.number().integer().positive().required(),
});

module.exports = {
  createOTSchema,
  updateOTSchema,
  getRequestOTByIdSchema,
};

const Joi = require("joi").extend(require("@joi/date"));

const createRequestLeaveSchema = Joi.object({
  userLeaveId: Joi.number().integer().positive().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  halfDate: Joi.boolean(),
  statusRequest: Joi.string().trim().valid("ACCEPT", "REJECT"),
  messageLeave: Joi.string(),
});

const createUserLeaveSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  leaveProfileId: Joi.number().integer().positive().required(),
  dateAmount: Joi.number().integer().positive().required(),
});

const updateUserLeaveSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  leaveProfileId: Joi.number().integer().positive(),
  dateAmount: Joi.number().integer().positive(),
});

const deleteUserLeaveSchema = Joi.object({
  userLeaveId: Joi.number().integer().positive().required(),
});

const createLeaveProfileSchema = Joi.object({
  companyProfileId: Joi.number().integer().positive().required(),
  leaveName: Joi.string().required(),
});

const updateRequestSchema = Joi.object({
  userLeaveId: Joi.number().integer().positive().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  halfDate: Joi.boolean(),
  statusRequest: Joi.string().required(),
  messageLeave: Joi.string().required(),
});

const deleteRequestsSchema = Joi.object({
  leaveRequestId: Joi.number().integer().positive().required(),
});

const getRequestLeaveByIdSchema = Joi.object({
  requestLeaveId: Joi.number().integer().positive().required(),
});
const deleteLeaveProfile = Joi.object({
  id: Joi.number().integer().positive().required(),
});
const updateLeaveProfileSchema = Joi.object({
  leaveName: Joi.string().required(),
});
module.exports = {
  createRequestLeaveSchema,
  createUserLeaveSchema,
  updateUserLeaveSchema,
  deleteUserLeaveSchema,
  createLeaveProfileSchema,
  updateRequestSchema,
  deleteRequestsSchema,
  deleteLeaveProfile,
  updateLeaveProfileSchema,
  getRequestLeaveByIdSchema,
};

const Joi = require("joi").extend(require("@joi/date"));

const createLeaveProfileSchema = Joi.object({
  companyProfileId: Joi.number().integer().positive().required(),
  leaveName: Joi.string().required(),
  defaultDateAmount: Joi.number().integer().positive().required(),
});
const updateLeaveProfileSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  leaveName: Joi.string().required(),
  defaultDateAmount: Joi.number().integer().min(0).required(),
});
const deleteLeaveProfile = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const createUserLeaveSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  leaveProfileId: Joi.number().integer().positive().required(),
  dateAmount: Joi.number().integer().positive().required().allow(0),
});
const updateUserLeaveSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  userId: Joi.number().integer().positive().required(),
  leaveProfileId: Joi.number().integer().positive(),
  dateAmount: Joi.number().integer().positive().allow(0),
});
const deleteUserLeaveSchema = Joi.object({
  userLeaveId: Joi.number().integer().positive().required(),
});

const createRequestLeaveSchema = Joi.object({
  userLeaveId: Joi.number().integer().positive().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  leaveType: Joi.string().trim().valid("FULLDAY", "FIRSTHALF", "SECONDHALF"),
  statusRequest: Joi.string().trim().valid("ACCEPT", "REJECT"),
  messageLeave: Joi.string(),
});
const updateRequestSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  userLeaveId: Joi.number().integer().positive().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  leaveType: Joi.string().trim().valid("FULLDAY", "FIRSTHALF", "SECONDHALF"),
  statusRequest: Joi.string().required(),
  messageLeave: Joi.string().required(),
});
const deleteRequestsSchema = Joi.object({
  leaveRequestId: Joi.number().integer().positive().required(),
});
const getRequestLeaveByIdSchema = Joi.object({
  requestLeaveId: Joi.number().integer().positive().required(),
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

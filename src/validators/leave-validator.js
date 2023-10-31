const Joi = require("joi").extend(require("@joi/date"));

const createRequestLeaveSchema = Joi.object({
  userLeaveId: Joi.number().integer().positive().required(),
  startDate: Joi.date().format("DD/MM/YYYY").utc().required(),
  endDate: Joi.date().format("DD/MM/YYYY").utc().required(),
  halfDate: Joi.boolean(),
  statusRequest: Joi.string().trim().valid("PENDING", "ACCEPT", "REJECT"),
  messageLeave: Joi.string(),
});

const createUserLeaveSchema = Joi.object({
  leaveProfileId: Joi.number().integer().positive().required(),
  dateAmount: Joi.number().integer().positive().required(),
});

const updateUserLeaveSchema = Joi.object({
  leaveProfileId: Joi.number().integer().positive(),
  dateAmount: Joi.number().integer().positive(),
});

const deleteUserLeaveSchema = Joi.object({
  userLeaveId: Joi.number().integer().positive().required(),
});

const createProfileLeaveSchema = Joi.object({
  companyProfileId: Joi.number().integer().positive().required(),
  leaveName: Joi.string().required(),
});

const updateStatusRequestAcceptByUserLeaveIdSchema = Joi.object({
  userLeaveId: Joi.number().integer().positive().required(),
});
const updateStatusRequestRejectByUserLeaveIdSchema = Joi.object({
  userLeaveId: Joi.number().integer().positive().required(),
});

const deleteLeaveRequestsByUserLeaveIdSchema = Joi.object({
  leaveRequestId: Joi.number().integer().positive().required(),
});

const getLeaveRequestsByUserLeaveId = Joi.object({
  userLeaveId: Joi.number().integer().positive().required(),
});

module.exports = {
  createRequestLeaveSchema,
  createUserLeaveSchema,
  updateUserLeaveSchema,
  deleteUserLeaveSchema,
  createProfileLeaveSchema,
  updateStatusRequestAcceptByUserLeaveIdSchema,
  updateStatusRequestRejectByUserLeaveIdSchema,
  deleteLeaveRequestsByUserLeaveIdSchema,
  getLeaveRequestsByUserLeaveId,
};

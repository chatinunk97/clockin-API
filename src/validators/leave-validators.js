const Joi = require('joi').extend(require('@joi/date'));

const createRequestLeaveSchema = Joi.object({
  userLeaveId: Joi.number().integer().positive().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  halfDate: Joi.boolean(),
  statusRequest: Joi.string().trim().valid('PENDING', 'ACCEPT', 'REJECT'),
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
  createLeaveProfileSchema,
  updateStatusRequestAcceptByUserLeaveIdSchema,
  updateStatusRequestRejectByUserLeaveIdSchema,
  deleteLeaveRequestsByUserLeaveIdSchema,
  getLeaveRequestsByUserLeaveId,
};

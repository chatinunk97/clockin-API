const Joi = require('joi');

const loginAdminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().trim().required(),
});
exports.loginAdminSchema = loginAdminSchema;

const createAdminSchema = Joi.object({
  profileImage: Joi.string(),
  employeeId: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,16}$/)
    .trim()
    .required(),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  companyProfileId: Joi.number().integer().positive().required(),
});
exports.createAdminSchema = createAdminSchema;

const updateAdminSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  profileImage: Joi.string(),
  employeeId: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,16}$/)
    .trim(),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  companyProfileId: Joi.number().integer().positive().required(),
});
exports.updateAdminSchema = updateAdminSchema;

const deleteAdminSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
exports.deleteAdminSchema = deleteAdminSchema;

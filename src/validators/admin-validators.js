const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().trim().required(),
});
exports.loginSchema = loginSchema;

const createUserSchemaByAdmin = Joi.object({
  profileImage: Joi.string(),
  employeeId: Joi.string().required(),
  position: Joi.string().valid('HR', 'MANEGER', 'USER'),
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
exports.createUserSchemaByAdmin = createUserSchemaByAdmin;

const createUserSchemaByHR = Joi.object({
  profileImage: Joi.string(),
  employeeId: Joi.string().required(),
  position: Joi.string().valid('MANEGER', 'USER'),
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
exports.createUserSchemaByHR = createUserSchemaByHR;

const updateUserSchemaByAdmin = Joi.object({
  id: Joi.number().integer().positive().required(),
  profileImage: Joi.string(),
  employeeId: Joi.string().required(),
  position: Joi.string().valid('ADMIN', 'HR', 'MANEGER', 'USER'),
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
exports.updateUserSchemaByAdmin = updateUserSchemaByAdmin;

const updateUserSchemaByHR = Joi.object({
  id: Joi.number().integer().positive().required(),
  profileImage: Joi.string(),
  employeeId: Joi.string().required(),
  position: Joi.string().valid('HR', 'MANEGER', 'USER'),
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
exports.updateUserSchemaByHR = updateUserSchemaByHR;

const updateUserSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  profileImage: Joi.string(),
  employeeId: Joi.string().required(),
  position: Joi.string().valid('MANEGER', 'USER'),
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
exports.updateUserSchema = updateUserSchema;

const deleteAdminSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
exports.deleteAdminSchema = deleteAdminSchema;

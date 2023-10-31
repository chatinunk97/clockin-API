const Joi = require('joi');

const registerCompanySchema = Joi.object({
  companyName: Joi.string().trim().required(),
  packageId: Joi.number().integer().positive().required(),
  latitudeCompany: Joi.number().required(),
  longitudeCompany: Joi.number().required(),
  paySlip: Joi.string().required(),
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
});
exports.registerCompanySchema = registerCompanySchema;

const loginSuperAdminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().trim().required(),
});
exports.loginSuperAdminSchema = loginSuperAdminSchema;

const createSuperAdminSchema = Joi.object({
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
exports.createSuperAdminSchema = createSuperAdminSchema;

const updateSuperAdminSchema = Joi.object({
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
exports.updateSuperAdminSchema = updateSuperAdminSchema;

const deleteSuperAdminSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
exports.deleteSuperAdminSchema = deleteSuperAdminSchema;

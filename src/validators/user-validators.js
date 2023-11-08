const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().trim().required(),
});
exports.loginSchema = loginSchema;

const createUserSchemaByAdmin = Joi.object({
  profileImage: Joi.string().allow("", null),
  employeeId: Joi.string().required(),
  position: Joi.string().valid("HR", "MANAGER", "USER"),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().trim().required(),
  userType: Joi.string().required(),
  userBossId: Joi.number().integer().positive().required(),
  isActive: Joi.boolean().required(),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  userBossId: Joi.number().integer().positive().required(),
  checkLocation: Joi.boolean().required(),
});
exports.createUserSchemaByAdmin = createUserSchemaByAdmin;

const createUserSchemaByHR = Joi.object({
  profileImage: Joi.string(),
  employeeId: Joi.string().required(),
  position: Joi.string().valid("MANAGER", "USER"),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().trim().required(),
  userType: Joi.string().required(),
  userBossId: Joi.number().integer().positive().required(),
  isActive: Joi.boolean().required(),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  userBossId: Joi.number().integer().positive().required(),
  checkLocation: Joi.boolean().required(),
});
exports.createUserSchemaByHR = createUserSchemaByHR;

const updateUserSchemaByAdmin = Joi.object({
  id: Joi.number().integer().positive().required(),
  profileImage: Joi.string().allow(null, ""),
  employeeId: Joi.string().required(),
  position: Joi.string().valid("ADMIN", "HR", "MANAGER", "USER"),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  userType: Joi.string().required(),
  userBossId: Joi.number().integer().positive().required(),
  isActive: Joi.boolean().required(),
  checkLocation: Joi.boolean().required(),
});
exports.updateUserSchemaByAdmin = updateUserSchemaByAdmin;

const updateUserSchemaByHR = Joi.object({
  id: Joi.number().integer().positive().required(),
  profileImage: Joi.string().allow(null, ""),
  employeeId: Joi.string().required(),
  position: Joi.string().valid("HR", "MANAGER", "USER"),
  userType: Joi.string().valid("FULLTIME", "PARTTIME"),
  isActive: Joi.boolean(),
  checkLocation: Joi.boolean(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  userType: Joi.string().required(),
  userBossId: Joi.number().integer().positive().required(),
  isActive: Joi.boolean().required(),
  checkLocation: Joi.boolean().required(),
});
exports.updateUserSchemaByHR = updateUserSchemaByHR;

const deleteUserSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});
exports.deleteUserSchema = deleteUserSchema;

const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,16}$/)
    .trim()
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .trim()
    .required()
    .strip(),
});
exports.resetPasswordSchema = resetPasswordSchema;

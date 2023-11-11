const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().trim().required(),
});

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

const deleteUserSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

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

const paymentSchema = Joi.object({
  packageId: Joi.number().integer().positive().required(),
});

const updatePaymentSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  packageId: Joi.number().integer().positive().required(),
  statusPayment: Joi.string().trim().valid("ACCEPT", "REJECT"),
});

module.exports = {
  loginSchema,
  createUserSchemaByAdmin,
  createUserSchemaByHR,
  updateUserSchemaByAdmin,
  updateUserSchemaByHR,
  deleteUserSchema,
  resetPasswordSchema,
  paymentSchema,
  updatePaymentSchema,
};

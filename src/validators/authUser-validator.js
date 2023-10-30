const Joi = require("joi");

const createUserSchema = Joi.object({
  profileImage: Joi.string(),
  employeeId: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,30}$/)
    .trim()
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .trim()
    .required()
    .strip(),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  position: Joi.string().valid("ADMIN", "USER", "HR", "MANAGER").required(),
  userType: Joi.string().valid("FULLTIME", "PARTTIME").required(),
  companyProfileId: Joi.number().required(),
});

const updateUserSchema = Joi.object({
  profileImage: Joi.string(),
  employeeId: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,30}$/)
    .trim()
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .trim()
    .required()
    .strip(),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  position: Joi.string().valid("ADMIN", "USER", "HR", "MANAGER"),
  userType: Joi.string().valid("FULLTIME", "PARTTIME").required(),
  companyProfileId: Joi.number(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
};

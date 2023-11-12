const Joi = require("joi");

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
const idValidator = Joi.object({
  id : Joi.number().required()
})
exports.registerCompanySchema = registerCompanySchema;
exports.idValidator = idValidator;


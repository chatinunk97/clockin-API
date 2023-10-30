const Joi = require("joi");

const registerCompanySchema = Joi.object({
  companyName: Joi.string().trim().required(),
  packageId: Joi.number().integer().positive().required(),
  latitudeCompany: Joi.number().required(),
  longitudeCompany: Joi.number().required(),
});
exports.registerCompanySchema = registerCompanySchema;

// const companyLocationSchema = Joi.object({
// });
// exports.companyLocationSchema = companyLocationSchema;

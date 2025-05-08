const Joi = require('joi');

// Full name schema for individual users
const fullNameSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required()
});

// Address schema for individual users or providers
const addressSchema = Joi.object({
  streetNumber: Joi.string().required(),
  streetName: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  postCode: Joi.string().required()
});

// Provider-specific fields
const providerSchema = Joi.object({
  // General user type and role
  type: Joi.string().valid('individual', 'company').required(),
  role: Joi.string().valid('user', 'provider').required(),

  // Common fields for all users (phone_number, email, etc.)
  mobileNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required().messages({
    'string.min': '"password" should be at least 8 characters'
  }),

  // Fields specific to individual users
  firstName: Joi.when('type', {
    is: 'individual',
    then: Joi.string().min(2).max(30).required(),
    otherwise: Joi.string().allow('')
  }),
  lastName: Joi.when('type', {
    is: 'individual',
    then: Joi.string().min(2).max(30).required(),
    otherwise: Joi.string().allow('')
  }),

  // Fields specific to companies
  companyName: Joi.string().when('type', {
    is: 'company',
    then: Joi.string().required().min(2).max(100),
    otherwise: Joi.string().allow(''),
  }),
  phoneNumber: Joi.when('type', {
    is: 'company',
    then: Joi.string().required().pattern(/^[0-9]{10,15}$/),
    otherwise: Joi.string().allow(''),
  }),
  businessTaxNumber: Joi.when('type', {
    is: 'company',
    then: Joi.string()
      .pattern(/^[A-Z0-9]{10}$/)
      .required()
      .messages({
        'string.pattern.base': 'Business Tax Number must be 10 characters (A-Z, 0-9)'
      }),
    otherwise: Joi.string().allow('')
  }),

  // Address validation for both individual and company (optional based on type)
  address: Joi.when('type', {
    is: 'individual',
    then: addressSchema.required(),
    otherwise: addressSchema.optional()
  }),

});

module.exports = {
  providerSchema
};

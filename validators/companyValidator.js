const Joi = require('joi');

const createCompanySchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required()
    .messages({
      'string.min': 'Company name must be at least 3 characters',
      'string.max': 'Company name must not exceed 100 characters',
      'any.required': 'Company name is required'
    }),
  description: Joi.string().trim().max(2000).allow(''),
  industry: Joi.string().trim().max(100).allow(''),
  website: Joi.string().uri().allow('')
    .messages({
      'string.uri': 'Website must be a valid URL'
    }),
  location: Joi.string().trim().max(200).allow('')
});

const updateCompanySchema = Joi.object({
  name: Joi.string().trim().min(3).max(100)
    .messages({
      'string.min': 'Company name must be at least 3 characters',
      'string.max': 'Company name must not exceed 100 characters'
    }),
  description: Joi.string().trim().max(2000).allow(''),
  industry: Joi.string().trim().max(100).allow(''),
  website: Joi.string().uri().allow('')
    .messages({
      'string.uri': 'Website must be a valid URL'
    }),
  location: Joi.string().trim().max(200).allow('')
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

module.exports = { createCompanySchema, updateCompanySchema };

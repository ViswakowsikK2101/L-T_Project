const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required()
    .messages({
      'string.min': 'Name must be at least 3 characters',
      'string.max': 'Name must not exceed 50 characters',
      'any.required': 'Name is required'
    }),
  email: Joi.string().trim().lowercase().email().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string().min(6).required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required'
    }),
  role: Joi.string().valid('candidate', 'recruiter', 'admin')
    .messages({
      'any.only': 'Role must be one of: candidate, recruiter, admin'
    })
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string().required()
    .messages({
      'any.required': 'Password is required'
    })
});

module.exports = { registerSchema, loginSchema };

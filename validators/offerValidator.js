const Joi = require('joi');

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Must be a valid 24-character ObjectId');

const createOfferSchema = Joi.object({
  application: objectId.required()
    .messages({ 'any.required': 'Application ID is required' }),
  salary: Joi.number().min(0).required()
    .messages({
      'number.min': 'Salary must be at least 0',
      'any.required': 'Salary is required'
    }),
  joiningDate: Joi.date().iso().greater('now').required()
    .messages({
      'date.greater': 'Joining date must be in the future',
      'any.required': 'Joining date is required'
    }),
  notes: Joi.string().trim().max(2000).allow('')
});

const updateOfferStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'accepted', 'rejected', 'withdrawn')
    .required()
    .messages({
      'any.only': 'Status must be one of: pending, accepted, rejected, withdrawn',
      'any.required': 'Status is required'
    })
});

module.exports = { createOfferSchema, updateOfferStatusSchema };

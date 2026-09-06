const Joi = require('joi');

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Must be a valid 24-character ObjectId');

const createJobSchema = Joi.object({
  company: objectId.required()
    .messages({ 'any.required': 'Company ID is required' }),
  title: Joi.string().trim().min(3).max(200).required()
    .messages({
      'string.min': 'Job title must be at least 3 characters',
      'string.max': 'Job title must not exceed 200 characters',
      'any.required': 'Job title is required'
    }),
  description: Joi.string().trim().min(10).required()
    .messages({
      'string.min': 'Job description must be at least 10 characters',
      'any.required': 'Job description is required'
    }),
  skills: Joi.array().items(Joi.string().trim()).min(1).required()
    .messages({
      'array.min': 'At least one skill is required',
      'any.required': 'Skills are required'
    }),
  location: Joi.string().trim().required()
    .messages({ 'any.required': 'Location is required' }),
  salaryRange: Joi.object({
    min: Joi.number().min(0).required()
      .messages({ 'number.min': 'Minimum salary must be at least 0' }),
    max: Joi.number().min(0).required()
      .messages({ 'number.min': 'Maximum salary must be at least 0' })
  }).custom((value, helpers) => {
    if (value.min > value.max) {
      return helpers.error('any.invalid');
    }
    return value;
  }).messages({
    'any.invalid': 'Minimum salary must not exceed maximum salary'
  }),
  experienceLevel: Joi.string().valid('entry', 'junior', 'mid', 'senior', 'lead').required()
    .messages({
      'any.only': 'Experience level must be one of: entry, junior, mid, senior, lead',
      'any.required': 'Experience level is required'
    }),
  employmentType: Joi.string().valid('full-time', 'part-time', 'contract', 'internship')
    .messages({
      'any.only': 'Employment type must be one of: full-time, part-time, contract, internship'
    }),
  status: Joi.string().valid('open', 'closed', 'draft')
    .messages({
      'any.only': 'Status must be one of: open, closed, draft'
    }),
  applicationDeadline: Joi.date().iso().greater('now')
    .messages({
      'date.greater': 'Application deadline must be in the future'
    })
});

const updateJobSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200),
  description: Joi.string().trim().min(10),
  skills: Joi.array().items(Joi.string().trim()).min(1),
  location: Joi.string().trim(),
  salaryRange: Joi.object({
    min: Joi.number().min(0).required(),
    max: Joi.number().min(0).required()
  }).custom((value, helpers) => {
    if (value.min > value.max) {
      return helpers.error('any.invalid');
    }
    return value;
  }).messages({
    'any.invalid': 'Minimum salary must not exceed maximum salary'
  }),
  experienceLevel: Joi.string().valid('entry', 'junior', 'mid', 'senior', 'lead'),
  employmentType: Joi.string().valid('full-time', 'part-time', 'contract', 'internship'),
  status: Joi.string().valid('open', 'closed', 'draft'),
  applicationDeadline: Joi.date().iso()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const searchJobSchema = Joi.object({
  title: Joi.string().trim(),
  skills: Joi.alternatives().try(
    Joi.string().trim(),
    Joi.array().items(Joi.string().trim())
  ),
  location: Joi.string().trim(),
  experienceLevel: Joi.string().valid('entry', 'junior', 'mid', 'senior', 'lead'),
  status: Joi.string().valid('open', 'closed', 'draft'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

module.exports = { createJobSchema, updateJobSchema, searchJobSchema };

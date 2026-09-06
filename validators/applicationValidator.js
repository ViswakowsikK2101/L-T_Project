const Joi = require('joi');

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Must be a valid 24-character ObjectId');

const createApplicationSchema = Joi.object({
  job: objectId.required()
    .messages({ 'any.required': 'Job ID is required' }),
  coverLetter: Joi.string().trim().max(5000).allow('')
});

const updateStageSchema = Joi.object({
  stage: Joi.string()
    .valid('applied', 'shortlisted', 'interview', 'offered', 'hired', 'rejected')
    .required()
    .messages({
      'any.only': 'Stage must be one of: applied, shortlisted, interview, offered, hired, rejected',
      'any.required': 'Stage is required'
    }),
  note: Joi.string().trim().max(1000).allow('')
});

module.exports = { createApplicationSchema, updateStageSchema };

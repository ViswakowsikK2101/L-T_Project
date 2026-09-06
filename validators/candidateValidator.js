const Joi = require('joi');

const profileSchema = Joi.object({
  skills: Joi.array().items(Joi.string().trim().max(50)).max(30)
    .messages({
      'array.max': 'Cannot have more than 30 skills'
    }),
  experienceYears: Joi.number().min(0).max(50)
    .messages({
      'number.min': 'Experience years cannot be negative',
      'number.max': 'Experience years cannot exceed 50'
    }),
  resumeSummary: Joi.string().trim().max(5000).allow(''),
  education: Joi.string().trim().max(500).allow(''),
  location: Joi.string().trim().max(200).allow(''),
  phone: Joi.string().pattern(/^[+]?[\d\s\-().]{7,20}$/).allow('')
    .messages({
      'string.pattern.base': 'Phone number format is invalid'
    })
});

module.exports = { profileSchema };

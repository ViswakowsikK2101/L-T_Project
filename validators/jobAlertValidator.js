const Joi = require('joi');

const createAlertSchema = Joi.object({
  keywords: Joi.array().items(Joi.string().trim().max(50)).max(10)
    .messages({
      'array.max': 'Cannot have more than 10 keywords'
    }),
  skills: Joi.array().items(Joi.string().trim().max(50)).max(20)
    .messages({
      'array.max': 'Cannot have more than 20 skills'
    }),
  location: Joi.string().trim().max(200).allow(''),
  experienceLevel: Joi.string().valid('entry', 'junior', 'mid', 'senior', 'lead')
    .messages({
      'any.only': 'Experience level must be one of: entry, junior, mid, senior, lead'
    })
}).min(1).messages({
  'object.min': 'At least one filter criterion must be provided'
});

module.exports = { createAlertSchema };

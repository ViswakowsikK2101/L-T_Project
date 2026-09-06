const Joi = require('joi');

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Must be a valid 24-character ObjectId');

const createInterviewSchema = Joi.object({
  application: objectId.required()
    .messages({ 'any.required': 'Application ID is required' }),
  scheduledAt: Joi.date().iso().greater('now').required()
    .messages({
      'date.greater': 'Interview must be scheduled in the future',
      'any.required': 'Scheduled date/time is required'
    }),
  mode: Joi.string().valid('in-person', 'video', 'phone').required()
    .messages({
      'any.only': 'Mode must be one of: in-person, video, phone',
      'any.required': 'Interview mode is required'
    }),
  meetingLink: Joi.string().uri().allow('')
    .when('mode', {
      is: 'video',
      then: Joi.string().uri().required()
        .messages({ 'any.required': 'Meeting link is required for video interviews' })
    }),
  location: Joi.string().trim().max(500).allow(''),
  feedback: Joi.string().trim().max(2000).allow('')
});

const updateInterviewSchema = Joi.object({
  scheduledAt: Joi.date().iso(),
  mode: Joi.string().valid('in-person', 'video', 'phone'),
  meetingLink: Joi.string().uri().allow(''),
  location: Joi.string().trim().max(500).allow(''),
  feedback: Joi.string().trim().max(2000).allow(''),
  status: Joi.string().valid('scheduled', 'completed', 'cancelled')
    .messages({
      'any.only': 'Status must be one of: scheduled, completed, cancelled'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

module.exports = { createInterviewSchema, updateInterviewSchema };

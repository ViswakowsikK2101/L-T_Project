const Joi = require('joi');

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Must be a valid 24-character ObjectId');

const saveJobSchema = Joi.object({
  job: objectId.required()
    .messages({ 'any.required': 'Job ID is required' })
});

module.exports = { saveJobSchema };

const ApiError = require('../utils/ApiError');

/**
 * Joi validation middleware factory.
 *
 * @param {Joi.ObjectSchema} schema – Compiled Joi schema.
 * @param {'body'|'query'|'params'} source – Part of req to validate (default: 'body').
 * @returns {Function} Express middleware.
 */
const validate = (schema, source = 'body') => {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((d) => d.message).join('; ');
      return next(ApiError.badRequest(message, 'VALIDATION_ERROR'));
    }

    // Replace source with sanitized/stripped values
    req[source] = value;
    next();
  };
};

module.exports = validate;

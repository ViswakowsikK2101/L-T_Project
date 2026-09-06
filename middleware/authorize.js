const ApiError = require('../utils/ApiError');

/**
 * Role-based authorization middleware factory.
 *
 * Usage:  router.get('/admin-only', authenticate, authorize('admin'), handler);
 *
 * @param  {...string} roles – Allowed roles (e.g. 'admin', 'recruiter', 'candidate').
 * @returns {Function} Express middleware.
 */
const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Role '${req.user.role}' is not authorized to access this resource.`
        )
      );
    }

    next();
  };
};

module.exports = authorize;

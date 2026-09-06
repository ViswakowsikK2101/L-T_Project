const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * JWT authentication middleware.
 * Verifies the Bearer token from the Authorization header and
 * attaches the full user document (minus password) to req.user.
 */
const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      throw ApiError.unauthorized('User belonging to this token no longer exists.');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid token.'));
    }
    if (err.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token has expired.'));
    }
    next(err);
  }
};

module.exports = authenticate;

const jwt = require('jsonwebtoken');

/**
 * Generate a JWT for the given user payload.
 * @param {Object} user - Mongoose user document (must have _id and role).
 * @returns {string} Signed JWT.
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = generateToken;

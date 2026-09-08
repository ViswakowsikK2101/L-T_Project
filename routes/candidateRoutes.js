const express = require('express');
const router = express.Router();
const { createProfile, getProfile, updateProfile } = require('../controllers/candidateController');
const { validate } = require('../middleware/validate');
const { profileSchema } = require('../validators/candidateValidator');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.route('/profile')
  .post(authenticate, authorize('candidate'), validate(profileSchema), createProfile)
  .get(authenticate, authorize('candidate'), getProfile)
  .put(authenticate, authorize('candidate'), validate(profileSchema), updateProfile);

module.exports = router;
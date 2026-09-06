const express = require('express');
const router = express.Router();
const { createProfile, getProfile, updateProfile } = require('../controllers/candidateController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validate } = require('../middleware/validate');
const { profileSchema } = require('../validators/candidateValidator');

router.post('/profile', authenticate, authorize('candidate'), validate(profileSchema), createProfile);
router.get('/profile', authenticate, authorize('candidate'), getProfile);
router.put('/profile', authenticate, authorize('candidate'), validate(profileSchema), updateProfile);

module.exports = router;

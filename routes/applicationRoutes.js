const express = require('express');
const router = express.Router();
const { createApplication, getApplications, getApplication, updateApplicationStage } = require('../controllers/applicationController');
const { validate } = require('../middleware/validate');
const { createApplicationSchema, updateStageSchema } = require('../validators/applicationValidator');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.route('/')
  .post(authenticate, authorize('candidate'), validate(createApplicationSchema), createApplication)
  .get(authenticate, getApplications);

router.route('/:id')
  .get(authenticate, getApplication);

router.route('/:id/stage')
  .put(authenticate, authorize('recruiter'), validate(updateStageSchema), updateApplicationStage);

module.exports = router;
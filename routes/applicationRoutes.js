const express = require('express');
const router = express.Router();
const { createApplication, getApplications, getApplication, updateApplicationStage } = require('../controllers/applicationController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createApplicationSchema, updateStageSchema } = require('../validators/applicationValidator');

router.post('/', authenticate, authorize('candidate'), validate(createApplicationSchema), createApplication);
router.get('/', authenticate, getApplications);
router.get('/:id', authenticate, getApplication);
router.put('/:id/stage', authenticate, authorize('recruiter'), validate(updateStageSchema), updateApplicationStage);

module.exports = router;

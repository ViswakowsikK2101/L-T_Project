const express = require('express');
const router = express.Router();
const { saveJob, getSavedJobs, removeSavedJob } = require('../controllers/savedJobController');
const { validate } = require('../middleware/validate');
const { saveJobSchema } = require('../validators/savedJobValidator');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.route('/')
  .post(authenticate, authorize('candidate'), validate(saveJobSchema), saveJob)
  .get(authenticate, authorize('candidate'), getSavedJobs);

router.route('/:jobId')
  .delete(authenticate, authorize('candidate'), removeSavedJob);

module.exports = router;
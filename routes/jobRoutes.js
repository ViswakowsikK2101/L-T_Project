const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJob, updateJob, deleteJob } = require('../controllers/jobController');
const { validate } = require('../middleware/validate');
const { createJobSchema, updateJobSchema, searchJobSchema } = require('../validators/jobValidator');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.route('/')
  .post(authenticate, authorize('recruiter'), validate(createJobSchema), createJob)
  .get(validate(searchJobSchema, 'query'), getJobs);

router.route('/:id')
  .get(getJob)
  .put(authenticate, authorize('recruiter'), validate(updateJobSchema), updateJob)
  .delete(authenticate, authorize('recruiter'), deleteJob);

module.exports = router;
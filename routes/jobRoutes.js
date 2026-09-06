const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJob, updateJob, deleteJob } = require('../controllers/jobController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createJobSchema, updateJobSchema, searchJobSchema } = require('../validators/jobValidator');

router.post('/', authenticate, authorize('recruiter'), validate(createJobSchema), createJob);
router.get('/', validate(searchJobSchema), getJobs);
router.get('/:id', getJob);
router.put('/:id', authenticate, authorize('recruiter'), validate(updateJobSchema), updateJob);
router.delete('/:id', authenticate, authorize('recruiter'), deleteJob);

module.exports = router;

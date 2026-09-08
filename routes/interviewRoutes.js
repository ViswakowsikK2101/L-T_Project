const express = require('express');
const router = express.Router();
const { createInterview, getInterviews, updateInterview } = require('../controllers/interviewController');
const { validate } = require('../middleware/validate');
const { createInterviewSchema, updateInterviewSchema } = require('../validators/interviewValidator');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.route('/')
  .post(authenticate, authorize('recruiter'), validate(createInterviewSchema), createInterview)
  .get(authenticate, getInterviews);

router.route('/:id')
  .put(authenticate, authorize('recruiter'), validate(updateInterviewSchema), updateInterview);

module.exports = router;
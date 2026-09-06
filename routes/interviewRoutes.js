const express = require('express');
const router = express.Router();
const { createInterview, getInterviews, updateInterview } = require('../controllers/interviewController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createInterviewSchema, updateInterviewSchema } = require('../validators/interviewValidator');

router.post('/', authenticate, authorize('recruiter'), validate(createInterviewSchema), createInterview);
router.get('/', authenticate, getInterviews);
router.put('/:id', authenticate, authorize('recruiter'), validate(updateInterviewSchema), updateInterview);

module.exports = router;

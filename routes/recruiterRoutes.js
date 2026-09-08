const express = require('express');
const router = express.Router();
const { getApplicantsForJob, getAllApplicants } = require('../controllers/recruiterController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/applicants', authenticate, authorize('recruiter'), getAllApplicants);
router.get('/jobs/:jobId/applicants', authenticate, authorize('recruiter'), getApplicantsForJob);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getApplicantsForJob, getAllApplicants } = require('../controllers/recruiterController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/jobs/:jobId/applicants', authenticate, authorize('recruiter'), getApplicantsForJob);
router.get('/applicants', authenticate, authorize('recruiter'), getAllApplicants);

module.exports = router;

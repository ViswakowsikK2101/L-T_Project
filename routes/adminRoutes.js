const express = require('express');
const router = express.Router();
const { getHiringFunnel, getJobStats, getUsers, getCompanies } = require('../controllers/adminController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/reports/funnel', authenticate, authorize('admin'), getHiringFunnel);
router.get('/reports/jobs', authenticate, authorize('admin'), getJobStats);
router.get('/users', authenticate, authorize('admin'), getUsers);
router.get('/companies', authenticate, authorize('admin'), getCompanies);

module.exports = router;
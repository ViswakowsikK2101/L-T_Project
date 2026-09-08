const express = require('express');
const router = express.Router();
const { createAlert, getAlerts, deleteAlert } = require('../controllers/jobAlertController');
const { validate } = require('../middleware/validate');
const { createAlertSchema } = require('../validators/jobAlertValidator');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.route('/')
  .post(authenticate, authorize('candidate'), validate(createAlertSchema), createAlert)
  .get(authenticate, authorize('candidate'), getAlerts);

router.route('/:id')
  .delete(authenticate, authorize('candidate'), deleteAlert);

module.exports = router;
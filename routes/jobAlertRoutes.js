const express = require('express');
const router = express.Router();
const { createAlert, getAlerts, deleteAlert } = require('../controllers/jobAlertController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createAlertSchema } = require('../validators/jobAlertValidator');

router.post('/', authenticate, authorize('candidate'), validate(createAlertSchema), createAlert);
router.get('/', authenticate, authorize('candidate'), getAlerts);
router.delete('/:id', authenticate, authorize('candidate'), deleteAlert);

module.exports = router;

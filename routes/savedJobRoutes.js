const express = require('express');
const router = express.Router();
const { saveJob, getSavedJobs, removeSavedJob } = require('../controllers/savedJobController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validate } = require('../middleware/validate');
const { saveJobSchema } = require('../validators/savedJobValidator');

router.post('/', authenticate, authorize('candidate'), validate(saveJobSchema), saveJob);
router.get('/', authenticate, authorize('candidate'), getSavedJobs);
router.delete('/:jobId', authenticate, authorize('candidate'), removeSavedJob);

module.exports = router;

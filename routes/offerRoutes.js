const express = require('express');
const router = express.Router();
const { createOffer, getOffers, getOffer, updateOfferStatus } = require('../controllers/offerController');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validate } = require('../middleware/validate');
const { createOfferSchema, updateOfferStatusSchema } = require('../validators/offerValidator');

router.post('/', authenticate, authorize('recruiter'), validate(createOfferSchema), createOffer);
router.get('/', authenticate, getOffers);
router.get('/:id', authenticate, getOffer);
router.put('/:id/status', authenticate, validate(updateOfferStatusSchema), updateOfferStatus);

module.exports = router;

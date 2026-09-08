const express = require('express');
const router = express.Router();
const { createOffer, getOffers, getOffer, updateOfferStatus } = require('../controllers/offerController');
const { validate } = require('../middleware/validate');
const { createOfferSchema, updateOfferStatusSchema } = require('../validators/offerValidator');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.route('/')
  .post(authenticate, authorize('recruiter'), validate(createOfferSchema), createOffer)
  .get(authenticate, getOffers);

router.route('/:id')
  .get(authenticate, getOffer);

router.route('/:id/status')
  .put(authenticate, validate(updateOfferStatusSchema), updateOfferStatus);

module.exports = router;
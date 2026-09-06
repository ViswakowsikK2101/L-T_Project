const Offer = require('../models/Offer');
const Application = require('../models/Application');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');

// POST /api/offers - Recruiter only
exports.createOffer = async (req, res, next) => {
  try {
    const { application, salary, joiningDate, notes } = req.body;

    // Verify application exists
    const app = await Application.findById(application).populate('job');
    if (!app) {
      throw new ApiError(404, 'Application not found', 'NOT_FOUND');
    }

    // Verify application is at 'offered' stage
    if (app.stage !== 'offered') {
      throw new ApiError(400, 'Application must be at offered stage', 'INVALID_STAGE');
    }

    // Verify recruiter owns the job
    if (app.job.recruiter.toString() !== req.user.id) {
      throw new ApiError(403, 'Not authorized to create offer for this application', 'FORBIDDEN');
    }

    // Check if offer already exists
    const existingOffer = await Offer.findOne({ application });
    if (existingOffer) {
      throw new ApiError(409, 'Offer already exists for this application', 'DUPLICATE_OFFER');
    }

    // Create offer
    const offer = await Offer.create({
      application,
      recruiter: req.user.id,
      candidate: app.candidate,
      salary,
      joiningDate,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: offer
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/offers - Recruiter: their offers, Candidate: their offers
exports.getOffers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let query = {};
    if (req.user.role === 'recruiter') {
      query.recruiter = req.user.id;
    } else if (req.user.role === 'candidate') {
      query.candidate = req.user.id;
    }

    const result = await paginate(Offer, query, page, limit, [
      { path: 'application', populate: { path: 'job', select: 'title' } },
      { path: 'candidate', select: 'name email' },
      { path: 'recruiter', select: 'name email' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Offers retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/offers/:id
exports.getOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate({ path: 'application', populate: { path: 'job', select: 'title' } })
      .populate('candidate', 'name email')
      .populate('recruiter', 'name email');

    if (!offer) {
      throw new ApiError(404, 'Offer not found', 'NOT_FOUND');
    }

    // Verify ownership
    const isRecruiter = offer.recruiter._id.toString() === req.user.id;
    const isCandidate = offer.candidate._id.toString() === req.user.id;

    if (!isRecruiter && !isCandidate) {
      throw new ApiError(403, 'Not authorized to view this offer', 'FORBIDDEN');
    }

    res.status(200).json({
      success: true,
      message: 'Offer retrieved successfully',
      data: offer
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/offers/:id/status
exports.updateOfferStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      throw new ApiError(404, 'Offer not found', 'NOT_FOUND');
    }

    // Handle recruiter actions
    if (req.user.role === 'recruiter') {
      if (offer.recruiter.toString() !== req.user.id) {
        throw new ApiError(403, 'Not authorized to update this offer', 'FORBIDDEN');
      }
      if (status !== 'withdrawn') {
        throw new ApiError(400, 'Recruiter can only withdraw offers', 'INVALID_STATUS');
      }
    }
    // Handle candidate actions
    else if (req.user.role === 'candidate') {
      if (offer.candidate.toString() !== req.user.id) {
        throw new ApiError(403, 'Not authorized to update this offer', 'FORBIDDEN');
      }
      if (!['accepted', 'rejected'].includes(status)) {
        throw new ApiError(400, 'Candidate can only accept or reject offers', 'INVALID_STATUS');
      }
      if (offer.status !== 'pending') {
        throw new ApiError(400, 'Can only update pending offers', 'INVALID_STATUS');
      }
    }

    offer.status = status;
    await offer.save();

    // If accepted, update application stage to hired
    if (status === 'accepted') {
      const application = await Application.findById(offer.application);
      application.stage = 'hired';
      application.stageHistory.push({
        stage: 'hired',
        changedAt: new Date(),
        changedBy: req.user.id,
        note: 'Offer accepted'
      });
      await application.save();
    }

    res.status(200).json({
      success: true,
      message: 'Offer status updated successfully',
      data: offer
    });
  } catch (err) {
    next(err);
  }
};

const Interview = require('../models/Interview');
const Application = require('../models/Application');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');

// @desc    Create interview
// @route   POST /api/interviews
// @access  Private/Recruiter
exports.createInterview = async (req, res, next) => {
  try {
    const { application, scheduledAt, mode, meetingLink, location, feedback } = req.body;

    // Verify application exists
    const appDoc = await Application.findById(application).populate('job');
    if (!appDoc) {
      throw new ApiError(404, 'Application not found', 'APPLICATION_NOT_FOUND');
    }

    // Verify recruiter owns the job
    if (appDoc.job.recruiter.toString() !== req.user.id) {
      throw new ApiError(403, 'You are not authorized to schedule interviews for this application', 'FORBIDDEN');
    }

    // Verify scheduledAt is in the future
    if (new Date(scheduledAt) <= new Date()) {
      throw new ApiError(400, 'Interview date must be in the future', 'INVALID_DATE');
    }

    const interview = await Interview.create({
      application,
      scheduledAt,
      mode,
      meetingLink,
      location,
      feedback,
      scheduledBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      data: interview
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get interviews
// @route   GET /api/interviews
// @access  Private
exports.getInterviews = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query);

    let query = {};
    if (req.user.role === 'recruiter') {
      query.scheduledBy = req.user.id;
    } else if (req.user.role === 'candidate') {
      // Find interviews for applications belonging to this candidate
      const candidateApps = await Application.find({ candidate: req.user.id }).select('_id');
      const appIds = candidateApps.map((a) => a._id);
      query.application = { $in: appIds };
    }

    const total = await Interview.countDocuments(query);
    const interviews = await Interview.find(query)
      .populate({
        path: 'application',
        populate: [
          { path: 'job', select: 'title company' },
          { path: 'candidate', select: 'name' }
        ]
      })
      .sort({ scheduledAt: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: 'Interviews retrieved successfully',
      data: interviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update interview
// @route   PUT /api/interviews/:id
// @access  Private/Recruiter
exports.updateInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      throw new ApiError(404, 'Interview not found', 'INTERVIEW_NOT_FOUND');
    }

    // Verify ownership
    if (interview.scheduledBy.toString() !== req.user.id) {
      throw new ApiError(403, 'You are not authorized to update this interview', 'FORBIDDEN');
    }

    // If updating scheduledAt, verify future date
    if (req.body.scheduledAt && new Date(req.body.scheduledAt) <= new Date()) {
      throw new ApiError(400, 'Interview date must be in the future', 'INVALID_DATE');
    }

    const updated = await Interview.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Interview updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

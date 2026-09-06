const Application = require('../models/Application');
const JobPosting = require('../models/JobPosting');
const CandidateProfile = require('../models/CandidateProfile');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');

// Valid stage transitions
const STAGE_TRANSITIONS = {
  applied: ['shortlisted', 'rejected'],
  shortlisted: ['interview', 'rejected'],
  interview: ['offered', 'rejected'],
  offered: ['hired', 'rejected'],
  hired: [],
  rejected: []
};

// @desc    Create job application
// @route   POST /api/applications
// @access  Private/Candidate
exports.createApplication = async (req, res, next) => {
  try {
    const { job, coverLetter } = req.body;

    // Verify job exists
    const jobPosting = await JobPosting.findById(job);
    if (!jobPosting) {
      throw new ApiError(404, 'Job not found', 'JOB_NOT_FOUND');
    }

    // Verify job is open
    if (jobPosting.status !== 'open') {
      throw new ApiError(400, 'This job is no longer accepting applications', 'JOB_NOT_ACTIVE');
    }

    // Check if candidate profile exists
    const profile = await CandidateProfile.findOne({ user: req.user.id });
    if (!profile) {
      throw new ApiError(400, 'Please create your candidate profile before applying', 'PROFILE_REQUIRED');
    }

    // Check for duplicate application
    const existingApp = await Application.findOne({
      job,
      candidate: req.user.id
    });
    if (existingApp) {
      throw new ApiError(409, 'You have already applied to this job', 'ALREADY_APPLIED');
    }

    // Create application
    const application = await Application.create({
      job,
      candidate: req.user.id,
      coverLetter,
      stage: 'applied',
      stageHistory: [
        {
          stage: 'applied',
          changedAt: new Date(),
          changedBy: req.user.id
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get applications
// @route   GET /api/applications
// @access  Private (Candidate: own apps, Recruiter: apps for their jobs)
exports.getApplications = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query);

    let query = {};

    if (req.user.role === 'candidate') {
      // Candidates see only their applications
      query.candidate = req.user.id;
    } else if (req.user.role === 'recruiter') {
      // Recruiters see applications for their jobs
      const recruiterJobs = await JobPosting.find({ recruiter: req.user.id }).select('_id');
      const jobIds = recruiterJobs.map((j) => j._id);
      query.job = { $in: jobIds };
    }

    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .populate('job', 'title company status')
      .populate('candidate', 'name email')
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name' }
      })
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: 'Applications retrieved successfully',
      data: applications,
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

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private (Candidate: own, Recruiter: their jobs)
exports.getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job', 'title description company recruiter')
      .populate('candidate', 'name email')
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name location' }
      });

    if (!application) {
      throw new ApiError(404, 'Application not found', 'APPLICATION_NOT_FOUND');
    }

    // Verify ownership
    const isCandidate = application.candidate._id.toString() === req.user.id;
    const isRecruiter = application.job.recruiter.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isCandidate && !isRecruiter && !isAdmin) {
      throw new ApiError(403, 'You are not authorized to view this application', 'FORBIDDEN');
    }

    res.status(200).json({
      success: true,
      message: 'Application retrieved successfully',
      data: application
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update application stage
// @route   PUT /api/applications/:id/stage
// @access  Private/Recruiter
exports.updateApplicationStage = async (req, res, next) => {
  try {
    const { stage, note } = req.body;

    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      throw new ApiError(404, 'Application not found', 'APPLICATION_NOT_FOUND');
    }

    // Verify recruiter owns the job
    if (application.job.recruiter.toString() !== req.user.id) {
      throw new ApiError(403, 'You are not authorized to update this application', 'FORBIDDEN');
    }

    const currentStage = application.stage;

    // Validate stage transition
    const validTransitions = STAGE_TRANSITIONS[currentStage];
    if (!validTransitions.includes(stage)) {
      throw new ApiError(
        400,
        `Invalid stage transition from '${currentStage}' to '${stage}'`,
        'INVALID_STAGE_TRANSITION'
      );
    }

    // Update stage
    application.stage = stage;
    application.stageHistory.push({
      stage,
      changedAt: new Date(),
      changedBy: req.user.id,
      note
    });

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application stage updated successfully',
      data: application
    });
  } catch (err) {
    next(err);
  }
};

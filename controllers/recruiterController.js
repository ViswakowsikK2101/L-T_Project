const Application = require('../models/Application');
const JobPosting = require('../models/JobPosting');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');

// GET /api/recruiter/jobs/:jobId/applicants - Recruiter only
exports.getApplicantsForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { stage } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Verify job exists
    const job = await JobPosting.findById(jobId);
    if (!job) {
      throw new ApiError(404, 'Job not found', 'NOT_FOUND');
    }

    // Verify recruiter owns the job
    if (job.recruiter.toString() !== req.user.id) {
      throw new ApiError(403, 'Not authorized to view applicants for this job', 'FORBIDDEN');
    }

    // Build query
    const query = { job: jobId };
    if (stage) {
      query.stage = stage;
    }

    const result = await paginate(Application, query, page, limit, {
      path: 'candidate',
      select: 'name email'
    });

    res.status(200).json({
      success: true,
      message: 'Applicants retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/recruiter/applicants - Recruiter only
exports.getAllApplicants = async (req, res, next) => {
  try {
    const { stage } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Find all jobs for this recruiter
    const jobs = await JobPosting.find({ recruiter: req.user.id }).select('_id');
    const jobIds = jobs.map(job => job._id);

    // Build query
    const query = { job: { $in: jobIds } };
    if (stage) {
      query.stage = stage;
    }

    const result = await paginate(Application, query, page, limit, [
      { path: 'job', select: 'title' },
      { path: 'candidate', select: 'name email' }
    ]);

    res.status(200).json({
      success: true,
      message: 'All applicants retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (err) {
    next(err);
  }
};

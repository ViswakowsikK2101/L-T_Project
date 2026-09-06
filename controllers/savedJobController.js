const SavedJob = require('../models/SavedJob');
const JobPosting = require('../models/JobPosting');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');

// POST /api/saved-jobs - Candidate only
exports.saveJob = async (req, res, next) => {
  try {
    const { job } = req.body;

    // Verify job exists
    const jobExists = await JobPosting.findById(job);
    if (!jobExists) {
      throw new ApiError(404, 'Job not found', 'NOT_FOUND');
    }

    // Check duplicate
    const existing = await SavedJob.findOne({ candidate: req.user.id, job });
    if (existing) {
      throw new ApiError(409, 'Job already saved', 'ALREADY_SAVED');
    }

    const savedJob = await SavedJob.create({ candidate: req.user.id, job });
    res.status(201).json({
      success: true,
      message: 'Job saved successfully',
      data: savedJob
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/saved-jobs - Candidate only
exports.getSavedJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const query = { candidate: req.user.id };
    const result = await paginate(SavedJob, query, page, limit, {
      path: 'job',
      select: 'title location status salaryRange experienceLevel',
      populate: { path: 'company', select: 'name' }
    });

    res.status(200).json({
      success: true,
      message: 'Saved jobs retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/saved-jobs/:jobId - Candidate only
exports.removeSavedJob = async (req, res, next) => {
  try {
    const savedJob = await SavedJob.findOneAndDelete({
      candidate: req.user.id,
      job: req.params.jobId
    });

    if (!savedJob) {
      throw new ApiError(404, 'Saved job not found', 'NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      message: 'Saved job removed successfully'
    });
  } catch (err) {
    next(err);
  }
};

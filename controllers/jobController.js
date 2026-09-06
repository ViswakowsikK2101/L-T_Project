const JobPosting = require('../models/JobPosting');
const Company = require('../models/Company');
const ApiError = require('../utils/ApiError');
const paginate = require('../utils/pagination');

// @desc    Create a job posting
// @route   POST /api/jobs
// @access  Private/Recruiter
exports.createJob = async (req, res, next) => {
  try {
    const { company, salaryRange } = req.body;

    // Verify company exists
    const companyDoc = await Company.findById(company);
    if (!companyDoc) {
      throw new ApiError(404, 'Company not found', 'COMPANY_NOT_FOUND');
    }

    // Verify recruiter is part of the company
    const isRecruiter = companyDoc.recruiters
      .map((r) => r.toString())
      .includes(req.user.id);

    if (!isRecruiter) {
      throw new ApiError(403, 'You are not authorized to post jobs for this company', 'FORBIDDEN');
    }

    // Validate salary range
    if (salaryRange && salaryRange.min > salaryRange.max) {
      throw new ApiError(400, 'Salary minimum cannot exceed maximum', 'INVALID_SALARY_RANGE');
    }

    // Set recruiter
    req.body.recruiter = req.user.id;

    const job = await JobPosting.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      data: job
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all jobs with search, filter, and pagination
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Create filters object and remove pagination keys
    const filters = { ...req.query };
    delete filters.page;
    delete filters.limit;

    const query = {};

    // Filter by status (default: open)
    query.status = filters.status || 'open';

    // Search by title (case-insensitive)
    if (filters.title) {
      query.title = { $regex: filters.title, $options: 'i' };
    }

    // Filter by location (case-insensitive)
    if (filters.location) {
      query.location = { $regex: filters.location, $options: 'i' };
    }

    // Filter by skills (accepts comma-separated or array)
    if (filters.skills) {
      const skillsArray = Array.isArray(filters.skills)
        ? filters.skills
        : filters.skills.split(',').map((s) => s.trim());
      query.skills = { $in: skillsArray };
    }

    // Filter by experience level
    if (filters.experienceLevel) {
      query.experienceLevel = filters.experienceLevel;
    }

    const total = await JobPosting.countDocuments(query);
    const jobs = await JobPosting.find(query)
      .populate('company', 'name location')
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: 'Jobs retrieved successfully',
      data: jobs,
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

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res, next) => {
  try {
    const job = await JobPosting.findById(req.params.id)
      .populate('company', 'name description location website')
      .populate('recruiter', 'name email');

    if (!job) {
      throw new ApiError(404, 'Job not found', 'JOB_NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      message: 'Job retrieved successfully',
      data: job
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update job posting
// @route   PUT /api/jobs/:id
// @access  Private/Recruiter (owner only)
exports.updateJob = async (req, res, next) => {
  try {
    const job = await JobPosting.findById(req.params.id);

    if (!job) {
      throw new ApiError(404, 'Job not found', 'JOB_NOT_FOUND');
    }

    // Verify ownership
    if (job.recruiter.toString() !== req.user.id) {
      throw new ApiError(403, 'You are not authorized to update this job', 'FORBIDDEN');
    }

    // Validate salary range if being updated
    if (req.body.salaryRange) {
      const { min, max } = req.body.salaryRange;
      if (min && max && min > max) {
        throw new ApiError(400, 'Salary minimum cannot exceed maximum', 'INVALID_SALARY_RANGE');
      }
    }

    // Prevent overwriting recruiter or company
    delete req.body.recruiter;
    delete req.body.company;

    const updated = await JobPosting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete (close) job posting
// @route   DELETE /api/jobs/:id
// @access  Private/Recruiter (owner only)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await JobPosting.findById(req.params.id);

    if (!job) {
      throw new ApiError(404, 'Job not found', 'JOB_NOT_FOUND');
    }

    // Verify ownership
    if (job.recruiter.toString() !== req.user.id) {
      throw new ApiError(403, 'You are not authorized to delete this job', 'FORBIDDEN');
    }

    // Soft delete: set status to closed
    job.status = 'closed';
    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job closed successfully',
      data: job
    });
  } catch (err) {
    next(err);
  }
};

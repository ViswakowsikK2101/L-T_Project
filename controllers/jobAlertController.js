const JobAlert = require('../models/JobAlert');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');

// POST /api/job-alerts - Candidate only
exports.createAlert = async (req, res, next) => {
  try {
    const alertData = {
      ...req.body,
      candidate: req.user.id
    };

    const alert = await JobAlert.create(alertData);

    res.status(201).json({
      success: true,
      message: 'Job alert created successfully',
      data: alert
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/job-alerts - Candidate only
exports.getAlerts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const query = { candidate: req.user.id };
    const result = await paginate(JobAlert, query, page, limit);

    res.status(200).json({
      success: true,
      message: 'Job alerts retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/job-alerts/:id - Candidate only
exports.deleteAlert = async (req, res, next) => {
  try {
    const alert = await JobAlert.findById(req.params.id);

    if (!alert) {
      throw new ApiError(404, 'Job alert not found', 'NOT_FOUND');
    }

    // Verify ownership
    if (alert.candidate.toString() !== req.user.id) {
      throw new ApiError(403, 'Not authorized to delete this alert', 'FORBIDDEN');
    }

    await alert.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job alert deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

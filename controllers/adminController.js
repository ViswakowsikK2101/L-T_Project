const Application = require('../models/Application');
const Company = require('../models/Company');
const JobPosting = require('../models/JobPosting');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

// GET /api/admin/reports/funnel - Admin only
exports.getHiringFunnel = async (req, res, next) => {
  try {
    const funnelStats = await Application.aggregate([
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 }
        }
      }
    ]);

    const counts = funnelStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {
      applied: 0, shortlisted: 0, interview: 0, offered: 0, hired: 0, rejected: 0
    });

    const totalApplications = Object.values(counts).reduce((a, b) => a + b, 0);

    const conversionRates = {
      shortlisted_to_applied: counts.applied > 0 ? (counts.shortlisted / counts.applied) * 100 : 0,
      interview_to_shortlisted: counts.shortlisted > 0 ? (counts.interview / counts.shortlisted) * 100 : 0,
      offered_to_interview: counts.interview > 0 ? (counts.offered / counts.interview) * 100 : 0,
      hired_to_offered: counts.offered > 0 ? (counts.hired / counts.offered) * 100 : 0
    };

    const stats = {
      totalApplications,
      counts,
      conversionRates,
      totalCompanies: await Company.countDocuments(),
      totalRecruiters: await User.countDocuments({ role: 'recruiter' }),
      totalCandidates: await User.countDocuments({ role: 'candidate' }),
      totalJobs: await JobPosting.countDocuments(),
      activeJobs: await JobPosting.countDocuments({ status: 'open' })
    };

    res.status(200).json({
      success: true,
      message: 'Hiring funnel report retrieved successfully',
      data: stats
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};

    // Pagination (manual)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
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

// GET /api/admin/companies
exports.getCompanies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const companies = await Company.find()
      .populate('recruiters', 'name email')
      .skip(skip)
      .limit(limit);

    const total = await Company.countDocuments();

    res.status(200).json({
      success: true,
      data: companies,
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

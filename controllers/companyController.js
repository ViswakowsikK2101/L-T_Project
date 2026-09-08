const Company = require('../models/Company');
const ApiError = require('../utils/ApiError');

// @desc    Create a company
// @route   POST /api/companies
// @access  Private/Recruiter
exports.createCompany = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;

    // Ensure the creating recruiter is in the recruiters array
    if (!req.body.recruiters) {
      req.body.recruiters = [];
    }
    if (!req.body.recruiters.includes(req.user.id)) {
      req.body.recruiters.push(req.user.id);
    }

    const company = await Company.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single company by ID
// @route   GET /api/companies/:id
// @access  Public
exports.getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('recruiters', 'name email')
      .populate('createdBy', 'name email');

    if (!company) {
      throw new ApiError(404, 'Company not found', 'COMPANY_NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      message: 'Company retrieved successfully',
      data: company
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private/Recruiter (owner or member)
exports.updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      throw new ApiError(404, 'Company not found', 'COMPANY_NOT_FOUND');
    }

    // Check ownership: recruiter must be in recruiters array or be the creator
    const isRecruiter = company.recruiters
      .map((r) => r.toString())
      .includes(req.user.id);
    const isCreator = company.createdBy.toString() === req.user.id;

    if (!isRecruiter && !isCreator) {
      throw new ApiError(403, 'You are not authorized to update this company', 'FORBIDDEN');
    }

    // Prevent overwriting critical fields from body
    delete req.body.createdBy;

    const updated = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private/Recruiter (creator only)
exports.deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      throw new ApiError(404, 'Company not found', 'COMPANY_NOT_FOUND');
    }

    // Only the creator can delete
    if (company.createdBy.toString() !== req.user.id) {
      throw new ApiError(403, 'Only the company creator can delete it', 'FORBIDDEN');
    }

    await Company.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully',
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    List all companies
// @route   GET /api/companies
// @access  Public
exports.getCompanies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: 'i' };
    }

    const total = await Company.countDocuments(query);
    const companies = await Company.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: 'Companies retrieved successfully',
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

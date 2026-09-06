const CandidateProfile = require('../models/CandidateProfile');
const ApiError = require('../utils/ApiError');

// @desc    Create candidate profile
// @route   POST /api/candidates/profile
// @access  Private/Candidate
exports.createProfile = async (req, res, next) => {
  try {
    // Check if profile already exists
    const existingProfile = await CandidateProfile.findOne({ user: req.user.id });
    if (existingProfile) {
      throw new ApiError(409, 'Profile already exists for this user', 'PROFILE_EXISTS');
    }

    // Set user from JWT
    req.body.user = req.user.id;

    const profile = await CandidateProfile.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Candidate profile created successfully',
      data: profile
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get own candidate profile
// @route   GET /api/candidates/profile
// @access  Private/Candidate
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await CandidateProfile.findOne({ user: req.user.id }).populate(
      'user',
      'name email'
    );

    if (!profile) {
      throw new ApiError(404, 'Profile not found', 'PROFILE_NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profile
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update candidate profile
// @route   PUT /api/candidates/profile
// @access  Private/Candidate
exports.updateProfile = async (req, res, next) => {
  try {
    // Prevent user field from being updated
    delete req.body.user;

    const profile = await CandidateProfile.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!profile) {
      throw new ApiError(404, 'Profile not found. Please create a profile first.', 'PROFILE_NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (err) {
    next(err);
  }
};

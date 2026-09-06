const mongoose = require('mongoose');

const candidateProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    experienceYears: {
      type: Number,
      min: [0, 'Experience years cannot be negative'],
      default: 0,
    },
    resumeSummary: {
      type: String,
    },
    education: {
      type: String,
    },
    location: {
      type: String,
    },
    phone: {
      type: String,
    },
  },
  { timestamps: true }
);

candidateProfileSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('CandidateProfile', candidateProfileSchema);

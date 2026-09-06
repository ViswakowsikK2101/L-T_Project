const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recruiter is required'],
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'At least one skill is required',
      },
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    salaryRange: {
      min: { type: Number },
      max: { type: Number },
    },
    experienceLevel: {
      type: String,
      enum: ['entry', 'junior', 'mid', 'senior', 'lead'],
      required: [true, 'Experience level is required'],
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      default: 'full-time',
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'draft'],
      default: 'open',
    },
    applicationDeadline: {
      type: Date,
    },
  },
  { timestamps: true }
);

jobPostingSchema.index({ company: 1 });
jobPostingSchema.index({ status: 1 });
jobPostingSchema.index({ location: 1 });
jobPostingSchema.index({ skills: 1 });
jobPostingSchema.index({ experienceLevel: 1 });
jobPostingSchema.index({ title: 'text', skills: 'text', location: 'text' });

module.exports = mongoose.model('JobPosting', jobPostingSchema);

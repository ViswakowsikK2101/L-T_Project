const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPosting',
      required: [true, 'Job reference is required'],
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Candidate reference is required'],
    },
    stage: {
      type: String,
      enum: ['applied', 'shortlisted', 'interview', 'offered', 'hired', 'rejected'],
      default: 'applied',
    },
    coverLetter: {
      type: String,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    stageHistory: [
      {
        stage: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Prevent duplicate applications: one candidate per job
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
applicationSchema.index({ job: 1 });
applicationSchema.index({ candidate: 1 });
applicationSchema.index({ stage: 1 });

module.exports = mongoose.model('Application', applicationSchema);

const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Application reference is required'],
    },
    scheduledAt: {
      type: Date,
      required: [true, 'Scheduled date/time is required'],
    },
    mode: {
      type: String,
      enum: ['in-person', 'video', 'phone'],
      required: [true, 'Interview mode is required'],
    },
    meetingLink: {
      type: String,
    },
    location: {
      type: String,
    },
    feedback: {
      type: String,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    scheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Scheduler reference is required'],
    },
  },
  { timestamps: true }
);

interviewSchema.index({ application: 1 });

module.exports = mongoose.model('Interview', interviewSchema);

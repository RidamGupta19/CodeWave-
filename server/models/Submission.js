const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    domain: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true },
    topic: { type: String, required: true, trim: true },
    language: {
      type: String,
      enum: ['Java', 'Python', 'C++', 'JavaScript'],
      required: true
    },
    code: { type: String, required: true },
    status: {
      type: String,
      enum: [
        'Accepted',
        'Wrong Answer',
        'Runtime Error',
        'Compilation Error',
        'Time Limit Exceeded',
        'Judge Error'
      ],
      required: true
    },
    passedTestCases: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 },
    runtime: { type: String, default: '' },
    memory: { type: String, default: '' },
    errorMessage: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

submissionSchema.index({ user: 1, submittedAt: -1 });
submissionSchema.index({ problem: 1, submittedAt: -1 });
submissionSchema.index({ domain: 1, submittedAt: -1 });

module.exports = mongoose.model('Submission', submissionSchema);

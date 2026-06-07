const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  totalFees: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  remainingAmount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date
  },
  paymentDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Paid', 'Partial', 'Pending'],
    default: 'Pending'
  }
}, { timestamps: true });

// Pre-save to calculate remaining amount
feeSchema.pre('save', function(next) {
  this.remainingAmount = this.totalFees - this.paidAmount;
  if (this.remainingAmount <= 0) {
    this.status = 'Paid';
    this.remainingAmount = 0;
  } else if (this.paidAmount > 0) {
    this.status = 'Partial';
  } else {
    this.status = 'Pending';
  }
  next();
});

module.exports = mongoose.model('Fee', feeSchema);

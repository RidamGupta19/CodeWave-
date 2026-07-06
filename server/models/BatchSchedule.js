const mongoose = require('mongoose');

const extraClassSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // e.g. "19:00"
  endTime: { type: String, required: true },
  topic: { type: String, default: '' }
}, { _id: false });

const batchScheduleSchema = new mongoose.Schema({
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true,
    unique: true
  },
  classDays: [{
    type: String, // e.g. "Monday", "Wednesday"
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  startTime: {
    type: String, // e.g. "19:00" or "07:00 PM"
    default: ''
  },
  endTime: {
    type: String, // e.g. "21:00" or "09:00 PM"
    default: ''
  },
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  holidayDates: [{
    date: { type: Date },
    name: { type: String, default: 'Holiday' }
  }],
  extraClasses: [extraClassSchema],
  cancelledClasses: [{
    date: { type: Date },
    reason: { type: String, default: 'Cancelled' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('BatchSchedule', batchScheduleSchema);

const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  materialType: {
    type: String,
    enum: ['PDF', 'Assignment', 'Notes', 'Practice Sheet', 'Video'],
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  version: {
    type: Number,
    default: 1
  },
  versions: [{
    versionNumber: Number,
    title: String,
    description: String,
    fileUrl: String,
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  downloadCount: {
    type: Number,
    default: 0
  },
  downloads: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    downloadedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);

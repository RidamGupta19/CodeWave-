const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  phaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase', required: true },
  domainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  estimatedTime: { type: String, default: '2-4 hours' },
  order: { type: Number, default: 0 },
  
  // Resource links
  theoryLink: { type: String, default: '' },
  gfgLink: { type: String, default: '' },
  youtubeLink: { type: String, default: '' },
  documentationLink: { type: String, default: '' },
  practiceLink: { type: String, default: '' },
  notesLink: { type: String, default: '' },
  
  // Learning Content
  instructor: { type: String, default: '' },
  challenge: { type: String, default: '' },
  theoryNotes: { type: String, default: '' },
  
  isRequired: { type: Boolean, default: true },
  unlockAfterPreviousTopic: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },

  // Checkpoint Module Support (for Level 0 "Start Coding" style modules)
  isCheckpointModule: { type: Boolean, default: false },
  checkpoints: [{
    id: { type: String },
    label: { type: String },
    description: { type: String },
    youtubeLink: { type: String, default: null }
  }]
}, { timestamps: true });

topicSchema.index({ phaseId: 1, order: 1 });

module.exports = mongoose.model('Topic', topicSchema);

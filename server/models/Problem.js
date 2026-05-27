const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema(
  {
    input: { type: String, default: '' },
    output: { type: String, default: '' },
    explanation: { type: String, default: '' }
  },
  { _id: false }
);

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, default: '' },
    expectedOutput: { type: String, default: '' },
    explanation: { type: String, default: '' }
  },
  { _id: false }
);

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    url: { type: String, default: '' },
    type: { type: String, default: 'reference' }
  },
  { _id: false }
);

const codeSchema = new mongoose.Schema(
  {
    java: { type: String, default: '' },
    python: { type: String, default: '' },
    cpp: { type: String, default: '' },
    javascript: { type: String, default: '' }
  },
  { _id: false }
);

const toSlug = (value = '') =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    domain: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true },
    phase: { type: mongoose.Schema.Types.ObjectId, ref: 'Phase', default: null },
    topic: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    problemType: {
      type: String,
      enum: ['Coding', 'MCQ', 'Theory', 'Debugging'],
      default: 'Coding'
    },
    description: { type: String, required: true },
    inputFormat: { type: String, default: '' },
    outputFormat: { type: String, default: '' },
    constraints: { type: String, default: '' },
    examples: { type: [exampleSchema], default: [] },
    visibleTestCases: { type: [testCaseSchema], default: [] },
    hiddenTestCases: { type: [testCaseSchema], default: [] },
    starterCode: { type: codeSchema, default: () => ({}) },
    functionSignature: { type: codeSchema, default: () => ({}) },
    expectedComplexity: { type: String, default: '' },
    hints: { type: [String], default: [] },
    editorial: { type: String, default: '' },
    tags: { type: [String], default: [] },
    relatedResources: { type: [resourceSchema], default: [] },
    isPublished: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

problemSchema.pre('validate', function preValidate(next) {
  if (!this.slug && this.title) {
    this.slug = toSlug(this.title);
  } else if (this.slug) {
    this.slug = toSlug(this.slug);
  }

  this.tags = (this.tags || [])
    .map((tag) => tag.toString().trim())
    .filter(Boolean);

  this.hints = (this.hints || [])
    .map((hint) => hint.toString().trim())
    .filter(Boolean);

  next();
});

problemSchema.index({ domain: 1, topic: 1, difficulty: 1 });
problemSchema.index({ domain: 1, phase: 1 });
problemSchema.index({ problemType: 1, isPublished: 1 });
problemSchema.index({ tags: 1 });

module.exports = mongoose.model('Problem', problemSchema);

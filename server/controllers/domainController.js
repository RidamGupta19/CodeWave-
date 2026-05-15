const Domain = require('../models/Domain');
const Phase = require('../models/Phase');
const Topic = require('../models/Topic');
const Assessment = require('../models/Assessment');
const Badge = require('../models/Badge');

// @desc    Get all domains
// @route   GET /api/domains
exports.getDomains = async (req, res) => {
  try {
    const domains = await Domain.find({ isActive: true }).sort('order');
    res.json({ success: true, data: domains });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single domain
// @route   GET /api/domains/:id
exports.getDomain = async (req, res) => {
  try {
    const domain = await Domain.findById(req.params.id);
    if (!domain) return res.status(404).json({ success: false, message: 'Domain not found' });
    
    const phases = await Phase.find({ domainId: domain._id }).sort('phaseNumber');
    const assessments = await Assessment.find({ domainId: domain._id }).sort('order');
    const badges = await Badge.find({ domainId: domain._id }).sort('order');

    res.json({ success: true, data: { domain, phases, assessments, badges } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create domain (admin)
// @route   POST /api/domains
exports.createDomain = async (req, res) => {
  try {
    const domain = await Domain.create(req.body);
    res.status(201).json({ success: true, data: domain });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update domain (admin)
// @route   PUT /api/domains/:id
exports.updateDomain = async (req, res) => {
  try {
    const domain = await Domain.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!domain) return res.status(404).json({ success: false, message: 'Domain not found' });
    res.json({ success: true, data: domain });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete domain (admin)
// @route   DELETE /api/domains/:id
exports.deleteDomain = async (req, res) => {
  try {
    const domain = await Domain.findByIdAndDelete(req.params.id);
    if (!domain) return res.status(404).json({ success: false, message: 'Domain not found' });
    // Clean up related data
    await Phase.deleteMany({ domainId: req.params.id });
    await Topic.deleteMany({ domainId: req.params.id });
    await Assessment.deleteMany({ domainId: req.params.id });
    await Badge.deleteMany({ domainId: req.params.id });
    res.json({ success: true, message: 'Domain deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

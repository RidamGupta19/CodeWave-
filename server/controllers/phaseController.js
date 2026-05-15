const Phase = require('../models/Phase');
const Topic = require('../models/Topic');

// @desc    Get phases for a domain
// @route   GET /api/phases/domain/:domainId
exports.getPhasesByDomain = async (req, res) => {
  try {
    const phases = await Phase.find({ domainId: req.params.domainId, isActive: true }).sort('phaseNumber');
    res.json({ success: true, data: phases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single phase with topics
// @route   GET /api/phases/:id
exports.getPhase = async (req, res) => {
  try {
    const phase = await Phase.findById(req.params.id).populate('domainId');
    if (!phase) return res.status(404).json({ success: false, message: 'Phase not found' });
    
    const topics = await Topic.find({ phaseId: phase._id, isActive: true }).sort('order');
    res.json({ success: true, data: { phase, topics } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create phase (admin)
exports.createPhase = async (req, res) => {
  try {
    const phase = await Phase.create(req.body);
    res.status(201).json({ success: true, data: phase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update phase (admin)
exports.updatePhase = async (req, res) => {
  try {
    const phase = await Phase.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!phase) return res.status(404).json({ success: false, message: 'Phase not found' });
    res.json({ success: true, data: phase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete phase (admin)
exports.deletePhase = async (req, res) => {
  try {
    const phase = await Phase.findByIdAndDelete(req.params.id);
    if (!phase) return res.status(404).json({ success: false, message: 'Phase not found' });
    await Topic.deleteMany({ phaseId: req.params.id });
    res.json({ success: true, message: 'Phase deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

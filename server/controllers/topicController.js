const Topic = require('../models/Topic');

// @desc    Get topics for a phase
// @route   GET /api/topics/phase/:phaseId
exports.getTopicsByPhase = async (req, res) => {
  try {
    const topics = await Topic.find({ phaseId: req.params.phaseId, isActive: true }).sort('order');
    res.json({ success: true, data: topics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single topic
// @route   GET /api/topics/:id
exports.getTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate('phaseId').populate('domainId');
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });
    
    const Badge = require('../models/Badge');
    const badge = await Badge.findOne({ topicId: topic._id });
    
    res.json({ 
      success: true, 
      data: {
        ...topic.toObject(),
        badge
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create topic (admin)
exports.createTopic = async (req, res) => {
  try {
    const topic = await Topic.create(req.body);
    res.status(201).json({ success: true, data: topic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update topic (admin)
exports.updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });
    res.json({ success: true, data: topic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete topic (admin)
exports.deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) return res.status(404).json({ success: false, message: 'Topic not found' });
    res.json({ success: true, message: 'Topic deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all topics (admin)
exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().populate('phaseId').populate('domainId').sort('order');
    res.json({ success: true, data: topics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

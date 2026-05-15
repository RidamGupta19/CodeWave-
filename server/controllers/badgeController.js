const Badge = require('../models/Badge');

exports.getBadgesByDomain = async (req, res) => {
  try {
    const badges = await Badge.find({ domainId: req.params.domainId, isActive: true }).sort('order');
    res.json({ success: true, data: badges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find().populate('domainId').sort('order');
    res.json({ success: true, data: badges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBadge = async (req, res) => {
  try {
    const badge = await Badge.create(req.body);
    res.status(201).json({ success: true, data: badge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBadge = async (req, res) => {
  try {
    const badge = await Badge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!badge) return res.status(404).json({ success: false, message: 'Badge not found' });
    res.json({ success: true, data: badge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBadge = async (req, res) => {
  try {
    await Badge.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Badge deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

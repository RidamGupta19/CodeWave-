const Resource = require('../models/Resource');

exports.getResources = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.domainId) filter.domainId = req.query.domainId;
    if (req.query.type) filter.type = req.query.type;
    const resources = await Resource.find(filter).populate('domainId').sort('order');
    res.json({ success: true, data: resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createResource = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.json({ success: true, data: resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

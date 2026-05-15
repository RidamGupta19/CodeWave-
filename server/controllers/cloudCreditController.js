const CloudCredit = require('../models/CloudCredit');

exports.getCloudCredits = async (req, res) => {
  try {
    const credits = await CloudCredit.find({ isActive: true }).sort('order');
    res.json({ success: true, data: credits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCloudCredit = async (req, res) => {
  try {
    const credit = await CloudCredit.create(req.body);
    res.status(201).json({ success: true, data: credit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCloudCredit = async (req, res) => {
  try {
    const credit = await CloudCredit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!credit) return res.status(404).json({ success: false, message: 'Cloud credit not found' });
    res.json({ success: true, data: credit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCloudCredit = async (req, res) => {
  try {
    await CloudCredit.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Cloud credit deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

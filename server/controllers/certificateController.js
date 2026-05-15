const Certificate = require('../models/Certificate');

exports.getUserCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ userId: req.user._id, isActive: true }).populate('domainId');
    res.json({ success: true, data: certs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find().populate('userId', 'fullName email').populate('domainId');
    res.json({ success: true, data: certs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCertificate = async (req, res) => {
  try {
    const cert = await Certificate.create(req.body);
    res.status(201).json({ success: true, data: cert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

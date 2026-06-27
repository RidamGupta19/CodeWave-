const CloudCredit = require('../models/CloudCredit');
const CloudCreditClaim = require('../models/CloudCreditClaim');

// @desc    Get active cloud credit listings
// @route   GET /api/cloud-credits
exports.getCloudCredits = async (req, res) => {
  try {
    const credits = await CloudCredit.find({ isActive: true }).sort('order');
    res.json({ success: true, data: credits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a cloud credit listing (admin)
// @route   POST /api/cloud-credits
exports.createCloudCredit = async (req, res) => {
  try {
    const credit = await CloudCredit.create(req.body);
    res.status(201).json({ success: true, data: credit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a cloud credit listing (admin)
// @route   PUT /api/cloud-credits/:id
exports.updateCloudCredit = async (req, res) => {
  try {
    const credit = await CloudCredit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!credit) return res.status(404).json({ success: false, message: 'Cloud credit not found' });
    res.json({ success: true, data: credit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a cloud credit listing (admin)
// @route   DELETE /api/cloud-credits/:id
exports.deleteCloudCredit = async (req, res) => {
  try {
    await CloudCredit.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Cloud credit deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Claim a cloud credit perk
// @route   POST /api/cloud-credits/claim/:id
exports.claimCloudCredit = async (req, res) => {
  try {
    const creditId = req.params.id;
    const userId = req.user._id;

    // Check if cloud credit exists
    const credit = await CloudCredit.findById(creditId);
    if (!credit) {
      return res.status(404).json({ success: false, message: 'Cloud credit perk not found' });
    }

    // Check if already claimed to prevent duplicate checks
    const existing = await CloudCreditClaim.findOne({ user: userId, cloudCredit: creditId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already claimed this cloud credit perk' });
    }

    // Assign a mock/real voucher code
    const voucherCode = `CW-${credit.platform.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const amount = credit.platform === 'Google Cloud' ? 300 : credit.platform === 'Azure' ? 100 : 50;

    // Create the claim. Unique compound index { user, cloudCredit } prevents concurrent race condition duplicates.
    const claim = await CloudCreditClaim.create({
      user: userId,
      cloudCredit: creditId,
      status: credit.isFree ? 'approved' : 'pending', // auto-approve if free tier resource, otherwise pending admin verification
      voucherCode,
      amount
    });

    res.status(201).json({ success: true, data: claim });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error due to race condition
      return res.status(400).json({ success: false, message: 'You have already claimed this cloud credit perk' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's claims and credit statistics
// @route   GET /api/cloud-credits/my-claims
exports.getMyClaims = async (req, res) => {
  try {
    const userId = req.user._id;
    const claims = await CloudCreditClaim.find({ user: userId }).populate('cloudCredit');

    // Calculate credit statistics
    let totalClaimed = 0;
    let pendingCount = 0;
    let approvedCount = 0;

    claims.forEach(c => {
      if (c.status === 'approved') {
        totalClaimed += c.amount;
        approvedCount++;
      } else if (c.status === 'pending') {
        pendingCount++;
      }
    });

    res.json({
      success: true,
      data: claims,
      stats: {
        totalCredits: totalClaimed,
        approvedCount,
        pendingCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all claims for admin
// @route   GET /api/cloud-credits/admin/claims
exports.getAdminClaims = async (req, res) => {
  try {
    const claims = await CloudCreditClaim.find()
      .populate('user', 'fullName email')
      .populate('cloudCredit')
      .sort('-createdAt');
    res.json({ success: true, data: claims });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or reject a claim (admin)
// @route   PUT /api/cloud-credits/admin/claims/:id
exports.updateClaimStatus = async (req, res) => {
  try {
    const { status, voucherCode } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updateFields = { status };
    if (voucherCode !== undefined) {
      updateFields.voucherCode = voucherCode;
    }

    const claim = await CloudCreditClaim.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).populate('user', 'fullName email').populate('cloudCredit');

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    res.json({ success: true, data: claim });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const InstituteSettings = require('../models/InstituteSettings');

// Retrieve settings (initializes default settings if none exist)
exports.getSettings = async (req, res) => {
  try {
    let settings = await InstituteSettings.findOne({});
    if (!settings) {
      settings = await InstituteSettings.create({});
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update settings
exports.updateSettings = async (req, res) => {
  try {
    let settings = await InstituteSettings.findOne({});
    if (!settings) {
      settings = new InstituteSettings({});
    }

    const {
      name,
      logo,
      address,
      contactDetails,
      sessions,
      holidays,
      workingDays,
      timetable,
      passwordPolicies,
      sessionTimeout,
      loginSecurity,
      uploadLimits,
      allowedFileTypes,
      videoLimits,
      smtp,
      pushNotifications,
      announcementSettings
    } = req.body;

    if (name !== undefined) settings.name = name;
    if (logo !== undefined) settings.logo = logo;
    if (address !== undefined) settings.address = address;
    
    if (contactDetails !== undefined) {
      settings.contactDetails = { ...settings.contactDetails, ...contactDetails };
    }
    if (sessions !== undefined) settings.sessions = sessions;
    if (holidays !== undefined) settings.holidays = holidays;
    if (workingDays !== undefined) settings.workingDays = workingDays;
    
    if (timetable !== undefined) {
      settings.timetable = { ...settings.timetable, ...timetable };
    }
    if (passwordPolicies !== undefined) {
      settings.passwordPolicies = { ...settings.passwordPolicies, ...passwordPolicies };
    }
    if (sessionTimeout !== undefined) settings.sessionTimeout = sessionTimeout;
    
    if (loginSecurity !== undefined) {
      settings.loginSecurity = { ...settings.loginSecurity, ...loginSecurity };
    }
    if (uploadLimits !== undefined) settings.uploadLimits = uploadLimits;
    if (allowedFileTypes !== undefined) settings.allowedFileTypes = allowedFileTypes;
    if (videoLimits !== undefined) settings.videoLimits = videoLimits;
    
    if (smtp !== undefined) {
      settings.smtp = { ...settings.smtp, ...smtp };
    }
    if (pushNotifications !== undefined) {
      settings.pushNotifications = { ...settings.pushNotifications, ...pushNotifications };
    }
    if (announcementSettings !== undefined) {
      settings.announcementSettings = { ...settings.announcementSettings, ...announcementSettings };
    }

    await settings.save();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

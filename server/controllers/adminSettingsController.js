const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const PlatformSettings = require('../models/PlatformSettings');
const NotificationSettings = require('../models/NotificationSettings');
const SMTPSettings = require('../models/SMTPSettings');
const StorageSettings = require('../models/StorageSettings');
const SystemPreferences = require('../models/SystemPreferences');
const AuditLogs = require('../models/AuditLogs');
const AdminPermissions = require('../models/AdminPermissions');
const UserSession = require('../models/UserSession');
const User = require('../models/User');

// Helper to log changes to AuditLogs
const logAudit = async (req, action, details, previousValue, newValue) => {
  try {
    await AuditLogs.create({
      userId: req.user._id,
      userEmail: req.user.email,
      action,
      details,
      previousValue,
      newValue,
      ipAddress: req.ip,
      deviceInfo: req.headers['user-agent'] || 'Unknown'
    });
  } catch (err) {
    console.error('Failed to log audit activity:', err.message);
  }
};

// 1. Get Merged Settings
exports.getSettings = async (req, res) => {
  try {
    let platform = await PlatformSettings.findOne({});
    if (!platform) platform = await PlatformSettings.create({});

    let alerts = await NotificationSettings.findOne({});
    if (!alerts) alerts = await NotificationSettings.create({});

    let smtp = await SMTPSettings.findOne({});
    if (!smtp) smtp = await SMTPSettings.create({});

    let storage = await StorageSettings.findOne({});
    if (!storage) storage = await StorageSettings.create({});

    let system = await SystemPreferences.findOne({});
    if (!system) system = await SystemPreferences.create({});

    // Mask SMTP password
    const smtpData = smtp.toObject();
    smtpData.password = smtpData.password ? '••••••••' : '';

    res.json({
      success: true,
      data: {
        profile: {
          instituteName: platform.instituteName,
          logo: platform.logo,
          address: platform.address,
          contactNumber: platform.contactNumber,
          supportEmail: platform.supportEmail,
          websiteUrl: platform.websiteUrl,
          socialMediaLinks: platform.socialMediaLinks,
          timezone: platform.timezone,
          language: platform.language,
          themeSettings: platform.themeSettings
        },
        academic: {
          academicYear: platform.academicYear,
          sessionStartDate: platform.sessionStartDate,
          sessionEndDate: platform.sessionEndDate,
          workingDays: platform.workingDays,
          holidays: platform.holidays,
          attendanceRules: platform.attendanceRules,
          passingPercentage: platform.passingPercentage,
          assignmentSubmissionRules: platform.assignmentSubmissionRules,
          assessmentConfiguration: platform.assessmentConfiguration,
          courseDuration: platform.courseDuration,
          batchTimings: platform.batchTimings
        },
        auth: {
          passwordPolicy: platform.passwordPolicy,
          sessionTimeout: platform.sessionTimeout,
          loginSecurity: platform.loginSecurity
        },
        smtp: smtpData,
        storage,
        alerts,
        system
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Update Profile Settings
exports.updateProfile = async (req, res) => {
  try {
    let platform = await PlatformSettings.findOne({});
    if (!platform) platform = new PlatformSettings({});

    const prevValue = {
      instituteName: platform.instituteName,
      logo: platform.logo,
      address: platform.address,
      contactNumber: platform.contactNumber,
      supportEmail: platform.supportEmail,
      websiteUrl: platform.websiteUrl,
      socialMediaLinks: platform.socialMediaLinks,
      timezone: platform.timezone,
      language: platform.language,
      themeSettings: platform.themeSettings
    };

    const {
      instituteName,
      logo,
      address,
      contactNumber,
      supportEmail,
      websiteUrl,
      socialMediaLinks,
      timezone,
      language,
      themeSettings
    } = req.body;

    if (instituteName !== undefined) platform.instituteName = instituteName;
    if (logo !== undefined) platform.logo = logo;
    if (address !== undefined) platform.address = address;
    if (contactNumber !== undefined) platform.contactNumber = contactNumber;
    if (supportEmail !== undefined) platform.supportEmail = supportEmail;
    if (websiteUrl !== undefined) platform.websiteUrl = websiteUrl;
    if (socialMediaLinks !== undefined) platform.socialMediaLinks = { ...platform.socialMediaLinks, ...socialMediaLinks };
    if (timezone !== undefined) platform.timezone = timezone;
    if (language !== undefined) platform.language = language;
    if (themeSettings !== undefined) platform.themeSettings = { ...platform.themeSettings, ...themeSettings };

    await platform.save();
    await logAudit(req, 'UPDATE_PROFILE_SETTINGS', 'Updated Institute profile configuration', prevValue, platform);

    res.json({ success: true, data: platform });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Update Academic Settings
exports.updateAcademic = async (req, res) => {
  try {
    let platform = await PlatformSettings.findOne({});
    if (!platform) platform = new PlatformSettings({});

    const prevValue = {
      academicYear: platform.academicYear,
      sessionStartDate: platform.sessionStartDate,
      sessionEndDate: platform.sessionEndDate,
      workingDays: platform.workingDays,
      holidays: platform.holidays,
      attendanceRules: platform.attendanceRules,
      passingPercentage: platform.passingPercentage,
      assignmentSubmissionRules: platform.assignmentSubmissionRules,
      assessmentConfiguration: platform.assessmentConfiguration,
      courseDuration: platform.courseDuration,
      batchTimings: platform.batchTimings
    };

    const {
      academicYear,
      sessionStartDate,
      sessionEndDate,
      workingDays,
      holidays,
      attendanceRules,
      passingPercentage,
      assignmentSubmissionRules,
      assessmentConfiguration,
      courseDuration,
      batchTimings
    } = req.body;

    if (academicYear !== undefined) platform.academicYear = academicYear;
    if (sessionStartDate !== undefined) platform.sessionStartDate = sessionStartDate;
    if (sessionEndDate !== undefined) platform.sessionEndDate = sessionEndDate;
    if (workingDays !== undefined) platform.workingDays = workingDays;
    if (holidays !== undefined) platform.holidays = holidays;
    if (attendanceRules !== undefined) platform.attendanceRules = { ...platform.attendanceRules, ...attendanceRules };
    if (passingPercentage !== undefined) platform.passingPercentage = passingPercentage;
    if (assignmentSubmissionRules !== undefined) platform.assignmentSubmissionRules = { ...platform.assignmentSubmissionRules, ...assignmentSubmissionRules };
    if (assessmentConfiguration !== undefined) platform.assessmentConfiguration = { ...platform.assessmentConfiguration, ...assessmentConfiguration };
    if (courseDuration !== undefined) platform.courseDuration = courseDuration;
    if (batchTimings !== undefined) platform.batchTimings = { ...platform.batchTimings, ...batchTimings };

    await platform.save();
    await logAudit(req, 'UPDATE_ACADEMIC_SETTINGS', 'Updated Academic configurations', prevValue, platform);

    res.json({ success: true, data: platform });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Update Security & Authentication Settings
exports.updateAuth = async (req, res) => {
  try {
    let platform = await PlatformSettings.findOne({});
    if (!platform) platform = new PlatformSettings({});

    const prevValue = {
      passwordPolicy: platform.passwordPolicy,
      sessionTimeout: platform.sessionTimeout,
      loginSecurity: platform.loginSecurity
    };

    const { passwordPolicy, sessionTimeout, loginSecurity } = req.body;

    if (passwordPolicy !== undefined) platform.passwordPolicy = { ...platform.passwordPolicy, ...passwordPolicy };
    if (sessionTimeout !== undefined) platform.sessionTimeout = sessionTimeout;
    if (loginSecurity !== undefined) platform.loginSecurity = { ...platform.loginSecurity, ...loginSecurity };

    await platform.save();
    await logAudit(req, 'UPDATE_AUTH_SETTINGS', 'Updated Authentication & Security policies', prevValue, platform);

    res.json({ success: true, data: platform });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 5. Update Storage Settings
exports.updateStorage = async (req, res) => {
  try {
    let storage = await StorageSettings.findOne({});
    if (!storage) storage = new StorageSettings({});

    const prevValue = storage.toObject();

    const {
      totalPlatformStorage,
      videoStorageLimit,
      notesUploadLimit,
      assignmentUploadLimit,
      userProfileImageLimit,
      maxFileUploadSize,
      allowedFileTypes
    } = req.body;

    if (totalPlatformStorage !== undefined) storage.totalPlatformStorage = totalPlatformStorage;
    if (videoStorageLimit !== undefined) storage.videoStorageLimit = videoStorageLimit;
    if (notesUploadLimit !== undefined) storage.notesUploadLimit = notesUploadLimit;
    if (assignmentUploadLimit !== undefined) storage.assignmentUploadLimit = assignmentUploadLimit;
    if (userProfileImageLimit !== undefined) storage.userProfileImageLimit = userProfileImageLimit;
    if (maxFileUploadSize !== undefined) storage.maxFileUploadSize = maxFileUploadSize;
    if (allowedFileTypes !== undefined) storage.allowedFileTypes = allowedFileTypes;

    await storage.save();
    await logAudit(req, 'UPDATE_STORAGE_SETTINGS', 'Updated Storage allocation capacities', prevValue, storage);

    res.json({ success: true, data: storage });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 6. Update SMTP Settings
exports.updateSMTP = async (req, res) => {
  try {
    let smtp = await SMTPSettings.findOne({});
    if (!smtp) smtp = new SMTPSettings({});

    const prevValue = smtp.toObject();
    prevValue.password = '••••••••';

    const { host, port, username, password, senderEmail, senderName, sslTls } = req.body;

    if (host !== undefined) smtp.host = host;
    if (port !== undefined) smtp.port = port;
    if (username !== undefined) smtp.username = username;
    if (senderEmail !== undefined) smtp.senderEmail = senderEmail;
    if (senderName !== undefined) smtp.senderName = senderName;
    if (sslTls !== undefined) smtp.sslTls = sslTls;

    // Only update password if user sent a new one (not masked)
    if (password !== undefined && password !== '••••••••' && password !== '') {
      smtp.password = password;
    }

    await smtp.save();
    await logAudit(req, 'UPDATE_SMTP_SETTINGS', 'Updated SMTP and email credentials', prevValue, { ...smtp.toObject(), password: '••••••••' });

    res.json({ success: true, data: { ...smtp.toObject(), password: smtp.password ? '••••••••' : '' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 7. Test SMTP Configuration
exports.testSMTP = async (req, res) => {
  try {
    const { host, port, username, password, senderEmail, senderName, sslTls, recipientEmail } = req.body;
    
    if (!host || !port || !senderEmail || !recipientEmail) {
      return res.status(400).json({ success: false, message: 'Missing SMTP properties or recipient email' });
    }

    let resolvedPassword = password;
    // If password is masked, retrieve existing saved password
    if (password === '••••••••' || !password) {
      const smtp = await SMTPSettings.findOne({});
      if (smtp) {
        resolvedPassword = smtp.getDecryptedPassword();
      }
    }

    // Configure transporter
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: sslTls,
      auth: resolvedPassword ? {
        user: username,
        pass: resolvedPassword
      } : undefined,
      tls: {
        rejectUnauthorized: false
      }
    });

    // Send test email
    const mailOptions = {
      from: `"${senderName || 'CodeWave'}" <${senderEmail}>`,
      to: recipientEmail,
      subject: 'CodeWave SMTP Test Email',
      text: 'Congratulations! Your SMTP Configuration on CodeWave is working correctly.',
      html: '<p>Congratulations! Your SMTP Configuration on <strong>CodeWave</strong> is working correctly.</p>'
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: `Test email successfully sent to ${recipientEmail}` });
  } catch (err) {
    res.status(500).json({ success: false, message: `SMTP verification failed: ${err.message}` });
  }
};

// 8. Update Alerts & Notifications
exports.updateAlerts = async (req, res) => {
  try {
    let alerts = await NotificationSettings.findOne({});
    if (!alerts) alerts = new NotificationSettings({});

    const prevValue = alerts.toObject();

    const { emailAlerts, pushNotifications, systemAlerts, alertFrequency } = req.body;

    if (emailAlerts !== undefined) alerts.emailAlerts = { ...alerts.emailAlerts, ...emailAlerts };
    if (pushNotifications !== undefined) alerts.pushNotifications = { ...alerts.pushNotifications, ...pushNotifications };
    if (systemAlerts !== undefined) alerts.systemAlerts = { ...alerts.systemAlerts, ...systemAlerts };
    if (alertFrequency !== undefined) alerts.alertFrequency = alertFrequency;

    await alerts.save();
    await logAudit(req, 'UPDATE_ALERTS_SETTINGS', 'Updated alerts and system notifications switches', prevValue, alerts);

    res.json({ success: true, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 9. Update System Preferences
exports.updateSystem = async (req, res) => {
  try {
    let system = await SystemPreferences.findOne({});
    if (!system) system = new SystemPreferences({});

    const prevValue = system.toObject();

    const { maintenanceMode, landingPageConfig, featureFlags, defaultTheme, defaultUserSettings, platformBranding } = req.body;

    if (maintenanceMode !== undefined) system.maintenanceMode = maintenanceMode;
    if (landingPageConfig !== undefined) system.landingPageConfig = { ...system.landingPageConfig, ...landingPageConfig };
    if (featureFlags !== undefined) system.featureFlags = { ...system.featureFlags, ...featureFlags };
    if (defaultTheme !== undefined) system.defaultTheme = defaultTheme;
    if (defaultUserSettings !== undefined) system.defaultUserSettings = { ...system.defaultUserSettings, ...defaultUserSettings };
    if (platformBranding !== undefined) system.platformBranding = { ...system.platformBranding, ...platformBranding };

    await system.save();
    await logAudit(req, 'UPDATE_SYSTEM_PREFERENCES', 'Updated System preferences and feature toggles', prevValue, system);

    res.json({ success: true, data: system });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 10. Get Audit Logs
exports.getAuditLogs = async (req, res) => {
  try {
    const { search, action, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { userEmail: { $regex: search, $options: 'i' } },
        { details: { $regex: search, $options: 'i' } }
      ];
    }

    if (action) {
      query.action = action;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await AuditLogs.countDocuments(query);
    const logs = await AuditLogs.find(query)
      .populate('userId', 'fullName role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 11. Get Role Permissions Map
exports.getPermissions = async (req, res) => {
  try {
    const permissions = await AdminPermissions.find({}).sort({ isCustom: 1, role: 1 });
    res.json({ success: true, data: permissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 12. Update Role Permissions Map
exports.updatePermissions = async (req, res) => {
  try {
    const { role, permissions, isCustom = true, deleteRole = false } = req.body;
    
    if (!role) {
      return res.status(400).json({ success: false, message: 'Role name is required' });
    }

    if (deleteRole) {
      const record = await AdminPermissions.findOne({ role });
      if (!record) {
        return res.status(404).json({ success: false, message: 'Role not found' });
      }
      if (!record.isCustom) {
        return res.status(400).json({ success: false, message: 'Cannot delete built-in roles' });
      }
      await AdminPermissions.deleteOne({ role });
      await logAudit(req, 'DELETE_ROLE', `Deleted custom role: ${role}`, record, null);
      return res.json({ success: true, message: `Role ${role} deleted successfully` });
    }

    let roleRecord = await AdminPermissions.findOne({ role });
    let isNew = false;
    let prev = null;

    if (!roleRecord) {
      isNew = true;
      roleRecord = new AdminPermissions({ role, permissions, isCustom });
    } else {
      prev = roleRecord.toObject();
      roleRecord.permissions = permissions;
    }

    await roleRecord.save();
    await logAudit(
      req, 
      isNew ? 'CREATE_ROLE' : 'UPDATE_ROLE_PERMISSIONS', 
      isNew ? `Created new custom role: ${role}` : `Updated permissions for role: ${role}`,
      prev,
      roleRecord
    );

    res.json({ success: true, data: roleRecord });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 13. Session Management - Get Active Sessions
exports.getActiveSessions = async (req, res) => {
  try {
    const sessions = await UserSession.find({ isActive: true })
      .populate('userId', 'fullName email role avatar')
      .sort({ lastActivityAt: -1 });
    
    res.json({ success: true, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 14. Session Management - Terminate Specific Session
exports.terminateSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required' });
    }

    const session = await UserSession.findById(sessionId).populate('userId', 'email');
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    session.isActive = false;
    await session.save();

    await logAudit(req, 'TERMINATE_USER_SESSION', `Terminated session for user: ${session.userId?.email || 'Unknown'}`, session, null);

    res.json({ success: true, message: 'Session terminated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 15. Session Management - Force Logout / Reset Sessions
exports.terminateAllSessions = async (req, res) => {
  try {
    const { userId } = req.body; // If provided, force logout specific user. If empty, force logout ALL users except current admin.
    
    if (userId) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      await UserSession.updateMany(
        { userId, isActive: true },
        { $set: { isActive: false } }
      );

      await logAudit(req, 'FORCE_LOGOUT_USER', `Forced logout for user: ${user.email}`, null, null);
      return res.json({ success: true, message: `All sessions for user ${user.fullName} have been terminated.` });
    } else {
      // Force logout all users except current logged-in admin session
      const currentToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';

      await UserSession.updateMany(
        { token: { $ne: currentToken }, isActive: true },
        { $set: { isActive: false } }
      );

      await logAudit(req, 'FORCE_LOGOUT_ALL', 'Forced logout for all users globally', null, null);
      return res.json({ success: true, message: 'All other user sessions terminated globally.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 16. Storage Management - Cleanup Unused Files
exports.cleanupStorage = async (req, res) => {
  try {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      return res.json({ success: true, message: 'No uploads folder found on server disk', deletedFilesCount: 0, spaceSavedMB: 0 });
    }

    const files = fs.readdirSync(uploadDir);
    let deletedCount = 0;
    let totalBytesSaved = 0;

    const StudyMaterial = require('../models/StudyMaterial');
    const Video = require('../models/Video');
    const Assignment = require('../models/Assignment');
    const Submission = require('../models/Submission');

    for (const file of files) {
      // Skip hidden/system files
      if (file.startsWith('.')) continue;

      const relativePath = `/uploads/${file}`;
      const fullPath = path.join(uploadDir, file);

      // Check if file is referenced in any DB collection
      const isUsedInMaterial = await StudyMaterial.findOne({ fileUrl: { $regex: file } });
      const isUsedInVideo = await Video.findOne({ $or: [{ url: { $regex: file } }, { thumbnailUrl: { $regex: file } }] });
      const isUsedInAssignment = await Assignment.findOne({ fileUrl: { $regex: file } });
      const isUsedInSubmission = await Submission.findOne({ fileUrl: { $regex: file } });
      const isUsedInUser = await User.findOne({ avatar: { $regex: file } });

      if (!isUsedInMaterial && !isUsedInVideo && !isUsedInAssignment && !isUsedInSubmission && !isUsedInUser) {
        // Safe to delete!
        try {
          const stats = fs.statSync(fullPath);
          totalBytesSaved += stats.size;
          fs.unlinkSync(fullPath);
          deletedCount++;
        } catch (e) {
          console.error(`Failed to delete file: ${file}`, e.message);
        }
      }
    }

    const spaceSavedMB = Math.round((totalBytesSaved / (1024 * 1024)) * 100) / 100;
    await logAudit(req, 'CLEANUP_UNUSED_FILES', `Ran storage cleanup. Deleted ${deletedCount} files, saving ${spaceSavedMB} MB.`, null, null);

    res.json({
      success: true,
      message: `Cleaned up ${deletedCount} unused files, freeing ${spaceSavedMB} MB.`,
      deletedFilesCount: deletedCount,
      spaceSavedMB
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 17. Storage Management - View Storage Analytics
exports.getStorageAnalytics = async (req, res) => {
  try {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    let totalSizeMB = 0;
    let videoUsageMB = 0;
    let avatarUsageMB = 0;
    let notesUsageMB = 0;
    let assignmentsUsageMB = 0;

    const StudyMaterial = require('../models/StudyMaterial');
    const Video = require('../models/Video');
    const User = require('../models/User');
    const Submission = require('../models/Submission');

    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      for (const file of files) {
        if (file.startsWith('.')) continue;
        const fullPath = path.join(uploadDir, file);
        try {
          const stats = fs.statSync(fullPath);
          const sizeMB = stats.size / (1024 * 1024);
          totalSizeMB += sizeMB;

          // Categorize by DB reference
          const isUsedInMaterial = await StudyMaterial.findOne({ fileUrl: { $regex: file } });
          const isUsedInVideo = await Video.findOne({ $or: [{ url: { $regex: file } }, { thumbnailUrl: { $regex: file } }] });
          const isUsedInUser = await User.findOne({ avatar: { $regex: file } });
          const isUsedInSubmission = await Submission.findOne({ fileUrl: { $regex: file } });

          if (isUsedInVideo) videoUsageMB += sizeMB;
          else if (isUsedInUser) avatarUsageMB += sizeMB;
          else if (isUsedInMaterial) notesUsageMB += sizeMB;
          else if (isUsedInSubmission) assignmentsUsageMB += sizeMB;
        } catch (e) {
          // ignore stat errors
        }
      }
    }

    res.json({
      success: true,
      data: {
        totalUsageMB: Math.round(totalSizeMB * 100) / 100,
        videoUsageMB: Math.round(videoUsageMB * 100) / 100,
        avatarUsageMB: Math.round(avatarUsageMB * 100) / 100,
        notesUsageMB: Math.round(notesUsageMB * 100) / 100,
        assignmentsUsageMB: Math.round(assignmentsUsageMB * 100) / 100,
        otherUsageMB: Math.round((totalSizeMB - videoUsageMB - avatarUsageMB - notesUsageMB - assignmentsUsageMB) * 100) / 100
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

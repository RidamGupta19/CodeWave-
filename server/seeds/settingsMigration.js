const mongoose = require('mongoose');
const PlatformSettings = require('../models/PlatformSettings');
const AdminPermissions = require('../models/AdminPermissions');
const NotificationSettings = require('../models/NotificationSettings');
const SMTPSettings = require('../models/SMTPSettings');
const StorageSettings = require('../models/StorageSettings');
const SystemPreferences = require('../models/SystemPreferences');
const InstituteSettings = require('../models/InstituteSettings');

const runMigration = async () => {
  try {
    console.log('🏁 Running Settings migration & seeding...');

    // 1. Migrate PlatformSettings and SMTPSettings and StorageSettings from InstituteSettings if they don't exist
    let platform = await PlatformSettings.findOne({});
    let smtp = await SMTPSettings.findOne({});
    let storage = await StorageSettings.findOne({});
    let notify = await NotificationSettings.findOne({});
    let system = await SystemPreferences.findOne({});

    const legacySettings = await InstituteSettings.findOne({});

    if (!platform) {
      console.log('Seeding PlatformSettings...');
      platform = await PlatformSettings.create({
        instituteName: legacySettings?.name || 'CodeWave Coaching Institute',
        logo: legacySettings?.logo || '',
        address: legacySettings?.address || '123 Technology Park, Silicon Valley',
        contactNumber: legacySettings?.contactDetails?.phone || '9876543210',
        supportEmail: legacySettings?.contactDetails?.email || 'support@codewave.com',
        websiteUrl: legacySettings?.contactDetails?.website || 'https://codewavesolution.com',
        sessions: legacySettings?.sessions || ['2025-2026', '2026-2027'],
        holidays: legacySettings?.holidays || [],
        workingDays: legacySettings?.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        batchTimings: {
          startTime: legacySettings?.timetable?.startHour || '09:00 AM',
          endTime: legacySettings?.timetable?.endHour || '06:00 PM'
        }
      });
    }

    if (!smtp) {
      console.log('Seeding SMTPSettings...');
      smtp = await SMTPSettings.create({
        host: legacySettings?.smtp?.host || 'smtp.mailtrap.io',
        port: legacySettings?.smtp?.port || 2525,
        username: legacySettings?.smtp?.user || '',
        password: legacySettings?.smtp?.pass || '',
        senderEmail: legacySettings?.smtp?.fromEmail || 'noreply@codewave.com'
      });
    }

    if (!storage) {
      console.log('Seeding StorageSettings...');
      storage = await StorageSettings.create({
        maxFileUploadSize: legacySettings?.uploadLimits || 50,
        allowedFileTypes: legacySettings?.allowedFileTypes || ['.pdf', '.csv', '.xlsx', '.png', '.jpg', '.jpeg', '.webp', '.mp4'],
        videoStorageLimit: legacySettings?.videoLimits || 500
      });
    }

    if (!notify) {
      console.log('Seeding NotificationSettings...');
      notify = await NotificationSettings.create({
        pushNotifications: {
          newVideos: legacySettings?.pushNotifications?.enabled || true,
          newNotes: legacySettings?.pushNotifications?.enabled || true,
          announcements: legacySettings?.pushNotifications?.enabled || true,
          roadmapUnlocks: legacySettings?.pushNotifications?.enabled || true
        }
      });
    }

    if (!system) {
      console.log('Seeding SystemPreferences...');
      system = await SystemPreferences.create({});
    }

    // 2. Seed default AdminPermissions
    const defaultRoles = [
      {
        role: 'Super Admin',
        permissions: [
          'Profile Settings',
          'Academic Settings',
          'Authentication Settings',
          'Storage Management',
          'SMTP Configuration',
          'Notifications Management',
          'User Management',
          'Content Management',
          'Analytics Management'
        ],
        isCustom: false
      },
      {
        role: 'Admin',
        permissions: [
          'Profile Settings',
          'Academic Settings',
          'Authentication Settings',
          'Storage Management',
          'SMTP Configuration',
          'Notifications Management',
          'User Management',
          'Content Management',
          'Analytics Management'
        ],
        isCustom: false
      },
      {
        role: 'Content Manager',
        permissions: [
          'Content Management'
        ],
        isCustom: false
      },
      {
        role: 'Academic Manager',
        permissions: [
          'Academic Settings',
          'Content Management',
          'User Management'
        ],
        isCustom: false
      },
      {
        role: 'Support Manager',
        permissions: [
          'Profile Settings',
          'User Management'
        ],
        isCustom: false
      }
    ];

    for (const r of defaultRoles) {
      const exists = await AdminPermissions.findOne({ role: r.role });
      if (!exists) {
        console.log(`Seeding Role Permissions: ${r.role}...`);
        await AdminPermissions.create(r);
      }
    }

    console.log('✅ Settings migration & seeding completed!');
  } catch (error) {
    console.error('❌ Settings migration failed:', error.message);
  }
};

module.exports = runMigration;

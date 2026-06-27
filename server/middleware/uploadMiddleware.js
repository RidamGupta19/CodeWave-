const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Keep original file extension, but sanitize file name and add unique suffix
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter (validation)
const fileFilter = (req, file, cb) => {
  // Allowed file extensions
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.png', '.jpg', '.jpeg', '.zip'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed extensions: ${allowedExtensions.join(', ')}`), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Helper middleware for upload & custom error handling
const uploadSingle = (fieldName) => {
  const uploadMiddleware = upload.single(fieldName);
  
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        let message = err.message;
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            message = 'File size is too large. Max limit is 10MB.';
          }
        }
        return res.status(400).json({ success: false, message });
      }
      next();
    });
  };
};

// Video Upload Filter and Limit (100MB)
const videoFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.mp4', '.mov', '.webm', '.mkv', '.ogg', '.avi'];
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype.toLowerCase();

  if (allowedExtensions.includes(ext) && mimeType.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed video extensions: ${allowedExtensions.join(', ')}`), false);
  }
};

// Ensure secure upload directory exists
const secureUploadDir = path.join(__dirname, '../secure_uploads');
if (!fs.existsSync(secureUploadDir)) {
  fs.mkdirSync(secureUploadDir, { recursive: true });
}

// Private Storage for video uploads
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, secureUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const videoUpload = multer({
  storage: videoStorage,
  fileFilter: videoFileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});

const uploadVideoSingle = (fieldName) => {
  const uploadMiddleware = videoUpload.single(fieldName);
  
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        let message = err.message;
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            message = 'Video file size is too large. Max limit is 100MB.';
          }
        }
        return res.status(400).json({ success: false, message });
      }
      next();
    });
  };
};

// Thumbnail Upload Filter and Limit (5MB)
const thumbnailFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype.toLowerCase();

  if (allowedExtensions.includes(ext) && mimeType.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed image extensions: ${allowedExtensions.join(', ')}`), false);
  }
};

const thumbnailUpload = multer({
  storage: storage,
  fileFilter: thumbnailFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

const uploadThumbnailSingle = (fieldName) => {
  const uploadMiddleware = thumbnailUpload.single(fieldName);
  
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        let message = err.message;
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            message = 'Thumbnail image size is too large. Max limit is 5MB.';
          }
        }
        return res.status(400).json({ success: false, message });
      }
      next();
    });
  };
};

module.exports = { uploadSingle, uploadVideoSingle, uploadThumbnailSingle };

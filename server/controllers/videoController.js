const Video = require('../models/Video');
const VideoProgress = require('../models/VideoProgress');
const Student = require('../models/Student');
const fs = require('fs');
const path = require('path');

const deleteLocalFile = (fileUrl) => {
  if (fileUrl && fileUrl.startsWith('/uploads/')) {
    const fileName = fileUrl.replace('/uploads/', '');
    const filePath = path.join(__dirname, '../uploads', fileName);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete local file: ${filePath}`, err);
        } else {
          console.log(`Deleted local file: ${filePath}`);
        }
      });
    }
  }
};

// @desc    Get all videos (filtered by course/batch for students)
// @route   GET /api/institute/videos
// @access  Private
exports.getVideos = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      query.isActive = true;
      const student = await Student.findOne({ userId: req.user._id });
      if (student) {
        // Students only see videos for their course
        query.course = student.course;
        // Optionally filter by batch if batch is specified in the video
        if (student.batch) {
          query.$or = [
            { batch: student.batch },
            { batch: { $exists: false } },
            { batch: null }
          ];
        }
      }
    }

    const videos = await Video.find(query)
      .populate('course', 'courseName')
      .populate('batch', 'batchName')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: videos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a new video lecture metadata
// @route   POST /api/institute/videos
// @access  Private (Admin/Teacher only)
exports.createVideo = async (req, res) => {
  try {
    const { title, description, videoType, url, thumbnailUrl, duration, course, batch, instructor, subject, isActive } = req.body;

    if (!title || !videoType || !url || !course) {
      return res.status(400).json({ success: false, message: 'Please provide title, videoType, url, and course.' });
    }

    const video = await Video.create({
      title,
      description,
      videoType,
      url,
      thumbnailUrl: thumbnailUrl || '',
      duration: duration || 0,
      course,
      batch: batch || null,
      instructor: instructor || '',
      subject: subject || '',
      isActive: isActive !== undefined ? isActive : true
    });

    const populatedVideo = await Video.findById(video._id)
      .populate('course', 'courseName')
      .populate('batch', 'batchName');

    res.status(201).json({ success: true, data: populatedVideo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update a video lecture
// @route   PUT /api/institute/videos/:id
// @access  Private (Admin/Teacher only)
exports.updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    const { title, description, videoType, url, thumbnailUrl, duration, course, batch, instructor, subject, isActive } = req.body;

    // Clean up local files if they are replaced
    if (url && video.url && video.url !== url) {
      deleteLocalFile(video.url);
    }
    if (thumbnailUrl && video.thumbnailUrl && video.thumbnailUrl !== thumbnailUrl) {
      deleteLocalFile(video.thumbnailUrl);
    }

    video.title = title || video.title;
    video.description = description !== undefined ? description : video.description;
    video.videoType = videoType || video.videoType;
    video.url = url || video.url;
    video.thumbnailUrl = thumbnailUrl !== undefined ? thumbnailUrl : video.thumbnailUrl;
    video.duration = duration !== undefined ? (Number(duration) || 0) : video.duration;
    video.course = course || video.course;
    video.batch = batch !== undefined ? (batch || null) : video.batch;
    video.instructor = instructor !== undefined ? instructor : video.instructor;
    video.subject = subject !== undefined ? subject : video.subject;
    video.isActive = isActive !== undefined ? isActive : video.isActive;

    await video.save();

    const updatedVideo = await Video.findById(video._id)
      .populate('course', 'courseName')
      .populate('batch', 'batchName');

    res.json({ success: true, data: updatedVideo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete a video lecture
// @route   DELETE /api/institute/videos/:id
// @access  Private (Admin/Teacher only)
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    // Clean up local media files
    deleteLocalFile(video.url);
    deleteLocalFile(video.thumbnailUrl);

    await Video.findByIdAndDelete(req.params.id);
    // Also delete associated progress logs
    await VideoProgress.deleteMany({ video: req.params.id });

    res.json({ success: true, message: 'Video lecture deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Upload direct video file
// @route   POST /api/institute/videos/upload-video
// @access  Private (Admin/Teacher only)
exports.uploadVideoFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a video file' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, fileUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Upload thumbnail image file
// @route   POST /api/institute/videos/upload-thumbnail
// @access  Private (Admin/Teacher only)
exports.uploadThumbnailFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a thumbnail image' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, fileUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get video progress for current student
// @route   GET /api/institute/videos/progress
// @access  Private (Student only)
exports.getVideoProgress = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'teacher' || req.user.role === 'admin') {
      const { videoId } = req.query;
      if (videoId) {
        query.video = videoId;
      }
      const progress = await VideoProgress.find(query)
        .populate('user', 'fullName email')
        .populate('video');
      return res.json({ success: true, data: progress });
    } else {
      query.user = req.user._id;
      const progress = await VideoProgress.find(query)
        .populate('video');
      return res.json({ success: true, data: progress });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Save/update watch progress for a video lecture
// @route   POST /api/institute/videos/:id/progress
// @access  Private (Student only)
exports.saveVideoProgress = async (req, res) => {
  try {
    const { watchTime, duration, isCompleted } = req.body;
    const videoId = req.params.id;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    const totalDuration = duration || video.duration || 1;
    const pct = Math.min(100, Math.max(0, Math.round((watchTime / totalDuration) * 100)));
    
    // Auto complete if progress is 95% or higher
    const finalIsCompleted = isCompleted || pct >= 95;

    const query = { user: req.user._id, video: videoId };
    const update = {
      watchTime,
      duration: totalDuration,
      progressPercentage: pct,
      isCompleted: finalIsCompleted,
      lastWatched: new Date()
    };

    const progress = await VideoProgress.findOneAndUpdate(query, update, {
      upsert: true,
      new: true
    });

    res.json({ success: true, data: progress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Toggle manual completion status of a video
// @route   POST /api/institute/videos/:id/complete
// @access  Private (Student only)
exports.toggleVideoComplete = async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    const existingProgress = await VideoProgress.findOne({ user: req.user._id, video: videoId });
    
    let isCompleted = true;
    if (existingProgress) {
      isCompleted = !existingProgress.isCompleted;
    }

    const totalDuration = video.duration || 300; // default 5 mins if unknown
    const watchTime = isCompleted ? totalDuration : 0;
    const progressPercentage = isCompleted ? 100 : 0;

    const query = { user: req.user._id, video: videoId };
    const update = {
      watchTime,
      duration: totalDuration,
      progressPercentage,
      isCompleted,
      lastWatched: new Date()
    };

    const progress = await VideoProgress.findOneAndUpdate(query, update, {
      upsert: true,
      new: true
    });

    res.json({ success: true, data: progress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

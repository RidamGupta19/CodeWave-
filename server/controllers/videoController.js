const Video = require('../models/Video');
const VideoProgress = require('../models/VideoProgress');
const Student = require('../models/Student');

// @desc    Get all videos (filtered by course/batch for students)
// @route   GET /api/institute/videos
// @access  Private
exports.getVideos = async (req, res) => {
  try {
    let query = { isActive: true };

    if (req.user.role === 'student') {
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
    const { title, description, videoType, url, thumbnailUrl, duration, course, batch, instructor } = req.body;

    if (!title || !videoType || !url || !course) {
      return res.status(400).json({ success: false, message: 'Please provide title, videoType, url, and course.' });
    }

    const video = await Video.create({
      title,
      description,
      videoType,
      url,
      thumbnailUrl,
      duration: duration || 0,
      course,
      batch: batch || null,
      instructor: instructor || '',
      isActive: true
    });

    res.status(201).json({ success: true, data: video });
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

    await Video.findByIdAndDelete(req.params.id);
    // Also delete associated progress logs
    await VideoProgress.deleteMany({ video: req.params.id });

    res.json({ success: true, message: 'Video lecture deleted successfully' });
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

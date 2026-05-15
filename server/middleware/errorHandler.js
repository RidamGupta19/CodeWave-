const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('❌ Error:', err.message);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    return res.status(404).json({ success: false, message: error.message });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered';
    return res.status(400).json({ success: false, message: error.message });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error.message = messages.join(', ');
    return res.status(400).json({ success: false, message: error.message });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

module.exports = errorHandler;

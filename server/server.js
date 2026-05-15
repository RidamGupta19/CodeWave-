const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Security
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'development' ? false : undefined,
  crossOriginEmbedderPolicy: false
}));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/domains', require('./routes/domains'));
app.use('/api/phases', require('./routes/phases'));
app.use('/api/topics', require('./routes/topics'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/assessments', require('./routes/assessments'));
app.use('/api/badges', require('./routes/badges'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/cloud-credits', require('./routes/cloudCredits'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CareerForge API is running', timestamp: new Date() });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🔥 CareerForge Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL}\n`);
});

const nodemailer = require('nodemailer');
const User = require('../models/User');

exports.submitSuggestion = async (req, res) => {
  try {
    const { suggestionType, content } = req.body;
    
    if (!content) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    const user = await User.findById(req.user._id);
    
    // Check if email service is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.warn("EMAIL_USER or EMAIL_APP_PASSWORD not set. Logging suggestion to console instead of emailing.");
      console.log(`\n=== NEW SUGGESTION ===\nFrom: ${user.fullName} (${user.email})\nType: ${suggestionType}\nContent: ${content}\n======================\n`);
      return res.status(200).json({ success: true, message: 'Suggestion recorded (Email simulation)' });
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    const mailOptions = {
      from: `"CodeWave Solution Alerts" <${process.env.EMAIL_USER}>`,
      to: 'omshivhare666@gmail.com, ridamg636@gmail.com',
      subject: `CodeWave Solution Suggestion: ${suggestionType || 'General Feedback'}`,
      html: `
        <h2>New Suggestion Received</h2>
        <p><strong>From:</strong> ${user.fullName} (${user.email})</p>
        <p><strong>Type:</strong> ${suggestionType || 'Feature Request'}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f4f4f4; padding: 15px; border-left: 5px solid #6366f1;">
          ${content.replace(/\n/g, '<br>')}
        </blockquote>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Suggestion sent successfully' });
  } catch (error) {
    console.error('Error sending suggestion email:', error);
    res.status(500).json({ success: false, message: 'Failed to send suggestion' });
  }
};

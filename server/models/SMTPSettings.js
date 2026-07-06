const mongoose = require('mongoose');
const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.JWT_SECRET ? crypto.createHash('sha256').update(process.env.JWT_SECRET).digest() : Buffer.alloc(32); // 32 bytes key

function encrypt(text) {
  if (!text) return '';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  if (!text) return '';
  const parts = text.split(':');
  if (parts.length !== 2) return '';
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = Buffer.from(parts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

const smtpSettingsSchema = new mongoose.Schema({
  host: { type: String, default: 'smtp.mailtrap.io' },
  port: { type: Number, default: 2525 },
  username: { type: String, default: '' },
  password: { type: String, default: '' },
  senderEmail: { type: String, default: 'noreply@codewave.com' },
  senderName: { type: String, default: 'CodeWave' },
  sslTls: { type: Boolean, default: false }
}, { timestamps: true });

smtpSettingsSchema.pre('save', function(next) {
  if (this.isModified('password') && this.password && !this.password.includes(':')) {
    this.password = encrypt(this.password);
  }
  next();
});

smtpSettingsSchema.methods.getDecryptedPassword = function() {
  return decrypt(this.password);
};

module.exports = mongoose.model('SMTPSettings', smtpSettingsSchema);

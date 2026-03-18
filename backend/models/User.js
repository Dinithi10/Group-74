const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, enum: ['Admin', 'Designer', 'Viewer'], default: 'Viewer' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  designCount: { type: Number, default: 0 },
  joinedDate: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');

const FurnitureSchema = new mongoose.Schema({
  type: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  depth: { type: Number, required: true },
  color: { type: String, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  rotation: { type: Number, default: 0 },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true }
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

module.exports = mongoose.model('Furniture', FurnitureSchema);

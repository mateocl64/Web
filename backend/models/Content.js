const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: [true, 'Section name is required'],
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  subtitle: {
    type: String,
    trim: true,
  },
  text: {
    type: String,
    trim: true,
  },
  buttonText: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

contentSchema.index({ section: 1 });

module.exports = mongoose.model('Content', contentSchema);
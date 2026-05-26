const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rollNo: {
    type: String,
    required: true,
    unique: true
  },
  branch: {
    type: String,
    required: true,
    default: 'MCA'
  },
  batch: {
    type: String,
    required: true,
    default: '2024-2026'
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  parentEmail: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  cgpa: {
    type: Number,
    default: 0.0
  },
  status: {
    type: String,
    enum: ['Active', 'Suspended'],
    default: 'Active'
  }
});

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);

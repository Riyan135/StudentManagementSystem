const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  examType: {
    type: String,
    enum: ['Internal 1', 'Internal 2', 'Semester Exam', 'Quiz', 'Practical'],
    required: true
  },
  marksObtained: {
    type: Number,
    required: true
  },
  maxMarks: {
    type: Number,
    required: true,
    default: 100
  },
  gradeLetter: {
    type: String,
    required: true
  },
  remarks: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Grade', GradeSchema);

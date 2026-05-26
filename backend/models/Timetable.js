const mongoose = require('mongoose');

const PeriodSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true // e.g. "09:00 AM - 10:00 AM"
  },
  facultyName: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  }
});

const TimetableSchema = new mongoose.Schema({
  branch: {
    type: String,
    required: true,
    default: 'MCA' // MCA, MBA, BTech
  },
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  periods: [PeriodSchema]
});

module.exports = mongoose.model('Timetable', TimetableSchema);

const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending'],
    default: 'Pending'
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: {
    type: Date
  },
  transactionId: {
    type: String,
    default: ''
  },
  receiptNumber: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Fee', FeeSchema);

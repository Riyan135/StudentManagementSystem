const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Models
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const Assignment = require('../models/Assignment');
const Notice = require('../models/Notice');
const Fee = require('../models/Fee');
const Timetable = require('../models/Timetable');
const Complaint = require('../models/Complaint');
const Message = require('../models/Message');

// ==========================================
// 1. ADMIN & GLOBAL USERS ENDPOINTS
// ==========================================

// Get dashboard statistics
router.get('/admin/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: 'student' });
    const facultyCount = await User.countDocuments({ role: 'faculty' });
    const parentCount = await User.countDocuments({ role: 'parent' });
    const complaintsPending = await Complaint.countDocuments({ status: 'Pending' });
    const noticeCount = await Notice.countDocuments();
    
    // Fee collection stats
    const feesPaid = await Fee.find({ status: 'Paid' });
    const totalFeesCollected = feesPaid.reduce((acc, f) => acc + f.amount, 0);

    res.json({
      studentCount,
      facultyCount,
      parentCount,
      complaintsPending,
      noticeCount,
      totalFeesCollected
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all student profiles (grouped/filterable by branch)
router.get('/admin/students', protect, authorize('admin'), async (req, res) => {
  try {
    const { branch } = req.query;
    let query = {};
    if (branch && branch !== 'All') {
      query.branch = branch;
    }

    const students = await StudentProfile.find(query)
      .populate('user', 'name email avatar')
      .populate('parent', 'name email');

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get users list (useful for select boxes / contact list in chat)
router.get('/users', protect, async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    if (role) {
      query.role = role;
    } else {
      // If no role, fetch all other users
      query = { _id: { $ne: req.user._id } };
    }
    const users = await User.find(query).select('name email role avatar');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update student profile (Admin/Faculty/Student themselves)
router.put('/profiles/:studentId', protect, async (req, res) => {
  try {
    const { phone, address, cgpa, branch, batch } = req.body;
    let profile = await StudentProfile.findOne({ user: req.params.studentId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Authorization: User can update their own profile, or admins/faculty
    if (req.user.role !== 'admin' && req.user.role !== 'faculty' && req.user._id.toString() !== req.params.studentId) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    profile.phone = phone || profile.phone;
    profile.address = address || profile.address;
    if (req.user.role === 'admin' || req.user.role === 'faculty') {
      profile.cgpa = cgpa !== undefined ? cgpa : profile.cgpa;
      profile.branch = branch || profile.branch;
      profile.batch = batch || profile.batch;
    }

    await profile.save();
    
    const updatedProfile = await StudentProfile.findOne({ user: req.params.studentId })
      .populate('user', 'name email avatar')
      .populate('parent', 'name email');
      
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ==========================================
// 2. ATTENDANCE ENDPOINTS
// ==========================================

// Get attendance logs
router.get('/attendance', protect, async (req, res) => {
  try {
    let studentId = req.query.studentId;

    if (req.user.role === 'student') {
      studentId = req.user._id;
    } else if (req.user.role === 'parent') {
      const studentProfile = await StudentProfile.findOne({ parent: req.user._id });
      if (!studentProfile) {
        return res.status(400).json({ message: 'No student linked to this parent' });
      }
      studentId = studentProfile.user;
    }

    let query = {};
    if (studentId) {
      query.student = studentId;
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'name email')
      .populate('markedBy', 'name')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark/Post Attendance (Faculty / Admin)
router.post('/attendance', protect, authorize('faculty', 'admin'), async (req, res) => {
  const { students, subject, date } = req.body; // students: [{ studentId, status }]

  try {
    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: 'Students array is required' });
    }

    const attendanceRecords = students.map(s => ({
      student: s.studentId,
      subject,
      status: s.status,
      date: date || new Date(),
      markedBy: req.user._id
    }));

    await Attendance.insertMany(attendanceRecords);
    res.status(201).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ==========================================
// 3. MARKS & GRADES ENDPOINTS
// ==========================================

// Get Grades
router.get('/grades', protect, async (req, res) => {
  try {
    let studentId = req.query.studentId;

    if (req.user.role === 'student') {
      studentId = req.user._id;
    } else if (req.user.role === 'parent') {
      const studentProfile = await StudentProfile.findOne({ parent: req.user._id });
      if (!studentProfile) {
        return res.status(400).json({ message: 'No student linked to this parent' });
      }
      studentId = studentProfile.user;
    }

    let query = {};
    if (studentId) {
      query.student = studentId;
    }

    const grades = await Grade.find(query).populate('student', 'name email');
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Record Grade (Faculty / Admin)
router.post('/grades', protect, authorize('faculty', 'admin'), async (req, res) => {
  const { studentId, subject, examType, marksObtained, maxMarks, remarks } = req.body;

  try {
    const pct = (marksObtained / maxMarks) * 100;
    let gradeLetter = 'F';
    if (pct >= 90) gradeLetter = 'A+';
    else if (pct >= 80) gradeLetter = 'A';
    else if (pct >= 70) gradeLetter = 'B';
    else if (pct >= 60) gradeLetter = 'C';
    else if (pct >= 50) gradeLetter = 'D';
    else if (pct >= 40) gradeLetter = 'E';

    const grade = await Grade.create({
      student: studentId,
      subject,
      examType,
      marksObtained,
      maxMarks,
      gradeLetter,
      remarks
    });

    res.status(201).json(grade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ==========================================
// 4. ASSIGNMENT ENDPOINTS
// ==========================================

// Get all assignments
router.get('/assignments', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      const profile = await StudentProfile.findOne({ user: req.user._id });
      if (profile) {
        query.branch = profile.branch;
      }
    } else if (req.user.role === 'parent') {
      const profile = await StudentProfile.findOne({ parent: req.user._id });
      if (profile) {
        query.branch = profile.branch;
      }
    }

    const assignments = await Assignment.find(query)
      .populate('createdBy', 'name')
      .populate('submissions.student', 'name email');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new assignment (Faculty / Admin)
router.post('/assignments', protect, authorize('faculty', 'admin'), async (req, res) => {
  const { title, description, subject, branch, dueDate } = req.body;

  try {
    const assignment = await Assignment.create({
      title,
      description,
      subject,
      branch,
      dueDate,
      createdBy: req.user._id
    });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit assignment (Student)
router.post('/assignments/:id/submit', protect, authorize('student'), async (req, res) => {
  const { content } = req.body;

  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if already submitted
    const alreadySubmitted = assignment.submissions.find(
      sub => sub.student.toString() === req.user._id.toString()
    );

    if (alreadySubmitted) {
      alreadySubmitted.content = content;
      alreadySubmitted.submittedAt = Date.now();
    } else {
      assignment.submissions.push({
        student: req.user._id,
        content
      });
    }

    await assignment.save();
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Grade Submission (Faculty / Admin)
router.post('/assignments/:id/grade', protect, authorize('faculty', 'admin'), async (req, res) => {
  const { studentId, grade, feedback } = req.body;

  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submission = assignment.submissions.find(
      sub => sub.student.toString() === studentId
    );

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.grade = grade;
    submission.feedback = feedback;

    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ==========================================
// 5. NOTICE BOARD ENDPOINTS
// ==========================================

// Get notices
router.get('/notices', protect, async (req, res) => {
  try {
    const notices = await Notice.find({}).populate('createdBy', 'name role').sort({ date: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post Notice (Admin / Faculty)
router.post('/notices', protect, authorize('admin', 'faculty'), async (req, res) => {
  const { title, content, category } = req.body;

  try {
    const notice = await Notice.create({
      title,
      content,
      category,
      createdBy: req.user._id
    });
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ==========================================
// 6. FEES ENDPOINTS
// ==========================================

// Get fees list
router.get('/fees', protect, async (req, res) => {
  try {
    let studentId = req.query.studentId;

    if (req.user.role === 'student') {
      studentId = req.user._id;
    } else if (req.user.role === 'parent') {
      const studentProfile = await StudentProfile.findOne({ parent: req.user._id });
      if (!studentProfile) {
        return res.status(400).json({ message: 'No student linked to this parent' });
      }
      studentId = studentProfile.user;
    }

    let query = {};
    if (studentId) {
      query.student = studentId;
    }

    const fees = await Fee.find(query).populate('student', 'name email');
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Pay fee (Simulate payment)
router.post('/fees/:id/pay', protect, async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }

    fee.status = 'Paid';
    fee.paidDate = new Date();
    fee.transactionId = 'TXN-' + Math.floor(100000000 + Math.random() * 900000000);
    fee.receiptNumber = 'REC-2026-' + Math.floor(1000 + Math.random() * 9000);

    await fee.save();
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ==========================================
// 7. TIMETABLE ENDPOINTS
// ==========================================

// Get Timetable
router.get('/timetable', protect, async (req, res) => {
  try {
    let branch = req.query.branch;
    if (!branch) {
      if (req.user.role === 'student') {
        const profile = await StudentProfile.findOne({ user: req.user._id });
        branch = profile ? profile.branch : 'MCA';
      } else if (req.user.role === 'parent') {
        const profile = await StudentProfile.findOne({ parent: req.user._id });
        branch = profile ? profile.branch : 'MCA';
      } else {
        branch = 'MCA';
      }
    }

    const timetable = await Timetable.find({ branch });
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update/Add Timetable Slot
router.post('/timetable', protect, authorize('admin'), async (req, res) => {
  const { branch, day, periods } = req.body;

  try {
    let timetable = await Timetable.findOne({ branch, day });
    if (timetable) {
      timetable.periods = periods;
      await timetable.save();
    } else {
      timetable = await Timetable.create({ branch, day, periods });
    }
    res.status(201).json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ==========================================
// 8. FEEDBACK & COMPLAINTS ENDPOINTS
// ==========================================

// Get complaints list
router.get('/complaints', protect, async (req, res) => {
  try {
    let query = {};
    // Students/parents see their own; faculty & admins see all
    if (req.user.role === 'student') {
      query.user = req.user._id;
    } else if (req.user.role === 'parent') {
      const profile = await StudentProfile.findOne({ parent: req.user._id });
      if (profile) {
        query = {
          $or: [
            { user: req.user._id },
            { user: profile.user }
          ]
        };
      }
    }

    const complaints = await Complaint.find(query)
      .populate('user', 'name role email')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// File complaint
router.post('/complaints', protect, async (req, res) => {
  const { title, description, category, isAnonymous } = req.body;

  try {
    const complaint = await Complaint.create({
      user: req.user._id,
      title,
      description,
      category,
      isAnonymous
    });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Resolve complaint (Admin / Faculty)
router.post('/complaints/:id/resolve', protect, authorize('admin', 'faculty'), async (req, res) => {
  const { response, status } = req.body;

  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.response = response;
    complaint.status = status || 'Resolved';
    await complaint.save();

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ==========================================
// 9. CHAT HISTORY ENDPOINT
// ==========================================

// Get chat messages between current user and peer partnerId
router.get('/chat/history/:partnerId', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const partnerId = req.params.partnerId;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: partnerId },
        { sender: partnerId, receiver: userId }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

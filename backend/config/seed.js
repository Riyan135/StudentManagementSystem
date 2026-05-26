const mongoose = require('mongoose');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Timetable = require('../models/Timetable');
const Notice = require('../models/Notice');
const Fee = require('../models/Fee');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');

const seedData = async () => {
  try {
    // Clear old data if needed or just return if database already has users
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already has data. Skipping seed.');
      return;
    }

    console.log('Seeding database with realistic mock data...');

    // 1. Create Users
    // Admin
    const admin = new User({
      name: 'Dr. Rajesh Sharma',
      email: 'admin@college.edu',
      password: 'admin123', // Will be hashed in pre-save
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'
    });
    await admin.save();

    // Faculty
    const faculty = new User({
      name: 'Prof. Anjali Mehta',
      email: 'faculty@college.edu',
      password: 'faculty123',
      role: 'faculty',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    });
    await faculty.save();

    // Student 1 (MCA)
    const student1 = new User({
      name: 'Rohan Verma',
      email: 'student@college.edu',
      password: 'student123',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
    });
    await student1.save();

    // Student 2 (MBA)
    const student2 = new User({
      name: 'Neha Roy',
      email: 'student2@college.edu',
      password: 'student123',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    });
    await student2.save();

    // Parent
    const parent = new User({
      name: 'Suresh Verma',
      email: 'parent@college.edu',
      password: 'parent123',
      role: 'parent',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    });
    await parent.save();

    // 2. Student Profiles
    const profile1 = new StudentProfile({
      user: student1._id,
      rollNo: 'MCA-2024-001',
      branch: 'MCA',
      batch: '2024-2026',
      parent: parent._id,
      parentEmail: 'parent@college.edu',
      phone: '+91 9876543210',
      address: 'Sector 62, Noida, UP, India',
      cgpa: 8.75
    });
    await profile1.save();

    const profile2 = new StudentProfile({
      user: student2._id,
      rollNo: 'MBA-2024-042',
      branch: 'MBA',
      batch: '2024-2026',
      parentEmail: 'parent2@college.edu',
      phone: '+91 9123456789',
      address: 'Salt Lake Sector 5, Kolkata, WB, India',
      cgpa: 9.12
    });
    await profile2.save();

    // 3. Timetable
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const subjectsMCA = ['Advanced Java', 'Database Systems', 'Software Engineering', 'Machine Learning', 'Cloud Computing'];
    const rooms = ['Lab 3', 'Lecture Hall A', 'Seminar Room 1', 'Lab 1', 'Lecture Hall B'];

    for (let d of days) {
      const timetable = new Timetable({
        branch: 'MCA',
        day: d,
        periods: [
          { subject: subjectsMCA[0], time: '09:00 AM - 10:30 AM', facultyName: 'Prof. Anjali Mehta', room: rooms[0] },
          { subject: subjectsMCA[1], time: '11:00 AM - 12:30 PM', facultyName: 'Dr. Suresh Kumar', room: rooms[1] },
          { subject: subjectsMCA[2], time: '01:30 PM - 03:00 PM', facultyName: 'Prof. Anjali Mehta', room: rooms[2] },
          { subject: subjectsMCA[3], time: '03:15 PM - 04:45 PM', facultyName: 'Dr. Amit Patel', room: rooms[3] }
        ]
      });
      await timetable.save();
    }

    // 4. Notices
    const notices = [
      {
        title: 'MCA Final Year Project Guidelines',
        content: 'All final year MCA students must submit their project synopsis by next Friday. The templates are available in the department folder.',
        category: 'Academic',
        createdBy: admin._id
      },
      {
        title: 'Urgent: Registration for Annual Hackathon 2026',
        content: 'Registration closes tomorrow. Exciting cash prizes and placement opportunities for top 3 teams. Register at techfest.college.edu.',
        category: 'Urgent',
        createdBy: admin._id
      },
      {
        title: 'Tech Fest 2026 Scheduled for next month',
        content: 'We are organizing our annual inter-college cultural and technical fest on June 18th-20th. Volunteers can register on our website.',
        category: 'Event',
        createdBy: admin._id
      }
    ];
    await Notice.insertMany(notices);

    // 5. Fees
    const fees = [
      {
        student: student1._id,
        title: 'Semester 4 Tuition Fee',
        amount: 65000,
        status: 'Pending',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      },
      {
        student: student1._id,
        title: 'Semester 3 Exam Fee',
        amount: 2500,
        status: 'Paid',
        dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        paidDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        transactionId: 'TXN-908124871',
        receiptNumber: 'REC-2026-8921'
      },
      {
        student: student2._id,
        title: 'Semester 4 Tuition Fee',
        amount: 75000,
        status: 'Paid',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        paidDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        transactionId: 'TXN-90875412',
        receiptNumber: 'REC-2026-9041'
      }
    ];
    await Fee.insertMany(fees);

    // 6. Grades / Marks
    const grades = [
      { student: student1._id, subject: 'Advanced Java', examType: 'Internal 1', marksObtained: 22, maxMarks: 25, gradeLetter: 'A', remarks: 'Excellent performance' },
      { student: student1._id, subject: 'Database Systems', examType: 'Internal 1', marksObtained: 19, maxMarks: 25, gradeLetter: 'B', remarks: 'Good, keep improving' },
      { student: student1._id, subject: 'Software Engineering', examType: 'Internal 1', marksObtained: 24, maxMarks: 25, gradeLetter: 'A+', remarks: 'Top scorer' },
      { student: student1._id, subject: 'Advanced Java', examType: 'Semester Exam', marksObtained: 85, maxMarks: 100, gradeLetter: 'A+', remarks: 'Excellent' }
    ];
    await Grade.insertMany(grades);

    // 7. Attendance
    const attendanceRecords = [];
    const dates = [
      new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    ];

    for (let d of dates) {
      for (let s of subjectsMCA) {
        attendanceRecords.push({
          student: student1._id,
          subject: s,
          status: Math.random() > 0.15 ? 'Present' : 'Absent',
          date: d,
          markedBy: faculty._id
        });
      }
    }
    await Attendance.insertMany(attendanceRecords);

    // 8. Assignments
    const assignments = [
      {
        title: 'Design Patterns in Java',
        description: 'Implement Creational and Structural design patterns. Submit code along with a class diagram document.',
        subject: 'Advanced Java',
        branch: 'MCA',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdBy: faculty._id,
        submissions: [
          {
            student: student1._id,
            content: 'Implemented Singleton, Factory, and Adapter patterns. GitHub Link: github.com/rohan/java-patterns',
            grade: 9,
            feedback: 'Excellent work and code comments.'
          }
        ]
      },
      {
        title: 'SQL Performance Tuning & Optimization',
        description: 'Analyze query execution plans and explain indexing methods. Solve the SQL sheet attached in class.',
        subject: 'Database Systems',
        branch: 'MCA',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        createdBy: faculty._id,
        submissions: []
      }
    ];
    await Assignment.insertMany(assignments);

    console.log('Database successfully seeded!');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

module.exports = seedData;

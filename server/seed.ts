import mongoose from 'mongoose';
import Student from './models/Student';
import Room from './models/Room';
import Attendance from './models/Attendance';
import Complaint from './models/Complaint';
import dotenv from 'dotenv';

dotenv.config();

const students = [
  {
    fullName: 'Aarav Sharma',
    rollNumber: 'CS2023001',
    course: 'B.Tech CSE',
    contactNumber: '9876543210',
    parentContactNumber: '9876543211',
    roomNumber: '101'
  },
  {
    fullName: 'Vivaan Gupta',
    rollNumber: 'CS2023002',
    course: 'B.Tech CSE',
    contactNumber: '9876543212',
    parentContactNumber: '9876543213',
    roomNumber: '101'
  },
  {
    fullName: 'Aditya Patel',
    rollNumber: 'ME2023001',
    course: 'B.Tech ME',
    contactNumber: '9876543214',
    parentContactNumber: '9876543215',
    roomNumber: '102'
  },
  {
    fullName: 'Vihaan Singh',
    rollNumber: 'ME2023002',
    course: 'B.Tech ME',
    contactNumber: '9876543216',
    parentContactNumber: '9876543217',
    roomNumber: '102'
  },
  {
    fullName: 'Arjun Kumar',
    rollNumber: 'EE2023001',
    course: 'B.Tech EE',
    contactNumber: '9876543218',
    parentContactNumber: '9876543219',
    roomNumber: '103'
  },
  {
    fullName: 'Sai Krishna',
    rollNumber: 'EE2023002',
    course: 'B.Tech EE',
    contactNumber: '9876543220',
    parentContactNumber: '9876543221',
    roomNumber: '103'
  },
  {
    fullName: 'Reyansh Reddy',
    rollNumber: 'CE2023001',
    course: 'B.Tech CE',
    contactNumber: '9876543222',
    parentContactNumber: '9876543223',
    roomNumber: '104'
  },
  {
    fullName: 'Ayaan Khan',
    rollNumber: 'CE2023002',
    course: 'B.Tech CE',
    contactNumber: '9876543224',
    parentContactNumber: '9876543225',
    roomNumber: '104'
  },
  {
    fullName: 'Ishaan Joshi',
    rollNumber: 'IT2023001',
    course: 'B.Tech IT',
    contactNumber: '9876543226',
    parentContactNumber: '9876543227',
    roomNumber: '105'
  },
  {
    fullName: 'Dhruv Malhotra',
    rollNumber: 'IT2023002',
    course: 'B.Tech IT',
    contactNumber: '9876543228',
    parentContactNumber: '9876543229',
    roomNumber: '105'
  }
];

const rooms = [
  { roomNumber: '101', capacity: 2, type: 'AC', price: 6000 },
  { roomNumber: '102', capacity: 2, type: 'Non-AC', price: 4000 },
  { roomNumber: '103', capacity: 2, type: 'AC', price: 6000 },
  { roomNumber: '104', capacity: 3, type: 'Non-AC', price: 3500 },
  { roomNumber: '105', capacity: 2, type: 'AC', price: 6000 },
  { roomNumber: '106', capacity: 1, type: 'AC', price: 8000 },
];

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel-management';
    if (!uri.startsWith('mongodb')) {
        console.warn('Invalid MongoDB URI. Please set MONGODB_URI in .env. Skipping seed.');
        process.exit(0);
    }
    await mongoose.connect(uri);
    console.log('Connected to DB');

    // Clear existing data
    await Student.deleteMany({});
    await Room.deleteMany({});
    await Attendance.deleteMany({});
    await Complaint.deleteMany({});

    // Insert Rooms
    const createdRooms = await Room.insertMany(rooms);
    console.log('Rooms seeded');

    // Insert Students and link to rooms
    const allStudents = [];
    for (const studentData of students) {
      const student = await Student.create(studentData);
      allStudents.push(student);
      
      // Find room and add student to occupants
      const room = await Room.findOne({ roomNumber: studentData.roomNumber });
      if (room) {
        room.occupants.push(student._id);
        await room.save();
      }
    }
    console.log('Students seeded and assigned to rooms');

    // Add dummy attendance
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const attendanceRecords = [];
    for (const student of allStudents) {
      // Mark today
      attendanceRecords.push({
        student: student._id,
        date: today,
        status: Math.random() > 0.1 ? 'Present' : 'Absent',
        markedBy: new mongoose.Types.ObjectId() // Mock admin ID
      });
      // Mark yesterday
      attendanceRecords.push({
        student: student._id,
        date: yesterday,
        status: Math.random() > 0.1 ? 'Present' : 'Absent',
        markedBy: new mongoose.Types.ObjectId() // Mock admin ID
      });
    }
    await Attendance.insertMany(attendanceRecords);
    console.log('Attendance seeded');

    // Add dummy complaints
    const complaints = [
      {
        student: allStudents[0]._id,
        category: 'Electricity',
        description: 'Fan not working in room 101',
        status: 'Pending'
      },
      {
        student: allStudents[2]._id,
        category: 'Water',
        description: 'Leaking tap in bathroom',
        status: 'In Progress'
      },
      {
        student: allStudents[4]._id,
        category: 'Food',
        description: 'Quality of rice was poor today',
        status: 'Resolved'
      }
    ];
    await Complaint.insertMany(complaints);
    console.log('Complaints seeded');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();

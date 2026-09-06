const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Company = require('../models/Company');
const JobPosting = require('../models/JobPosting');
const bcrypt = require('bcryptjs');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await mongoose.connection.dropDatabase();
    console.log('Database dropped');

    const password = await bcrypt.hash('Password123', 10);

    const users = await User.create([
      { name: 'Admin', email: 'admin@example.com', password, role: 'admin' },
      { name: 'Recruiter1', email: 'rec1@example.com', password, role: 'recruiter' },
      { name: 'Candidate1', email: 'cand1@example.com', password, role: 'candidate' }
    ]);

    const company = await Company.create({
      name: 'Tech Corp',
      createdBy: users[1]._id,
      recruiters: [users[1]._id]
    });

    await JobPosting.create({
      company: company._id,
      recruiter: users[1]._id,
      title: 'Software Engineer',
      description: 'Hiring talented Node.js developers.',
      skills: ['Node.js', 'Express', 'MongoDB'],
      location: 'Remote',
      experienceLevel: 'junior'
    });

    console.log('Data seeded');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB().then(seedData);

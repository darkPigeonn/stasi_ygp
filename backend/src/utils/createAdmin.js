const { User } = require('../models');
const { connectDB } = require('../config/database');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ where: { email: 'admin@stasiyohanes.org' } });

    if (adminExists) {
      console.log('❌ Admin user already exists!');
      process.exit(0);
    }

    const admin = await User.create({
      username: 'admin',
      email: 'admin@stasiyohanes.org',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('   Email: admin@stasiyohanes.org');
    console.log('   Password: admin123');
    console.log('   ⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

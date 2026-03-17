const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'Admin';
      await existingAdmin.save();
      console.log('Admin user updated successfully.');
    } else {
      const admin = new User({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'Admin',
        status: 'Active'
      });
      await admin.save();
      console.log('Admin user created successfully.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
};

seedAdmin();

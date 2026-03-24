const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chillbites', {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await User.updateOne(
      { email: 'admin@chillbites.com' },
      {
        $set: {
          username: 'Admin',
          email: 'admin@chillbites.com',
          password: 'admin',
          isAdmin: true,
        },
      },
      { upsert: true }
    );
  } catch (error) {
    console.error(`Database Error: ${error.message}`);
    if (process.env.ALLOW_NO_DB === 'true') {
      console.log('Server continuing without database connection (ALLOW_NO_DB=true).');
      return;
    }
    process.exit(1);
  }
};

module.exports = connectDB;

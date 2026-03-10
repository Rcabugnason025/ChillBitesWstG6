const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chillbites', {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
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

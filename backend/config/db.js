const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URI =
      process.env.MONGO_URI || 'mongodb://localhost:27017/ecommapp';

    const conn = await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nooh_db';
  const fallbackUri = 'mongodb://127.0.0.1:27017/nooh_db';

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });

  const connectOptions = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 20000,
    family: 4,
    autoIndex: true,
  };

  try {
    await mongoose.connect(uri, connectOptions);
  } catch (err) {
    if (uri !== fallbackUri) {
      console.warn('Primary MongoDB connection failed. Trying local fallback...');
      try {
        await mongoose.connect(fallbackUri, connectOptions);
        return;
      } catch (fallbackErr) {
        console.error('Local MongoDB fallback failed:', fallbackErr.message);
        throw fallbackErr;
      }
    }

    console.error('MongoDB connection error:', err.message);
    throw err;
  }
};

module.exports = connectDB;

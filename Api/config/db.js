const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Mongo URI not found in .env ❌");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log('Mongo URI:', process.env.MONGO_URI);

    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Failed:', err.message);
  }
};

module.exports = connectDB;

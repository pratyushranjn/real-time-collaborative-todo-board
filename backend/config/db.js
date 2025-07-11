const mongoose = require("mongoose");

// const mongo_URL = "mongodb://127.0.0.1:27017/real-time-todo"

const mongo_URL = process.env.MONGO_URL

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${mongo_URL}`);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(1);
  }
};

module.exports = connectDB;
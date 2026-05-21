const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n======================================================`);
    console.error(`WARNING: Failed to connect to MongoDB!`);
    console.error(`Reason: ${error.message}`);
    console.error(`Please ensure your local MongoDB service is running on port 27017,`);
    console.error(`or update your MONGO_URI inside server/.env.`);
    console.error(`======================================================\n`);
  }
};

module.exports = connectDB;

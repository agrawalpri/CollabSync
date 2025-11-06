const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI is not defined in .env file");
      throw new Error("MONGO_URI is not defined");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // MongoDB connection options
    });
    
    console.log(`MongoDB connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
    });

  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // Don't exit immediately - allow server to start and retry
    console.error("Server will continue but database operations will fail until MongoDB is connected.");
  }
};

module.exports = connectDB;

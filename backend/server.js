const dotenv = require("dotenv");
dotenv.config(); // must be called at the top

// require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const app = express();
// const authRoutes = require("./routes/auth");
// const userRoutes = require("./routes/user");
// const taskRoutes = require("./routes/task");
// const reportRoutes = require("./routes/report");

// const mongoose = require("mongoose");
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
//middlewares
app.use(express.json());

connectDB();

//routes
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/tasks", taskRoutes);
// app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

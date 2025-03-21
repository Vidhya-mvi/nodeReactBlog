const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./router/authRoutes");
const blogRoutes = require("./router/blogRoutes");

const cors = require("cors");
dotenv.config();
const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,           
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
  })
);

// Static file handling (uploads)
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

// Connect to the database
connectDB();

// Start the server
app.listen(5000, () => console.log("🔥 Server running on http://localhost:5000"));

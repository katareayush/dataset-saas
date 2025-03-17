const express = require("express");
const cors = require("cors"); // Keep this import
const morgan = require("morgan");
const helmet = require("helmet");
const connectDB = require("./config/db");
const errorHandler = require("./utils/errorHandler");
require("dotenv").config();

// Route imports
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Simplified CORS configuration for Vercel deployment
app.use(cors({
  origin: true, // This allows all origins
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
  crossOriginResourcePolicy: false, // This helps with Vercel deployments
  contentSecurityPolicy: false, // This can help with Firebase integration
}));
app.use(morgan("dev")); // Logging

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Base route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Handle preflight requests
app.options('*', cors());

// Catch-all route for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Resource not found" });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS configured to allow all origins`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
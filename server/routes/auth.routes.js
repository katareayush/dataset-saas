// Authentication routes
const express = require("express");
const router = express.Router();
const {
  verifyToken,
  ensureUserExists,
} = require("../middleware/authMiddleware");
const { verifyUser, registerUser } = require("../controllers/auth.controller");

// Verify user route - check if token is valid and return user info
router.get("/verify", verifyToken,  verifyUser);

// Register user after Firebase authentication
router.post("/register", verifyToken, ensureUserExists, registerUser);

module.exports = router;

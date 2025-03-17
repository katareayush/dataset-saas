// Authorization middleware to verify Firebase token
const { auth } = require("../config/firebase-admin");
const User = require("../models/user");

/**
 * Middleware to verify Firebase authentication token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const verifyToken = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Extract token
    const token = authHeader.split("Bearer ")[1];

    // Verify token with Firebase
    const decodedToken = await auth.verifyIdToken(token);

    // Get the uid from the token
    const { uid, email } = decodedToken;

    // Add the user ID to the request
    req.user = { uid, email };

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/**
 * Middleware to ensure user exists in MongoDB
 * Creates user if it doesn't exist
 */
const ensureUserExists = async (req, res, next) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    // Check if user exists in MongoDB
    let user = await User.findOne({ firebaseUid: req.user.uid });
    let role;
    console.log("USER EMAIL:", req.user.email);
    console.log("ENV USER:", process.env.ADMIN_EMAIL);
    if (req.user.email === process.env.ADMIN_EMAIL) {
      role = "admin";
    } else {
      role = "user";
    }
    // If user doesn't exist, create one
    if (!user) {
      user = new User({
        firebaseUid: req.user.uid,
        email: req.user.email,
        displayName: req.user.name || "",
        photoURL: req.user.photoURL || "",
        createdAt: new Date(),
        role: role,
      });

      await user.save();
    }

    // Add MongoDB user to request
    req.mongoUser = user;

    next();
  } catch (error) {
    console.error("Error ensuring user exists:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while processing user",
    });
  }
};

module.exports = {
  verifyToken,
  ensureUserExists,
};

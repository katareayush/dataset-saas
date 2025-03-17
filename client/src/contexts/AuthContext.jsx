import React, { createContext, useContext, useState, useEffect } from "react";
import {
  auth,
  onAuthStateChanged,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  loginWithGoogle,
  logoutUser,
  resetPassword,
} from "../services/firebase";
import { authAPI } from "../services/api";

// Create context
const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [mongoUser, setMongoUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Login with email and password
  const login = async (email, password) => {
    setError("");
    console.log("Email and password:", email, password)
    console.log(
      "Admin credentials in ENV:",
      !!import.meta.env.VITE_ADMIN_EMAIL,
      !!import.meta.env.VITE_ADMIN_PASSWORD
    );
        try {
          // Check if admin credentials are provided in environment

          let user;
          let isAdmin = false;

          if (
            email === import.meta.env.VITE_ADMIN_EMAIL &&
            password === import.meta.env.VITE_ADMIN_PASSWORD
          ) {
            // Use admin credentials from environment variables
            const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
            const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

            if (!adminEmail || !adminPassword) {
              throw new Error(
                "Admin credentials not properly configured in environment variables"
              );
            }

            user = await loginWithEmailAndPassword(adminEmail, adminPassword);
                      await syncWithBackend(true);
            isAdmin = true;
            console.log("Logged in as admin");
          } else {
            // Use provided credentials for normal login
            user = await loginWithEmailAndPassword(email, password);
                      await syncWithBackend();
          }

          return user;
        } catch (err) {
          setError(err.message);
          throw err;
        }
  };

  // Conditional login - uses admin credentials if env variable is set
  const conditionalLogin = async (email, password) => {
    setError("");

  };

  // Register with email and password
  const register = async (email, password, displayName) => {
    setError("");
    try {
      const user = await registerWithEmailAndPassword(
        email,
        password,
        displayName
      );

      // Register with backend
      await syncWithBackend();

      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Login with Google
  const loginWithGoogleProvider = async () => {
    setError("");
    try {
      const user = await loginWithGoogle();

      // Verify with backend
      await syncWithBackend();

      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Reset password
  const forgotPassword = async (email) => {
    setError("");
    try {
      await resetPassword(email);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    setError("");
    try {
      await logoutUser();
      setMongoUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sync with MongoDB through backend
  const syncWithBackend = async (isAdmin = false) => {
    try {
      // Register user in MongoDB if needed
      // If admin login, pass admin role to the backend
      await authAPI.register(isAdmin ? { role: "admin" } : {});

      // Get user data from backend
      const response = await authAPI.verifyToken();

      if (response.data.success) {
        setMongoUser(response.data.data);
      }

      return response.data;
    } catch (err) {
      console.error("Error syncing with backend:", err);
      return null;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // If user is logged in, sync with backend
        try {
          await syncWithBackend();
        } catch (err) {
          console.error("Error syncing with backend:", err);
        }
      } else {
        // If user is logged out, clear MongoDB user
        setMongoUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Context value
  const value = {
    currentUser,
    mongoUser,
    login,
    conditionalLogin,
    register,
    loginWithGoogle: loginWithGoogleProvider,
    logout,
    forgotPassword,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import session from "express-session";  // Import express-session
import googleAuth from "./middleware/googleAuth.js"; // Path to Google Auth middleware
import { facebookAuth } from "./middleware/facebookAuth.js"; // Corrected import
import twitterAuth from "./middleware/twitterAuth.js"; // Import Twitter Auth middleware

import AuthRoutes from "./routes/AuthRoutes.js"; // Correct import for Auth routes
import AdminRoutes from "./routes/AdminRoutes.js"; // Admin routes if any

dotenv.config(); // Load environment variables

const app = express();

// Configure session support for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',  // Set a session secret
  resave: false,  // Do not force the session to be saved back to the store
  saveUninitialized: true,  // Save uninitialized sessions
  cookie: { secure: false }  // Set 'true' for HTTPS in production, 'false' for development
}));

// Google and Facebook Authentication middleware initialization
googleAuth(); // Initialize Google OAuth strategy
facebookAuth(); // Initialize Facebook OAuth strategy
twitterAuth(); // Initialize Twitter OAuth strategy
app.use(passport.initialize()); // Initialize Passport middleware
app.use(passport.session());  // Initialize Passport session support

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI ||"mongodb+srv://gm4175urjitupadhyay:<URJIT2024u>@gdgcamuapp.gcluk.mongodb.net/GDGCAMUAPP?retryWrites=true&w=majority";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/admin", AdminRoutes);  // Admin routes if any
app.use("/api/auth", AuthRoutes);    // Authentication routes

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

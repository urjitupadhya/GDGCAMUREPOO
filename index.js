import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import googleAuth from "./middleware/googleAuth.js";
import { facebookAuth } from "./middleware/facebookAuth.js";
import twitterAuth from "./middleware/twitterAuth.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import AdminRoutes from "./routes/AdminRoutes.js";

dotenv.config();

const app = express();

// ✅ Verify environment variables
console.log("\x1b[36m%s\x1b[0m", "🟢 Loaded ENV Variables:");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Loaded" : "❌ Not Loaded");
console.log("SESSION_SECRET:", process.env.SESSION_SECRET || "❌ Not Loaded");

// ✅ Ensure MONGO_URI is present
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ ERROR: Missing MONGO_URI in .env file");
  process.exit(1);
}

// ✅ Secure session settings (Using MongoDB session storage)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
    },
  })
);

// ✅ Initialize authentication strategies
googleAuth();
facebookAuth();
twitterAuth();
app.use(passport.initialize());
app.use(passport.session());

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Improved CORS settings (Restrict to trusted origins)
const allowedOrigins = ["http://localhost:3000", "https://yourdomain.com"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow cookies & headers
  })
);
app.use(morgan("dev"));

// ✅ MongoDB Connection (Fixed warning)
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("\x1b[32m%s\x1b[0m", "✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ✅ Default route to prevent 404 errors on `/`
app.get("/", (req, res) => {
  res.send("🚀 Welcome to the Admin API!");
});

// ✅ Routes
app.use("/api/admin", AdminRoutes);
app.use("/api/auth", AuthRoutes);

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("\x1b[36m%s\x1b[0m", `🚀 Server running on http://localhost:${PORT}`);
});

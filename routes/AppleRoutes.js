import express from "express";
import passport from "./middleware/appleAuth.js"; // Import the middleware

const router = express.Router();

// Route to start login
router.get("/apple", passport.authenticate("apple"));

// Callback route
router.post(
  "/apple/callback",
  passport.authenticate("apple", { failureRedirect: "/login" }),
  (req, res) => {
    // On success, issue a JWT or create a session
    const token = jwt.sign(req.user, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: req.user });
  }
);

export default router;

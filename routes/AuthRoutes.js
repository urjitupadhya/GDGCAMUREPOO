import express from 'express';
import { CheckUser, Login, Logout, register } from '../controllers/Auth.js';
import { IsUser } from '../middleware/verifyToken.js';
import passport from 'passport';
import jwt from 'jsonwebtoken'; // Import jwt for signing the token
// Request OTP route
import { requestOtp } from '../controllers/Auth.js';
import { requestPasswordResetOtp, resetPassword } from '../controllers/Auth.js';

const AuthRoutes = express.Router();
// Forgot password routes
AuthRoutes.post('/forgot-password', requestPasswordResetOtp); // Send OTP for reset
AuthRoutes.post('/reset-password', resetPassword);
AuthRoutes.post('/request-otp', requestOtp);

// Register route
AuthRoutes.post('/register', register);

// Login route
AuthRoutes.post('/login', Login);

// Logout route
AuthRoutes.post('/logout', Logout);

// Check if user is authenticated
AuthRoutes.get('/CheckUser', IsUser, CheckUser);

// Google Login route (Initiate OAuth)
AuthRoutes.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth Callback route (after authentication)
AuthRoutes.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication failed' });
    }

    // Generate JWT for the authenticated user
    const token = jwt.sign(
      { userId: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return the JWT token and user info
    res.status(200).json({
      success: true,
      message: 'Google Sign-In successful',
      token,
      user: req.user,
    });
  }
);

// Facebook Login route (Initiate OAuth)
AuthRoutes.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Facebook OAuth Callback route (after authentication)
AuthRoutes.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication failed' });
    }

    // Generate JWT for the authenticated user
    const token = jwt.sign(
      { userId: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return the JWT token and user info
    res.status(200).json({
      success: true,
      message: 'Facebook Sign-In successful',
      token,
      user: req.user,
    });
  }
);

// Twitter Login route (Initiate OAuth)
AuthRoutes.get(
  '/twitter',
  passport.authenticate('twitter') // Redirect to Twitter for authentication
);

// Twitter OAuth Callback route (after authentication)
AuthRoutes.get(
  '/twitter/callback',
  passport.authenticate('twitter', { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication failed' });
    }

    // Generate JWT for the authenticated user
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return the JWT token and user info
    res.status(200).json({
      success: true,
      message: 'Twitter Sign-In successful',
      token,
      user: req.user,
    });
  }
);

export default AuthRoutes;

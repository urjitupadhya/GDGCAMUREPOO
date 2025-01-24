import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js"; // Import your User model

// Google Authentication configuration
const googleAuth = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID, // Google OAuth Client ID from environment variables
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google OAuth Client Secret from environment variables
        callbackURL: "http://localhost:3000/api/auth/google/callback", // Update for production if needed
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if the user already exists in the database by email
          let user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
            // If the user doesn't exist, create a new user
            user = new User({
              name: profile.displayName, // User's name from Google
              email: profile.emails[0].value, // User's email from Google
              password: "", // Leave empty for Google sign-in users
              role: "user", // Default role; customize if needed
              googleId: profile.id, // Store Google ID for future reference
              avatar: profile.photos[0]?.value || "", // Store profile picture URL
            });

            // Save the new user to the database
            await user.save();
          }

          // User exists or has been created successfully; return user info
          return done(null, user);
        } catch (error) {
          console.error("Error during Google authentication:", error);
          return done(error, false); // Handle errors gracefully
        }
      }
    )
  );

  // Serialize user to session (store user ID in the session)
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize user from session (retrieve user details using the ID)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); // Fetch user from the database
      done(null, user); // Attach user to the request object
    } catch (error) {
      done(error, null); // Handle errors gracefully
    }
  });
};

export default googleAuth;

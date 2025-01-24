import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from 'dotenv';
import UserModel from '../models/user.js';

dotenv.config();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:5000/api/auth/facebook/callback", // Make sure this matches your Facebook App setup
      profileFields: ['id', 'displayName', 'email', 'photos'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({ facebookId: profile.id });
        if (!user) {
          // Create new user if doesn't exist
          user = new UserModel({
            facebookId: profile.id,
            name: profile.displayName,
            email: profile.emails ? profile.emails[0].value : '',
            profilePicture: profile.photos ? profile.photos[0].value : ''
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Exporting the passport strategy initialization
export const facebookAuth = () => passport.initialize();

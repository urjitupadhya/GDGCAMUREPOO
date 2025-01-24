import passport from "passport";
import { Strategy as TwitterStrategy } from "passport-twitter";
import UserModel from "../models/user.js";

const twitterAuth = () => {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_API_KEY,
        consumerSecret: process.env.TWITTER_API_SECRET,
        callbackURL: "http://localhost:3000/api/auth/twitter/callback", // Use your callback URL here
        includeEmail: true,
      },
      async (token, tokenSecret, profile, done) => {
        try {
          // Check if user already exists
          const existingUser = await UserModel.findOne({ twitterId: profile.id });
          if (existingUser) {
            return done(null, existingUser);
          }

          // If new user, create a new record
          const newUser = new UserModel({
            twitterId: profile.id,
            name: profile.displayName,
            email: profile.emails ? profile.emails[0].value : null, // Twitter doesn't always provide an email
            avatar: profile.photos[0]?.value,
          });

          await newUser.save();
          done(null, newUser);
        } catch (error) {
          done(error, false);
        }
      }
    )
  );

  // Serialize user to session
  passport.serializeUser((user, done) => done(null, user.id));

  // Deserialize user from session
  passport.deserializeUser((id, done) => {
    UserModel.findById(id)
      .then((user) => done(null, user))
      .catch((error) => done(error, false));
  });
};

export default twitterAuth;

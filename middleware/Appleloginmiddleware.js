import passport from "passport";
import AppleStrategy from "passport-apple";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new AppleStrategy(
    {
      clientID: process.env.APPLE_CLIENT_ID, // Your Service ID
      teamID: process.env.APPLE_TEAM_ID,     // Your Team ID
      keyID: process.env.APPLE_KEY_ID,       // Your Key ID
      privateKeyString: process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Your .p8 key
      callbackURL: "http://localhost:3000/api/auth/apple/callback",
    },
    async (accessToken, refreshToken, decodedIdToken, profile, done) => {
      try {
        const user = {
          id: decodedIdToken.sub,
          email: decodedIdToken.email,
          name: `${decodedIdToken.given_name} ${decodedIdToken.family_name}`,
        };
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport;

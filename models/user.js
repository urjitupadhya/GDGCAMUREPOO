import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"], // Allowed values
      default: "user", // Default role
    },
    password: {
      type: String,
      default: "", // Allow empty passwords for Google users
    },
    googleId: {
      type: String, // Store Google ID for users who sign in with Google
      unique: true,
      sparse: true, // Allow null for non-Google users
    },
    avatar: {
      type: String, // Optional: Store profile picture URL
      default: "",
    },
    points: {
      type: Number,
      default: 100, // Initial points awarded upon registration
    },
    level: {
      type: String,
      default: "Newbie", // Initial level based on points
    },
    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Badge", // Reference to the Badge model
      },
    ],
    registered_events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event", // Reference to the Event model for registered events
      },
    ],
    attended_events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event", // Reference to the Event model for attended events
      },
    ],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;

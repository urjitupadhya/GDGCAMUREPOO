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
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", userSchema);

export default UserModel;

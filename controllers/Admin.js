import UserModel from "../models/user.js";
import bcryptjs from "bcryptjs";

// Fetch all users
const Getuser = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

// Delete a user
const deletUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const checkAdmin = await UserModel.findById(userId);

    if (checkAdmin.role === "admin") {
      return res.status(409).json({ message: "You cannot delete yourself" });
    }

    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

// Create a new user (with dynamic role)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create a new user, dynamically setting the role
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user", // Assign "admin" if specified, otherwise "user"
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ success: true, message: "User created successfully", newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { Getuser, deletUser, createUser };

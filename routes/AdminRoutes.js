import express from "express";
import { Getuser, deletUser, createUser } from "../controllers/Admin.js"; // Import createUser
import { isAdmin } from "../middleware/verifyToken.js";

const AdminRoutes = express.Router();

// Admin routes
AdminRoutes.get("/getuser", isAdmin, Getuser); // Fetch all users
AdminRoutes.delete("/delete/:id", isAdmin, deletUser); // Delete a user
AdminRoutes.post("/create", isAdmin, createUser); // Create a new user

export default AdminRoutes;

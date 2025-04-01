import express from "express";
import { Getuser, deletUser, createUser } from "../controllers/Admin.js";
import { isAdmin, IsUser } from "../middleware/verifyToken.js"; // Corrected import
import { addPoints, deductPoints } from "../controllers/PointsController.js";

const router = express.Router(); // Initialize the router

// Route to add points
router.post("/add-points", IsUser, isAdmin, addPoints); // Corrected middleware

// Route to deduct points
router.post("/deduct-points", IsUser, isAdmin, deductPoints); // Corrected middleware

// Fetch all users
router.get("/getuser", isAdmin, Getuser);

// Delete a user
router.delete("/delete/:id", isAdmin, deletUser);

// Create a new user
router.post("/create", isAdmin, createUser);

export default router;

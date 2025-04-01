import UserModel from "../models/user.js";

// Add points to a user
const addPoints = async (req, res) => {
    try {
        const { userId, points } = req.body;

        // Validate input
        if (!userId || typeof points !== 'number' || points <= 0) {
            return res.status(400).json({ success: false, message: "Invalid input" });
        }

        // Find the user by ID and update their points
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { $inc: { points: points } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "Points added successfully", user });
    } catch (error) {
        console.error("Error adding points:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Deduct points from a user
const deductPoints = async (req, res) => {
    try {
        const { userId, points } = req.body;

        // Validate input
        if (!userId || typeof points !== 'number' || points <= 0) {
            return res.status(400).json({ success: false, message: "Invalid input" });
        }

        // Find the user by ID
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if the user has enough points
        if (user.points < points) {
            return res.status(400).json({ success: false, message: "Insufficient points" });
        }

        // Deduct points
        user.points -= points;
        await user.save();

        res.status(200).json({ success: true, message: "Points deducted successfully", user });
    } catch (error) {
        console.error("Error deducting points:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { addPoints, deductPoints };

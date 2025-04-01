import UserModel from "../models/user.js"
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import nodemailer from 'nodemailer'

// Temporary storage for OTPs
const otpStorage = {};

const sendOtp = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStorage[email] = otp;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: '🔐 Your Secure OTP Code',
        text: `🌟 Hello there! 
        
        Your one-time password (OTP) is: ${otp} 
        
        This code is valid for the next 10 minutes. Please don’t share it with anyone for security reasons.
        
        If you didn’t request this, please ignore this message.
        
        Stay safe and secure! 💙✨
        `
        
    };

    await transporter.sendMail(mailOptions);
};

const register = async (req, res) => {
    try {
        const { name, email, password, otp,points } = req.body;

        const existUser = await UserModel.findOne({ email });
        if (existUser) {
            return res.status(401).json({ success: false, message: "User already exists" });
        }

        if (otpStorage[email] !== parseInt(otp)) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        const hashedPassword = await bcryptjs.hashSync(password, 10);
        const newUser = new UserModel({
            name, email, password: hashedPassword
        });

        await newUser.save();
        delete otpStorage[email];

        res.status(200).json({ message: "User registered successfully", newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
        console.log(error);
    }
};

const requestOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const existUser = await UserModel.findOne({ email });
        if (existUser) {
            return res.status(401).json({ success: false, message: "User already exists" });
        }

        await sendOtp(email);
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send OTP" });
        console.log(error);
    }
};

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(404).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000,
        });

        res.status(200).json({ success: true, message: "Login successfully", user, token });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
        console.log(error);
    }
};

const Logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
        console.log(error);
    }
};

const CheckUser = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log(error);
    }
};
// Request OTP for password reset
const requestPasswordResetOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await sendOtp(email);
        res.status(200).json({ message: "Password reset OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send OTP" });
        console.log(error);
    }
};

// Reset password
const resetPassword = async (req, res) => {
    console.log("Request body:", req.body); // <-- Add this line
    const { email, otp, newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ success: false, message: "New password is required" });
    }

    try {
        if (otpStorage[email] !== parseInt(otp)) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        const hashedPassword = bcryptjs.hashSync(newPassword, 10);
        await UserModel.findOneAndUpdate({ email }, { password: hashedPassword });

        delete otpStorage[email];

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
        console.log(error);
    }
};

// Adjust a user's points
const adjustUserPoints = async (req, res) => {
    try {
      const { userId, points } = req.body;
  
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.points += points;
      await user.save();
  
      res.status(200).json({ message: "User points updated successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.log(error);
    }
  };
  
export { requestPasswordResetOtp, resetPassword ,register, Login, Logout, CheckUser, requestOtp,adjustUserPoints };

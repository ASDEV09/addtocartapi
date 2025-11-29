import User from '../models/userModel.mjs'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Fetching data from database
let index = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length > 0) {
      res.status(200).json({ message: "Users found", users: users });
    } else {
      res.status(404).json({ message: "No User found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message })
  }
}

let Signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Required fields validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    let checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({ message: "User already exists. Please login!" });
    }

    // Hash password
    const hashPassword = bcrypt.hashSync(password, 10);

    let newUser = new User({
      username,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Registration successfully completed", user: newUser });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}


//login

let Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // checking if the user doesn't exist
    let checkUser = await User.findOne({ email: email });
    if (checkUser) {
      // hashing the password

      const checkPassword = bcrypt.compareSync(password, checkUser.password) // true/false
      console.log(checkPassword)
      console.log(checkUser)

      if (checkPassword) {
        const token = jwt.sign({ userId: checkUser._id, role: checkUser.role }, process.env.JWT_SECRET);
        res.status(200).json({ message: "Login success", user: checkUser, token });
      }

      else {

        res.status(401).json({ message: "Invalid Credentials" });
      }
    } else {
      res.status(404).json({ message: "User not found. Please Signup..!" });

    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message })
  }
}

// Authentication Middleware
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { userId: "..." }
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: "Invalid token" });
  }
};


// UPDATE PROFILE
let updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;  // FIXED
    const { username, email, password, newPassword, phone } = req.body;

    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update username
    if (username) user.username = username;

    // Update email
    if (email) user.email = email;

    // Update phone
    if (phone) user.phone = phone;

    // Update password
    if (password && newPassword) {
      const checkPassword = bcrypt.compareSync(password, user.password);
      if (!checkPassword) {
        return res.status(401).json({ message: "Old password is incorrect" });
      }

      user.password = bcrypt.hashSync(newPassword, 10);
    }

    // Upload image if provided
    if (req.file && req.file.path) {
      user.profilePicture = req.file.path;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

let forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Create Token
    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min

    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Link",
      html: `
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>This link is valid for 15 minutes.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset link sent to your email" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

let resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } // link valid
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = bcrypt.hashSync(newPassword, 10);
    user.resetPasswordToken = "";
    user.resetPasswordExpires = "";

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


let updateUserByAdmin = async (req, res) => {
  try {
    const { userId, username, email, phone, role, isActive, password } = req.body;

    if (!userId) return res.status(400).json({ message: "User ID is required" });

    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;         // user/admin
    if (typeof isActive !== "undefined") user.isActive = isActive;

    // Update password if provided
    if (password) user.password = bcrypt.hashSync(password, 10);

    // Update profile picture
    if (req.file && req.file.path) user.profilePicture = req.file.path;

    const updatedUser = await user.save();
    res.status(200).json({ message: "User updated successfully", user: updatedUser });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete user by ID (admin only)
const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Add new user by admin
const addUserByAdmin = async (req, res) => {
  try {
    const { username, email, password, phone, role, isActive } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Hash password
    const hashPassword = bcrypt.hashSync(password, 10);

    // Create new user object
    const newUser = new User({
      username,
      email,
      password: hashPassword,
      phone: phone || "",
      role: role || "user",
      isActive: typeof isActive !== "undefined" ? isActive : true,
      profilePicture: req.file ? req.file.path : null
    });

    await newUser.save();
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


const userController = {
  index,
  Signup,
  Login,
  auth,
  updateProfile,
  forgotPassword,
  resetPassword,
  updateUserByAdmin,
  getUserById,
  deleteUserByAdmin,
  addUserByAdmin
}

export default userController;
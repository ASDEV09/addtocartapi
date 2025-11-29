import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/.+@.+\..+/, "Invalid email format"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  profilePicture: {
    type: String,
    default: "https://res.cloudinary.com/drvt8tfwd/image/upload/v1763976999/360_F_587766653_PkBNyGx7mQh9l1XXPtCAq1lBgOsLl6xH_lvncbo.jpg"
  },

  phone: { type: String, default: "" },
  role: { type: String, enum: ["user", "admin"], default: "user" }, // <-- role
  isActive: { type: Boolean, default: true },
  resetPasswordToken: { type: String, default: "" },
  resetPasswordExpires: { type: Date, default: "" },

});

const User = mongoose.model('User', userSchema);

export default User;
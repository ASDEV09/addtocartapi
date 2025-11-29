import User from "../models/userModel.mjs";

const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId); // database se fresh check
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export default requireAdmin;

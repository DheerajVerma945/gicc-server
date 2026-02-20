import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isMatch = admin.password === password;
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign(
      { id: admin._id, email: admin.email, name: admin.name },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );
    return res.status(200).json({
      message: "Login Successful",
      token,
      admin: { id: admin._id, email: admin.email, name: admin.name },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyToken = (req, res) => {
  return res.status(200).json({
    message: "Token is valid",
    admin: req.admin,
  });
};
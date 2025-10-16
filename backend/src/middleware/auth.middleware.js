import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import dotenv from "dotenv";
dotenv.config();

// Middleware to protect routes

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;
		if (!token) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) {
			return res.status(401).json({ message: "Unauthorized - Invalid token" });
		}
		const user = await User.findById(decoded.userId).select("-password");
		if (!user) {
			return res.status(401).json({ message: "Unauthorized - User not found" });
		}
    req.user = user; // Attach user to request object
		next();
	} catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

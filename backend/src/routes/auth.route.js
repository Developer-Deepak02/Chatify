import express from "express";
import {
	signup,
	login,
	logout,
	updateProfile,
	checkAuth,
} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// Apply Arcjet protection middleware to all routes in this router
router.use(arcjetProtection);

//route for user sign-up
router.post("/signup", signup);

// route for user log-in
router.post("/login", arcjetProtection, login);

// route for user log-out
router.post("/logout", logout);

//update profile
router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;

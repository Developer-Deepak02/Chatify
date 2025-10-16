import express from "express";
import {
	signup,
	login,
	logout,
	updateProfile,
} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

//route for user sign-up
router.post("/signup", signup);

// route for user log-in
router.post("/login", login);

// route for user log-out
router.post("/logout", logout);

//update profile
router.put("/update-profile", protectRoute, updateProfile);


export default router;

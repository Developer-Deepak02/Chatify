import { generateToken } from "../lib/utils.js";
import { User } from "../models/User.model.js";
import bcrypt from "bcryptjs";
import "dotenv/config.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import cloudinary from "../lib/cloudinary.js";


// signup user
export const signup = async (req, res) => {
	const { fullname, email, password } = req.body;
	const name = typeof fullname === "string" ? fullname.trim() : "";
	const mail = typeof email === "string" ? email.trim().toLowerCase() : "";
	const pass = typeof password === "string" ? password : "";

	try {
		// validate user input
		if (!fullname || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// check if password is strong
		if (password.length < 6) {
			return res
				.status(400)
				.json({ message: "Password must be at least 6 characters" });
		}
		// check if emails valid: regex
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ message: "Please enter a valid email" });
		}

		// check if user already exists
		const user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ message: "User already exists" });
		}

		// hash password before saving to database
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// create new user
		const newUser = new User({
			fullname,
			email,
			password: hashedPassword,
		});

		if (newUser) {
			// Save user to database
			const savedUser = await newUser.save();
			generateToken(savedUser._id, res);

			// respond with user data excluding password
			res.status(201).json({
				_id: newUser._id,
				email: newUser.email,
				fullname: newUser.fullname,
				profilePic: newUser.profilePic,
			});
			// Send welcome email
			try {
				await sendWelcomeEmail(
					savedUser.email,
					savedUser.fullname,
					process.env.CLIENT_URL
				);
			} catch (error) {
				console.error("Error sending welcome email:", error);
			}
		} else {
			// This case is unlikely to occur, but it's good to handle it
			res.status(400);
			throw new Error("Invalid user data");
		}
		// catch block to handle any unexpected errors
	} catch (error) {
		console.log("Error in signup controller:", error);
		res.status(500).json({ message: "Server Error" });
	}
};

// login user
export const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		// check if user exists
		if (!user) {
			return res.status(400).json({ message: "Invalid email or password" });
		}
		// compare password
		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			return res.status(400).json({ message: "Invalid email or password" });
		}
		// generate token
		generateToken(user._id, res);
		// respond with user data excluding password
		res.status(200).json({
			_id: user._id,
			email: user.email,
			fullname: user.fullname,
			profilePic: user.profilePic,
		});
	} catch (error) {
		console.log("Error in login controller:", error);
		res.status(500).json({ message: "Internal server Error" });
	}
};

// logout user by clearing the cookie
export const logout = (_, res) => {
	res.cookie("jwt", "", { maxAge: 0 });
	res.status(200).json({ message: "User logged out" });
};

// update user profile
export const updateProfile = async (req, res) => {
	try {
		const { profilePic } = req.body;
		if (!profilePic) {
			return res.status(400).json({ message: "Profile picture is required" });
		}

		const userId = req.user._id;
		const uploadResponse = await cloudinary.uploader.upload(profilePic);

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				profilePic: uploadResponse.secure_url,
			},
			{ new: true }
		);

		res.status(200).json(updatedUser);
	} catch (error) {
		console.log("Error in updateProfile controller:", error);
		res.status(500).json({ message: "Internal server Error" });
	}
};

// check authenticated user
export const checkAuth = async (req, res) => {
	try {
		if (!req.user) return res.status(200).json({ user: null });

		const user = await User.findById(req.user._id).select("-password");

		return res.status(200).json({
			user: {
				_id: user._id,
				fullname: user.fullname,
				email: user.email,
				profilePic: user.profilePic, 
			},
		});
	} catch (error) {
		console.log("Error in checkAuth controller:", error);
		res.status(500).json({ message: "Internal server Error" });
	}
};



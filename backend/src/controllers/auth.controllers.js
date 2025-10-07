import { generateToken } from "../lib/utils.js";
import { User } from "../models/User.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
	const { fullname, email, password } = req.body;

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
			// generate token and send as HTTP-only cookie
			generateToken(newUser._id, res);
			await newUser.save();

			// respond with user data excluding password
			res.status(201).json({
				_id: newUser._id,
				email: newUser.email,
				fullname: newUser.fullname,
				profilePic: newUser.profilePic,
			});
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

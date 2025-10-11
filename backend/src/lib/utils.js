import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {

	const {JWT_SECRET} = process.env;
	if (!JWT_SECRET) {
		throw new Error("JWT_SECRET is not defined in environment variables");
	}

	// Wrap userId in an object — jwt.sign() requires a plain object
	const token = jwt.sign({ id: userId }, JWT_SECRET, {
		expiresIn: "14d",
	});

	// Send token as an HTTP-only cookie
	res.cookie("jwt", token, {
		maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
		httpOnly: true,
		sameSite: "strict",
		secure: process.env.NODE_ENV !== "development", // true in production
	});

	return token;
};

import express from "express";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";

dotenv.config();
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieparser()); // Middleware to parse cookies
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectDB();
});

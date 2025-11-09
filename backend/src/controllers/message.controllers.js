import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import { User } from "../models/User.model.js";

export const getAllContacts = (req, res) => {
	try {
		const loggedInUserId = req.user.id;
		const filteredUsers = User.find({ _id: { $ne: loggedInUserId } }).select(
			-"password"
		);
		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getAllContacts:", error);
		res.status(500).json({ message: "Server error while fetching contacts" });
	}
};

export const getMessageByUserId = async (req, res) => {
	try {
		const myId = req.user._id;
		const { id: userToChatId } = req.params;
		const messages = await Message.find({
			$or: [
				{ sender: myId, receiver: userToChatId },
				{ sender: userToChatId, receiver: myId },
			],
		}).sort({ createdAt: 1 }); // sort by createdAt in ascending order

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in get messages controller:", error.message);
		res.status(500).json({ message: "Server Error" });
	}
};

export const sendMessage = async (req, res) => {
	try {
		const { text, image } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let imageUrl;
		if (image) {
			const uploadResponse = await cloudinary.uploader.upload(image);
			imageUrl = uploadResponse.secure_url;
		}

		const newMessage = new Message({
			senderId,
			ReceverId: receiverId,
			text,
			image: imageUrl,
		});

		await newMessage.save();
		res.status(200).json(newMessage);

		//todo : send real-time notification to receiver using socket.io
	} catch (error) {
		console.log("Error in send message controller:", error.message);
		res.status(500).json({ message: "Server Error" });
	}
};

export const getChatPartners = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		// Find distinct user IDs who have chatted with the logged-in user
		const messages = await Message.find({
			$or: [{ senderId: loggedInUserId }, { ReceverId: loggedInUserId }],
		});

		const chatPartnerIds = [
			...new Set(
				messages.map((msg) =>
					msg.senderId.toString() === loggedInUserId.toString()
						? msg.ReceverId.toString()
						: msg.senderId.toString()
				)
			),
		];

		const chatPartners = await User.find({
			_id: { $in: chatPartnerIds },
		}).select(-"password");

		res.status(200).json(chatPartners);
	} catch (error) {
		console.log("Error in get chat partners controller:", error.message);
		res.status(500).json({ message: "Server Error" });
	}
};

// src/emails/emailHandlers.js
import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "../emails/emailTemplate.js";

export const sendWelcomeEmail = async (to, name, clientURL) => {
	if (!resendClient) {
		const msg = "Resend client not configured. Check RESEND_API_KEY in .env";
		console.error(msg);
		throw new Error(msg);
	}

	// Ensure we always have a URL for the button
	const urlToUse =
		clientURL || process.env.CLIENT_URL;

	// Normalize `from` header
	let from;
	if (typeof sender === "string") {
		from = sender;
	} else if (sender && sender.name && sender.email) {
		from = `${sender.name} <${sender.email}>`;
	} else if (sender && sender.email) {
		from = sender.email;
	} else {
		from = "no-reply@example.com";
	}

	const payload = {
		from,
		to,
		subject: "Welcome to Chatify! 🎉",
		html: createWelcomeEmailTemplate(name, urlToUse),
	};

	try {
		if (resendClient.emails && typeof resendClient.emails.send === "function") {
			const result = await resendClient.emails.send(payload);
			console.log("Welcome email sent successfully (emails.send):", result);
			return result;
		}

		if (typeof resendClient.send === "function") {
			const result = await resendClient.send(payload);
			console.log("Welcome email sent successfully (send):", result);
			return result;
		}

		console.error(
			"Resend client does not expose emails.send or send. Keys:",
			Object.keys(resendClient)
		);
		throw new Error(
			"Resend client does not expose a send method. Check 'resend' package version."
		);
	} catch (err) {
		console.error("Error sending welcome email:", err);
		throw err;
	}
};

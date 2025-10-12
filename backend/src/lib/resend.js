// src/lib/resend.js
import "dotenv/config";
import { Resend } from "resend";

// Accept either RESEND_API_KEY (preferred) or the older Resend_API_Key if present
const API_KEY = process.env.RESEND_API_KEY || process.env.Resend_API_Key;

if (!API_KEY) {
	console.warn(
		"Warning: RESEND_API_KEY not found. Set RESEND_API_KEY in your .env. Resend client will be undefined."
	);
}

export const resendClient = API_KEY ? new Resend(API_KEY) : undefined;

// Format sender as "Name <email@example.com>" which most mail APIs expect.
// Falls back to the raw EMAIL_FROM or a safe default.
export const sender =
	process.env.EMAIL_FROM_NAME && process.env.EMAIL_FROM
		? `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`
		: process.env.EMAIL_FROM || "no-reply@example.com";

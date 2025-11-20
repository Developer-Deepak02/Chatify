import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
	authUser: null,
	isCheckingAuth: true,
	isSigningUp: false,
	isLoggingIn: false,

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get("/auth/check");
		} catch (error) {
			console.log("error in authCheck:", error);
			set({ authUser: null });
		} finally {
			set({ isCheckingAuth: false });
		}
	},

	signup: async (data) => {
		set({ isSigningUp: true });
		try {
			const res = await axiosInstance.post("/auth/signup", data);
			set({ authUser: res.data });

			toast.success("Account created successfully");
		} catch (error) {
			toast.error(
				error.response.data.message || "Signup failed. Please try again."
			);
			console.log("Error in signup:", error);
		} finally {
			set({ isSigningUp: false });
		}
	},

	login: async (data) => {
		set({ isLoggingIn: true });
		try {
			const res = await axiosInstance.post("/auth/login", data);
			set({ authUser: res.data });

			toast.success("Logged in successfully");

			get().connectSocket();
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isLoggingIn: false });
		}
	},


	logout: async () => {
		try {
			await axiosInstance.post("/auth/logout");
			set({ authUser: null });
			toast.success("Logged out successfully");
		} catch (error) {
			console.log("Error in logout:", error);
			toast.error("Logout failed. Please try again.");
		}
	}
}));

export default useAuthStore;
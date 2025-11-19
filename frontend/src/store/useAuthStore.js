import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
	authUser: null,
	isCheckingAuth: true,
	isSigningUp: false,

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

			toast.success("Account created successfully !");
		} catch (error) {
			toast.error(
				error.response.data.message || "Signup failed. Please try again."
			);
			console.log("Error in signup:", error);
		} finally {
			set({ isSigningUp: false });
		}
	},
}));

export default useAuthStore;
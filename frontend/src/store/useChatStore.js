import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
	allContacts: [],
	chats: [],
	messages: [],
	activeTab: "chats", // 'chats' or 'contacts'
	selectedUser: null,
	isUserLoading: false,
	isMessagesLoading: false,
	isSoundEnabled:
		localStorage.getItem("isSoundEnabled") === "true" ? true : false,

    toggleSound:()=>{
      localStorage.setItem("isSoundEnabled", !get().isSoundEnabled)
      set({isSoundEnabled: !get().isSoundEnabled})
    },

    setActiveTab:(tab)=> set({activeTab: tab}),
    setSelectedUser: (user) => set({ selectedUser : user }),


    getAllContacts: async () => {
      set({isUserLoading: true});
      try {
        const res = await axiosInstance.get("/messages/contacts");
        set({allContacts: res.data});
      } catch (error) {
        toast.error("Failed to fetch contacts");
        console.log("Error fetching contacts:", error);
      } finally {
        set({isUserLoading: false});
      }
    },
    getMyChatPartners: async () => {
      set({isUserLoading: true});
      try {
        const res = await axiosInstance.get("/messages/chats");
        set({chats: res.data});
      } catch (error) {
        toast.error("Failed to fetch chat partners");
        console.log("Error fetching chat partners:", error);
      } finally {
        set({isUserLoading: false});
      }
    },

}));
 
export default useChatStore;

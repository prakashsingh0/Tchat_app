import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAiStore = create((set) => ({
  answers: {},

  Aimessage: async (messageText) => {
    try {
      const formattedPrompt = [
        {
          role: "user",
          parts: [{ text: messageText }],
        },
      ];

      const res = await axiosInstance.post("/auth/aichat", { prompt: formattedPrompt });
      set({ answers: res.data });
    } catch (error) {
      console.error("AI message error:", error.message);
    }
  },
}));

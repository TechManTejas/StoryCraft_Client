import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_STORYCRAFT_SERVER_URL,
});

export const api = {
  signUp: async (username, password) => {
    try {
      const res = await axiosInstance.post("/signup/", { username, password });

      if (res.data) return { isSuccess: true, token: res.data.token };
    } catch (err) {
      return {
        isSuccess: false,
        message: err,
      };
    }
  },

  login: async (username, password) => {
    try {
      const res = await axiosInstance.post("/auth/", { username, password });

      if (res.data) return { isSuccess: true, token: res.data.token };
    } catch (err) {
      return {
        isSuccess: false,
        message: err,
      };
    }
  },
};

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
        message: err.message,
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
        message: err.message,
      };
    }
  },

  fetchGenres: async (token) => {
    try {
      console.log("Fetching genres with token:", token);
      const res = await axiosInstance.get("/genres/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (res.data) return { isSuccess: true, genres: res.data };
    } catch (err) {
      return {
        isSuccess: false,
        message: err.message,
      };
    }
  },
};


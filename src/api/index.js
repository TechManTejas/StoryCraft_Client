import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_STORYCRAFT_SERVER_URL,
});

let authToken = null;

export const setAuthToken = async (token) => {
  authToken = token;
  await AsyncStorage.setItem("userToken", token);
};

export const getAuthToken = async () => {
  if (!authToken) {
    authToken = await AsyncStorage.getItem("userToken");
  }
  return authToken;
};

export const api = {
  signUp: async (username, password) => {
    try {
      const res = await axiosInstance.post("/signup/", { username, password });
      if (res.data) {
        await setAuthToken(res.data.token);
        return { isSuccess: true, token: res.data.token };
      }
    } catch (err) {
      return { isSuccess: false, message: err.message };
    }
  },

  login: async (username, password) => {
    try {
      const res = await axiosInstance.post("/auth/", { username, password });
      if (res.data) {
        await setAuthToken(res.data.token);
        return { isSuccess: true, token: res.data.token };
      }
    } catch (err) {
      return { isSuccess: false, message: err.message };
    }
  },

  getGenres: async () => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get("/genres/", {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) return { isSuccess: true, genres: res.data };
    } catch (err) {
      return { isSuccess: false, message: err.message };
    }
  },
};

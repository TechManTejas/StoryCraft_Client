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
      return { isSuccess: false, message: err.response?.data?.message || err.message };
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
      return { isSuccess: false, message: err.response?.data?.message || err.message };
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
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  generateStory: async (genre_id) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.post(
        "/stories/generate_story/",
        { genre_id },
        { headers: { Authorization: `Token ${token}` } }
      );
      if (res.data) return { isSuccess: true, story: res.data.response };
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  saveStory: async (story) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.post(
        "/stories/",
        story,
        { headers: { Authorization: `Token ${token}` } }
      );
      if (res.data) return { isSuccess: true, storyId: res.data.id };
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  getScenes: async (story_id) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get("/scenes/", {
        params: { story_id },
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) return { isSuccess: true, scene: res.data };
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },
  updateScene: async (story_id, scene_id, choice) => {
    try {
      const token = await getAuthToken();
      const payload = { story_id, scene_id, choice };
      console.log("Payload being sent:", payload);

      const res = await axiosInstance.post("/scenes/", payload, {
        headers: { Authorization: `Token ${token}` },
      });
      
      console.log("Response from server:", res.data);
      if (res.data) {
        return { isSuccess: true, updatedScene: res.data };
      } else {
        return { isSuccess: false, message: "No data in response" };
      }
    } catch (err) {
      console.log("Error updating story:", err.response ? err.response.data : err.message);
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },
  deleteAccount : async () => {
    
      const token = await getAuthToken();
      const res = await axiosInstance.post("/delete-account/", {}, {
        headers: { Authorization: `Token ${token}` },
      });
      
      if (res.data) {
        return { isSuccess: true };
      } else {
        return { isSuccess: false, message: "No data in response" };
      }
    
  },
};

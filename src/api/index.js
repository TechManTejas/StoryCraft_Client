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

      const res = await axiosInstance.get("/scenes/", {
        params: { story_id , scene_id , choice},
        headers: { Authorization: `Token ${token}` },
      });

      console.log("Response from server:", res.data);
      if (res.data) {
        return { isSuccess: true, updatedScene: res.data };
      } else {
        return { isSuccess: false, message: "No data in response" };
      }
    } catch (err) {
      console.log("Error from server:", err.response?.data || err.message);
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  getStoryTimeline: async (story_id) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get(`/stories/${story_id}/timeline/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, timeline: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  generateImage: async (story_id, scene_id, context) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.post(
        "/images/generate/",
        { story_id, scene_id, context },
        { headers: { Authorization: `Token ${token}` } }
      );
      if (res.data) {
        return { isSuccess: true, imageUrl: res.data.image_url, imageId: res.data.id };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  getStoryImages: async (story_id) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get(`/images/`, {
        params: { story_id },
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, images: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  // Collaborative Platform APIs
  getPublicStories: async (page = 1, limit = 20, genre = null, search = null) => {
    try {
      const token = await getAuthToken();
      const params = { page, limit };
      if (genre) params.genre = genre;
      if (search) params.search = search;
      
      const res = await axiosInstance.get("/stories/public/", {
        params,
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, stories: res.data.results || res.data, total: res.data.count || res.data.length };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  getPublicStoryDetails: async (story_id) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get(`/stories/${story_id}/public/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, story: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  likeStory: async (story_id) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.post(
        `/stories/${story_id}/like/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      if (res.data) {
        return { isSuccess: true, liked: res.data.liked, likesCount: res.data.likes_count };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  followUser: async (username) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.post(
        `/users/${username}/follow/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      if (res.data) {
        return { isSuccess: true, following: res.data.following };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  getUserProfile: async (username) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get(`/users/${username}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, user: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  getUserStories: async (username, page = 1) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get(`/users/${username}/stories/`, {
        params: { page },
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, stories: res.data.results || res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  getTrendingStories: async () => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get("/stories/trending/", {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, stories: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  addComment: async (story_id, comment) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.post(
        `/stories/${story_id}/comments/`,
        { comment },
        { headers: { Authorization: `Token ${token}` } }
      );
      if (res.data) {
        return { isSuccess: true, comment: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  getStoryComments: async (story_id) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get(`/stories/${story_id}/comments/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, comments: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  // Reels APIs
  createReel: async (story_id, video_url, caption, thumbnail_url) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.post(
        "/reels/",
        { story_id, video_url, caption, thumbnail_url },
        { headers: { Authorization: `Token ${token}` } }
      );
      if (res.data) {
        return { isSuccess: true, reel: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  getReels: async (page = 1, limit = 20) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get("/reels/", {
        params: { page, limit },
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, reels: res.data.results || res.data, total: res.data.count || res.data.length };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  getReelDetails: async (reel_id) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get(`/reels/${reel_id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, reel: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  likeReel: async (reel_id) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.post(
        `/reels/${reel_id}/like/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      if (res.data) {
        return { isSuccess: true, liked: res.data.liked, likesCount: res.data.likes_count };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  shareReel: async (reel_id, recipient_username) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.post(
        `/reels/${reel_id}/share/`,
        { recipient_username },
        { headers: { Authorization: `Token ${token}` } }
      );
      if (res.data) {
        return { isSuccess: true, message: res.data.message };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  getMyReels: async () => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get("/reels/my/", {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, reels: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  // Messaging APIs
  getConversations: async () => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get("/messages/conversations/", {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, conversations: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  getMessages: async (conversation_id, page = 1) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get(`/messages/conversations/${conversation_id}/messages/`, {
        params: { page },
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, messages: res.data.results || res.data, total: res.data.count || res.data.length };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  sendMessage: async (recipient_username, message, message_type = "text") => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.post(
        "/messages/send/",
        { recipient_username, message, message_type },
        { headers: { Authorization: `Token ${token}` } }
      );
      if (res.data) {
        return { isSuccess: true, message: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  createConversation: async (username) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.post(
        "/messages/conversations/",
        { username },
        { headers: { Authorization: `Token ${token}` } }
      );
      if (res.data) {
        return { isSuccess: true, conversation: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  searchUsers: async (query) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get("/users/search/", {
        params: { q: query },
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, users: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  // Subscription APIs
  getSubscriptionPlans: async () => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get("/subscriptions/plans/", {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, plans: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  getCurrentSubscription: async () => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get("/subscriptions/current/", {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, subscription: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  subscribe: async (plan_id, payment_method) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.post(
        "/subscriptions/subscribe/",
        { plan_id, payment_method },
        { headers: { Authorization: `Token ${token}` } }
      );
      if (res.data) {
        return { isSuccess: true, subscription: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  cancelSubscription: async () => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.post(
        "/subscriptions/cancel/",
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      if (res.data) {
        return { isSuccess: true, message: res.data.message };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  // Saved and Liked Content APIs
  getSavedStories: async () => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get("/saved/stories/", {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, stories: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  getLikedStories: async () => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get("/liked/stories/", {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, stories: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  getSavedReels: async () => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get("/saved/reels/", {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, reels: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  getLikedReels: async () => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.get("/liked/reels/", {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, reels: res.data };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  saveStory: async (story_id) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.post(
        `/stories/${story_id}/save/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      if (res.data) {
        return { isSuccess: true, saved: res.data.saved };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },

  unsaveStory: async (story_id) => {
    try {
      const token = await getAuthToken();
      const res = await axiosInstance.delete(`/stories/${story_id}/save/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.data) {
        return { isSuccess: true, saved: false };
      }
    } catch (err) {
      return { isSuccess: false, message: err.response?.data?.message || err.message };
    }
  },
};

import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await authAPI.refresh(refreshToken);
        const newAccessToken = res.accessToken;

        // Update localStorage and retry original request
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // optional redirect
      }
    }

    return Promise.reject(error);
  }
);

// ==================== AUTH API CALLS ====================
export const authAPI = {
  signup: async (userData) => {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    console.log("user log", response);
    return response.data;
  },

  refresh: async (refreshToken) => {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify/${token}`);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, {
      password,
    });
    return response.data;
  },
};

// ==================== USER API CALLS ====================
export const userAPI = {
  getProfile: async () => {
    const response = await api.get("/user/profile");
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put("/user/profile", userData);
    return response.data;
  },

  updateVisibility: async (visibilitySettings) => {
    const response = await api.put("/user/visibility", visibilitySettings);
    return response.data;
  },

  searchUsers: async (query, limit = 10) => {
    const response = await api.get(`/user/search?q=${query}&limit=${limit}`);
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  },

  createSecret: async (secretData) => {
    const response = await api.post("/user/secrets", secretData);
    return response.data;
  },

  getSecrets: async () => {
    const response = await api.get("/user/secrets");
    return response.data;
  },
};

// ==================== TREE API CALLS ====================
export const treeAPI = {
  getFamilyTree: async (userId, depth = 3, format = "graph") => {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    params.append("depth", depth);
    params.append("format", format);

    const response = await api.get(`/tree?${params}`);
    return response.data;
  },

  getAncestors: async (userId, generations = 3) => {
    const response = await api.get(
      `/tree/ancestors/${userId}?generations=${generations}`
    );
    return response.data;
  },

  getDescendants: async (userId, generations = 3) => {
    const response = await api.get(
      `/tree/descendants/${userId}?generations=${generations}`
    );
    return response.data;
  },

  getSiblings: async (userId) => {
    const response = await api.get(`/tree/siblings/${userId}`);
    return response.data;
  },

  getTreeStats: async (userId) => {
    const response = await api.get(`/tree/stats/${userId}`);
    return response.data;
  },
};

// ==================== RELATIONSHIP API CALLS ====================
export const relationshipAPI = {
  createRelationship: async (relationshipData) => {
    const response = await api.post("/relationships", relationshipData);
    return response.data;
  },

  respondToRequest: async (relationshipId, action) => {
    const response = await api.post("/relationships/respond", {
      relationshipId,
      action,
    });
    return response.data;
  },

  getRelationships: async (status, type) => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (type) params.append("type", type);

    const response = await api.get(`/relationships?${params}`);
    return response.data;
  },

  getPendingRequests: async () => {
    const response = await api.get("/relationships/pending");
    return response.data;
  },

  deleteRelationship: async (relationshipId) => {
    const response = await api.delete(`/relationships/${relationshipId}`);
    return response.data;
  },
};

// ==================== PLACEHOLDER API CALLS ====================
export const placeholderAPI = {
  getPlaceholders: async (status, relationType) => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (relationType) params.append("relationType", relationType);

    const response = await api.get(`/placeholders?${params}`);
    return response.data;
  },

  createPlaceholder: async (placeholderData) => {
    const response = await api.post("/placeholders", placeholderData);
    return response.data;
  },

  claimPlaceholder: async (placeholderId, evidence) => {
    const response = await api.post(`/placeholders/${placeholderId}/claim`, {
      evidence,
    });
    return response.data;
  },

  resolvePlaceholder: async (placeholderId, claimId, action) => {
    const response = await api.post(`/placeholders/${placeholderId}/resolve`, {
      claimId,
      action,
    });
    return response.data;
  },

  searchPlaceholders: async (query, relationType, gender) => {
    const params = new URLSearchParams();
    params.append("q", query);
    if (relationType) params.append("relationType", relationType);
    if (gender) params.append("gender", gender);

    const response = await api.get(`/placeholders/search?${params}`);
    return response.data;
  },

  updatePlaceholder: async (placeholderId, updateData) => {
    const response = await api.put(
      `/placeholders/${placeholderId}`,
      updateData
    );
    return response.data;
  },

  deletePlaceholder: async (placeholderId) => {
    const response = await api.delete(`/placeholders/${placeholderId}`);
    return response.data;
  },
};

// ==================== EVENT API CALLS ====================
export const eventAPI = {
  getEvents: async (
    userId,
    type,
    limit = 20,
    offset = 0,
    startDate,
    endDate
  ) => {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    if (type) params.append("type", type);
    params.append("limit", limit);
    params.append("offset", offset);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await api.get(`/events?${params}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post("/events", eventData);
    return response.data;
  },

  getEventById: async (eventId) => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  updateEvent: async (eventId, updateData) => {
    const response = await api.put(`/events/${eventId}`, updateData);
    return response.data;
  },

  deleteEvent: async (eventId) => {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  },

  reactToEvent: async (eventId, reactionType) => {
    const response = await api.post(`/events/${eventId}/react`, {
      type: reactionType,
    });
    return response.data;
  },

  removeReaction: async (eventId) => {
    const response = await api.delete(`/events/${eventId}/react`);
    return response.data;
  },

  addComment: async (eventId, content) => {
    const response = await api.post(`/events/${eventId}/comment`, { content });
    return response.data;
  },

  getUserTimeline: async (userId, limit = 20, offset = 0) => {
    const response = await api.get(
      `/events/user/${userId}/timeline?limit=${limit}&offset=${offset}`
    );
    return response.data;
  },
};

// ==================== MEDIA API CALLS ====================
export const mediaAPI = {
  uploadMedia: async (formData) => {
    const response = await api.post("/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getMedia: async (type, linkedTo, limit = 20, offset = 0) => {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (linkedTo) params.append("linkedTo", linkedTo);
    params.append("limit", limit);
    params.append("offset", offset);

    const response = await api.get(`/media?${params}`);
    return response.data;
  },

  getMediaById: async (mediaId) => {
    const response = await api.get(`/media/${mediaId}`);
    return response.data;
  },

  updateMedia: async (mediaId, updateData) => {
    const response = await api.put(`/media/${mediaId}`, updateData);
    return response.data;
  },

  deleteMedia: async (mediaId) => {
    const response = await api.delete(`/media/${mediaId}`);
    return response.data;
  },

  getMediaGallery: async (userId, type, limit = 20, offset = 0) => {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    params.append("limit", limit);
    params.append("offset", offset);

    const response = await api.get(`/media/gallery/${userId}?${params}`);
    return response.data;
  },

  bulkUploadMedia: async (formData) => {
    const response = await api.post("/media/bulk-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

// ==================== NOTIFICATION API CALLS ====================
export const notificationAPI = {
  getNotifications: async (read, type, limit = 20, offset = 0) => {
    const params = new URLSearchParams();
    if (read !== undefined) params.append("read", read);
    if (type) params.append("type", type);
    params.append("limit", limit);
    params.append("offset", offset);

    const response = await api.get(`/notifications?${params}`);
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put("/notifications/read-all");
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  deleteAllNotifications: async () => {
    const response = await api.delete("/notifications");
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get("/notifications/unread-count");
    return response.data;
  },

  getNotificationTypes: async () => {
    const response = await api.get("/notifications/types");
    return response.data;
  },
};

// ==================== HEALTH CHECK ====================
export const healthAPI = {
  check: async () => {
    const response = await api.get("/health");
    return response.data;
  },
};

export default api;
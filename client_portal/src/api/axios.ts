import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("yumzy_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem("yumzy_refresh_token");
        if (!refreshToken) throw new Error("No refresh token");
        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });
        const newToken = res.data.token;
        localStorage.setItem("yumzy_token", newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        localStorage.removeItem("yumzy_token");
        localStorage.removeItem("yumzy_refresh_token");
        localStorage.removeItem("yumzy_user");
        const isAdmin = window.location.pathname.startsWith("/admin");
        window.location.href = isAdmin ? "/authentication" : "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

import api from "./axios";

export interface AuthUser {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: "admin" | "restaurant_owner";
  phone?: string;
  avatar?: string;
  restaurantId?: string;
  isActive?: boolean;
}

export const authAPI = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
  }) => {
    const res = await api.post("/auth/register", {
      ...data,
      role: data.role || "restaurant_owner",
    });
    if (res.data.token) {
      localStorage.setItem("yumzy_token", res.data.token);
      localStorage.setItem("yumzy_refresh_token", res.data.refreshToken);
      localStorage.setItem("yumzy_user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await api.post("/auth/login", data);
    if (res.data.token) {
      localStorage.setItem("yumzy_token", res.data.token);
      localStorage.setItem("yumzy_refresh_token", res.data.refreshToken);
      localStorage.setItem("yumzy_user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("yumzy_token");
      localStorage.removeItem("yumzy_refresh_token");
      localStorage.removeItem("yumzy_user");
    }
  },

  getProfile: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },

  updateProfile: async (data: FormData | Record<string, string>) => {
    const isFormData = data instanceof FormData;
    const res = await api.patch("/auth/me", data, isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined);
    if (res.data.data) {
      localStorage.setItem("yumzy_user", JSON.stringify(res.data.data));
    }
    return res.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const res = await api.patch("/auth/change-password", data);
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  },

  resetPassword: async (token: string, password: string) => {
    const res = await api.post(`/auth/reset-password/${token}`, { password });
    return res.data;
  },

  getCurrentUser: (): AuthUser | null => {
    const user = localStorage.getItem("yumzy_user");
    return user ? JSON.parse(user) : null;
  },

  isLoggedIn: () => !!localStorage.getItem("yumzy_token"),
};

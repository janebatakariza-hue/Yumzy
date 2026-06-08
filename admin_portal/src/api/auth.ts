import api from "./axios";

export interface AuthUser {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: "admin" | "restaurant_owner";
  phone?: string;
  avatar?: string;
  isActive?: boolean;
}

export const authAPI = {
  login: async (data: { email: string; password: string }) => {
    const res = await api.post("/auth/login", data);
    if (res.data.token) {
      localStorage.setItem("yumzy_admin_token", res.data.token);
      localStorage.setItem("yumzy_admin_refresh_token", res.data.refreshToken);
      localStorage.setItem("yumzy_admin_user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("yumzy_admin_token");
      localStorage.removeItem("yumzy_admin_refresh_token");
      localStorage.removeItem("yumzy_admin_user");
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
      localStorage.setItem("yumzy_admin_user", JSON.stringify(res.data.data));
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

  getCurrentUser: (): AuthUser | null => {
    const user = localStorage.getItem("yumzy_admin_user");
    return user ? JSON.parse(user) : null;
  },

  isLoggedIn: () => !!localStorage.getItem("yumzy_admin_token"),
};

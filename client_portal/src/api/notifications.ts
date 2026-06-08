import api from "./axios";

export const notificationsAPI = {
  getAll: async () => {
    const res = await api.get("/notifications");
    return res.data;
  },

  markRead: async (id: string) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  },

  markAllRead: async () => {
    const res = await api.patch("/notifications/read-all");
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  },
};
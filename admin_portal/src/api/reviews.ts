import api from "./axios";

export const reviewsAPI = {
  getAll: async (params?: Record<string, unknown>) => {
    const res = await api.get("/reviews", { params });
    return res.data;
  },

  updateStatus: async (id: string, status: string) => {
    const res = await api.patch(`/reviews/${id}/status`, { status });
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/reviews/${id}`);
    return res.data;
  },
};

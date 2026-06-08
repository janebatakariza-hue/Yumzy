import api from "./axios";

export const reviewsAPI = {
  getAll: async (params?: {
    restaurantId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const res = await api.get("/reviews", { params });
    return res.data;
  },

  getOne: async (id: string) => {
    const res = await api.get(`/reviews/${id}`);
    return res.data;
  },

  create: async (data: {
    restaurantId: string;
    rating: number;
    comment: string;
  }) => {
    const res = await api.post("/reviews", data);
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

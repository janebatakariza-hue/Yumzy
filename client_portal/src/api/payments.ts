import api from "./axios";

export const paymentsAPI = {
  getAll: async (params?: {
    status?: string;
    restaurantId?: string;
    page?: number;
    limit?: number;
  }) => {
    const res = await api.get("/payments", { params });
    return res.data;
  },

  getStats: async () => {
    const res = await api.get("/payments/stats");
    return res.data;
  },

  getOne: async (id: string) => {
    const res = await api.get(`/payments/${id}`);
    return res.data;
  },

  updateStatus: async (id: string, status: string) => {
    const res = await api.patch(`/payments/${id}/status`, { status });
    return res.data;
  },
};

import api from "./axios";

export const ordersAPI = {
  getAll: async (params?: Record<string, unknown>) => {
    const res = await api.get("/orders", { params });
    return res.data;
  },

  getStats: async () => {
    const res = await api.get("/orders/stats");
    return res.data;
  },

  getOne: async (id: string) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },

  updateStatus: async (id: string, status: string) => {
    const res = await api.patch(`/orders/${id}/status`, { status });
    return res.data;
  },
};

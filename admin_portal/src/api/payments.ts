import api from "./axios";

export const paymentsAPI = {
  getAll: async (params?: Record<string, unknown>) => {
    const res = await api.get("/payments", { params });
    return res.data;
  },

  getStats: async () => {
    const res = await api.get("/payments/stats");
    return res.data;
  },

  updateStatus: async (id: string, status: string) => {
    const res = await api.patch(`/payments/${id}/status`, { status });
    return res.data;
  },
};

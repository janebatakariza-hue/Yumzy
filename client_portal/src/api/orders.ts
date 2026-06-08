import api from "./axios";

export const ordersAPI = {
  getAll: async (params?: {
    status?: string;
    restaurantId?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) => {
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

  create: async (data: {
    restaurantId: string;
    tableId?: string;
    clientName?: string;
    clientPhone?: string;
    items: { menuItemId: string; name: string; qty: number; price: number }[];
    paymentMethod?: string;
  }) => {
    const res = await api.post("/orders", data);
    return res.data;
  },

  updateStatus: async (id: string, status: string) => {
    const res = await api.patch(`/orders/${id}/status`, { status });
    return res.data;
  },
};

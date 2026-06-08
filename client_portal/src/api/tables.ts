import api from "./axios";

export const tablesAPI = {
  getAll: async (params?: {
    restaurantId?: string;
    status?: string;
  }) => {
    const res = await api.get("/tables", { params });
    return res.data;
  },

  getOne: async (id: string) => {
    const res = await api.get(`/tables/${id}`);
    return res.data;
  },

  create: async (data: {
    tableNumber: string;
    capacity: number;
    restaurantId: string;
    waiterName?: string;
  }) => {
    const res = await api.post("/tables", data);
    return res.data;
  },

  update: async (id: string, data: object) => {
    const res = await api.patch(`/tables/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/tables/${id}`);
    return res.data;
  },

  updateStatus: async (id: string, status: string) => {
    const res = await api.patch(`/tables/${id}/status`, { status });
    return res.data;
  },
};

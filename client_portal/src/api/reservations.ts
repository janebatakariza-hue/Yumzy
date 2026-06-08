import api from "./axios";

export const reservationsAPI = {
  getAll: async (params?: {
    restaurantId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const res = await api.get("/reservations", { params });
    return res.data;
  },

  getOne: async (id: string) => {
    const res = await api.get(`/reservations/${id}`);
    return res.data;
  },

  create: async (data: object) => {
    const res = await api.post("/reservations", data);
    return res.data;
  },

  updateStatus: async (id: string, status: string) => {
    const res = await api.patch(`/reservations/${id}/status`, { status });
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/reservations/${id}`);
    return res.data;
  },
};

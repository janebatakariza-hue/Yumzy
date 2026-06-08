import api from "./axios";

export const restaurantsAPI = {
  getAll: async (params?: Record<string, unknown>) => {
    const res = await api.get("/restaurants", { params });
    return res.data;
  },

  getOne: async (id: string) => {
    const res = await api.get(`/restaurants/${id}`);
    return res.data;
  },

  create: async (data: object) => {
    const res = await api.post("/restaurants", data);
    return res.data;
  },

  update: async (id: string, data: object) => {
    const res = await api.patch(`/restaurants/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/restaurants/${id}`);
    return res.data;
  },

  approve: async (id: string) => {
    const res = await api.patch(`/restaurants/${id}/approve`);
    return res.data;
  },

  suspend: async (id: string) => {
    const res = await api.patch(`/restaurants/${id}/suspend`);
    return res.data;
  },

  toggleOpen: async (id: string) => {
    const res = await api.patch(`/restaurants/${id}/toggle-open`);
    return res.data;
  },
};

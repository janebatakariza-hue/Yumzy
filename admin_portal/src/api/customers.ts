import api from "./axios";

export const customersAPI = {
  getAll: async (params?: Record<string, unknown>) => {
    const res = await api.get("/customers", { params });
    return res.data;
  },

  create: async (data: object) => {
    const res = await api.post("/customers", data);
    return res.data;
  },

  update: async (id: string, data: object) => {
    const res = await api.patch(`/customers/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/customers/${id}`);
    return res.data;
  },
};

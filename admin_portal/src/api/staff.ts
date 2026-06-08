import api from "./axios";

export const staffAPI = {
  getAll: async (params?: Record<string, unknown>) => {
    const res = await api.get("/staff", { params });
    return res.data;
  },

  create: async (data: object) => {
    const res = await api.post("/staff", data);
    return res.data;
  },

  update: async (id: string, data: object) => {
    const res = await api.patch(`/staff/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/staff/${id}`);
    return res.data;
  },

  toggleActive: async (id: string) => {
    const res = await api.patch(`/staff/${id}/toggle-active`);
    return res.data;
  },
};

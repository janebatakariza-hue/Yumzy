import api from "./axios";

export const staffAPI = {
  getAll: async (params?: {
    restaurantId?: string;
    role?: string;
    isActive?: boolean;
  }) => {
    const res = await api.get("/staff", { params });
    return res.data;
  },

  getOne: async (id: string) => {
    const res = await api.get(`/staff/${id}`);
    return res.data;
  },

  create: async (data: FormData | object) => {
    const isFormData = data instanceof FormData;
    const res = await api.post("/staff", data, isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined);
    return res.data;
  },

  update: async (id: string, data: FormData | object) => {
    const isFormData = data instanceof FormData;
    const res = await api.patch(`/staff/${id}`, data, isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined);
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

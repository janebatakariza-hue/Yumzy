import api from "./axios";

export const restaurantsAPI = {
  getAll: async (params?: {
    search?: string;
    category?: string;
    isActive?: boolean;
    isApproved?: boolean;
    isOpen?: boolean;
    page?: number;
    limit?: number;
  }) => {
    const res = await api.get("/restaurants", { params });
    return res.data;
  },

  getMy: async () => {
    const res = await api.get("/restaurants/my");
    return res.data;
  },

  getOne: async (id: string) => {
    const res = await api.get(`/restaurants/${id}`);
    return res.data;
  },

  create: async (data: FormData | object) => {
    const isFormData = data instanceof FormData;
    const res = await api.post("/restaurants", data, isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined);
    return res.data;
  },

  update: async (id: string, data: FormData | object) => {
    const isFormData = data instanceof FormData;
    const res = await api.patch(`/restaurants/${id}`, data, isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined);
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

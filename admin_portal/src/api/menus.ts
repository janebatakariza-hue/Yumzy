import api from "./axios";

export const menusAPI = {
  getAll: async (params?: Record<string, unknown>) => {
    const res = await api.get("/menu/items", { params });
    return res.data;
  },

  create: async (data: FormData) => {
    const res = await api.post("/menu/items", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  update: async (id: string, data: FormData | object) => {
    const isFormData = data instanceof FormData;
    const res = await api.patch(`/menu/items/${id}`, data, isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/menu/items/${id}`);
    return res.data;
  },

  toggleAvailability: async (id: string) => {
    const res = await api.patch(`/menu/items/${id}/toggle-availability`);
    return res.data;
  },

  toggleSpecial: async (id: string) => {
    const res = await api.patch(`/menu/items/${id}/toggle-special`);
    return res.data;
  },

  getCategories: async (params?: Record<string, unknown>) => {
    const res = await api.get("/menu/categories", { params });
    return res.data;
  },
};

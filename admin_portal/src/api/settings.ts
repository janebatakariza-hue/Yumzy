import api from "./axios";

export const settingsAPI = {
  get: async () => {
    const res = await api.get("/settings");
    return res.data;
  },

  update: async (data: object) => {
    const res = await api.patch("/settings", data);
    return res.data;
  },
};

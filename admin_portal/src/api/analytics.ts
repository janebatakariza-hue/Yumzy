import api from "./axios";

export const analyticsAPI = {
  getAnalytics: async () => {
    const res = await api.get("/analytics");
    return res.data;
  },
};

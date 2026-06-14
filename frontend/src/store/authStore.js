import { create } from "zustand";
import { api } from "../lib/api";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  checkAuth: async () => {
    try {
      const { data } = await api.get("/api/auth/check-auth");
      set({ user: data.payload, loading: false });
    } catch {
      localStorage.removeItem("fbp_token");
      set({ user: null, loading: false });
    }
  },
  login: async (credentials) => {
    const { data } = await api.post("/api/auth/login", credentials);
    localStorage.setItem("fbp_token", data.token);
    set({ user: data.payload });
    return data.payload;
  },
  register: async (payload) => {
    const { data } = await api.post("/api/auth/register", payload);
    return data.payload;
  },
  logout: async () => {
    await api.get("/api/auth/logout");
    localStorage.removeItem("fbp_token");
    set({ user: null });
  },
}));

import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fbp_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getMessage = (error) => error?.response?.data?.message || error?.response?.data?.error || "Something went wrong";

import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    // اگر headers از قبل undefined است، init می‌کنیم
    if (!config.headers) {
      config.headers = new axios.AxiosHeaders();
    }

    // اضافه کردن Authorization به شکل استاندارد
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

export default api;

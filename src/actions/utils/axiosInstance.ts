// axiosInstance.ts
import axios from "axios";
const BASE_URL = import.meta.env.VITE_SERVER_URL;

const instance = axios.create({
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  // Attach the token to the request header
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Determine the base URL based on the request
  const baseURL = config.url?.startsWith("/api/admin")
    ? `${BASE_URL}/api/admin`
    : `${BASE_URL}/api/user`;
  if (baseURL) {
    config.baseURL = baseURL;
  }
  console.log("config", config);
  return config;
});

instance.interceptors.response.use((response) => {
  console.log("Response Interceptor:", response);
  return response.data.result;
});

export default instance;

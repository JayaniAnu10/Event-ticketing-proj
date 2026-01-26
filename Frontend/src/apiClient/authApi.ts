import authStore from "@/store/authStore";
import axios from "axios";

const api = axios.create({
  baseURL: "http://backend:8080/auth",
  withCredentials: true,
});

// Separate axios for refresh request (prevents infinite loops)
const refreshApi = axios.create({
  baseURL: "http://backend:8080/auth",
  withCredentials: true,
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = authStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto refresh token
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refreshRes = await refreshApi.post("/refresh");
        const newToken = refreshRes.data.accessToken;
        console.log(newToken);

        authStore.getState().setAccessToken(newToken);
        original.headers.Authorization = `Bearer ${newToken}`;

        return api(original); // retry original request
      } catch (e) {
        authStore.getState().logout();
        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  },
);

// API functions
export const loginUser = (data: { username: string; password: string }) =>
  api.post("/login", data).then((res) => res.data);

export const refreshToken = () =>
  refreshApi.post("/refresh").then((res) => res.data);

export const getMe = () => api.get("/me").then((res) => res.data);

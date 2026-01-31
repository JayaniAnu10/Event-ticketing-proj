import axios from "axios";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

// --- Base configuration ---
const baseConfig = {
  baseURL: "/api",
  withCredentials: true,
};

// --- Public Axios instance (no auth, no interceptors, no credentials) ---
export const publicAxios = axios.create({
  baseURL: "/api",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Authenticated Axios instance (with auth & refresh) ---
export const axiosInstance = axios.create(baseConfig);

// --- Refresh client (separate, no interceptors) ---
const refreshClient = axios.create({
  ...baseConfig,
  timeout: 5000,
});

// --- Request Interceptor (authenticated instance only) ---
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response Interceptor (authenticated instance only) ---
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        refreshClient
          .post("/auth/refresh")
          .then((res) => {
            const newAccess = res.data.token;
            localStorage.setItem("accessToken", newAccess);

            // Update original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;

            processQueue(null, newAccess);
            resolve(axiosInstance(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            localStorage.removeItem("accessToken");
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  },
);

// --- Generic API client class ---
class APIClient<T> {
  endpoint: string;
  private client: typeof axiosInstance | typeof publicAxios;

  constructor(endpoint: string, isPublic: boolean = false) {
    this.endpoint = endpoint;
    this.client = isPublic ? publicAxios : axiosInstance;
  }

  get = () => this.client.get<T>(this.endpoint).then((res) => res.data);

  getAll = (params?: Record<string, any>) =>
    this.client.get<T>(this.endpoint, { params }).then((res) => res.data);

  post = (data: T) =>
    this.client.post<T>(this.endpoint, data).then((res) => res.data);

  patch = (id: string, params?: Record<string, any>) =>
    this.client
      .patch(`${this.endpoint}/${id}`, null, { params })
      .then((res) => res.data);

  delete = () => this.client.delete(this.endpoint).then((res) => res.data);

  postForm = (formData: FormData) =>
    this.client
      .post(this.endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
}

export default APIClient;

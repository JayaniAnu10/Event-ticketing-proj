import axios from "axios";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Separate axios instance for refresh calls to avoid interceptor loops
const refreshClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 2000,
});

// 1. Request Interceptor: Attach Access Token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Response Interceptor: Handle Token Refresh
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // We return the refresh attempt promise
      return new Promise((resolve, reject) => {
        refreshClient
          .post("/auth/refresh")
          .then((res) => {
            const newAccess = res.data.token;
            localStorage.setItem("accessToken", newAccess);

            // Update current request header
            originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;

            processQueue(null, newAccess);
            resolve(axiosInstance(originalRequest));
          })
          .catch((err) => {
            // If /auth/refresh fails (401), the Refresh Token is dead
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

class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  get = () => {
    return axiosInstance.get<T>(this.endpoint).then((res) => res.data);
  };

  delete = () => {
    return axiosInstance.delete(this.endpoint).then((res) => res.data);
  };

  patch = (id: string, params?: Record<string, any>) => {
    return axiosInstance
      .patch(`${this.endpoint}/${id}`, null, { params })
      .then((res) => res.data);
  };

  getAll = (params?: Record<string, any>) => {
    return axiosInstance
      .get<T>(this.endpoint, { params })
      .then((res) => res.data);
  };

  post = (data: T) => {
    return axiosInstance.post<T>(this.endpoint, data).then((res) => res.data);
  };

  postForm = (formData: FormData) => {
    return axiosInstance
      .post(this.endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data);
  };
}

export default APIClient;

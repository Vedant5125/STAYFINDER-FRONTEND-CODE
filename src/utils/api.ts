import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            console.log("Request Interceptor: Adding Authorization header.");
            config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
            console.log("Request Interceptor: No token found. Skipping header.");
        }
        return config;
    },
    (error) => {
        console.error("Request Interceptor Error:", error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/users/refresh-token`,
            { refreshToken },
            { withCredentials: true }
          );

          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Show error toast for API errors
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Something went wrong');
    }

    return Promise.reject(error);
  }
);

export default api;
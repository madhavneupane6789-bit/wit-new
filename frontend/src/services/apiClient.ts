import axios from 'axios';

const envBase = import.meta.env.VITE_API_BASE_URL?.trim();

// Always point to the deployed backend unless an explicit env override is provided (for local dev).
const baseURL = envBase || 'https://witback.onrender.com';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.error?.message || error.message || 'Request failed';
    return Promise.reject(new Error(message));
  },
);

export default api;

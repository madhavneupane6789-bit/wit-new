import axios from 'axios';

const isProd = import.meta.env.PROD;
const envBase = import.meta.env.VITE_API_BASE_URL?.trim();

// In production, always point to the deployed backend to avoid localhost/cached misconfigurations.
const baseURL = isProd ? 'https://wit-new-1.onrender.com' : envBase || 'http://localhost:4000';

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

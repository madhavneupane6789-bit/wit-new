import axios from 'axios';

const isProd = import.meta.env.PROD;
const envBase = import.meta.env.VITE_API_BASE_URL?.trim();
const defaultProd = 'https://wit-new-1.onrender.com';

// In prod, never use localhost even if misconfigured.
const baseURL = isProd
  ? envBase && !envBase.includes('localhost') ? envBase : defaultProd
  : envBase || 'http://localhost:4000';

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

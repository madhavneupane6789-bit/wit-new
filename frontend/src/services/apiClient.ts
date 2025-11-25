import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? 'https://wit-new-1.onrender.com' : 'http://localhost:4000');

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

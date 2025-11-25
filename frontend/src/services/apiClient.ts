import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
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

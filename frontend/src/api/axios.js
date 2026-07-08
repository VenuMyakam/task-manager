import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// This "interceptor" runs before every request made with `api`.
// It reads the token from localStorage and attaches it automatically,
// so components never have to remember to do this themselves.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
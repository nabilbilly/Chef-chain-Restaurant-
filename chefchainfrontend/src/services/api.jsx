import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Django backend base URL
  withCredentials: true, // if using cookies for auth
  headers: { 'Content-Type': 'application/json' }, // set default headers
});

// Attach access token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('accessToken');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});
export default API;


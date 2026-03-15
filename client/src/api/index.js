import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('resume_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');
export const upgradeToPremium = () => api.put('/auth/upgrade');

// Resume endpoints
export const getResumes = () => api.get('/resumes');
export const getResumeById = (id) => api.get(`/resumes/${id}`);
export const createResume = (data) => api.post('/resumes', data);
export const updateResume = (id, data) => api.put(`/resumes/${id}`, data);
export const deleteResume = (id) => api.delete(`/resumes/${id}`);

export default api;

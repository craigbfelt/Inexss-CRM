import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance for the CRM API
const apiClient = axios.create({
  baseURL: API_URL
});

export const api = {
  // Auth
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getProfile: () => apiClient.get('/auth/profile'),
  changePassword: (data) => apiClient.put('/auth/change-password', data),

  // Brands
  getBrands: (params) => apiClient.get('/brands', { params }),
  getBrand: (id) => apiClient.get(`/brands/${id}`),
  createBrand: (data) => apiClient.post('/brands', data),
  updateBrand: (id, data) => apiClient.put(`/brands/${id}`, data),
  deleteBrand: (id) => apiClient.delete(`/brands/${id}`),

  // Clients
  getClients: (params) => apiClient.get('/clients', { params }),
  getClient: (id) => apiClient.get(`/clients/${id}`),
  createClient: (data) => apiClient.post('/clients', data),
  updateClient: (id, data) => apiClient.put(`/clients/${id}`, data),
  deleteClient: (id) => apiClient.delete(`/clients/${id}`),

  // Meetings
  getMeetings: (params) => apiClient.get('/meetings', { params }),
  getMeeting: (id) => apiClient.get(`/meetings/${id}`),
  createMeeting: (data) => apiClient.post('/meetings', data),
  updateMeeting: (id, data) => apiClient.put(`/meetings/${id}`, data),
  deleteMeeting: (id) => apiClient.delete(`/meetings/${id}`),
  getMonthlyReport: (params) => apiClient.get('/meetings/report/monthly', { params }),

  // Projects
  getProjects: (params) => apiClient.get('/projects', { params }),
  getProject: (id) => apiClient.get(`/projects/${id}`),
  createProject: (data) => apiClient.post('/projects', data),
  updateProject: (id, data) => apiClient.put(`/projects/${id}`, data),
  deleteProject: (id) => apiClient.delete(`/projects/${id}`),
};

export default apiClient;

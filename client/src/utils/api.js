import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

axios.defaults.baseURL = API_URL;

export const api = {
  // Auth
  login: (credentials) => axios.post('/auth/login', credentials),
  register: (userData) => axios.post('/auth/register', userData),
  getProfile: () => axios.get('/auth/profile'),

  // Brands
  getBrands: (params) => axios.get('/brands', { params }),
  getBrand: (id) => axios.get(`/brands/${id}`),
  createBrand: (data) => axios.post('/brands', data),
  updateBrand: (id, data) => axios.put(`/brands/${id}`, data),
  deleteBrand: (id) => axios.delete(`/brands/${id}`),

  // Clients
  getClients: (params) => axios.get('/clients', { params }),
  getClient: (id) => axios.get(`/clients/${id}`),
  createClient: (data) => axios.post('/clients', data),
  updateClient: (id, data) => axios.put(`/clients/${id}`, data),
  deleteClient: (id) => axios.delete(`/clients/${id}`),

  // Meetings
  getMeetings: (params) => axios.get('/meetings', { params }),
  getMeeting: (id) => axios.get(`/meetings/${id}`),
  createMeeting: (data) => axios.post('/meetings', data),
  updateMeeting: (id, data) => axios.put(`/meetings/${id}`, data),
  deleteMeeting: (id) => axios.delete(`/meetings/${id}`),
  getMonthlyReport: (params) => axios.get('/meetings/report/monthly', { params }),

  // Projects
  getProjects: (params) => axios.get('/projects', { params }),
  getProject: (id) => axios.get(`/projects/${id}`),
  createProject: (data) => axios.post('/projects', data),
  updateProject: (id, data) => axios.put(`/projects/${id}`, data),
  deleteProject: (id) => axios.delete(`/projects/${id}`),
};

export default api;

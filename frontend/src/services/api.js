import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Developers API
export const developersAPI = {
  getAll: () => api.get('/developers'),
  getById: (id) => api.get(`/developers/${id}`),
  create: (data) => api.post('/developers', data),
  update: (id, data) => api.put(`/developers/${id}`, data),
  delete: (id) => api.delete(`/developers/${id}`),
  getStats: (id) => api.get(`/developers/${id}/stats`),
  getTasks: (id) => api.get(`/developers/${id}/tasks`),
};

// Tasks API
export const tasksAPI = {
  getAll: (params) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  updateStatus: (id, status, performed_by) => 
    api.patch(`/tasks/${id}/status`, { status, performed_by }),
  assign: (id, assigned_to, performed_by) => 
    api.patch(`/tasks/${id}/assign`, { assigned_to, performed_by }),
  getHistory: (id) => api.get(`/tasks/${id}/history`),
};

// Analytics API
export const analyticsAPI = {
  getTeamMetrics: () => api.get('/analytics/team'),
  getVelocity: () => api.get('/analytics/velocity'),
  getBottlenecks: () => api.get('/analytics/bottlenecks'),
  getLeaderboard: () => api.get('/analytics/leaderboard'),
  getDistribution: () => api.get('/analytics/distribution'),
};

export default api;
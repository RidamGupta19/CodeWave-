import api from './axios';

const submissionApi = {
  getAll: (params = {}) => api.get('/submissions', { params }),
  getMine: (params = {}) => api.get('/submissions/my', { params }),
  getByProblem: (problemId, params = {}) =>
    api.get(`/submissions/problem/${problemId}`, { params }),
  getByUser: (userId, params = {}) => api.get(`/submissions/user/${userId}`, { params }),
  create: (payload) => api.post('/submissions', payload)
};

export default submissionApi;

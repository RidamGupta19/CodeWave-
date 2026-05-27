import api from './axios';

const problemApi = {
  getAll: (params = {}) => api.get('/problems', { params }),
  getBySlug: (slug) => api.get(`/problems/${slug}`),
  getByDomain: (domainId, params = {}) => api.get(`/problems/domain/${domainId}`, { params }),
  getByTopic: (topicName, params = {}) =>
    api.get(`/problems/topic/${encodeURIComponent(topicName)}`, { params }),
  create: (payload) => api.post('/problems', payload),
  update: (id, payload) => api.put(`/problems/${id}`, payload),
  remove: (id) => api.delete(`/problems/${id}`)
};

export default problemApi;

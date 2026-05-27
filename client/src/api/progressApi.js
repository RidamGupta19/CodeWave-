import api from './axios';

const progressApi = {
  getMine: () => api.get('/progress/my'),
  getDomain: (domainId) => api.get(`/progress/domain/${domainId}`),
  updateAfterSubmission: (payload) => api.post('/progress/update-after-submission', payload)
};

export default progressApi;

import api from './axios';

const codeApi = {
  run: (payload) => api.post('/code/run', payload),
  submit: (payload) => api.post('/code/submit', payload)
};

export default codeApi;

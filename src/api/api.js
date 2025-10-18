

import axios from 'axios'
const local = 'http://localhost:5000'
const production = 'https://mmfashion-live-server.onrender.com'

let api_url = ''
let mode = 'pro'
if (mode === 'pro') {
    api_url = production
} else {
    api_url = local
}

const api = axios.create({
    baseURL: `${api_url}/api`,
    withCredentials: true
})




// Authorization interceptor (unchanged)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && !config.headers?.Authorization) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
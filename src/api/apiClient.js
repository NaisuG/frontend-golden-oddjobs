import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

// Attaches the Cognito access_token to every outgoing request.
// This only identifies the user: the servers decide who may do what.
export function attachAuthInterceptor(auth) {
  apiClient.interceptors.request.use((config) => {
    const token = auth.user?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

export default apiClient;

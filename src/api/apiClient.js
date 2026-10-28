import axios from 'axios';
import { User } from 'oidc-client-ts';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

// react-oidc-context stores the session in sessionStorage under this key.
const SESSION_KEY = `oidc.user:${import.meta.env.VITE_COGNITO_AUTHORITY}:${import.meta.env.VITE_COGNITO_CLIENT_ID}`;

// Read the token at request time, so it is never missing after a page reload.
function currentAccessToken() {
  const stored = sessionStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  const user = User.fromStorageString(stored);
  return user.expired ? null : user.access_token;
}

apiClient.interceptors.request.use((config) => {
  const token = currentAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
import axios from 'axios';
import { env } from '@/config/env';

// ─── Axios Instance ──────────────────────────────────────────────────────────
// Configures base URL, timeout, and defaults.
// Credentials = true is required for HTTP-only refresh token cookies.
export const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // If we have an access token in state/memory, we can attach it here.
    // Since we're ready for JWT, we configure the placeholder:
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Automatically intercepts 401s to perform silent token refreshing,
// keeping user sessions uninterrupted.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Guard against infinite loop if refresh route itself fails with 401.
    // Also skip auth endpoints — a 401 on login/register/google means bad credentials,
    // not an expired token. Let the component surface the real error.
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register') &&
      !originalRequest.url?.includes('/auth/google')
    ) {
      originalRequest._retry = true;

      try {
        // Request token refresh (uses HTTP-only cookies on backend)
        const response = await axios.post<{ data: { accessToken: string } }>(
          `${env.VITE_API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.data.accessToken;
        localStorage.setItem('access_token', newAccessToken);

        // Retry the original failed request with the new access token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is expired/invalid -> clear tokens and redirect to login
        localStorage.removeItem('access_token');
        // Let component layer or router handle auth redirection
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

// Get API base URL from environment variable
// Defaults to empty string for relative URLs (same origin)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Check if MSW (Mock Service Worker) should be enabled
// Defaults to true for development if not explicitly set
export const ENABLE_MSW = import.meta.env.VITE_ENABLE_MSW === 'true';

// API timeout in milliseconds
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);

// Auth token storage key
export const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'ehr_auth_token';

/**
 * Build full API URL
 * @param endpoint - API endpoint path (e.g., '/patients', '/auth/login')
 * @returns Full API URL
 */
export function buildApiUrl(endpoint: string): string {
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // If API_BASE_URL is empty, return just the endpoint (for relative URLs)
  if (!API_BASE_URL) {
    return normalizedEndpoint;
  }
  
  // Remove trailing slash from base URL if present
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  
  return `${baseUrl}${normalizedEndpoint}`;
}

/**
 * Get authentication headers
 * @returns Headers object with Authorization if token exists
 */
export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * API client configuration
 */
export const apiConfig = {
  baseURL: API_BASE_URL,
  enableMSW: ENABLE_MSW,
  timeout: API_TIMEOUT,
  authTokenKey: AUTH_TOKEN_KEY,
  buildUrl: buildApiUrl,
  getAuthHeaders,
};

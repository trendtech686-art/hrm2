/**
 * API Configuration Utilities
 * 
 * Centralized configuration for API endpoints.
 * All API URLs should use these utilities instead of hardcoding.
 */

/**
 * Get the API base URL from environment variables
 * Falls back to localhost:3001 for development
 */
export function getApiBaseUrl(): string {
  return (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001/api';
}

/**
 * Get the base URL without /api suffix
 * Falls back to localhost:3001 for development
 */
export function getBaseUrl(): string {
  const apiUrl = getApiBaseUrl();
  return apiUrl.replace('/api', '');
}

/**
 * Build a full file URL from a relative path
 * @param relativePath - Relative file path (e.g., "/uploads/documents/file.pdf")
 * @returns Full URL to the file
 */
export function getFileUrl(relativePath: string): string {
  if (!relativePath) return '';
  
  // If already a full URL, return as is
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  
  // Build full URL
  const baseUrl = getBaseUrl();
  return `${baseUrl}${relativePath}`;
}

/**
 * Build an API endpoint URL
 * @param endpoint - API endpoint path (e.g., "/employees/documents")
 * @returns Full API URL
 */
export function getApiUrl(endpoint: string): string {
  const apiBaseUrl = getApiBaseUrl();
  return `${apiBaseUrl}${endpoint}`;
}

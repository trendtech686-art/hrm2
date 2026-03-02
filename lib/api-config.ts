/**
 * API Configuration Utilities
 * 
 * Centralized configuration for API endpoints.
 * All API URLs should use these utilities instead of hardcoding.
 */

/**
 * Get the API base URL from environment variables
 * Falls back to /api for Next.js relative paths
 */
export function getApiBaseUrl(): string {
  // For Next.js, use relative path /api which works both client and server side
  // This handles API routes at /api/* automatically
  return '/api';
}

/**
 * Get the base URL without /api suffix
 * For client-side: uses window.location.origin
 * For server-side: falls back to localhost:3000
 */
export function getBaseUrl(): string {
  // Client-side: use window.location.origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Server-side: use environment variable or default
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
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

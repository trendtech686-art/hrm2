/**
 * Application Configuration
 * Centralized configuration for the entire application
 */

// Base URL Configuration
// Change this when deploying to a different domain
export const APP_CONFIG = {
  // Base URL - used for absolute URLs in emails, webhooks, etc.
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  
  // API Configuration (if using external API)
  API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  
  // App Information
  APP_NAME: 'HRM - Quản lý nhân sự',
  APP_SHORT_NAME: 'HRM',
  APP_VERSION: '1.0.0',
  
  // Features flags
  FEATURES: {
    ENABLE_NOTIFICATIONS: true,
    ENABLE_DARK_MODE: true,
    ENABLE_MULTI_BRANCH: true,
  },
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // File upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

/**
 * Get full URL for a given path
 * @param path - Relative path (e.g., '/products/123')
 * @returns Full URL (e.g., 'http://localhost:5173/products/123')
 */
export function getFullUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Remove trailing slash from base URL if present
  const baseUrl = APP_CONFIG.BASE_URL.endsWith('/') 
    ? APP_CONFIG.BASE_URL.slice(0, -1) 
    : APP_CONFIG.BASE_URL;
  
  return `${baseUrl}/${cleanPath}`;
}

/**
 * Get absolute URL for a route
 * Useful for sharing links, emails, etc.
 */
export function getAbsoluteUrl(route: string): string {
  return getFullUrl(route);
}

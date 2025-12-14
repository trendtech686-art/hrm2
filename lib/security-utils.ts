/**
 * Security utilities for handling sensitive data
 * 
 * ⚠️ IMPORTANT: These are CLIENT-SIDE utilities for basic protection.
 * Real password hashing MUST be done on the server with bcrypt/argon2.
 * These functions are for:
 * 1. Preventing plain-text storage in localStorage during development
 * 2. Adding a layer of obfuscation until backend is implemented
 */

/**
 * Simple hash for client-side obfuscation (NOT cryptographically secure)
 * Should be replaced with server-side bcrypt when backend is ready
 */
export async function hashPassword(password: string): Promise<string> {
  // Use SubtleCrypto for SHA-256 hash
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Prefix to indicate this is a hashed password
  return `sha256:${hashHex}`;
}

/**
 * Check if a string is already hashed
 */
export function isPasswordHashed(value: string): boolean {
  return value.startsWith('sha256:') || value.startsWith('$2b$'); // SHA-256 or bcrypt
}

/**
 * Verify password against stored hash (client-side only)
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!isPasswordHashed(storedHash)) {
    // Legacy plain text - compare directly (for migration)
    return password === storedHash;
  }
  
  if (storedHash.startsWith('sha256:')) {
    const hashedInput = await hashPassword(password);
    return hashedInput === storedHash;
  }
  
  // bcrypt would need to be verified server-side
  return false;
}

/**
 * Sanitize input to prevent XSS
 * Removes or escapes potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .trim();
}

/**
 * Sanitize object fields recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeInput(value);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = sanitizeObject(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      result[key] = value.map(item => 
        typeof item === 'string' 
          ? sanitizeInput(item)
          : typeof item === 'object' && item !== null
            ? sanitizeObject(item as Record<string, unknown>)
            : item
      );
    } else {
      result[key] = value;
    }
  }
  
  return result as T;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Mật khẩu phải có ít nhất 6 ký tự');
  }
  
  if (password.length > 128) {
    errors.push('Mật khẩu không được quá 128 ký tự');
  }
  
  // Optional: Add more strength checks
  // if (!/[A-Z]/.test(password)) {
  //   errors.push('Mật khẩu cần có ít nhất 1 chữ in hoa');
  // }
  // if (!/[0-9]/.test(password)) {
  //   errors.push('Mật khẩu cần có ít nhất 1 số');
  // }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Rate limiting helper (for future use with API calls)
 * Stores attempt counts in memory
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 60000): {
  allowed: boolean;
  remainingAttempts: number;
  resetTime: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    // First attempt or window expired
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remainingAttempts: maxAttempts - 1, resetTime: now + windowMs };
  }
  
  if (entry.count >= maxAttempts) {
    return { allowed: false, remainingAttempts: 0, resetTime: entry.resetTime };
  }
  
  entry.count++;
  return { allowed: true, remainingAttempts: maxAttempts - entry.count, resetTime: entry.resetTime };
}

export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

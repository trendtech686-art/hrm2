/**
 * Safe logger to prevent "Converting circular structure to JSON" errors
 */

/**
 * Safely log an object, handling circular references
 */
export function safeLog(_label: string, _obj: unknown) {
  try {
    // console.log(label, safeStringify(obj));
  } catch (_error) {
    if (_obj && typeof _obj === 'object') {
      // console.log(label, '[Object - could not stringify]');
    }
  }
}

/**
 * Safely stringify an object, handling circular references
 */
export function safeStringify(obj: unknown, space?: number): string {
  const seen = new WeakSet();
  
  return JSON.stringify(obj, (key, value) => {
    // Handle undefined
    if (value === undefined) return '[undefined]';
    
    // Handle functions
    if (typeof value === 'function') return '[function]';
    
    // Handle circular references
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    
    return value;
  }, space);
}

/**
 * Safely log an object as JSON string
 */
export function safeLogJSON(_label: string, _obj: unknown, _space?: number) {
  try {
    // console.log(label, safeStringify(obj, space));
  } catch (_error) {
    // Silently fail
  }
}

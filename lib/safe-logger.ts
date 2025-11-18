/**
 * Safe logger to prevent "Converting circular structure to JSON" errors
 */

/**
 * Safely log an object, handling circular references
 */
export function safeLog(label: string, obj: any) {
  try {
    console.log(label, obj);
  } catch (error) {
    console.log(label, '[Cannot log - circular reference detected]');
    console.log(label + ' (type):', typeof obj);
    if (obj && typeof obj === 'object') {
      console.log(label + ' (keys):', Object.keys(obj));
    }
  }
}

/**
 * Safely stringify an object, handling circular references
 */
export function safeStringify(obj: any, space?: number): string {
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
export function safeLogJSON(label: string, obj: any, space?: number) {
  try {
    console.log(label, safeStringify(obj, space));
  } catch (error) {
    console.log(label, '[Cannot stringify object]');
  }
}

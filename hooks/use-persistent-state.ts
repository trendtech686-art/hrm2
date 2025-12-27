/**
 * @deprecated DEPRECATED - localStorage đã bị xóa khỏi codebase
 * 
 * Hook này không còn được sử dụng. Dùng useState hoặc lưu vào database qua API.
 * 
 * Migration:
 * - Nếu data quan trọng cần persist: dùng /api/user-preferences hoặc /api/settings
 * - Nếu data không quan trọng: dùng useState
 */
import * as React from 'react';

export function usePersistentState<T>(key: string, defaultValue: T) {
  // Không còn persist sang localStorage - chỉ dùng in-memory state
  const [state, setState] = React.useState<T>(defaultValue);
  
  return [state, setState] as const;
}

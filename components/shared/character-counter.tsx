import * as React from 'react';
import { cn } from '@/lib/utils';

interface CharacterCounterProps {
  value: string;
  min?: number;
  max?: number;
  recommended?: { min: number; max: number };
  className?: string;
}

export function CharacterCounter({ 
  value, 
  min, 
  max, 
  recommended,
  className 
}: CharacterCounterProps) {
  const length = value?.length || 0;
  
  const getColor = () => {
    if (recommended) {
      if (length >= recommended.min && length <= recommended.max) {
        return 'text-green-600';
      }
      if (length > 0 && length < recommended.min) {
        return 'text-yellow-600';
      }
      if (length > recommended.max) {
        return 'text-red-600';
      }
    }
    if (max && length > max) {
      return 'text-red-600';
    }
    if (min && length < min) {
      return 'text-yellow-600';
    }
    return 'text-muted-foreground';
  };

  const getText = () => {
    if (recommended) {
      return `${length}/${recommended.min}-${recommended.max}`;
    }
    if (max) {
      return `${length}/${max}`;
    }
    return `${length} ký tự`;
  };

  return (
    <span className={cn('text-xs', getColor(), className)}>
      {getText()}
    </span>
  );
}

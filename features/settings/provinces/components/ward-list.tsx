'use client'

import * as React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Button } from '@/components/ui/button';
import type { Ward } from '@/lib/types/prisma-extended';

interface WardListProps {
  wards: Ward[];
  onEdit: (w: Ward) => void;
  onDelete: (id: string) => void;
}

export function WardList({ wards, onEdit, onDelete }: WardListProps) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: wards.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-full w-full overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const ward = wards[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className="flex items-center justify-between border-b px-4 hover:bg-muted/50 group"
            >
              <div className="flex flex-col justify-center h-full">
                <span className="font-medium text-sm">{ward.name}</span>
                <span className="text-xs text-muted-foreground font-mono">{ward.id}</span>
              </div>
              <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(ward)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => onDelete(ward.systemId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

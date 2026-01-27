'use client'

import * as React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { District } from '@/lib/types/prisma-extended';

interface DistrictItemProps {
  district: District;
  isActive: boolean;
  onSelect: (id: number) => void;
  onEdit: (d: District) => void;
  onDelete: (id: string) => void;
}

export const DistrictItem = React.memo(function DistrictItem({
  district,
  isActive,
  onSelect,
  onEdit,
  onDelete,
}: DistrictItemProps) {
  return (
    <div
      onClick={() => onSelect(district.id)}
      className={cn(
        'group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-2 transition-colors hover:bg-muted/50',
        isActive ? 'bg-primary/5 border-primary/20' : 'hover:border/50'
      )}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        {district.name.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-sm font-medium leading-none">{district.name}</span>
        <span className="text-xs text-muted-foreground">Mã: {district.id}</span>
      </div>
      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(district);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(district.systemId);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

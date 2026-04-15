'use client';

import dynamic from 'next/dynamic';
import { Settings2 } from "lucide-react";
import { Button } from "../ui/button";
import type { ColumnDef } from './types';
import type { ComponentType } from 'react';

// Loading button that matches the original trigger
function ColumnCustomizerLoading() {
  return (
    <Button variant="outline" size="sm" className="h-8 gap-2" disabled>
      <Settings2 className="h-4 w-4 animate-pulse" />
      <span className="hidden sm:inline">Tùy chỉnh</span>
    </Button>
  );
}

// Props type - matching the original component
interface DataTableColumnCustomizerProps<TData> {
  children?: React.ReactNode;
  columns: ColumnDef<TData>[];
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>> | ((value: Record<string, boolean>) => void);
  columnOrder: string[];
  setColumnOrder: React.Dispatch<React.SetStateAction<string[]>> | ((value: string[]) => void);
  pinnedColumns: string[];
  setPinnedColumns: React.Dispatch<React.SetStateAction<string[]>> | ((value: string[]) => void);
  onResetToDefault?: () => void;
}

// Dynamic import with SSR disabled - @dnd-kit is heavy (~50KB)
// Using 'any' here is intentional due to dynamic import type inference limitations
const DataTableColumnCustomizerImpl = dynamic(
  () => import('./data-table-column-toggle').then(mod => mod.DataTableColumnCustomizer) as Promise<ComponentType<DataTableColumnCustomizerProps<unknown>>>,
  { 
    ssr: false, 
    loading: () => <ColumnCustomizerLoading />
  }
);

// Re-export with same interface for drop-in replacement
export function DynamicDataTableColumnCustomizer<TData>(
  props: DataTableColumnCustomizerProps<TData>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <DataTableColumnCustomizerImpl {...props as DataTableColumnCustomizerProps<any>} />;
}

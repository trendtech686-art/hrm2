import * as React from 'react';
import { DataTableHeaderActions } from '../data-table/data-table-header-actions';
import type { DataTableToolbarProps } from '../data-table/data-table-toolbar';
import type { ColumnDef } from '../data-table/types';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';

interface StandardPageLayoutProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  toolbar: React.ReactNode;
  addButtonLabel: string;
  onAddButtonClick: () => void;
  exportConfig: {
    fileName: string;
    columns: ColumnDef<TData>[];
  };
  importConfig?: {
    importer: (data: Omit<TData, 'id'>[]) => void;
    fileName: string;
    existingData?: TData[];
    getUniqueKey?: (item: any) => string;
  };
  columnCustomizerProps: {
    columns: ColumnDef<TData>[];
    columnVisibility: Record<string, boolean>;
    setColumnVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    columnOrder: string[];
    setColumnOrder: React.Dispatch<React.SetStateAction<string[]>>;
    pinnedColumns: string[];
    setPinnedColumns: React.Dispatch<React.SetStateAction<string[]>>;
  };
  allData: TData[];
  filteredData: TData[];
  pageData: TData[];
  children: React.ReactNode;
}

export function StandardPageLayout<TData>({
  title,
  description,
  toolbar,
  addButtonLabel,
  onAddButtonClick,
  exportConfig,
  importConfig,
  columnCustomizerProps,
  allData,
  filteredData,
  pageData,
  children,
  className,
  ...props
}: StandardPageLayoutProps<TData>) {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      
      <div className="flex items-center justify-between">
        <DataTableHeaderActions
          exportConfig={exportConfig}
          importConfig={importConfig}
          columnCustomizerProps={columnCustomizerProps}
          allData={allData}
          filteredData={filteredData}
          pageData={pageData}
        />
        <Button onClick={onAddButtonClick} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          {addButtonLabel}
        </Button>
      </div>
      
      {toolbar}
      
      {children}
    </div>
  );
}

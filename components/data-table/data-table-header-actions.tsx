import * as React from "react";
import { DataTableActions } from "../../components/data-table/data-table-actions.tsx";
import type { DataTableToolbarProps } from "../../components/data-table/data-table-toolbar.tsx";
import type { ColumnDef } from "../../components/data-table/types.ts";

interface DataTableHeaderActionsProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
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
}

export function DataTableHeaderActions<TData>({
  exportConfig,
  importConfig,
  columnCustomizerProps,
  allData,
  filteredData,
  pageData,
  className,
  ...props
}: DataTableHeaderActionsProps<TData>) {
  return (
    <div className={className} {...props}>
      <DataTableActions
        exportConfig={exportConfig}
        importConfig={importConfig}
        columnCustomizerProps={columnCustomizerProps}
        allData={allData}
        filteredData={filteredData}
        pageData={pageData}
      />
    </div>
  );
}

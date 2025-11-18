import * as React from "react";
import { Download, Upload, Settings2 } from "lucide-react";
import { Button } from "../ui/button.tsx";
import { DataTableExportDialog } from "./data-table-export-dialog.tsx";
import { DataTableImportDialog } from "./data-table-import-dialog.tsx";
import { DataTableColumnCustomizer } from "./data-table-column-toggle.tsx";
import type { ColumnDef } from './types.ts';

interface DataTableActionsProps<TData> {
  exportConfig?: {
    fileName: string;
    columns: ColumnDef<TData>[];
  };
  importConfig?: {
    importer: (data: Omit<TData, 'id'>[]) => void;
    fileName: string;
    existingData?: TData[];
    getUniqueKey?: (item: any) => string;
  };
  columnCustomizerProps?: {
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

export function DataTableActions<TData>({
  exportConfig,
  importConfig,
  columnCustomizerProps,
  allData,
  filteredData,
  pageData
}: DataTableActionsProps<TData>) {
  return (
    <div className="flex items-center space-x-2">
      {importConfig && (
        <DataTableImportDialog config={importConfig}>
          <Button variant="outline" size="sm" className="ml-auto gap-1">
            <Upload className="h-3.5 w-3.5" />
            <span>Nhập file</span>
          </Button>
        </DataTableImportDialog>
      )}
      
      {exportConfig && (
        <DataTableExportDialog
          allData={allData}
          filteredData={filteredData}
          pageData={pageData}
          config={exportConfig}
        >
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-3.5 w-3.5" />
            <span>Xuất file</span>
          </Button>
        </DataTableExportDialog>
      )}
      
      {columnCustomizerProps && (
        <DataTableColumnCustomizer {...columnCustomizerProps}>
          <Button variant="outline" size="sm" className="gap-1">
            <Settings2 className="h-3.5 w-3.5" />
            <span>Điều chỉnh cột</span>
          </Button>
        </DataTableColumnCustomizer>
      )}
    </div>
  );
}

import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    displayName?: string;
    sticky?: 'left' | 'right';
    group?: string;
    excludeFromExport?: boolean;
  }
  
  interface HeaderContext<TData extends RowData, TValue> {
    isAllPageRowsSelected?: boolean;
    isSomePageRowsSelected?: boolean;
    onToggleAll?: (value: boolean) => void;
    sorting?: { id: string; desc: boolean };
    setSorting?: (updater: React.SetStateAction<{ id: string; desc: boolean }>) => void;
  }
  
  interface CellContext<TData extends RowData, TValue> {
    row: TData;
    isSelected?: boolean;
    isExpanded?: boolean;
    onToggleSelect?: (value: boolean) => void;
    onToggleExpand?: () => void;
  }
}

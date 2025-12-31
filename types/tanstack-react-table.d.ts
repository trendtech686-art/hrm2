import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<_TData extends RowData, _TValue> {
    displayName?: string;
    sticky?: 'left' | 'right';
    group?: string;
    excludeFromExport?: boolean;
  }
  
  interface HeaderContext<_TData extends RowData, _TValue> {
    isAllPageRowsSelected?: boolean;
    isSomePageRowsSelected?: boolean;
    onToggleAll?: (value: boolean) => void;
    sorting?: { id: string; desc: boolean };
    setSorting?: (updater: React.SetStateAction<{ id: string; desc: boolean }>) => void;
  }
  
  interface CellContext<TData extends RowData, _TValue> {
    row: TData;
    isSelected?: boolean;
    isExpanded?: boolean;
    onToggleSelect?: (value: boolean) => void;
    onToggleExpand?: () => void;
  }
}

import * as React from 'react';

export type ColumnDef<TData> = {
  id: string;
  accessorKey?: keyof TData;
  header: React.ReactNode | ((props: {
    isAllPageRowsSelected?: boolean;
    isSomePageRowsSelected?: boolean;
    onToggleAll?: (value: boolean) => void;
    sorting?: { id: string; desc: boolean };
    setSorting?: (updater: React.SetStateAction<{ id: string; desc: boolean }>) => void;
  }) => React.ReactNode);
  cell: (props: {
    row: TData;
    isSelected: boolean;
    isExpanded: boolean;
    onToggleSelect: (value: boolean) => void;
    onToggleExpand: () => void;
  }) => React.ReactNode;
  enableSorting?: boolean;
  meta?: {
    displayName: string;
    // FIX: Added optional `sticky` property to allow columns to be fixed to the left or right.
    sticky?: 'left' | 'right';
    // FIX: Added optional `group` property to allow grouping columns in the customizer.
    group?: string;
  };
  size?: number;
};

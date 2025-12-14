import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import type { ColumnDef } from "../data-table/types";
import { cn } from "../../lib/utils";

interface SimpleSettingsTableProps<TData extends { systemId: string }> {
  data: TData[];
  columns: ColumnDef<TData>[];
  emptyTitle: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  className?: string;
}

export function SimpleSettingsTable<TData extends { systemId: string }>(
  props: SimpleSettingsTableProps<TData>
) {
  const { data, columns, emptyTitle, emptyDescription, emptyAction, className } = props;

  const renderedColumns = React.useMemo(() => columns.filter(Boolean), [columns]);
  const colSpan = Math.max(renderedColumns.length, 1);

  const renderHeader = (column: ColumnDef<TData>) => {
    if (typeof column.header === "function") {
      return column.header({
        isAllPageRowsSelected: false,
        isSomePageRowsSelected: false,
        onToggleAll: () => {},
        setSorting: () => {},
      });
    }
    return column.header;
  };

  const renderCell = (column: ColumnDef<TData>, row: TData) =>
    column.cell({
      row,
      isSelected: false,
      isExpanded: false,
      onToggleSelect: () => {},
      onToggleExpand: () => {},
    });

  return (
    <div className={cn("overflow-x-auto", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {renderedColumns.map((column) => (
              <TableHead key={column.id} style={column.size ? { width: column.size } : undefined}>
                {renderHeader(column)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colSpan} className="h-24 text-center">
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground">{emptyTitle}</p>
                  {emptyDescription ? (
                    <p className="text-sm text-muted-foreground">{emptyDescription}</p>
                  ) : null}
                  {emptyAction}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.systemId}>
                {renderedColumns.map((column) => (
                  <TableCell key={column.id}>{renderCell(column, item)}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

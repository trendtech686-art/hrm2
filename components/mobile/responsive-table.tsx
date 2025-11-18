import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useMediaQuery } from "../../lib/use-media-query";
import { cn } from "../../lib/utils";

interface Column<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  hideOnMobile?: boolean;
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  mobileCardComponent?: (item: T) => React.ReactNode;
}

/**
 * ResponsiveTable - Switches between table (desktop) and cards (mobile)
 * Mobile-first approach: Cards on mobile, table on desktop
 */
export function ResponsiveTable<T extends Record<string, any>>({ 
  data, 
  columns, 
  className,
  mobileCardComponent 
}: ResponsiveTableProps<T>) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Mobile view: Card layout
  if (!isDesktop) {
    return (
      <div className={cn("space-y-3", className)}>
        {data.map((item, index) => {
          if (mobileCardComponent) {
            return (
              <Card key={index} className="p-4">
                {mobileCardComponent(item)}
              </Card>
            );
          }

          // Default mobile card layout
          const visibleColumns = columns.filter(col => !col.hideOnMobile);
          return (
            <Card key={index}>
              <CardContent className="p-4 space-y-2">
                {visibleColumns.map((column) => {
                  const value = column.cell 
                    ? column.cell(item)
                    : column.accessorKey 
                      ? item[column.accessorKey]
                      : "";
                  
                  return (
                    <div key={column.id} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">
                        {column.header}
                      </span>
                      <span className="text-sm font-medium text-right">
                        {value}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Desktop view: Table layout
  return (
    <div className={cn("rounded-md border", className)}>
      <ScrollArea className="h-full">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                {columns.map((column) => {
                  const value = column.cell 
                    ? column.cell(item)
                    : column.accessorKey 
                      ? item[column.accessorKey]
                      : "";
                  
                  return (
                    <TableCell key={column.id}>
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}

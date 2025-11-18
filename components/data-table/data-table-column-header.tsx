import * as React from "react"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"
import { cn } from "../../lib/utils.ts"
import { Button } from "../ui/button.tsx"

type SortDirection = 'asc' | 'desc';

type DataTableColumnHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  sortKey?: string;
  isSorted: boolean;
  sortDirection: SortDirection;
  onSort: (key: string) => void;
}

export function DataTableColumnHeader({
  title,
  sortKey,
  isSorted,
  sortDirection,
  onSort,
  className,
}: DataTableColumnHeaderProps) {
  if (!sortKey) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        onClick={() => onSort(sortKey)}
        className="-ml-4 h-8 data-[state=open]:bg-accent"
      >
        <span>{title}</span>
        {isSorted ? (
          sortDirection === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4 text-primary" />
          ) : (
            <ArrowUp className="ml-2 h-4 w-4 text-primary" />
          )
        ) : (
          <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground/30" />
        )}
      </Button>
    </div>
  )
}

import { ColumnDef } from "@/components/data-table/types";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import type { Importer } from "./types";
import type { SystemId } from "@/lib/id-types";

interface GetImporterColumnsProps {
  onEdit: (importer: Importer) => void;
  onDelete: (systemId: SystemId) => void;
  onToggleActive: (importer: Importer) => void;
  onToggleDefault: (importer: Importer) => void;
}

export const getImporterColumns = ({
  onEdit,
  onDelete,
  onToggleActive,
  onToggleDefault,
}: GetImporterColumnsProps): ColumnDef<Importer>[] => [
  {
    id: "name",
    accessorKey: "name",
    header: "Tên đơn vị",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.name}</div>
        {row.taxCode && (
          <div className="text-xs text-muted-foreground">MST: {row.taxCode}</div>
        )}
      </div>
    ),
  },
  {
    id: "address",
    accessorKey: "address",
    header: "Địa chỉ",
    cell: ({ row }) => {
      const address = row.address;
      return address ? (
        <div className="max-w-[300px] truncate" title={address}>
          {address}
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    id: "usageGuide",
    accessorKey: "usageGuide",
    header: "Hướng dẫn sử dụng",
    cell: ({ row }) => {
      const guide = row.usageGuide;
      return guide ? (
        <div className="max-w-[200px] truncate" title={guide}>
          {guide}
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    id: "isDefault",
    accessorKey: "isDefault",
    header: "Mặc định",
    cell: ({ row }) => {
      return (
        <Switch
          checked={row.isDefault}
          onCheckedChange={() => onToggleDefault(row)}
        />
      );
    },
  },
  {
    id: "isActive",
    accessorKey: "isActive",
    header: "Hoạt động",
    cell: ({ row }) => {
      return (
        <Switch
          checked={row.isActive}
          onCheckedChange={() => onToggleActive(row)}
        />
      );
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const importer = row;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(importer)}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(importer.systemId)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

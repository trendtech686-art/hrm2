import { ColumnDef } from "@/components/data-table/types";
import { MoreHorizontal, Pencil, Trash, Check, X } from "lucide-react";
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
import type { Brand } from "./types";
import type { SystemId } from "@/lib/id-types";

interface GetBrandColumnsProps {
  onEdit: (brand: Brand) => void;
  onDelete: (systemId: SystemId) => void;
  onToggleActive: (brand: Brand) => void;
}

export const getBrandColumns = ({
  onEdit,
  onDelete,
  onToggleActive,
}: GetBrandColumnsProps): ColumnDef<Brand>[] => [
  {
    id: "id",
    accessorKey: "id",
    header: "Mã thương hiệu",
    cell: ({ row }) => <div className="font-medium">{row.id}</div>,
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Tên thương hiệu",
    cell: ({ row }) => <div className="font-medium">{row.name}</div>,
  },
  {
    id: "website",
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => {
      const website = row.website;
      return website ? (
        <a 
          href={website.startsWith('http') ? website : `https://${website}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {website}
        </a>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    id: "isActive",
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.isActive}
            onCheckedChange={() => onToggleActive(row)}
          />
          <span className="text-sm text-muted-foreground">
            {row.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const brand = row;

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
            <DropdownMenuItem onClick={() => onEdit(brand)}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(brand.systemId)}
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

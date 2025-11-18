import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Search, Users, Building2, DollarSign, FileText, Settings, Calendar, Package, TrendingUp } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./command.tsx"
import { Button } from "./button.tsx"
import { Badge } from "./badge.tsx"

type CommandItem = {
  id: string
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  keywords: string[]
  onSelect: () => void
  badge?: string
}

const useCommandPalette = () => {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const commands: CommandItem[] = [
    // Navigation
    {
      id: "nav-dashboard",
      title: "Dashboard",
      description: "Trang chủ và tổng quan hệ thống",
      icon: TrendingUp,
      keywords: ["dashboard", "home", "trang chủ"],
      onSelect: () => navigate("/dashboard"),
    },
    {
      id: "nav-employees",
      title: "Quản lý nhân viên",
      description: "Xem và quản lý danh sách nhân viên",
      icon: Users,
      keywords: ["employees", "nhân viên", "staff"],
      onSelect: () => navigate("/employees"),
    },
    {
      id: "nav-add-employee",
      title: "Thêm nhân viên mới",
      description: "Tạo hồ sơ nhân viên mới",
      icon: Users,
      keywords: ["add employee", "thêm nhân viên", "new staff"],
      onSelect: () => navigate("/employees/new"),
    },
    {
      id: "nav-departments",
      title: "Quản lý phòng ban",
      description: "Xem và quản lý các phòng ban",
      icon: Building2,
      keywords: ["departments", "phòng ban", "divisions"],
      onSelect: () => navigate("/departments"),
    },
    {
      id: "nav-branches",
      title: "Quản lý chi nhánh",
      description: "Xem và quản lý chi nhánh",
      icon: Building2,
      keywords: ["branches", "chi nhánh", "locations"],
      onSelect: () => navigate("/branches"),
    },
    {
      id: "nav-payroll",
      title: "Quản lý lương",
      description: "Xử lý bảng lương và thưởng",
      icon: DollarSign,
      keywords: ["payroll", "salary", "lương", "thưởng"],
      onSelect: () => navigate("/payroll"),
    },
    {
      id: "nav-reports",
      title: "Báo cáo",
      description: "Xem các báo cáo và thống kê",
      icon: FileText,
      keywords: ["reports", "báo cáo", "statistics", "thống kê"],
      onSelect: () => navigate("/reports"),
    },
    {
      id: "nav-attendance",
      title: "Chấm công",
      description: "Quản lý chấm công nhân viên",
      icon: Calendar,
      keywords: ["attendance", "chấm công", "timesheet"],
      onSelect: () => navigate("/attendance"),
    },
    {
      id: "nav-inventory",
      title: "Quản lý kho",
      description: "Theo dõi tồn kho và sản phẩm",
      icon: Package,
      keywords: ["inventory", "kho", "stock", "warehouse"],
      onSelect: () => navigate("/inventory"),
    },
    {
      id: "nav-settings",
      title: "Cài đặt",
      description: "Cấu hình hệ thống",
      icon: Settings,
      keywords: ["settings", "cài đặt", "configuration"],
      onSelect: () => navigate("/settings"),
    },
  ]

  return { open, setOpen, commands }
}

export function CommandPalette() {
  const { open, setOpen, commands } = useCommandPalette()

  return (
    <>
      {/* Trigger Button */}
      <Button 
        variant="outline" 
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Tìm kiếm...</span>
        <span className="inline-flex lg:hidden">Tìm kiếm</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Tìm kiếm chức năng..." />
        <CommandList>
          <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
          
          <CommandGroup heading="Điều hướng">
            {commands.map((command) => (
              <CommandItem
                key={command.id}
                onSelect={() => {
                  command.onSelect()
                  setOpen(false)
                }}
                className="flex items-center gap-2"
              >
                {command.icon && <command.icon className="h-4 w-4" />}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span>{command.title}</span>
                    {command.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {command.badge}
                      </Badge>
                    )}
                  </div>
                  {command.description && (
                    <div className="text-xs text-muted-foreground">
                      {command.description}
                    </div>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

export { useCommandPalette }

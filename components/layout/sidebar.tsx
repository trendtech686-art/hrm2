'use client'

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users, Command, Clock, CalendarOff,
  Briefcase, Package, ShoppingCart, Truck, History, BookUser, Wrench,
  ShieldAlert, BadgeCent, CalendarCheck, Library,
  AreaChart, Settings, Search, ReceiptText, CreditCard,
  Inbox, Home, Wallet, Undo2, PackageSearch,
  ListTodo, ClipboardCheck, CheckSquare, ArrowLeftRight, CircleDollarSign, Tags, FolderTree,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { 
  Sidebar as SidebarPrimitive, 
  SidebarHeader, 
  SidebarNav,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '../ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '../../contexts/auth-context';
import { useUiStore } from '../../lib/ui-store';
import { useRoleSettings } from '../../features/settings/employees/hooks/use-role-settings';
import { useBranding } from '../../hooks/use-branding';
import type { Permission } from '../../features/employees/permissions';

type NavLinkInfo = {
  href: string;
  label: string;
  icon: React.ElementType;
  permission?: Permission;
};

type MenuGroup = {
  title: string;
  links: NavLinkInfo[];
};

const menuGroups: MenuGroup[] = [
  {
    title: 'Tổng quan',
    links: [
      { href: '/dashboard', label: 'Dashboard', icon: Home },
    ]
  },
  {
    title: 'Quản lý Nhân sự',
    links: [
      { href: '/employees', label: 'Quản lý nhân viên', icon: Users, permission: 'view_employees' },
      { href: '/attendance', label: 'Quản lý Chấm công', icon: Clock, permission: 'view_attendance' },
      { href: '/leaves', label: 'Quản lý Nghỉ phép', icon: CalendarOff, permission: 'view_leaves' },
      { href: '/payroll', label: 'Quản lý Bảng lương', icon: CalendarCheck, permission: 'view_payroll' },
    ]
  },
  {
    title: 'Kinh doanh & CRM',
    links: [
        { href: '/customers', label: 'Quản lý Khách hàng', icon: Briefcase, permission: 'view_customers' },
        { href: '/products', label: 'Quản lý Sản phẩm', icon: Package, permission: 'view_products' },
        { href: '/brands', label: 'Thương hiệu', icon: Tags, permission: 'view_brands' },
        { href: '/categories', label: 'Danh mục sản phẩm', icon: FolderTree, permission: 'view_categories' },
        { href: '/orders', label: 'Quản lý Đơn hàng', icon: ShoppingCart, permission: 'view_orders' },
        { href: '/returns', label: 'Quản lý Trả hàng', icon: Undo2, permission: 'view_sales_returns' },
        { href: '/packaging', label: 'Quản lý Đóng gói', icon: Inbox, permission: 'view_packaging' },
        { href: '/shipments', label: 'Quản lý vận đơn', icon: Truck, permission: 'view_shipments' },
        { href: '/reconciliation', label: 'Đối soát COD', icon: Wallet, permission: 'view_reconciliation' },
    ]
  },
  {
    title: 'Quản lý Mua hàng',
    links: [
        { href: '/suppliers', label: 'Quản lý Nhà cung cấp', icon: Truck, permission: 'view_suppliers' },
        { href: '/purchase-orders', label: 'Quản lý Đơn nhập hàng', icon: History, permission: 'view_purchase_orders' },
        { href: '/ordered-products', label: 'Quản lý Hàng đặt', icon: PackageSearch, permission: 'view_purchase_orders' },
        { href: '/purchase-returns', label: 'Quản lý Trả hàng nhập', icon: Undo2, permission: 'view_purchase_returns' },
        { href: '/supplier-warranties', label: 'BH Nhà cung cấp', icon: ShieldAlert, permission: 'view_supplier_warranty' },
        { href: '/inventory-receipts', label: 'Quản lý Phiếu nhập kho', icon: Inbox, permission: 'view_inventory' },
    ]
  },
  {
    title: 'Quản lý Kho',
    links: [
        { href: '/stock-transfers', label: 'Chuyển kho', icon: ArrowLeftRight, permission: 'view_stock_transfers' },
        { href: '/inventory-checks', label: 'Kiểm kê định kỳ', icon: ClipboardCheck, permission: 'view_inventory_checks' },
        { href: '/cost-adjustments', label: 'Điều chỉnh giá vốn', icon: CircleDollarSign, permission: 'view_cost_adjustments' },
        { href: '/price-adjustments', label: 'Điều chỉnh giá bán', icon: CircleDollarSign, permission: 'view_cost_adjustments' },
    ]
  },
  {
    title: 'Quản lý Tài chính',
    links: [
        { href: '/cashbook', label: 'Sổ quỹ', icon: BookUser, permission: 'view_vouchers' },
        { href: '/receipts', label: 'Quản lý Phiếu thu', icon: ReceiptText, permission: 'view_vouchers' },
        { href: '/payments', label: 'Quản lý Phiếu chi', icon: CreditCard, permission: 'view_vouchers' },
    ]
  },
  {
    title: 'Vận hành Nội bộ',
    links: [
        { href: '/my-tasks', label: 'Công việc của tôi', icon: CheckSquare, permission: 'view_tasks' },
        { href: '/tasks', label: 'Giao việc nội bộ', icon: ListTodo, permission: 'manage_tasks' },
        { href: '/warranty', label: 'Quản lý Bảo hành', icon: Wrench, permission: 'view_warranty' },
        { href: '/complaints', label: 'Quản lý Khiếu nại', icon: ShieldAlert, permission: 'view_complaints' },
        { href: '/penalties', label: 'Quản lý Phiếu phạt', icon: BadgeCent, permission: 'view_employees' },
    ]
  },
  {
    title: 'Tổ chức & Giao tiếp',
    links: [
        { href: '/wiki', label: 'Wiki nội bộ', icon: Library, permission: 'view_wiki' },
    ]
  },
  {
    title: 'Báo cáo',
    links: [
      { href: '/reports', label: 'Báo cáo', icon: AreaChart, permission: 'view_reports' },
    ]
  },
  {
    title: 'Hệ thống',
    links: [
        { href: '/settings', label: 'Cài đặt', icon: Settings, permission: 'view_settings' },
    ]
  }
];

// FIX: Changed props to use React.PropsWithChildren to resolve "children is missing" type error.
function SidebarNavLink({ 
  href, 
  icon: Icon, 
  label, 
  collapsed 
}: { 
  href: string; 
  icon: React.ElementType; 
  label: string; 
  collapsed?: boolean 
}) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href) && href !== '/dashboard');

  const linkContent = (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
        collapsed && 'justify-center px-2',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-foreground/80 hover:bg-muted hover:text-foreground'
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            {linkContent}
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return linkContent;
}

export function Sidebar() {
    const [search, setSearch] = React.useState('');
  const { employee: authEmployee } = useAuth();
  const loggedInUser = authEmployee;
    const { isSidebarCollapsed, toggleSidebarCollapse: _toggleSidebarCollapse } = useUiStore();
    const { data: customRoles } = useRoleSettings();
    const { logoUrl } = useBranding();

    const filteredMenuGroups = React.useMemo(() => {
    const userRole = loggedInUser?.role || 'Sales';
    // Admin always sees everything
    const isAdmin = userRole === 'Admin';
    // Find the custom role matching the user's role to get their configured permissions
    const matchedRole = customRoles?.find(r => r.id === userRole);
    // Use matched role permissions; empty array while still loading real data for non-admin
    const userPermissions: Permission[] = matchedRole?.permissions ?? (isAdmin ? [] : []);

        return menuGroups
          .map(group => {
            const filteredLinks = group.links.filter(link => {
                const canAccess = isAdmin || !link.permission || userPermissions.includes(link.permission);
                const matchesSearch = !search.trim() || link.label.toLowerCase().includes(search.toLowerCase());
                return canAccess && matchesSearch;
            });
            return { ...group, links: filteredLinks };
          })
          .filter(group => group.links.length > 0);
    }, [search, loggedInUser, customRoles]);

    return (
        <SidebarPrimitive>
            <SidebarHeader>
                <Link href="/" className="flex items-center gap-2 font-semibold text-lg overflow-hidden">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="h-6 shrink-0 object-contain" />
                    ) : (
                      <Command className="h-6 w-6 shrink-0" />
                    )}
                    {!isSidebarCollapsed && !logoUrl && <span className="truncate">ACME ERP</span>}
                </Link>
            </SidebarHeader>

            <div className="p-4" suppressHydrationWarning>
                {!isSidebarCollapsed && (
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Tìm kiếm chức năng..."
                            className="w-full pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoComplete="off"
                        />
                    </div>
                )}
            </div>

            <SidebarNav>
                {filteredMenuGroups.map((group) => (
                    <SidebarGroup key={group.title}>
                        {!isSidebarCollapsed && (
                            <SidebarGroupLabel>
                                {group.title}
                            </SidebarGroupLabel>
                        )}
                        <SidebarGroupContent>
                            {group.links.map((link) => (
                                <SidebarNavLink 
                                    key={link.href} 
                                    href={link.href}
                                    icon={link.icon}
                                    label={link.label}
                                    collapsed={isSidebarCollapsed}
                                />
                            ))}
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarNav>

            <SidebarFooter>
                {isSidebarCollapsed ? (
                    <TooltipProvider delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-10 rounded-lg"
                                    asChild
                                >
                                    <Link href="/profile">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={loggedInUser?.avatarUrl} />
                                            <AvatarFallback className="text-xs">
                                                {loggedInUser?.fullName?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="font-medium">
                                <div className="text-sm font-semibold">{loggedInUser?.fullName}</div>
                                <div className="text-xs text-muted-foreground">{loggedInUser?.workEmail}</div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : (
                    <Link href="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted transition-colors">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={loggedInUser?.avatarUrl} />
                            <AvatarFallback className="text-xs">
                                {loggedInUser?.fullName?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate">{loggedInUser?.fullName}</span>
                            <span className="text-xs text-muted-foreground truncate">{loggedInUser?.workEmail}</span>
                        </div>
                    </Link>
                )}
            </SidebarFooter>
        </SidebarPrimitive>
    );
}

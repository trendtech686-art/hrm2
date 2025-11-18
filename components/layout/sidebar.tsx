import * as React from 'react';
// FIX: Use named imports for react-router-dom to fix module export errors.
import { Link, useLocation } from 'react-router-dom';
import {
  Users, Command, FileText, Building2, UserCog, Clock, CalendarOff, Landmark, Target,
  Briefcase, Package, ShoppingCart, Truck, History, Banknote, BookUser, Wrench,
  Workflow, ShieldAlert, BadgeCent, CalendarCheck, Library, MessageCircle, Bell,
  AreaChart, Settings, GitPullRequest, FileClock, Search, ReceiptText, CreditCard,
  Inbox, Home, Warehouse, Wallet, Undo2, PanelLeftClose, PanelLeftOpen, User, Heart,
  ListTodo, ClipboardCheck, CheckSquare,
} from 'lucide-react';
import { cn } from '../../lib/utils.ts';
import { Input } from '../ui/input.tsx';
import { Button } from '../ui/button.tsx';
import { 
  Sidebar as SidebarPrimitive, 
  SidebarHeader, 
  SidebarNav,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '../ui/sidebar.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar.tsx';
import { useEmployeeStore } from '../../features/employees/store.ts';
import { useUiStore } from '../../lib/ui-store.ts';

type NavLinkInfo = {
  href: string;
  label: string;
  icon: React.ElementType;
  roles?: ('Admin' | 'Manager' | 'Sales' | 'Warehouse')[];
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
      { href: '/employees', label: 'Quản lý nhân viên', icon: Users },
      { href: '/organization-chart', label: 'Sơ đồ tổ chức', icon: Workflow },
      { href: '/departments', label: 'Phòng ban & Chức vụ', icon: Building2 },
      { href: '/attendance', label: 'Quản lý Chấm công', icon: Clock },
      { href: '/leaves', label: 'Quản lý Nghỉ phép', icon: CalendarOff },
    ]
  },
  {
    title: 'Kinh doanh & CRM',
    links: [
        { href: '/customers', label: 'Quản lý Khách hàng', icon: Briefcase },
        { href: '/products', label: 'Quản lý Sản phẩm', icon: Package },
        { href: '/orders', label: 'Quản lý Đơn hàng', icon: ShoppingCart },
        { href: '/returns', label: 'Quản lý Trả hàng', icon: Undo2 },
        { href: '/packaging', label: 'Quản lý Đóng gói', icon: Inbox, roles: ['Admin', 'Manager', 'Warehouse'] },
        { href: '/shipments', label: 'Quản lý vận đơn', icon: Truck, roles: ['Admin', 'Manager', 'Warehouse'] },
        { href: '/reconciliation', label: 'Đối soát COD', icon: Wallet, roles: ['Admin', 'Manager'] },
    ]
  },
  {
    title: 'Quản lý Mua hàng',
    links: [
        { href: '/suppliers', label: 'Quản lý Nhà cung cấp', icon: Truck },
        { href: '/purchase-orders', label: 'Quản lý Đơn nhập hàng', icon: History },
        { href: '/purchase-returns', label: 'Quản lý Trả hàng nhập', icon: Undo2 },
        { href: '/inventory-receipts', label: 'Quản lý Phiếu nhập kho', icon: Inbox },
    ]
  },
  {
    title: 'Quản lý Kho',
    links: [
        { href: '/inventory-checks', label: 'Kiểm kê định kỳ', icon: ClipboardCheck, roles: ['Admin', 'Warehouse'] },
    ]
  },
  {
    title: 'Quản lý Tài chính',
    links: [
        { href: '/cashbook', label: 'Sổ quỹ', icon: BookUser },
        { href: '/receipts', label: 'Quản lý Phiếu thu', icon: ReceiptText },
        { href: '/payments', label: 'Quản lý Phiếu chi', icon: CreditCard },
    ]
  },
  {
    title: 'Vận hành Nội bộ',
    links: [
        { href: '/my-tasks', label: 'Công việc của tôi', icon: CheckSquare },
        { href: '/tasks', label: 'Giao việc nội bộ', icon: ListTodo, roles: ['Admin', 'Manager'] },
        { href: '/warranty', label: 'Quản lý Bảo hành', icon: Wrench },
        { href: '/complaints', label: 'Quản lý Khiếu nại', icon: ShieldAlert },
        { href: '/penalties', label: 'Quản lý Phiếu phạt', icon: BadgeCent },
    ]
  },
  {
    title: 'Tổ chức & Giao tiếp',
    links: [
        { href: '/wiki', label: 'Wiki nội bộ', icon: Library },
    ]
  },
  {
    title: 'Báo cáo',
    links: [
      { href: '/reports/sales', label: 'Báo cáo bán hàng', icon: AreaChart },
      { href: '/reports/inventory', label: 'Báo cáo tồn kho', icon: Warehouse },
    ]
  },
  {
    title: 'Hệ thống',
    links: [
        { href: '/settings', label: 'Cài đặt', icon: Settings },
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
  const location = useLocation();
  const isActive = location.pathname === href || (href !== "/" && location.pathname.startsWith(href) && href !== '/dashboard');

  const linkContent = (
    <Link
      to={href}
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
    const { data: employees } = useEmployeeStore();
    const loggedInUser = employees[0]; // Simulate logged-in user
    const { isSidebarCollapsed, toggleSidebarCollapse } = useUiStore();

    const filteredMenuGroups = React.useMemo(() => {
        const userRole = loggedInUser?.role || 'Admin';

        return menuGroups
          .map(group => {
            const filteredLinks = group.links.filter(link => {
                const hasPermission = !link.roles || link.roles.includes(userRole);
                const matchesSearch = !search.trim() || link.label.toLowerCase().includes(search.toLowerCase());
                return hasPermission && matchesSearch;
            });
            return { ...group, links: filteredLinks };
          })
          .filter(group => group.links.length > 0);
    }, [search, loggedInUser]);

    return (
        <SidebarPrimitive>
            <SidebarHeader>
                <Link to="/" className="flex items-center gap-2 font-semibold text-lg overflow-hidden">
                    <Command className="h-6 w-6 shrink-0" />
                    {!isSidebarCollapsed && <span className="truncate">ACME ERP</span>}
                </Link>
            </SidebarHeader>

            <div className="p-4">
                {!isSidebarCollapsed && (
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Tìm kiếm chức năng..."
                            className="w-full pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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
                                    <Link to="/profile">
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
                    <Link to="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted transition-colors">
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

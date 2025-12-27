'use client'

import * as React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronRight, User, Menu, PanelLeftClose, PanelLeftOpen, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useUiStore } from '../../lib/ui-store';
import { ResponsiveContainer } from '../ui/responsive-container';
import { usePageHeaderContext } from '../../contexts/page-header-context';
import { ROUTES } from '../../lib/router';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/auth-context';
import { NotificationCenter } from '../ui/notification-center';

export function Header() {
  const { toggleSidebar, toggleSidebarCollapse, isSidebarCollapsed } = useUiStore();
  const { pageHeader } = usePageHeaderContext();
  const router = useRouter();
  const { user, employee, logout: authLogout } = useAuth();
  
  const { breadcrumb = [] } = pageHeader;
  
  const handleLogout = () => {
    authLogout();
    toast.success('Đăng xuất thành công');
    router.push(ROUTES.AUTH.LOGIN);
  };
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-card shadow-sm shrink-0 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-6 flex items-center gap-4 py-2">
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8 shrink-0 touch-target"
              onClick={toggleSidebar}
          >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex h-8 w-8 shrink-0"
              onClick={toggleSidebarCollapse}
          >
              {isSidebarCollapsed ? (
                  <PanelLeftOpen className="h-5 w-5" />
              ) : (
                  <PanelLeftClose className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle Sidebar</span>
          </Button>
          
          {/* Breadcrumb */}
          {breadcrumb.length > 0 && (
            <nav className="hidden md:flex items-center gap-1 text-sm min-w-0">
              {breadcrumb.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
                  {item.isCurrent ? (
                    <span className="text-foreground font-medium truncate">{item.label}</span>
                  ) : (
                    <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors truncate hover:underline">
                      {item.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          {/* Notification Center */}
          <NotificationCenter />
          
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 touch-target">
                      <User className="h-4 w-4" />
                      <span className="sr-only">Toggle user menu</span>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user ? (
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{employee?.fullName || user.name}</p>
                        <p className="text-xs text-muted-foreground">{employee?.workEmail || user.email}</p>
                        {employee && (
                          <>
                            <p className="text-xs text-muted-foreground">{employee.id} - {employee.jobTitle}</p>
                            <p className="text-xs text-muted-foreground">{employee.department}</p>
                          </>
                        )}
                      </div>
                    ) : (
                      'Tài khoản'
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => router.push('/settings')}>Cài đặt</DropdownMenuItem>
                  <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
              </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

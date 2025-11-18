import * as React from "react"
import { cn } from "../../lib/utils.ts"
import { useUiStore } from '../../lib/ui-store.ts'
import { ScrollArea } from "./scroll-area.tsx"

const Sidebar = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => {
  const { isSidebarOpen, isSidebarCollapsed } = useUiStore();
  return (
    <aside
      ref={ref}
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex-shrink-0 bg-card flex flex-col border-r shadow-sm transition-all duration-300 ease-in-out lg:translate-x-0 overflow-x-hidden",
        isSidebarCollapsed ? "w-16" : "w-64",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}
      {...props}
    />
  )
});
Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-16 items-center border-b px-6 shrink-0", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarNav = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <ScrollArea className="flex-1">
    <nav
      ref={ref}
      className={cn("px-4 py-4", className)}
      {...props}
    />
  </ScrollArea>
));
SidebarNav.displayName = "SidebarNav";

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-auto border-t p-4 shrink-0", className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-4", className)}
    {...props}
  />
));
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground tracking-wider",
      className
    )}
    {...props}
  />
));
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1", className)}
    {...props}
  />
));
SidebarGroupContent.displayName = "SidebarGroupContent";

export { 
  Sidebar, 
  SidebarHeader, 
  SidebarNav, 
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
};

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs.tsx";
import { cn } from "../../lib/utils.ts";

type SettingsVerticalTabsItem = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

type SettingsVerticalTabsProps = {
  value: string;
  onValueChange: (value: string) => void;
  tabs: SettingsVerticalTabsItem[];
  children: React.ReactNode;
  className?: string;
  listClassName?: string;
  contentWrapperClassName?: string;
};

/**
 * Shared layout for Settings pages that need sticky vertical tabs.
 * Uses shadcn/ui Tabs component with custom styling for vertical layout on desktop.
 */
export function SettingsVerticalTabs({
  value,
  onValueChange,
  tabs,
  children,
  className,
  listClassName,
  contentWrapperClassName,
}: SettingsVerticalTabsProps) {
  return (
    <Tabs 
      value={value} 
      onValueChange={onValueChange} 
      className={cn("flex flex-col md:flex-row md:gap-8", className)}
    >
      {/* Mobile: horizontal scrollable tabs, Desktop: vertical sidebar */}
      <TabsList
        className={cn(
          // Base styles
          "h-auto w-full justify-start rounded-lg bg-muted p-1",
          // Mobile: horizontal with scroll
          "flex flex-row gap-1 overflow-x-auto",
          // Desktop: vertical sidebar
          "md:flex-col md:w-[200px] md:shrink-0 md:bg-transparent md:p-0",
          "md:sticky md:top-6 md:self-start",
          listClassName,
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
            className={cn(
              // Mobile: compact horizontal tabs
              "flex-shrink-0 px-3 py-1.5 text-sm text-foreground",
              // Desktop: full-width vertical tabs
              "md:w-full md:justify-start md:px-4 md:py-2",
              "md:data-[state=active]:bg-muted md:data-[state=active]:shadow-none",
              tab.className
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {/* Content area */}
      <div className={cn(
        "flex-1 min-w-0 mt-4 md:mt-0",
        contentWrapperClassName
      )}>
        {children}
      </div>
    </Tabs>
  );
}

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { TouchButton } from "./touch-button";

interface EmptyStateProps {
  icon?: LucideIcon | undefined;
  title: string;
  description?: string | undefined;
  action?: React.ReactNode | undefined;
  className?: string | undefined;
  size?: "sm" | "md" | "lg" | undefined;
}

/**
 * EmptyState - Professional empty state component
 * Use cases:
 * - No search results
 * - Empty lists
 * - No data to display
 * - First-time user experience
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = "md",
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: "py-8",
      icon: "h-12 w-12 mb-3",
      title: "text-base",
      description: "text-sm",
    },
    md: {
      container: "py-12",
      icon: "h-16 w-16 mb-4",
      title: "text-lg",
      description: "text-sm",
    },
    lg: {
      container: "py-16",
      icon: "h-20 w-20 mb-6",
      title: "text-xl",
      description: "text-base",
    },
  };

  const classes = sizeClasses[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 text-center",
        classes.container,
        className
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            "text-muted-foreground",
            classes.icon
          )}
          strokeWidth={1.5}
        />
      )}
      
      <h3 className={cn("font-semibold mb-2", classes.title)}>
        {title}
      </h3>
      
      {description && (
        <p
          className={cn(
            "text-muted-foreground mb-6 max-w-sm",
            classes.description
          )}
        >
          {description}
        </p>
      )}
      
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/**
 * SearchEmptyState - Specialized empty state for search results
 */
export function SearchEmptyState({
  searchQuery,
  onClear,
}: {
  searchQuery: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      title="Không tìm thấy kết quả"
      description={`Không có kết quả nào phù hợp với "${searchQuery}". Thử tìm kiếm với từ khóa khác.`}
      action={
        onClear && (
          <TouchButton variant="outline" onClick={onClear}>
            Xóa bộ lọc
          </TouchButton>
        )
      }
    />
  );
}

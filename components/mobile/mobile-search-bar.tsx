import * as React from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "../ui/input";
import { TouchButton } from "./touch-button";
import { cn } from "../../lib/utils";
import { useMediaQuery } from "../../lib/use-media-query";

interface MobileSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFilter?: () => void;
  showFilter?: boolean;
  className?: string;
}

/**
 * MobileSearchBar - Mobile-optimized search component
 * Features:
 * - Large touch targets (min 44px)
 * - Clear button when typing
 * - Optional filter button
 * - Responsive sizing
 */
export function MobileSearchBar({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  onFilter,
  showFilter = false,
  className,
}: MobileSearchBarProps) {
  const isMobile = !useMediaQuery("(min-width: 768px)");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative flex items-center space-x-2", className)}>
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full pl-10",
            value && "pr-10", // Add padding for clear button when there's text
            isMobile ? "h-12 text-base" : "h-9 text-sm" // Larger on mobile for better touch
          )}
          // Mobile optimizations
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />

        {/* Clear Button */}
        {value && (
          <TouchButton
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full p-0"
            aria-label="Xóa tìm kiếm"
          >
            <X className="h-4 w-4" />
          </TouchButton>
        )}
      </div>

      {/* Filter Button */}
      {showFilter && onFilter && (
        <TouchButton
          variant="outline"
          size={isMobile ? "default" : "sm"}
          onClick={onFilter}
          className={cn(
            "flex-shrink-0",
            isMobile ? "h-12 px-4" : "h-9 px-3"
          )}
          aria-label="Bộ lọc"
        >
          <Filter className="h-4 w-4" />
          {!isMobile && <span className="ml-2">Lọc</span>}
        </TouchButton>
      )}
    </div>
  );
}

import * as React from 'react';
import { cn } from '../../lib/utils';

interface StickyScrollbarProps {
  /** Ref to the scrollable element (table container) */
  targetRef: React.RefObject<HTMLDivElement>;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Sticky Horizontal Scrollbar Component
 * 
 * Creates a sticky scrollbar at the bottom of the viewport that syncs with
 * the table's horizontal scroll. This allows users to scroll horizontally
 * without having to scroll to the bottom of the table first.
 */
export function StickyScrollbar({ targetRef, className }: StickyScrollbarProps) {
  const scrollbarRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const [scrollbarStyle, setScrollbarStyle] = React.useState<React.CSSProperties>({});
  const [isMounted, setIsMounted] = React.useState(false);
  const [updateTrigger, setUpdateTrigger] = React.useState(0); // ✅ Force update trigger

  // Force re-render after mount to ensure refs are available
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ Force update when target element changes size (e.g., columns added/removed)
  React.useEffect(() => {
    if (!isMounted || !targetRef.current) return;
    
    const targetElement = targetRef.current;
    
    // Watch for changes to table width/scrollWidth
    const mutationObserver = new MutationObserver(() => {
      setUpdateTrigger(prev => prev + 1);
    });
    
    mutationObserver.observe(targetElement, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    
    return () => {
      mutationObserver.disconnect();
    };
  }, [targetRef, isMounted]);

  React.useEffect(() => {
    if (!isMounted) return;
    
    const targetElement = targetRef.current;
    const scrollbarElement = scrollbarRef.current;
    
    if (!targetElement || !scrollbarElement) return;

    let animationFrameId: number;

    // Check if horizontal scrollbar is needed and update position
    const updateScrollbar = () => {
      const hasHorizontalScroll = targetElement.scrollWidth > targetElement.clientWidth;
      setIsVisible(hasHorizontalScroll);
      
      if (hasHorizontalScroll) {
        // Get the bounding rect to position the scrollbar correctly
        const rect = targetElement.getBoundingClientRect();
        
        // Set the scrollbar position and width to match the table VIEWPORT
        setScrollbarStyle({
          left: `${rect.left}px`,
          width: `${rect.width}px`,
        });
        
        // ✅ FIX: Set the inner content width to match table's FULL scroll width
        // This allows the scrollbar to scroll the full distance
        const scrollContent = scrollbarElement.firstElementChild as HTMLDivElement;
        if (scrollContent) {
          scrollContent.style.width = `${targetElement.scrollWidth}px`;
          scrollContent.style.height = '1px'; // Ensure height for scrollbar
        }
      }
    };

    // Sync scroll position: sticky scrollbar -> table
    const handleStickyScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        if (targetElement.scrollLeft !== scrollbarElement.scrollLeft) {
          targetElement.scrollLeft = scrollbarElement.scrollLeft;
        }
      });
    };

    // Sync scroll position: table -> sticky scrollbar
    const handleTableScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        if (scrollbarElement.scrollLeft !== targetElement.scrollLeft) {
          scrollbarElement.scrollLeft = targetElement.scrollLeft;
        }
      });
    };

    // Initial update
    updateScrollbar();

    // Add event listeners
    scrollbarElement.addEventListener('scroll', handleStickyScroll, { passive: true });
    targetElement.addEventListener('scroll', handleTableScroll, { passive: true });
    window.addEventListener('resize', updateScrollbar, { passive: true });

    // Re-check on content changes
    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(targetElement);

    return () => {
      cancelAnimationFrame(animationFrameId);
      scrollbarElement.removeEventListener('scroll', handleStickyScroll);
      targetElement.removeEventListener('scroll', handleTableScroll);
      window.removeEventListener('resize', updateScrollbar);
      resizeObserver.disconnect();
    };
  }, [targetRef, isMounted, updateTrigger]); // ✅ Re-run when updateTrigger changes

  // Always render but conditionally show with visibility
  return (
    <div
      ref={scrollbarRef}
      className={cn(
        "fixed bottom-0 z-[100] overflow-x-auto overflow-y-hidden",
        "h-3 bg-muted/90 backdrop-blur-sm border-t border-border shadow-[0_-2px_12px_rgba(0,0,0,0.08)]",
        "transition-opacity duration-200",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
        className
      )}
      style={scrollbarStyle}
    >
      {/* Invisible content div to create scrollbar width */}
      <div className="h-px pointer-events-none" />
    </div>
  );
}


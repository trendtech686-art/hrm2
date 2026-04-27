import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { cn } from '../../lib/utils';

interface StickyScrollbarProps {
  /** Ref to the scrollable element (table container) */
  targetRef: React.RefObject<HTMLDivElement | null>;
  /** Trigger re-check when data changes */
  dataLength?: number;
  /** Additional CSS classes */
  className?: string | undefined;
}

/**
 * Sticky Horizontal Scrollbar Component
 * 
 * Creates a sticky scrollbar at the bottom of the viewport that syncs with
 * the table's horizontal scroll.
 */
export function StickyScrollbar({ targetRef, dataLength = 0, className }: StickyScrollbarProps) {
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [scrollbarStyle, setScrollbarStyle] = useState<CSSProperties>({});
  const [contentWidth, setContentWidth] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const targetElement = targetRef.current;
    const scrollbarElement = scrollbarRef.current;
    
    if (!targetElement || !scrollbarElement) {
      return;
    }

    // Update scrollbar position and size
    const updateScrollbar = () => {
      const scrollW = targetElement.scrollWidth;
      const clientW = targetElement.clientWidth;
      const hasScroll = scrollW > clientW + 1;

      setIsVisible(hasScroll);

      if (hasScroll) {
        const rect = targetElement.getBoundingClientRect();
        const nextLeft = Math.round(rect.left);
        const nextWidth = Math.round(rect.width);
        setScrollbarStyle(prev => {
          if ((prev as Record<string, number>).left === nextLeft && (prev as Record<string, number>).width === nextWidth) return prev;
          return { left: nextLeft, width: nextWidth };
        });
        setContentWidth(prev => prev === scrollW ? prev : scrollW);
      }
    };

    // Sync: scrollbar -> table
    const handleScrollbarScroll = () => {
      if (isScrollingRef.current) return;
      isScrollingRef.current = true;
      targetElement.scrollLeft = scrollbarElement.scrollLeft;
      requestAnimationFrame(() => {
        isScrollingRef.current = false;
      });
    };

    // Sync: table -> scrollbar
    const handleTableScroll = () => {
      if (isScrollingRef.current) return;
      isScrollingRef.current = true;
      scrollbarElement.scrollLeft = targetElement.scrollLeft;
      requestAnimationFrame(() => {
        isScrollingRef.current = false;
      });
    };

    // Initial + delayed updates
    updateScrollbar();
    const t1 = setTimeout(updateScrollbar, 100);
    const t2 = setTimeout(updateScrollbar, 300);
    const t3 = setTimeout(updateScrollbar, 1000);

    // Event listeners
    scrollbarElement.addEventListener('scroll', handleScrollbarScroll, { passive: true });
    targetElement.addEventListener('scroll', handleTableScroll, { passive: true });
    window.addEventListener('resize', updateScrollbar, { passive: true });

    // Observe size changes
    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(targetElement);

    // Observe DOM mutations (column toggling, content changes)
    const mutationObserver = new MutationObserver(updateScrollbar);
    mutationObserver.observe(targetElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      scrollbarElement.removeEventListener('scroll', handleScrollbarScroll);
      targetElement.removeEventListener('scroll', handleTableScroll);
      window.removeEventListener('resize', updateScrollbar);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [targetRef, dataLength]);

  // Always render, use CSS to hide
  return (
    <div
      ref={scrollbarRef}
      className={cn(
        "fixed bottom-0 z-100 overflow-x-scroll overflow-y-hidden",
        "h-4 bg-muted/80 border-t border-border",
        className
      )}
      style={{
        ...scrollbarStyle,
        display: isVisible ? 'block' : 'none',
      }}
    >
      <div style={{ width: contentWidth, height: 1 }} />
    </div>
  );
}

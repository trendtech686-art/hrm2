import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"

type CarouselContextProps = {
  carouselRef: React.RefObject<HTMLDivElement | null>;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation: "horizontal" | "vertical";
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }
  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }
>(({ orientation = "horizontal", className, children, ...props }, ref) => {
  const carouselRef = React.useRef<HTMLDivElement>(null)
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const getScrollDimension = React.useCallback(() => {
    if (!carouselRef.current) return 0;
    // Assume all items have the same size. Get the first item's size.
    const firstItem = carouselRef.current.children[0] as HTMLElement;
    if (!firstItem) return 0;
    return orientation === "horizontal" ? firstItem.offsetWidth : firstItem.offsetHeight;
  }, [orientation]);
  
  const scrollPrev = React.useCallback(() => {
    if (!carouselRef.current) return;
    const dimension = getScrollDimension();
    carouselRef.current.scrollBy({
        [orientation === 'horizontal' ? 'left' : 'top']: -dimension,
        behavior: 'smooth'
    });
  }, [orientation, getScrollDimension]);

  const scrollNext = React.useCallback(() => {
    if (!carouselRef.current) return;
    const dimension = getScrollDimension();
    carouselRef.current.scrollBy({
        [orientation === 'horizontal' ? 'left' : 'top']: dimension,
        behavior: 'smooth'
    });
  }, [orientation, getScrollDimension]);
  
  const handleScroll = React.useCallback(() => {
    if (!carouselRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth, scrollTop, scrollHeight, clientHeight } = carouselRef.current;
    
    if (orientation === "horizontal") {
      setCanScrollPrev(scrollLeft > 0);
      setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 1); // -1 for precision issues
    } else {
      setCanScrollPrev(scrollTop > 0);
      setCanScrollNext(scrollTop < scrollHeight - clientHeight - 1);
    }

  }, [orientation]);

  React.useEffect(() => {
    const container = carouselRef.current;
    if (container) {
      handleScroll(); // Initial check
      container.addEventListener("scroll", handleScroll, { passive: true });
      // Re-check on resize
      const resizeObserver = new ResizeObserver(handleScroll);
      resizeObserver.observe(container);

      return () => {
        container.removeEventListener("scroll", handleScroll);
        resizeObserver.disconnect();
      };
    }
  }, [handleScroll]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        orientation,
      }}
    >
      <div
        ref={ref}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
})
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()
  const combinedRef = (node: HTMLDivElement | null) => {
    (carouselRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
     if (typeof ref === 'function') ref(node);
     else if (ref) ref.current = node;
  };

  return (
    <div className="overflow-hidden">
      <div
        ref={combinedRef}
        className={cn(
          "flex hide-scrollbar",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        style={{ scrollSnapType: orientation === "horizontal" ? "x mandatory" : "y mandatory" }}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        "flex items-center justify-center",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      style={{ scrollSnapAlign: "start" }}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { Button } from './button';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Download, RotateCw, Maximize2 } from 'lucide-react';
import { Spinner } from './spinner';

interface ImagePreviewDialogProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
}

/**
 * Dialog để preview ảnh với carousel - Mobile-first optimized
 * - Next/Previous navigation (swipe on mobile)
 * - Zoom in/out (pinch on mobile)
 * - Download
 * - Keyboard shortcuts (Arrow keys, Escape)
 * - Touch gestures support
 */
export function ImagePreviewDialog({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
  title = 'Xem ảnh',
}: ImagePreviewDialogProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = React.useState<{ x: number; y: number } | null>(null);
  const [initialPinchDistance, setInitialPinchDistance] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const imageViewerRef = React.useRef<HTMLDivElement>(null);
  const preloadedImages = React.useRef<Set<string>>(new Set());
  const preloadImage = React.useCallback((url?: string) => {
    if (!url || preloadedImages.current.has(url)) {
      return;
    }
    const img = new Image();
    img.src = url;
    preloadedImages.current.add(url);
  }, []);
  const [isImageLoading, setIsImageLoading] = React.useState(true);

  React.useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setIsImageLoading(true);
  }, [initialIndex, open]);

  React.useEffect(() => {
    if (!open || images.length === 0) return;
    const offsets = [0, 1, -1, 2];
    offsets.forEach(offset => {
      const idx = (currentIndex + offset + images.length) % images.length;
      preloadImage(images[idx]);
    });
  }, [open, currentIndex, images, preloadImage]);

  // Keyboard shortcuts
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, currentIndex, images.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setIsImageLoading(true);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setIsImageLoading(true);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - for swipe navigation
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      // Two finger pinch - for zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialPinchDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistance) {
      // Handle pinch zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = distance / initialPinchDistance;
      setZoom((prev) => Math.max(0.5, Math.min(3, prev * scale)));
      setInitialPinchDistance(distance);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart && e.changedTouches.length === 1) {
      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };
      const deltaX = touchEnd.x - touchStart.x;
      const deltaY = Math.abs(touchEnd.y - touchStart.y);

      // Swipe threshold: 50px horizontal, max 100px vertical
      if (Math.abs(deltaX) > 50 && deltaY < 100) {
        if (deltaX > 0) {
          handlePrevious();
        } else {
          handleNext();
        }
      }
    }
    setTouchStart(null);
    setInitialPinchDistance(null);
  };

  // Mouse wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => {
      const newZoom = Math.max(0.5, Math.min(3, prev + delta));
      // Reset position when zoom out to 1x or below
      if (newZoom <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleDownload = async () => {
    const currentImage = images[currentIndex];
    try {
      const response = await fetch(currentImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image-${currentIndex + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-w-full h-[100dvh] sm:h-[90vh] flex flex-col p-3 sm:p-6 gap-3 sm:gap-4" ref={containerRef}>
        <DialogHeader className="pb-0">
          <DialogTitle className="text-base sm:text-lg">
            {title}
            <span className="text-xs sm:text-sm font-normal text-muted-foreground ml-2">
              ({currentIndex + 1}/{images.length})
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Image viewer */}
        <div 
          ref={imageViewerRef}
          className="flex-1 relative overflow-hidden bg-gray-100 rounded-lg touch-none"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          <div
            className="absolute inset-0 w-full h-full flex items-center justify-center p-2 sm:p-4"
            style={{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out'
            }}
          >
            <img
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain select-none"
              draggable={false}
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '100%',
                pointerEvents: 'none'
              }}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />

            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                <Spinner className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100 h-8 w-8 sm:h-10 sm:w-10"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100 h-8 w-8 sm:h-10 sm:w-10"
                onClick={handleNext}
              >
                <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
              </Button>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0 pt-3 sm:pt-4 border-t">
          <div className="flex items-center gap-1 sm:gap-2 justify-center sm:justify-start">
            <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 0.5} className="h-8 sm:h-9 px-2 sm:px-3">
              <ZoomOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <span className="text-xs sm:text-sm font-medium w-12 sm:w-16 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 3} className="h-8 sm:h-9 px-2 sm:px-3">
              <ZoomIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleRotate} title="Xoay ảnh 90°" className="h-8 sm:h-9 px-2 sm:px-3">
              <RotateCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleFullscreen} title="Toàn màn hình" className="hidden sm:inline-flex h-8 sm:h-9 px-2 sm:px-3">
              <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 justify-center sm:justify-end">
            <Button variant="outline" size="sm" onClick={handleDownload} className="flex-1 sm:flex-none h-8 sm:h-9">
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Tải xuống</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none h-8 sm:h-9">
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Đóng</span>
            </Button>
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto py-2 -mx-3 px-3 sm:mx-0 sm:px-0">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setZoom(1);
                  setRotation(0);
                  setPosition({ x: 0, y: 0 });
                  setIsImageLoading(true);
                }}
                className={`shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded border-2 overflow-hidden transition-all ${
                  idx === currentIndex ? 'border-primary ring-2 ring-primary/20' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

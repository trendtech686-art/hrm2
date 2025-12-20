/**
 * Chart Controls Component
 * Zoom, fit view, layout controls
 */

import * as React from 'react';
import { useReactFlow } from 'reactflow';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Save, 
  LayoutGrid, 
  ArrowLeftRight,
  Lock,
  Unlock
} from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Separator } from '../../../../../components/ui/separator';
import { toast } from 'sonner';
import type { LayoutDirection } from '../utils/layout-calculator';

interface ChartControlsProps {
  isLocked: boolean;
  onLockToggle: () => void;
  layoutDirection: LayoutDirection;
  onLayoutDirectionChange: (direction: LayoutDirection) => void;
  onAutoLayout: () => void;
  onSaveLayout: () => void;
}

export function ChartControls({
  isLocked,
  onLockToggle,
  layoutDirection,
  onLayoutDirectionChange,
  onAutoLayout,
  onSaveLayout
}: ChartControlsProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const handleFitView = () => {
    fitView({ duration: 200, padding: 0.2 });
  };

  const handleZoomIn = () => {
    zoomIn({ duration: 200 });
  };

  const handleZoomOut = () => {
    zoomOut({ duration: 200 });
  };

  const handleToggleDirection = () => {
    const newDirection = layoutDirection === 'TB' ? 'LR' : 'TB';
    onLayoutDirectionChange(newDirection);
    toast.success(`Đã chuyển sang chế độ ${newDirection === 'TB' ? 'dọc' : 'ngang'}`);
  };

  return (
    <div className="flex flex-col gap-2 p-2 rounded-lg bg-card/80 backdrop-blur-sm border shadow-md">
      {/* Hàng 1: Zoom & View Controls */}
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium text-muted-foreground mr-2">Xem:</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-10" 
          onClick={handleZoomOut}
          title="Thu nhỏ (Scroll xuống)"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-10" 
          onClick={handleFitView}
          title="Khung hình vừa"
        >
          <Maximize className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-10" 
          onClick={handleZoomIn}
          title="Phóng to (Scroll lên)"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Lock toggle */}
        <span className="text-xs font-medium text-muted-foreground mr-2">Chế độ:</span>
        <Button 
          variant={isLocked ? "secondary" : "default"} 
          size="sm"
          className="h-9 px-3"
          onClick={onLockToggle}
          title={isLocked ? 'Mở khóa để chỉnh sửa' : 'Khóa để xem'}
        >
          {isLocked ? <Lock className="mr-1.5 h-3.5 w-3.5" /> : <Unlock className="mr-1.5 h-3.5 w-3.5" />}
          <span className="text-xs">{isLocked ? 'Khóa' : 'Mở'}</span>
        </Button>
      </div>

      {/* Hàng 2: Layout Controls */}
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium text-muted-foreground mr-2">Bố cục:</span>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-9 px-3"
          onClick={onAutoLayout}
          title="Tự động sắp xếp lại"
          disabled={isLocked}
        >
          <LayoutGrid className="mr-1.5 h-3.5 w-3.5" />
          <span className="text-xs">Tự động</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="h-9 px-3"
          onClick={onSaveLayout}
          title="Lưu vị trí hiện tại"
          disabled={isLocked}
        >
          <Save className="mr-1.5 h-3.5 w-3.5" />
          <span className="text-xs">Lưu</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          className="h-9 px-3"
          onClick={handleToggleDirection}
          title={`Chuyển sang ${layoutDirection === 'TB' ? 'ngang' : 'dọc'}`}
        >
          <ArrowLeftRight className="mr-1.5 h-3.5 w-3.5" />
          <span className="text-xs">{layoutDirection === 'TB' ? 'Dọc' : 'Ngang'}</span>
        </Button>
      </div>
    </div>
  );
}

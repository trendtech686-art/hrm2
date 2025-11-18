import * as React from "react"
import { Settings2, Search, X, Pin, GripVertical } from "lucide-react"

import { Button } from "../ui/button.tsx"
import { Checkbox } from "../ui/checkbox.tsx"
import { Input } from "../ui/input.tsx"
import { Label } from "../ui/label.tsx"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog.tsx"
import { ScrollArea } from "../ui/scroll-area.tsx"
import { cn } from "../../lib/utils.ts"
import type { ColumnDef } from './types.ts'
import { Separator } from "../ui/separator.tsx"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface DataTableColumnCustomizerProps<TData> {
  children?: React.ReactNode;
  columns: ColumnDef<TData>[];
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  columnOrder: string[];
  setColumnOrder: React.Dispatch<React.SetStateAction<string[]>>;
  pinnedColumns: string[];
  setPinnedColumns: React.Dispatch<React.SetStateAction<string[]>>;
}

export function DataTableColumnCustomizer<TData>({
  children,
  columns,
  columnVisibility,
  setColumnVisibility,
  columnOrder,
  setColumnOrder,
  pinnedColumns,
  setPinnedColumns,
}: DataTableColumnCustomizerProps<TData>) {
  const [open, setOpen] = React.useState(false);

  // Local state for changes within the dialog
  const [localVisibility, setLocalVisibility] = React.useState<Record<string, boolean>>({});
  const [localOrder, setLocalOrder] = React.useState<string[]>([]);
  const [localPinned, setLocalPinned] = React.useState<string[]>([]);
  const [search, setSearch] = React.useState('');
  
  // @dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement to start drag (prevents accidental drags)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const allConfigurableColumns = React.useMemo(() => 
    columns.filter(c => c.id !== 'select' && c.id !== 'actions' && c.id !== 'control' && c.id !== 'expander'),
    [columns]
  );

  React.useEffect(() => {
    if (open) {
      // On open, sync local state with props
      // ✅ FIX: Đảm bảo TẤT CẢ columns có trong localVisibility (không bị undefined)
      const fullVisibility: Record<string, boolean> = {};
      allConfigurableColumns.forEach(col => {
        // Nếu columnVisibility có giá trị → dùng giá trị đó
        // Nếu không → mặc định false (ẩn)
        fullVisibility[col.id] = columnVisibility[col.id] ?? false;
      });
      
      setLocalVisibility(fullVisibility);
      setLocalPinned(pinnedColumns);
      
      const allIds = allConfigurableColumns.map(c => c.id);
      const currentOrder = columnOrder.filter(id => allIds.includes(id));
      const newIds = allIds.filter(id => !currentOrder.includes(id));
      setLocalOrder([...currentOrder, ...newIds]);

      setSearch('');
    }
  }, [open, columnVisibility, columnOrder, pinnedColumns, allConfigurableColumns]);


  const handleSave = () => {
    // ✅ FIX: Merge localVisibility với columnVisibility, giữ nguyên select & actions
    setColumnVisibility(prev => ({
      ...localVisibility,
      select: true,      // Luôn giữ select visible
      actions: true,     // Luôn giữ actions visible
    }));
    setColumnOrder(localOrder);
    setPinnedColumns(localPinned);
    setOpen(false);
  };
  
  const handleReset = () => {
    const defaultVisibleColumns = [
      'id', 'fullName', 'workEmail', 'phone', 'department', 
      'jobTitle', 'hireDate', 'employmentStatus'
    ];
    
    const initialVisibility: Record<string, boolean> = {};
    allConfigurableColumns.forEach(c => {
      initialVisibility[c.id] = defaultVisibleColumns.includes(c.id);
    });

    setLocalVisibility(initialVisibility);
    setLocalOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    setLocalPinned(['id']);
  }

  const toggleColumnVisibility = (colId: string, checked: boolean) => {
    setLocalVisibility(prev => ({ ...prev, [colId]: checked }));
  };
  
  const togglePin = (colId: string) => {
    setLocalPinned(prev => 
        prev.includes(colId) 
        ? prev.filter(id => id !== colId) 
        : [...prev, colId]
    );
  };

  const availableColumns = React.useMemo(() => 
    allConfigurableColumns.filter(c => !localVisibility[c.id] && ((c.meta as any)?.displayName ?? c.id).toLowerCase().includes(search.toLowerCase())),
    [allConfigurableColumns, localVisibility, search]
  );
  
  const { pinnedVisibleColumns, unpinnedVisibleColumns } = React.useMemo(() => {
    const visibleCols = localOrder
      .map(id => allConfigurableColumns.find(c => c.id === id))
      .filter((c): c is ColumnDef<TData> => !!c && localVisibility[c.id]);

    const pinned = visibleCols.filter(c => localPinned.includes(c.id));
    const unpinned = visibleCols.filter(c => !localPinned.includes(c.id));
    
    return { pinnedVisibleColumns: pinned, unpinnedVisibleColumns: unpinned };
  }, [localOrder, localPinned, localVisibility, allConfigurableColumns]);

  const groupedAvailableColumns = React.useMemo(() => {
    return availableColumns.reduce((groups, col) => {
        const groupName = (col.meta as any)?.group || 'Thông tin khác';
        if (!groups[groupName]) {
            groups[groupName] = [];
        }
        groups[groupName].push(col);
        return groups;
    }, {} as Record<string, ColumnDef<TData>[]>);
  }, [availableColumns]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Check if both are in same group (pinned or unpinned)
    const isActivePinned = localPinned.includes(activeId);
    const isOverPinned = localPinned.includes(overId);
    if (isActivePinned !== isOverPinned) return;

    setLocalOrder((items) => {
      const oldIndex = items.indexOf(activeId);
      const newIndex = items.indexOf(overId);
      
      if (oldIndex === -1 || newIndex === -1) return items;
      
      return arrayMove(items, oldIndex, newIndex);
    });
  };
  
  const SortableColumnItem = ({ col }: { col: ColumnDef<TData> }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: col.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "flex items-center p-2 rounded-md group",
          isDragging ? 'opacity-50' : 'hover:bg-muted/50'
        )}
      >
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="h-5 w-5 mr-2 text-muted-foreground" />
        </div>
        <span className="flex-grow text-sm">{ (col.meta as any)?.displayName ?? col.id }</span>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7"
          onClick={() => togglePin(col.id)}
        >
          <Pin className={cn("h-4 w-4", localPinned.includes(col.id) ? "text-primary fill-current" : "text-muted-foreground")} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => toggleColumnVisibility(col.id, false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Settings2 className="mr-2 h-4 w-4" />
            Điều chỉnh cột
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[75vh] flex flex-col" open={open}>
        <DialogHeader>
          <DialogTitle>Điều chỉnh cột hiển thị</DialogTitle>
          <DialogDescription>
            Chọn, sắp xếp và ghim các cột để tùy chỉnh giao diện bảng của bạn.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-6 flex-grow min-h-0">
            {/* Left Panel: Available Columns */}
            <div className="flex flex-col border rounded-lg flex-1 min-h-0">
                <div className="p-4 border-b">
                    <h3 className="font-semibold mb-2">Thêm cột hiển thị</h3>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm cột..."
                            className="w-full pl-8 h-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <ScrollArea className="flex-grow p-4">
                    <div className="space-y-4">
                        {Object.keys(groupedAvailableColumns).map((groupName) => {
                            const cols = groupedAvailableColumns[groupName];
                            if (!Array.isArray(cols) || cols.length === 0) return null;
                            return (
                                <div key={groupName}>
                                    <h4 className="text-sm font-semibold mb-2 text-muted-foreground">{groupName}</h4>
                                    <div className="space-y-2">
                                    {cols.map(col => (
                                        <div key={col.id} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={`add-${col.id}`}
                                                checked={localVisibility[col.id] || false}
                                                onCheckedChange={(checked) => toggleColumnVisibility(col.id, !!checked)}
                                            />
                                            <Label htmlFor={`add-${col.id}`} className="font-normal text-sm">{ (col.meta as any)?.displayName ?? col.id }</Label>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            )
                        })}
                         {availableColumns.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">Không có cột nào.</p>
                        )}
                    </div>
                </ScrollArea>
            </div>
            {/* Right Panel: Visible Columns */}
            <div className="flex flex-col border rounded-lg flex-1 min-h-0">
                 <div className="p-4 border-b">
                    <h3 className="font-semibold">Cột hiển thị</h3>
                 </div>
                 <ScrollArea className="flex-grow p-2">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="space-y-1">
                        {/* Pinned columns - sortable among themselves */}
                        {pinnedVisibleColumns.length > 0 && (
                          <SortableContext
                            items={pinnedVisibleColumns.map(c => c.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {pinnedVisibleColumns.map((col) => (
                              <SortableColumnItem key={col.id} col={col} />
                            ))}
                          </SortableContext>
                        )}
                        
                        {pinnedVisibleColumns.length > 0 && unpinnedVisibleColumns.length > 0 && (
                            <div className="relative my-2 mx-2">
                                <Separator />
                                <span className="absolute left-1/2 -translate-x-1/2 -top-2 text-xs bg-popover px-2 text-muted-foreground">Ghim</span>
                            </div>
                        )}
                        
                        {/* Unpinned columns - sortable among themselves */}
                        {unpinnedVisibleColumns.length > 0 && (
                          <SortableContext
                            items={unpinnedVisibleColumns.map(c => c.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {unpinnedVisibleColumns.map((col) => (
                              <SortableColumnItem key={col.id} col={col} />
                            ))}
                          </SortableContext>
                        )}
                        
                        {(pinnedVisibleColumns.length + unpinnedVisibleColumns.length) === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">Không có cột nào được hiển thị.</p>
                        )}
                      </div>
                    </DndContext>
                 </ScrollArea>
            </div>
        </div>
        <DialogFooter className="pt-6 mt-auto flex-shrink-0">
          <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
            Quay về mặc định
          </Button>
          <div className="flex-grow" />
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
            Thoát
          </Button>
          <Button type="button" size="sm" onClick={handleSave}>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

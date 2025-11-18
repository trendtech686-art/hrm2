import * as React from 'react';
import { Handle, Position, type NodeProps, NodeResizer } from 'reactflow';
import { cn } from '../../../../../lib/utils.ts';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../components/ui/avatar.tsx';
import type { Employee } from '../../../../employees/types.ts';
import { Button } from '../../../../../components/ui/button.tsx';
import { Plus, Minus, Mail, Phone, Users, Focus, User, Copy, Check, GripVertical, XCircle } from 'lucide-react';
import { Badge } from '../../../../../components/ui/badge.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../../components/ui/tooltip.tsx';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '../../../../../components/ui/context-menu.tsx';

const getInitials = (name: string) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length === 1) return name.substring(0, 2).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1][0];
    const secondLastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 2][0] : nameParts[0][0];
    return (secondLastInitial + lastInitial).toUpperCase();
};

type EmployeeNodeData = Partial<Employee> & { 
    systemId: string, 
    fullName: string, 
    jobTitle: string,
    childrenCount: number;
    isCollapsed: boolean;
    onToggle: () => void;
    totalHeadcount?: number;
    navigate: (path: string) => void;
    onFocus: (nodeId: string) => void;
    departmentFilter?: string;
    isInteractive: boolean;
};

const HeadcountBadge = ({ count }: { count: number }) => (
    <TooltipProvider delayDuration={100}>
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {count}
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>Tổng số nhân sự quản lý: {count}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);


export function EmployeeNode({ data, selected }: NodeProps<EmployeeNodeData>) {
    const isRoot = data.systemId === 'root';
    const [copiedItem, setCopiedItem] = React.useState<null | 'email' | 'phone'>(null);

    const handleCopy = (text: string, type: 'email' | 'phone') => {
        navigator.clipboard.writeText(text);
        setCopiedItem(type);
        setTimeout(() => setCopiedItem(null), 1500);
    };

    const roleStyle = React.useMemo(() => {
        if (isRoot) return 'border-primary bg-primary/5';
        if (data.jobTitle?.includes('Giám đốc')) return 'border-blue-500 bg-blue-500/5';
        if (data.jobTitle?.includes('Trưởng')) return 'border-amber-500 bg-amber-500/5';
        return 'bg-card';
    }, [data.jobTitle, isRoot]);

    const isHighlighted = data.departmentFilter && data.departmentFilter !== 'all' && data.department === data.departmentFilter;

    const nodeContent = (
        <div
            className={cn(
                "group relative flex items-center p-3 rounded-lg border text-card-foreground shadow-sm w-64 transition-all",
                !isRoot && "cursor-pointer hover:shadow-md",
                selected && "ring-2 ring-primary ring-offset-2 shadow-lg",
                isHighlighted && "ring-2 ring-offset-2 ring-green-500 shadow-lg",
                roleStyle
            )}
        >
            {/* Drag Handle - Sử dụng drag-handle class của ReactFlow */}
            {data.isInteractive && !isRoot && (
                 <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div 
                                className="drag-handle absolute -left-3 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing opacity-50 group-hover:opacity-100 transition-opacity z-20"
                                onMouseDown={(e) => {
                                    // Prevent event bubbling to allow drag
                                    e.stopPropagation();
                                }}
                            >
                                <div className="bg-background border rounded p-1 shadow-sm">
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <p>Kéo để di chuyển vị trí</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}

            <Avatar className="w-14 h-14 mr-4">
                {data.avatarUrl && <AvatarImage src={data.avatarUrl} alt={data.fullName} />}
                <AvatarFallback className={cn("text-lg", isRoot && "bg-primary text-primary-foreground font-bold")}>
                    {getInitials(data.fullName)}
                </AvatarFallback>
            </Avatar>
            <div className="flex-grow min-w-0">
                <p className="font-semibold text-sm truncate">{data.fullName}</p>
                <p className={cn("text-xs truncate", "text-muted-foreground")}>{data.jobTitle}</p>
            </div>

            {data.totalHeadcount && data.totalHeadcount > 0 && <HeadcountBadge count={data.totalHeadcount} />}
            
            {/* Collapse/Expand button */}
            {data.childrenCount > 0 && (
                <div 
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                    onMouseDown={(e) => {
                        // Prevent drag when clicking collapse button
                        e.stopPropagation();
                    }}
                >
                    <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-6 w-6 rounded-full bg-background shadow-md hover:shadow-lg transition-all" 
                        onClick={(e) => {
                            e.stopPropagation();
                            data.onToggle();
                        }}
                    >
                        {data.isCollapsed ? <Plus className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    </Button>
                    {data.isCollapsed && (
                        <Badge variant="secondary" className="shadow-sm">+{data.childrenCount}</Badge>
                    )}
                </div>
            )}
        </div>
    );
    
    if (isRoot) {
        return (
             <>
                <Handle type="target" position={Position.Top} className="opacity-0" />
                {nodeContent}
                <Handle type="source" position={Position.Bottom} className="opacity-0" />
            </>
        )
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <div>
                    <Handle type="target" position={Position.Top} className="opacity-0" />
                    {nodeContent}
                    <Handle type="source" position={Position.Bottom} className="opacity-0" />
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
                <ContextMenuItem onSelect={() => data.navigate(`/employees/${data.systemId}`)}>
                    <User className="mr-2 h-4 w-4" /> Xem chi tiết hồ sơ
                </ContextMenuItem>
                <ContextMenuItem onSelect={() => data.onFocus(data.systemId!)}>
                    <Focus className="mr-2 h-4 w-4" /> Tập trung
                </ContextMenuItem>
                {data.childrenCount > 0 && (
                    <ContextMenuItem onSelect={data.onToggle}>
                        {data.isCollapsed ? 'Hiện' : 'Ẩn'} cấp dưới
                    </ContextMenuItem>
                )}
                <ContextMenuSeparator />
                <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="flex-grow truncate">{data.workEmail}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={(e) => { e.stopPropagation(); handleCopy(data.workEmail!, 'email'); }}>
                        {copiedItem === 'email' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                </div>
                <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="flex-grow truncate">{data.phone}</span>
                     <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={(e) => { e.stopPropagation(); handleCopy(data.phone!, 'phone'); }}>
                        {copiedItem === 'phone' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                </div>
            </ContextMenuContent>
        </ContextMenu>
    );
};

export { EmployeeNode as CustomEmployeeNode };

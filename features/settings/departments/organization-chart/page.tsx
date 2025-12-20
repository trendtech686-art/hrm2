/**
 * Organization Chart Page - Refactored
 * Clean, modular, performant
 */

import * as React from 'react';
import ReactFlow, {
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Panel,
  ConnectionMode,
} from 'reactflow';
import { useNavigate } from '@/lib/next-compat';
import { Mouse, GripVertical, Download } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { SettingsActionButton } from '../../../../components/settings/SettingsActionButton';
import { Kbd } from '../../../../components/ui/kbd';
import { useSettingsPageHeader } from '../../use-settings-page-header';
import { CustomEmployeeNode } from './components/chart-node';
import { ChartSearch } from './components/chart-search';
import { ChartControls } from './components/chart-controls';
import { useOrgChart } from './hooks/use-org-chart';
import { calculateLayout } from './utils/layout-calculator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../../../../components/ui/dropdown-menu';
import { toast } from 'sonner';
import { 
  exportAsPNG, 
  exportAsSVG, 
  exportAsPDF,
  exportAsJSON 
} from './utils/export-helpers';

const nodeTypes = {
  employeeNode: CustomEmployeeNode,
};

function OrgChartFlow() {
  const navigate = useNavigate();
  const {
    employees,
    departments,
    collapsedNodes,
    pendingChanges,
    layoutDirection,
    isLocked,
    departmentFilter,
    focusNodeId,
    forceAutoLayout,
    setLayoutDirection,
    setIsLocked,
    setDepartmentFilter,
    setFocusNodeId,
    setForceAutoLayout,
    toggleNode,
    handleFocusNode,
    handleNodeDragStop,
    handleSaveChanges,
    handleCancelChanges,
    handleSaveLayout,
    handleAutoLayout,
    handleSearchAndFocus,
  } = useOrgChart();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const isInteractive = !isLocked;

  // Calculate and update layout
  React.useLayoutEffect(() => {
    if (employees.length === 0) return;

    const layout = calculateLayout(
      employees,
      collapsedNodes,
      pendingChanges,
      { 
        direction: layoutDirection,
        nodeSpacing: 120,  // Khoảng cách ngang tốt cho cây phân nhánh
        rankSpacing: 150   // Khoảng cách dọc giữa các tầng
      }
    );

    // Add callbacks to node data
    const nodesWithCallbacks = layout.nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onToggle: () => toggleNode(node.id),
        navigate,
        onFocus: handleFocusNode,
        departmentFilter,
        isInteractive,
      }
    }));

    // Apply focus filter if needed
    let finalNodes = nodesWithCallbacks;
    let finalEdges = layout.edges;

    if (focusNodeId) {
      const visibleIds = new Set<string>();
      const parentId = layout.parentIdMap.get(focusNodeId);
      
      visibleIds.add(focusNodeId);
      
      if (parentId && parentId !== 'root') {
        visibleIds.add(parentId);
        const siblings = layout.childMap.get(parentId) || [];
        siblings.forEach(id => visibleIds.add(id));
      } else if (parentId === 'root') {
        const topLevelNodes = layout.childMap.get('root') || [];
        topLevelNodes.forEach(id => visibleIds.add(id));
        visibleIds.add('root');
      }
      
      const children = layout.childMap.get(focusNodeId) || [];
      children.forEach(id => visibleIds.add(id));
      
      finalNodes = nodesWithCallbacks.filter(n => visibleIds.has(n.id));
      finalEdges = layout.edges.filter(e => 
        visibleIds.has(e.source) && visibleIds.has(e.target)
      );
    }

    setNodes(finalNodes);
    setEdges(finalEdges);

    // Auto-fit on force layout
    if (forceAutoLayout) {
      setForceAutoLayout(false);
      setTimeout(() => {
        const { fitView } = (window as any).__reactFlowInstance || {};
        if (fitView) fitView({ duration: 200, padding: 0.2 });
      }, 100);
    }
  }, [
    employees,
    collapsedNodes,
    pendingChanges,
    layoutDirection,
    focusNodeId,
    departmentFilter,
    isInteractive,
    forceAutoLayout,
    setNodes,
    setEdges,
    setForceAutoLayout,
    toggleNode,
    navigate,
    handleFocusNode,
  ]);

  // Export data for JSON export
  const exportData = React.useMemo(() => ({
    employees: employees.filter(e => e.employmentStatus === 'Đang làm việc'),
    structure: nodes.map(n => ({
      id: n.id,
      name: n.data.fullName,
      jobTitle: n.data.jobTitle,
      department: n.data.department,
      managerId: n.data.managerId,
    })),
    metadata: {
      exportDate: new Date().toISOString(),
      totalEmployees: employees.filter(e => e.employmentStatus === 'Đang làm việc').length,
      departments: departments.length,
    }
  }), [employees, departments, nodes]);

  return (
    <div className="h-[calc(100vh-9rem)] relative flex flex-col">
      {/* Fixed Toolbar */}
      <div className="flex-shrink-0 bg-background border-b p-2 flex items-center justify-between gap-2 flex-wrap">
        {/* Left: Search & Filter */}
        <div className="flex-1 min-w-[200px] max-w-md">
          <ChartSearch
            employees={employees}
            departments={departments}
            departmentFilter={departmentFilter}
            onDepartmentFilterChange={setDepartmentFilter}
            onEmployeeSelect={handleSearchAndFocus}
          />
        </div>
        
        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          <ChartControls
            isLocked={isLocked}
            onLockToggle={() => setIsLocked(!isLocked)}
            layoutDirection={layoutDirection}
            onLayoutDirectionChange={setLayoutDirection}
            onAutoLayout={handleAutoLayout}
            onSaveLayout={handleSaveLayout}
          />
        </div>
      </div>

      {/* ReactFlow Canvas */}
      <div className="flex-1 relative">
        <style>
          {`
            .react-flow__node {
              transition: transform 0s ease, width 0s ease, height 0s ease;
            }
            .react-flow__handle {
              width: 100%;
              height: 100%;
              border-radius: 0;
              transform: none;
              border: none;
              background: transparent;
              pointer-events: none;
            }
            /* Drag handle styling */
            .drag-handle {
              cursor: grab !important;
            }
            .drag-handle:active {
              cursor: grabbing !important;
            }
            /* Prevent text selection during drag */
            .react-flow__node.dragging * {
              user-select: none;
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
            }
            /* Always allow node dragging via drag-handle */
            .react-flow__node.draggable {
              cursor: default;
            }
          `}
        </style>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={handleNodeDragStop}
          nodeTypes={nodeTypes}
          fitView
          className="bg-background"
          panOnDrag={[1, 2]}
          selectionOnDrag={false}
          panOnScroll
          zoomOnDoubleClick={false}
          nodesDraggable={!isLocked}
          nodesConnectable={false}
          elementsSelectable={true}
          minZoom={0.1}
          maxZoom={4}
          connectionMode={ConnectionMode.Loose}
          deleteKeyCode={null}
          nodeDragThreshold={1}
          onInit={(instance) => {
            // Store instance for export
            (window as any).__reactFlowInstance = instance;
          }}
        >
          <Background gap={16} />
          <MiniMap 
            nodeStrokeWidth={3} 
            zoomable 
            pannable 
            className="bg-background border rounded-lg shadow-sm"
          />

          {/* Bottom-left: Instructions */}
          <Panel position="bottom-left" className="p-3 max-w-xs text-xs text-muted-foreground bg-card/95 backdrop-blur-sm border rounded-lg shadow-lg space-y-2">
            <div className="font-semibold text-foreground mb-1.5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse"></span>
              Hướng dẫn sử dụng
            </div>
            <div className="flex items-center gap-2">
              <Kbd>Alt</Kbd> + <Mouse className="h-4 w-4" /> Di chuyển toàn bộ sơ đồ
            </div>
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4" /> Kéo để di chuyển vị trí node
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center h-4 w-4 border rounded-full text-[10px]">+/−</span>
              Thu gọn/Mở rộng nhân viên cấp dưới
            </div>
            <div className="flex items-center gap-2 pt-1 border-t">
              <span className="text-[10px] font-medium">💡 Mẹo:</span>
              <span>Nhấn vào node để xem menu</span>
            </div>
          </Panel>

          {/* Pending Changes Notification */}
          {Object.keys(pendingChanges).length > 0 && (
            <Panel position="top-center" className="animate-in slide-in-from-top">
              <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Có {Object.keys(pendingChanges).length} thay đổi chưa lưu</span>
                </div>
                <div className="flex items-center gap-2 border-l pl-3">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="h-7"
                    onClick={handleSaveChanges}
                  >
                    Lưu thay đổi
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-7 text-white hover:bg-white/20"
                    onClick={handleCancelChanges}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            </Panel>
          )}

          {/* Focus Mode Notification */}
          {focusNodeId && (
            <Panel position="top-right" className="animate-in slide-in-from-right">
              <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
                <span className="font-medium">Chế độ tập trung</span>
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="h-7"
                  onClick={() => setFocusNodeId(null)}
                >
                  Thoát
                </Button>
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>
    </div>
  );
}

export function OrganizationChartPage() {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExportFromHeader = React.useCallback(async (type: 'png' | 'svg' | 'pdf' | 'json') => {
    setIsExporting(true);
    const loadingToast = toast.loading(`Đang xuất ${type.toUpperCase()}...`);

    try {
      let result;

      switch (type) {
        case 'png':
          result = await exportAsPNG();
          break;
        case 'svg':
          result = await exportAsSVG();
          break;
        case 'pdf':
          result = await exportAsPDF();
          break;
        case 'json': {
          const exportData = {
            metadata: {
              exportDate: new Date().toISOString(),
              title: 'Sơ đồ tổ chức'
            }
          };
          result = exportAsJSON(exportData);
          break;
        }
        default:
          result = { success: false };
      }

      if (result.success) {
        toast.success(`Đã xuất ${type.toUpperCase()} thành công!`, { id: loadingToast });
      } else {
        toast.error(`Lỗi khi xuất ${type.toUpperCase()}`, { id: loadingToast });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Có lỗi xảy ra khi xuất file', { id: loadingToast });
    } finally {
      setIsExporting(false);
    }
  }, [setIsExporting]);

  const exportAction = React.useMemo(() => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SettingsActionButton variant="outline" disabled={isExporting}>
          <Download className="h-4 w-4" />
          Xuất file
        </SettingsActionButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExportFromHeader('png')}>
          Xuất PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExportFromHeader('svg')}>
          Xuất SVG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExportFromHeader('pdf')}>
          Xuất PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExportFromHeader('json')}>
          Xuất dữ liệu (JSON)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ), [handleExportFromHeader, isExporting]);

  useSettingsPageHeader({
    title: 'Sơ đồ tổ chức',
    breadcrumb: [
      { label: 'Phòng ban', href: '/departments', isCurrent: false },
      { label: 'Sơ đồ tổ chức', href: '/organization-chart', isCurrent: true }
    ],
    actions: [exportAction]
  });

  return (
    <ReactFlowProvider>
      <OrgChartFlow />
    </ReactFlowProvider>
  );
}

/**
 * Main hook for org chart logic
 * Manages all chart state and interactions
 */

import * as React from 'react';
import { useReactFlow, type Node } from 'reactflow';
import { useEmployeeStore } from '../../../../employees/store';
import { useDepartmentStore } from '../../store';
import { toast } from 'sonner';
import { asSystemId } from '@/lib/id-types';
import { 
  calculateLayout, 
  resetToAutoLayout,
  type LayoutDirection,
  nodeWidth,
  nodeHeight
} from '../utils/layout-calculator';
import { 
  getAllAncestors, 
  wouldCreateCycle 
} from '../utils/hierarchy-helpers';

export function useOrgChart() {
  const { data: employees, update: updateEmployee } = useEmployeeStore();
  const { data: departments } = useDepartmentStore();
  const { fitView, setCenter, setNodes: setReactFlowNodes, getNodes } = useReactFlow();

  // State
  const [collapsedNodes, setCollapsedNodes] = React.useState(new Set<string>());
  const [pendingChanges, setPendingChanges] = React.useState<Record<string, string | undefined>>({});
  const [layoutDirection, setLayoutDirection] = React.useState<LayoutDirection>('TB');
  const [isLocked, setIsLocked] = React.useState(false);
  const [departmentFilter, setDepartmentFilter] = React.useState('all');
  const [focusNodeId, setFocusNodeId] = React.useState<string | null>(null);
  const [forceAutoLayout, setForceAutoLayout] = React.useState(
    !employees.some(e => e.positionX !== undefined && e.positionY !== undefined)
  );

  // Callbacks
  const toggleNode = React.useCallback((nodeId: string) => {
    setCollapsedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const handleFocusNode = React.useCallback((nodeId: string) => {
    setFocusNodeId(nodeId);
  }, []);

  const handleNodeDragStop = React.useCallback(
    (event: React.MouseEvent, draggedNode: Node) => {
      if (isLocked) return;

      const nodes = getNodes();
      const targetNode = nodes.find((n) => {
        if (n.id === draggedNode.id) return false;

        const draggedNodeCenter = {
          x: draggedNode.position.x + (draggedNode.width ?? nodeWidth) / 2,
          y: draggedNode.position.y + (draggedNode.height ?? nodeHeight) / 2,
        };

        const isOverlapping =
          draggedNodeCenter.x > n.position.x &&
          draggedNodeCenter.x < n.position.x + (n.width ?? nodeWidth) &&
          draggedNodeCenter.y > n.position.y &&
          draggedNodeCenter.y < n.position.y + (n.height ?? nodeHeight);

        return isOverlapping;
      });

      if (targetNode) {
        if (targetNode.id.startsWith('POS') || targetNode.id.startsWith('VIRTUAL')) {
          return;
        }

        // Check for cycle
        const layout = calculateLayout(
          employees,
          collapsedNodes,
          pendingChanges,
          { direction: layoutDirection }
        );

        if (wouldCreateCycle(draggedNode.id, targetNode.id, layout.childMap)) {
          toast.error('Không thể tạo vòng lặp trong cấu trúc tổ chức');
          return;
        }

        setPendingChanges(prev => ({
          ...prev,
          [draggedNode.id]: targetNode.id,
        }));

        toast.info(`Đã thay đổi quản lý của ${draggedNode.data.fullName}`);
      }
    },
    [isLocked, getNodes, employees, collapsedNodes, pendingChanges, layoutDirection]
  );

  const handleSaveChanges = React.useCallback(() => {
    Object.entries(pendingChanges).forEach(([employeeId, managerId]) => {
      if (employeeId.startsWith('NV')) {
        const employee = employees.find(e => e.systemId === employeeId);
        if (employee) {
          updateEmployee(asSystemId(employeeId), { 
            ...employee, 
            managerId: managerId ? asSystemId(managerId) : undefined,
          });
        }
      }
    });
    setPendingChanges({});
    toast.success('Đã lưu thay đổi quan hệ quản lý');
  }, [pendingChanges, employees, updateEmployee]);

  const handleCancelChanges = React.useCallback(() => {
    setPendingChanges({});
    toast.info('Đã hủy thay đổi');
  }, []);

  const handleSaveLayout = React.useCallback(() => {
    const currentNodes = getNodes();
    currentNodes.forEach(node => {
      if (node.id.startsWith('NV')) {
        const employee = employees.find(e => e.systemId === node.id);
        if (employee) {
          updateEmployee(node.id as any, {
            ...employee,
            positionX: node.position.x,
            positionY: node.position.y,
          });
        }
      }
    });
    toast.success('Đã lưu bố cục sơ đồ');
  }, [getNodes, employees, updateEmployee]);

  const handleAutoLayout = React.useCallback(() => {
    setForceAutoLayout(true);
    toast.info('Đang tự động sắp xếp lại...');
  }, []);

  const handleSearchAndFocus = React.useCallback((employee: any) => {
    const layout = calculateLayout(
      employees,
      collapsedNodes,
      pendingChanges,
      { direction: layoutDirection }
    );

    // Uncollapse ancestors
    const ancestors = getAllAncestors(employee.systemId, layout.parentIdMap);
    setCollapsedNodes(prev => {
      const newSet = new Set(prev);
      let changed = false;
      [...ancestors, 'root'].forEach(id => {
        if (newSet.has(id)) {
          newSet.delete(id);
          changed = true;
        }
      });
      return changed ? newSet : prev;
    });

    // Focus after uncollapse
    setTimeout(() => {
      const node = getNodes().find(n => n.id === employee.systemId);
      if (node) {
        setCenter(
          node.position.x + (node.width ?? nodeWidth) / 2,
          node.position.y + (node.height ?? nodeHeight) / 2,
          { zoom: 1.2, duration: 200 }
        );
        setReactFlowNodes(nds =>
          nds.map(n => ({
            ...n,
            selected: n.id === employee.systemId,
          }))
        );
      }
    }, 50);
  }, [employees, collapsedNodes, pendingChanges, layoutDirection, getNodes, setCenter, setReactFlowNodes]);

  return {
    // Data
    employees,
    departments,
    
    // State
    collapsedNodes,
    pendingChanges,
    layoutDirection,
    isLocked,
    departmentFilter,
    focusNodeId,
    forceAutoLayout,
    
    // Setters
    setLayoutDirection,
    setIsLocked,
    setDepartmentFilter,
    setFocusNodeId,
    setForceAutoLayout,
    
    // Callbacks
    toggleNode,
    handleFocusNode,
    handleNodeDragStop,
    handleSaveChanges,
    handleCancelChanges,
    handleSaveLayout,
    handleAutoLayout,
    handleSearchAndFocus,
  };
}

/**
 * Layout Calculator using Dagre
 * Tính toán vị trí nodes cho org chart
 */

import dagre from 'dagre';
import type { Node, Edge } from 'reactflow';
import type { Employee } from '../../../../employees/types';
import { buildHierarchyMaps, countAllDescendants, getAllDescendants } from './hierarchy-helpers';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export const nodeWidth = 256;
export const nodeHeight = 88;

export type LayoutDirection = 'TB' | 'LR';

export interface LayoutOptions {
  direction: LayoutDirection;
  nodeSpacing?: number;
  rankSpacing?: number;
}

const DEFAULT_OPTIONS = {
  direction: 'TB' as LayoutDirection,
  nodeSpacing: 120,  // Tăng khoảng cách ngang giữa các nodes (nhánh cây)
  rankSpacing: 150   // Tăng khoảng cách dọc giữa các tầng
};

/**
 * Calculate layout positions for all nodes
 */
export function calculateLayout(
  employees: Employee[],
  collapsedNodes: Set<string>,
  pendingChanges: Record<string, string | undefined>,
  options: Partial<LayoutOptions> = {}
): {
  nodes: Node[];
  edges: Edge[];
  parentIdMap: Map<string, string>;
  childMap: Map<string, string[]>;
} {
  const { direction, nodeSpacing, rankSpacing } = { ...DEFAULT_OPTIONS, ...options };
  
  dagreGraph.setGraph({ 
    rankdir: direction,
    nodesep: nodeSpacing,
    ranksep: rankSpacing,
    ranker: 'tight-tree',  // Sử dụng thuật toán tight-tree cho cây rõ ràng hơn
    align: 'UL',           // Căn chỉnh từ trên xuống, trái sang phải
    acyclicer: 'greedy'    // Xử lý chu trình nếu có
  });

  const activeEmployees = employees.filter(emp => emp.employmentStatus === 'Đang làm việc');
  const { parentIdMap, childMap } = buildHierarchyMaps(activeEmployees, pendingChanges);

  // Create all nodes
  const allNodes = createNodes(activeEmployees, childMap, parentIdMap, collapsedNodes);
  
  // Create all edges
  const allEdges = createEdges(parentIdMap, pendingChanges);

  // Filter hidden nodes based on collapsed state
  const hiddenNodeIds = getHiddenNodeIds(collapsedNodes, childMap);
  const visibleNodes = allNodes.filter(n => !hiddenNodeIds.has(n.id));
  const visibleEdges = allEdges.filter(e => 
    !hiddenNodeIds.has(e.source) && !hiddenNodeIds.has(e.target)
  );

  // Apply dagre layout
  applyDagreLayout(visibleNodes, visibleEdges, activeEmployees);

  return {
    nodes: allNodes,
    edges: allEdges,
    parentIdMap,
    childMap
  };
}

/**
 * Create nodes from employees
 */
function createNodes(
  employees: Employee[],
  childMap: Map<string, string[]>,
  parentIdMap: Map<string, string>,
  collapsedNodes: Set<string>
): Node[] {
  const nodes: Node[] = [
    {
      id: 'root',
      type: 'employeeNode',
      data: {
        fullName: 'Ban Giám đốc',
        jobTitle: 'Lãnh đạo công ty',
        systemId: 'root',
        childrenCount: childMap.get('root')?.length || 0,
        totalHeadcount: countAllDescendants('root', childMap, employees),
        isCollapsed: collapsedNodes.has('root'),
      },
      position: { x: 0, y: 0 },
      deletable: false,
    }
  ];

  employees.forEach(employee => {
    nodes.push({
      id: employee.systemId,
      type: 'employeeNode',
      data: {
        ...employee,
        childrenCount: childMap.get(employee.systemId)?.length || 0,
        totalHeadcount: countAllDescendants(employee.systemId, childMap, employees),
        isCollapsed: collapsedNodes.has(employee.systemId),
      },
      position: { x: 0, y: 0 },
    });
  });

  return nodes;
}

/**
 * Create edges from parent-child relationships
 */
function createEdges(
  parentIdMap: Map<string, string>,
  pendingChanges: Record<string, string | undefined>
): Edge[] {
  const edges: Edge[] = [];

  parentIdMap.forEach((parentId, childId) => {
    const isPending = pendingChanges.hasOwnProperty(childId);
    edges.push({
      id: `e-${parentId}-${childId}`,
      source: parentId,
      target: childId,
      type: 'smoothstep',  // Sử dụng smoothstep cho góc cạnh rõ hơn
      animated: isPending,
      style: isPending 
        ? { 
            strokeDasharray: '5,5', 
            stroke: '#007bff',
            strokeWidth: 2 
          } 
        : { 
            stroke: '#94a3b8',    // Màu xám nhạt cho edge bình thường
            strokeWidth: 2        // Độ dày đường nối
          },
      markerEnd: {
        type: 'arrowclosed' as any,
        width: 20,
        height: 20,
        color: isPending ? '#007bff' : '#94a3b8'
      },
    });
  });

  return edges;
}

/**
 * Get IDs of nodes that should be hidden due to collapse
 */
function getHiddenNodeIds(
  collapsedNodes: Set<string>,
  childMap: Map<string, string[]>
): Set<string> {
  const hiddenNodeIds = new Set<string>();

  collapsedNodes.forEach(collapsedNodeId => {
    const descendants = getAllDescendants(collapsedNodeId, childMap);
    descendants.forEach(id => hiddenNodeIds.add(id));
  });

  return hiddenNodeIds;
}

/**
 * Apply dagre layout algorithm
 */
function applyDagreLayout(
  nodes: Node[],
  edges: Edge[],
  employees: Employee[]
) {
  // Add nodes to dagre graph
  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges to dagre graph
  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Apply calculated positions
  nodes.forEach(node => {
    const employeeData = employees.find(e => e.systemId === node.id);
    const nodeWithPosition = dagreGraph.node(node.id);

    // Use saved position if exists, otherwise use calculated position
    if (employeeData && 
        employeeData.positionX !== undefined && 
        employeeData.positionY !== undefined) {
      node.position = {
        x: employeeData.positionX,
        y: employeeData.positionY,
      };
    } else if (nodeWithPosition) {
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    }
  });
}

/**
 * Reset layout to auto-calculated positions
 */
export function resetToAutoLayout(
  nodes: Node[],
  edges: Edge[]
): Node[] {
  // Clear dagre graph
  dagreGraph.nodes().forEach(id => dagreGraph.removeNode(id));

  // Re-add nodes
  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Re-add edges
  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Recalculate
  dagre.layout(dagreGraph);

  // Apply new positions
  return nodes.map(node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    if (nodeWithPosition) {
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        }
      };
    }
    return node;
  });
}

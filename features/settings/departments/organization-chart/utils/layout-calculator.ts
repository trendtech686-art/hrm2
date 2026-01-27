/**
 * Layout Calculator using Dagre
 * Tính toán vị trí nodes cho org chart
 */

import dagre from 'dagre';
import { MarkerType, type Node, type Edge } from 'reactflow';
import type { Employee } from '../../../../employees/types';
import { buildHierarchyMaps, countAllDescendants, getAllDescendants } from './hierarchy-helpers';

export const nodeWidth = 256;
export const nodeHeight = 88;

/**
 * Create a fresh dagre graph instance
 */
function createDagreGraph() {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  return graph;
}

export type LayoutDirection = 'TB' | 'LR';

export interface LayoutOptions {
  direction: LayoutDirection;
  nodeSpacing?: number;
  rankSpacing?: number;
  ignoreSavedPositions?: boolean;  // Force auto-layout, ignore saved positions
}

const DEFAULT_OPTIONS = {
  direction: 'TB' as LayoutDirection,
  nodeSpacing: 120,  // Tăng khoảng cách ngang giữa các nodes (nhánh cây)
  rankSpacing: 150,  // Tăng khoảng cách dọc giữa các tầng
  ignoreSavedPositions: true  // Default to auto-layout for consistent display
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
  const { direction, nodeSpacing, rankSpacing, ignoreSavedPositions } = { ...DEFAULT_OPTIONS, ...options };
  
  // Create fresh graph instance for each calculation
  const dagreGraph = createDagreGraph();
  
  dagreGraph.setGraph({ 
    rankdir: direction,
    nodesep: nodeSpacing,
    ranksep: rankSpacing,
    ranker: 'tight-tree',  // Sử dụng thuật toán tight-tree cho cây rõ ràng hơn
    align: 'UL',           // Căn chỉnh từ trên xuống, trái sang phải
    acyclicer: 'greedy'    // Xử lý chu trình nếu có
  });

  // Filter active employees - handle both Vietnamese text and enum values
  const activeEmployees = employees.filter(emp => {
    const status = String(emp.employmentStatus || '').toUpperCase();
    return status === 'ĐANG LÀM VIỆC' || status === 'ACTIVE' || status === '';
  });
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
  applyDagreLayout(dagreGraph, visibleNodes, visibleEdges, activeEmployees, ignoreSavedPositions);

  return {
    // Only return visible nodes/edges so ReactFlow doesn't try to render hidden descendants at (0,0)
    nodes: visibleNodes,
    edges: visibleEdges,
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
    const isPending = Object.hasOwn(pendingChanges, childId);
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
        type: MarkerType.ArrowClosed,
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
  dagreGraph: dagre.graphlib.Graph,
  nodes: Node[],
  edges: Edge[],
  employees: Employee[],
  ignoreSavedPositions: boolean = true
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
    const nodeWithPosition = dagreGraph.node(node.id);

    if (!ignoreSavedPositions) {
      // Check for saved positions only if not ignoring them
      const employeeData = employees.find(e => e.systemId === node.id);
      const hasSavedPosition = employeeData && 
          typeof employeeData.positionX === 'number' && 
          typeof employeeData.positionY === 'number' &&
          (employeeData.positionX !== 0 || employeeData.positionY !== 0);

      if (hasSavedPosition) {
        node.position = {
          x: employeeData.positionX!,
          y: employeeData.positionY!,
        };
        return;
      }
    }

    // Use dagre calculated position
    if (nodeWithPosition) {
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
  // Create fresh graph instance
  const dagreGraph = createDagreGraph();
  dagreGraph.setGraph({ 
    rankdir: 'TB',
    nodesep: DEFAULT_OPTIONS.nodeSpacing,
    ranksep: DEFAULT_OPTIONS.rankSpacing,
    ranker: 'tight-tree',
    align: 'UL',
    acyclicer: 'greedy'
  });

  // Add nodes
  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges
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

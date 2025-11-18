/**
 * Hierarchy Helper Functions
 * Các hàm hỗ trợ tính toán cấu trúc cây tổ chức
 */

import type { Employee } from '../../../../employees/types';

/**
 * Build parent-child relationship map
 */
export function buildHierarchyMaps(
  employees: Employee[],
  pendingChanges: Record<string, string | undefined>
) {
  const parentIdMap = new Map<string, string>();
  const childMap = new Map<string, string[]>();

  employees.forEach(e => {
    const currentManagerId = pendingChanges.hasOwnProperty(e.systemId)
      ? pendingChanges[e.systemId]
      : e.managerId;
    parentIdMap.set(e.systemId, currentManagerId || 'root');
  });

  parentIdMap.forEach((parentId, childId) => {
    if (!childMap.has(parentId)) {
      childMap.set(parentId, []);
    }
    childMap.get(parentId)!.push(childId);
  });

  return { parentIdMap, childMap };
}

/**
 * Count all descendants of a node
 */
export function countAllDescendants(
  nodeId: string,
  childMap: Map<string, string[]>,
  employees: Employee[]
): number {
  const children = childMap.get(nodeId) || [];
  const employeeChildrenIds = children.filter(id =>
    employees.some(e => e.systemId === id)
  );
  
  let count = employeeChildrenIds.length;
  for (const childId of employeeChildrenIds) {
    count += countAllDescendants(childId, childMap, employees);
  }
  
  return count;
}

/**
 * Get all descendants of a node
 */
export function getAllDescendants(
  nodeId: string,
  childMap: Map<string, string[]>
): Set<string> {
  const descendants = new Set<string>();
  
  const getDescendantsRecursive = (id: string) => {
    const children = childMap.get(id) || [];
    children.forEach(childId => {
      descendants.add(childId);
      getDescendantsRecursive(childId);
    });
  };
  
  getDescendantsRecursive(nodeId);
  return descendants;
}

/**
 * Get all ancestors of a node
 */
export function getAllAncestors(
  nodeId: string,
  parentIdMap: Map<string, string>
): Set<string> {
  const ancestors = new Set<string>();
  let currentNodeId: string | undefined = nodeId;

  while (currentNodeId && parentIdMap.has(currentNodeId)) {
    const parentId = parentIdMap.get(currentNodeId)!;
    if (parentId === 'root') break;
    ancestors.add(parentId);
    currentNodeId = parentId;
  }

  return ancestors;
}

/**
 * Check if creating an edge would create a cycle
 */
export function wouldCreateCycle(
  sourceId: string,
  targetId: string,
  childMap: Map<string, string[]>
): boolean {
  const descendants = getAllDescendants(sourceId, childMap);
  return descendants.has(targetId);
}

/**
 * Calculate organization metrics
 */
export function calculateOrgMetrics(
  employees: Employee[],
  childMap: Map<string, string[]>
) {
  // Average span of control (số người quản lý trung bình)
  const managersWithChildren = Array.from(childMap.entries())
    .filter(([_, children]) => children.length > 0);
  
  const avgSpan = managersWithChildren.length > 0
    ? managersWithChildren.reduce((sum, [_, children]) => sum + children.length, 0) / managersWithChildren.length
    : 0;

  // Max depth (số cấp bậc)
  const getDepth = (nodeId: string, depth = 0): number => {
    const children = childMap.get(nodeId) || [];
    if (children.length === 0) return depth;
    return Math.max(...children.map(child => getDepth(child, depth + 1)));
  };
  const maxDepth = getDepth('root');

  // Vacancy rate (tỷ lệ vị trí trống)
  const activeEmployees = employees.filter(e => e.employmentStatus === 'Đang làm việc').length;
  const totalPositions = employees.length;
  const vacancyRate = totalPositions > 0 
    ? ((totalPositions - activeEmployees) / totalPositions) * 100 
    : 0;

  return {
    avgSpan: avgSpan.toFixed(1),
    maxDepth,
    vacancyRate: vacancyRate.toFixed(1),
    totalActive: activeEmployees,
    totalPositions
  };
}

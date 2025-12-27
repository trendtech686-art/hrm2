/**
 * Employee Mapping Store
 * 
 * Lưu mapping giữa tên NV máy chấm công → Mã NV hệ thống
 * Mapping được lưu để tái sử dụng cho các lần import sau
 */

import { create } from 'zustand';
import type { EmployeeMappingEntry } from './types';

// Generate simple ID
const generateMappingId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `MAP_${timestamp}_${random}`;
};

interface EmployeeMappingState {
  mappings: EmployeeMappingEntry[];
  initialized: boolean;
  
  // Actions
  addMapping: (entry: Omit<EmployeeMappingEntry, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateMapping: (id: string, updates: Partial<Omit<EmployeeMappingEntry, 'id'>>) => void;
  deleteMapping: (id: string) => void;
  
  // Bulk actions
  addMappings: (entries: Array<Omit<EmployeeMappingEntry, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  clearMappings: () => void;
  
  // Queries
  findByMachineName: (machineName: string) => EmployeeMappingEntry | undefined;
  findByMachineId: (machineId: number) => EmployeeMappingEntry | undefined;
  findBySystemId: (systemId: string) => EmployeeMappingEntry | undefined;
  
  // Auto-mapping helper
  autoMapEmployees: (
    machineNames: string[],
    systemEmployees: Array<{ systemId: string; businessId: string; fullName: string }>
  ) => {
    mapped: Array<{ machineName: string; systemId: string; systemName: string }>;
    unmapped: string[];
  };
}

/**
 * Normalize tên để so sánh (lowercase, remove diacritics, trim)
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/\s+/g, ' '); // Normalize spaces
}

/**
 * Check if two names match (fuzzy matching)
 */
function namesMatch(machineName: string, systemName: string): boolean {
  const normalizedMachine = normalizeName(machineName);
  const normalizedSystem = normalizeName(systemName);
  
  // Exact match
  if (normalizedMachine === normalizedSystem) return true;
  
  // Machine name is part of system name
  if (normalizedSystem.includes(normalizedMachine)) return true;
  
  // System name parts match machine name
  const systemParts = normalizedSystem.split(' ');
  const machineParts = normalizedMachine.split(' ');
  
  // Check if all machine parts are in system name
  const allPartsMatch = machineParts.every((part) =>
    systemParts.some((sp) => sp === part || sp.includes(part) || part.includes(sp))
  );
  if (allPartsMatch && machineParts.length >= 2) return true;
  
  // Check last name + first name match
  // VD: "duc dat" matches "Nguyễn Đức Đạt" (đức đạt)
  if (systemParts.length >= 2 && machineParts.length >= 2) {
    const systemLastParts = systemParts.slice(-2).join(' ');
    if (normalizedMachine === systemLastParts) return true;
  }
  
  return false;
}

export const useEmployeeMappingStore = create<EmployeeMappingState>()(
  (set, get) => ({
    mappings: [],
    initialized: false,
    
    addMapping: (entry) => {
        const id = generateMappingId();
        const now = new Date().toISOString();
        const newEntry: EmployeeMappingEntry = {
          ...entry,
          id,
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          mappings: [...state.mappings, newEntry],
        }));
        
        return id;
      },
      
      updateMapping: (id, updates) => {
        set((state) => ({
          mappings: state.mappings.map((m) =>
            m.id === id
              ? { ...m, ...updates, updatedAt: new Date().toISOString() }
              : m
          ),
        }));
      },
      
      deleteMapping: (id) => {
        set((state) => ({
          mappings: state.mappings.filter((m) => m.id !== id),
        }));
      },
      
      addMappings: (entries) => {
        const now = new Date().toISOString();
        const newEntries: EmployeeMappingEntry[] = entries.map((entry) => ({
          ...entry,
          id: generateMappingId(),
          createdAt: now,
          updatedAt: now,
        }));
        
        set((state) => ({
          mappings: [...state.mappings, ...newEntries],
        }));
      },
      
      clearMappings: () => {
        set({ mappings: [] });
      },
      
      findByMachineName: (machineName) => {
        const normalized = normalizeName(machineName);
        return get().mappings.find(
          (m) => normalizeName(m.machineName) === normalized
        );
      },
      
      findByMachineId: (machineId) => {
        return get().mappings.find((m) => m.machineEmployeeId === machineId);
      },
      
      findBySystemId: (systemId) => {
        return get().mappings.find((m) => m.systemEmployeeId === systemId);
      },
      
      autoMapEmployees: (machineNames, systemEmployees) => {
        const mapped: Array<{ machineName: string; systemId: string; systemName: string }> = [];
        const unmapped: string[] = [];
        const existingMappings = get().mappings;
        
        for (const machineName of machineNames) {
          // 1. Check existing mapping first
          const existingMapping = existingMappings.find(
            (m) => normalizeName(m.machineName) === normalizeName(machineName)
          );
          
          if (existingMapping) {
            mapped.push({
              machineName,
              systemId: existingMapping.systemEmployeeId,
              systemName: existingMapping.systemEmployeeName,
            });
            continue;
          }
          
          // 2. Try to auto-match with system employees
          const matchedEmployee = systemEmployees.find((emp) =>
            namesMatch(machineName, emp.fullName)
          );
          
          if (matchedEmployee) {
            mapped.push({
              machineName,
              systemId: matchedEmployee.businessId,
              systemName: matchedEmployee.fullName,
            });
          } else {
            unmapped.push(machineName);
          }
        }
        
        return { mapped, unmapped };
      },
      
      loadFromAPI: async () => {
        if (get().initialized) return;
        try {
          // NOTE: Employee mappings are typically small dataset
          const response = await fetch('/api/employee-mappings?limit=100');
          if (response.ok) {
            const json = await response.json();
            const data = json.data || [];
            if (data.length > 0) {
              set({ mappings: data, initialized: true });
            } else {
              set({ initialized: true });
            }
          }
        } catch (error) {
          console.error('[Employee Mapping Store] loadFromAPI error:', error);
        }
      },
    })
);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Save auto-mapped results to store
 */
export function saveMappingsFromAutoMap(
  autoMapResult: ReturnType<EmployeeMappingState['autoMapEmployees']>,
  machineIds: Map<string, number> // Map<machineName, machineId>
): void {
  const store = useEmployeeMappingStore.getState();
  
  const newMappings = autoMapResult.mapped
    .filter((m) => !store.findByMachineName(m.machineName)) // Skip existing
    .map((m) => ({
      machineEmployeeId: machineIds.get(m.machineName) || 0,
      machineName: m.machineName,
      systemEmployeeId: m.systemId,
      systemEmployeeName: m.systemName,
    }));
  
  if (newMappings.length > 0) {
    store.addMappings(newMappings);
  }
}

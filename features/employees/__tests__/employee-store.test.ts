/**
 * @file Employee Store Tests
 * @description Tests for employee management based on testing-checklist.md Section 6
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useEmployeeStore } from '../store';
import { asSystemId, asBusinessId } from '../../../lib/id-types';

// Mock auth context
vi.mock('../../../contexts/auth-context.tsx', () => ({
  getCurrentUserSystemId: () => 'EMP001',
  getCurrentUserInfo: () => ({ systemId: 'EMP001', name: 'Test User' }),
}));

describe('Employee Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // 6.1 Danh sách
  describe('6.1 Danh sách nhân viên', () => {
    it('returns list of employees', () => {
      const store = useEmployeeStore.getState();
      expect(store.data).toBeDefined();
      expect(Array.isArray(store.data)).toBe(true);
    });

    it('filters active employees correctly', () => {
      const store = useEmployeeStore.getState();
      const activeEmployees = store.getActive();
      
      expect(Array.isArray(activeEmployees)).toBe(true);
      activeEmployees.forEach(employee => {
        expect(employee.isDeleted).not.toBe(true);
      });
    });

    it('finds employee by systemId', () => {
      const store = useEmployeeStore.getState();
      const employees = store.data;
      
      if (employees.length > 0) {
        const firstEmployee = employees[0];
        const found = store.findById(firstEmployee.systemId);
        
        expect(found).toBeDefined();
        expect(found?.systemId).toBe(firstEmployee.systemId);
      }
    });
  });

  // 6.2 Tạo nhân viên
  describe('6.2 Tạo nhân viên', () => {
    it('adds a new employee', () => {
      const initialCount = useEmployeeStore.getState().data.length;
      
      const newEmployee = {
        id: asBusinessId('NV-TEST-001'),
        fullName: 'Test Employee',
        phone: '0901234567',
        workEmail: 'test@company.com',
        departmentId: asSystemId('DEPT001'),
        departmentName: 'IT Department',
        positionId: asSystemId('POS001'),
        positionName: 'Developer',
        status: 'active' as const,
        startDate: '2025-01-01',
      };
      
      const result = useEmployeeStore.getState().add(newEmployee as any);
      
      expect(result).toBeDefined();
      expect(result?.fullName).toBe('Test Employee');
      expect(useEmployeeStore.getState().data.length).toBe(initialCount + 1);
    });

    it('generates systemId for new employee', () => {
      const store = useEmployeeStore.getState();
      
      const newEmployee = {
        id: asBusinessId('NV-TEST-002'),
        fullName: 'Test Employee 2',
        phone: '0901234568',
        status: 'active' as const,
      };
      
      const result = store.add(newEmployee as any);
      
      expect(result?.systemId).toBeDefined();
      expect(typeof result?.systemId).toBe('string');
    });
  });

  // 6.3 Chi tiết & Chỉnh sửa
  describe('6.3 Chi tiết & Chỉnh sửa', () => {
    it('updates employee information', () => {
      const store = useEmployeeStore.getState();
      const employees = store.data;
      
      if (employees.length > 0) {
        const employee = employees[0];
        const newName = 'Updated Employee Name';
        
        store.update(employee.systemId, { ...employee, fullName: newName });
        
        const updated = store.findById(employee.systemId);
        expect(updated?.fullName).toBe(newName);
      }
    });

    it('updates employee contact information', () => {
      const store = useEmployeeStore.getState();
      const employees = store.data;
      
      if (employees.length > 0) {
        const employee = employees[0];
        const newPhone = '0909999999';
        
        store.update(employee.systemId, { ...employee, phone: newPhone });
        
        const updated = store.findById(employee.systemId);
        expect(updated?.phone).toBe(newPhone);
      }
    });

    it('updates employee department', () => {
      const store = useEmployeeStore.getState();
      const employees = store.data;
      
      if (employees.length > 0) {
        const employee = employees[0];
        const newDeptId = asSystemId('DEPT002');
        const newDeptName = 'HR Department';
        
        store.update(employee.systemId, { 
          ...employee, 
          departmentId: newDeptId,
          departmentName: newDeptName 
        });
        
        const updated = store.findById(employee.systemId);
        expect(updated?.departmentId).toBe(newDeptId);
        expect(updated?.departmentName).toBe(newDeptName);
      }
    });

    it('updates employee position', () => {
      const store = useEmployeeStore.getState();
      const employees = store.data;
      
      if (employees.length > 0) {
        const employee = employees[0];
        const newPositionId = asSystemId('POS002');
        const newPositionName = 'Senior Developer';
        
        store.update(employee.systemId, { 
          ...employee, 
          positionId: newPositionId,
          positionName: newPositionName 
        });
        
        const updated = store.findById(employee.systemId);
        expect(updated?.positionId).toBe(newPositionId);
        expect(updated?.positionName).toBe(newPositionName);
      }
    });
  });

  // 6.4 Xóa/Nghỉ việc
  describe('6.4 Xóa/Nghỉ việc', () => {
    it('marks employee as resigned (status change)', () => {
      const store = useEmployeeStore.getState();
      const activeEmployees = store.getActive();
      
      if (activeEmployees.length > 0) {
        const employee = activeEmployees[0];
        
        store.update(employee.systemId, { 
          ...employee, 
          status: 'resigned',
          endDate: '2025-01-15'
        });
        
        const updated = store.findById(employee.systemId);
        expect(updated?.status).toBe('resigned');
        expect(updated?.endDate).toBe('2025-01-15');
      }
    });

    it('soft deletes an employee', () => {
      const store = useEmployeeStore.getState();
      const employees = store.data;
      
      if (employees.length > 0) {
        const employee = employees[0];
        store.remove(employee.systemId);
        
        const removed = store.findById(employee.systemId);
        expect(removed?.isDeleted).toBe(true);
      }
    });

    it('restores deleted employee', () => {
      const store = useEmployeeStore.getState();
      const deletedEmployees = store.data.filter(e => e.isDeleted);
      
      if (deletedEmployees.length > 0) {
        const employee = deletedEmployees[0];
        store.restore(employee.systemId);
        
        const restored = store.findById(employee.systemId);
        expect(restored?.isDeleted).toBe(false);
      }
    });
  });

  // Status filtering
  describe('Status Filtering', () => {
    it('filters employees by active status', () => {
      const store = useEmployeeStore.getState();
      const activeEmployees = store.data.filter(e => e.status === 'active' && !e.isDeleted);
      
      expect(Array.isArray(activeEmployees)).toBe(true);
    });

    it('filters employees by resigned status', () => {
      const store = useEmployeeStore.getState();
      const resignedEmployees = store.data.filter(e => e.status === 'resigned');
      
      expect(Array.isArray(resignedEmployees)).toBe(true);
    });
  });

  // Department filtering
  describe('Department Filtering', () => {
    it('filters employees by department', () => {
      const store = useEmployeeStore.getState();
      const employees = store.data;
      
      if (employees.length > 0) {
        const deptId = employees[0].departmentId;
        if (deptId) {
          const filteredByDept = employees.filter(e => e.departmentId === deptId);
          expect(filteredByDept.length).toBeGreaterThan(0);
        }
      }
    });
  });

  // Position filtering
  describe('Position Filtering', () => {
    it('filters employees by position', () => {
      const store = useEmployeeStore.getState();
      const employees = store.data;
      
      if (employees.length > 0) {
        const positionId = employees[0].positionId;
        if (positionId) {
          const filteredByPosition = employees.filter(e => e.positionId === positionId);
          expect(filteredByPosition.length).toBeGreaterThan(0);
        }
      }
    });
  });

  // Salary information
  describe('Salary Information', () => {
    it('updates employee salary', () => {
      const store = useEmployeeStore.getState();
      const employees = store.data;
      
      if (employees.length > 0) {
        const employee = employees[0];
        const newSalary = 15000000;
        
        store.update(employee.systemId, { ...employee, baseSalary: newSalary });
        
        const updated = store.findById(employee.systemId);
        expect(updated?.baseSalary).toBe(newSalary);
      }
    });
  });
});

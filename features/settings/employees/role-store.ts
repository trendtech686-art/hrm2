import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_ROLE_PERMISSIONS, type Permission } from '../../employees/permissions';

export interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isDefault: boolean;
}

interface RoleStore {
  roles: CustomRole[];
  addRole: (name: string, description: string) => void;
  updateRole: (roleId: string, updates: Partial<CustomRole>) => void;
  deleteRole: (roleId: string) => void;
  resetRole: (roleId: string) => void;
  syncDefaultPermissions: () => void;
}

// Initial default roles
const getDefaultRoles = (): CustomRole[] => [
  { id: 'Admin', name: 'Quản trị viên', description: 'Toàn quyền hệ thống', permissions: DEFAULT_ROLE_PERMISSIONS.Admin, isDefault: true },
  { id: 'Manager', name: 'Quản lý', description: 'Quản lý phòng ban', permissions: DEFAULT_ROLE_PERMISSIONS.Manager, isDefault: true },
  { id: 'Sales', name: 'Kinh doanh', description: 'Nhân viên kinh doanh', permissions: DEFAULT_ROLE_PERMISSIONS.Sales, isDefault: true },
  { id: 'Warehouse', name: 'Kho', description: 'Nhân viên kho', permissions: DEFAULT_ROLE_PERMISSIONS.Warehouse, isDefault: true },
];

export const useRoleStore = create<RoleStore>()(
  persist(
    (set, get) => ({
      roles: getDefaultRoles(),
      addRole: (name, description) => set((state) => ({
        roles: [...state.roles, {
          id: `role_${Date.now()}`,
          name,
          description,
          permissions: [],
          isDefault: false,
        }]
      })),
      updateRole: (roleId, updates) => set((state) => ({
        roles: state.roles.map((role) => 
          role.id === roleId ? { ...role, ...updates } : role
        )
      })),
      deleteRole: (roleId) => set((state) => ({
        roles: state.roles.filter((role) => role.id !== roleId)
      })),
      resetRole: (roleId) => set((state) => {
        const role = state.roles.find((r) => r.id === roleId);
        if (!role || !role.isDefault) return state;

        let defaultPerms: Permission[] = [];
        // Map ID to default permissions (Case sensitive match with initial state)
        if (role.id === 'Admin') defaultPerms = DEFAULT_ROLE_PERMISSIONS.Admin;
        else if (role.id === 'Manager') defaultPerms = DEFAULT_ROLE_PERMISSIONS.Manager;
        else if (role.id === 'Sales') defaultPerms = DEFAULT_ROLE_PERMISSIONS.Sales;
        else if (role.id === 'Warehouse') defaultPerms = DEFAULT_ROLE_PERMISSIONS.Warehouse;

        return {
          roles: state.roles.map((r) => 
            r.id === roleId ? { ...r, permissions: defaultPerms } : r
          )
        };
      }),
      // Sync default roles with latest permissions from code
      syncDefaultPermissions: () => set((state) => {
        const defaultRoles = getDefaultRoles();
        const updatedRoles = state.roles.map((role) => {
          if (role.isDefault) {
            const defaultRole = defaultRoles.find((d) => d.id === role.id);
            if (defaultRole) {
              // Merge new permissions: keep existing + add new ones from default
              const newPerms = defaultRole.permissions.filter(p => !role.permissions.includes(p));
              return {
                ...role,
                permissions: [...role.permissions, ...newPerms],
              };
            }
          }
          return role;
        });
        return { roles: updatedRoles };
      }),
    }),
    {
      name: 'role-storage',
      // Auto-sync permissions when store rehydrates
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Delay to ensure state is set
          setTimeout(() => {
            state.syncDefaultPermissions();
          }, 0);
        }
      },
    }
  )
);

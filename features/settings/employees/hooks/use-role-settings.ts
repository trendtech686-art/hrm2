/**
 * Role Settings React Query Hooks
 * 
 * Hooks for managing role settings with React Query
 * Compatible with the existing employee-roles-page.tsx interface
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchRoleSettings, 
  saveRoleSettings, 
  updateRolesCache,
  DEFAULT_ROLES,
  type CustomRole 
} from '../role-settings-service';
import { toast } from 'sonner';
import { DEFAULT_ROLE_PERMISSIONS, type Permission } from '../../../employees/permissions';
import { logError } from '@/lib/logger'

// Generate unique ID for optimistic updates
const generateTempId = () => `role_${crypto.randomUUID().slice(0, 8)}`;

export const roleSettingsKeys = {
  all: ['role-settings'] as const,
  main: () => [...roleSettingsKeys.all, 'main'] as const,
};

/**
 * Hook to fetch role settings
 */
export function useRoleSettings() {
  return useQuery({
    queryKey: roleSettingsKeys.main(),
    queryFn: async () => {
      const data = await fetchRoleSettings();
      updateRolesCache(data);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    initialData: DEFAULT_ROLES,
    initialDataUpdatedAt: 0, // Treat defaults as stale → fetch real data from DB immediately
  });
}

/**
 * Hook with all role mutations (add, update, delete, reset)
 * Matches the interface expected by employee-roles-page.tsx
 */
export function useRoleMutations() {
  const queryClient = useQueryClient();

  const saveRoles = useMutation({
    mutationFn: (roles: CustomRole[]) => saveRoleSettings(roles),
    onSuccess: (data) => {
      updateRolesCache(data);
      queryClient.setQueryData(roleSettingsKeys.main(), data);
    },
    onError: (error) => {
      logError('[useRoleMutations] Save failed', error);
      toast.error('Không thể lưu thay đổi');
    },
  });

  const addRole = (name: string, description: string, permissions: Permission[] = []) => {
    const currentRoles = queryClient.getQueryData<CustomRole[]>(roleSettingsKeys.main()) ?? DEFAULT_ROLES;
    const roleId = generateTempId();
    const newRole: CustomRole = {
      id: roleId,
      systemId: roleId,
      name,
      description,
      permissions,
      isDefault: false,
    };
    const updatedRoles = [...currentRoles, newRole];
    // Optimistic update
    queryClient.setQueryData(roleSettingsKeys.main(), updatedRoles);
    updateRolesCache(updatedRoles);
    // Save to API
    saveRoles.mutate(updatedRoles);
  };

  const updateRole = (roleId: string, updates: Partial<CustomRole>) => {
    const currentRoles = queryClient.getQueryData<CustomRole[]>(roleSettingsKeys.main()) ?? DEFAULT_ROLES;
    const updatedRoles = currentRoles.map((role) =>
      role.id === roleId ? { ...role, ...updates } : role
    );
    // Optimistic update
    queryClient.setQueryData(roleSettingsKeys.main(), updatedRoles);
    updateRolesCache(updatedRoles);
    // Save to API
    saveRoles.mutate(updatedRoles);
  };

  const deleteRole = (roleId: string) => {
    const currentRoles = queryClient.getQueryData<CustomRole[]>(roleSettingsKeys.main()) ?? DEFAULT_ROLES;
    const updatedRoles = currentRoles.filter((role) => role.id !== roleId);
    // Optimistic update
    queryClient.setQueryData(roleSettingsKeys.main(), updatedRoles);
    updateRolesCache(updatedRoles);
    // Save to API
    saveRoles.mutate(updatedRoles);
  };

  const resetRole = (roleId: string) => {
    const currentRoles = queryClient.getQueryData<CustomRole[]>(roleSettingsKeys.main()) ?? DEFAULT_ROLES;
    const updatedRoles = currentRoles.map((role) => {
      if (role.id !== roleId || !role.isDefault) return role;

      const defaultPerms = DEFAULT_ROLE_PERMISSIONS[role.id as keyof typeof DEFAULT_ROLE_PERMISSIONS];
      if (!defaultPerms) return role;

      return { ...role, permissions: defaultPerms };
    });
    // Optimistic update
    queryClient.setQueryData(roleSettingsKeys.main(), updatedRoles);
    updateRolesCache(updatedRoles);
    // Save to API
    saveRoles.mutate(updatedRoles);
  };

  return {
    addRole,
    updateRole,
    deleteRole,
    resetRole,
    isSaving: saveRoles.isPending,
  };
}

export type { CustomRole };

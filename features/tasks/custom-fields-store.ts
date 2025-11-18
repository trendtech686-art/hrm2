import { createCrudStore } from '../../lib/store-factory';
import { asSystemId } from '../../lib/id-types';
import type { CustomFieldDefinition } from './custom-fields-types';

const initialData: CustomFieldDefinition[] = [];

const baseStore = createCrudStore<CustomFieldDefinition>(initialData, 'custom-fields');

export const useCustomFieldStore = () => {
  const store = baseStore();

  return {
    ...store,

    // Get active fields
    getActive: () => {
      return store.data.filter(f => f.isActive).sort((a, b) => a.order - b.order);
    },

    // Get fields by category
    getByCategory: (category: string) => {
      return store.data
        .filter(f => f.isActive && f.category === category)
        .sort((a, b) => a.order - b.order);
    },

    // Get all categories
    getCategories: () => {
      const categories = new Set(store.data.filter(f => f.isActive).map(f => f.category));
      return Array.from(categories).filter(Boolean) as string[];
    },

    // Check if user can view field
    canView: (field: CustomFieldDefinition, userRole: string): boolean => {
      if (!field.visibleToRoles || field.visibleToRoles.length === 0) {
        return true; // Visible to all
      }
      return field.visibleToRoles.includes(userRole);
    },

    // Check if user can edit field
    canEdit: (field: CustomFieldDefinition, userRole: string): boolean => {
      if (!field.editableByRoles || field.editableByRoles.length === 0) {
        return true; // Editable by all
      }
      return field.editableByRoles.includes(userRole);
    },

    // Reorder fields
    reorder: (fieldIds: string[]) => {
      fieldIds.forEach((fieldId, index) => {
        const field = store.findById(asSystemId(fieldId));
        if (!field) return;

        store.update(asSystemId(fieldId), {
          ...field,
          order: index,
          updatedAt: new Date().toISOString(),
        });
      });
    },

    // Toggle field active status
    toggleActive: (fieldId: string) => {
      const field = store.findById(asSystemId(fieldId));
      if (!field) return;

      store.update(asSystemId(fieldId), {
        ...field,
        isActive: !field.isActive,
        updatedAt: new Date().toISOString(),
      });
    },

    // Duplicate field
    duplicate: (fieldId: string, newName?: string) => {
      const field = store.findById(asSystemId(fieldId));
      if (!field) return null;

      const duplicated: Omit<CustomFieldDefinition, 'systemId'> = {
        ...field,
        id: '',
        name: newName || `${field.name} (Copy)`,
        order: store.data.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'CURRENT_USER',
      };

      return store.add(duplicated);
    },
  };
};

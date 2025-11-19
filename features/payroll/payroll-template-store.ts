import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PayrollTemplate } from '../../lib/payroll-types.ts';
import { generateSystemId, findNextAvailableBusinessId } from '../../lib/id-utils.ts';
import { getPrefix } from '../../lib/smart-prefix.ts';
import { getCurrentUserSystemId } from '../../contexts/auth-context.tsx';
import { useEmployeeSettingsStore } from '../settings/employees/employee-settings-store.ts';
import { asBusinessId, asSystemId, type BusinessId, type SystemId } from '../../lib/id-types.ts';

const STORAGE_KEY = 'hrm-payroll-template-store';
const TEMPLATE_ENTITY: 'payroll-templates' = 'payroll-templates';

const resolveActorSystemId = () => asSystemId(getCurrentUserSystemId() || 'SYSTEM00000000');

type TemplateCounterState = {
  systemId: number;
  businessId: number;
};

type TemplateInput = {
  name: string;
  code?: string;
  description?: string;
  componentSystemIds?: SystemId[];
  isDefault?: boolean;
};

type PayrollTemplateStoreState = {
  templates: PayrollTemplate[];
  counter: TemplateCounterState;
  createTemplate: (input: TemplateInput) => PayrollTemplate;
  updateTemplate: (
    systemId: SystemId,
    input: Partial<Omit<TemplateInput, 'componentSystemIds'>> & { componentSystemIds?: SystemId[] }
  ) => PayrollTemplate | undefined;
  deleteTemplate: (systemId: SystemId) => void;
  setDefaultTemplate: (systemId: SystemId) => PayrollTemplate | undefined;
  getTemplateBySystemId: (systemId: SystemId) => PayrollTemplate | undefined;
  getDefaultTemplate: () => PayrollTemplate | undefined;
  ensureDefaultTemplate: () => PayrollTemplate;
};

const initialCounter: TemplateCounterState = {
  systemId: 0,
  businessId: 0,
};

const collectBusinessIds = (items: PayrollTemplate[]) =>
  items
    .map((item) => item.id?.toUpperCase())
    .filter((id): id is string => Boolean(id));

const sanitizeComponentIds = (componentIds?: Array<SystemId | string>): SystemId[] => {
  const availableComponents = useEmployeeSettingsStore
    .getState()
    .getSalaryComponents()
    .map((component) => asSystemId(component.systemId));

  if (!availableComponents.length) {
    return [];
  }

  if (!componentIds?.length) {
    return [...availableComponents];
  }

  const whitelist = new Set(availableComponents);
  const normalizedSelections = componentIds
    .map((id) => asSystemId(id as string))
    .filter((id) => whitelist.has(id));

  return normalizedSelections.length
    ? Array.from(new Set(normalizedSelections))
    : [...availableComponents];
};

const buildDualIds = (counter: TemplateCounterState, templates: PayrollTemplate[]) => {
  const nextSystemCounter = counter.systemId + 1;
  const systemId = asSystemId(generateSystemId(TEMPLATE_ENTITY, nextSystemCounter));
  const { nextId, updatedCounter } = findNextAvailableBusinessId(
    getPrefix(TEMPLATE_ENTITY),
    collectBusinessIds(templates),
    counter.businessId
  );

  return {
    systemId,
    id: asBusinessId(nextId),
    counter: {
      systemId: nextSystemCounter,
      businessId: updatedCounter,
    },
  } as const;
};

const enforceSingleDefault = (templates: PayrollTemplate[], defaultSystemId?: SystemId) => {
  if (!templates.length) {
    return templates;
  }

  let defaultAssigned = false;
  return templates.map((template, index) => {
    const shouldBeDefault = defaultSystemId
      ? template.systemId === defaultSystemId
      : (!defaultAssigned && (template.isDefault || index === 0));

    if (shouldBeDefault) {
      defaultAssigned = true;
      return { ...template, isDefault: true };
    }

    return { ...template, isDefault: false };
  });
};

export const usePayrollTemplateStore = create<PayrollTemplateStoreState>()(
  persist(
    (set, get) => ({
      templates: [],
      counter: initialCounter,
      createTemplate: (input) => {
        let createdTemplate: PayrollTemplate | undefined;
        set((state) => {
          const now = new Date().toISOString();
          const actor = resolveActorSystemId();
          const dualIds = buildDualIds(state.counter, state.templates);
          const sanitizedComponents = sanitizeComponentIds(input.componentSystemIds);

          const template: PayrollTemplate = {
            systemId: dualIds.systemId,
            id: dualIds.id,
            name: input.name,
            code: input.code,
            description: input.description,
            componentSystemIds: sanitizedComponents,
            isDefault: Boolean(input.isDefault),
            createdAt: now,
            createdBy: actor,
            updatedAt: now,
            updatedBy: actor,
          };

          createdTemplate = template;
          const nextTemplates = enforceSingleDefault(
            [...state.templates, template],
            input.isDefault ? template.systemId : undefined
          );

          return {
            ...state,
            templates: nextTemplates,
            counter: dualIds.counter,
          };
        });

        if (!createdTemplate) {
          throw new Error('Không thể tạo mẫu bảng lương mới.');
        }

        return createdTemplate;
      },
      updateTemplate: (systemId, input) => {
        let updatedTemplate: PayrollTemplate | undefined;
        set((state) => {
          const now = new Date().toISOString();
          const actor = resolveActorSystemId();
          const nextTemplates = state.templates.map((template) => {
            if (template.systemId !== systemId) {
              return template;
            }

            const componentSystemIds = input.componentSystemIds
              ? sanitizeComponentIds(input.componentSystemIds)
              : template.componentSystemIds;

            updatedTemplate = {
              ...template,
              name: input.name ?? template.name,
              code: input.code ?? template.code,
              description: input.description ?? template.description,
              componentSystemIds,
              isDefault: input.isDefault ?? template.isDefault,
              updatedAt: now,
              updatedBy: actor,
            };

            return updatedTemplate;
          });

          const enforcedTemplates = enforceSingleDefault(
            nextTemplates,
            input.isDefault ? systemId : undefined
          );

          return {
            ...state,
            templates: enforcedTemplates,
          };
        });

        return updatedTemplate;
      },
      deleteTemplate: (systemId) => {
        set((state) => {
          const remaining = state.templates.filter((template) => template.systemId !== systemId);
          const nextTemplates = enforceSingleDefault(remaining);
          return {
            ...state,
            templates: nextTemplates,
          };
        });

        const hasTemplates = get().templates.length > 0;
        if (!hasTemplates) {
          get().ensureDefaultTemplate();
        }
      },
      setDefaultTemplate: (systemId) => get().updateTemplate(systemId, { isDefault: true }),
      getTemplateBySystemId: (systemId) => get().templates.find((template) => template.systemId === systemId),
      getDefaultTemplate: () => {
        const found = get().templates.find((template) => template.isDefault);
        if (found) {
          return found;
        }
        return get().ensureDefaultTemplate();
      },
      ensureDefaultTemplate: () => {
        const state = get();
        if (state.templates.length) {
          const existingDefault = state.templates.find((template) => template.isDefault);
          if (existingDefault) {
            return existingDefault;
          }
        }

        return get().createTemplate({
          name: 'Mẫu bảng lương mặc định',
          description: 'Sinh tự động từ thành phần lương mặc định',
          isDefault: true,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState) => {
        if (!persistedState) {
          return {
            templates: [],
            counter: initialCounter,
          } satisfies Partial<PayrollTemplateStoreState>;
        }

        const state = persistedState as Partial<PayrollTemplateStoreState>;
        const sanitizedTemplates = (state.templates ?? []).map((template) => ({
          ...template,
          componentSystemIds: sanitizeComponentIds(template.componentSystemIds),
        }));

        const hasDefault = sanitizedTemplates.some((template) => template.isDefault);
        const templates = enforceSingleDefault(sanitizedTemplates, hasDefault ? undefined : sanitizedTemplates[0]?.systemId);

        return {
          templates,
          counter: state.counter ?? initialCounter,
        } satisfies Partial<PayrollTemplateStoreState>;
      },
    }
  )
);

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PayrollTemplate } from '../../lib/payroll-types';
import { generateSystemId, findNextAvailableBusinessId } from '../../lib/id-utils';
import { getPrefix } from '../../lib/smart-prefix';
import { getCurrentUserSystemId } from '../../contexts/auth-context';
import { useEmployeeSettingsStore } from '../settings/employees/employee-settings-store';
import { asBusinessId, asSystemId, type BusinessId, type SystemId } from '../../lib/id-types';

const STORAGE_KEY = 'hrm-payroll-template-store';
const TEMPLATE_ENTITY: 'payroll-templates' = 'payroll-templates';

const resolveActorSystemId = () => asSystemId(getCurrentUserSystemId() || 'SYSTEM00000000');

// =============================================
// DEFAULT TEMPLATES - Mẫu bảng lương chuẩn VN
// =============================================
const defaultTemplates: PayrollTemplate[] = [
  {
    systemId: asSystemId('PAYTEMP000001'),
    id: asBusinessId('PT000001'),
    name: 'Mẫu lương cơ bản',
    description: 'Dành cho nhân viên thử việc hoặc lương cơ bản không có phụ cấp',
    componentSystemIds: [
      asSystemId('SALCOMP000001'), // Lương cơ bản
    ],
    isDefault: false,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: asSystemId('SYSTEM00000000'),
    updatedAt: '2024-01-01T00:00:00Z',
    updatedBy: asSystemId('SYSTEM00000000'),
  },
  {
    systemId: asSystemId('PAYTEMP000002'),
    id: asBusinessId('PT000002'),
    name: 'Mẫu lương nhân viên văn phòng',
    description: 'Dành cho nhân viên văn phòng với đầy đủ phụ cấp và thưởng',
    componentSystemIds: [
      asSystemId('SALCOMP000001'), // Lương cơ bản
      asSystemId('SALCOMP000002'), // Phụ cấp ăn trưa
      asSystemId('SALCOMP000003'), // Phụ cấp xăng xe
      asSystemId('SALCOMP000004'), // Phụ cấp điện thoại
      asSystemId('SALCOMP000006'), // Phụ cấp thâm niên
      asSystemId('SALCOMP000008'), // Thưởng chuyên cần
      asSystemId('SALCOMP000009'), // Thưởng KPI
      asSystemId('SALCOMP000010'), // Làm thêm ngày thường
      asSystemId('SALCOMP000020'), // Làm thêm cuối tuần
      asSystemId('SALCOMP000021'), // Làm thêm ngày lễ
      asSystemId('SALCOMP000012'), // Khấu trừ đi trễ
      asSystemId('SALCOMP000014'), // Tạm ứng lương
      asSystemId('SALCOMP000016'), // BHXH
      asSystemId('SALCOMP000017'), // BHYT
      asSystemId('SALCOMP000018'), // BHTN
    ],
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: asSystemId('SYSTEM00000000'),
    updatedAt: '2024-01-01T00:00:00Z',
    updatedBy: asSystemId('SYSTEM00000000'),
  },
  {
    systemId: asSystemId('PAYTEMP000003'),
    id: asBusinessId('PT000003'),
    name: 'Mẫu lương quản lý',
    description: 'Dành cho cấp quản lý với phụ cấp chức vụ',
    componentSystemIds: [
      asSystemId('SALCOMP000001'), // Lương cơ bản
      asSystemId('SALCOMP000002'), // Phụ cấp ăn trưa
      asSystemId('SALCOMP000003'), // Phụ cấp xăng xe
      asSystemId('SALCOMP000004'), // Phụ cấp điện thoại
      asSystemId('SALCOMP000005'), // Phụ cấp chức vụ
      asSystemId('SALCOMP000006'), // Phụ cấp thâm niên
      asSystemId('SALCOMP000008'), // Thưởng chuyên cần
      asSystemId('SALCOMP000009'), // Thưởng KPI
      asSystemId('SALCOMP000010'), // Làm thêm ngày thường
      asSystemId('SALCOMP000020'), // Làm thêm cuối tuần
      asSystemId('SALCOMP000021'), // Làm thêm ngày lễ
      asSystemId('SALCOMP000014'), // Tạm ứng lương
      asSystemId('SALCOMP000016'), // BHXH
      asSystemId('SALCOMP000017'), // BHYT
      asSystemId('SALCOMP000018'), // BHTN
    ],
    isDefault: false,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: asSystemId('SYSTEM00000000'),
    updatedAt: '2024-01-01T00:00:00Z',
    updatedBy: asSystemId('SYSTEM00000000'),
  },
  {
    systemId: asSystemId('PAYTEMP000004'),
    id: asBusinessId('PT000004'),
    name: 'Mẫu lương kinh doanh',
    description: 'Dành cho nhân viên kinh doanh/sales với hoa hồng',
    componentSystemIds: [
      asSystemId('SALCOMP000001'), // Lương cơ bản
      asSystemId('SALCOMP000002'), // Phụ cấp ăn trưa
      asSystemId('SALCOMP000003'), // Phụ cấp xăng xe
      asSystemId('SALCOMP000004'), // Phụ cấp điện thoại
      asSystemId('SALCOMP000008'), // Thưởng chuyên cần
      asSystemId('SALCOMP000009'), // Thưởng KPI
      asSystemId('SALCOMP000011'), // Hoa hồng bán hàng
      asSystemId('SALCOMP000014'), // Tạm ứng lương
      asSystemId('SALCOMP000016'), // BHXH
      asSystemId('SALCOMP000017'), // BHYT
      asSystemId('SALCOMP000018'), // BHTN
    ],
    isDefault: false,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: asSystemId('SYSTEM00000000'),
    updatedAt: '2024-01-01T00:00:00Z',
    updatedBy: asSystemId('SYSTEM00000000'),
  },
  {
    systemId: asSystemId('PAYTEMP000005'),
    id: asBusinessId('PT000005'),
    name: 'Mẫu lương toàn bộ',
    description: 'Bao gồm tất cả thành phần lương có trong hệ thống',
    componentSystemIds: [
      asSystemId('SALCOMP000001'), // Lương cơ bản
      asSystemId('SALCOMP000002'), // Phụ cấp ăn trưa
      asSystemId('SALCOMP000003'), // Phụ cấp xăng xe
      asSystemId('SALCOMP000004'), // Phụ cấp điện thoại
      asSystemId('SALCOMP000005'), // Phụ cấp chức vụ
      asSystemId('SALCOMP000006'), // Phụ cấp thâm niên
      asSystemId('SALCOMP000008'), // Thưởng chuyên cần
      asSystemId('SALCOMP000009'), // Thưởng KPI
      asSystemId('SALCOMP000010'), // Làm thêm ngày thường
      asSystemId('SALCOMP000020'), // Làm thêm cuối tuần
      asSystemId('SALCOMP000021'), // Làm thêm ngày lễ
      asSystemId('SALCOMP000011'), // Hoa hồng bán hàng
      asSystemId('SALCOMP000012'), // Khấu trừ đi trễ
      asSystemId('SALCOMP000013'), // Khấu trừ nghỉ không phép
      asSystemId('SALCOMP000014'), // Tạm ứng lương
      asSystemId('SALCOMP000016'), // BHXH
      asSystemId('SALCOMP000017'), // BHYT
      asSystemId('SALCOMP000018'), // BHTN
    ],
    isDefault: false,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: asSystemId('SYSTEM00000000'),
    updatedAt: '2024-01-01T00:00:00Z',
    updatedBy: asSystemId('SYSTEM00000000'),
  },
];

type TemplateCounterState = {
  systemId: number;
  businessId: number;
};

type TemplateInput = {
  name: string;
  code?: string | undefined;
  description?: string | undefined;
  componentSystemIds?: SystemId[] | undefined;
  isDefault?: boolean | undefined;
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
  resetToDefaultTemplates: () => void;
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

        // Initialize with default templates
        if (state.templates.length === 0) {
          set((s) => ({
            ...s,
            templates: defaultTemplates,
          }));
          return defaultTemplates.find((t) => t.isDefault) || defaultTemplates[0];
        }

        return get().createTemplate({
          name: 'Mẫu bảng lương mặc định',
          description: 'Sinh tự động từ thành phần lương mặc định',
          isDefault: true,
        });
      },
      resetToDefaultTemplates: () => {
        set({
          templates: defaultTemplates,
          counter: {
            systemId: 5, // After PAYTEMP000005
            businessId: 5, // After PT000005
          },
        });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persistedState, version) => {
        if (!persistedState) {
          return {
            templates: [],
            counter: initialCounter,
          } satisfies Partial<PayrollTemplateStoreState>;
        }

        const state = persistedState as Partial<PayrollTemplateStoreState>;
        let templates = state.templates ?? [];
        
        // Migration v1 -> v2: Thêm các component OT mới vào templates
        if (version < 2) {
          const otWeekend = asSystemId('SALCOMP000020');
          const otHoliday = asSystemId('SALCOMP000021');
          const otWeekday = asSystemId('SALCOMP000010');
          
          templates = templates.map((template) => {
            const ids = template.componentSystemIds || [];
            const hasOtWeekday = ids.includes(otWeekday);
            const hasOtWeekend = ids.includes(otWeekend);
            const hasOtHoliday = ids.includes(otHoliday);
            
            // Nếu template có OT ngày thường nhưng chưa có OT cuối tuần/ngày lễ, thêm vào
            if (hasOtWeekday && (!hasOtWeekend || !hasOtHoliday)) {
              const otIndex = ids.indexOf(otWeekday);
              const newIds = [...ids];
              if (!hasOtWeekend) {
                newIds.splice(otIndex + 1, 0, otWeekend);
              }
              if (!hasOtHoliday) {
                newIds.splice(otIndex + 2, 0, otHoliday);
              }
              return { ...template, componentSystemIds: newIds };
            }
            return template;
          });
        }
        
        const sanitizedTemplates = templates.map((template) => ({
          ...template,
          componentSystemIds: sanitizeComponentIds(template.componentSystemIds),
        }));

        const hasDefault = sanitizedTemplates.some((template) => template.isDefault);
        const finalTemplates = enforceSingleDefault(sanitizedTemplates, hasDefault ? undefined : sanitizedTemplates[0]?.systemId);

        return {
          templates: finalTemplates,
          counter: state.counter ?? initialCounter,
        } satisfies Partial<PayrollTemplateStoreState>;
      },
    }
  )
);

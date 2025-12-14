import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { EmployeeSettings, LeaveType, SalaryComponent, WorkShift } from './types.ts';
import { getCurrentUserSystemId } from '../../../contexts/auth-context.tsx';
import { generateSystemId, getMaxBusinessIdCounter, getMaxSystemIdCounter, findNextAvailableBusinessId } from '../../../lib/id-utils.ts';
import { getPrefix, type EntityType } from '../../../lib/smart-prefix.ts';
import { getEntityConfig } from '../../../lib/id-config.ts';
import { asBusinessId, asSystemId, type BusinessId, type SystemId } from '@/lib/id-types';

const SETTINGS_ENTITY_MAP = {
  workShifts: 'work-shifts',
  leaveTypes: 'leave-types',
  salaryComponents: 'salary-components',
} as const;

type SettingsEntityKey = keyof typeof SETTINGS_ENTITY_MAP;
type SettingsEntityType = (typeof SETTINGS_ENTITY_MAP)[SettingsEntityKey];

type CounterState = {
  systemId: number;
  businessId: number;
};

type SettingsCounters = Record<SettingsEntityType, CounterState>;

const defaultSettings: EmployeeSettings = {
  workStartTime: '08:30',
  workEndTime: '18:00',
  lunchBreakDuration: 90, // 1.5 giờ = 90 phút
  lunchBreakStart: '12:00',
  lunchBreakEnd: '13:30',
  workingDays: [1, 2, 3, 4, 5, 6], // Thứ 2 - Thứ 7 (Mon-Sat)
  workShifts: [
    {
      systemId: asSystemId('WSHIFT000001'),
      id: asBusinessId('CA000001'),
      name: 'Ca hành chính',
      startTime: '08:30',
      endTime: '18:00',
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('WSHIFT000002'),
      id: asBusinessId('CA000002'),
      name: 'Ca tối',
      startTime: '14:00',
      endTime: '22:00',
      applicableDepartmentSystemIds: [],
    },
  ],
  otHourlyRate: 25000,  // 25k/giờ làm thêm ngày thường
  otRateWeekend: 1.5,   // Hệ số x1.5 cuối tuần
  otRateHoliday: 3,     // Hệ số x3 ngày lễ
  allowedLateMinutes: 5, // Sau 5 phút mới tính là đi trễ
  latePenaltyTiers: [
    { fromMinutes: 5, toMinutes: 10, amount: 10000 },   // 5-10 phút: 10k
    { fromMinutes: 10, toMinutes: 30, amount: 20000 },  // 10-30 phút: 20k
    { fromMinutes: 30, toMinutes: 60, amount: 50000 },  // 30-60 phút: 50k
    { fromMinutes: 60, toMinutes: null, amount: 100000 }, // >60 phút: 100k
  ],
  earlyLeavePenaltyTiers: [
    { fromMinutes: 5, toMinutes: 10, amount: 10000 },
    { fromMinutes: 10, toMinutes: 30, amount: 20000 },
    { fromMinutes: 30, toMinutes: 60, amount: 50000 },
    { fromMinutes: 60, toMinutes: null, amount: 100000 },
  ],
  leaveTypes: [
    {
      systemId: asSystemId('LEAVETYPE000001'),
      id: asBusinessId('LP000001'),
      name: 'Nghỉ phép năm',
      numberOfDays: 12,
      isPaid: true,
      requiresAttachment: false,
      applicableGender: 'All',
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('LEAVETYPE000002'),
      id: asBusinessId('LP000002'),
      name: 'Nghỉ bệnh',
      numberOfDays: 7,
      isPaid: true,
      requiresAttachment: true,
      applicableGender: 'All',
      applicableDepartmentSystemIds: [],
    },
  ],
  baseAnnualLeaveDays: 12,
  annualLeaveSeniorityBonus: {
    years: 5,
    additionalDays: 1,
  },
  allowRollover: false,
  rolloverExpirationDate: '03-31',
  salaryComponents: [
    // =============================================
    // NHÓM THU NHẬP (EARNINGS)
    // =============================================
    {
      systemId: asSystemId('SALCOMP000001'),
      id: asBusinessId('SC000001'),
      name: 'Lương cơ bản',
      description: 'Lương theo ngày công thực tế = Lương HĐ × (Ngày công / Ngày chuẩn)',
      category: 'earning',
      type: 'formula',
      formula: 'baseSalary * (workDays / standardWorkDays)',
      taxable: true,
      partOfSocialInsurance: true,
      isActive: true,
      sortOrder: 1,
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('SALCOMP000002'),
      id: asBusinessId('SC000002'),
      name: 'Phụ cấp ăn trưa',
      description: 'Phụ cấp theo ngày công thực tế = Ngày công × Mức tiền/ngày (không tính thuế)',
      category: 'earning',
      type: 'formula',
      formula: 'workDays * mealAllowancePerDay',
      taxable: false,
      partOfSocialInsurance: false,
      isActive: true,
      sortOrder: 2,
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('SALCOMP000003'),
      id: asBusinessId('SC000003'),
      name: 'Phụ cấp xăng xe',
      description: 'Phụ cấp đi lại, xăng xe hàng tháng',
      category: 'earning',
      type: 'fixed',
      amount: 500000,
      taxable: false,
      partOfSocialInsurance: false,
      isActive: true,
      sortOrder: 3,
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('SALCOMP000004'),
      id: asBusinessId('SC000004'),
      name: 'Phụ cấp điện thoại',
      description: 'Phụ cấp liên lạc, điện thoại công việc',
      category: 'earning',
      type: 'fixed',
      amount: 300000,
      taxable: false,
      partOfSocialInsurance: false,
      isActive: true,
      sortOrder: 4,
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('SALCOMP000005'),
      id: asBusinessId('SC000005'),
      name: 'Phụ cấp chức vụ',
      description: 'Phụ cấp trách nhiệm theo chức vụ quản lý',
      category: 'earning',
      type: 'fixed',
      amount: 2000000,
      taxable: true,
      partOfSocialInsurance: true,
      isActive: true,
      sortOrder: 5,
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('SALCOMP000006'),
      id: asBusinessId('SC000006'),
      name: 'Phụ cấp thâm niên',
      description: 'Phụ cấp theo số năm làm việc tại công ty',
      category: 'earning',
      type: 'fixed',
      amount: 500000,
      taxable: true,
      partOfSocialInsurance: false,
      isActive: true,
      sortOrder: 6,
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('SALCOMP000007'),
      id: asBusinessId('SC000007'),
      name: 'Phụ cấp độc hại',
      description: 'Phụ cấp cho công việc trong môi trường độc hại, nguy hiểm',
      category: 'earning',
      type: 'fixed',
      amount: 1000000,
      taxable: true,
      partOfSocialInsurance: true,
      isActive: false,
      sortOrder: 7,
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('SALCOMP000008'),
      id: asBusinessId('SC000008'),
      name: 'Thưởng chuyên cần',
      description: 'Thưởng đi làm đầy đủ, không nghỉ phép trong tháng',
      category: 'earning',
      type: 'fixed',
      amount: 500000,
      taxable: true,
      partOfSocialInsurance: false,
      isActive: true,
      sortOrder: 8,
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('SALCOMP000009'),
      id: asBusinessId('SC000009'),
      name: 'Thưởng KPI',
      description: 'Thưởng hoàn thành chỉ tiêu KPI tháng',
      category: 'earning',
      type: 'formula',
      formula: '[LUONG_CO_BAN] * 0.1',
      taxable: true,
      partOfSocialInsurance: false,
      isActive: true,
      sortOrder: 9,
      applicableDepartmentSystemIds: [],
    },
    // =============================================
    // NHÓM LÀM THÊM GIỜ (OT) - Chi tiết theo loại ngày
    // =============================================
    {
      systemId: asSystemId('SALCOMP000010'),
      id: asBusinessId('SC000010'),
      name: 'Làm thêm ngày thường',
      description: 'Tiền làm thêm sau giờ tan làm (18:00) các ngày trong tuần. Công thức: Giờ OT x Tiền/giờ',
      category: 'earning',
      type: 'formula',
      formula: 'otPayWeekday',
      taxable: true,
      partOfSocialInsurance: false,
      isActive: true,
      sortOrder: 10,
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('SALCOMP000020'),
      id: asBusinessId('SC000020'),
      name: 'Làm thêm cuối tuần',
      description: 'Tiền làm thêm thứ 7 & Chủ nhật. Công thức: Giờ OT x Tiền/giờ x Hệ số cuối tuần (1.5)',
      category: 'earning',
      type: 'formula',
      formula: 'otPayWeekend',
      taxable: true,
      partOfSocialInsurance: false,
      isActive: true,
      sortOrder: 11,
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('SALCOMP000021'),
      id: asBusinessId('SC000021'),
      name: 'Làm thêm ngày lễ',
      description: 'Tiền làm thêm các ngày lễ. Công thức: Giờ OT x Tiền/giờ x Hệ số ngày lễ (3)',
      category: 'earning',
      type: 'formula',
      formula: 'otPayHoliday',
      taxable: true,
      partOfSocialInsurance: false,
      isActive: true,
      sortOrder: 12,
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('SALCOMP000011'),
      id: asBusinessId('SC000011'),
      name: 'Hoa hồng bán hàng',
      description: 'Hoa hồng theo doanh số bán hàng (áp dụng cho bộ phận Kinh doanh)',
      category: 'earning',
      type: 'fixed',
      amount: 0,
      taxable: true,
      partOfSocialInsurance: false,
      isActive: true,
      sortOrder: 13,
      applicableDepartmentSystemIds: [],
    },
    // =============================================
    // NHÓM KHẤU TRỪ (DEDUCTIONS)
    // =============================================
    {
      systemId: asSystemId('SALCOMP000012'),
      id: asBusinessId('SC000012'),
      name: 'Khấu trừ đi trễ',
      description: 'Trừ lương theo số lần/phút đi trễ trong tháng',
      category: 'deduction',
      type: 'fixed',
      amount: 0,
      taxable: false,
      partOfSocialInsurance: false,
      isActive: true,
      sortOrder: 20,
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('SALCOMP000013'),
      id: asBusinessId('SC000013'),
      name: 'Khấu trừ nghỉ không phép',
      description: 'Trừ lương theo số ngày nghỉ không phép',
      category: 'deduction',
      type: 'formula',
      formula: '[NGAY_NGHI_KHONG_PHEP] * ([LUONG_CO_BAN] / [NGAY_CONG_CHUAN])',
      taxable: false,
      partOfSocialInsurance: false,
      isActive: true,
      sortOrder: 21,
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('SALCOMP000014'),
      id: asBusinessId('SC000014'),
      name: 'Tạm ứng lương',
      description: 'Khấu trừ khoản tạm ứng lương đã nhận trước',
      category: 'deduction',
      type: 'fixed',
      amount: 0,
      taxable: false,
      partOfSocialInsurance: false,
      isActive: true,
      sortOrder: 22,
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('SALCOMP000015'),
      id: asBusinessId('SC000015'),
      name: 'Khấu trừ công nợ',
      description: 'Khấu trừ các khoản nợ công ty (vay, mượn...)',
      category: 'deduction',
      type: 'fixed',
      amount: 0,
      taxable: false,
      partOfSocialInsurance: false,
      isActive: false,
      sortOrder: 23,
      applicableDepartmentSystemIds: [],
    },
    // =============================================
    // NHÓM ĐÓNG GÓP (CONTRIBUTIONS) - Tự động tính
    // =============================================
    {
      systemId: asSystemId('SALCOMP000016'),
      id: asBusinessId('SC000016'),
      name: 'BHXH (NV đóng)',
      description: 'Bảo hiểm xã hội phần người lao động đóng (8%)',
      category: 'contribution',
      type: 'formula',
      formula: '[LUONG_DONG_BHXH] * 0.08',
      taxable: false,
      partOfSocialInsurance: false,
      isActive: true,
      sortOrder: 30,
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('SALCOMP000017'),
      id: asBusinessId('SC000017'),
      name: 'BHYT (NV đóng)',
      description: 'Bảo hiểm y tế phần người lao động đóng (1.5%)',
      category: 'contribution',
      type: 'formula',
      formula: '[LUONG_DONG_BHXH] * 0.015',
      taxable: false,
      partOfSocialInsurance: false,
      isActive: true,
      sortOrder: 31,
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('SALCOMP000018'),
      id: asBusinessId('SC000018'),
      name: 'BHTN (NV đóng)',
      description: 'Bảo hiểm thất nghiệp phần người lao động đóng (1%)',
      category: 'contribution',
      type: 'formula',
      formula: '[LUONG_DONG_BHXH] * 0.01',
      taxable: false,
      partOfSocialInsurance: false,
      isActive: true,
      sortOrder: 32,
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('SALCOMP000019'),
      id: asBusinessId('SC000019'),
      name: 'Công đoàn phí',
      description: 'Phí công đoàn hàng tháng (1% lương cơ bản)',
      category: 'contribution',
      type: 'formula',
      formula: '[LUONG_CO_BAN] * 0.01',
      taxable: false,
      partOfSocialInsurance: false,
      isActive: false,
      sortOrder: 33,
      applicableDepartmentSystemIds: [],
    },
  ],
  payrollCycle: 'monthly',
  payday: 5,
  payrollLockDate: 5,
  
  // =============================================
  // CÀI ĐẶT BẢO HIỂM (Luật BHXH 2024)
  // =============================================
  insuranceRates: {
    socialInsurance: {
      employeeRate: 8,      // BHXH NV đóng 8%
      employerRate: 17.5,   // BHXH DN đóng 17.5%
    },
    healthInsurance: {
      employeeRate: 1.5,    // BHYT NV đóng 1.5%
      employerRate: 3,      // BHYT DN đóng 3%
    },
    unemploymentInsurance: {
      employeeRate: 1,      // BHTN NV đóng 1%
      employerRate: 1,      // BHTN DN đóng 1%
    },
    // Trần đóng BHXH = 20 x lương cơ sở (từ 1/7/2024)
    insuranceSalaryCap: 46800000,   // 20 x 2,340,000
    baseSalaryReference: 2340000,    // Lương cơ sở từ 1/7/2024
  },
  
  // =============================================
  // CÀI ĐẶT THUẾ TNCN (Luật thuế TNCN hiện hành)
  // =============================================
  taxSettings: {
    personalDeduction: 11000000,    // Giảm trừ bản thân 11 triệu/tháng
    dependentDeduction: 4400000,    // Giảm trừ mỗi người phụ thuộc 4.4 triệu/tháng
    // Biểu thuế lũy tiến từng phần (theo thu nhập tính thuế/tháng)
    taxBrackets: [
      { fromAmount: 0, toAmount: 5000000, rate: 5 },
      { fromAmount: 5000000, toAmount: 10000000, rate: 10 },
      { fromAmount: 10000000, toAmount: 18000000, rate: 15 },
      { fromAmount: 18000000, toAmount: 32000000, rate: 20 },
      { fromAmount: 32000000, toAmount: 52000000, rate: 25 },
      { fromAmount: 52000000, toAmount: 80000000, rate: 30 },
      { fromAmount: 80000000, toAmount: null, rate: 35 },
    ],
  },
  
  // =============================================
  // LƯƠNG TỐI THIỂU VÙNG (NĐ 74/2024/NĐ-CP từ 1/7/2024)
  // =============================================
  minimumWage: {
    region1: 4960000,   // Vùng I
    region2: 4410000,   // Vùng II
    region3: 3860000,   // Vùng III
    region4: 3450000,   // Vùng IV
  },
  
  // Số ngày công chuẩn trong tháng
  standardWorkDays: 26,
  
  // Phụ cấp ăn trưa theo ngày công
  mealAllowancePerDay: 30000, // 30k/ngày
};

type EmployeeSettingsState = {
  settings: EmployeeSettings;
  counters: SettingsCounters;
  setSettings: (settings: EmployeeSettings) => void;
  getShiftBySystemId: (systemId: SystemId) => WorkShift | undefined;
  getLeaveTypes: () => LeaveType[];
  getSalaryComponents: () => SalaryComponent[];
  getDefaultPayrollWindow: () => {
    cycle: EmployeeSettings['payrollCycle'];
    payday: number;
    lockDate: number;
  };
};

const cloneSettings = (payload?: EmployeeSettings): EmployeeSettings => ({
  ...defaultSettings,
  ...payload,
  annualLeaveSeniorityBonus: {
    ...defaultSettings.annualLeaveSeniorityBonus,
    ...(payload?.annualLeaveSeniorityBonus ?? {}),
  },
  workShifts: (payload?.workShifts ?? defaultSettings.workShifts).map((shift) => ({ ...shift })),
  leaveTypes: (payload?.leaveTypes ?? defaultSettings.leaveTypes).map((type) => ({ ...type })),
  salaryComponents: (payload?.salaryComponents ?? defaultSettings.salaryComponents).map((component) => ({ ...component })),
});

const computeCounter = <T extends { systemId?: SystemId; id?: BusinessId }>(
  items: T[],
  entityType: EntityType
): CounterState => {
  const config = getEntityConfig(entityType);
  const systemItems = items
    .filter((item): item is T & { systemId: SystemId } => Boolean(item.systemId))
    .map(({ systemId }) => ({ systemId }));
  const businessItems = items
    .filter((item): item is T & { id: BusinessId } => Boolean(item.id))
    .map(({ id }) => ({ id }));
  return {
    systemId: getMaxSystemIdCounter(systemItems, config.systemIdPrefix),
    businessId: getMaxBusinessIdCounter(businessItems, getPrefix(entityType)),
  };
};

const buildCounters = (settings: EmployeeSettings): SettingsCounters => ({
  'work-shifts': computeCounter(settings.workShifts, 'work-shifts'),
  'leave-types': computeCounter(settings.leaveTypes, 'leave-types'),
  'salary-components': computeCounter(settings.salaryComponents, 'salary-components'),
});

type BaseSettingsEntity = {
  systemId?: SystemId;
  id?: BusinessId;
  createdAt?: string;
  createdBy?: SystemId;
  updatedAt?: string;
  updatedBy?: SystemId;
  applicableDepartmentSystemIds?: SystemId[];
};

const normalizeCollection = <T extends BaseSettingsEntity>(
  items: T[],
  entityType: SettingsEntityType,
  counters: SettingsCounters,
  currentUser?: SystemId
): { records: T[]; counters: SettingsCounters } => {
  let systemCounter = counters[entityType]?.systemId ?? 0;
  let businessCounter = counters[entityType]?.businessId ?? 0;
  const prefix = getPrefix(entityType);
  const config = getEntityConfig(entityType);
  const allKnownIds = new Set<string>(
    items
      .map((item) => item.id?.toUpperCase())
      .filter((id): id is string => Boolean(id))
  );
  const usedIds = new Set<string>();
  const now = new Date().toISOString();

  const records = items.map((item) => {
    let systemId = item.systemId;
    const hasValidSystemId = Boolean(systemId && systemId.startsWith(config.systemIdPrefix));
    const isNew = !hasValidSystemId;
    if (!hasValidSystemId) {
      systemCounter += 1;
      systemId = asSystemId(generateSystemId(entityType, systemCounter));
    }

    let businessIdString = item.id ? String(item.id).toUpperCase() : undefined;
    const hasValidBusinessId = Boolean(businessIdString && businessIdString.startsWith(prefix));
    if (!hasValidBusinessId || (businessIdString && usedIds.has(businessIdString))) {
      const { nextId, updatedCounter } = findNextAvailableBusinessId(prefix, Array.from(allKnownIds), businessCounter);
      businessIdString = nextId;
      businessCounter = updatedCounter;
    }
    if (!businessIdString) {
      businessCounter += 1;
      businessIdString = `${prefix}${String(businessCounter).padStart(config.digitCount, '0')}`;
    }

    allKnownIds.add(businessIdString);
    usedIds.add(businessIdString);

    const resolvedSystemId = systemId ?? asSystemId(generateSystemId(entityType, systemCounter));
    const resolvedBusinessId = asBusinessId(businessIdString);

    const createdAt = item.createdAt ?? now;
    const createdBy = item.createdBy ?? (isNew && currentUser ? currentUser : item.createdBy);

    return {
      ...item,
      systemId: resolvedSystemId,
      id: resolvedBusinessId,
      applicableDepartmentSystemIds: item.applicableDepartmentSystemIds ?? [],
      createdAt,
      createdBy,
      updatedAt: now,
      updatedBy: currentUser ?? item.updatedBy,
    } as T;
  });

  return {
    records,
    counters: {
      ...counters,
      [entityType]: {
        systemId: systemCounter,
        businessId: businessCounter,
      },
    },
  };
};

const normalizeSettings = (
  incoming: EmployeeSettings,
  counters: SettingsCounters,
  currentUser?: SystemId
): { settings: EmployeeSettings; counters: SettingsCounters } => {
  let nextCounters = { ...counters };
  const normalizedShifts = normalizeCollection(incoming.workShifts, 'work-shifts', nextCounters, currentUser);
  nextCounters = normalizedShifts.counters;
  const normalizedLeaves = normalizeCollection(incoming.leaveTypes, 'leave-types', nextCounters, currentUser);
  nextCounters = normalizedLeaves.counters;
  const normalizedComponents = normalizeCollection(incoming.salaryComponents, 'salary-components', nextCounters, currentUser);

  return {
    settings: {
      ...incoming,
      workShifts: normalizedShifts.records,
      leaveTypes: normalizedLeaves.records,
      salaryComponents: normalizedComponents.records,
    },
    counters: normalizedComponents.counters,
  };
};

const buildInitialState = () => {
  const cloned = cloneSettings(defaultSettings);
  const counters = buildCounters(cloned);
  return normalizeSettings(cloned, counters);
};

const initialState = buildInitialState();

export const useEmployeeSettingsStore = create<EmployeeSettingsState>()(
  persist(
    (set, get) => ({
      settings: initialState.settings,
      counters: initialState.counters,
      setSettings: (payload) => {
        const cloned = cloneSettings(payload);
        const currentUser = getCurrentUserSystemId();
        const normalized = normalizeSettings(
          cloned,
          get().counters,
          currentUser ? asSystemId(currentUser) : undefined
        );
        set(normalized);
      },
      getShiftBySystemId: (systemId) => get().settings.workShifts.find((shift) => shift.systemId === systemId),
      getLeaveTypes: () => get().settings.leaveTypes,
      getSalaryComponents: () => get().settings.salaryComponents,
      getDefaultPayrollWindow: () => {
        const current = get().settings;
        return {
          cycle: current.payrollCycle,
          payday: current.payday,
          lockDate: current.payrollLockDate,
        };
      },
    }),
    {
      name: 'hrm-employee-settings-storage',
      storage: createJSONStorage(() => localStorage),
      version: 3,
      migrate: (persistedState, version) => {
        if (!persistedState || !(persistedState as Partial<EmployeeSettingsState>).settings) {
          return initialState;
        }
        const persistedSettings = (persistedState as Partial<EmployeeSettingsState>).settings;
        const cloned = cloneSettings(persistedSettings);
        
        // Migration v2 -> v3: Thêm các component OT mới nếu chưa có
        if (version < 3) {
          const existingIds = cloned.salaryComponents.map(c => c.systemId);
          
          // Thêm OT cuối tuần (SALCOMP000020) nếu chưa có
          if (!existingIds.includes(asSystemId('SALCOMP000020'))) {
            cloned.salaryComponents.push({
              systemId: asSystemId('SALCOMP000020'),
              id: asBusinessId('SC000020'),
              name: 'Làm thêm cuối tuần',
              description: 'Tiền làm thêm thứ 7 & Chủ nhật. Công thức: Giờ OT x Tiền/giờ x Hệ số cuối tuần (1.5)',
              category: 'earning',
              type: 'formula',
              formula: 'otPayWeekend',
              taxable: true,
              partOfSocialInsurance: false,
              isActive: true,
              sortOrder: 11,
              applicableDepartmentSystemIds: [],
            });
          }
          
          // Thêm OT ngày lễ (SALCOMP000021) nếu chưa có
          if (!existingIds.includes(asSystemId('SALCOMP000021'))) {
            cloned.salaryComponents.push({
              systemId: asSystemId('SALCOMP000021'),
              id: asBusinessId('SC000021'),
              name: 'Làm thêm ngày lễ',
              description: 'Tiền làm thêm các ngày lễ. Công thức: Giờ OT x Tiền/giờ x Hệ số ngày lễ (3)',
              category: 'earning',
              type: 'formula',
              formula: 'otPayHoliday',
              taxable: true,
              partOfSocialInsurance: false,
              isActive: true,
              sortOrder: 12,
              applicableDepartmentSystemIds: [],
            });
          }
          
          // Cập nhật Lương cơ bản (SALCOMP000001) thành formula nếu đang là fixed
          const baseSalaryComponent = cloned.salaryComponents.find(c => c.systemId === asSystemId('SALCOMP000001'));
          if (baseSalaryComponent && baseSalaryComponent.type === 'fixed') {
            baseSalaryComponent.type = 'formula';
            baseSalaryComponent.formula = 'baseSalary * (workDays / standardWorkDays)';
            baseSalaryComponent.description = 'Lương theo ngày công thực tế = Lương HĐ × (Ngày công / Ngày chuẩn)';
            delete (baseSalaryComponent as any).amount;
          }
          
          // Cập nhật OT ngày thường (SALCOMP000010) nếu công thức chưa đúng
          const otWeekdayComponent = cloned.salaryComponents.find(c => c.systemId === asSystemId('SALCOMP000010'));
          if (otWeekdayComponent && otWeekdayComponent.formula !== 'otPayWeekday') {
            otWeekdayComponent.name = 'Làm thêm ngày thường';
            otWeekdayComponent.formula = 'otPayWeekday';
            otWeekdayComponent.description = 'Tiền làm thêm sau giờ tan làm (18:00) các ngày trong tuần. Công thức: Giờ OT x Tiền/giờ';
          }
          
          // Sắp xếp lại theo sortOrder
          cloned.salaryComponents.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        }
        
        const counters = buildCounters(cloned);
        return normalizeSettings(cloned, counters);
      },
    }
  )
);

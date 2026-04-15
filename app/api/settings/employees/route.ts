import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { employeeSettingsSchema } from './validation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { cache } from '@/lib/cache'

const SETTING_KEY = 'employee-settings'
const SETTING_GROUP = 'hrm'

// GET /api/settings/employees - Get employee settings
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    if (!setting) {
      return apiSuccess({ data: null })
    }

    return apiSuccess({ data: setting.value })
  } catch (error) {
    logError('Error fetching employee settings', error)
    return apiError('Failed to fetch employee settings', 500)
  }
}

// PUT /api/settings/employees - Update employee settings
export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, employeeSettingsSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const settings = validation.data

  try {
    // Read existing data BEFORE upsert for activity log diff
    const existingSetting = await prisma.setting.findFirst({
      where: { key: SETTING_KEY, group: SETTING_GROUP },
    })
    const oldSettings = (existingSetting?.value ?? {}) as Record<string, unknown>

    const setting = await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      update: {
        value: settings as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        systemId: await generateIdWithPrefix('SET_EMP', prisma),
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'hrm',
        value: settings as Prisma.InputJsonValue,
        description: 'Employee management settings',
      },
    })
    const newSettings = settings as Record<string, unknown>

    const fieldLabels: Record<string, string> = {
      workStartTime: 'Giờ bắt đầu làm việc',
      workEndTime: 'Giờ kết thúc làm việc',
      standardWorkDays: 'Số ngày công chuẩn',
      lunchBreakStart: 'Giờ nghỉ trưa bắt đầu',
      lunchBreakEnd: 'Giờ nghỉ trưa kết thúc',
      lunchBreakDuration: 'Thời gian nghỉ trưa',
      allowedLateMinutes: 'Số phút đi muộn cho phép',
      otHourlyRate: 'Tiền làm thêm/giờ',
      otRateWeekend: 'Hệ số làm thêm cuối tuần',
      otRateHoliday: 'Hệ số làm thêm ngày lễ',
      mealAllowancePerDay: 'Phụ cấp ăn trưa/ngày',
      payrollCycle: 'Chu kỳ lương',
      payday: 'Ngày trả lương',
      payrollLockDate: 'Ngày khóa bảng lương',
      baseAnnualLeaveDays: 'Số ngày phép năm',
      allowRollover: 'Cho phép chuyển phép',
      rolloverExpirationDate: 'Hạn chuyển phép',
    }

    const changes: Record<string, { from: unknown; to: unknown }> = {}
    const simpleKeys = Object.keys(fieldLabels)
    for (const key of simpleKeys) {
      const oldVal = oldSettings[key]
      const newVal = newSettings[key]
      if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
        // Vietnamize boolean values
        const formatVal = (v: unknown) => {
          if (v === true) return 'Có'
          if (v === false) return 'Không'
          return v ?? null
        }
        changes[fieldLabels[key] || key] = { from: formatVal(oldVal), to: formatVal(newVal) }
      }
    }

    // Check array fields with detailed info
    const formatTiers = (tiers: unknown) => {
      if (!Array.isArray(tiers) || tiers.length === 0) return 'Không có'
      return `${tiers.length} mức`
    }
    const formatWorkingDays = (days: unknown) => {
      if (!Array.isArray(days) || days.length === 0) return 'Không có'
      const dayNames: Record<number, string> = { 0: 'CN', 1: 'T2', 2: 'T3', 3: 'T4', 4: 'T5', 5: 'T6', 6: 'T7' }
      return (days as number[]).map(d => dayNames[d] ?? d).join(', ')
    }

    for (const arrKey of ['latePenaltyTiers', 'earlyLeavePenaltyTiers', 'workingDays']) {
      const oldArr = JSON.stringify(oldSettings[arrKey] ?? [])
      const newArr = JSON.stringify(newSettings[arrKey] ?? [])
      if (oldArr !== newArr) {
        if (arrKey === 'workingDays') {
          changes['Ngày làm việc'] = { from: formatWorkingDays(oldSettings[arrKey]), to: formatWorkingDays(newSettings[arrKey]) }
        } else {
          const label = arrKey === 'latePenaltyTiers' ? 'Mức phạt đi muộn' : 'Mức phạt về sớm'
          changes[label] = { from: formatTiers(oldSettings[arrKey]), to: formatTiers(newSettings[arrKey]) }
        }
      }
    }

    // Check insurance/tax complex fields
    const insuranceKeys = ['insuranceRates', 'taxSettings']
    for (const key of insuranceKeys) {
      const oldVal = JSON.stringify(oldSettings[key] ?? {})
      const newVal = JSON.stringify(newSettings[key] ?? {})
      if (oldVal !== newVal) {
        const label = key === 'insuranceRates' ? 'Tỷ lệ bảo hiểm' : 'Cài đặt thuế'
        changes[label] = { from: 'Đã cập nhật', to: 'Đã thay đổi' }
      }
    }

    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      await createActivityLog({
        entityType: 'employee_settings',
        entityId: setting.systemId,
        action: `Cập nhật cài đặt nhân viên: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session.user?.id,
      }).catch(e => logError('[employee-settings] activity log failed', e))
    }

    cache.deletePattern('^settings:')
    return apiSuccess({ data: setting.value })
  } catch (error) {
    logError('Error saving employee settings', error)
    return apiError('Failed to save employee settings', 500)
  }
}

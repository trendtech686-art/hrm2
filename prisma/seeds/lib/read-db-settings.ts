/**
 * Đọc cài đặt đang có trong DB để dùng khi seed dữ liệu mẫu
 * (không ghi đè cấu hình anh/chị đã chỉnh trong Cài đặt).
 */
import type { Branch, PrismaClient } from '../../../generated/prisma/client'

export type StoreInfoValue = {
  brandName?: string
  companyName?: string
  hotline?: string
  email?: string
  website?: string
  taxCode?: string
  headquartersAddress?: string
  province?: string
  district?: string
  ward?: string
  representativeName?: string
  bankName?: string
  bankAccountNumber?: string
  bankAccountName?: string
  [key: string]: unknown
}

export async function loadStoreInfo(prisma: PrismaClient): Promise<StoreInfoValue | null> {
  const row = await prisma.setting.findUnique({
    where: { key_group: { key: 'store-info', group: 'store' } },
  })
  if (!row?.value || typeof row.value !== 'object' || row.value === null) return null
  return row.value as StoreInfoValue
}

/**
 * workEmail: local@<domain từ email công ty trong Cài đặt>, fallback company.com
 */
export function workEmailForSampleUser(local: string, store: StoreInfoValue | null): string {
  const safeLocal = local.replace(/[^a-z0-9._-]+/gi, '').toLowerCase() || 'user'
  const raw = String(store?.email ?? '').trim()
  if (raw.includes('@')) {
    const parts = raw.split('@')
    const domain = (parts[1] ?? '').trim()
    if (domain) return `${safeLocal}@${domain}`
  }
  return `${safeLocal}@company.com`
}

export async function getDefaultBranchForSeed(prisma: PrismaClient): Promise<Branch | null> {
  return (
    (await prisma.branch.findFirst({ where: { isDeleted: false, isDefault: true } })) ||
    (await prisma.branch.findFirst({ where: { isDeleted: false } }))
  )
}

/**
 * Gợi ý tên chi nhánh mẫu theo tên công ty từ Cài đặt (dùng cho seed-dev,…).
 */
export function defaultBranchNameFromStore(store: StoreInfoValue | null): string {
  const n = String(store?.companyName ?? store?.brandName ?? '').trim()
  if (n) return n.length > 60 ? `Chi nhánh ${n.slice(0, 57)}…` : `Chi nhánh ${n}`
  return 'Chi nhánh mặc định'
}

/** Đồng bộ tên chi nhánh chính (mặc định) với tên công ty trên `store-info` (sau khi vừa tạo store từ DB). */
export async function alignPrimaryBranchNameWithStore(
  prisma: PrismaClient,
  branchBusinessId = 'CN001',
) {
  const store = await loadStoreInfo(prisma)
  if (!store) return
  if (!String(store.companyName ?? '').trim() && !String(store.brandName ?? '').trim()) return
  const name = defaultBranchNameFromStore(store)
  await prisma.branch.updateMany({
    where: { id: branchBusinessId, isDeleted: false },
    data: { name },
  })
}

/**
 * Tạo payload `store-info` lần đầu: **không** dùng chuỗi mẫu trong file — lấy từ DB
 * (chi nhánh mặc định, user đăng nhập, nhân viên, …).
 * Gọi khi bảng `settings` chưa có bản ghi `store-info` (thường sau khi đã seed chi nhánh + user).
 */
export async function inferStoreInfoDefaultsForSeed(prisma: PrismaClient): Promise<Record<string, unknown>> {
  const branch = await getDefaultBranchForSeed(prisma)
  const branchName = (branch?.name ?? '').trim()

  const user = await prisma.user.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
    select: { email: true },
  })
  let email = (user?.email ?? '').trim()
  if (!email) {
    const emW = await prisma.employee.findMany({
      where: { isDeleted: false, workEmail: { not: null } },
      orderBy: { createdAt: 'asc' },
      take: 20,
      select: { workEmail: true },
    })
    const emp = emW.find((e) => (e.workEmail ?? '').trim() !== '')
    email = (emp?.workEmail ?? '').trim()
  }

  const phoneList = await prisma.employee.findMany({
    where: { isDeleted: false, phone: { not: null } },
    orderBy: { createdAt: 'asc' },
    take: 20,
    select: { phone: true },
  })
  const phoneFromEmployee = phoneList.find((e) => (e.phone ?? '').trim() !== '')
  const hotline = (branch?.phone ?? '').trim() || (phoneFromEmployee?.phone ?? '').trim()

  const isGenericBranch =
    !branchName ||
    /^chi nhánh mặc định$/i.test(branchName) ||
    /^chi nhánh$/i.test(branchName)
  const companyName = isGenericBranch ? '' : branchName.replace(/^chi nhánh\s+/i, '').trim() || branchName
  const brandName = companyName

  return {
    brandName,
    companyName,
    hotline,
    email,
    website: '',
    taxCode: '',
    note: '',
    registrationNumber: '',
    headquartersAddress: (branch?.address ?? '').trim(),
    province: (branch?.province ?? '').trim(),
    district: (branch?.district ?? '').trim(),
    ward: (branch?.ward ?? '').trim(),
    representativeName: '',
    representativeTitle: 'Giám đốc',
    bankName: '',
    bankAccountNumber: '',
    bankAccountName: '',
  }
}

/**
 * Tên / SĐT chi nhánh chính khi seed dev: từ DB (nhân viên) thay vì địa chỉ mẫu HN/HCM/ĐN.
 */
export async function inferPrimaryBranchForDevSeed(prisma: PrismaClient): Promise<{
  id: string
  name: string
  address: string
  phone: string
  isDefault: boolean
}> {
  const emp = await prisma.employee.findFirst({
    where: { isDeleted: false },
    orderBy: { createdAt: 'asc' },
    select: { phone: true },
  })
  const phone = (emp?.phone ?? '').trim()
  return {
    id: 'CN001',
    name: 'Chi nhánh mặc định',
    address: '',
    phone,
    isDefault: true,
  }
}

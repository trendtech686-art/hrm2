'use client'

import * as React from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  AlertTriangle,
  Trash2,
  Package,
  Users,
  ShoppingCart,
  ClipboardList,
  Shield,
  Loader2,
  Truck,
  Wallet,
  Bomb,
  ScrollText,
  RefreshCw,
  Sprout,
  KeyRound,
  MapPin,
  UserPlus,
  LockKeyhole,
  HeartPulse,
  Database,
  LogOut,
  Eye,
  EyeOff,
  Check,
  X,
  Server,
  Download,
  ShieldCheck,
  Clock,
  CalendarX2,
  Banknote,
  Ban,
  Tag,
  FolderTree,
  RotateCcw,
  FileCheck,
  ArrowRightLeft,
  TrendingDown,
  TrendingUp,
  BookOpen,
  ListTodo,
  MessageSquareWarning,
  BookText,
  Eraser,
  HardDrive,
  Rocket,
  DatabaseZap,
  Hammer,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { SettingsVerticalTabs } from '@/components/settings/SettingsVerticalTabs'
import { useSettingsPageHeader } from '../use-settings-page-header'
import { useAuth } from '@/contexts/auth-context'

// Query keys factory
export const adminToolsKeys = {
  all: ['admin-tools'] as const,
  counts: () => [...adminToolsKeys.all, 'counts'] as const,
};

// ============================================
// TYPES
// ============================================
type ActionType =
  | 'delete-products' | 'delete-customers' | 'delete-orders'
  | 'delete-purchase-orders' | 'delete-suppliers' | 'delete-finance'
  | 'delete-attendance' | 'delete-leaves' | 'delete-payroll' | 'delete-penalties'
  | 'delete-brands' | 'delete-categories'
  | 'delete-sales-returns' | 'delete-shipments' | 'delete-reconciliation'
  | 'delete-stock-transfers' | 'delete-inventory-checks'
  | 'delete-cost-adjustments' | 'delete-price-adjustments'
  | 'delete-cashbook' | 'delete-tasks' | 'delete-warranty'
  | 'delete-complaints' | 'delete-wiki'
  | 'purge-all-business-data' | 'delete-all-settings' | 'clear-activity-logs' | 'resync-meilisearch'
  | 'seed-all-settings' | 'seed-roles' | 'seed-admin-units' | 'seed-sample-employees'
  | 'reset-user-password' | 'system-health-check' | 'database-statistics'
  | 'force-logout-all' | 'export-db-backup' | 'permission-audit' | 'docker-prune'
  | 'check-disk' | 'clear-next-cache' | 'deploy-rebuild' | 'prisma-migrate' | 'prisma-db-push' | 'docker-builder-prune'

type Counts = {
  products: number; customers: number; orders: number; purchaseOrders: number
  suppliers: number; receipts: number; payments: number; activityLogs: number
  attendance: number; leaves: number; payrolls: number; penalties: number
  brands: number; categories: number; salesReturns: number; shipments: number
  packagings: number; reconciliation: number; stockTransfers: number
  inventoryChecks: number; costAdjustments: number; priceAdjustments: number
  cashAccounts: number; cashTransactions: number; tasks: number
  supplierWarranties: number; complaints: number; wiki: number
}

type ActionResult = {
  deleted?: number
  message: string
  details?: string[]
  status?: string
  checks?: Record<string, { status: string; detail: string }>
  stats?: Array<{ name: string; count: number }>
  total?: number
  dbSize?: string
  audit?: Array<{ user: string; role: string; permissions: number }>
  downloadUrl?: string
}

const CONFIRM_MAP: Record<ActionType, string> = {
  'delete-products': 'XÓA SẢN PHẨM',
  'delete-customers': 'XÓA KHÁCH HÀNG',
  'delete-orders': 'XÓA ĐƠN HÀNG',
  'delete-purchase-orders': 'XÓA ĐƠN NHẬP',
  'delete-suppliers': 'XÓA NHÀ CUNG CẤP',
  'delete-finance': 'XÓA TÀI CHÍNH',
  'delete-attendance': 'XÓA CHẤM CÔNG',
  'delete-leaves': 'XÓA NGHỈ PHÉP',
  'delete-payroll': 'XÓA BẢNG LƯƠNG',
  'delete-penalties': 'XÓA PHIẾU PHẠT',
  'delete-brands': 'XÓA THƯƠNG HIỆU',
  'delete-categories': 'XÓA DANH MỤC',
  'delete-sales-returns': 'XÓA TRẢ HÀNG',
  'delete-shipments': 'XÓA VẬN ĐƠN',
  'delete-reconciliation': 'XÓA ĐỐI SOÁT',
  'delete-stock-transfers': 'XÓA CHUYỂN KHO',
  'delete-inventory-checks': 'XÓA KIỂM KÊ',
  'delete-cost-adjustments': 'XÓA GIÁ VỐN',
  'delete-price-adjustments': 'XÓA GIÁ BÁN',
  'delete-cashbook': 'XÓA SỔ QUỸ',
  'delete-tasks': 'XÓA CÔNG VIỆC',
  'delete-warranty': 'XÓA BẢO HÀNH',
  'delete-complaints': 'XÓA KHIẾU NẠI',
  'delete-wiki': 'XÓA WIKI',
  'purge-all-business-data': 'XÓA TOÀN BỘ DỮ LIỆU',
  'delete-all-settings': 'XÓA CÀI ĐẶT',
  'clear-activity-logs': 'XÓA NHẬT KÝ',
  'resync-meilisearch': 'ĐỒNG BỘ LẠI',
  'seed-all-settings': 'TẠO CÀI ĐẶT',
  'seed-roles': 'TẠO VAI TRÒ',
  'seed-admin-units': 'TẠO ĐỊA CHỈ',
  'seed-sample-employees': 'TẠO NHÂN VIÊN',
  'reset-user-password': 'RESET MẬT KHẨU',
  'system-health-check': 'KIỂM TRA',
  'database-statistics': 'THỐNG KÊ',
  'force-logout-all': 'ĐĂNG XUẤT TẤT CẢ',
  'export-db-backup': 'XUẤT BACKUP',
  'permission-audit': 'KIỂM TRA',
  'docker-prune': 'DỌN DOCKER',
  'check-disk': 'KIỂM TRA',
  'clear-next-cache': 'XÓA CACHE APP',
  'deploy-rebuild': 'DEPLOY',
  'prisma-migrate': 'MIGRATE',
  'prisma-db-push': 'DB PUSH',
  'docker-builder-prune': 'DỌN BUILD CACHE',
}

type ActionConfig = {
  label: string
  icon: React.ElementType
  description: string
  warning: string
  countFn?: (c: Counts) => number
  variant?: 'destructive' | 'outline'
  buttonLabel?: string
  hasExtraInput?: boolean
  noConfirm?: boolean
}

const ACTION_CONFIG: Record<ActionType, ActionConfig> = {
  'delete-products': {
    label: 'Sản phẩm',
    icon: Package,
    description: 'Xóa toàn bộ sản phẩm, giá, tồn kho, lịch sử kho',
    warning: 'Xóa TẤT CẢ sản phẩm và dữ liệu liên quan. Đơn hàng sẽ mất liên kết sản phẩm.',
    countFn: (c) => c.products,
  },
  'delete-customers': {
    label: 'Khách hàng',
    icon: Users,
    description: 'Xóa toàn bộ khách hàng, bỏ liên kết công nợ',
    warning: 'Xóa TẤT CẢ khách hàng. Đơn hàng, phiếu thu/chi sẽ mất liên kết.',
    countFn: (c) => c.customers,
  },
  'delete-orders': {
    label: 'Đơn hàng bán',
    icon: ShoppingCart,
    description: 'Xóa toàn bộ đơn hàng, đơn trả, phiếu giao, đóng gói',
    warning: 'Xóa TẤT CẢ đơn hàng bán và dữ liệu liên quan.',
    countFn: (c) => c.orders,
  },
  'delete-purchase-orders': {
    label: 'Đơn nhập hàng',
    icon: ClipboardList,
    description: 'Xóa toàn bộ đơn nhập hàng, đơn trả NCC',
    warning: 'Xóa TẤT CẢ đơn nhập hàng và đơn trả NCC.',
    countFn: (c) => c.purchaseOrders,
  },
  'delete-suppliers': {
    label: 'Nhà cung cấp',
    icon: Truck,
    description: 'Xóa toàn bộ nhà cung cấp, bảo hành NCC',
    warning: 'Xóa TẤT CẢ nhà cung cấp. Đơn nhập sẽ mất liên kết.',
    countFn: (c) => c.suppliers,
  },
  'delete-finance': {
    label: 'Tài chính',
    icon: Wallet,
    description: 'Xóa toàn bộ phiếu thu/chi, thanh toán, giao dịch quỹ',
    warning: 'Xóa TẤT CẢ phiếu thu, chi, thanh toán và giao dịch quỹ.',
    countFn: (c) => c.receipts + c.payments,
  },
  'purge-all-business-data': {
    label: 'Xóa toàn bộ dữ liệu kinh doanh',
    icon: Bomb,
    description: 'Xóa TẤT CẢ dữ liệu. Chỉ giữ cài đặt, nhân viên, tài khoản',
    warning: 'Xóa TOÀN BỘ dữ liệu kinh doanh (5 phase FK-safe). Không thể khôi phục.',
  },
  'delete-all-settings': {
    label: 'Xóa toàn bộ cài đặt hệ thống',
    icon: Eraser,
    description: 'Xóa settings (JSON), loại thu-chi, PTTK, tài khoản quỹ, thuế, bảng giá, phòng ban/chức vụ cấu hình, mẫu in, cấu hình PKGX — không xóa user, role, nhân viên, chi nhánh, địa lý, dữ liệu KD',
    warning: 'Chỉ dùng khi cần test lại: sau đó chạy Khởi tạo (seed) để tạo lại. Giao dịch quỹ (nếu còn) cần xóa trước hoặc dùng cùng bước này (xóa cash_transaction).',
  },
  'clear-activity-logs': {
    label: 'Nhật ký hoạt động',
    icon: ScrollText,
    description: 'Xóa toàn bộ nhật ký hoạt động',
    warning: 'Xóa TẤT CẢ nhật ký. Không ảnh hưởng dữ liệu kinh doanh.',
    countFn: (c) => c.activityLogs,
  },
  'resync-meilisearch': {
    label: 'Đồng bộ Meilisearch',
    icon: RefreshCw,
    description: 'Đồng bộ lại toàn bộ index tìm kiếm',
    warning: 'Xóa và đồng bộ lại toàn bộ index. Tìm kiếm có thể chậm vài giây.',
    variant: 'outline',
    buttonLabel: 'Đồng bộ',
  },
  // === HR ===
  'delete-attendance': {
    label: 'Chấm công',
    icon: Clock,
    description: 'Xóa toàn bộ bản ghi chấm công',
    warning: 'Xóa TẤT CẢ bản ghi chấm công. Không ảnh hưởng nhân viên.',
    countFn: (c) => c.attendance,
  },
  'delete-leaves': {
    label: 'Nghỉ phép',
    icon: CalendarX2,
    description: 'Xóa toàn bộ đơn nghỉ phép',
    warning: 'Xóa TẤT CẢ đơn nghỉ phép.',
    countFn: (c) => c.leaves,
  },
  'delete-payroll': {
    label: 'Bảng lương',
    icon: Banknote,
    description: 'Xóa toàn bộ bảng lương và chi tiết',
    warning: 'Xóa TẤT CẢ bảng lương và payroll items.',
    countFn: (c) => c.payrolls,
  },
  'delete-penalties': {
    label: 'Phiếu phạt',
    icon: Ban,
    description: 'Xóa toàn bộ phiếu phạt',
    warning: 'Xóa TẤT CẢ phiếu phạt.',
    countFn: (c) => c.penalties,
  },
  // === BUSINESS ===
  'delete-brands': {
    label: 'Thương hiệu',
    icon: Tag,
    description: 'Xóa toàn bộ thương hiệu, unlink sản phẩm',
    warning: 'Xóa TẤT CẢ thương hiệu. Sản phẩm sẽ mất liên kết brand.',
    countFn: (c) => c.brands,
  },
  'delete-categories': {
    label: 'Danh mục sản phẩm',
    icon: FolderTree,
    description: 'Xóa toàn bộ danh mục và liên kết',
    warning: 'Xóa TẤT CẢ danh mục. Sản phẩm sẽ mất liên kết category.',
    countFn: (c) => c.categories,
  },
  // === SALES ===
  'delete-sales-returns': {
    label: 'Đơn trả hàng',
    icon: RotateCcw,
    description: 'Xóa toàn bộ đơn trả hàng bán',
    warning: 'Xóa TẤT CẢ đơn trả hàng và chi tiết.',
    countFn: (c) => c.salesReturns,
  },
  'delete-shipments': {
    label: 'Vận đơn & Đóng gói',
    icon: Truck,
    description: 'Xóa toàn bộ vận đơn và phiếu đóng gói',
    warning: 'Xóa TẤT CẢ vận đơn + đóng gói.',
    countFn: (c) => c.shipments + c.packagings,
  },
  'delete-reconciliation': {
    label: 'Đối soát COD',
    icon: FileCheck,
    description: 'Xóa toàn bộ phiếu đối soát COD',
    warning: 'Xóa TẤT CẢ phiếu đối soát và chi tiết.',
    countFn: (c) => c.reconciliation,
  },
  // === INVENTORY ===
  'delete-stock-transfers': {
    label: 'Chuyển kho',
    icon: ArrowRightLeft,
    description: 'Xóa toàn bộ phiếu chuyển kho',
    warning: 'Xóa TẤT CẢ phiếu chuyển kho và chi tiết.',
    countFn: (c) => c.stockTransfers,
  },
  'delete-inventory-checks': {
    label: 'Kiểm kê',
    icon: ClipboardList,
    description: 'Xóa toàn bộ phiếu kiểm kê định kỳ',
    warning: 'Xóa TẤT CẢ phiếu kiểm kê và chi tiết.',
    countFn: (c) => c.inventoryChecks,
  },
  'delete-cost-adjustments': {
    label: 'Điều chỉnh giá vốn',
    icon: TrendingDown,
    description: 'Xóa toàn bộ phiếu điều chỉnh giá vốn',
    warning: 'Xóa TẤT CẢ phiếu điều chỉnh giá vốn và chi tiết.',
    countFn: (c) => c.costAdjustments,
  },
  'delete-price-adjustments': {
    label: 'Điều chỉnh giá bán',
    icon: TrendingUp,
    description: 'Xóa toàn bộ phiếu điều chỉnh giá bán',
    warning: 'Xóa TẤT CẢ phiếu điều chỉnh giá bán và chi tiết.',
    countFn: (c) => c.priceAdjustments,
  },
  // === FINANCE ===
  'delete-cashbook': {
    label: 'Sổ quỹ',
    icon: BookOpen,
    description: 'Xóa toàn bộ tài khoản quỹ và giao dịch',
    warning: 'Xóa TẤT CẢ tài khoản quỹ và giao dịch quỹ.',
    countFn: (c) => c.cashAccounts + c.cashTransactions,
  },
  // === OPERATIONS ===
  'delete-tasks': {
    label: 'Công việc',
    icon: ListTodo,
    description: 'Xóa toàn bộ công việc và bảng công việc',
    warning: 'Xóa TẤT CẢ task và task board.',
    countFn: (c) => c.tasks,
  },
  'delete-warranty': {
    label: 'Bảo hành NCC',
    icon: ShieldCheck,
    description: 'Xóa toàn bộ phiếu bảo hành nhà cung cấp',
    warning: 'Xóa TẤT CẢ phiếu bảo hành NCC và chi tiết.',
    countFn: (c) => c.supplierWarranties,
  },
  'delete-complaints': {
    label: 'Khiếu nại',
    icon: MessageSquareWarning,
    description: 'Xóa toàn bộ khiếu nại',
    warning: 'Xóa TẤT CẢ khiếu nại.',
    countFn: (c) => c.complaints,
  },
  'delete-wiki': {
    label: 'Wiki nội bộ',
    icon: BookText,
    description: 'Xóa toàn bộ bài wiki nội bộ',
    warning: 'Xóa TẤT CẢ bài viết wiki.',
    countFn: (c) => c.wiki,
  },
  'seed-all-settings': {
    label: 'Cài đặt mặc định',
    icon: Sprout,
    description: 'Tạo 19 nhóm cài đặt hệ thống',
    warning: 'Tạo/cập nhật cài đặt mặc định. An toàn — dùng upsert.',
    variant: 'outline',
    buttonLabel: 'Khởi tạo',
  },
  'seed-roles': {
    label: 'Vai trò mặc định',
    icon: KeyRound,
    description: 'Tạo 4 vai trò: Admin, Manager, Staff, Viewer',
    warning: 'Tạo/cập nhật 4 vai trò hệ thống. An toàn.',
    variant: 'outline',
    buttonLabel: 'Khởi tạo',
  },
  'seed-admin-units': {
    label: 'Đơn vị hành chính',
    icon: MapPin,
    description: 'Tạo danh sách tỉnh/huyện/xã (~13.000 bản ghi)',
    warning: 'Tạo đơn vị hành chính. Có thể mất 30-60 giây.',
    variant: 'outline',
    buttonLabel: 'Khởi tạo',
  },
  'seed-sample-employees': {
    label: 'Nhân viên mẫu',
    icon: UserPlus,
    description: 'Tạo 6 nhân viên mẫu cho test',
    warning: 'Tạo/cập nhật 6 nhân viên mẫu. An toàn.',
    variant: 'outline',
    buttonLabel: 'Khởi tạo',
  },

  'system-health-check': {
    label: 'Kiểm tra hệ thống',
    icon: HeartPulse,
    description: 'Kiểm tra DB, Meilisearch, disk, memory, uptime',
    warning: '',
    variant: 'outline',
    buttonLabel: 'Kiểm tra',
    noConfirm: true,
  },
  'database-statistics': {
    label: 'Thống kê Database',
    icon: Database,
    description: 'Xem số bản ghi mỗi bảng, dung lượng',
    warning: '',
    variant: 'outline',
    buttonLabel: 'Xem',
    noConfirm: true,
  },
  'reset-user-password': {
    label: 'Reset mật khẩu',
    icon: LockKeyhole,
    description: 'Đặt lại mật khẩu cho tài khoản',
    warning: 'Đặt mật khẩu mới. Không gửi email — cần thông báo thủ công.',
    variant: 'outline',
    buttonLabel: 'Reset',
    hasExtraInput: true,
  },
  'force-logout-all': {
    label: 'Force đăng xuất',
    icon: LogOut,
    description: 'Đánh dấu tất cả session cần đăng nhập lại',
    warning: 'JWT stateless — session hiện tại vẫn hoạt động đến hết 24h.',
    variant: 'outline',
    buttonLabel: 'Logout all',
  },
  'export-db-backup': {
    label: 'Xuất backup Database',
    icon: Download,
    description: 'Xuất file JSON backup toàn bộ dữ liệu chính',
    warning: '',
    variant: 'outline',
    buttonLabel: 'Xuất',
    noConfirm: true,
  },
  'permission-audit': {
    label: 'Kiểm tra phân quyền',
    icon: ShieldCheck,
    description: 'Xem tổng quan phân quyền tất cả user',
    warning: '',
    variant: 'outline',
    buttonLabel: 'Kiểm tra',
    noConfirm: true,
  },
  'docker-prune': {
    label: 'Dọn dẹp Docker',
    icon: Trash2,
    description: 'Yêu cầu lệnh docker trên server. Xóa images, containers, volumes không dùng (docker system prune -a -f --volumes).',
    warning: 'VPS chỉ Node/PM2 (không Docker) sẽ báo lỗi — dùng "Xóa cache build Next.js". Xóa mạnh: cần build lại image sau.',
    variant: 'outline',
    buttonLabel: 'Dọn dẹp',
  },
  'check-disk': {
    label: 'Kiểm tra Disk',
    icon: HardDrive,
    description: 'Xem dung lượng ổ đĩa, phân vùng (df -h)',
    warning: '',
    variant: 'outline',
    buttonLabel: 'Kiểm tra',
    noConfirm: true,
  },
  'clear-next-cache': {
    label: 'Xóa cache build Next.js',
    icon: FolderTree,
    description: 'Xóa thư mục .next và node_modules/.cache trong thư mục ứng dụng (phù hợp VPS PM2/aaPanel, không cần Docker).',
    warning: 'Lần chạy tiếp theo sẽ build lại — nên restart PM2/systemd sau khi xóa.',
    variant: 'outline',
    buttonLabel: 'Xóa cache',
  },
  'deploy-rebuild': {
    label: 'Deploy & Rebuild',
    icon: Rocket,
    description: 'git pull + docker compose build + restart app',
    warning: 'Git pull origin main rồi rebuild Docker. App sẽ khởi động lại.',
    variant: 'outline',
    buttonLabel: 'Deploy',
  },
  'prisma-migrate': {
    label: 'Prisma Migrate',
    icon: DatabaseZap,
    description: 'Chạy prisma migrate deploy — apply migration mới',
    warning: 'Apply tất cả pending migrations. An toàn nếu migration đã được tạo đúng.',
    variant: 'outline',
    buttonLabel: 'Migrate',
  },
  'prisma-db-push': {
    label: 'Prisma DB Push',
    icon: DatabaseZap,
    description: 'Đồng bộ schema Prisma vào DB (prisma db push)',
    warning: 'Push schema trực tiếp vào DB. Có thể mất dữ liệu nếu thay đổi cột.',
    variant: 'outline',
    buttonLabel: 'Push',
  },
  'docker-builder-prune': {
    label: 'Dọn Build Cache',
    icon: Hammer,
    description: 'Yêu cầu Docker. Prune >24h + docker builder prune (không ảnh hưởng DB).',
    warning: 'Không có Docker trên server thì dùng "Xóa cache build Next.js".',
    variant: 'outline',
    buttonLabel: 'Dọn dẹp',
  },
}

// Tab groupings — Delete sub-sections
const HR_DELETE: ActionType[] = ['delete-attendance', 'delete-leaves', 'delete-payroll', 'delete-penalties']
const BUSINESS_DELETE: ActionType[] = ['delete-products', 'delete-customers', 'delete-brands', 'delete-categories']
const SALES_DELETE: ActionType[] = ['delete-orders', 'delete-sales-returns', 'delete-shipments', 'delete-reconciliation']
const PURCHASE_DELETE: ActionType[] = ['delete-purchase-orders', 'delete-suppliers']
const INVENTORY_DELETE: ActionType[] = ['delete-stock-transfers', 'delete-inventory-checks', 'delete-cost-adjustments', 'delete-price-adjustments']
const FINANCE_DELETE: ActionType[] = ['delete-finance', 'delete-cashbook']
const OPERATIONS_DELETE: ActionType[] = ['delete-tasks', 'delete-warranty', 'delete-complaints', 'delete-wiki']
const BULK_ACTIONS: ActionType[] = [
  'purge-all-business-data',
  'delete-all-settings',
  'clear-activity-logs',
  'resync-meilisearch',
]

const SYSTEM_ACTIONS: ActionType[] = [
  'system-health-check', 'database-statistics', 'check-disk', 'clear-next-cache', 'export-db-backup', 'permission-audit',
  'reset-user-password', 'force-logout-all',
  'deploy-rebuild', 'prisma-migrate', 'prisma-db-push',
  'docker-prune', 'docker-builder-prune',
]
const SEED_ACTIONS: ActionType[] = [
  'seed-all-settings', 'seed-roles', 'seed-admin-units', 'seed-sample-employees',
]

type TabValue = 'delete' | 'system' | 'seed'

const TABS: { value: TabValue; label: React.ReactNode }[] = [
  { value: 'delete', label: <span className="flex items-center gap-2"><Trash2 className="h-4 w-4" />Xóa dữ liệu</span> },
  { value: 'system', label: <span className="flex items-center gap-2"><Server className="h-4 w-4" />Hệ thống</span> },
  { value: 'seed', label: <span className="flex items-center gap-2"><Sprout className="h-4 w-4" />Khởi tạo</span> },
]

// ============================================
// API FUNCTIONS
// ============================================
async function fetchCounts(): Promise<Counts> {
  const res = await fetch('/api/admin-tools')
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || json.message || 'Không thể tải dữ liệu')
  return json
}

async function executeAction(action: ActionType, confirmText: string, extra?: Record<string, string>): Promise<ActionResult> {
  const res = await fetch('/api/admin-tools', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, confirmText, extra }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || json.message || 'Có lỗi xảy ra')
  return json
}

// ============================================
// MAIN COMPONENT
// ============================================
type ResultKind = 'health' | 'stats' | 'audit' | 'log'
type ResultState = {
  kind: ResultKind
  title: string
  data: ActionResult
} | null

export function AdminToolsPage() {
  const { isAdmin } = useAuth()
  const [activeTab, setActiveTab] = React.useState<TabValue>('delete')
  const [confirmDialog, setConfirmDialog] = React.useState<ActionType | null>(null)
  const [confirmInput, setConfirmInput] = React.useState('')
  const [resetEmail, setResetEmail] = React.useState('')
  const [resetPassword, setResetPassword] = React.useState('')
  const [showResetPassword, setShowResetPassword] = React.useState(false)
  const [resultDialog, setResultDialog] = React.useState<ResultState>(null)
  const [loadingInline, setLoadingInline] = React.useState<ActionType | null>(null)

  useSettingsPageHeader({
    title: 'Công cụ quản trị',
    icon: <Shield className="h-5 w-5" />,
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Cài đặt', href: '/settings' },
      { label: 'Công cụ quản trị', href: '/settings/admin-tools', isCurrent: true },
    ],
  })

  const countsQuery = useQuery({
    queryKey: adminToolsKeys.counts(),
    queryFn: fetchCounts,
    enabled: isAdmin,
  })

  const actionMutation = useMutation({
    mutationFn: ({ action, confirmText, extra }: { action: ActionType; confirmText: string; extra?: Record<string, string> }) =>
      executeAction(action, confirmText, extra),
    onSuccess: (data, variables) => {
      toast.success(data.message)
      if (data.details) {
        // Show details as popup for system actions with log output
        const systemLogActions: ActionType[] = ['deploy-rebuild', 'prisma-migrate', 'prisma-db-push', 'docker-prune', 'docker-builder-prune', 'clear-next-cache']
        if (systemLogActions.includes(variables.action)) {
          setResultDialog({
            kind: 'log',
            title: ACTION_CONFIG[variables.action]?.label ?? data.message,
            data,
          })
        } else {
          data.details.forEach((d) => toast.info(d))
        }
      }
      setConfirmDialog(null)
      setConfirmInput('')
      setResetEmail('')
      setResetPassword('')
      countsQuery.refetch()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const openConfirm = (action: ActionType) => {
    if (ACTION_CONFIG[action].noConfirm) {
      runInlineAction(action)
      return
    }
    setConfirmInput('')
    setResetEmail('')
    setResetPassword('')
    setConfirmDialog(action)
  }

  const runInlineAction = async (action: ActionType) => {
    setLoadingInline(action)
    try {
      const result = await executeAction(action, CONFIRM_MAP[action])
      const title = ACTION_CONFIG[action]?.label ?? result.message
      if (action === 'system-health-check') {
        setResultDialog({ kind: 'health', title, data: result })
      } else if (action === 'database-statistics') {
        setResultDialog({ kind: 'stats', title, data: result })
      } else if (action === 'permission-audit') {
        setResultDialog({ kind: 'audit', title, data: result })
      } else if (action === 'check-disk' && result.details) {
        setResultDialog({ kind: 'log', title, data: result })
      } else if (action === 'export-db-backup' && result.downloadUrl) {
        window.open(result.downloadUrl, '_blank')
      }
      toast.success(result.message)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi')
    } finally {
      setLoadingInline(null)
    }
  }

  const handleExecute = () => {
    if (!confirmDialog) return
    const extra = confirmDialog === 'reset-user-password'
      ? { email: resetEmail, newPassword: resetPassword }
      : undefined
    actionMutation.mutate({ action: confirmDialog, confirmText: confirmInput, extra })
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center py-20">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <Shield className="h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground">
              Chỉ Admin mới có quyền truy cập công cụ quản trị.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const counts = countsQuery.data

  return (
    <div className="space-y-4">
      <SettingsVerticalTabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabValue)}
        tabs={TABS}
        listClassName="md:w-[180px]"
      >
        {/* === TAB: Xóa dữ liệu === */}
        {activeTab === 'delete' && (
          <div className="space-y-6">
            <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Xóa dữ liệu <strong className="text-destructive">vĩnh viễn</strong> và không thể khôi phục. Hãy sao lưu trước.
              </p>
            </div>

            <SectionHeader>Nhân sự</SectionHeader>
            <ActionList actions={HR_DELETE} counts={counts} isLoading={countsQuery.isLoading} isPending={actionMutation.isPending} onConfirm={openConfirm} />

            <SectionHeader>Kinh doanh</SectionHeader>
            <ActionList actions={BUSINESS_DELETE} counts={counts} isLoading={countsQuery.isLoading} isPending={actionMutation.isPending} onConfirm={openConfirm} />

            <SectionHeader>Bán hàng</SectionHeader>
            <ActionList actions={SALES_DELETE} counts={counts} isLoading={countsQuery.isLoading} isPending={actionMutation.isPending} onConfirm={openConfirm} />

            <SectionHeader>Mua hàng</SectionHeader>
            <ActionList actions={PURCHASE_DELETE} counts={counts} isLoading={countsQuery.isLoading} isPending={actionMutation.isPending} onConfirm={openConfirm} />

            <SectionHeader>Kho vận</SectionHeader>
            <ActionList actions={INVENTORY_DELETE} counts={counts} isLoading={countsQuery.isLoading} isPending={actionMutation.isPending} onConfirm={openConfirm} />

            <SectionHeader>Tài chính</SectionHeader>
            <ActionList actions={FINANCE_DELETE} counts={counts} isLoading={countsQuery.isLoading} isPending={actionMutation.isPending} onConfirm={openConfirm} />

            <SectionHeader>Vận hành</SectionHeader>
            <ActionList actions={OPERATIONS_DELETE} counts={counts} isLoading={countsQuery.isLoading} isPending={actionMutation.isPending} onConfirm={openConfirm} />

            <Separator />
            <ActionList actions={BULK_ACTIONS} counts={counts} isLoading={countsQuery.isLoading} isPending={actionMutation.isPending} onConfirm={openConfirm} />
          </div>
        )}

        {/* === TAB: Hệ thống === */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <ActionList actions={SYSTEM_ACTIONS} counts={counts} isLoading={countsQuery.isLoading} isPending={actionMutation.isPending} loadingInline={loadingInline} onConfirm={openConfirm} />
          </div>
        )}

        {/* === TAB: Khởi tạo === */}
        {activeTab === 'seed' && (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Tạo dữ liệu mặc định. An toàn — dùng upsert, không xóa dữ liệu cũ.
            </p>
            <ActionList actions={SEED_ACTIONS} counts={counts} isLoading={countsQuery.isLoading} isPending={actionMutation.isPending} onConfirm={openConfirm} />
          </div>
        )}
      </SettingsVerticalTabs>

      {/* Confirm Dialog */}
      <Dialog open={!!confirmDialog} onOpenChange={(open) => {
        if (!open && !actionMutation.isPending) {
          setConfirmDialog(null)
          setConfirmInput('')
        }
      }}>
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={(e) => { if (actionMutation.isPending) e.preventDefault() }}
          onEscapeKeyDown={(e) => { if (actionMutation.isPending) e.preventDefault() }}
        >
          {confirmDialog && (() => {
            const config = ACTION_CONFIG[confirmDialog]
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    {config.label}
                  </DialogTitle>
                  <DialogDescription className="text-left">
                    {config.warning}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-2">
                  {config.countFn && counts && (
                    <div className="rounded-md border p-3 text-sm">
                      Bản ghi bị ảnh hưởng: <strong>{config.countFn(counts).toLocaleString('vi-VN')}</strong>
                    </div>
                  )}

                  {confirmDialog === 'reset-user-password' && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="reset-email" className="text-sm">Email</Label>
                        <Input id="reset-email" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="user@company.com" disabled={actionMutation.isPending} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="reset-password" className="text-sm">Mật khẩu mới</Label>
                        <div className="relative">
                          <Input id="reset-password" type={showResetPassword ? 'text' : 'password'} value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} placeholder="Ít nhất 6 ký tự" disabled={actionMutation.isPending} />
                          <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowResetPassword(!showResetPassword)} tabIndex={-1}>
                            {showResetPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="confirm-text" className="text-sm">
                      Nhập <code className="rounded bg-muted px-1.5 py-0.5 font-semibold">{CONFIRM_MAP[confirmDialog]}</code> để xác nhận
                    </Label>
                    <Input id="confirm-text" value={confirmInput} onChange={(e) => setConfirmInput(e.target.value)} placeholder={CONFIRM_MAP[confirmDialog]} disabled={actionMutation.isPending} autoComplete="off" autoFocus />
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="outline" onClick={() => { setConfirmDialog(null); setConfirmInput('') }} disabled={actionMutation.isPending}>Hủy</Button>
                  <Button
                    variant={config.variant || 'destructive'}
                    onClick={handleExecute}
                    disabled={confirmInput !== CONFIRM_MAP[confirmDialog] || actionMutation.isPending || (confirmDialog === 'reset-user-password' && (!resetEmail || resetPassword.length < 6))}
                  >
                    {actionMutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Đang xử lý...</> : 'Xác nhận'}
                  </Button>
                </DialogFooter>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>

      {/* Result Dialog (system-health, db-stats, permission-audit, log output) */}
      <Dialog open={!!resultDialog} onOpenChange={(open) => { if (!open) setResultDialog(null) }}>
        <DialogContent className="sm:max-w-lg">
          {resultDialog && (
            <>
              <DialogHeader>
                <DialogTitle>{resultDialog.title}</DialogTitle>
                {resultDialog.data.message && (
                  <DialogDescription className="text-left">{resultDialog.data.message}</DialogDescription>
                )}
              </DialogHeader>
              <ResultContent state={resultDialog} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setResultDialog(null)}>Đóng</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{children}</p>
}

function ResultContent({ state }: { state: NonNullable<ResultState> }) {
  const { kind, data } = state
  if (kind === 'health' && data.checks) {
    return (
      <div className="space-y-1 max-h-[60vh] overflow-auto">
        <div className="flex items-center justify-between pb-2">
          <p className="text-sm font-medium">Trạng thái</p>
          <Badge variant={data.status === 'healthy' ? 'default' : 'destructive'}>
            {data.status === 'healthy' ? 'Healthy' : 'Degraded'}
          </Badge>
        </div>
        {Object.entries(data.checks).map(([key, check]) => (
          <div key={key} className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
            <span className="capitalize">{key.replace('-', ' ')}</span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              {check.status === 'ok'
                ? <Check className="h-3.5 w-3.5 text-green-600" />
                : <X className="h-3.5 w-3.5 text-destructive" />}
              {check.detail}
            </span>
          </div>
        ))}
      </div>
    )
  }
  if (kind === 'stats' && data.stats) {
    return (
      <div className="space-y-1 max-h-[60vh] overflow-auto">
        <div className="flex items-center justify-between pb-2">
          <p className="text-sm font-medium">Database size</p>
          <Badge variant="secondary">{data.dbSize}</Badge>
        </div>
        {data.stats.map((s) => (
          <div key={s.name} className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
            <span>{s.name}</span>
            <span className="font-mono text-muted-foreground">{s.count.toLocaleString('vi-VN')}</span>
          </div>
        ))}
        <div className="flex items-center justify-between text-sm py-1.5 font-medium">
          <span>Tổng cộng</span>
          <span className="font-mono">{data.total?.toLocaleString('vi-VN')}</span>
        </div>
      </div>
    )
  }
  if (kind === 'audit' && data.audit) {
    return (
      <div className="space-y-1 max-h-[60vh] overflow-auto">
        {data.audit.map((u) => (
          <div key={u.user} className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
            <span>{u.user} <span className="text-muted-foreground">({u.role})</span></span>
            <Badge variant="secondary">{u.permissions} quyền</Badge>
          </div>
        ))}
      </div>
    )
  }
  if (kind === 'log' && data.details) {
    return (
      <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono bg-muted/50 rounded-md p-3 max-h-[60vh] overflow-auto">
        {data.details.join('\n')}
      </pre>
    )
  }
  return null
}

function ActionList({ actions, counts, isLoading, isPending, loadingInline, onConfirm }: {
  actions: ActionType[]
  counts: Counts | undefined
  isLoading: boolean
  isPending: boolean
  loadingInline?: ActionType | null
  onConfirm: (action: ActionType) => void
}) {
  return (
    <div className="rounded-lg border divide-y">
      {actions.map((action) => (
        <ActionRow key={action} action={action} counts={counts} isLoading={isLoading} isPending={isPending || loadingInline === action} onConfirm={onConfirm} />
      ))}
    </div>
  )
}

function ActionRow({ action, counts, isLoading, isPending, onConfirm }: {
  action: ActionType
  counts: Counts | undefined
  isLoading: boolean
  isPending: boolean
  onConfirm: (action: ActionType) => void
}) {
  const config = ACTION_CONFIG[action]
  const Icon = config.icon
  const count = config.countFn && counts ? config.countFn(counts) : null
  const isDisabled = (count !== null && count === 0) || isPending

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{config.label}</span>
          {count !== null && (
            <Badge variant="secondary" className="text-xs font-mono">
              {isLoading ? '...' : count.toLocaleString('vi-VN')}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">{config.description}</p>
      </div>
      <Button variant={config.variant || 'destructive'} size="sm" onClick={() => onConfirm(action)} disabled={isDisabled}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : config.buttonLabel || 'Xóa'}
      </Button>
    </div>
  )
}

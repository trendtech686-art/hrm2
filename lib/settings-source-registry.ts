/**
 * Canonical data sources for settings / master data (runtime).
 * When adding a feature, read from exactly one of these; do not write the same
 * business concept to two stores.
 *
 * "Dual risk" = two different tables or blobs can hold a similar name/reason; teams should consolidate or clearly separate the product role of each.
 */

export const SETTINGS_HUB = {
  /** Cards on /settings (features/settings/page.tsx) — for navigation, not a DB mapping */
  topLevelPages: {
    'store-info': { title: 'Thông tin cửa hàng' },
    provinces: { title: 'Tỉnh thành - Quận huyện' },
    'employee-roles': { title: 'Nhân viên & Phân quyền' },
    employees: { title: 'Cài đặt nhân viên' },
    'sales-config': { title: 'Cấu hình bán hàng' },
    customers: { title: 'Cài đặt khách hàng' },
    inventory: { title: 'Quản lý kho & Sản phẩm' },
    pricing: { title: 'Chính sách giá' },
    payments: { title: 'Cài đặt thanh toán' },
    notifications: { title: 'Thông báo' },
    pkgx: { title: 'Website PKGX' },
    trendtech: { title: 'Website Trendtech' },
    shipping: { title: 'Cài đặt vận chuyển' },
    tasks: { title: 'Công việc' },
    complaints: { title: 'Khiếu nại' },
    warranty: { title: 'Bảo hành' },
    'workflow-templates': { title: 'Quy trình' },
    'print-templates': { title: 'Mẫu in' },
    'import-export-logs': { title: 'Lịch sử nhập xuất' },
    'system-logs': { title: 'Nhật ký hệ thống' },
    appearance: { title: 'Giao diện' },
    'admin-tools': { title: 'Công cụ quản trị' },
    other: { title: 'Cài đặt khác' },
  },
} as const

/**
 * What to query for each domain. Prefer the dedicated Prisma model / API when it exists.
 */
export const CANONICAL_BY_DOMAIN = {
  tax: { store: 'prisma.tax', api: 'GET /api/settings/taxes', notes: 'Bảng tax; tránh tạo thêm bản ghi “tax” trùng ý nghĩa trong settings_data (generic /api/settings/data còn liệt kê type tax lịch sử).' },
  salesChannel: { store: 'prisma.salesChannel', api: 'GET /api/settings/sales-channels' },
  shippingPartner: { store: 'prisma.shippingPartner', api: 'GET /api/settings/shipping-partners' },
  pricingPolicy: { store: 'prisma.pricingPolicy', api: 'GET /api/settings/pricing-policies' },
  paymentMethod: { store: 'prisma.paymentMethod', api: 'GET /api/settings/payment-methods', notes: 'Một nguồn; đã tách khỏi blob payment_types trong settings_data.' },
  cashAccount: { store: 'prisma.cashAccount', api: 'GET /api/cash-accounts' },
  receiptType: { store: "settingsData type 'receipt-type'", api: 'GET /api/settings/receipt-types' },
  paymentType: { store: "settingsData type 'payment-type'", api: 'GET /api/settings/payment-types' },
  targetGroup: { store: "settingsData type 'target-group'", api: 'GET /api/settings/target-groups' },
  productType: { store: "settingsData type 'product-type'", api: 'GET /api/settings/product-types' },
  customerGroup: { store: 'prisma.customerSetting (type customer-group)', api: 'GET /api/settings/customers/groups' },
  customerType: { store: 'prisma.customerSetting (type customer-type)', api: 'GET /api/settings/customers/types' },
  leaveType: { store: "settingsData type 'leave_type'", api: 'GET /api/settings/employees/leave-types' },
  salaryComponent: { store: "settingsData type 'salary_component'", api: 'GET /api/settings/employees/salary-components' },
  importer: { store: "settingsData type 'importer'", api: 'GET /api/settings/inventory/importers' },
} as const

/**
 * Confirmed or likely dual-identity areas — plan consolidation or rename UI so users devs are not writing to both.
 */
export const DUAL_SOURCE_RISKS: Array<{
  id: string
  a: string
  b: string
  productNote: string
}> = [
  {
    id: 'storage-vs-stock-location',
    a: "Đã hợp nhất: /api/storage-locations thao tác trên bảng stock_locations (cùng SSOT với vị trí kho).",
    b: 'Dữ liệu cũ `settings_data` type storage-location: chạy scripts/migrate-settings-storage-to-stock-locations.ts nếu còn.',
    productNote: 'Hai màn hình (cài đặt vs trang vị trí) vẫn tồn tại nhưng cùng nguồn DB.',
  },
  {
    id: 'generic-settings-data',
    a: "POST /api/settings/data: chỉ còn type `custom-field` (xem validation).",
    b: "GET: vẫn lọc theo bất kỳ type (đọc legacy).",
    productNote: 'Dùng API chuyên khi tạo master; không tạo tax/sales-channel/... qua generic.',
  },
  {
    id: 'setting-blob',
    a: "bảng settings (key/group JSON) dùng cho nhiều cấu hình — ví dụ store-info, global",
    b: "settingsData dòng-level + bảng domain",
    productNote: 'Bình thường có 3 tầng (Setting JSON / settingsData / bảng domain); mỗi *khái niệm* phải chọn 1 tầng ghi.',
  },
  {
    id: 'penalty-and-task-in-valid-types',
    a: "Đã cấm POST generic cho penalty/task; dùng API chuyên.",
    b: "prisma.penaltyTypeSetting + /api/penalty-types; prisma.taskTemplate + /api/tasks/templates",
    productNote: 'Các dòng legacy cũ chỉ còn trong settings_data nếu chưa dọn; POST mới không tạo tại đây.',
  },
  {
    id: 'settings-data-payment-method-rows',
    a: "Seed/legacy: settings_data với type 'payment-method' (không còn đọc trong app sau khi chuyển payment_methods)",
    b: "prisma.paymentMethod",
    productNote: 'Dọn DB + cập nhật seed; đảm bảo không còn ghi PTTT vào settings_data.',
  },
  {
    id: 'penalty-types-two-api-routes',
    a: "GET/POST /api/penalty-types (canonical import trong code)",
    b: "GET/POST /api/penalties/types re-export từ penalty-types (cùng implementation)",
    productNote: 'Một bảng, một implement.',
  },
  {
    id: 'complaint-type-settings',
    a: "complaintTypeSetting + /api/complaint-types",
    b: "Không dùng settings_data /api/settings/data cho loại khiếu nại",
    productNote: 'Không thấy trùng; giữ bảng riêng.',
  },
]

/**
 * Bản rà bổ sung (2026): ràng buộc còn lại / cần ý thức.
 */
export const AUDIT_FOLLOWUP = {
  getAllSettingsMap: 'Nếu nhiều bản cùng type trong settings_data, reduce() chỉ giữ 1 (metadata) — tránh dùng như sự thật cho master nhiều dòng.',
  getSettingsByType: 'findFirst theo type — chỉ hợp nếu type là singleton; không dùng cho danh sách (receipt-type, ...).',
  patchSettingsDataById: 'PATCH theo systemId vẫn cập nhật mọi type — cần hạn chế quyền/role.',
  libDataConsolidation: 'getCompanyInfo, getShippingSettings, getTaxSettings: store-info + shipping-settings (setting.key/group) + taxes — không còn blob settings_data cho company/shipping/tax_settings trong lib.',
} as const

/**
 * Các bước rà toàn mã nguồn (5–8 file mỗi phase): server actions + API + lib; grep nhiều mẫu
 * (settingsData, "type: ''", prisma.settingsData, getSettingsByType, fallback 404, LEGACY).
 */
export const CROSS_MODULE_AUDIT_PHASES = [
  'Phase 1: app/actions — warranty, thu-chi, đơn hàng, import (lookup chi nhánh = prisma.branch, không type branches trên settings_data).',
  'Phase 2: app/api ngoài settings — form-reference-data, reports, print — chỉ 1 nguồn cho từng master.',
  'Phase 3: features (payroll, attendance, nghỉ) — so khóa với CANONICAL_BY_DOMAIN + bảng HRM thật (leave, timesheet, …).',
  'Phase 4: lib/data + getServerSide tương tự — không reintroduce getAllSettings cho master nhiều dòng.',
  'Phase 5: công cụ one-off dưới scripts/ — chỉ giữ bản tsc/Prisma sạch; cần script mới thì copy mẫu từ script cũ còn dùng + utf-8, không tích lũy file lỗi.',
] as const

/** Checklist sau deploy production / VPS (chạy thủ công, không tự động hóa ở agent). */
export const POST_DEPLOY_VERIFICATION = [
  'So JSON GET /api/settings/order-form và (nếu cần) /api/products/form-reference-data: 200, shape, mẫu vài trường (paymentMethods, branches) local vs prod cùng user.',
  'Tạo đơn thử: PTTT, kênh, chi nhánh, thuế mặc định, đối tác giao hàng phản ánh cài đặt mới sau deploy.',
  'Theo dõi log 500 trùng path trong 24h (reverse proxy / process manager).',
] as const

export const PERF_AND_CACHE_NOTES = {
  orderForm:
    'Form đơn: một hook dùng GET /api/settings/order-form, hydrate key React Query; mutation settings (PTTT, thuế, …) gọi invalidateRelated → lệnh cùng [settings,order-form] prefix (xem query-invalidation-map).',
  n1: 'Tránh vòng lặp + từng câu prisma; gom id rồi findMany { in }; báo cáo lớn ưu tiên SQL aggregate.',
} as const

/**
 * `type` hợp lệ tại POST /api/settings/data (validation.ts) cạnh bảng/API chuẩn — không tạo master mới ở đây nếu đã có cột bên phải.
 * Các mục chỉ settings_data (EAV) là ổn: receipt-type, payment-type, target-group nếu không bị bảng cạnh tranh.
 */
export const SETTINGS_DATA_TYPES_WITH_DOMAIN_TABLE: Record<
  string,
  { canonical: string; notes?: string }
> = {
  tax: { canonical: 'prisma.tax + /api/settings/taxes' },
  'sales-channel': { canonical: 'prisma.salesChannel + /api/settings/sales-channels' },
  'shipping-partner': { canonical: 'prisma.shippingPartner + /api/settings/shipping-partners' },
  'pricing-policy': { canonical: 'prisma.pricingPolicy + /api/settings/pricing-policies' },
  'penalty-type': { canonical: 'prisma.penaltyTypeSetting + /api/penalty-types' },
  penalty: { canonical: 'Bản ghi phạt: prisma.penalty + /api/penalties — không tạo “penalty” master trong settings_data' },
  'task-template': { canonical: 'prisma.taskTemplate + /api/tasks/templates' },
  'recurring-task': { canonical: 'prisma.recurringTask + /api (recurring) — cần xác minh path' },
  unit: { canonical: 'prisma.unit + /api/units' },
  'custom-field': { canonical: 'EAV tại settings_data; POST /api/settings/data', notes: 'Không bảng domain riêng.' },
}

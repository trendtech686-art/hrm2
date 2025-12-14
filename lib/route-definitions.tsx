import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { AppRoute, ROUTES } from './router';

// ⚡ PERFORMANCE STRATEGY: Hybrid approach
// - Direct imports: Frequently used pages (instant navigation)
// - Lazy + Prefetch: Moderately used pages (fast with hover prefetch)
// - Lazy only: Rarely used pages (load on demand)

// === AUTH PAGES ===
import { LoginPage } from '../features/auth/login-page';
import { SignupPage } from '../features/auth/signup-page';
import { OtpVerificationPage } from '../features/auth/otp-verification-page';

// === DIRECT IMPORTS: Core pages used DAILY ===
// Dashboard & HRM Core
import { DashboardPage } from '../features/dashboard/page';
import { EmployeesPage } from '../features/employees/page';
import { EmployeesPageTanStackTest } from '../features/employees/page-tanstack-test';
import { EmployeesVirtualizedPage } from '../features/employees/virtualized-page';
import { EmployeeFormPage } from '../features/employees/employee-form-page';
import { EmployeeDetailPage } from '../features/employees/detail-page';
import { DepartmentsPage } from '../features/settings/departments/page';
import { DepartmentFormPage } from '../features/settings/departments/department-form-page';
import { AttendancePage } from '../features/attendance/page';
import { LeavesPage } from '../features/leaves/page';
import { LeaveDetailPage } from '../features/leaves/detail-page';
import { OrganizationChartPage } from '../features/settings/departments/organization-chart/page';
import { PayrollListPage } from '../features/payroll/list-page.tsx';
import { PayrollRunPage } from '../features/payroll/run-page.tsx';
import { PayrollDetailPage } from '../features/payroll/detail-page.tsx';
import { PayrollTemplatePage } from '../features/payroll/template-page-redirect.tsx';

// Sales Core - ALL direct imports
import { CustomersPage } from '../features/customers/page';
import { CustomerFormPage } from '../features/customers/customer-form-page';
import { CustomerDetailPage } from '../features/customers/detail-page';
import { CustomersTrashPage } from '../features/customers/trash-page';
import CustomerSettingsPage from '../features/settings/customers/page';
import { ProductsPage } from '../features/products/page';
import { ProductFormPage } from '../features/products/form-page';
import { ProductDetailPage } from '../features/products/detail-page';
import { ProductsTrashPage } from '../features/products/trash-page';
import { BrandsPage } from '../features/brands/page';
import { ProductCategoriesPage } from '../features/categories/page';
import { OrdersPage } from '../features/orders/page';
import { OrderFormPage } from '../features/orders/order-form-page';
import { OrderDetailPage } from '../features/orders/order-detail-page';
import { SalesReturnsPage } from '../features/sales-returns/page';
import { SalesReturnFormPage } from '../features/sales-returns/form-page';
import { SalesReturnDetailPage } from '../features/sales-returns/detail-page';

// Internal Operations - Warranty
import { WarrantyListPage } from '../features/warranty/warranty-list-page.tsx';
import { WarrantyFormPage } from '../features/warranty/warranty-form-page.tsx';
import { WarrantyDetailPage } from '../features/warranty/warranty-detail-page.tsx';
import { WarrantyStatisticsPage } from '../features/warranty/warranty-statistics-page.tsx';
import { WarrantyTrackingPage } from '../features/warranty/warranty-tracking-page.tsx';

// Internal Operations - Complaints
import { ComplaintsPage } from '../features/complaints/page.tsx';
import { ComplaintFormPage } from '../features/complaints/form-page.tsx';
import { ComplaintDetailPage } from '../features/complaints/detail-page.tsx';
import { PublicComplaintTrackingPage } from '../features/complaints/public-tracking-page.tsx';
import { ComplaintStatisticsPage } from '../features/complaints/statistics-page.tsx';

// Procurement Core - ALL direct imports
import { SuppliersPage } from '../features/suppliers/page';
import { SupplierFormPage } from '../features/suppliers/form-page';
import { SupplierDetailPage } from '../features/suppliers/detail-page';
import { SuppliersTrashPage } from '../features/suppliers/trash-page';
import { PurchaseOrdersPage } from '../features/purchase-orders/page';
import { PurchaseOrderFormPage } from '../features/purchase-orders/form-page';
import { PurchaseOrderDetailPage } from '../features/purchase-orders/detail-page';
import { PurchaseReturnFormPage } from '../features/purchase-returns/form-page.tsx';
import { PurchaseReturnDetailPage } from '../features/purchase-returns/detail-page.tsx';
import { PurchaseReturnsPage } from '../features/purchase-returns/page.tsx';
import { InventoryReceiptsPage } from '../features/inventory-receipts/page';
import { InventoryReceiptDetailPage } from '../features/inventory-receipts/detail-page';

// Inventory
import { InventoryChecksPage } from '../features/inventory-checks/page';
import { InventoryCheckFormPage } from '../features/inventory-checks/form-page';
import { InventoryCheckDetailPage } from '../features/inventory-checks/detail-page';

// Stock Transfers
import { StockTransfersPage } from '../features/stock-transfers/page';
import { StockTransferFormPage } from '../features/stock-transfers/form-page';
import { StockTransferEditPage } from '../features/stock-transfers/edit-page';
import { StockTransferDetailPage } from '../features/stock-transfers/detail-page';

// Cost Adjustments
import { CostAdjustmentListPage } from '../features/cost-adjustments/page';
import { CostAdjustmentFormPage } from '../features/cost-adjustments/form-page';
import { CostAdjustmentDetailPage } from '../features/cost-adjustments/detail-page';

// Finance Core - ALL direct imports
import { CashbookPage } from '../features/cashbook/page';
import { CashbookReportsPage } from '../features/cashbook/reports-page';
import { ReceiptsPage } from '../features/receipts/page';
import { ReceiptFormPage } from '../features/receipts/form-page';
import { ReceiptDetailPage } from '../features/receipts/detail-page';
import { PaymentsPage } from '../features/payments/page.tsx';
import { PaymentFormPage } from '../features/payments/form-page';
import { PaymentDetailPage } from '../features/payments/detail-page.tsx';

// Internal Operations - Frequently used
import { PackagingPage } from '../features/packaging/page';
import { PackagingDetailPage } from '../features/packaging/detail-page';
import { ShipmentsPage } from '../features/shipments/page';
import { ShipmentDetailPage } from '../features/shipments/detail-page';
import { ReconciliationPage } from '../features/reconciliation/page';

// Demo Pages - REMOVED (files deleted)
// import { EnhancedAddressDemoPage } from '../features/demo/enhanced-address-demo-page';
// import { DualAddressDemoPage } from '../features/demo/dual-address-demo-page';
// REMOVED: Internal Tasks, Complaints, Duty Schedule
// import { InternalTasksPage } from '../features/internal-tasks/page';
// import { ComplaintsPage } from '../features/complaints/page';
// import { ComplaintDetailPage } from '../features/complaints/detail-page';
// import { DutySchedulePage } from '../features/duty-schedule/page';
import { PenaltiesPage } from '../features/settings/penalties/page';
import { PenaltyDetailPage } from '../features/settings/penalties/detail-page';
import { PenaltyFormPage } from '../features/settings/penalties/penalty-form-page';
import { TasksPage } from '../features/tasks/page';
import { TasksDashboardPage } from '../features/tasks/dashboard-page';
import { TaskDetailPage } from '../features/tasks/detail-page';
import { TaskFormPage } from '../features/tasks/task-form-page';
import { TaskCalendarView } from '../features/tasks/calendar-view';
import { TaskTemplatesPage } from '../features/tasks/templates-page';
import { RecurringTasksPage } from '../features/tasks/recurring-page';
import { FieldManagementPage } from '../features/tasks/field-management-page';
import { UserTasksPage } from '../features/tasks/user-tasks-page';
import { WikiPage } from '../features/wiki/page';
import { WikiFormPage } from '../features/wiki/form-page';
import { WikiDetailPage } from '../features/wiki/detail-page';
import { SalesReportPage } from '../features/reports/sales-report/page';
import { InventoryReportPage } from '../features/reports/inventory-report/page';
import { CustomerSlaReportPage } from '../features/reports/customer-sla-report/page';
import { ProductSlaReportPage } from '../features/reports/product-sla-report/page';
import { SettingsPage } from '../features/settings/page';
import { AppearancePage } from '../features/settings/appearance/appearance-page';
import { StoreInfoPage } from '../features/settings/store-info/store-info-page';
import { ProvincesPage } from '../features/settings/provinces/page';
import { TaxesPage } from '../features/settings/taxes-page';
import { EmployeeSettingsPage } from '../features/settings/employees/employee-settings-page';
import { EmployeeRolesPage } from '../features/settings/employees/employee-roles-page';
import { PricingSettingsPage } from '../features/settings/pricing/page';
import { PaymentSettingsPage } from '../features/settings/payment-settings-page';
import { InventorySettingsPage } from '../features/settings/inventory/page';
import { PrintTemplatesPage } from '../features/settings/printer/print-templates-page';
import { ImportExportLogsPage } from '../features/settings/system/import-export-logs-page';
import { SystemLogsPage } from '../features/settings/system/system-logs-page';
import { OtherSettingsPage } from '../features/settings/other-page';
import { StockLocationsPage } from '../features/stock-locations/page';
import { ShippingPartnersPage } from '../features/settings/shipping/page';
import { ShippingPartnerDetailPage } from '../features/settings/shipping/partner-detail-page';
import { SalesConfigPage } from '../features/settings/sales/sales-config-page';
import { WorkflowTemplatesPage } from '../features/settings/printer/workflow-templates-page.tsx';
import { ComplaintsSettingsPage } from '../features/settings/complaints/complaints-settings-page.tsx';
import { TasksSettingsPage } from '../features/settings/tasks/tasks-settings-page.tsx';
import { WarrantySettingsPage } from '../features/settings/warranty/warranty-settings-page.tsx';
import { PkgxSettingsPage } from '../features/settings/pkgx/pkgx-settings-page.tsx';
import { IDCounterSettingsPage } from '../features/settings/system/id-counter-settings-page'; // [DONE] NEW: ID Management
import { ImportExportHistoryPage } from '../features/shared/import-export-history-page';
import { PlaceholderPage } from '../components/layout/placeholder-page';
// import { HRMPage } from '../features/hrm/page'; // [ERROR] File doesn't exist
import { EmployeesTrashPage } from '../features/employees/trash-page';

// Route definitions with metadata
export const routeDefinitions: AppRoute[] = [
  // Root redirect
  {
    path: ROUTES.ROOT,
    element: () => <Navigate to={ROUTES.DASHBOARD} replace />,
    meta: {
      description: 'Chuyển hướng đến dashboard'
    }
  },
  
  // === AUTH ROUTES ===
  {
    path: ROUTES.AUTH.LOGIN,
    element: LoginPage,
    meta: {
      description: 'Đăng nhập hệ thống',
      requiresAuth: false
    }
  },
  {
    path: ROUTES.AUTH.SIGNUP,
    element: SignupPage,
    meta: {
      description: 'Đăng ký tài khoản mới',
      requiresAuth: false
    }
  },
  {
    path: ROUTES.AUTH.VERIFY_OTP,
    element: OtpVerificationPage,
    meta: {
      description: 'Xác thực OTP',
      requiresAuth: false
    }
  },
  
  // Public Complaint Tracking - No auth required
  {
    path: '/complaint-tracking/:complaintId',
    element: PublicComplaintTrackingPage,
    meta: {
      description: 'Theo dõi khiếu nại công khai',
      requiresAuth: false
    }
  },
  
  // Dashboard
  {
    path: ROUTES.DASHBOARD,
    element: DashboardPage,
    meta: {
      description: 'Tổng quan hệ thống',
      breadcrumb: ['Dashboard'],
      preload: true
    }
  },
  
  // Employees
  {
    path: ROUTES.HRM.EMPLOYEES,
    element: EmployeesPage,
    meta: {
      breadcrumb: ['Nhân viên'],
      preload: true  // ← Preload this important page
    }
  },
  {
    path: '/employees/test',
    element: EmployeesPageTanStackTest,
    meta: {
      breadcrumb: ['Nhân viên', 'TanStack Test']
    }
  },
  {
    path: '/employees/virtualized',
    element: EmployeesVirtualizedPage,
    meta: {
      breadcrumb: ['Nhân viên', 'Virtual Scrolling Demo']
    }
  },
  {
    path: '/employees/trash',
    element: EmployeesTrashPage,
    meta: {
      breadcrumb: ['Nhân viên', 'Thùng rác']
    }
  },
  {
    path: ROUTES.HRM.EMPLOYEE_NEW,
    element: EmployeeFormPage,
    meta: {
      breadcrumb: [
        { label: 'Nhân viên', href: ROUTES.HRM.EMPLOYEES },
        'Thêm mới'
      ]
    }
  },
  {
    path: ROUTES.HRM.EMPLOYEE_EDIT,
    element: EmployeeFormPage,
    meta: {
      breadcrumb: [
        { label: 'Nhân viên', href: ROUTES.HRM.EMPLOYEES },
        'Chỉnh sửa'
      ]
    }
  },
  {
    path: ROUTES.HRM.EMPLOYEE_VIEW,
    element: EmployeeDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Nhân viên', href: ROUTES.HRM.EMPLOYEES },
        'Chi tiết'
      ]
    }
  },
  {
    path: ROUTES.HRM.DEPARTMENTS,
    element: DepartmentsPage,
    meta: {
      breadcrumb: ['Phòng Ban']
    }
  },
  {
    path: ROUTES.HRM.DEPARTMENT_NEW,
    element: DepartmentFormPage,
    meta: {
      breadcrumb: ['Phòng Ban', 'Thêm mới']
    }
  },
  {
    path: ROUTES.HRM.DEPARTMENT_EDIT,
    element: DepartmentFormPage,
    meta: {
      breadcrumb: ['Phòng Ban', 'Chỉnh sửa']
    }
  },
  {
    path: ROUTES.HRM.ORGANIZATION_CHART,
    element: OrganizationChartPage,
    meta: {
      breadcrumb: ['Sơ Đồ Tổ Chức']
    }
  },
  {
    path: ROUTES.HRM.ATTENDANCE,
    element: AttendancePage,
    meta: {
      breadcrumb: ['Chấm Công']
    }
  },
  {
    path: ROUTES.HRM.LEAVES,
    element: LeavesPage,
    meta: {
      breadcrumb: ['Nghỉ Phép']
    }
  },
  {
    path: ROUTES.HRM.LEAVE_VIEW,
    element: LeaveDetailPage,
    meta: {
      breadcrumb: ['Nghỉ Phép', 'Chi tiết']
    }
  },

  // Payroll Routes
  {
    path: ROUTES.PAYROLL.LIST,
    element: PayrollListPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: ROUTES.DASHBOARD },
        'Bảng lương'
      ]
    }
  },
  {
    path: ROUTES.PAYROLL.RUN,
    element: PayrollRunPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: ROUTES.DASHBOARD },
        { label: 'Bảng lương', href: ROUTES.PAYROLL.LIST },
        'Chạy mới'
      ]
    }
  },
  {
    path: ROUTES.PAYROLL.DETAIL,
    element: PayrollDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: ROUTES.DASHBOARD },
        { label: 'Bảng lương', href: ROUTES.PAYROLL.LIST },
        'Chi tiết'
      ]
    }
  },
  {
    path: ROUTES.PAYROLL.TEMPLATES,
    element: PayrollTemplatePage,
    meta: {
      title: 'Mẫu bảng lương',
      description: 'Quản lý bộ thành phần chuẩn để tái sử dụng',
      breadcrumb: [
        { label: 'Trang chủ', href: ROUTES.DASHBOARD },
        { label: 'Bảng lương', href: ROUTES.PAYROLL.LIST },
        'Mẫu bảng lương'
      ]
    }
  },
  
  // Products Routes
  {
    path: ROUTES.SALES.PRODUCTS,
    element: ProductsPage,
    meta: {
      breadcrumb: ['Sản Phẩm'],
      preload: true
    }
  },
  {
    path: ROUTES.SALES.PRODUCT_NEW,
    element: ProductFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Sản Phẩm', href: ROUTES.SALES.PRODUCTS },
        'Thêm mới'
      ]
    }
  },
  {
    path: ROUTES.SALES.PRODUCT_EDIT,
    element: ProductFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Sản Phẩm', href: ROUTES.SALES.PRODUCTS },
        'Chỉnh sửa'
      ]
    }
  },
  {
    path: ROUTES.SALES.PRODUCT_VIEW,
    element: ProductDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Sản Phẩm', href: ROUTES.SALES.PRODUCTS },
        'Chi tiết'
      ]
    }
  },
  {
    path: ROUTES.SALES.PRODUCTS_TRASH,
    element: ProductsTrashPage,
    meta: {
      breadcrumb: ['Sản Phẩm', 'Thùng rác']
    }
  },
  
  // Brands Routes
  {
    path: ROUTES.SALES.BRANDS,
    element: BrandsPage,
    meta: {
      breadcrumb: ['Thương hiệu'],
      preload: true
    }
  },
  
  // Categories Routes
  {
    path: ROUTES.SALES.CATEGORIES,
    element: ProductCategoriesPage,
    meta: {
      breadcrumb: ['Danh mục sản phẩm'],
      preload: true
    }
  },
  
  // Customers Routes
  {
    path: ROUTES.SALES.CUSTOMERS,
    element: CustomersPage,
    meta: {
      breadcrumb: ['Khách Hàng'],
      preload: true
    }
  },
  {
    path: '/settings/customers',
    element: CustomerSettingsPage,
    meta: {
      breadcrumb: [
        { label: 'Cài Đặt', href: '/settings' },
        'Cài Đặt Khách Hàng'
      ]
    }
  },
  {
    path: '/customers/trash',
    element: CustomersTrashPage,
    meta: {
      breadcrumb: ['Khách Hàng', 'Thùng rác']
    }
  },
  {
    path: ROUTES.SALES.CUSTOMER_NEW,
    element: CustomerFormPage,
    meta: {
      breadcrumb: [
        { label: 'Khách Hàng', href: ROUTES.SALES.CUSTOMERS },
        'Thêm mới'
      ]
    }
  },
  {
    path: ROUTES.SALES.CUSTOMER_EDIT,
    element: CustomerFormPage,
    meta: {
      breadcrumb: [
        { label: 'Khách Hàng', href: ROUTES.SALES.CUSTOMERS },
        'Chỉnh sửa'
      ]
    }
  },
  {
    path: ROUTES.SALES.CUSTOMER_VIEW,
    element: CustomerDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Khách Hàng', href: ROUTES.SALES.CUSTOMERS },
        'Chi tiết'
      ]
    }
  },
  
  // Orders Routes
  {
    path: ROUTES.SALES.ORDERS,
    element: OrdersPage,
    meta: {
      breadcrumb: ['Đơn Hàng'],
      preload: true
    }
  },
  {
    path: ROUTES.SALES.ORDER_NEW,
    element: OrderFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Đơn Hàng', href: ROUTES.SALES.ORDERS },
        'Thêm mới'
      ]
    }
  },
  {
    path: ROUTES.SALES.ORDER_EDIT,
    element: OrderFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Đơn Hàng', href: ROUTES.SALES.ORDERS },
        'Chỉnh sửa'
      ]
    }
  },
  {
    path: ROUTES.SALES.ORDER_VIEW,
    element: OrderDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Đơn Hàng', href: ROUTES.SALES.ORDERS },
        'Chi tiết'
      ]
    }
  },
  {
    path: ROUTES.SALES.ORDER_RETURN,
    element: SalesReturnFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Đơn Hàng', href: ROUTES.SALES.ORDERS },
        'Chi tiết',
        'Tạo đơn trả hàng'
      ]
    }
  },
  
  // Sales Returns Routes
  {
    path: ROUTES.SALES.RETURNS,
    element: SalesReturnsPage,
    meta: {
      breadcrumb: ['Trả Hàng']
    }
  },
  {
    path: ROUTES.SALES.RETURN_VIEW,
    element: SalesReturnDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Trả hàng', href: ROUTES.SALES.RETURNS },
        'Chi tiết'
      ]
    }
  },
  
  // Suppliers Routes
  {
    path: ROUTES.PROCUREMENT.SUPPLIERS,
    element: SuppliersPage,
    meta: {
      breadcrumb: ['Nhà cung cấp']
    }
  },
  {
    path: ROUTES.PROCUREMENT.SUPPLIER_NEW,
    element: SupplierFormPage,
    meta: {
      breadcrumb: [
        { label: 'Nhà cung cấp', href: ROUTES.PROCUREMENT.SUPPLIERS },
        'Thêm mới'
      ]
    }
  },
  {
    path: ROUTES.PROCUREMENT.SUPPLIER_EDIT,
    element: SupplierFormPage,
    meta: {
      breadcrumb: [
        { label: 'Nhà cung cấp', href: ROUTES.PROCUREMENT.SUPPLIERS },
        'Chỉnh sửa'
      ]
    }
  },
  {
    path: ROUTES.PROCUREMENT.SUPPLIER_VIEW,
    element: SupplierDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Nhà cung cấp', href: ROUTES.PROCUREMENT.SUPPLIERS },
        'Chi tiết'
      ]
    }
  },
  {
    path: ROUTES.PROCUREMENT.SUPPLIERS_TRASH,
    element: SuppliersTrashPage,
    meta: {
      breadcrumb: [
        { label: 'Nhà cung cấp', href: ROUTES.PROCUREMENT.SUPPLIERS },
        'Thùng rác'
      ]
    }
  },
  
  // Warranty Routes
  {
    path: ROUTES.INTERNAL.WARRANTY,
    element: WarrantyListPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        'Quản lý bảo hành'
      ]
    }
  },
  {
    path: `${ROUTES.INTERNAL.WARRANTY}/new`,
    element: WarrantyFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Quản lý bảo hành', href: ROUTES.INTERNAL.WARRANTY },
        'Tạo mới'
      ]
    }
  },
  {
    path: `${ROUTES.INTERNAL.WARRANTY}/:systemId/edit`,
    element: WarrantyFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Quản lý bảo hành', href: ROUTES.INTERNAL.WARRANTY },
        'Chỉnh sửa'
      ]
    }
  },
  {
    path: `${ROUTES.INTERNAL.WARRANTY}/:systemId/update`,
    element: WarrantyFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Quản lý bảo hành', href: ROUTES.INTERNAL.WARRANTY },
        'Cập nhật thông tin'
      ]
    }
  },
  {
    path: `${ROUTES.INTERNAL.WARRANTY}/:systemId`,
    element: WarrantyDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Quản lý bảo hành', href: ROUTES.INTERNAL.WARRANTY },
        'Chi tiết'
      ]
    }
  },
  {
    path: ROUTES.INTERNAL.WARRANTY_STATISTICS,
    element: WarrantyStatisticsPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Quản lý bảo hành', href: ROUTES.INTERNAL.WARRANTY },
        'Thống kê'
      ]
    }
  },
  {
    path: ROUTES.INTERNAL.WARRANTY_TRACKING,
    element: WarrantyTrackingPage,
    meta: {
      breadcrumb: [
        'Tra cứu bảo hành'
      ]
    }
  },
  
  // Purchase Orders Routes
  {
    path: ROUTES.PROCUREMENT.PURCHASE_ORDERS,
    element: PurchaseOrdersPage,
    meta: {
      breadcrumb: ['Đơn nhập hàng']
    }
  },
  {
    path: ROUTES.PROCUREMENT.PURCHASE_ORDER_NEW,
    element: PurchaseOrderFormPage,
    meta: {
      breadcrumb: [
        { label: 'Đơn nhập hàng', href: ROUTES.PROCUREMENT.PURCHASE_ORDERS },
        'Tạo mới'
      ]
    }
  },
  {
    path: ROUTES.PROCUREMENT.PURCHASE_ORDER_EDIT,
    element: PurchaseOrderFormPage,
    meta: {
      breadcrumb: [
        { label: 'Đơn nhập hàng', href: ROUTES.PROCUREMENT.PURCHASE_ORDERS },
        'Chỉnh sửa'
      ]
    }
  },
  {
    path: ROUTES.PROCUREMENT.PURCHASE_ORDER_VIEW,
    element: PurchaseOrderDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Đơn nhập hàng', href: ROUTES.PROCUREMENT.PURCHASE_ORDERS },
        'Chi tiết'
      ]
    }
  },
  {
    path: ROUTES.PROCUREMENT.PURCHASE_RETURN,
    element: PurchaseReturnFormPage,
    meta: {
      breadcrumb: [
        { label: 'Đơn nhập hàng', href: ROUTES.PROCUREMENT.PURCHASE_ORDERS },
        'Trả hàng'
      ]
    }
  },
  {
    path: ROUTES.PROCUREMENT.PURCHASE_RETURNS,
    element: PurchaseReturnsPage,
    meta: {
      breadcrumb: ['Trả hàng nhập']
    }
  },
  {
    path: ROUTES.PROCUREMENT.PURCHASE_RETURN_NEW,
    element: PurchaseReturnFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trả hàng nhập', href: ROUTES.PROCUREMENT.PURCHASE_RETURNS },
        'Tạo phiếu trả'
      ]
    }
  },
  {
    path: ROUTES.PROCUREMENT.PURCHASE_RETURN_VIEW,
    element: PurchaseReturnDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Trả hàng nhập', href: ROUTES.PROCUREMENT.PURCHASE_RETURNS },
        'Chi tiết'
      ]
    }
  },
  
  // Inventory Receipts Routes
  {
    path: ROUTES.PROCUREMENT.INVENTORY_RECEIPTS,
    element: InventoryReceiptsPage,
    meta: {
      breadcrumb: ['Phiếu nhập kho']
    }
  },
  {
    path: ROUTES.PROCUREMENT.INVENTORY_RECEIPT_VIEW,
    element: InventoryReceiptDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Phiếu nhập kho', href: ROUTES.PROCUREMENT.INVENTORY_RECEIPTS },
        'Chi tiết'
      ]
    }
  },
  
  // Inventory Checks Routes
  {
    path: ROUTES.INVENTORY.INVENTORY_CHECKS,
    element: InventoryChecksPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        'Kiểm hàng'
      ]
    }
  },
  {
    path: ROUTES.INVENTORY.INVENTORY_CHECK_NEW,
    element: InventoryCheckFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Kiểm hàng', href: ROUTES.INVENTORY.INVENTORY_CHECKS },
        'Tạo mới'
      ]
    }
  },
  {
    path: ROUTES.INVENTORY.INVENTORY_CHECK_VIEW,
    element: InventoryCheckDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Kiểm hàng', href: ROUTES.INVENTORY.INVENTORY_CHECKS },
        'Chi tiết'
      ]
    }
  },
  {
    path: ROUTES.INVENTORY.INVENTORY_CHECK_EDIT,
    element: InventoryCheckFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Kiểm hàng', href: ROUTES.INVENTORY.INVENTORY_CHECKS },
        'Chỉnh sửa'
      ]
    }
  },
  
  // Stock Transfers Routes
  {
    path: ROUTES.INVENTORY.STOCK_TRANSFERS,
    element: StockTransfersPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        'Chuyển kho'
      ]
    }
  },
  {
    path: ROUTES.INVENTORY.STOCK_TRANSFER_NEW,
    element: StockTransferFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Chuyển kho', href: ROUTES.INVENTORY.STOCK_TRANSFERS },
        'Tạo phiếu'
      ]
    }
  },
  {
    path: ROUTES.INVENTORY.STOCK_TRANSFER_VIEW,
    element: StockTransferDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Chuyển kho', href: ROUTES.INVENTORY.STOCK_TRANSFERS },
        'Chi tiết'
      ]
    }
  },
  {
    path: ROUTES.INVENTORY.STOCK_TRANSFER_EDIT,
    element: StockTransferEditPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Chuyển kho', href: ROUTES.INVENTORY.STOCK_TRANSFERS },
        'Chỉnh sửa'
      ]
    }
  },
  
  // Cost Adjustments Routes
  {
    path: '/cost-adjustments',
    element: CostAdjustmentListPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        'Điều chỉnh giá vốn'
      ]
    }
  },
  {
    path: '/cost-adjustments/new',
    element: CostAdjustmentFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Điều chỉnh giá vốn', href: '/cost-adjustments' },
        'Tạo phiếu'
      ]
    }
  },
  {
    path: '/cost-adjustments/:systemId',
    element: CostAdjustmentDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Điều chỉnh giá vốn', href: '/cost-adjustments' },
        'Chi tiết'
      ]
    }
  },
  
  // Finance Routes - Cashbook
  {
    path: ROUTES.FINANCE.CASHBOOK,
    element: CashbookPage,
    meta: {
      breadcrumb: ['Sổ quỹ']
    }
  },
  {
    path: ROUTES.FINANCE.CASHBOOK_REPORTS,
    element: CashbookReportsPage,
    meta: {
      breadcrumb: [
        { label: 'Sổ quỹ', href: ROUTES.FINANCE.CASHBOOK },
        'Báo cáo'
      ]
    }
  },
  
  // Finance Routes - Receipts
  {
    path: ROUTES.FINANCE.RECEIPTS,
    element: ReceiptsPage,
    meta: {
      breadcrumb: ['Phiếu thu']
    }
  },
  {
    path: ROUTES.FINANCE.RECEIPT_NEW,
    element: ReceiptFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Phiếu thu', href: ROUTES.FINANCE.RECEIPTS },
        'Thêm mới'
      ]
    }
  },
  {
    path: ROUTES.FINANCE.RECEIPT_EDIT,
    element: ReceiptFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Phiếu thu', href: ROUTES.FINANCE.RECEIPTS },
        'Chỉnh sửa'
      ]
    }
  },
  {
    path: ROUTES.FINANCE.RECEIPT_VIEW,
    element: ReceiptDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Phiếu thu', href: ROUTES.FINANCE.RECEIPTS },
        'Chi tiết'
      ]
    }
  },
  
  // Finance Routes - Payments
  {
    path: ROUTES.FINANCE.PAYMENTS,
    element: PaymentsPage,
    meta: {
      breadcrumb: ['Phiếu chi']
    }
  },
  {
    path: ROUTES.FINANCE.PAYMENT_NEW,
    element: PaymentFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Phiếu chi', href: ROUTES.FINANCE.PAYMENTS },
        'Thêm mới'
      ]
    }
  },
  {
    path: ROUTES.FINANCE.PAYMENT_EDIT,
    element: PaymentFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Phiếu chi', href: ROUTES.FINANCE.PAYMENTS },
        'Chỉnh sửa'
      ]
    }
  },
  {
    path: ROUTES.FINANCE.PAYMENT_VIEW,
    element: PaymentDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Phiếu chi', href: ROUTES.FINANCE.PAYMENTS },
        'Chi tiết'
      ]
    }
  },
  
  // Internal Operations Routes
  {
    path: ROUTES.INTERNAL.PACKAGING,
    element: PackagingPage,
    meta: {
      breadcrumb: ['Đóng gói']
    }
  },
  {
    path: ROUTES.INTERNAL.PACKAGING_VIEW,
    element: PackagingDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Đóng gói', href: ROUTES.INTERNAL.PACKAGING },
        'Chi tiết'
      ]
    }
  },
  {
    path: ROUTES.INTERNAL.SHIPMENTS,
    element: ShipmentsPage,
    meta: {
      breadcrumb: ['Vận chuyển']
    }
  },
  {
    path: ROUTES.INTERNAL.SHIPMENT_VIEW,
    element: ShipmentDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Vận chuyển', href: ROUTES.INTERNAL.SHIPMENTS },
        'Chi tiết'
      ]
    }
  },
  {
    path: ROUTES.INTERNAL.RECONCILIATION,
    element: ReconciliationPage,
    meta: {
      breadcrumb: ['Đối soát']
    }
  },
  // REMOVED: Internal Tasks route
  // {
  //   path: ROUTES.INTERNAL.INTERNAL_TASKS,
  //   element: InternalTasksPage,
  //   meta: {
  //     breadcrumb: ['Công việc nội bộ']
  //   }
  // },
  
  // Complaints Routes - RESTORED
  {
    path: ROUTES.INTERNAL.COMPLAINTS,
    element: ComplaintsPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        'Quản lý Khiếu nại'
      ]
    }
  },
  {
    path: ROUTES.INTERNAL.COMPLAINT_NEW,
    element: ComplaintFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Quản lý Khiếu nại', href: ROUTES.INTERNAL.COMPLAINTS },
        'Tạo mới'
      ]
    }
  },
  {
    path: ROUTES.INTERNAL.COMPLAINT_EDIT,
    element: ComplaintFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Quản lý Khiếu nại', href: ROUTES.INTERNAL.COMPLAINTS },
        'Chỉnh sửa'
      ]
    }
  },
  {
    path: ROUTES.INTERNAL.COMPLAINT_VIEW,
    element: ComplaintDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Quản lý Khiếu nại', href: ROUTES.INTERNAL.COMPLAINTS },
        'Chi tiết'
      ]
    }
  },
  {
    path: '/complaints/statistics',
    element: ComplaintStatisticsPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Khiếu nại', href: ROUTES.INTERNAL.COMPLAINTS },
        'Thống kê khiếu nại'
      ]
    }
  },
  
  {
    path: ROUTES.INTERNAL.PENALTIES,
    element: PenaltiesPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        'Phạt'
      ]
    }
  },
  {
    path: ROUTES.INTERNAL.PENALTY_NEW,
    element: PenaltyFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Phạt', href: ROUTES.INTERNAL.PENALTIES },
        'Thêm mới'
      ]
    }
  },
  {
    path: ROUTES.INTERNAL.PENALTY_EDIT,
    element: PenaltyFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Phạt', href: ROUTES.INTERNAL.PENALTIES },
        'Chỉnh sửa'
      ]
    }
  },
  {
    path: ROUTES.INTERNAL.PENALTY_VIEW,
    element: PenaltyDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Phạt', href: ROUTES.INTERNAL.PENALTIES },
        'Chi tiết'
      ]
    }
  },

  // Tasks Routes
  {
    path: ROUTES.INTERNAL.TASKS,
    element: TasksPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        'Giao việc nội bộ'
      ]
    }
  },
  {
    path: `${ROUTES.INTERNAL.TASKS}/templates`,
    element: TaskTemplatesPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Giao việc nội bộ', href: ROUTES.INTERNAL.TASKS },
        'Mẫu công việc'
      ]
    }
  },
  {
    path: `${ROUTES.INTERNAL.TASKS}/recurring`,
    element: RecurringTasksPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Giao việc nội bộ', href: ROUTES.INTERNAL.TASKS },
        'Công việc lặp lại'
      ]
    }
  },
  {
    path: `${ROUTES.INTERNAL.TASKS}/fields`,
    element: FieldManagementPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Giao việc nội bộ', href: ROUTES.INTERNAL.TASKS },
        'Trường tùy chỉnh'
      ]
    }
  },
  {
    path: '/my-tasks',
    element: UserTasksPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        'Công việc của tôi'
      ]
    }
  },
  {
    path: `${ROUTES.INTERNAL.TASKS}/dashboard`,
    element: TasksDashboardPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Giao việc nội bộ', href: ROUTES.INTERNAL.TASKS },
        'Dashboard'
      ]
    }
  },
  {
    path: ROUTES.INTERNAL.TASKS_CALENDAR,
    element: TaskCalendarView,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Giao việc nội bộ', href: ROUTES.INTERNAL.TASKS },
        'Lịch công việc'
      ]
    }
  },
  {
    path: ROUTES.INTERNAL.TASKS_NEW,
    element: TaskFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Giao việc nội bộ', href: ROUTES.INTERNAL.TASKS },
        'Thêm mới'
      ]
    }
  },
  {
    path: ROUTES.INTERNAL.TASKS_EDIT,
    element: TaskFormPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Giao việc nội bộ', href: ROUTES.INTERNAL.TASKS },
        'Chỉnh sửa'
      ]
    }
  },
  {
    path: ROUTES.INTERNAL.TASKS_VIEW,
    element: TaskDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Trang chủ', href: '/' },
        { label: 'Giao việc nội bộ', href: ROUTES.INTERNAL.TASKS },
        'Chi tiết'
      ]
    }
  },
  // REMOVED: Duty Schedule route
  // {
  //   path: ROUTES.INTERNAL.DUTY_SCHEDULE,
  //   element: DutySchedulePage,
  //   meta: {
  //     breadcrumb: ['Lịch trực']
  //   }
  // },
  {
    path: ROUTES.INTERNAL.WIKI,
    element: WikiPage,
    meta: {
      breadcrumb: ['Wiki']
    }
  },
  {
    path: ROUTES.INTERNAL.WIKI_NEW,
    element: WikiFormPage,
    meta: {
      breadcrumb: [
        { label: 'Wiki', href: ROUTES.INTERNAL.WIKI },
        'Thêm mới'
      ]
    }
  },
  {
    path: ROUTES.INTERNAL.WIKI_VIEW,
    element: WikiDetailPage,
    meta: {
      breadcrumb: [
        { label: 'Wiki', href: ROUTES.INTERNAL.WIKI },
        'Chi tiết'
      ]
    }
  },
  {
    path: ROUTES.INTERNAL.WIKI_EDIT,
    element: WikiFormPage,
    meta: {
      breadcrumb: [
        { label: 'Wiki', href: ROUTES.INTERNAL.WIKI },
        'Chỉnh sửa'
      ]
    }
  },
  
  // Settings Routes
  {
    path: ROUTES.SETTINGS.ROOT,
    element: SettingsPage,
    meta: {
      breadcrumb: ['Cài đặt']
    }
  },
  {
    path: ROUTES.SETTINGS.APPEARANCE,
    element: AppearancePage,
    meta: {
      breadcrumb: ['Cài đặt', 'Giao diện']
    }
  },
  {
    path: ROUTES.SETTINGS.STORE_INFO,
    element: StoreInfoPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Thông tin cửa hàng']
    }
  },
  {
    path: ROUTES.SETTINGS.PROVINCES,
    element: ProvincesPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Tỉnh thành']
    }
  },
  {
    path: ROUTES.SETTINGS.TAXES,
    element: TaxesPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Quản lý Thuế']
    }
  },
  {
    path: ROUTES.SETTINGS.EMPLOYEES,
    element: EmployeeSettingsPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Nhân viên']
    }
  },
  {
    path: ROUTES.SETTINGS.EMPLOYEE_ROLES,
    element: EmployeeRolesPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Phân quyền & Tài khoản']
    }
  },
  {
    path: ROUTES.SETTINGS.PRICING,
    element: PricingSettingsPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Chính sách giá']
    }
  },
  {
    path: ROUTES.SETTINGS.PAYMENTS,
    element: PaymentSettingsPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Thanh toán']
    }
  },
  {
    path: ROUTES.SETTINGS.INVENTORY,
    element: InventorySettingsPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Quản lý kho']
    }
  },
  {
    path: ROUTES.SETTINGS.PRINT_TEMPLATES,
    element: PrintTemplatesPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Mẫu in']
    }
  },
  {
    path: ROUTES.SETTINGS.IMPORT_EXPORT_LOGS,
    element: ImportExportLogsPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Lịch sử nhập xuất']
    }
  },
  {
    path: ROUTES.SETTINGS.SYSTEM_LOGS,
    element: SystemLogsPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Nhật ký hệ thống']
    }
  },
  {
    path: ROUTES.SETTINGS.OTHER,
    element: OtherSettingsPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Cài đặt khác']
    }
  },
  {
    path: ROUTES.SETTINGS.STOCK_LOCATIONS,
    element: StockLocationsPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Vị trí kho']
    }
  },
  {
    path: ROUTES.SETTINGS.SHIPPING,
    element: ShippingPartnersPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Cài đặt vận chuyển']
    }
  },
  {
    path: '/settings/shipping/partners/:code',
    element: ShippingPartnerDetailPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Cài đặt vận chuyển', 'Chi tiết đối tác']
    }
  },
  {
    path: ROUTES.SETTINGS.SALES_CONFIG,
    element: SalesConfigPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Bán hàng']
    }
  },
  {
    path: ROUTES.SETTINGS.TAXES,
    element: PlaceholderPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Thuế']
    }
  },
  {
    path: ROUTES.SETTINGS.OTHER,
    element: PlaceholderPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Khác']
    }
  },
  {
    path: ROUTES.SETTINGS.SYSTEM_LOGS,
    element: PlaceholderPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Nhật ký hệ thống']
    }
  },
  {
    path: ROUTES.SETTINGS.WORKFLOW_TEMPLATES,
    element: WorkflowTemplatesPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Quy trình']
    }
  },
  {
    path: '/settings/complaints',
    element: ComplaintsSettingsPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Khiếu nại']
    }
  },
  {
    path: '/settings/pkgx',
    element: PkgxSettingsPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Tích hợp PKGX']
    }
  },
  {
    path: '/settings/tasks',
    element: TasksSettingsPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Công việc']
    }
  },
  {
    path: '/settings/warranty',
    element: WarrantySettingsPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Bảo hành']
    }
  },
  {
    path: ROUTES.SETTINGS.ID_COUNTERS, // [DONE] NEW: ID Management
    element: IDCounterSettingsPage,
    meta: {
      breadcrumb: ['Cài đặt', 'Quản lý ID & Prefix']
    }
  },
  
  // Reports Routes
  {
    path: ROUTES.REPORTS.SALES,
    element: SalesReportPage,
    meta: {
      breadcrumb: ['Báo cáo', 'Bán hàng']
    }
  },
  {
    path: ROUTES.REPORTS.INVENTORY,
    element: InventoryReportPage,
    meta: {
      breadcrumb: ['Báo cáo', 'Kho hàng']
    }
  },
  {
    path: ROUTES.REPORTS.CUSTOMER_SLA,
    element: CustomerSlaReportPage,
    meta: {
      breadcrumb: ['Báo cáo', 'Cảnh báo khách hàng']
    }
  },
  {
    path: ROUTES.REPORTS.PRODUCT_SLA,
    element: ProductSlaReportPage,
    meta: {
      breadcrumb: ['Báo cáo', 'Cảnh báo tồn kho']
    }
  },
  
  // Import/Export History
  {
    path: ROUTES.SETTINGS.IMPORT_EXPORT_LOGS,
    element: ImportExportHistoryPage,
    meta: {
      description: 'Lịch sử nhập xuất dữ liệu',
      breadcrumb: ['Cài đặt', 'Lịch sử nhập xuất']
    }
  }
  // === DEMO PAGES REMOVED ===
  // Demo pages deleted by user
];

// Export lazy components for direct use if needed
export {
  DashboardPage,
  EmployeesPage,
  EmployeeFormPage,
  EmployeeDetailPage,
  EmployeesTrashPage,
  CustomersPage,
  CustomerFormPage,
  CustomerDetailPage,
  CustomersTrashPage,
  ProductsTrashPage,
  // ... other exports as needed
};

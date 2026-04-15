/**
 * Data Fetchers Index
 * 
 * Re-export all data fetchers for easy imports
 * 
 * @example
 * import { getOrders, getProducts, getBranches } from '@/lib/data';
 */

// Orders
export {
  getOrders,
  getOrderById,
  getOrdersCountByStatus,
  getRecentOrders,
  getOrderStats,
  type OrderFilters,
  type OrderListItem,
} from './orders';

// Products
export {
  getProducts,
  getProductById,
  getProductsForSelect,
  getProductsCountByStatus,
  getLowStockProducts,
  searchProducts,
  type ProductFilters,
  type ProductListItem,
} from './products';

// Inventory
export {
  getInventory,
  getProductInventory,
  getInventorySummary,
  getStockHistory,
  getInventoryValueByBranch,
  type InventoryFilters,
  type InventoryListItem,
} from './inventory';

// Settings
export {
  getBranches,
  getCategories,
  getBrands,
  getSettingsByType,
  getAllSettings,
  getEmployeesForSelect,
  getCustomersForSelect,
  getPaymentMethods,
  getTaxSettings,
  getShippingSettings,
  getCompanyInfo,
  preloadSettings,
} from './settings';

// Customers
export {
  getCustomers,
  getCustomerById,
  getCustomerGroups,
  getCustomersWithHighDebt,
  getCustomerStats,
  searchCustomers,
  type CustomerFilters,
  type CustomerListItem,
} from './customers';

// Reports
export {
  getSalesSummary,
  getSalesByPeriod,
  getTopProducts,
  getTopCustomers,
  getInventoryReport,
  getRevenueByBranch,
  type SalesReportFilters,
  type SalesSummary,
  type SalesByPeriod,
  type TopProduct,
  type TopCustomer,
  type InventoryReport,
} from './reports';

// Receipts
export {
  getReceipts,
  getReceiptById,
  getReceiptStats,
  type ReceiptFilters,
  type ReceiptListItem,
} from './receipts';

// Purchase Orders
export {
  getPurchaseOrders,
  getPurchaseOrderById,
  getPurchaseOrderStats,
  getPOItemStats,
  type PurchaseOrderFilters,
  type PurchaseOrderListItem,
  type POItemStats,
} from './purchase-orders';

// Suppliers
export {
  getSuppliers,
  getSupplierById,
  getSuppliersForSelect,
  getSupplierStats,
  type SupplierFilters,
  type SupplierListItem,
} from './suppliers';

// Employees
export {
  getEmployees,
  getEmployeeById,
  type EmployeeFilters,
  type EmployeeListItem,
} from './employees';

// Attendance
export {
  getAttendance,
  getTodayAttendance,
  getAttendanceSummary,
  type AttendanceFilters,
  type AttendanceListItem,
} from './attendance';

// Payroll
export {
  getPayrolls,
  getPayrollSummary,
  type PayrollFilters,
  type PayrollListItem,
} from './payroll';

// Leaves
export {
  getLeaves,
  getLeaveBalance,
  type LeaveFilters,
  type LeaveListItem,
} from './leaves';

// Warranty
export {
  getWarranties,
  getWarrantyById,
  type WarrantyFilters,
  type WarrantyListItem,
} from './warranty';

// Tasks
export {
  getTasks,
  getTaskById,
  getMyTasks,
  getTaskStats,
  type TaskFilters,
  type TaskListItem,
} from './tasks';

// Cashbook
export {
  getCashbookStats,
  type CashbookStatsData,
} from './cashbook';

// Payments
export {
  getPayments,
  getPaymentSummary,
  type PaymentFilters,
  type PaymentListItem,
} from './payments';

// Stock Transfers
export {
  getStockTransfers,
  getStockTransferById,
  getPendingTransfers,
  type StockTransferFilters,
  type StockTransferListItem,
} from './stock-transfers';

// Inventory Checks
export {
  getInventoryChecks,
  getInventoryCheckById,
  getLatestInventoryCheck,
  type InventoryCheckFilters,
  type InventoryCheckListItem,
} from './inventory-checks';

// Categories & Brands (Page-level)
export {
  getCategoriesPage,
  getCategoryTree,
  getBrandsPage,
  type CategoryFilters,
  type CategoryListItem,
  type BrandFilters,
  type BrandListItem,
} from './categories-brands';

// Complaints
export {
  getComplaints,
  getComplaintById,
  getComplaintStats,
  type ComplaintFilters,
  type ComplaintListItem,
} from './complaints';

// Shipments
export {
  getShipments,
  getShipmentById,
  getShipmentStats,
  type ShipmentFilters,
  type ShipmentListItem,
} from './shipments';

// Sales Returns
export {
  getSalesReturns,
  getSalesReturnById,
} from './sales-returns';

// Purchase Returns
export {
  getPurchaseReturns,
  getPurchaseReturnById,
} from './purchase-returns';

// Departments
export {
  getDepartments,
  getDepartmentById,
  getDepartmentTree,
  getDepartmentsForSelect,
  type DepartmentFilters,
  type DepartmentListItem,
} from './departments';

// Stock Locations
export {
  getStockLocations,
  getStockLocationById,
} from './stock-locations';

// Packaging
export {
  getPackagingUnits,
  getAllPackagingUnits,
} from './packaging';

// Price Adjustments
export {
  getPriceAdjustments,
  getPriceAdjustmentById,
} from './price-adjustments';

// Cost Adjustments
export {
  getCostAdjustments,
  getCostAdjustmentById,
} from './cost-adjustments';

// Penalties
export {
  getPenalties,
  getAllPenalties,
} from './penalties';

// Wiki
export {
  getWikiArticles,
  getWikiCategories,
  getWikiArticleBySlug,
} from './wiki';

// Inventory Receipts (detailed)
export {
  getInventoryReceipts,
  getInventoryReceiptById,
} from './inventory-receipts';

// Common types
export type { PaginatedResult } from './orders';

/**
 * Advanced Breadcrumb & Title System
 * Features:
 * - Auto-generated breadcrumbs from path structure  
 * - Context-aware dynamic titles (employee name, order number, etc)
 * - Consistent naming across all modules
 * - Multi-language support ready
 * - Clickable navigation with back button
 * - Mobile-first responsive design
 * - Description support for each page
 */

// 1. Complete Module Definitions for all system features
export const MODULES = {
  DASHBOARD: {
    key: 'dashboard',
    name: 'Trang chủ',
    icon: 'Home',
    title: 'Dashboard',
    description: 'Tổng quan hệ thống và báo cáo chính'
  },
  
  // === HRM Module ===
  HRM: {
    key: 'hrm',
    name: 'HRM',
    icon: 'Users',
    sections: {
      EMPLOYEES: {
        key: 'employees',
        name: 'Nhân viên',
        icon: 'User',
        list: {
          title: 'Danh sách nhân viên',
          description: 'Quản lý thông tin và hồ sơ nhân viên'
        },
        detail: {
          title: (name) => name ? `Hồ sơ ${name}` : 'Chi tiết nhân viên',
          description: 'Thông tin chi tiết và lịch sử làm việc'
        },
        edit: {
          title: (name) => name ? `Chỉnh sửa ${name}` : 'Chỉnh sửa nhân viên',
          description: 'Cập nhật thông tin nhân viên'
        },
        new: {
          title: 'Thêm nhân viên mới',
          description: 'Tạo hồ sơ nhân viên mới trong hệ thống'
        }
      },
      DEPARTMENTS: {
        key: 'departments',
        name: 'Phòng ban',
        icon: 'Building',
        list: {
          title: 'Danh sách phòng ban',
          description: 'Quản lý cơ cấu tổ chức và phòng ban'
        },
        detail: {
          title: (name) => name ? `Phòng ban ${name}` : 'Chi tiết phòng ban',
          description: 'Thông tin chi tiết và nhân sự phòng ban'
        },
        edit: {
          title: (name) => name ? `Chỉnh sửa ${name}` : 'Chỉnh sửa phòng ban',
          description: 'Cập nhật thông tin phòng ban'
        },
        new: {
          title: 'Thêm phòng ban mới',
          description: 'Tạo phòng ban mới trong cơ cấu tổ chức'
        }
      },
      ORGANIZATION_CHART: {
        key: 'organization-chart',
        name: 'Sơ đồ tổ chức',
        icon: 'Sitemap',
        list: {
          title: 'Sơ đồ tổ chức',
          description: 'Cơ cấu tổ chức và mối quan hệ phòng ban'
        }
      },
      ATTENDANCE: {
        key: 'attendance',
        name: 'Chấm công',
        icon: 'Clock',
        list: {
          title: 'Quản lý chấm công',
          description: 'Theo dõi giờ làm việc và chấm công nhân viên'
        }
      },
      LEAVES: {
        key: 'leaves',
        name: 'Nghỉ phép',
        icon: 'Calendar',
        list: {
          title: 'Quản lý nghỉ phép',
          description: 'Đơn xin nghỉ phép và duyệt phép'
        },
        detail: {
          title: (code) => code ? `Đơn nghỉ phép ${code}` : 'Chi tiết nghỉ phép',
          description: 'Thông tin chi tiết đơn nghỉ phép'
        }
      }
    }
  },

  // === SALES Module ===
  SALES: {
    key: 'sales',
    name: 'Bán hàng',
    icon: 'ShoppingCart',
    sections: {
      CUSTOMERS: {
        key: 'customers',
        name: 'Khách hàng',
        icon: 'Users',
        list: {
          title: 'Danh sách khách hàng',
          description: 'Quản lý thông tin khách hàng và CRM'
        },
        detail: {
          title: (name) => name ? `Khách hàng ${name}` : 'Chi tiết khách hàng',
          description: 'Lịch sử giao dịch và thông tin khách hàng'
        },
        edit: {
          title: (name) => name ? `Chỉnh sửa ${name}` : 'Chỉnh sửa khách hàng',
          description: 'Cập nhật thông tin khách hàng'
        },
        new: {
          title: 'Thêm khách hàng mới',
          description: 'Tạo hồ sơ khách hàng mới'
        }
      },
      PRODUCTS: {
        key: 'products',
        name: 'Sản phẩm',
        icon: 'Package',
        list: {
          title: 'Danh sách sản phẩm',
          description: 'Quản lý sản phẩm và danh mục'
        },
        detail: {
          title: (name) => name ? `Sản phẩm ${name}` : 'Chi tiết sản phẩm',
          description: 'Thông tin chi tiết và kho hàng'
        },
        edit: {
          title: (name) => name ? `Chỉnh sửa ${name}` : 'Chỉnh sửa sản phẩm',
          description: 'Cập nhật thông tin sản phẩm'
        },
        new: {
          title: 'Thêm sản phẩm mới',
          description: 'Tạo sản phẩm mới trong hệ thống'
        }
      },
      ORDERS: {
        key: 'orders',
        name: 'Đơn hàng',
        icon: 'FileText',
        list: {
          title: 'Danh sách đơn hàng',
          description: 'Quản lý đơn hàng và trạng thái giao hàng'
        },
        detail: {
          title: (code) => code ? `Đơn hàng ${code}` : 'Chi tiết đơn hàng',
          description: 'Thông tin chi tiết và trạng thái đơn hàng'
        },
        edit: {
          title: (code) => code ? `Chỉnh sửa ${code}` : 'Chỉnh sửa đơn hàng',
          description: 'Cập nhật thông tin đơn hàng'
        },
        new: {
          title: 'Tạo đơn hàng mới',
          description: 'Tạo đơn hàng cho khách hàng'
        }
      },
      RETURNS: {
        key: 'returns',
        name: 'Trả hàng',
        icon: 'RotateCcw',
        list: {
          title: 'Danh sách trả hàng',
          description: 'Quản lý đơn trả hàng và hoàn tiền'
        },
        detail: {
          title: (code) => code ? `Trả hàng ${code}` : 'Chi tiết trả hàng',
          description: 'Thông tin chi tiết đơn trả hàng'
        }
      }
    }
  },

  // === PROCUREMENT Module ===
  PROCUREMENT: {
    key: 'procurement',
    name: 'Mua hàng',
    icon: 'Truck',
    sections: {
      SUPPLIERS: {
        key: 'suppliers',
        name: 'Nhà cung cấp',
        icon: 'Building2',
        list: {
          title: 'Danh sách nhà cung cấp',
          description: 'Quản lý thông tin nhà cung cấp'
        },
        detail: {
          title: (name) => name ? `Nhà cung cấp ${name}` : 'Chi tiết nhà cung cấp',
          description: 'Lịch sử giao dịch và đánh giá'
        },
        edit: {
          title: (name) => name ? `Chỉnh sửa ${name}` : 'Chỉnh sửa nhà cung cấp',
          description: 'Cập nhật thông tin nhà cung cấp'
        },
        new: {
          title: 'Thêm nhà cung cấp mới',
          description: 'Tạo hồ sơ nhà cung cấp mới'
        }
      },
      PURCHASE_ORDERS: {
        key: 'purchase-orders',
        name: 'Đơn mua hàng',
        icon: 'ShoppingBag',
        list: {
          title: 'Danh sách đơn mua hàng',
          description: 'Quản lý đơn đặt hàng từ nhà cung cấp'
        },
        detail: {
          title: (code) => code ? `Đơn mua hàng ${code}` : 'Chi tiết đơn mua hàng',
          description: 'Thông tin chi tiết và trạng thái đơn hàng'
        },
        edit: {
          title: (code) => code ? `Chỉnh sửa ${code}` : 'Chỉnh sửa đơn mua hàng',
          description: 'Cập nhật thông tin đơn mua hàng'
        },
        new: {
          title: 'Tạo đơn mua hàng mới',
          description: 'Tạo đơn đặt hàng từ nhà cung cấp'
        }
      },
      PURCHASE_RETURNS: {
        key: 'purchase-returns',
        name: 'Trả hàng nhập',
        icon: 'PackageX',
        list: {
          title: 'Danh sách phiếu trả hàng',
          description: 'Quản lý việc trả hàng cho nhà cung cấp'
        },
        detail: {
          title: (code) => code ? `Phiếu trả ${code}` : 'Chi tiết phiếu trả hàng',
          description: 'Thông tin chi tiết phiếu trả hàng nhập'
        },
        new: {
          title: 'Tạo phiếu trả hàng',
          description: 'Tạo phiếu trả hàng cho nhà cung cấp'
        }
      },
      INVENTORY_RECEIPTS: {
        key: 'inventory-receipts',
        name: 'Phiếu nhập kho',
        icon: 'Package2',
        list: {
          title: 'Danh sách phiếu nhập kho',
          description: 'Quản lý việc nhập hàng vào kho'
        },
        detail: {
          title: (code) => code ? `Phiếu nhập ${code}` : 'Chi tiết phiếu nhập kho',
          description: 'Thông tin chi tiết phiếu nhập kho'
        }
      }
    }
  },

  // === FINANCE Module ===
  FINANCE: {
    key: 'finance',
    name: 'Tài chính',
    icon: 'CreditCard',
    sections: {
      CASHBOOK: {
        key: 'cashbook',
        name: 'Sổ quỹ',
        icon: 'Book',
        list: {
          title: 'Sổ quỹ tiền mặt',
          description: 'Theo dõi thu chi tiền mặt'
        }
      },
      RECEIPTS: {
        key: 'receipts',
        name: 'Phiếu thu',
        icon: 'Receipt',
        list: {
          title: 'Danh sách phiếu thu',
          description: 'Quản lý các khoản thu'
        },
        detail: {
          title: (code) => code ? `Phiếu thu ${code}` : 'Chi tiết phiếu thu',
          description: 'Thông tin chi tiết phiếu thu'
        },
        edit: {
          title: (code) => code ? `Chỉnh sửa ${code}` : 'Chỉnh sửa phiếu thu',
          description: 'Cập nhật thông tin phiếu thu'
        },
        new: {
          title: 'Tạo phiếu thu mới',
          description: 'Tạo phiếu thu tiền'
        }
      },
      PAYMENTS: {
        key: 'payments',
        name: 'Phiếu chi',
        icon: 'CreditCard',
        list: {
          title: 'Danh sách phiếu chi',
          description: 'Quản lý các khoản chi'
        },
        detail: {
          title: (code) => code ? `Phiếu chi ${code}` : 'Chi tiết phiếu chi',
          description: 'Thông tin chi tiết phiếu chi'
        },
        edit: {
          title: (code) => code ? `Chỉnh sửa ${code}` : 'Chỉnh sửa phiếu chi',
          description: 'Cập nhật thông tin phiếu chi'
        },
        new: {
          title: 'Tạo phiếu chi mới',
          description: 'Tạo phiếu chi tiền'
        }
      },
    }
  },

  // === INVENTORY Module ===
  INVENTORY: {
    key: 'inventory',
    name: 'Kho hàng',
    icon: 'Warehouse',
    sections: {
      STOCK_LOCATIONS: {
        key: 'stock-locations',
        name: 'Vị trí kho',
        icon: 'MapPin',
        list: {
          title: 'Danh sách vị trí kho',
          description: 'Quản lý vị trí và khu vực kho'
        }
      },
      STOCK_HISTORY: {
        key: 'stock-history',
        name: 'Lịch sử kho',
        icon: 'History',
        list: {
          title: 'Lịch sử xuất nhập kho',
          description: 'Theo dõi biến động hàng hóa'
        }
      },
      INVENTORY_CHECKS: {
        key: 'inventory-checks',
        name: 'Kiểm hàng',
        icon: 'ClipboardCheck',
        list: {
          title: 'Danh sách phiếu kiểm hàng',
          description: 'Quản lý kiểm kê định kỳ hàng hóa'
        },
        detail: {
          title: (code) => code ? `Phiếu kiểm hàng ${code}` : 'Chi tiết phiếu kiểm hàng',
          description: 'Thông tin chi tiết phiếu kiểm hàng'
        },
        edit: {
          title: (code) => code ? `Chỉnh sửa ${code}` : 'Chỉnh sửa phiếu kiểm hàng',
          description: 'Cập nhật thông tin phiếu kiểm hàng'
        },
        new: {
          title: 'Tạo phiếu kiểm hàng mới',
          description: 'Tạo phiếu kiểm kê định kỳ mới'
        }
      }
    }
  },

  // === INTERNAL OPERATIONS Module ===
  INTERNAL: {
    key: 'internal',
    name: 'Hoạt động nội bộ',
    icon: 'Settings',
    sections: {
      PACKAGING: {
        key: 'packaging',
        name: 'Đóng gói',
        icon: 'Package',
        list: {
          title: 'Quản lý đóng gói',
          description: 'Theo dõi việc đóng gói hàng hóa'
        }
      },
      SHIPMENTS: {
        key: 'shipments',
        name: 'Vận chuyển',
        icon: 'Truck',
        list: {
          title: 'Quản lý vận chuyển',
          description: 'Theo dõi vận chuyển và giao hàng'
        }
      },
      TASKS_WARRANTY: {
        key: 'warranty',
        name: 'Quản Lý Bảo Hành',
        icon: 'Wrench',
        list: {
          title: 'Danh sách phiếu bảo hành',
          description: 'Quản lý tiếp nhận và xử lý sản phẩm bảo hành'
        },
        detail: {
          title: (code) => code ? `Phiếu bảo hành ${code}` : 'Chi tiết phiếu bảo hành',
          description: 'Thông tin chi tiết và xử lý sản phẩm bảo hành'
        },
        edit: {
          title: (code) => code ? `Chỉnh sửa ${code}` : 'Chỉnh sửa phiếu bảo hành',
          description: 'Cập nhật thông tin phiếu bảo hành'
        },
        new: {
          title: 'Thêm phiếu bảo hành mới',
          description: 'Tạo phiếu tiếp nhận bảo hành mới'
        }
      },
      INTERNAL_TASKS: {
        key: 'internal-tasks',
        name: 'Công việc nội bộ',
        icon: 'ClipboardList',
        list: {
          title: 'Danh sách công việc nội bộ',
          description: 'Quản lý công việc và nhiệm vụ nội bộ'
        }
      },
      COMPLAINTS: {
        key: 'complaints',
        name: 'Khiếu nại',
        icon: 'AlertCircle',
        list: {
          title: 'Danh sách khiếu nại',
          description: 'Quản lý và xử lý khiếu nại từ khách hàng'
        },
        detail: {
          title: (code) => code ? `Khiếu nại ${code}` : 'Chi tiết khiếu nại',
          description: 'Thông tin chi tiết và lịch sử xử lý khiếu nại'
        },
        edit: {
          title: (code) => code ? `Chỉnh sửa ${code}` : 'Chỉnh sửa khiếu nại',
          description: 'Cập nhật thông tin khiếu nại'
        },
        new: {
          title: 'Tạo khiếu nại mới',
          description: 'Thêm khiếu nại mới vào hệ thống'
        },
        statistics: {
          title: 'Thống kê khiếu nại',
          description: 'Phân tích và báo cáo tổng quan khiếu nại'
        }
      },
      PENALTIES: {
        key: 'penalties',
        name: 'Phiếu phạt',
        icon: 'AlertTriangle',
        list: {
          title: 'Danh sách phiếu phạt',
          description: 'Theo dõi vi phạm và kỷ luật'
        },
        detail: {
          title: (code) => code ? `Phiếu phạt ${code}` : 'Chi tiết phiếu phạt',
          description: 'Thông tin chi tiết vi phạm và kết quả xử lý'
        },
        edit: {
          title: (code) => code ? `Chỉnh sửa phiếu phạt ${code}` : 'Chỉnh sửa phiếu phạt',
          description: 'Cập nhật thông tin phiếu phạt'
        },
        new: {
          title: 'Tạo phiếu phạt mới',
          description: 'Thêm bản ghi phiếu phạt mới vào hệ thống'
        }
      },
      TASKS: {
        key: 'tasks',
        name: 'Giao việc nội bộ',
        icon: 'ListTodo',
        list: {
          title: 'Quản lý công việc',
          description: 'Giao việc và theo dõi tiến độ công việc nội bộ'
        },
        detail: {
          title: (code) => code ? `Công việc ${code}` : 'Chi tiết công việc',
          description: 'Thông tin chi tiết công việc và tiến độ'
        },
        edit: {
          title: (code) => code ? `Chỉnh sửa ${code}` : 'Chỉnh sửa công việc',
          description: 'Cập nhật thông tin công việc'
        },
        new: {
          title: 'Tạo công việc mới',
          description: 'Giao công việc mới cho nhân viên'
        },
        calendar: {
          title: 'Lịch công việc',
          description: 'Xem công việc theo dạng lịch'
        }
      },
      DUTY_SCHEDULE: {
        key: 'duty-schedule',
        name: 'Lịch trực',
        icon: 'Calendar',
        list: {
          title: 'Lịch trực ca',
          description: 'Sắp xếp lịch trực và ca làm việc'
        }
      },
      RECONCILIATION: {
        key: 'reconciliation',
        name: 'Đối soát',
        icon: 'Calculator',
        list: {
          title: 'Đối soát tài khoản',
          description: 'Đối soát và kiểm tra số liệu'
        }
      },
      WIKI: {
        key: 'wiki',
        name: 'Wiki',
        icon: 'BookOpen',
        list: {
          title: 'Tài liệu Wiki',
          description: 'Tài liệu hướng dẫn và kiến thức'
        },
        detail: {
          title: (title) => title || 'Chi tiết Wiki',
          description: 'Nội dung tài liệu hướng dẫn'
        },
        edit: {
          title: (title) => title ? `Chỉnh sửa ${title}` : 'Chỉnh sửa Wiki',
          description: 'Cập nhật nội dung tài liệu'
        },
        new: {
          title: 'Tạo tài liệu mới',
          description: 'Tạo tài liệu hướng dẫn mới'
        }
      }
    }
  },

  // === REPORTS Module ===
  REPORTS: {
    key: 'reports',
    name: 'Báo cáo',
    icon: 'BarChart',
    sections: {
      SALES_REPORT: {
        key: 'sales-report',
        name: 'Báo cáo bán hàng',
        icon: 'TrendingUp',
        list: {
          title: 'Báo cáo bán hàng',
          description: 'Thống kê doanh thu và hiệu suất bán hàng'
        }
      },
      INVENTORY_REPORT: {
        key: 'inventory-report',
        name: 'Báo cáo kho',
        icon: 'Package',
        list: {
          title: 'Báo cáo tồn kho',
          description: 'Thống kê tình trạng kho hàng'
        }
      }
    }
  },

  // === SETTINGS Module ===
  SETTINGS: {
    key: 'settings',
    name: 'Cài đặt',
    icon: 'Settings',
    sections: {
      GENERAL: {
        key: 'general',
        name: 'Cài đặt chung',
        icon: 'Settings',
        list: {
          title: 'Cài đặt hệ thống',
          description: 'Cấu hình chung của hệ thống'
        }
      },
      APPEARANCE: {
        key: 'appearance',
        name: 'Giao diện',
        icon: 'Palette',
        list: {
          title: 'Cài đặt giao diện',
          description: 'Tùy chỉnh giao diện và theme'
        }
      },
      STORE_INFO: {
        key: 'store-info',
        name: 'Thông tin cửa hàng',
        icon: 'Store',
        list: {
          title: 'Thông tin cửa hàng',
          description: 'Cấu hình thông tin doanh nghiệp'
        }
      },
      PROVINCES: {
        key: 'provinces',
        name: 'Tỉnh thành',
        icon: 'Map',
        list: {
          title: 'Quản lý tỉnh thành',
          description: 'Danh sách tỉnh thành và địa chỉ'
        }
      },
      EMPLOYEE_SETTINGS: {
        key: 'employee-settings',
        name: 'Cài đặt nhân viên',
        icon: 'UserCog',
        list: {
          title: 'Cài đặt nhân viên',
          description: 'Cấu hình quy định về nhân viên'
        }
      },
      PRICING_SETTINGS: {
        key: 'pricing-settings',
        name: 'Cài đặt giá',
        icon: 'DollarSign',
        list: {
          title: 'Cài đặt định giá',
          description: 'Cấu hình chính sách giá'
        }
      },
      PAYMENT_SETTINGS: {
        key: 'payment-settings',
        name: 'Cài đặt thanh toán',
        icon: 'CreditCard',
        list: {
          title: 'Cài đặt thanh toán',
          description: 'Cấu hình phương thức thanh toán'
        }
      },
      INVENTORY_SETTINGS: {
        key: 'inventory-settings',
        name: 'Cài đặt kho',
        icon: 'Warehouse',
        list: {
          title: 'Cài đặt kho hàng',
          description: 'Cấu hình quản lý kho'
        }
      },
      SHIPPING_PARTNERS: {
        key: 'shipping-partners',
        name: 'Đối tác vận chuyển',
        icon: 'Truck',
        list: {
          title: 'Đối tác vận chuyển',
          description: 'Quản lý nhà cung cấp dịch vụ vận chuyển'
        }
      },
      SALES_CONFIG: {
        key: 'sales-config',
        name: 'Cấu hình bán hàng',
        icon: 'ShoppingCart',
        list: {
          title: 'Cấu hình bán hàng',
          description: 'Cài đặt quy trình bán hàng'
        }
      },
      ROOT: {
        key: 'settings',
        name: 'Cài đặt',
        icon: 'Settings',
        list: {
          title: 'Cài đặt hệ thống',
          description: 'Quản lý cài đặt và cấu hình'
        }
      },
      EMPLOYEES: {
        key: 'employees',
        name: 'Nhân viên',
        icon: 'Users',
        list: {
          title: 'Cài đặt nhân viên',
          description: 'Cấu hình liên quan nhân viên'
        }
      },
      TAXES: {
        key: 'taxes',
        name: 'Thuế',
        icon: 'Receipt',
        list: {
          title: 'Cài đặt thuế',
          description: 'Quản lý thuế suất'
        }
      },
      PAYMENT_METHODS: {
        key: 'payments',
        name: 'Phương thức thanh toán',
        icon: 'CreditCard',
        list: {
          title: 'Phương thức thanh toán',
          description: 'Cấu hình các hình thức thanh toán'
        }
      },
      PRINT_TEMPLATES: {
        key: 'print-templates',
        name: 'Mẫu in',
        icon: 'Printer',
        list: {
          title: 'Mẫu in',
          description: 'Quản lý mẫu in hóa đơn'
        }
      },
      STOCK_LOCATIONS: {
        key: 'stock-locations',
        name: 'Vị trí kho',
        icon: 'MapPin',
        list: {
          title: 'Vị trí kho',
          description: 'Quản lý vị trí trong kho'
        }
      },
      OTHER: {
        key: 'other',
        name: 'Khác',
        icon: 'MoreHorizontal',
        list: {
          title: 'Cài đặt khác',
          description: 'Các cài đặt khác'
        }
      },
      SYSTEM_LOGS: {
        key: 'system-logs',
        name: 'Nhật ký hệ thống',
        icon: 'FileText',
        list: {
          title: 'Nhật ký hệ thống',
          description: 'Xem lịch sử hoạt động'
        }
      },
      IMPORT_EXPORT_LOGS: {
        key: 'import-export-logs',
        name: 'Nhật ký xuất nhập',
        icon: 'Database',
        list: {
          title: 'Nhật ký xuất/nhập',
          description: 'Lịch sử xuất nhập file'
        }
      }
    }
  }
} as const;

// 2. Path Pattern Mapping for smart routing
const PATH_PATTERNS = {
  // Dashboard
  '/dashboard': { module: 'DASHBOARD' },
  
  // === ROOT-LEVEL URL ALIASES (for backward compatibility) ===
  // HRM root aliases
  '/employees': { module: 'HRM', section: 'EMPLOYEES', action: 'list' },
  '/employees/new': { module: 'HRM', section: 'EMPLOYEES', action: 'new' },
  '/employees/trash': { module: 'HRM', section: 'EMPLOYEES', action: 'trash' },
  '/employees/:systemId': { module: 'HRM', section: 'EMPLOYEES', action: 'detail' },
  '/employees/:systemId/edit': { module: 'HRM', section: 'EMPLOYEES', action: 'edit' },
  '/departments': { module: 'HRM', section: 'DEPARTMENTS', action: 'list' },
  '/departments/new': { module: 'HRM', section: 'DEPARTMENTS', action: 'new' },
  '/departments/trash': { module: 'HRM', section: 'DEPARTMENTS', action: 'trash' },
  '/departments/:systemId': { module: 'HRM', section: 'DEPARTMENTS', action: 'detail' },
  '/departments/:systemId/edit': { module: 'HRM', section: 'DEPARTMENTS', action: 'edit' },
  '/departments/organization-chart': { module: 'HRM', section: 'ORGANIZATION_CHART', action: 'list' },
  '/attendance': { module: 'HRM', section: 'ATTENDANCE', action: 'list' },
  '/attendance/attendance': { module: 'HRM', section: 'ATTENDANCE', action: 'list' },
  '/leaves': { module: 'HRM', section: 'LEAVES', action: 'list' },
  '/leaves/:systemId': { module: 'HRM', section: 'LEAVES', action: 'detail' },
  
  // Sales root aliases
  '/customers': { module: 'SALES', section: 'CUSTOMERS', action: 'list' },
  '/customers/new': { module: 'SALES', section: 'CUSTOMERS', action: 'new' },
  '/customers/trash': { module: 'SALES', section: 'CUSTOMERS', action: 'trash' },
  '/customers/:systemId': { module: 'SALES', section: 'CUSTOMERS', action: 'detail' },
  '/customers/:systemId/edit': { module: 'SALES', section: 'CUSTOMERS', action: 'edit' },
  '/products': { module: 'SALES', section: 'PRODUCTS', action: 'list' },
  '/products/new': { module: 'SALES', section: 'PRODUCTS', action: 'new' },
  '/products/trash': { module: 'SALES', section: 'PRODUCTS', action: 'trash' },
  '/products/:systemId': { module: 'SALES', section: 'PRODUCTS', action: 'detail' },
  '/products/:systemId/edit': { module: 'SALES', section: 'PRODUCTS', action: 'edit' },
  '/orders': { module: 'SALES', section: 'ORDERS', action: 'list' },
  '/orders/new': { module: 'SALES', section: 'ORDERS', action: 'new' },
  '/orders/trash': { module: 'SALES', section: 'ORDERS', action: 'trash' },
  '/orders/:systemId': { module: 'SALES', section: 'ORDERS', action: 'detail' },
  '/orders/:systemId/edit': { module: 'SALES', section: 'ORDERS', action: 'edit' },
  '/orders/:systemId/return': { module: 'SALES', section: 'RETURNS', action: 'new' },
  '/returns': { module: 'SALES', section: 'RETURNS', action: 'list' },
  '/returns/:systemId': { module: 'SALES', section: 'RETURNS', action: 'detail' },
  '/returns/new': { module: 'SALES', section: 'RETURNS', action: 'new' },
  
  // Procurement root aliases
  '/suppliers': { module: 'PROCUREMENT', section: 'SUPPLIERS', action: 'list' },
  '/suppliers/new': { module: 'PROCUREMENT', section: 'SUPPLIERS', action: 'new' },
  '/suppliers/:systemId': { module: 'PROCUREMENT', section: 'SUPPLIERS', action: 'detail' },
  '/suppliers/:systemId/edit': { module: 'PROCUREMENT', section: 'SUPPLIERS', action: 'edit' },
  '/purchase-orders': { module: 'PROCUREMENT', section: 'PURCHASE_ORDERS', action: 'list' },
  '/purchase-orders/new': { module: 'PROCUREMENT', section: 'PURCHASE_ORDERS', action: 'new' },
  '/purchase-orders/:systemId': { module: 'PROCUREMENT', section: 'PURCHASE_ORDERS', action: 'detail' },
  '/purchase-orders/:systemId/edit': { module: 'PROCUREMENT', section: 'PURCHASE_ORDERS', action: 'edit' },
  '/purchase-orders/:systemId/return': { module: 'PROCUREMENT', section: 'PURCHASE_RETURNS', action: 'new' },
  '/purchase-returns': { module: 'PROCUREMENT', section: 'PURCHASE_RETURNS', action: 'list' },
  '/purchase-returns/new': { module: 'PROCUREMENT', section: 'PURCHASE_RETURNS', action: 'new' },
  '/purchase-returns/:systemId': { module: 'PROCUREMENT', section: 'PURCHASE_RETURNS', action: 'detail' },
  '/inventory-receipts': { module: 'PROCUREMENT', section: 'INVENTORY_RECEIPTS', action: 'list' },
  '/inventory-receipts/:systemId': { module: 'PROCUREMENT', section: 'INVENTORY_RECEIPTS', action: 'detail' },
  
  // Finance root aliases
  '/cashbook': { module: 'FINANCE', section: 'CASHBOOK', action: 'list' },
  '/receipts': { module: 'FINANCE', section: 'RECEIPTS', action: 'list' },
  '/receipts/new': { module: 'FINANCE', section: 'RECEIPTS', action: 'new' },
  '/receipts/:systemId': { module: 'FINANCE', section: 'RECEIPTS', action: 'detail' },
  '/receipts/:systemId/edit': { module: 'FINANCE', section: 'RECEIPTS', action: 'edit' },
  '/payments': { module: 'FINANCE', section: 'PAYMENTS', action: 'list' },
  '/payments/new': { module: 'FINANCE', section: 'PAYMENTS', action: 'new' },
  '/payments/:systemId': { module: 'FINANCE', section: 'PAYMENTS', action: 'detail' },
  '/payments/:systemId/edit': { module: 'FINANCE', section: 'PAYMENTS', action: 'edit' },
  
  // Inventory root aliases
  '/stock-locations': { module: 'INVENTORY', section: 'STOCK_LOCATIONS', action: 'list' },
  '/stock-history': { module: 'INVENTORY', section: 'STOCK_HISTORY', action: 'list' },
  '/inventory-checks': { module: 'INVENTORY', section: 'INVENTORY_CHECKS', action: 'list' },
  '/inventory-checks/new': { module: 'INVENTORY', section: 'INVENTORY_CHECKS', action: 'new' },
  '/inventory-checks/:systemId': { module: 'INVENTORY', section: 'INVENTORY_CHECKS', action: 'detail' },
  '/inventory-checks/:systemId/edit': { module: 'INVENTORY', section: 'INVENTORY_CHECKS', action: 'edit' },
  '/inventory-checks/edit/:systemId': { module: 'INVENTORY', section: 'INVENTORY_CHECKS', action: 'edit' },
  '/inventory-settings': { module: 'SETTINGS', section: 'INVENTORY_SETTINGS', action: 'list' },
  
  // Internal operations root aliases
  '/packaging': { module: 'INTERNAL', section: 'PACKAGING', action: 'list' },
  '/packaging/:systemId': { module: 'INTERNAL', section: 'PACKAGING', action: 'detail' },
  '/shipments': { module: 'INTERNAL', section: 'SHIPMENTS', action: 'list' },
  '/shipments/:systemId': { module: 'INTERNAL', section: 'SHIPMENTS', action: 'detail' },
  '/reconciliation': { module: 'INTERNAL', section: 'RECONCILIATION', action: 'list' },
  '/warranty': { module: 'INTERNAL', section: 'TASKS_WARRANTY', action: 'list' },
  '/warranty/:systemId': { module: 'INTERNAL', section: 'TASKS_WARRANTY', action: 'detail' },
  '/warranty/:systemId/edit': { module: 'INTERNAL', section: 'TASKS_WARRANTY', action: 'edit' },
  '/warranty/new': { module: 'INTERNAL', section: 'TASKS_WARRANTY', action: 'new' },
  '/complaints': { module: 'INTERNAL', section: 'COMPLAINTS', action: 'list' },
  '/complaints/statistics': { module: 'INTERNAL', section: 'COMPLAINTS', action: 'statistics' },
  '/complaints/new': { module: 'INTERNAL', section: 'COMPLAINTS', action: 'new' },
  '/complaints/:systemId': { module: 'INTERNAL', section: 'COMPLAINTS', action: 'detail' },
  '/complaints/:systemId/edit': { module: 'INTERNAL', section: 'COMPLAINTS', action: 'edit' },
  '/penalties': { module: 'INTERNAL', section: 'PENALTIES', action: 'list' },
  '/penalties/new': { module: 'INTERNAL', section: 'PENALTIES', action: 'new' },
  '/penalties/:systemId': { module: 'INTERNAL', section: 'PENALTIES', action: 'detail' },
  '/penalties/:systemId/edit': { module: 'INTERNAL', section: 'PENALTIES', action: 'edit' },
  '/penalties/edit/:systemId': { module: 'INTERNAL', section: 'PENALTIES', action: 'edit' },
  '/tasks': { module: 'INTERNAL', section: 'TASKS', action: 'list' },
  '/tasks/calendar': { module: 'INTERNAL', section: 'TASKS', action: 'calendar' },
  '/tasks/new': { module: 'INTERNAL', section: 'TASKS', action: 'new' },
  '/tasks/:systemId': { module: 'INTERNAL', section: 'TASKS', action: 'detail' },
  '/tasks/:systemId/edit': { module: 'INTERNAL', section: 'TASKS', action: 'edit' },
  '/internal-tasks': { module: 'INTERNAL', section: 'INTERNAL_TASKS', action: 'list' },
  '/internal-tasks/:systemId': { module: 'INTERNAL', section: 'INTERNAL_TASKS', action: 'detail' },
  '/wiki': { module: 'INTERNAL', section: 'WIKI', action: 'list' },
  '/wiki/new': { module: 'INTERNAL', section: 'WIKI', action: 'new' },
  '/wiki/:systemId': { module: 'INTERNAL', section: 'WIKI', action: 'detail' },
  '/wiki/:systemId/edit': { module: 'INTERNAL', section: 'WIKI', action: 'edit' },
  
  // Reports root aliases
  '/reports/sales-report': { module: 'REPORTS', section: 'SALES_REPORT', action: 'list' },
  '/reports/inventory-report': { module: 'REPORTS', section: 'INVENTORY_REPORT', action: 'list' },
  
  // Settings root aliases (already have most)
  '/provinces': { module: 'SETTINGS', section: 'PROVINCES', action: 'list' },
  '/provinces/:systemId': { module: 'SETTINGS', section: 'PROVINCES', action: 'detail' },
  '/pricing-settings': { module: 'SETTINGS', section: 'PRICING_SETTINGS', action: 'list' },
  '/payment-methods': { module: 'SETTINGS', section: 'PAYMENT_METHODS', action: 'list' },
  '/shipping-partners': { module: 'SETTINGS', section: 'SHIPPING_PARTNERS', action: 'list' },
} as const;

// 3. Smart path matching with parameter support
function matchPath(pathname: string): { module: string; section?: string; action?: string; params?: Record<string, string> } | null {
  // Try exact match first
  if (PATH_PATTERNS[pathname]) {
    return PATH_PATTERNS[pathname];
  }

  // Try pattern matching with parameters
  for (const [pattern, config] of Object.entries(PATH_PATTERNS)) {
    if (pattern.includes(':')) {
      const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '([^/]+)') + '$');
      const match = pathname.match(regex);
      
      if (match) {
        // Extract parameter names and values
        const paramNames = pattern.match(/:[^/]+/g)?.map(p => p.slice(1)) || [];
        const params: Record<string, string> = {};
        
        paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });

        return { ...config, params };
      }
    }
  }

  return null;
}

// 4. Advanced Breadcrumb Generator
export interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: string;
  isParam?: boolean;
  isCurrent?: boolean;
}

export function generateBreadcrumb(pathname: string, context?: Record<string, any>): BreadcrumbItem[] {
  const breadcrumb: BreadcrumbItem[] = [];
  const pathMatch = matchPath(pathname);

  if (!pathMatch) {
    return [{ label: 'Trang chủ', href: '/dashboard' }];
  }

  // Always start with Dashboard if not already there
  if (pathname !== '/dashboard') {
    breadcrumb.push({
      label: 'Trang chủ',
      href: '/dashboard'
    });
  }

  const module = MODULES[pathMatch.module];
  if (!module) return breadcrumb;

  // Add section level (list page link)
  if (pathMatch.section && module.sections) {
    const section = module.sections[pathMatch.section];
    if (section) {
      // Get list path - use first segment (e.g., /employees, /customers)
      const pathSegments = pathname.split('/').filter(Boolean);
      const listPath = '/' + pathSegments[0];
      
      breadcrumb.push({
        label: section.name,
        href: listPath,
        isCurrent: !pathMatch.action || pathMatch.action === 'list'
      });

      // Handle different actions with improved UX
      if (pathMatch.action && pathMatch.action !== 'list') {
        
        // NEW action: Trang chủ > Nhân viên > Thêm mới
        if (pathMatch.action === 'new') {
          breadcrumb.push({
            label: 'Thêm mới',
            href: pathname,
            isCurrent: true
          });
        }
        
        // TRASH action: Trang chủ > Nhân viên > Thùng rác
        else if (pathMatch.action === 'trash') {
          breadcrumb.push({
            label: 'Thùng rác',
            href: pathname,
            isCurrent: true
          });
        }
        
        // DETAIL action: Trang chủ > Nhân viên > Bùi My
        else if (pathMatch.action === 'detail' && pathMatch.params) {
          const contextName = getContextName(pathMatch, context);
          breadcrumb.push({
            label: contextName,
            href: pathname,
            isParam: true,
            isCurrent: true
          });
        }
        
        // EDIT action: Trang chủ > Nhân viên > Bùi My > Chỉnh sửa
        else if (pathMatch.action === 'edit' && pathMatch.params) {
          const contextName = getContextName(pathMatch, context);
          const id = pathMatch.params.id || pathMatch.params.periodId;
          
          // Build detail page URL (context item is clickable)
          let detailPath = listPath;
          if (id) {
            // Check URL pattern to construct correct detail path
            // Standard pattern: /${id}/edit → detail page is /${id}
            if (pathname.includes(`/${id}/edit`)) {
              detailPath = `${listPath}/${id}`;
            }
          }
          
          // Add context breadcrumb (clickable to detail page)
          breadcrumb.push({
            label: contextName,
            href: detailPath,
            isParam: true
          });
          
          // Add edit action breadcrumb (current page)
          breadcrumb.push({
            label: 'Chỉnh sửa',
            href: pathname,
            isCurrent: true
          });
        }
      }
    }
  }

  return breadcrumb;
}

// 5. Dynamic Title Generator
export interface PageTitle {
  title: string;
  description?: string;
}

export function generatePageTitle(pathname: string, context?: Record<string, any>): PageTitle {
  const pathMatch = matchPath(pathname);
  
  if (!pathMatch) {
    return { title: '', description: '' };
  }

  const module = MODULES[pathMatch.module];
  if (!module) {
    return { title: '', description: '' };
  }

  // Dashboard special case
  if (pathMatch.module === 'DASHBOARD') {
    return {
      title: module.title || module.name,
      description: module.description
    };
  }

  // Module-only pages
  if (!pathMatch.section) {
    return {
      title: module.name,
      description: `Tổng quan module ${module.name.toLowerCase()}`
    };
  }

  const section = module.sections?.[pathMatch.section];
  if (!section) {
    return { title: '', description: '' };
  }

  // Generate title based on action
  switch (pathMatch.action) {
    case 'list':
      return {
        title: section.list?.title || section.name,
        description: section.list?.description
      };

    case 'new':
      return {
        title: section.new?.title || `Thêm ${section.name.toLowerCase()} mới`,
        description: section.new?.description || `Tạo ${section.name.toLowerCase()} mới trong hệ thống`
      };

    case 'detail':
      const detailName = getContextName(pathMatch, context);
      return {
        title: typeof section.detail?.title === 'function' 
          ? section.detail.title(detailName) 
          : (section.detail?.title || detailName),
        description: section.detail?.description
      };

    case 'edit':
      const editName = getContextName(pathMatch, context);
      return {
        title: typeof section.edit?.title === 'function'
          ? section.edit.title(editName)
          : (section.edit?.title || `Chỉnh sửa ${editName}`),
        description: section.edit?.description
      };

    default:
      return {
        title: section.name,
        description: section.list?.description
      };
  }
}

// 6. Helper function to get context name for parameters
function getContextName(pathMatch: { params?: Record<string, string> }, context?: Record<string, any>): string {
  if (!pathMatch.params) return 'Chi tiết';

  // Priority 1: Use name from context (best UX)
  // Example: "Bùi My" instead of "NV027"
  const contextName = context?.fullName || context?.name || context?.title || context?.displayName;
  if (contextName) return contextName;
  
  // Priority 2: Use ID code from context
  // Example: "NV027" from employee.id
  if (context?.id) return context.id;
  
  // Priority 3: Extract ID from URL params
  const id = pathMatch.params.id || pathMatch.params.periodId || pathMatch.params.systemId;
  
  if (id) {
    // Format based on ID pattern
    if (id.startsWith('ORD')) return `Đơn hàng #${id}`;
    if (id.startsWith('CUST')) return `Khách hàng #${id}`;
    if (id.startsWith('NV')) return id; // Employee code: NV001, NV027
    if (id.startsWith('PO')) return `Đơn mua #${id}`;
    return id; // Default: return as-is
  }

  return 'Chi tiết';
}

// 7. Utility function to get back navigation path
export function getBackPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  
  // Remove last segment for back navigation
  if (segments.length <= 1) {
    return '/dashboard';
  }

  // Handle special cases
  if (pathname.endsWith('/edit') || pathname.endsWith('/new')) {
    // Remove last two segments for edit/new actions
    return '/' + segments.slice(0, -1).join('/');
  }

  // Remove last segment
  return '/' + segments.slice(0, -1).join('/');
}

// 8. Export helper for checking if back button should be shown
export function shouldShowBackButton(pathname: string): boolean {
  return pathname !== '/dashboard' && pathname !== '/';
}
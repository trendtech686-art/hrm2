import type { Customer, CustomerStatus } from './types.ts'

export const data: Customer[] = [
  {
    systemId: "CUST000001",
    id: "KH000001",
    name: "Công ty Cổ phần Bất động sản Hưng Thịnh",
    email: "info@hungthinhcorp.vn",
    phone: "0901112233",
    company: "Hưng Thịnh Corp",
    status: "Đang giao dịch",
    taxCode: "0301234567",
    zaloPhone: "0901112233",
    currentDebt: 30000000,
    maxDebt: 50000000,
    accountManagerId: "EMP000002",
    accountManagerName: "Trần Thị Bình",
    createdAt: "2024-03-10",
    totalOrders: 2,
    totalSpent: 42000000,
    totalQuantityPurchased: 5,
    totalQuantityReturned: 0,
    lastPurchaseDate: "2025-09-20",
    failedDeliveries: 0,
    
    // New fields
    source: "Referral",
    campaign: "Q3-2024-Real-Estate",
    paymentTerms: "NET30",
    creditRating: "AA",
    allowCredit: true,
    defaultDiscount: 5,
    pricingLevel: "Wholesale",
    tags: ["VIP", "Bất động sản", "Khách hàng lớn"],
    contacts: [
      { id: "1", name: "Nguyễn Văn A", role: "Giám đốc", phone: "0901112233", email: "a.nguyen@hungthinhcorp.vn", isPrimary: true },
      { id: "2", name: "Trần Thị B", role: "Kế toán", phone: "0901112244", email: "b.tran@hungthinhcorp.vn", isPrimary: false }
    ],
    social: {
      website: "https://hungthinhcorp.vn",
      facebook: "HungThinhCorp"
    },
    contract: {
      number: "HĐ-2024-001",
      startDate: "2024-01-01",
      endDate: "2025-12-31",
      value: 500000000,
      status: "Active"
    },
    // Debt Tracking
    debtTransactions: [
      {
        systemId: "DT000001",
        orderId: "ORD000123",
        orderDate: "2025-09-20",
        amount: 30000000,
        dueDate: "2025-10-20", // NET30 → 30 ngày sau orderDate → Quá hạn 5 ngày (hôm nay 25/10)
        isPaid: false,
        remainingAmount: 30000000,
        notes: "Đơn hàng thiết bị văn phòng"
      }
    ],
    debtReminders: [
      {
        systemId: "REM000001",
        reminderDate: "2025-10-21",
        reminderType: "Gọi điện",
        reminderBy: "EMP000002",
        reminderByName: "Trần Thị Bình",
        customerResponse: "Hứa trả",
        promisePaymentDate: "2025-10-27",
        notes: "KH đang chờ thanh toán từ khách của họ, hứa trả trong tuần này",
        createdAt: "2025-10-21T09:30:00Z"
      }
    ]
  },
  {
    systemId: "CUST000002",
    id: "KH000002",
    name: "Chuỗi cà phê The Coffee House",
    email: "contact@thecoffeehouse.vn",
    phone: "02871087088",
    company: "The Coffee House",
    status: "Đang giao dịch",
    taxCode: "0313222173",
    zaloPhone: "0902888999",
    currentDebt: 0,
    maxDebt: 100000000,
    accountManagerId: "EMP000007",
    accountManagerName: "Đỗ Hùng",
    createdAt: "2024-01-25",
    totalOrders: 5,
    totalSpent: 156000000,
    totalQuantityPurchased: 15,
    totalQuantityReturned: 0,
    lastPurchaseDate: "2025-10-10",
    failedDeliveries: 0,
    
    // New fields
    source: "Website",
    campaign: "Online-Marketing-2024",
    paymentTerms: "NET15",
    creditRating: "AAA",
    allowCredit: true,
    defaultDiscount: 10,
    pricingLevel: "VIP",
    tags: ["F&B", "Chuỗi", "Khách hàng thân thiết"],
    contacts: [
      { id: "1", name: "Nguyễn Thị Thu", role: "Purchasing Manager", phone: "0902888999", email: "thu.nguyen@thecoffeehouse.vn", isPrimary: true }
    ],
    social: {
      website: "https://thecoffeehouse.vn",
      facebook: "TheCoffeeHouseVN",
      linkedin: "the-coffee-house"
    },
    // Debt Tracking - Không có nợ
    debtTransactions: [],
    debtReminders: []
  },
  {
    systemId: "CUST000003",
    id: "KH000003",
    name: "Anh Trần Minh Hoàng",
    email: "tmhoang.dev@gmail.com",
    phone: "0987123456",
    company: "Khách lẻ",
    status: "Đang giao dịch",
    zaloPhone: "0987123456",
    currentDebt: 0,
    maxDebt: 10000000,
    accountManagerId: "EMP000006",
    accountManagerName: "Vũ Thị Giang",
    createdAt: "2025-08-01",
    totalOrders: 1,
    totalSpent: 8000000,
    totalQuantityPurchased: 1,
    totalQuantityReturned: 0,
    lastPurchaseDate: "2025-08-01",
    failedDeliveries: 0,
    
    // New fields
    source: "Social",
    paymentTerms: "COD",
    allowCredit: false,
    pricingLevel: "Retail",
    tags: ["Khách lẻ"],
    // Debt Tracking - Không có nợ
    debtTransactions: [],
    debtReminders: []
  },
  {
    systemId: "CUST000004",
    id: "KH000004",
    name: "Shop thời trang GenZ Style",
    email: "genzstyle@fashion.com",
    phone: "0918765432",
    company: "GenZ Style",
    status: "Ngừng Giao Dịch",
    taxCode: "0398765432",
    zaloPhone: "0918765432",
    currentDebt: 500000,
    maxDebt: 20000000,
    accountManagerId: "EMP000009",
    accountManagerName: "Trịnh Văn Khoa",
    createdAt: "2023-11-15",
    totalOrders: 3,
    totalSpent: 12500000,
    totalQuantityPurchased: 8,
    totalQuantityReturned: 2,
    lastPurchaseDate: "2024-06-30",
    failedDeliveries: 1,
    
    // New fields
    source: "Partner",
    campaign: "Fashion-Partner-2023",
    paymentTerms: "NET7",
    creditRating: "C",
    allowCredit: false,
    pricingLevel: "Retail",
    tags: ["Thời trang", "Nợ xấu", "Tạm ngưng"],
    // Debt Tracking - Nợ xấu 490 ngày!
    debtTransactions: [
      {
        systemId: "DT000002",
        orderId: "ORD000045",
        orderDate: "2024-06-15",
        amount: 500000,
        dueDate: "2024-06-22", // NET7 → Quá hạn 490 ngày!
        isPaid: false,
        remainingAmount: 500000,
        notes: "Đơn hàng phụ kiện thời trang"
      }
    ],
    debtReminders: [
      {
        systemId: "REM000002",
        reminderDate: "2024-07-01",
        reminderType: "Gọi điện",
        reminderBy: "EMP000009",
        reminderByName: "Trịnh Văn Khoa",
        customerResponse: "Không liên lạc được",
        notes: "Gọi nhiều lần không nghe máy",
        createdAt: "2024-07-01T14:00:00Z"
      },
      {
        systemId: "REM000003",
        reminderDate: "2024-08-15",
        reminderType: "Email",
        reminderBy: "EMP000009",
        reminderByName: "Trịnh Văn Khoa",
        customerResponse: "Không liên lạc được",
        notes: "Email gửi nhưng không phản hồi",
        createdAt: "2024-08-15T10:00:00Z"
      },
      {
        systemId: "REM000004",
        reminderDate: "2024-09-20",
        reminderType: "Gặp trực tiếp",
        reminderBy: "EMP000009",
        reminderByName: "Trịnh Văn Khoa",
        customerResponse: "Từ chối",
        notes: "KH gặp khó khăn tài chính, từ chối thanh toán. Đề xuất xử lý pháp lý",
        createdAt: "2024-09-20T16:30:00Z"
      }
    ]
  }
];

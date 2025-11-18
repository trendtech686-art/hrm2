export const data = [
  {
    id: 'DH000001',
    customerName: 'Công ty Cổ phần Bất động sản Hưng Thịnh',
    customerSystemId: 'CUST000001',
    branchName: 'Chi nhánh Trung tâm',
    salesperson: 'Trần Thị B',
    salespersonSystemId: 'EMP000002',
    orderDate: '2025-11-01 09:30',
    expectedDeliveryDate: '2025-11-05',
    expectedPaymentMethod: 'Tiền mặt',
    
    shippingAddress: '123 Đường ABC, Phường 1, Quận 1, TP.HCM',
    billingAddress: '123 Đường ABC, Phường 1, Quận 1, TP.HCM',
    
    status: 'Hoàn thành',
    paymentStatus: 'Thanh toán toàn bộ',
    deliveryStatus: 'Đã giao hàng',
    printStatus: 'Đã in',
    stockOutStatus: 'Xuất kho toàn bộ',
    returnStatus: 'Chưa trả hàng',
    deliveryMethod: 'Dịch vụ giao hàng',
    
    approvedDate: '2025-11-01 10:00',
    completedDate: '2025-11-05 15:30',
    dispatchedDate: '2025-11-02 08:00',
    dispatchedByEmployeeName: 'Lê Văn C',
    
    codAmount: 0,
    
    products: [
      {
        productId: 'SP000001',
        productName: 'Laptop Dell Inspiron 15',
        quantity: 1,
        price: 15000000,
        total: 15000000
      },
      {
        productId: 'SP000002',
        productName: 'Chuột Logitech MX Master 3',
        quantity: 1,
        price: 2000000,
        total: 2000000
      }
    ],
    
    subtotal: 17000000,
    shippingFee: 50000,
    tax: 0,
    orderDiscount: 500000,
    orderDiscountType: 'fixed',
    orderDiscountReason: 'Khách hàng thân thiết',
    grandTotal: 16550000,
    paidAmount: 16550000,
    
    payments: [],
    
    packagingStatus: 'Đóng gói toàn bộ',
    
    notes: 'Giao hàng giờ hành chính',
    tags: ['Khách VIP', 'Ưu tiên']
  },
  
  {
    id: 'DH000002',
    customerName: 'Chuỗi cà phê The Coffee House',
    customerSystemId: 'CUST000002',
    branchName: 'Chi nhánh Quận 3',
    salesperson: 'Phạm Văn D',
    salespersonSystemId: 'EMP000003',
    orderDate: '2025-11-03 14:20',
    expectedDeliveryDate: '2025-11-08',
    expectedPaymentMethod: 'Chuyển khoản',
    
    shippingAddress: '456 Đường XYZ, Phường 5, Quận 3, TP.HCM',
    
    status: 'Đang giao dịch',
    paymentStatus: 'Thanh toán 1 phần',
    deliveryStatus: 'Đang giao hàng',
    printStatus: 'Đã in',
    stockOutStatus: 'Xuất kho toàn bộ',
    returnStatus: 'Chưa trả hàng',
    deliveryMethod: 'Dịch vụ giao hàng',
    
    approvedDate: '2025-11-03 15:00',
    dispatchedDate: '2025-11-04 09:00',
    dispatchedByEmployeeName: 'Nguyễn Thị E',
    
    codAmount: 5000000,
    
    products: [
      {
        productId: 'SP000003',
        productName: 'Điện thoại iPhone 15 Pro',
        quantity: 1,
        price: 28000000,
        total: 28000000
      },
      {
        productId: 'SP000004',
        productName: 'Ốp lưng iPhone 15 Pro',
        quantity: 2,
        price: 300000,
        total: 600000
      }
    ],
    
    subtotal: 28600000,
    shippingFee: 30000,
    tax: 0,
    grandTotal: 28630000,
    paidAmount: 23630000,
    
    payments: [],
    
    packagingStatus: 'Đóng gói toàn bộ',
    
    notes: 'Gọi trước khi giao 30 phút',
    tags: ['COD']
  },
  
  {
    id: 'DH000003',
    customerName: 'Anh Trần Minh Hoàng',
    customerSystemId: 'CUST000003',
    branchName: 'Chi nhánh Trung tâm',
    salesperson: 'Trần Thị B',
    salespersonSystemId: 'EMP000002',
    orderDate: '2025-11-05 10:15',
    expectedDeliveryDate: '2025-11-06',
    expectedPaymentMethod: 'Tiền mặt',
    
    shippingAddress: '789 Đường MNO, Phường 10, Quận 5, TP.HCM',
    
    status: 'Đang giao dịch',
    paymentStatus: 'Chưa thanh toán',
    deliveryStatus: 'Đã đóng gói',
    printStatus: 'Đã in',
    stockOutStatus: 'Chưa xuất kho',
    returnStatus: 'Chưa trả hàng',
    deliveryMethod: 'Nhận tại cửa hàng',
    
    approvedDate: '2025-11-05 10:30',
    
    codAmount: 0,
    
    products: [
      {
        productId: 'SP000005',
        productName: 'Máy tính bảng iPad Air',
        quantity: 1,
        price: 18000000,
        total: 18000000
      }
    ],
    
    subtotal: 18000000,
    shippingFee: 0,
    tax: 0,
    voucherCode: 'GIAM10',
    voucherAmount: 1800000,
    grandTotal: 16200000,
    paidAmount: 0,
    
    payments: [],
    
    packagingStatus: 'Đóng gói toàn bộ',
    
    notes: 'Khách đến lấy trong ngày'
  },
  
  {
    id: 'DH000004',
    customerName: 'Shop thời trang GenZ Style',
    customerSystemId: 'CUST000004',
    branchName: 'Chi nhánh Quận 7',
    salesperson: 'Võ Thị F',
    salespersonSystemId: 'EMP000004',
    orderDate: '2025-11-07 16:45',
    expectedDeliveryDate: '2025-11-12',
    expectedPaymentMethod: 'Chuyển khoản',
    
    shippingAddress: '321 Đường PQR, Phường Tân Phú, Quận 7, TP.HCM',
    billingAddress: '321 Đường PQR, Phường Tân Phú, Quận 7, TP.HCM',
    
    status: 'Đang giao dịch',
    paymentStatus: 'Thanh toán toàn bộ',
    deliveryStatus: 'Chờ đóng gói',
    printStatus: 'Chưa in',
    stockOutStatus: 'Chưa xuất kho',
    returnStatus: 'Chưa trả hàng',
    deliveryMethod: 'Dịch vụ giao hàng',
    
    approvedDate: '2025-11-07 17:00',
    
    codAmount: 0,
    
    products: [
      {
        productId: 'SP000006',
        productName: 'Đồng hồ Apple Watch Series 9',
        quantity: 1,
        price: 12000000,
        total: 12000000
      },
      {
        productId: 'SP000007',
        productName: 'Tai nghe AirPods Pro',
        quantity: 1,
        price: 6000000,
        total: 6000000
      }
    ],
    
    subtotal: 18000000,
    shippingFee: 40000,
    tax: 0,
    orderDiscount: 1000000,
    orderDiscountType: 'fixed',
    orderDiscountReason: 'Khuyến mãi 11/11',
    grandTotal: 17040000,
    paidAmount: 17040000,
    
    payments: [],
    
    packagingStatus: 'Chờ xác nhận đóng gói',
    
    notes: 'Đóng gói cẩn thận, hàng dễ vỡ',
    tags: ['Đã thanh toán']
  },
  
  {
    id: 'DH000005',
    customerName: 'Công ty Cổ phần Bất động sản Hưng Thịnh',
    customerSystemId: 'CUST000001',
    branchName: 'Chi nhánh Quận 3',
    salesperson: 'Phạm Văn D',
    salespersonSystemId: 'EMP000003',
    orderDate: '2025-11-08 11:00',
    expectedPaymentMethod: 'Tiền mặt',
    
    referenceUrl: 'https://shopee.vn/order/123456789',
    externalReference: 'SHOPEE-123456789',
    
    status: 'Đặt hàng',
    paymentStatus: 'Chưa thanh toán',
    deliveryStatus: 'Chờ đóng gói',
    printStatus: 'Chưa in',
    stockOutStatus: 'Chưa xuất kho',
    returnStatus: 'Chưa trả hàng',
    deliveryMethod: 'Dịch vụ giao hàng',
    
    codAmount: 0,
    
    products: [
      {
        productId: 'SP000008',
        productName: 'Bàn phím cơ Keychron K2',
        quantity: 1,
        price: 2500000,
        total: 2500000
      },
      {
        productId: 'SP000009',
        productName: 'Keycap custom',
        quantity: 1,
        price: 800000,
        total: 800000
      },
      {
        productId: 'SP000010',
        productName: 'Switch Gateron Yellow',
        quantity: 90,
        price: 5000,
        total: 450000
      }
    ],
    
    subtotal: 3750000,
    shippingFee: 25000,
    tax: 0,
    grandTotal: 3775000,
    paidAmount: 0,
    
    payments: [],
    
    notes: 'Đơn từ Shopee - Kiểm tra kỹ trước khi giao',
    tags: ['Shopee', 'Mới']
  }
];

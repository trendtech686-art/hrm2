import type { ShippingPartner } from './types';
import { asSystemId, asBusinessId } from '@/lib/id-types';
import { buildSeedAuditFields } from '@/lib/seed-audit';

export const data: ShippingPartner[] = [
  {
    systemId: asSystemId('DVVC00000001'),
    id: asBusinessId('GHN'),
    name: 'Giao Hàng Nhanh',
    logoUrl: 'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Slogan-En-Orange.png',
    description: 'Kết nối giao hàng, thu hộ chuyên nghiệp trải dài mọi miền đất nước.',
    phone: '1900 636677',
    address: '405/15 Xô Viết Nghệ Tĩnh, P. 24, Q. Bình Thạnh, TP.HCM',
    contactPerson: 'Trần Văn An',
    status: 'Đang hợp tác',
    services: [
        { id: asBusinessId('53320'), name: 'Hàng nhẹ' },
        { id: asBusinessId('53321'), name: 'Chuẩn' },
    ],
    isConnected: true,
    config: {
        credentialFields: [
            { id: asBusinessId('account_name'), label: 'Tên tài khoản', placeholder: 'Tài khoản 1', required: true },
            { id: asBusinessId('token'), label: 'Mã Token tài khoản Giao Hàng Nhanh', placeholder: 'Sao chép và dán Token vào đây', required: true },
        ],
        payerOptions: ['customer', 'shop'],
        additionalServices: [
            { id: asBusinessId('pickup_type'), label: 'Hình thức lấy hàng', type: 'radio', options: ['Tại bưu cục', 'Tại kho hàng'] },
            { id: asBusinessId('insurance'), label: 'Bảo hiểm hàng hóa', type: 'checkbox'},
            { id: asBusinessId('partial_delivery'), label: 'Giao hàng 1 phần', type: 'checkbox' },
            { id: asBusinessId('merge_delivery'), label: 'Gộp kiện', type: 'checkbox', tooltip: 'Dịch vụ gộp nhiều kiện hàng thành một gói vận chuyển duy nhất.' },
            { id: asBusinessId('cod_failed_collect'), label: 'Giao thất bại - thu tiền', type: 'checkbox' },
        ]
    },
    credentials: { token: 'mock-ghn-token-from-user-settings', account_name: 'Tài khoản 1' },
    configuration: { payer: 'shop', pickup_type: 'Tại kho hàng' },
        ...buildSeedAuditFields({ createdAt: '2024-02-10T08:00:00Z' }),
  },
  {
    systemId: asSystemId('DVVC00000002'),
    id: asBusinessId('VTP'),
    name: 'Viettel Post',
    logoUrl: 'https://viettelpost.com.vn/wp-content/uploads/2021/01/logo-viettel-post.png',
    description: 'Dịch vụ nhận gửi, vận chuyển và phát nhanh bằng đường bộ.',
    phone: '1900 8095',
    address: 'Số 1 Giang Văn Minh, P. Kim Mã, Q. Ba Đình, Hà Nội',
    contactPerson: 'Lê Thị Bình',
    status: 'Đang hợp tác',
    services: [
        { id: asBusinessId('VCN'), name: 'Giao hàng nhanh' },
        { id: asBusinessId('VCP'), name: 'TMĐT Tiết Kiệm thỏa thuận' }
    ],
    isConnected: true,
     config: {
        credentialFields: [
            { id: asBusinessId('account_name'), label: 'Tên tài khoản', placeholder: 'Tài khoản 1', required: true },
            { id: asBusinessId('email'), label: 'Email tài khoản', placeholder: 'nhlpkgx@gmail.com', required: true, type: 'email' },
            { id: asBusinessId('phone'), label: 'Số điện thoại', placeholder: '0981239686', required: true },
        ],
        payerOptions: ['shop', 'customer'],
        additionalServices: [
            { id: asBusinessId('report'), label: 'Báo phát', type: 'checkbox'},
            { id: asBusinessId('cod_check'), label: 'Đồng kiểm', type: 'checkbox'},
            { id: asBusinessId('at_point'), label: 'Giao bưu phẩm tại điểm giao dịch', type: 'checkbox'},
            { id: asBusinessId('high_value'), label: 'Hàng giá trị cao', type: 'checkbox'},
            { id: asBusinessId('fragile'), label: 'Hàng lạnh', type: 'checkbox'},
            { id: asBusinessId('return_doc'), label: 'Hoàn chứng từ', type: 'checkbox'},
            { id: asBusinessId('return_bill'), label: 'Hoàn cước chiều đi', type: 'checkbox'},
            { id: asBusinessId('cod_collect_fee'), label: 'Thu tiền xem hàng', type: 'checkbox'},
            { id: asBusinessId('return_doc_bidirectional'), label: 'Hoàn cước hai chiều', type: 'checkbox'},
        ]
    },
    credentials: { account_name: 'Tài khoản 1', email: 'nhlpkgx@gmail.com', phone: '0981239686' },
    configuration: { payer: 'customer' },
        ...buildSeedAuditFields({ createdAt: '2024-02-11T08:00:00Z' }),
  },
  {
    systemId: asSystemId('DVVC00000003'),
    id: asBusinessId('GHTK'),
    name: 'Giao Hàng Tiết Kiệm',
    logoUrl: 'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHTK-Green-Slogan-Eng.png',
    description: 'Dịch vụ giao hàng thu tiền hộ; tốc độ nhanh, phủ sóng toàn quốc.',
    phone: '1900 6092',
    address: 'Tòa nhà VTV, Số 8 Phạm Hùng, P. Mễ Trì, Q. Nam Từ Liêm, Hà Nội',
    contactPerson: 'Nguyễn Hùng Cường',
    status: 'Đang hợp tác',
    services: [
        { id: asBusinessId('road'), name: 'Gói tiết kiệm' },
        { id: asBusinessId('fly'), name: 'Đường bay' }
    ],
    isConnected: true,
    config: {
        credentialFields: [
            { id: asBusinessId('email'), label: 'Email đăng nhập', placeholder: 'trendtech686@gmail.com', required: true, type: 'email' },
        ],
        payerOptions: ['shop', 'customer'],
        additionalServices: [
            { id: asBusinessId('deliver_option'), label: 'Dự kiến giao hàng', type: 'select', options: ['Sáng (9:00-12:00)', 'Chiều (14:00-18:00)'], placeholder: 'Chọn ca giao hàng'},
            { id: asBusinessId('pick_option'), label: 'Hẹn ca lấy giao hàng', type: 'select', options: ['Sáng (9:00-12:00)', 'Chiều (14:00-18:00)'], placeholder: 'Chọn ca giao hàng'},
            { id: asBusinessId('transport'), label: 'Vận chuyển bằng', type: 'radio', options: ['Đường bộ', 'Đường bay']},
            { id: asBusinessId('is_postoffice'), label: 'Gửi hàng tại bưu cục', type: 'checkbox'},
            { id: asBusinessId('is_fragile'), label: 'Hàng dễ vỡ', type: 'checkbox'},
            { id: asBusinessId('is_check'), label: 'Đồng kiểm', type: 'checkbox' },
            { id: asBusinessId('is_shop_call'), label: 'Goi shop khi gặp vấn đề', type: 'checkbox' },
            { id: asBusinessId('is_fullbox'), label: 'Hàng nguyên hộp', type: 'checkbox' },
            { id: asBusinessId('is_part_deliver'), label: 'Giao hàng 1 phần chọn sản phẩm', type: 'checkbox' },
            { id: asBusinessId('is_part_return'), label: 'Giao hàng 1 phần đổi trả hàng', type: 'checkbox' },
            { id: asBusinessId('is_document'), label: 'Thư, tài liệu', type: 'checkbox' },
            { id: asBusinessId('is_cod_fail_charge'), label: 'Thu tiền hủy hàng', type: 'checkbox' },
            { id: asBusinessId('is_food_agri'), label: 'Nông sản/thực phẩm khô', type: 'checkbox' },
            { id: asBusinessId('is_fresh_food'), label: 'Thực phẩm tươi', type: 'checkbox' },
            { id: asBusinessId('is_not_stackable'), label: 'Hàng không xếp chồng', type: 'checkbox' },
            { id: asBusinessId('is_plant'), label: 'Hàng cây cối', type: 'checkbox' },
            { id: asBusinessId('referral_email'), label: 'Email nhân viên giới thiệu', type: 'text', gridSpan: 2 },
        ]
    },
    credentials: { email: 'trendtech686@gmail.com' },
    configuration: { payer: 'customer', transport: 'Đường bộ' },
        ...buildSeedAuditFields({ createdAt: '2024-02-12T08:00:00Z' }),
  },
  {
    systemId: asSystemId('DVVC00000004'),
    id: asBusinessId('SPX'),
    name: 'SPX Express',
    logoUrl: 'https://logowik.com/content/uploads/images/spx-express8724.logowik.com.webp',
    description: 'Giải pháp vận chuyển thông minh, nhanh chóng, an toàn, tiết kiệm.',
    phone: '1900 1221',
    address: 'Tầng 17, Tòa nhà Sonatus, 15 Lê Thánh Tôn, P. Bến Nghé, Q.1, TP.HCM',
    status: 'Đang hợp tác',
    services: [{ id: asBusinessId('standard'), name: 'Gói chuẩn' }],
    isConnected: true,
    config: {
        credentialFields: [
            { id: asBusinessId('userId'), label: 'Mã khách hàng (User ID)', placeholder: '36701998557837', required: true },
            { id: asBusinessId('secretKey'), label: 'Mã khóa (Secret Key)', placeholder: 'e23507d5-21e2-4f88-a46e-b3a9bfb48bf7', required: true, type: 'password' },
        ],
        payerOptions: ['shop', 'customer'],
        additionalServices: [
            { id: asBusinessId('return_fee'), label: 'Thu phí từ chối nhận đơn', type: 'checkbox' },
            { id: asBusinessId('send_at_post'), label: 'Gửi hàng tại bưu cục', type: 'checkbox' },
            { id: asBusinessId('referral_email'), label: 'Email nhân viên giới thiệu', type: 'text', gridSpan: 2 },
        ]
    },
    credentials: { userId: '36701998557837', secretKey: 'e23507d5-21e2-4f88-a46e-b3a9bfb48bf7' },
    configuration: { payer: 'customer' },
        ...buildSeedAuditFields({ createdAt: '2024-02-13T08:00:00Z' }),
  },
  {
    systemId: asSystemId('DVVC00000005'),
    id: asBusinessId('JT'),
    name: 'J&T Express',
    logoUrl: 'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-JT-Express-V-Red.png',
    description: 'Hỗ trợ các hoạt động giao nhận hàng hóa nhanh chóng.',
    phone: '1900 1088',
    address: 'Tòa nhà Pico Plaza, 20 Cộng Hòa, P. 12, Q. Tân Bình, TP.HCM',
    status: 'Đang hợp tác',
    services: [
        { id: asBusinessId('EZ'), name: 'Gói chuẩn' },
        { id: asBusinessId('J&T Super'), name: 'Dịch vụ siêu giao hàng' }
    ],
    isConnected: true,
    config: {
        credentialFields: [
            { id: asBusinessId('customer_id'), label: 'Mã khách hàng', placeholder: '024LC15753', required: true },
        ],
        payerOptions: [], // Payer is a select in this case
        additionalServices: [
            { id: asBusinessId('payer'), label: 'Người trả phí', type: 'select', options: ['Người gửi thanh toán cuối tháng'] },
            { id: asBusinessId('insurance'), label: 'Bảo hiểm hàng hoá', type: 'checkbox' },
            { id: asBusinessId('partial_delivery'), label: 'Giao hàng 1 phần', type: 'checkbox' },
            { id: asBusinessId('send_at_post'), label: 'Gửi hàng tại bưu cục', type: 'checkbox' },
            { id: asBusinessId('referral_email'), label: 'Email nhân viên giới thiệu', type: 'text', gridSpan: 2 },
        ]
    },
    credentials: { customer_id: '024LC15753' },
    configuration: { partial_delivery: true },
        ...buildSeedAuditFields({ createdAt: '2024-02-14T08:00:00Z' }),
  },
    {
     systemId: asSystemId('DVVC00000006'),
     id: asBusinessId('NINJAVAN'),
    name: 'Ninja Van',
    logoUrl: 'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-Ninja-Van.png',
    description: 'Cung cấp dịch vụ giao hàng vượt trội dành cho các doanh nghiệp.',
    phone: '1900 886 877',
    address: '117/2D1 Hồ Văn Long, P. Tân Tạo, Q. Bình Tân, TP.HCM',
    status: 'Ngừng hợp tác',
    services: [],
    isConnected: false,
    config: {
        credentialFields: [
            { id: asBusinessId('client_id'), label: 'Client ID', placeholder: '', required: true },
            { id: asBusinessId('client_key'), label: 'Client Key', placeholder: '', required: true, type: 'password' },
        ],
        payerOptions: [],
        additionalServices: []
    },
    credentials: {},
    configuration: {},
        ...buildSeedAuditFields({ createdAt: '2024-02-15T08:00:00Z' }),
  },
    {
     systemId: asSystemId('DVVC00000007'),
     id: asBusinessId('VNPOST'),
    name: 'Vietnam Post',
    logoUrl: 'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-VNPost.png',
    description: 'Cung cấp dịch vụ chuyển phát nhanh EMS và chuyển phát bưu kiện.',
    phone: '1900 54 54 81',
    address: 'Số 05 Phạm Hùng, P. Mỹ Đình, Q. Nam Từ Liêm, Hà Nội',
    status: 'Ngừng hợp tác',
    services: [],
    isConnected: false,
    config: {
        credentialFields: [
            { id: asBusinessId('username'), label: 'Username', placeholder: '', required: true },
            { id: asBusinessId('password'), label: 'Password', placeholder: '', required: true, type: 'password' },
        ],
        payerOptions: [],
        additionalServices: []
    },
    credentials: {},
    configuration: {},
        ...buildSeedAuditFields({ createdAt: '2024-02-16T08:00:00Z' }),
  },
    {
        systemId: asSystemId('DVVC00000008'),
        id: asBusinessId('AHAMOVE'),
    name: 'Ahamove',
    logoUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/91/b6/23/91b6238b-6f81-817a-5192-3c5825788899/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg',
    description: 'Dịch vụ giao hàng nội thành siêu tốc.',
    phone: '1900 545411',
    address: 'Tầng 1, Tòa nhà Rivera Park, 7/28 Thành Thái, P. 14, Q. 10, TP.HCM',
    status: 'Ngừng hợp tác',
    services: [],
    isConnected: false,
    config: {
        credentialFields: [
            { id: asBusinessId('mobile'), label: 'Số điện thoại', placeholder: '', required: true },
            { id: asBusinessId('api_key'), label: 'API Key', placeholder: '', required: true, type: 'password' },
        ],
        payerOptions: [],
        additionalServices: []
    },
    credentials: {},
    configuration: {},
        ...buildSeedAuditFields({ createdAt: '2024-02-17T08:00:00Z' }),
  },
];

import type { Supplier } from './types.ts';

// Helper function to generate sample suppliers
const generateSampleSuppliers = (): Supplier[] => {
  const suppliers: Supplier[] = [];
  const statuses: Array<"Đang Giao Dịch" | "Ngừng Giao Dịch"> = ["Đang Giao Dịch", "Ngừng Giao Dịch"];
  const companies = [
    "Công ty TNHH", "Công ty CP", "Xí nghiệp", "Nhà phân phối", "Tập đoàn",
    "Cửa hàng", "Xưởng", "Nhà máy", "Chi nhánh", "Trung tâm"
  ];
  const industries = [
    "Công nghệ thông tin", "Phần mềm", "Phần cứng máy tính", "Văn phòng phẩm",
    "Thiết bị điện tử", "Marketing", "In ấn", "Thiết kế", "Tư vấn", "Logistics",
    "Vận tải", "Bảo hiểm", "Tài chính", "Y tế", "Giáo dục", "Xây dựng",
    "Nội thất", "Thực phẩm", "Đồ uống", "Thời trang"
  ];
  const banks = [
    "Vietcombank", "BIDV", "VietinBank", "Agribank", "Techcombank",
    "MB Bank", "ACB", "VPBank", "Sacombank", "HDBank"
  ];
  const cities = [
    { name: "TP.HCM", prefix: "028" },
    { name: "Hà Nội", prefix: "024" },
    { name: "Đà Nẵng", prefix: "023" },
    { name: "Cần Thơ", prefix: "0292" },
    { name: "Hải Phòng", prefix: "0225" }
  ];
  const managers = [
    "Nguyễn Văn An", "Trần Thị Bình", "Lê Văn Cường", "Phạm Thị Dung",
    "Hoàng Văn Em", "Vũ Thị Giang", "Đỗ Văn Hùng", "Bùi Thị Lan",
    "Trịnh Văn Khoa", "Phan Thị Mai"
  ];
  const contactNames = [
    "Nguyễn Minh", "Trần Hòa", "Lê Phương", "Phạm Tuấn", "Hoàng Linh",
    "Vũ Hải", "Đỗ Khánh", "Bùi Trang", "Trịnh Nam", "Phan Oanh"
  ];

  for (let i = 1; i <= 96; i++) {
    const num = i + 4; // Start from 5
    const systemId = `SUPP${String(num).padStart(6, '0')}`;
    const id = `NCC${String(num).padStart(6, '0')}`;
    const city = cities[i % cities.length];
    const company = companies[i % companies.length];
    const industry = industries[i % industries.length];
    const bank = banks[i % banks.length];
    const manager = managers[i % managers.length];
    const contact = contactNames[i % contactNames.length];
    const status = i % 5 === 0 ? "Ngừng Giao Dịch" : "Đang Giao Dịch";
    
    // Generate dates
    const createdDate = new Date(2024, Math.floor(i / 12), (i % 28) + 1);
    const updatedDate = new Date(createdDate.getTime() + (i * 24 * 60 * 60 * 1000));
    
    suppliers.push({
      systemId,
      id,
      name: `${company} ${industry} ${i % 10 === 0 ? 'Việt Nam' : city.name}`,
      taxCode: `0${300000000 + i * 111111}`.slice(0, 10),
      phone: `${city.prefix}${38000000 + i * 100000}`.slice(0, 11),
      email: `contact${num}@supplier${num}.vn`,
      address: `${100 + i} Đường ${i % 2 === 0 ? 'Nguyễn Huệ' : 'Lê Lợi'}, ${city.name}`,
      website: i % 3 === 0 ? `https://supplier${num}.vn` : undefined,
      accountManager: manager,
      status,
      currentDebt: status === "Đang Giao Dịch" ? (i * 1000000) % 200000000 : 0,
      bankAccount: `${1000000000 + i * 123456789}`.slice(0, 14),
      bankName: bank,
      contactPerson: `${contact} (${i % 2 === 0 ? 'Giám đốc' : 'Trưởng phòng'})`,
      notes: i % 4 === 0 ? `NCC uy tín, hợp tác lâu dài từ ${2020 + (i % 5)} năm` : undefined,
      createdAt: createdDate.toISOString(),
      updatedAt: updatedDate.toISOString(),
      createdBy: `EMP${String((i % 10) + 1).padStart(6, '0')}`,
    });
  }

  return suppliers;
};

export const data: Supplier[] = [
  {
    systemId: "SUPP000001",
    id: "NCC000001",
    name: "Công ty TNHH Công nghệ Viễn Thông AZ",
    taxCode: "0312998877",
    phone: "02839123456",
    email: "info@aztelecom.vn",
    address: "123 Võ Văn Tần, P. 6, Q. 3, TP.HCM",
    website: "https://aztelecom.vn",
    accountManager: "Vũ Thị Giang",
    status: "Đang Giao Dịch",
    currentDebt: 25000000,
    bankAccount: "1234567890123",
    bankName: "Vietcombank",
    contactPerson: "Nguyễn Văn Minh (Giám đốc)",
    notes: "NCC uy tín, hợp tác từ 2020",
    createdAt: "2024-01-15T08:00:00.000Z",
    updatedAt: "2024-10-20T14:30:00.000Z",
    createdBy: "EMP000001",
  },
  {
    systemId: "SUPP000002",
    id: "NCC000002",
    name: "Nhà phân phối Phần mềm Toàn Thắng",
    taxCode: "0108776655",
    phone: "02438765432",
    email: "sales@toanthangsoftware.com",
    address: "Tòa nhà Keangnam, Mễ Trì, Nam Từ Liêm, Hà Nội",
    website: "https://toanthangsoftware.com",
    accountManager: "Trần Thị Bình",
    status: "Đang Giao Dịch",
    currentDebt: 150000000,
    bankAccount: "9876543210987",
    bankName: "Techcombank",
    contactPerson: "Trần Hòa (Trưởng phòng kinh doanh)",
    notes: "Đối tác chiến lược, ưu tiên thanh toán 60 ngày",
    createdAt: "2023-03-20T09:00:00.000Z",
    updatedAt: "2024-10-15T16:45:00.000Z",
    createdBy: "EMP000002",
  },
  {
    systemId: "SUPP000003",
    id: "NCC000003",
    name: "Công ty TNHH Giải pháp Marketing A1",
    taxCode: "0311445566",
    phone: "0909111222",
    email: "contact@a1marketing.vn",
    address: "45 Nguyễn Thị Minh Khai, P. Bến Nghé, Q. 1, TP.HCM",
    accountManager: "Đỗ Hùng",
    status: "Đang Giao Dịch",
    currentDebt: 0,
    bankAccount: "5554443332221",
    bankName: "BIDV",
    contactPerson: "Lê Phương (Giám đốc)",
    createdAt: "2024-05-10T10:30:00.000Z",
    updatedAt: "2024-10-18T11:20:00.000Z",
    createdBy: "EMP000003",
  },
  {
    systemId: "SUPP000004",
    id: "NCC000004",
    name: "Xưởng In ấn và Thiết kế Sáng Tạo",
    taxCode: "0399887766",
    phone: "02838444555",
    email: "support@sangtaoprint.com",
    address: "789 Cách Mạng Tháng 8, P. 15, Q. 10, TP.HCM",
    website: "https://sangtaoprint.com",
    accountManager: "Trịnh Văn Khoa",
    status: "Ngừng Giao Dịch",
    currentDebt: 2500000,
    bankAccount: "1112223334445",
    bankName: "ACB",
    contactPerson: "Phạm Tuấn (Trưởng phòng)",
    notes: "Tạm ngưng hợp tác do chất lượng không ổn định",
    createdAt: "2023-08-05T07:15:00.000Z",
    updatedAt: "2024-09-30T13:00:00.000Z",
    createdBy: "EMP000004",
  },
  ...generateSampleSuppliers(),
];

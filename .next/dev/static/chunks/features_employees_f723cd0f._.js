(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/features/employees/data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
;
/**
 * Helper functions to create EmployeeAddress
 * - 2-cấp: Tỉnh/TP → Phường/Xã (bỏ Quận/Huyện)
 * - 3-cấp: Tỉnh/TP → Quận/Huyện → Phường/Xã (đầy đủ)
 */ const createAddress2Level = (street, ward, province, provinceId = '79', wardId = '')=>({
        street,
        province,
        provinceId,
        district: '',
        districtId: 0,
        ward,
        wardId,
        inputLevel: '2-level'
    });
const createAddress3Level = (street, district, ward, province, provinceId = '79', districtId = 0, wardId = '')=>({
        street,
        province,
        provinceId,
        district,
        districtId,
        ward,
        wardId,
        inputLevel: '3-level'
    });
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildAuditFields = (createdAt, createdBy = SEED_AUTHOR)=>({
        createdAt,
        updatedAt: createdAt,
        createdBy,
        updatedBy: createdBy
    });
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('1'),
        fullName: 'Nguyễn Văn A',
        workEmail: 'nva@example.com',
        personalEmail: 'nva.personal@gmail.com',
        phone: '0901234567',
        gender: 'Nam',
        dob: '1990-01-01',
        permanentAddress: createAddress2Level('123 ABC', 'Phường Bến Nghé', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Giám đốc',
        department: 'Kinh doanh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2020-01-01',
        baseSalary: 35000000,
        numberOfDependents: 2,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 0,
        paidLeaveTaken: 0,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 0,
        annualLeaveBalance: 12,
        role: 'Admin',
        password: 'admin123',
        ...buildAuditFields('2024-01-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('2'),
        fullName: 'Trần Thị B',
        workEmail: 'ttb@example.com',
        personalEmail: 'ttb.personal@gmail.com',
        phone: '0912345678',
        gender: 'Nữ',
        dob: '1992-02-02',
        permanentAddress: createAddress2Level('456 XYZ', 'Phường Thảo Điền', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Trưởng phòng',
        department: 'Kinh doanh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2019-01-01',
        baseSalary: 25000000,
        numberOfDependents: 1,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 5,
        paidLeaveTaken: 4,
        unpaidLeaveTaken: 1,
        annualLeaveTaken: 4,
        annualLeaveBalance: 8,
        role: 'Manager',
        password: 'manager123',
        ...buildAuditFields('2024-02-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000003')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('3'),
        fullName: 'Lê Văn C',
        workEmail: 'lvc@example.com',
        personalEmail: 'lvc.personal@gmail.com',
        phone: '0923456789',
        gender: 'Nam',
        dob: '1995-03-03',
        permanentAddress: createAddress3Level('789 DEF', 'Quận 3', 'Phường 9', 'TP.HCM', '79', 762),
        temporaryAddress: null,
        jobTitle: 'Kỹ sư',
        department: 'Kỹ thuật',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        hireDate: '2021-01-01',
        baseSalary: 18000000,
        numberOfDependents: 0,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 2,
        paidLeaveTaken: 2,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 2,
        annualLeaveBalance: 10,
        role: 'Warehouse',
        password: 'warehouse123',
        ...buildAuditFields('2024-03-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000004')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('4'),
        fullName: 'Võ Thị F',
        workEmail: 'vtf@example.com',
        personalEmail: 'vtf.personal@gmail.com',
        phone: '0934567890',
        gender: 'Nữ',
        dob: '1993-04-04',
        permanentAddress: createAddress2Level('321 GHI', 'Phường Tân Phú', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Trưởng nhóm',
        department: 'Kinh doanh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2020-06-01',
        baseSalary: 20000000,
        numberOfDependents: 1,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 3,
        paidLeaveTaken: 2,
        unpaidLeaveTaken: 1,
        annualLeaveTaken: 2,
        annualLeaveBalance: 9,
        role: 'Sales',
        password: 'sales123',
        ...buildAuditFields('2024-04-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('5'),
        fullName: 'Lê Văn Kho',
        workEmail: 'lvk@example.com',
        personalEmail: 'lvk.personal@gmail.com',
        phone: '0945678901',
        gender: 'Nam',
        dob: '1991-05-15',
        permanentAddress: createAddress3Level('45 Nguyễn Trãi', 'Quận 5', 'Phường 3', 'TP.HCM', '79', 763),
        temporaryAddress: null,
        jobTitle: 'Nhân viên kho',
        department: 'Kỹ thuật',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2021-03-01',
        baseSalary: 12000000,
        numberOfDependents: 0,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 1,
        paidLeaveTaken: 1,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 1,
        annualLeaveBalance: 11,
        role: 'Warehouse',
        password: 'warehouse123',
        ...buildAuditFields('2024-05-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('6'),
        fullName: 'Phạm Văn D',
        workEmail: 'pvd@example.com',
        personalEmail: 'pvd.personal@gmail.com',
        phone: '0956789012',
        gender: 'Nam',
        dob: '1988-06-20',
        permanentAddress: createAddress2Level('78 Lê Lợi', 'Phường Bến Thành', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Nhân viên bán hàng',
        department: 'Kinh doanh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        hireDate: '2019-08-15',
        baseSalary: 15000000,
        numberOfDependents: 2,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 4,
        paidLeaveTaken: 3,
        unpaidLeaveTaken: 1,
        annualLeaveTaken: 3,
        annualLeaveBalance: 9,
        role: 'Sales',
        password: 'sales123',
        ...buildAuditFields('2024-06-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('7'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('NV000007'),
        fullName: 'Hoàng Thị E',
        workEmail: 'hte@example.com',
        personalEmail: 'hte.personal@gmail.com',
        phone: '0967890123',
        gender: 'Nữ',
        dob: '1994-07-10',
        permanentAddress: createAddress3Level('112 Hai Bà Trưng', 'Quận 1', 'Phường Đa Kao', 'TP.HCM', '79', 760),
        temporaryAddress: null,
        jobTitle: 'Kế toán',
        department: 'Nhân sự',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2020-02-01',
        baseSalary: 16000000,
        numberOfDependents: 0,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 2,
        paidLeaveTaken: 2,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 2,
        annualLeaveBalance: 10,
        role: 'Admin',
        password: 'accountant123',
        ...buildAuditFields('2024-07-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('8'),
        fullName: 'Nguyễn Văn G',
        workEmail: 'nvg@example.com',
        personalEmail: 'nvg.personal@gmail.com',
        phone: '0978901234',
        gender: 'Nam',
        dob: '1996-08-25',
        permanentAddress: createAddress2Level('234 Võ Văn Tần', 'Phường 5', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Nhân viên IT',
        department: 'Kỹ thuật',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2022-01-10',
        baseSalary: 18000000,
        numberOfDependents: 0,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 0,
        paidLeaveTaken: 0,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 0,
        annualLeaveBalance: 12,
        role: 'Admin',
        password: 'staff123',
        ...buildAuditFields('2024-08-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000009'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('9'),
        fullName: 'Trần Thị H',
        workEmail: 'tth@example.com',
        personalEmail: 'tth.personal@gmail.com',
        phone: '0989012345',
        gender: 'Nữ',
        dob: '1997-09-05',
        permanentAddress: createAddress3Level('567 Nguyễn Đình Chiểu', 'Quận 3', 'Phường 5', 'TP.HCM', '79', 762),
        temporaryAddress: null,
        jobTitle: 'Nhân viên CSKH',
        department: 'Kinh doanh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        hireDate: '2021-06-01',
        baseSalary: 13000000,
        numberOfDependents: 0,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 3,
        paidLeaveTaken: 2,
        unpaidLeaveTaken: 1,
        annualLeaveTaken: 2,
        annualLeaveBalance: 10,
        role: 'Sales',
        password: 'staff123',
        ...buildAuditFields('2024-09-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000010'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('10'),
        fullName: 'Đỗ Văn I',
        workEmail: 'dvi@example.com',
        personalEmail: 'dvi.personal@gmail.com',
        phone: '0990123456',
        gender: 'Nam',
        dob: '1989-10-12',
        permanentAddress: createAddress2Level('890 Cách Mạng Tháng 8', 'Phường 12', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Trưởng kho',
        department: 'Kỹ thuật',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2018-04-01',
        baseSalary: 22000000,
        numberOfDependents: 3,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 6,
        paidLeaveTaken: 5,
        unpaidLeaveTaken: 1,
        annualLeaveTaken: 5,
        annualLeaveBalance: 7,
        role: 'Warehouse',
        password: 'warehouse123',
        ...buildAuditFields('2024-10-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000011'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('11'),
        fullName: 'Lý Thị K',
        workEmail: 'ltk@example.com',
        personalEmail: 'ltk.personal@gmail.com',
        phone: '0901234568',
        gender: 'Nữ',
        dob: '1995-11-18',
        permanentAddress: createAddress3Level('123 Trần Hưng Đạo', 'Quận 5', 'Phường 7', 'TP.HCM', '79', 763),
        temporaryAddress: null,
        jobTitle: 'Nhân viên Marketing',
        department: 'Marketing',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        hireDate: '2022-03-15',
        baseSalary: 14000000,
        numberOfDependents: 0,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 1,
        paidLeaveTaken: 1,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 1,
        annualLeaveBalance: 11,
        role: 'Sales',
        password: 'staff123',
        ...buildAuditFields('2024-11-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000012'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('12'),
        fullName: 'Bùi Văn L',
        workEmail: 'bvl@example.com',
        personalEmail: 'bvl.personal@gmail.com',
        phone: '0912345679',
        gender: 'Nam',
        dob: '1993-12-22',
        permanentAddress: createAddress2Level('456 Lý Thường Kiệt', 'Phường 14', 'TP.HCM', '79'),
        temporaryAddress: null,
        jobTitle: 'Nhân viên giao hàng',
        department: 'Kinh doanh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        hireDate: '2020-09-01',
        baseSalary: 11000000,
        numberOfDependents: 1,
        employmentStatus: 'Đang làm việc',
        employeeType: 'Chính thức',
        leaveTaken: 2,
        paidLeaveTaken: 2,
        unpaidLeaveTaken: 0,
        annualLeaveTaken: 2,
        annualLeaveBalance: 10,
        role: 'Warehouse',
        password: 'delivery123',
        ...buildAuditFields('2024-12-05T08:00:00Z')
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/employees/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "employeeRepository",
    ()=>employeeRepository,
    "useEmployeeStore",
    ()=>useEmployeeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$generator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/breadcrumb-generator.ts [app-client] (ecmascript)"); // ✅ NEW
var __TURBOPACK__imported__module__$5b$project$5d2f$repositories$2f$in$2d$memory$2d$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/repositories/in-memory-repository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/activity-history-helper.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["data"], 'employees', {
    businessIdField: 'id',
    persistKey: 'hrm-employees',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
// ✅ Wrap add method to include activity history
const originalAdd = baseStore.getState().add;
const wrappedAdd = (item)=>{
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    const historyEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHistoryEntry"])('created', `${userInfo.name} đã tạo hồ sơ nhân viên ${item.fullName} (${item.id})`, userInfo);
    const newEmployee = originalAdd({
        ...item,
        activityHistory: [
            historyEntry
        ]
    });
    return newEmployee;
};
// ✅ Wrap update method to include activity history
const originalUpdate = baseStore.getState().update;
const wrappedUpdate = (systemId, updates)=>{
    const currentEmployee = baseStore.getState().data.find((e)=>e.systemId === systemId);
    if (!currentEmployee) return;
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    const historyEntries = [];
    // Track important field changes
    const trackedFields = [
        {
            key: 'fullName',
            label: 'họ tên'
        },
        {
            key: 'jobTitle',
            label: 'chức danh'
        },
        {
            key: 'department',
            label: 'phòng ban'
        },
        {
            key: 'employmentStatus',
            label: 'trạng thái làm việc'
        },
        {
            key: 'employeeType',
            label: 'loại nhân viên'
        },
        {
            key: 'baseSalary',
            label: 'lương cơ bản'
        },
        {
            key: 'phone',
            label: 'số điện thoại'
        },
        {
            key: 'workEmail',
            label: 'email công việc'
        },
        {
            key: 'role',
            label: 'vai trò'
        }
    ];
    trackedFields.forEach(({ key, label })=>{
        if (updates[key] !== undefined && updates[key] !== currentEmployee[key]) {
            const oldValue = currentEmployee[key];
            const newValue = updates[key];
            // Format values for display
            let oldDisplay = oldValue;
            let newDisplay = newValue;
            if (key === 'baseSalary') {
                oldDisplay = new Intl.NumberFormat('vi-VN').format(oldValue) + 'đ';
                newDisplay = new Intl.NumberFormat('vi-VN').format(newValue) + 'đ';
            }
            historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHistoryEntry"])('updated', `${userInfo.name} đã cập nhật ${label}: "${oldDisplay || '(trống)'}" → "${newDisplay}"`, userInfo, {
                field: key,
                oldValue,
                newValue
            }));
        }
    });
    // If status changed specifically
    if (updates.employmentStatus && updates.employmentStatus !== currentEmployee.employmentStatus) {
        historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHistoryEntry"])('status_changed', `${userInfo.name} đã thay đổi trạng thái làm việc từ "${currentEmployee.employmentStatus}" thành "${updates.employmentStatus}"`, userInfo, {
            field: 'employmentStatus',
            oldValue: currentEmployee.employmentStatus,
            newValue: updates.employmentStatus
        }));
    }
    // If no specific changes tracked, add generic update entry
    if (historyEntries.length === 0) {
        historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createHistoryEntry"])('updated', `${userInfo.name} đã cập nhật thông tin nhân viên`, userInfo));
    }
    const updatedHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(currentEmployee.activityHistory, ...historyEntries);
    originalUpdate(systemId, {
        ...updates,
        activityHistory: updatedHistory
    });
};
// ✅ Override base store methods
baseStore.setState({
    add: wrappedAdd,
    update: wrappedUpdate
});
const employeeRepository = (0, __TURBOPACK__imported__module__$5b$project$5d2f$repositories$2f$in$2d$memory$2d$repository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createInMemoryRepository"])(()=>baseStore.getState());
const persistence = {
    create: (payload)=>employeeRepository.create(payload),
    update: (systemId, payload)=>employeeRepository.update(systemId, payload),
    softDelete: (systemId)=>employeeRepository.softDelete(systemId),
    restore: (systemId)=>employeeRepository.restore(systemId),
    hardDelete: (systemId)=>employeeRepository.hardDelete(systemId)
};
// ✅ Register for breadcrumb auto-generation
(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$generator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerBreadcrumbStore"])('employees', ()=>baseStore.getState());
// Augmented methods
const augmentedMethods = {
    // FIX: Changed `page: number = 1` to `page: number` to make it a required parameter, matching Combobox prop type.
    // ✅ CRITICAL FIX: Create fresh Fuse instance on each search to avoid stale data
    searchEmployees: async (query, page, limit = 20)=>{
        return new Promise((resolve)=>{
            setTimeout(()=>{
                const allEmployees = baseStore.getState().data;
                // ✅ Create fresh Fuse instance with current data
                const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](allEmployees, {
                    keys: [
                        'fullName',
                        'id',
                        'phone',
                        'personalEmail',
                        'workEmail'
                    ],
                    threshold: 0.3
                });
                const results = query ? fuse.search(query).map((r)=>r.item) : allEmployees;
                const start = (page - 1) * limit;
                const end = start + limit;
                const paginatedItems = results.slice(start, end);
                resolve({
                    items: paginatedItems.map((e)=>({
                            value: e.systemId,
                            label: e.fullName
                        })),
                    hasNextPage: end < results.length
                });
            }, 300);
        });
    },
    permanentDelete: async (systemId)=>{
        await persistence.hardDelete(systemId);
    }
};
const useEmployeeStoreHook = ()=>{
    const state = baseStore();
    return {
        ...state,
        ...augmentedMethods,
        persistence
    };
};
const useEmployeeStore = useEmployeeStoreHook;
// Export getState for non-hook usage
useEmployeeStore.getState = ()=>{
    const state = baseStore.getState();
    return {
        ...state,
        ...augmentedMethods,
        persistence
    };
};
useEmployeeStore.persistence = persistence;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/employees/employee-comp-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useEmployeeCompStore",
    ()=>useEmployeeCompStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$employees$2f$employee$2d$settings$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/employees/employee-settings-store.ts [app-client] (ecmascript)");
;
;
;
;
const getDefaultComponentIds = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$employees$2f$employee$2d$settings$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeSettingsStore"].getState().getSalaryComponents().map((component)=>component.systemId);
const getValidShiftId = (shiftId)=>{
    if (!shiftId) return undefined;
    const normalized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(shiftId);
    const shiftExists = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$employees$2f$employee$2d$settings$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeSettingsStore"].getState().settings.workShifts.some((shift)=>shift.systemId === normalized);
    return shiftExists ? normalized : undefined;
};
const sanitizeComponentIds = (componentIds)=>{
    const available = new Set(getDefaultComponentIds());
    if (!componentIds?.length) {
        return Array.from(available);
    }
    return componentIds.map((id)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(id)).filter((id)=>available.has(id));
};
const buildDefaultProfile = (employeeSystemId)=>({
        employeeSystemId,
        workShiftSystemId: undefined,
        salaryComponentSystemIds: getDefaultComponentIds(),
        payrollBankAccount: undefined,
        paymentMethod: 'bank_transfer',
        createdAt: '',
        updatedAt: '',
        usesDefaultComponents: true
    });
const useEmployeeCompStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        profiles: {},
        assignComponents: (employeeSystemId, payload)=>{
            const now = new Date().toISOString();
            const currentUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"])();
            const existing = get().profiles[employeeSystemId];
            const salaryComponentSystemIds = sanitizeComponentIds(payload.salaryComponentSystemIds ?? existing?.salaryComponentSystemIds);
            set(({ profiles })=>({
                    profiles: {
                        ...profiles,
                        [employeeSystemId]: {
                            employeeSystemId,
                            workShiftSystemId: getValidShiftId(payload.workShiftSystemId ?? existing?.workShiftSystemId),
                            salaryComponentSystemIds,
                            payrollBankAccount: payload.payrollBankAccount ?? existing?.payrollBankAccount,
                            paymentMethod: payload.paymentMethod ?? existing?.paymentMethod ?? 'bank_transfer',
                            createdAt: existing?.createdAt ?? now,
                            createdBy: existing?.createdBy ?? currentUser,
                            updatedAt: now,
                            updatedBy: currentUser
                        }
                    }
                }));
        },
        removeProfile: (employeeSystemId)=>{
            set(({ profiles })=>{
                const nextProfiles = {
                    ...profiles
                };
                delete nextProfiles[employeeSystemId];
                return {
                    profiles: nextProfiles
                };
            });
        },
        getPayrollProfile: (employeeSystemId)=>{
            const profile = get().profiles[employeeSystemId];
            if (!profile) {
                return buildDefaultProfile(employeeSystemId);
            }
            return {
                ...profile,
                usesDefaultComponents: false
            };
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/employees/document-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDocumentStore",
    ()=>useDocumentStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$upload$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/file-upload-api.ts [app-client] (ecmascript)");
;
;
const useDocumentStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        documents: [],
        stagingDocuments: {},
        loadedEmployees: new Set(),
        // Staging operations
        updateStagingDocument: (documentType, documentName, files, sessionId)=>{
            const key = `${documentType}-${documentName}`;
            set((state)=>({
                    stagingDocuments: {
                        ...state.stagingDocuments,
                        [key]: {
                            documentType,
                            documentName,
                            files,
                            sessionId
                        }
                    }
                }));
        },
        getStagingDocument: (documentType, documentName)=>{
            const key = `${documentType}-${documentName}`;
            return get().stagingDocuments[key];
        },
        clearStagingDocuments: ()=>{
            set({
                stagingDocuments: {}
            });
        },
        confirmAllStagingDocuments: async (employeeSystemId, employeeData)=>{
            const stagingDocs = get().stagingDocuments;
            for (const [_key, stagingDoc] of Object.entries(stagingDocs)){
                if (stagingDoc.files.length > 0) {
                    // Confirm staging files → permanent với smart filename
                    const confirmedFiles = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$upload$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileUploadAPI"].confirmStagingFiles(stagingDoc.sessionId, employeeSystemId, stagingDoc.documentType, stagingDoc.documentName, employeeData // Gửi employee data để tạo smart filename
                    );
                    // Update local documents với confirmed files
                    get().updateDocumentFiles(employeeSystemId, stagingDoc.documentType, stagingDoc.documentName, confirmedFiles);
                }
            }
            // Clear staging sau khi confirm
            get().clearStagingDocuments();
        },
        // Upload files lên server (for existing employees)
        uploadFiles: async (employeeSystemId, documentType, documentName, files)=>{
            const uploadedFiles = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$upload$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileUploadAPI"].uploadFiles(employeeSystemId, documentType, documentName, files);
            // Cập nhật local store với files đã upload
            get().updateDocumentFiles(employeeSystemId, documentType, documentName, uploadedFiles);
        },
        // Refresh documents từ server
        refreshDocuments: async (employeeSystemId, force = false)=>{
            const state = get();
            // ✅ OPTIMIZATION: Check cache FIRST - return immediately if already loaded (unless forced)
            if (!force && state.loadedEmployees.has(employeeSystemId)) {
                return;
            }
            if (force) {
                // Clear cache for this employee
                set((state)=>{
                    const newLoadedEmployees = new Set(state.loadedEmployees);
                    newLoadedEmployees.delete(employeeSystemId);
                    return {
                        loadedEmployees: newLoadedEmployees,
                        // Also clear old documents for this employee
                        documents: state.documents.filter((doc)=>doc.employeeSystemId !== employeeSystemId)
                    };
                });
            }
            // Non-force refresh uses existing cache logic
            const serverFiles = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$upload$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileUploadAPI"].getFiles(employeeSystemId);
            // If no files, just mark as loaded and return
            if (serverFiles.length === 0) {
                set((state)=>({
                        loadedEmployees: new Set([
                            ...state.loadedEmployees,
                            employeeSystemId
                        ])
                    }));
                return;
            }
            // Group files theo documentType và documentName
            const documentsMap = new Map();
            serverFiles.forEach((file)=>{
                const key = `${file.documentType}-${file.documentName}`;
                if (documentsMap.has(key)) {
                    documentsMap.get(key).files.push(file);
                } else {
                    documentsMap.set(key, {
                        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        employeeSystemId: file.employeeId,
                        documentType: file.documentType,
                        documentName: file.documentName,
                        files: [
                            file
                        ],
                        createdAt: file.uploadedAt,
                        updatedAt: file.confirmedAt || file.uploadedAt
                    });
                }
            });
            // Cập nhật store với documents từ server
            const serverDocuments = Array.from(documentsMap.values());
            set((state)=>({
                    documents: [
                        ...state.documents.filter((d)=>d.employeeSystemId !== employeeSystemId),
                        ...serverDocuments
                    ],
                    loadedEmployees: new Set([
                        ...state.loadedEmployees,
                        employeeSystemId
                    ])
                }));
        },
        getDocuments: (employeeSystemId, documentType)=>{
            const docs = get().documents.filter((d)=>d.employeeSystemId === employeeSystemId);
            if (documentType) {
                return docs.filter((d)=>d.documentType === documentType);
            }
            return docs;
        },
        getDocument: (id)=>{
            return get().documents.find((d)=>d.id === id);
        },
        updateDocumentFiles: (employeeSystemId, documentType, documentName, files)=>{
            const existing = get().documents.find((d)=>d.employeeSystemId === employeeSystemId && d.documentType === documentType && d.documentName === documentName);
            if (existing) {
                set((state)=>({
                        documents: state.documents.map((d)=>d.id === existing.id ? {
                                ...d,
                                files,
                                updatedAt: new Date().toISOString()
                            } : d)
                    }));
            } else {
                const newDoc = {
                    id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    employeeSystemId,
                    documentType,
                    documentName,
                    files,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                set((state)=>({
                        documents: [
                            ...state.documents,
                            newDoc
                        ]
                    }));
            }
        },
        deleteDocument: async (id)=>{
            const doc = get().getDocument(id);
            if (doc) {
                // Xóa tất cả files trên server
                try {
                    for (const file of doc.files){
                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$upload$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileUploadAPI"].deleteFile(file.id);
                    }
                } catch (_error) {
                // Ignore deletion errors - continue with local cleanup
                }
                // Xóa document khỏi local store
                set((state)=>({
                        documents: state.documents.filter((d)=>d.id !== id)
                    }));
            }
        },
        deleteEmployeeDocuments: async (employeeSystemId)=>{
            const docs = get().getDocuments(employeeSystemId);
            // Xóa tất cả files trên server
            try {
                for (const doc of docs){
                    for (const file of doc.files){
                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$upload$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileUploadAPI"].deleteFile(file.id);
                    }
                }
            } catch (_error) {
            // Ignore deletion errors - continue with local cleanup
            }
            // Xóa khỏi local store
            set((state)=>({
                    documents: state.documents.filter((d)=>d.employeeSystemId !== employeeSystemId)
                }));
        },
        getStorageInfo: async ()=>{
            try {
                const stats = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$upload$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FileUploadAPI"].getStorageInfo();
                return {
                    totalFiles: stats.totalFiles,
                    totalSizeMB: stats.totalSizeMB
                };
            } catch (_error) {
                return {
                    totalFiles: 0,
                    totalSizeMB: 0
                };
            }
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/employees/components/employee-documents.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EmployeeDocuments",
    ()=>EmployeeDocuments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$document$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/document-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$optimized$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/optimized-image.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$visually$2d$hidden$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-visually-hidden/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__File$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file.js [app-client] (ecmascript) <export default as File>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-open.js [app-client] (ecmascript) <export default as FolderOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jszip$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jszip/lib/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$file$2d$saver$2f$dist$2f$FileSaver$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/file-saver/dist/FileSaver.min.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
;
;
const formatFileSize = (bytes)=>{
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = [
        'Bytes',
        'KB',
        'MB',
        'GB'
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
const getFileIcon = (type)=>{
    if (type.startsWith('image/')) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"];
    if (type === 'application/pdf') return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"];
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__File$3e$__["File"];
};
const documentTypeLabels = {
    'legal': 'Giấy tờ pháp lý',
    'work-process': 'Hồ sơ công việc',
    'termination': 'Hồ sơ nghỉ việc',
    'decisions': 'Quyết định',
    'kpi': 'Đánh giá KPI',
    'requests': 'Đơn từ'
};
function EmployeeDocuments({ employeeSystemId }) {
    _s();
    const { documents, refreshDocuments, loadedEmployees } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$document$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDocumentStore"])();
    const [searchQuery, setSearchQuery] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('');
    const [isLoading, setIsLoading] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [error, setError] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    // Preview modal state - React-based instead of DOM manipulation (fixes memory leak)
    const [previewFile, setPreviewFile] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [isPreviewOpen, setIsPreviewOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    // Check if data is already cached
    const isCached = loadedEmployees.has(employeeSystemId);
    // Get documents for this employee
    const employeeDocuments = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDocuments.useMemo[employeeDocuments]": ()=>{
            const filtered = documents.filter({
                "EmployeeDocuments.useMemo[employeeDocuments].filtered": (doc)=>doc.employeeSystemId === employeeSystemId
            }["EmployeeDocuments.useMemo[employeeDocuments].filtered"]);
            if (!searchQuery) return filtered;
            return filtered.filter({
                "EmployeeDocuments.useMemo[employeeDocuments]": (doc)=>doc.documentName.toLowerCase().includes(searchQuery.toLowerCase()) || doc.files.some({
                        "EmployeeDocuments.useMemo[employeeDocuments]": (file)=>file.name.toLowerCase().includes(searchQuery.toLowerCase())
                    }["EmployeeDocuments.useMemo[employeeDocuments]"])
            }["EmployeeDocuments.useMemo[employeeDocuments]"]);
        }
    }["EmployeeDocuments.useMemo[employeeDocuments]"], [
        documents,
        employeeSystemId,
        searchQuery
    ]);
    // Group documents by type
    const documentsByType = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDocuments.useMemo[documentsByType]": ()=>{
            const grouped = {};
            employeeDocuments.forEach({
                "EmployeeDocuments.useMemo[documentsByType]": (doc)=>{
                    if (!grouped[doc.documentType]) {
                        grouped[doc.documentType] = [];
                    }
                    grouped[doc.documentType].push(doc);
                }
            }["EmployeeDocuments.useMemo[documentsByType]"]);
            return grouped;
        }
    }["EmployeeDocuments.useMemo[documentsByType]"], [
        employeeDocuments
    ]);
    // Group documents by name within each type (for grid layout)
    const documentsByName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDocuments.useMemo[documentsByName]": ()=>{
            const result = {
                'legal': {},
                'work-process': {},
                'termination': {}
            };
            employeeDocuments.forEach({
                "EmployeeDocuments.useMemo[documentsByName]": (doc)=>{
                    if (result[doc.documentType]) {
                        result[doc.documentType][doc.documentName] = doc;
                    }
                }
            }["EmployeeDocuments.useMemo[documentsByName]"]);
            return result;
        }
    }["EmployeeDocuments.useMemo[documentsByName]"], [
        employeeDocuments
    ]);
    // Load documents only once (store handles cache)
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "EmployeeDocuments.useEffect": ()=>{
            if (employeeSystemId) {
                const { loadedEmployees } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$document$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDocumentStore"].getState();
                // Skip loading if already in cache
                if (loadedEmployees.has(employeeSystemId)) {
                    console.log('✅ Documents already cached for:', employeeSystemId);
                    return;
                }
                console.log('🔄 Loading documents for:', employeeSystemId);
                setIsLoading(true);
                setError(null);
                refreshDocuments(employeeSystemId).catch({
                    "EmployeeDocuments.useEffect": (err)=>{
                        console.error('Failed to load documents:', err);
                        setError('Không thể tải tài liệu. Vui lòng kiểm tra kết nối server.');
                    }
                }["EmployeeDocuments.useEffect"]).finally({
                    "EmployeeDocuments.useEffect": ()=>setIsLoading(false)
                }["EmployeeDocuments.useEffect"]);
            }
        }
    }["EmployeeDocuments.useEffect"], [
        employeeSystemId,
        refreshDocuments
    ]);
    const handleDownload = async (file)=>{
        try {
            const downloadUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFileUrl"])(file.url);
            // Fetch file as blob to force download
            const response = await fetch(downloadUrl);
            const blob = await response.blob();
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = file.originalName || file.name || file.filename;
            document.body.appendChild(link);
            link.click();
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Không thể tải file. Vui lòng thử lại.');
        }
    };
    const handleCopy = async (text)=>{
        try {
            await navigator.clipboard.writeText(text);
            // Toast notification would be nice here
            console.log('Copied to clipboard:', text);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };
    const _handleDownloadAll = async (documentType, docs)=>{
        try {
            const zip = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jszip$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]();
            const _baseUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getBaseUrl"])();
            // Create folder for each document
            for (const doc of docs){
                const folderName = doc.documentName.replace(/[^a-zA-Z0-9]/g, '_');
                const folder = zip.folder(folderName);
                if (folder) {
                    // Download each file and add to ZIP
                    for (const file of doc.files){
                        try {
                            const downloadUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFileUrl"])(file.url);
                            const response = await fetch(downloadUrl);
                            const blob = await response.blob();
                            folder.file(file.originalName || file.name, blob);
                        } catch (error) {
                            console.error('Failed to download file:', file.name, error);
                        }
                    }
                }
            }
            // Generate ZIP and download
            const content = await zip.generateAsync({
                type: 'blob'
            });
            const typeLabel = documentTypeLabels[documentType] || documentType;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$file$2d$saver$2f$dist$2f$FileSaver$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveAs"])(content, `${typeLabel}_${new Date().toISOString().split('T')[0]}.zip`);
            console.log('Downloaded all files as ZIP');
        } catch (error) {
            console.error('Failed to create ZIP:', error);
            alert('Không thể tải xuống tất cả files. Vui lòng thử lại.');
        }
    };
    const handlePreview = (file)=>{
        // Use React state instead of DOM manipulation to prevent memory leaks
        setPreviewFile(file);
        setIsPreviewOpen(true);
    };
    const handleClosePreview = ()=>{
        setIsPreviewOpen(false);
        setPreviewFile(null);
    };
    if (isLoading && !isCached) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "flex items-center justify-center p-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center space-x-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                            lineNumber: 217,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-muted-foreground",
                            children: "Đang tải tài liệu..."
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                            lineNumber: 218,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                    lineNumber: 216,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/employees/components/employee-documents.tsx",
                lineNumber: 215,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/features/employees/components/employee-documents.tsx",
            lineNumber: 214,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "p-8 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-destructive mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            className: "h-12 w-12 mx-auto mb-2",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                lineNumber: 231,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                            lineNumber: 230,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-h5 font-medium mb-2",
                            children: "Không thể tải tài liệu"
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                            lineNumber: 233,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-muted-foreground mb-4",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                            lineNumber: 234,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            size: "sm",
                            onClick: ()=>{
                                setError(null);
                                setIsLoading(true);
                                refreshDocuments(employeeSystemId).finally(()=>setIsLoading(false));
                            },
                            children: "Thử lại"
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                            lineNumber: 235,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                    lineNumber: 229,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/employees/components/employee-documents.tsx",
                lineNumber: 228,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/features/employees/components/employee-documents.tsx",
            lineNumber: 227,
            columnNumber: 7
        }, this);
    }
    if (Object.keys(documentsByType).length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "p-8 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__["FolderOpen"], {
                        className: "h-12 w-12 text-muted-foreground mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/features/employees/components/employee-documents.tsx",
                        lineNumber: 256,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-h5 font-medium mb-2",
                        children: "Chưa có tài liệu"
                    }, void 0, false, {
                        fileName: "[project]/features/employees/components/employee-documents.tsx",
                        lineNumber: 257,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground",
                        children: "Nhân viên này chưa có tài liệu nào được upload."
                    }, void 0, false, {
                        fileName: "[project]/features/employees/components/employee-documents.tsx",
                        lineNumber: 258,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/employees/components/employee-documents.tsx",
                lineNumber: 255,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/features/employees/components/employee-documents.tsx",
            lineNumber: 254,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row justify-between gap-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-h4 font-semibold flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__["FolderOpen"], {
                                className: "h-5 w-5"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                lineNumber: 272,
                                columnNumber: 11
                            }, this),
                            "Tài liệu nhân viên"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/employees/components/employee-documents.tsx",
                        lineNumber: 271,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative w-full sm:w-72",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                lineNumber: 276,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                placeholder: "Tìm kiếm tài liệu...",
                                value: searchQuery,
                                onChange: (e)=>setSearchQuery(e.target.value),
                                className: "pl-9"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                lineNumber: 277,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/employees/components/employee-documents.tsx",
                        lineNumber: 275,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/employees/components/employee-documents.tsx",
                lineNumber: 270,
                columnNumber: 7
            }, this),
            isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center p-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
                    }, void 0, false, {
                        fileName: "[project]/features/employees/components/employee-documents.tsx",
                        lineNumber: 288,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-2 text-muted-foreground",
                        children: "Đang tải tài liệu..."
                    }, void 0, false, {
                        fileName: "[project]/features/employees/components/employee-documents.tsx",
                        lineNumber: 289,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/employees/components/employee-documents.tsx",
                lineNumber: 287,
                columnNumber: 9
            }, this) : employeeDocuments.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "py-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__["FolderOpen"], {
                                className: "h-12 w-12 mx-auto mb-3 opacity-50"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                lineNumber: 295,
                                columnNumber: 15
                            }, this),
                            searchQuery ? 'Không tìm thấy tài liệu phù hợp' : 'Chưa có tài liệu nào'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/employees/components/employee-documents.tsx",
                        lineNumber: 294,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                    lineNumber: 293,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/employees/components/employee-documents.tsx",
                lineNumber: 292,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: [
                    Object.keys(documentsByName['legal']).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        className: "border-l-4 border-l-blue-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                className: "pb-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                    className: "text-h6 text-primary",
                                    children: "1. Tài liệu pháp lý"
                                }, void 0, false, {
                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                    lineNumber: 306,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                lineNumber: 305,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                                    children: Object.entries(documentsByName['legal']).map(([docName, doc])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3 p-3 border rounded-lg bg-muted/30",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                    className: "text-sm font-medium text-foreground",
                                                    children: docName
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                    lineNumber: 312,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-3 gap-2",
                                                    children: doc.files.map((file)=>{
                                                        const FileIcon = getFileIcon(file.type);
                                                        const isImage = file.type.startsWith('image/');
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "border rounded-lg p-2 bg-background hover:bg-muted/50 transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-col gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "w-full aspect-square rounded bg-muted flex items-center justify-center overflow-hidden",
                                                                        children: isImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$optimized$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OptimizedImage"], {
                                                                            src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFileUrl"])(file.url),
                                                                            alt: file.name,
                                                                            className: "w-full h-full object-cover cursor-pointer",
                                                                            onClick: ()=>handlePreview(file),
                                                                            width: 100,
                                                                            height: 100,
                                                                            fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FileIcon, {
                                                                                className: "w-12 h-12 text-muted-foreground"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                lineNumber: 333,
                                                                                columnNumber: 49
                                                                            }, void 0)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                            lineNumber: 326,
                                                                            columnNumber: 37
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FileIcon, {
                                                                            className: "w-12 h-12 text-muted-foreground"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                            lineNumber: 336,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                        lineNumber: 324,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "space-y-0.5",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "font-medium text-xs truncate",
                                                                                title: file.name,
                                                                                children: file.originalName || file.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                lineNumber: 340,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs text-muted-foreground",
                                                                                children: formatFileSize(file.size)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                lineNumber: 343,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                        lineNumber: 339,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex gap-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                size: "sm",
                                                                                variant: "ghost",
                                                                                className: "flex-1 h-7 px-1",
                                                                                onClick: ()=>handleDownload(file),
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                                    className: "h-3.5 w-3.5"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                    lineNumber: 349,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                lineNumber: 348,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            isImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                size: "sm",
                                                                                variant: "ghost",
                                                                                className: "flex-1 h-7 px-1",
                                                                                onClick: ()=>handlePreview(file),
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                                    className: "h-3.5 w-3.5"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                    lineNumber: 353,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                lineNumber: 352,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                size: "sm",
                                                                                variant: "ghost",
                                                                                className: "flex-1 h-7 px-1",
                                                                                onClick: ()=>handleCopy(file.originalName || file.name),
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                                    className: "h-3.5 w-3.5"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                    lineNumber: 357,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                lineNumber: 356,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                        lineNumber: 347,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                lineNumber: 323,
                                                                columnNumber: 31
                                                            }, this)
                                                        }, file.id, false, {
                                                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                            lineNumber: 319,
                                                            columnNumber: 29
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                    lineNumber: 313,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, doc.id, true, {
                                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                                            lineNumber: 311,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                    lineNumber: 309,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                lineNumber: 308,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/employees/components/employee-documents.tsx",
                        lineNumber: 304,
                        columnNumber: 13
                    }, this),
                    Object.keys(documentsByName['work-process']).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        className: "border-l-4 border-l-green-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                className: "pb-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                    className: "text-h6 text-primary",
                                    children: "2. Tài liệu trong quá trình làm việc"
                                }, void 0, false, {
                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                    lineNumber: 376,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                lineNumber: 375,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                                    children: Object.entries(documentsByName['work-process']).map(([docName, doc])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3 p-3 border rounded-lg bg-muted/30",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                    className: "text-sm font-medium text-foreground",
                                                    children: docName
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                    lineNumber: 382,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-3 gap-2",
                                                    children: doc.files.map((file)=>{
                                                        const FileIcon = getFileIcon(file.type);
                                                        const isImage = file.type.startsWith('image/');
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "border rounded-lg p-2 bg-background hover:bg-muted/50 transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-col gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "w-full aspect-square rounded bg-muted flex items-center justify-center overflow-hidden",
                                                                        children: isImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$optimized$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OptimizedImage"], {
                                                                            src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFileUrl"])(file.url),
                                                                            alt: file.name,
                                                                            className: "w-full h-full object-cover cursor-pointer",
                                                                            onClick: ()=>handlePreview(file),
                                                                            width: 100,
                                                                            height: 100,
                                                                            fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FileIcon, {
                                                                                className: "w-12 h-12 text-muted-foreground"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                lineNumber: 403,
                                                                                columnNumber: 49
                                                                            }, void 0)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                            lineNumber: 396,
                                                                            columnNumber: 37
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FileIcon, {
                                                                            className: "w-12 h-12 text-muted-foreground"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                            lineNumber: 406,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                        lineNumber: 394,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "space-y-0.5",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "font-medium text-xs truncate",
                                                                                title: file.name,
                                                                                children: file.originalName || file.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                lineNumber: 410,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs text-muted-foreground",
                                                                                children: formatFileSize(file.size)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                lineNumber: 413,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                        lineNumber: 409,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex gap-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                size: "sm",
                                                                                variant: "ghost",
                                                                                className: "flex-1 h-7 px-1",
                                                                                onClick: ()=>handleDownload(file),
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                                    className: "h-3.5 w-3.5"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                    lineNumber: 419,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                lineNumber: 418,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            isImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                size: "sm",
                                                                                variant: "ghost",
                                                                                className: "flex-1 h-7 px-1",
                                                                                onClick: ()=>handlePreview(file),
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                                    className: "h-3.5 w-3.5"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                    lineNumber: 423,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                lineNumber: 422,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                size: "sm",
                                                                                variant: "ghost",
                                                                                className: "flex-1 h-7 px-1",
                                                                                onClick: ()=>handleCopy(file.originalName || file.name),
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                                    className: "h-3.5 w-3.5"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                    lineNumber: 427,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                lineNumber: 426,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                        lineNumber: 417,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                lineNumber: 393,
                                                                columnNumber: 31
                                                            }, this)
                                                        }, file.id, false, {
                                                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                            lineNumber: 389,
                                                            columnNumber: 29
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                    lineNumber: 383,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, doc.id, true, {
                                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                                            lineNumber: 381,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                    lineNumber: 379,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                lineNumber: 378,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/employees/components/employee-documents.tsx",
                        lineNumber: 374,
                        columnNumber: 13
                    }, this),
                    Object.keys(documentsByName['termination']).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        className: "border-l-4 border-l-red-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                className: "pb-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                    className: "text-h6 text-primary",
                                    children: "3. Tài liệu khi nghỉ việc"
                                }, void 0, false, {
                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                    lineNumber: 446,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                lineNumber: 445,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                                    children: Object.entries(documentsByName['termination']).map(([docName, doc])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3 p-3 border rounded-lg bg-muted/30",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                    className: "text-sm font-medium text-foreground",
                                                    children: docName
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                    lineNumber: 452,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-3 gap-2",
                                                    children: doc.files.map((file)=>{
                                                        const FileIcon = getFileIcon(file.type);
                                                        const isImage = file.type.startsWith('image/');
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "border rounded-lg p-2 bg-background hover:bg-muted/50 transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-col gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "w-full aspect-square rounded bg-muted flex items-center justify-center overflow-hidden",
                                                                        children: isImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$optimized$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OptimizedImage"], {
                                                                            src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFileUrl"])(file.url),
                                                                            alt: file.name,
                                                                            className: "w-full h-full object-cover cursor-pointer",
                                                                            onClick: ()=>handlePreview(file),
                                                                            width: 100,
                                                                            height: 100,
                                                                            fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FileIcon, {
                                                                                className: "w-12 h-12 text-muted-foreground"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                lineNumber: 473,
                                                                                columnNumber: 49
                                                                            }, void 0)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                            lineNumber: 466,
                                                                            columnNumber: 37
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FileIcon, {
                                                                            className: "w-12 h-12 text-muted-foreground"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                            lineNumber: 476,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                        lineNumber: 464,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "space-y-0.5",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "font-medium text-xs truncate",
                                                                                title: file.name,
                                                                                children: file.originalName || file.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                lineNumber: 480,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs text-muted-foreground",
                                                                                children: formatFileSize(file.size)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                lineNumber: 483,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                        lineNumber: 479,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex gap-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                size: "sm",
                                                                                variant: "ghost",
                                                                                className: "flex-1 h-7 px-1",
                                                                                onClick: ()=>handleDownload(file),
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                                    className: "h-3.5 w-3.5"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                    lineNumber: 489,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                lineNumber: 488,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            isImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                size: "sm",
                                                                                variant: "ghost",
                                                                                className: "flex-1 h-7 px-1",
                                                                                onClick: ()=>handlePreview(file),
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                                    className: "h-3.5 w-3.5"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                    lineNumber: 493,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                lineNumber: 492,
                                                                                columnNumber: 37
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                                size: "sm",
                                                                                variant: "ghost",
                                                                                className: "flex-1 h-7 px-1",
                                                                                onClick: ()=>handleCopy(file.originalName || file.name),
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                                                    className: "h-3.5 w-3.5"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                    lineNumber: 497,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                                lineNumber: 496,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                        lineNumber: 487,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                                lineNumber: 463,
                                                                columnNumber: 31
                                                            }, this)
                                                        }, file.id, false, {
                                                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                            lineNumber: 459,
                                                            columnNumber: 29
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                                    lineNumber: 453,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, doc.id, true, {
                                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                                            lineNumber: 451,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                                    lineNumber: 449,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                lineNumber: 448,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/employees/components/employee-documents.tsx",
                        lineNumber: 444,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/employees/components/employee-documents.tsx",
                lineNumber: 301,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isPreviewOpen,
                onOpenChange: setIsPreviewOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: "max-w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-black/95 border-0",
                    onClick: handleClosePreview,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$visually$2d$hidden$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VisuallyHidden"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                children: previewFile?.originalName || previewFile?.name || 'Xem trước ảnh'
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                lineNumber: 521,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                            lineNumber: 520,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "ghost",
                            size: "icon",
                            className: "absolute top-4 right-4 z-10 bg-white hover:bg-gray-100 rounded-full w-10 h-10 shadow-lg",
                            onClick: handleClosePreview,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-6 w-6"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                lineNumber: 532,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                            lineNumber: 526,
                            columnNumber: 11
                        }, this),
                        previewFile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center w-full h-full min-h-[50vh]",
                            onClick: (e)=>e.stopPropagation(),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFileUrl"])(previewFile.url),
                                alt: previewFile.originalName || previewFile.name,
                                className: "max-w-full max-h-[85vh] object-contain rounded-lg"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-documents.tsx",
                                lineNumber: 540,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/employee-documents.tsx",
                            lineNumber: 536,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/employees/components/employee-documents.tsx",
                    lineNumber: 516,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/employees/components/employee-documents.tsx",
                lineNumber: 515,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/employees/components/employee-documents.tsx",
        lineNumber: 267,
        columnNumber: 5
    }, this);
}
_s(EmployeeDocuments, "cMXyrNeEhY/20yxJ6mxr6bKwvSU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$document$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDocumentStore"]
    ];
});
_c = EmployeeDocuments;
var _c;
__turbopack_context__.k.register(_c, "EmployeeDocuments");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/employees/components/employee-account-tab.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EmployeeAccountTab",
    ()=>EmployeeAccountTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-client] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-alert.js [app-client] (ecmascript) <export default as ShieldAlert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security-utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
;
;
const getRoleLabel = (role)=>{
    switch(role){
        case 'Admin':
            return 'Quản trị viên';
        case 'Manager':
            return 'Quản lý';
        case 'Sales':
            return 'Kinh doanh';
        case 'Warehouse':
            return 'Kho';
        default:
            return role;
    }
};
const getRoleDescription = (role)=>{
    switch(role){
        case 'Admin':
            return 'Toàn quyền hệ thống';
        case 'Manager':
            return 'Quản lý phòng ban';
        case 'Sales':
            return 'Nhân viên kinh doanh';
        case 'Warehouse':
            return 'Nhân viên kho';
        default:
            return '';
    }
};
const getRoleBadgeVariant = (role)=>{
    switch(role){
        case 'Admin':
            return 'destructive';
        case 'Manager':
            return 'default';
        case 'Sales':
            return 'secondary';
        case 'Warehouse':
            return 'outline';
        default:
            return 'secondary';
    }
};
// Hàm tạo mật khẩu ngẫu nhiên
const generatePassword = (length = 12)=>{
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    const allChars = uppercase + lowercase + numbers + symbols;
    let password = '';
    // Đảm bảo có ít nhất 1 ký tự mỗi loại
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    // Thêm các ký tự ngẫu nhiên còn lại
    for(let i = password.length; i < length; i++){
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    // Trộn ngẫu nhiên
    return password.split('').sort(()=>Math.random() - 0.5).join('');
};
function EmployeeAccountTab({ employee }) {
    _s();
    const { update } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeStore"])();
    const { user: currentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [showPassword, setShowPassword] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [password, setPassword] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('');
    const [confirmPassword, setConfirmPassword] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('');
    const [selectedRole, setSelectedRole] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](employee.role);
    // Check if current user can change roles (only Admin can)
    const canChangeRole = currentUser?.role === 'admin';
    // Check if trying to edit own account
    const _isOwnAccount = currentUser?.employeeId === employee.systemId;
    const handleGeneratePassword = ()=>{
        const newPassword = generatePassword(12);
        setPassword(newPassword);
        setConfirmPassword(newPassword);
        setShowPassword(true);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã tạo mật khẩu ngẫu nhiên');
    };
    const handleCopyPassword = async ()=>{
        if (!password) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Chưa có mật khẩu để copy');
            return;
        }
        try {
            await navigator.clipboard.writeText(password);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã copy mật khẩu vào clipboard');
        } catch (_err) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không thể copy mật khẩu');
        }
    };
    const handleSave = async ()=>{
        if (password || confirmPassword) {
            // Use centralized password validation
            const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validatePasswordStrength"])(password);
            if (!validation.isValid) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(validation.errors[0]);
                return;
            }
            if (password !== confirmPassword) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Mật khẩu xác nhận không khớp');
                return;
            }
        }
        const updates = {
            role: selectedRole
        };
        if (password) {
            // Hash password before storing (client-side protection)
            // Real hashing should be done server-side with bcrypt
            updates.password = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hashPassword"])(password);
        }
        update(employee.systemId, {
            ...employee,
            ...updates
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã cập nhật thông tin đăng nhập');
        setPassword('');
        setConfirmPassword('');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                className: "text-h5",
                                children: "Thông tin đăng nhập"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                children: "Cấu hình tài khoản và quyền truy cập hệ thống cho nhân viên"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                lineNumber: 148,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                        children: "Email đăng nhập"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                        lineNumber: 154,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        value: employee.workEmail,
                                        disabled: true,
                                        className: "bg-muted"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                        lineNumber: 155,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: "Email công việc được sử dụng làm tên đăng nhập"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                        lineNumber: 160,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                        children: "Vai trò hiện tại"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                        lineNumber: 166,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                            variant: getRoleBadgeVariant(employee.role),
                                            className: "text-sm",
                                            children: getRoleLabel(employee.role)
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                            lineNumber: 168,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                        lineNumber: 167,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                lineNumber: 165,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                        htmlFor: "role",
                                        children: "Thay đổi vai trò"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                        lineNumber: 175,
                                        columnNumber: 13
                                    }, this),
                                    canChangeRole ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                                value: selectedRole,
                                                onValueChange: (value)=>setSelectedRole(value),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                        id: "role",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                            fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                            lineNumber: 180,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                        lineNumber: 179,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "Sales",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col items-start py-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium",
                                                                            children: getRoleLabel('Sales')
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                                            lineNumber: 185,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs text-muted-foreground",
                                                                            children: getRoleDescription('Sales')
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                                            lineNumber: 186,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                                    lineNumber: 184,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                                lineNumber: 183,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "Warehouse",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col items-start py-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium",
                                                                            children: getRoleLabel('Warehouse')
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                                            lineNumber: 191,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs text-muted-foreground",
                                                                            children: getRoleDescription('Warehouse')
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                                            lineNumber: 192,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                                    lineNumber: 190,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                                lineNumber: 189,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "Manager",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col items-start py-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium",
                                                                            children: getRoleLabel('Manager')
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                                            lineNumber: 197,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs text-muted-foreground",
                                                                            children: getRoleDescription('Manager')
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                                            lineNumber: 198,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                                    lineNumber: 196,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                                lineNumber: 195,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "Admin",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col items-start py-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "font-medium",
                                                                            children: getRoleLabel('Admin')
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                                            lineNumber: 203,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs text-muted-foreground",
                                                                            children: getRoleDescription('Admin')
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                                            lineNumber: 204,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                                    lineNumber: 202,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                                lineNumber: 201,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                        lineNumber: 182,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                lineNumber: 178,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: "Vai trò xác định quyền truy cập các chức năng trong hệ thống"
                                            }, void 0, false, {
                                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                lineNumber: 209,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-lg border border-amber-200 p-3 bg-amber-50 dark:bg-amber-950/20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 text-amber-800 dark:text-amber-200",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                    lineNumber: 216,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    children: "Chỉ Admin mới có quyền thay đổi vai trò nhân viên."
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                    lineNumber: 217,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                            lineNumber: 215,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                        lineNumber: 214,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                className: "text-h5",
                                children: "Đổi mật khẩu"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                children: employee.password ? 'Cập nhật mật khẩu đăng nhập' : 'Thiết lập mật khẩu đăng nhập mới'
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                lineNumber: 232,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                        lineNumber: 228,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-4",
                        children: [
                            employee.password ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-lg border p-3 bg-muted/50",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-muted-foreground",
                                    children: "Mật khẩu đã được thiết lập. Để thay đổi, nhập mật khẩu mới bên dưới."
                                }, void 0, false, {
                                    fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                    lineNumber: 239,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                lineNumber: 238,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-lg border border-orange-200 p-3 bg-orange-50 dark:bg-orange-950/20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-orange-800 dark:text-orange-200",
                                    children: "Chưa có mật khẩu. Nhân viên chưa thể đăng nhập hệ thống."
                                }, void 0, false, {
                                    fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                    lineNumber: 245,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                lineNumber: 244,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "password",
                                                children: "Mật khẩu mới"
                                            }, void 0, false, {
                                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                lineNumber: 253,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        type: "button",
                                                        variant: "outline",
                                                        size: "sm",
                                                        onClick: handleGeneratePassword,
                                                        children: "Tạo tự động"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                        lineNumber: 255,
                                                        columnNumber: 17
                                                    }, this),
                                                    password && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        type: "button",
                                                        variant: "outline",
                                                        size: "sm",
                                                        onClick: handleCopyPassword,
                                                        children: "Copy"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                        lineNumber: 264,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                lineNumber: 254,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                        lineNumber: 252,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                id: "password",
                                                type: showPassword ? 'text' : 'password',
                                                value: password,
                                                onChange: (e)=>setPassword(e.target.value),
                                                placeholder: "Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                            }, void 0, false, {
                                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                lineNumber: 276,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                variant: "ghost",
                                                size: "sm",
                                                className: "absolute right-0 top-0 h-full px-3 hover:bg-transparent",
                                                onClick: ()=>setShowPassword(!showPassword),
                                                children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                    lineNumber: 290,
                                                    columnNumber: 33
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                    lineNumber: 290,
                                                    columnNumber: 66
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                                lineNumber: 283,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                        lineNumber: 275,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                lineNumber: 251,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                        htmlFor: "confirmPassword",
                                        children: "Xác nhận mật khẩu"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                        lineNumber: 296,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        id: "confirmPassword",
                                        type: showPassword ? 'text' : 'password',
                                        value: confirmPassword,
                                        onChange: (e)=>setConfirmPassword(e.target.value),
                                        placeholder: "Nhập lại mật khẩu mới"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                        lineNumber: 297,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                lineNumber: 295,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end pt-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: handleSave,
                                    children: "Lưu thay đổi"
                                }, void 0, false, {
                                    fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                    lineNumber: 307,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                lineNumber: 306,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                        lineNumber: 236,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                lineNumber: 227,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: "border-blue-200 bg-blue-50/50 dark:bg-blue-950/20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "pt-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium text-blue-900 dark:text-blue-100",
                                children: "Lưu ý quan trọng:"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                lineNumber: 317,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Email công việc được dùng làm tên đăng nhập"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                        lineNumber: 321,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Mật khẩu phải có tối thiểu 6 ký tự"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                        lineNumber: 322,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Vai trò quyết định quyền truy cập các chức năng"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                        lineNumber: 323,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Chỉ Admin mới được thay đổi vai trò nhân viên khác"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                        lineNumber: 324,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                                lineNumber: 320,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                        lineNumber: 316,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                    lineNumber: 315,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/employees/components/employee-account-tab.tsx",
                lineNumber: 314,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/employees/components/employee-account-tab.tsx",
        lineNumber: 142,
        columnNumber: 5
    }, this);
}
_s(EmployeeAccountTab, "JnRJaVkQbowffYpQ17B9P2K01TY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = EmployeeAccountTab;
var _c;
__turbopack_context__.k.register(_c, "EmployeeAccountTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/employees/detail/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "employmentStatusBadgeVariants",
    ()=>employmentStatusBadgeVariants,
    "formatAddressDisplay",
    ()=>formatAddressDisplay,
    "formatCurrency",
    ()=>formatCurrency,
    "formatDateDisplay",
    ()=>formatDateDisplay,
    "formatMonthLabel",
    ()=>formatMonthLabel,
    "leaveStatusVariants",
    ()=>leaveStatusVariants,
    "penaltyStatusVariants",
    ()=>penaltyStatusVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
'use client';
;
const formatCurrency = (value)=>{
    if (typeof value !== 'number') return '-';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};
const formatMonthLabel = (monthKey)=>{
    if (!monthKey) return '—';
    const [year, month] = monthKey.split('-');
    return `Tháng ${month}/${year}`;
};
const formatDateDisplay = (dateString)=>{
    if (!dateString) return '-';
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateCustom"])(new Date(dateString), "dd/MM/yyyy");
};
const formatAddressDisplay = (addr)=>{
    if (!addr) return '-';
    const { street, ward, district, province, inputLevel } = addr;
    if (inputLevel === '3-level') {
        // 3-cấp: Hiển thị District + Ward
        return [
            street,
            district,
            ward,
            province
        ].filter(Boolean).join(', ') || '-';
    } else {
        // 2-cấp: Chỉ hiển thị Ward (bỏ District)
        return [
            street,
            ward,
            province
        ].filter(Boolean).join(', ') || '-';
    }
};
const penaltyStatusVariants = {
    "Chưa thanh toán": "warning",
    "Đã thanh toán": "success",
    "Đã hủy": "secondary"
};
const leaveStatusVariants = {
    "Chờ duyệt": "warning",
    "Đã duyệt": "success",
    "Đã từ chối": "destructive"
};
const employmentStatusBadgeVariants = {
    "Đang làm việc": "default",
    "Tạm nghỉ": "secondary",
    "Đã nghỉ việc": "destructive"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/employees/api/employees-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Employees API - Isolated API functions
 * 
 * ⚠️ IMPORTANT: This file should ONLY contain:
 * - Fetch functions
 * - Type imports from ../types
 * - NO store imports
 * - NO cross-feature imports
 */ __turbopack_context__.s([
    "createEmployee",
    ()=>createEmployee,
    "deleteEmployee",
    ()=>deleteEmployee,
    "fetchEmployee",
    ()=>fetchEmployee,
    "fetchEmployees",
    ()=>fetchEmployees,
    "fetchEmployeesByBranch",
    ()=>fetchEmployeesByBranch,
    "fetchEmployeesByDepartment",
    ()=>fetchEmployeesByDepartment,
    "searchEmployees",
    ()=>searchEmployees,
    "updateEmployee",
    ()=>updateEmployee
]);
const API_BASE = '/api/employees';
async function fetchEmployees(params = {}) {
    const { page = 1, limit = 50, ...rest } = params;
    const searchParams = new URLSearchParams({
        page: String(page),
        limit: String(limit)
    });
    // Add optional params
    Object.entries(rest).forEach(([key, value])=>{
        if (value != null && value !== '') {
            searchParams.set(key, String(value));
        }
    });
    const res = await fetch(`${API_BASE}?${searchParams}`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch employees: ${res.statusText}`);
    }
    return res.json();
}
async function fetchEmployee(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch employee ${id}: ${res.statusText}`);
    }
    return res.json();
}
async function createEmployee(data) {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || `Failed to create employee: ${res.statusText}`);
    }
    return res.json();
}
async function updateEmployee({ systemId, ...data }) {
    const res = await fetch(`${API_BASE}/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || `Failed to update employee: ${res.statusText}`);
    }
    return res.json();
}
async function deleteEmployee(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || `Failed to delete employee: ${res.statusText}`);
    }
}
async function searchEmployees(query, limit = 20) {
    const res = await fetch(`${API_BASE}?search=${encodeURIComponent(query)}&limit=${limit}`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to search employees: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data || [];
}
async function fetchEmployeesByDepartment(departmentId) {
    const res = await fetch(`${API_BASE}?departmentId=${departmentId}&limit=100`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch employees by department: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data || [];
}
async function fetchEmployeesByBranch(branchId) {
    const res = await fetch(`${API_BASE}?branchId=${branchId}&limit=100`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch employees by branch: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data || [];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/employees/hooks/use-employees.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "employeeKeys",
    ()=>employeeKeys,
    "useActiveEmployees",
    ()=>useActiveEmployees,
    "useEmployee",
    ()=>useEmployee,
    "useEmployeeMutations",
    ()=>useEmployeeMutations,
    "useEmployeeSearch",
    ()=>useEmployeeSearch,
    "useEmployees",
    ()=>useEmployees,
    "useEmployeesByBranch",
    ()=>useEmployeesByBranch,
    "useEmployeesByDepartment",
    ()=>useEmployeesByDepartment,
    "usePrefetchEmployee",
    ()=>usePrefetchEmployee
]);
/**
 * useEmployees - React Query hooks for employees
 * 
 * ⚠️ IMPORTANT: Direct import pattern
 * - Import this file directly: import { useEmployees } from '@/features/employees/hooks/use-employees'
 * - NEVER import from '@/features/employees' or '@/features/employees/store'
 * 
 * This hook is ISOLATED - it only depends on:
 * - @tanstack/react-query
 * - Local API functions
 * - Local types
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/api/employees-api.ts [app-client] (ecmascript)");
// Re-export from use-all-employees for backward compatibility
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$all$2d$employees$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/hooks/use-all-employees.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature();
;
;
const employeeKeys = {
    all: [
        'employees'
    ],
    lists: ()=>[
            ...employeeKeys.all,
            'list'
        ],
    list: (params)=>[
            ...employeeKeys.lists(),
            params
        ],
    details: ()=>[
            ...employeeKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...employeeKeys.details(),
            id
        ],
    search: (query)=>[
            ...employeeKeys.all,
            'search',
            query
        ],
    byDepartment: (id)=>[
            ...employeeKeys.all,
            'department',
            id
        ],
    byBranch: (id)=>[
            ...employeeKeys.all,
            'branch',
            id
        ]
};
function useEmployees(params = {}) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.list(params),
        queryFn: {
            "useEmployees.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchEmployees"])(params)
        }["useEmployees.useQuery"],
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
_s(useEmployees, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useEmployee(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.detail(id),
        queryFn: {
            "useEmployee.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchEmployee"])(id)
        }["useEmployee.useQuery"],
        enabled: !!id,
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000
    });
}
_s1(useEmployee, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useEmployeeSearch(query, limit = 20) {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.search(query),
        queryFn: {
            "useEmployeeSearch.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchEmployees"])(query, limit)
        }["useEmployeeSearch.useQuery"],
        enabled: query.length >= 2,
        staleTime: 30_000
    });
}
_s2(useEmployeeSearch, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useEmployeesByDepartment(departmentId) {
    _s3();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.byDepartment(departmentId),
        queryFn: {
            "useEmployeesByDepartment.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchEmployeesByDepartment"])(departmentId)
        }["useEmployeesByDepartment.useQuery"],
        enabled: !!departmentId,
        staleTime: 60_000
    });
}
_s3(useEmployeesByDepartment, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useEmployeesByBranch(branchId) {
    _s4();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.byBranch(branchId),
        queryFn: {
            "useEmployeesByBranch.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchEmployeesByBranch"])(branchId)
        }["useEmployeesByBranch.useQuery"],
        enabled: !!branchId,
        staleTime: 60_000
    });
}
_s4(useEmployeesByBranch, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useEmployeeMutations(options = {}) {
    _s5();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createEmployee"],
        onSuccess: {
            "useEmployeeMutations.useMutation[create]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: employeeKeys.lists()
                });
                options.onCreateSuccess?.(data);
            }
        }["useEmployeeMutations.useMutation[create]"],
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateEmployee"],
        onSuccess: {
            "useEmployeeMutations.useMutation[update]": (data, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: employeeKeys.detail(variables.systemId)
                });
                queryClient.invalidateQueries({
                    queryKey: employeeKeys.lists()
                });
                options.onUpdateSuccess?.(data);
            }
        }["useEmployeeMutations.useMutation[update]"],
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteEmployee"],
        onSuccess: {
            "useEmployeeMutations.useMutation[remove]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: employeeKeys.all
                });
                options.onDeleteSuccess?.();
            }
        }["useEmployeeMutations.useMutation[remove]"],
        onError: options.onError
    });
    return {
        create,
        update,
        remove,
        isCreating: create.isPending,
        isUpdating: update.isPending,
        isDeleting: remove.isPending,
        isMutating: create.isPending || update.isPending || remove.isPending
    };
}
_s5(useEmployeeMutations, "JxOfJjdyCQxYamNcDrzBiezg78E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useActiveEmployees(params = {}) {
    _s6();
    return useEmployees({
        ...params,
        status: 'active'
    });
}
_s6(useActiveEmployees, "ZKJodnfpUN3BzYCJ+1ImVugjonI=", false, function() {
    return [
        useEmployees
    ];
});
function usePrefetchEmployee() {
    _s7();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (id)=>{
        queryClient.prefetchQuery({
            queryKey: employeeKeys.detail(id),
            queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchEmployee"])(id),
            staleTime: 60_000
        });
    };
}
_s7(usePrefetchEmployee, "4R+oYVB2Uc11P7bp1KcuhpkfaTw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"]
    ];
});
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/employees/hooks/use-all-employees.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useActiveEmployees",
    ()=>useActiveEmployees,
    "useAllEmployees",
    ()=>useAllEmployees,
    "useEmployeeFinder",
    ()=>useEmployeeFinder,
    "useEmployeeOptions",
    ()=>useEmployeeOptions,
    "useEmployeeSearcher",
    ()=>useEmployeeSearcher
]);
/**
 * useAllEmployees - Convenience hook for components needing all employees as flat array
 * 
 * Use case: Dropdowns, selects, comboboxes that need all employees for selection
 * 
 * ⚠️ For paginated views, use useEmployees() instead
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$employees$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/employees/hooks/use-employees.ts [app-client] (ecmascript) <locals>");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
;
;
function useAllEmployees() {
    _s();
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$employees$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEmployees"])({
        limit: 30
    });
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
_s(useAllEmployees, "B9e30hqZbf6UAK8zWgAqRt+CumM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$employees$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEmployees"]
    ];
});
function useActiveEmployees() {
    _s1();
    const { data, isLoading, isError, error } = useAllEmployees();
    const activeEmployees = data.filter((e)=>!e.isDeleted && e.isActive !== false);
    return {
        data: activeEmployees,
        isLoading,
        isError,
        error
    };
}
_s1(useActiveEmployees, "cxeJXRoHWDy0HoFjhSxswuBrPAc=", false, function() {
    return [
        useAllEmployees
    ];
});
function useEmployeeOptions() {
    _s2();
    const { data, isLoading } = useAllEmployees();
    const options = data.map((e)=>({
            value: e.systemId,
            label: e.fullName
        }));
    return {
        options,
        isLoading
    };
}
_s2(useEmployeeOptions, "UwDi4hE/SAywiDQYk7L3NhC+Fa4=", false, function() {
    return [
        useAllEmployees
    ];
});
function useEmployeeFinder() {
    _s3();
    const { data } = useAllEmployees();
    const findById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useEmployeeFinder.useCallback[findById]": (systemId)=>{
            if (!systemId) return undefined;
            return data.find({
                "useEmployeeFinder.useCallback[findById]": (e)=>e.systemId === systemId
            }["useEmployeeFinder.useCallback[findById]"]);
        }
    }["useEmployeeFinder.useCallback[findById]"], [
        data
    ]);
    return {
        findById
    };
}
_s3(useEmployeeFinder, "2QCkJ/NgAJS1kqJBv0CBNXKtGGY=", false, function() {
    return [
        useAllEmployees
    ];
});
function useEmployeeSearcher() {
    _s4();
    const { data } = useAllEmployees();
    const searchEmployees = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useEmployeeSearcher.useCallback[searchEmployees]": async (query, _page = 0, limit = 100)=>{
            const lowerQuery = query.toLowerCase();
            const filtered = data.filter({
                "useEmployeeSearcher.useCallback[searchEmployees].filtered": (e)=>e.fullName?.toLowerCase().includes(lowerQuery) || e.id?.toLowerCase().includes(lowerQuery) || e.phone?.includes(query)
            }["useEmployeeSearcher.useCallback[searchEmployees].filtered"]);
            return {
                items: filtered.slice(0, limit).map({
                    "useEmployeeSearcher.useCallback[searchEmployees]": (e)=>({
                            value: e.systemId,
                            label: e.fullName || e.id || 'N/A'
                        })
                }["useEmployeeSearcher.useCallback[searchEmployees]"]),
                total: filtered.length,
                hasNextPage: filtered.length > limit
            };
        }
    }["useEmployeeSearcher.useCallback[searchEmployees]"], [
        data
    ]);
    return {
        searchEmployees
    };
}
_s4(useEmployeeSearcher, "0Sy3BETrITINXgdXux2sX8zBj8c=", false, function() {
    return [
        useAllEmployees
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/employees/detail/PayslipDetailDialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PayslipDetailDialog",
    ()=>PayslipDetailDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payroll$2f$components$2f$status$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payroll/components/status-badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payroll$2f$components$2f$payslip$2d$print$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payroll/components/payslip-print-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/detail/types.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
function PayslipDetailDialog({ open, onOpenChange, selectedPayslip, onViewPayroll }) {
    if (!selectedPayslip) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "max-w-2xl max-h-[90vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            children: "Chi tiết phiếu lương"
                        }, void 0, false, {
                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: [
                                selectedPayslip?.batch?.id ?? 'Phiếu lương',
                                " -",
                                ' ',
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMonthLabel"])(selectedPayslip?.batch?.payPeriod.monthKey ?? selectedPayslip?.slip.periodMonthKey)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-x-6 gap-y-2 text-sm border rounded-lg p-4 bg-muted/30",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Mã bảng lương:"
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                            lineNumber: 59,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium",
                                            children: selectedPayslip.batch?.id ?? '—'
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                            lineNumber: 60,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                    lineNumber: 58,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Trạng thái:"
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                            lineNumber: 63,
                                            columnNumber: 15
                                        }, this),
                                        selectedPayslip.batch ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payroll$2f$components$2f$status$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PayrollStatusBadge"], {
                                            status: selectedPayslip.batch.status
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                            lineNumber: 65,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                            variant: "outline",
                                            children: "Chưa xác định"
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                            lineNumber: 67,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                    lineNumber: 62,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Kỳ lương:"
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                            lineNumber: 71,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatMonthLabel"])(selectedPayslip.batch?.payPeriod.monthKey ?? selectedPayslip.slip.periodMonthKey)
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                            lineNumber: 72,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Ngày trả lương:"
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                            lineNumber: 80,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(selectedPayslip.batch?.payrollDate || selectedPayslip.slip.createdAt) || '—'
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                            lineNumber: 81,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                    lineNumber: 79,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg border p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "font-medium text-green-700 mb-3 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                    lineNumber: 94,
                                                    columnNumber: 17
                                                }, this),
                                                "Các khoản thu nhập"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                            lineNumber: 93,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2 text-sm",
                                            children: [
                                                selectedPayslip.slip.components && selectedPayslip.slip.components.filter((c)=>c.category === 'earning').map((comp, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between py-1 border-b border-dashed last:border-0",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-muted-foreground",
                                                                children: comp.label
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                                lineNumber: 106,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium tabular-nums text-green-600",
                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(comp.amount)
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                                lineNumber: 107,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                        lineNumber: 102,
                                                        columnNumber: 23
                                                    }, this)),
                                                (!selectedPayslip.slip.components || selectedPayslip.slip.components.filter((c)=>c.category === 'earning').length === 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between py-1 border-b border-dashed",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground",
                                                            children: "Thu nhập gộp"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 116,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium tabular-nums text-green-600",
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedPayslip.slip.totals.grossEarnings)
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 117,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                    lineNumber: 115,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between pt-2 font-semibold border-t",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Tổng thu nhập"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 123,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "tabular-nums text-green-600",
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedPayslip.slip.totals.grossEarnings)
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 124,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                    lineNumber: 122,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                            lineNumber: 97,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                    lineNumber: 92,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg border p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "font-medium text-red-700 mb-3 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                    lineNumber: 134,
                                                    columnNumber: 17
                                                }, this),
                                                "Các khoản khấu trừ"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                            lineNumber: 133,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2 text-sm",
                                            children: [
                                                selectedPayslip.slip.components && selectedPayslip.slip.components.filter((c)=>c.category === 'deduction').map((comp, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between py-1 border-b border-dashed last:border-0",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-muted-foreground",
                                                                children: comp.label
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                                lineNumber: 146,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium tabular-nums text-red-600",
                                                                children: [
                                                                    "-",
                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(comp.amount)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                                lineNumber: 147,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                        lineNumber: 142,
                                                        columnNumber: 23
                                                    }, this)),
                                                selectedPayslip.slip.totals.employeeSocialInsurance > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between py-1 border-b border-dashed",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground",
                                                            children: "BHXH (8%)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 155,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium tabular-nums text-red-600",
                                                            children: [
                                                                "-",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedPayslip.slip.totals.employeeSocialInsurance)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 156,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                    lineNumber: 154,
                                                    columnNumber: 19
                                                }, this),
                                                selectedPayslip.slip.totals.employeeHealthInsurance > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between py-1 border-b border-dashed",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground",
                                                            children: "BHYT (1.5%)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 163,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium tabular-nums text-red-600",
                                                            children: [
                                                                "-",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedPayslip.slip.totals.employeeHealthInsurance)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 164,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                    lineNumber: 162,
                                                    columnNumber: 19
                                                }, this),
                                                selectedPayslip.slip.totals.employeeUnemploymentInsurance > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between py-1 border-b border-dashed",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground",
                                                            children: "BHTN (1%)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 171,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium tabular-nums text-red-600",
                                                            children: [
                                                                "-",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedPayslip.slip.totals.employeeUnemploymentInsurance)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 172,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 19
                                                }, this),
                                                selectedPayslip.slip.totals.personalIncomeTax > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between py-1 border-b border-dashed",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground",
                                                            children: "Thuế TNCN"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 183,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium tabular-nums text-red-600",
                                                            children: [
                                                                "-",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedPayslip.slip.totals.personalIncomeTax)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 184,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                    lineNumber: 182,
                                                    columnNumber: 19
                                                }, this),
                                                selectedPayslip.slip.totals.penaltyDeductions > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between py-1 border-b border-dashed",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground",
                                                            children: "Khấu trừ phạt"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 192,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium tabular-nums text-red-600",
                                                            children: [
                                                                "-",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedPayslip.slip.totals.penaltyDeductions)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 193,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                    lineNumber: 191,
                                                    columnNumber: 19
                                                }, this),
                                                selectedPayslip.slip.totals.otherDeductions > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between py-1 border-b border-dashed",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground",
                                                            children: "Khấu trừ khác"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 201,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium tabular-nums text-red-600",
                                                            children: [
                                                                "-",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedPayslip.slip.totals.otherDeductions)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 202,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                    lineNumber: 200,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between pt-2 font-semibold border-t",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Tổng khấu trừ"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 208,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "tabular-nums text-red-600",
                                                            children: [
                                                                "-",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedPayslip.slip.totals.deductions)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 209,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                    lineNumber: 207,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                            lineNumber: 137,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                    lineNumber: 132,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg border p-4 bg-muted/20",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "font-medium mb-3 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                    lineNumber: 219,
                                                    columnNumber: 17
                                                }, this),
                                                "Thông tin chi tiết"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                            lineNumber: 218,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 gap-x-6 gap-y-2 text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground",
                                                            children: "Mức đóng BHXH:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 224,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "tabular-nums",
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedPayslip.slip.totals.socialInsuranceBase)
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 225,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                    lineNumber: 223,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground",
                                                            children: "Thu nhập chịu thuế:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 230,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "tabular-nums",
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedPayslip.slip.totals.taxableIncome)
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 231,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                    lineNumber: 229,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground",
                                                            children: "Giảm trừ bản thân:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 236,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "tabular-nums",
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedPayslip.slip.totals.personalDeduction)
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 237,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                    lineNumber: 235,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground",
                                                            children: [
                                                                "Giảm trừ NPT (",
                                                                selectedPayslip.slip.totals.numberOfDependents,
                                                                "):"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 242,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "tabular-nums",
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedPayslip.slip.totals.dependentDeduction)
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 245,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                    lineNumber: 241,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                            lineNumber: 222,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                    lineNumber: 217,
                                    columnNumber: 13
                                }, this),
                                selectedPayslip.slip.components && selectedPayslip.slip.components.filter((c)=>c.category === 'contribution').length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg border p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "font-medium text-blue-700 mb-3 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                    lineNumber: 258,
                                                    columnNumber: 21
                                                }, this),
                                                "Các khoản đóng góp"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                            lineNumber: 257,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2 text-sm",
                                            children: selectedPayslip.slip.components.filter((c)=>c.category === 'contribution').map((comp, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between py-1 border-b border-dashed last:border-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-muted-foreground",
                                                            children: comp.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 269,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium tabular-nums",
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(comp.amount)
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                            lineNumber: 270,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, idx, true, {
                                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                                    lineNumber: 265,
                                                    columnNumber: 25
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                            lineNumber: 261,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                    lineNumber: 256,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                            lineNumber: 90,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border-2 border-primary/30 p-4 bg-primary/5",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-lg font-semibold",
                                        children: "THỰC LĨNH"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                        lineNumber: 283,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-2xl font-bold text-primary tabular-nums",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(selectedPayslip.slip.totals.netPay)
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                        lineNumber: 284,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                lineNumber: 282,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                            lineNumber: 281,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between gap-2 pt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payroll$2f$components$2f$payslip$2d$print$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PayslipPrintButton"], {
                                    payslipData: selectedPayslip.slip,
                                    batchData: selectedPayslip.batch,
                                    variant: "outline",
                                    className: "flex-1"
                                }, void 0, false, {
                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                    lineNumber: 291,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "default",
                                    className: "flex-1",
                                    onClick: ()=>{
                                        onOpenChange(false);
                                        if (selectedPayslip.batch?.systemId) {
                                            onViewPayroll(selectedPayslip.batch.systemId);
                                        }
                                    },
                                    children: "Xem bảng lương"
                                }, void 0, false, {
                                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                                    lineNumber: 297,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                            lineNumber: 290,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/employees/detail/PayslipDetailDialog.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_c = PayslipDetailDialog;
var _c;
__turbopack_context__.k.register(_c, "PayslipDetailDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/employees/detail/AttendanceDetailDialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttendanceDetailDialog",
    ()=>AttendanceDetailDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function AttendanceDetailDialog({ open, onOpenChange, selectedAttendance, employee, onPrintSingle }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    if (!selectedAttendance) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "max-w-lg",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                    lineNumber: 46,
                                    columnNumber: 13
                                }, this),
                                "Chi tiết chấm công"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: [
                                selectedAttendance?.monthLabel,
                                " -",
                                ' ',
                                selectedAttendance?.locked ? 'Đã khóa' : 'Chưa khóa'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-4 text-sm border rounded-lg p-4 bg-muted/30",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Nhân viên:"
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 59,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium",
                                            children: employee.fullName
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 60,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                    lineNumber: 58,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Mã NV:"
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 63,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-mono",
                                            children: employee.id
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 64,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                    lineNumber: 62,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Kỳ chấm công:"
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 67,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium",
                                            children: selectedAttendance.monthLabel
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 68,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                    lineNumber: 66,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-muted-foreground",
                                            children: "Trạng thái:"
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 71,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                            variant: selectedAttendance.locked ? 'default' : 'outline',
                                            className: selectedAttendance.locked ? 'bg-green-600' : '',
                                            children: selectedAttendance.locked ? 'Đã khóa' : 'Chưa khóa'
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 72,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-3 gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center p-3 rounded-lg bg-green-50 dark:bg-green-950 border",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-2xl font-bold text-green-600",
                                            children: selectedAttendance.workDays
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 84,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-muted-foreground",
                                            children: "Ngày công"
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 87,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-2xl font-bold text-blue-600",
                                            children: selectedAttendance.leaveDays
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 90,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-muted-foreground",
                                            children: "Nghỉ phép"
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 93,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                    lineNumber: 89,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center p-3 rounded-lg bg-red-50 dark:bg-red-950 border",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-2xl font-bold text-destructive",
                                            children: selectedAttendance.absentDays
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 96,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-muted-foreground",
                                            children: "Vắng"
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 99,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                    lineNumber: 95,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950 border",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-2xl font-bold text-orange-600",
                                            children: selectedAttendance.lateArrivals
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 102,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-muted-foreground",
                                            children: "Đi trễ"
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 105,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950 border",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-2xl font-bold text-orange-600",
                                            children: selectedAttendance.earlyDepartures
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 108,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-muted-foreground",
                                            children: "Về sớm"
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 111,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                    lineNumber: 107,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950 border",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-2xl font-bold text-purple-600",
                                            children: selectedAttendance.otHours
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 114,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-muted-foreground",
                                            children: "Giờ làm thêm"
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 117,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                    lineNumber: 113,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                            lineNumber: 82,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between gap-2 pt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    className: "flex-1",
                                    onClick: ()=>onPrintSingle(selectedAttendance),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                            className: "mr-2 h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 128,
                                            columnNumber: 15
                                        }, this),
                                        "In phiếu"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "default",
                                    className: "flex-1",
                                    onClick: ()=>{
                                        onOpenChange(false);
                                        router.push(`/attendance?month=${selectedAttendance.monthKey}`);
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                            className: "mr-2 h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                            lineNumber: 139,
                                            columnNumber: 15
                                        }, this),
                                        "Xem bảng chấm công"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                                    lineNumber: 131,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                            lineNumber: 122,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/employees/detail/AttendanceDetailDialog.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_s(AttendanceDetailDialog, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AttendanceDetailDialog;
var _c;
__turbopack_context__.k.register(_c, "AttendanceDetailDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/employees/detail/index.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * Employee Detail Components
 * 
 * This barrel file exports all components related to employee detail page
 */ // Types and utilities
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/detail/types.ts [app-client] (ecmascript)");
// Dialog components
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$PayslipDetailDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/detail/PayslipDetailDialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$AttendanceDetailDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/detail/AttendanceDetailDialog.tsx [app-client] (ecmascript)"); // Note: PayrollTabContent was considered but not extracted due to tight coupling
 // with component state (columns depend on callbacks like onPrintSingle, etc.)
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/employees/components/detail-page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EmployeeDetailPage",
    ()=>EmployeeDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/xlsx/xlsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/hooks/use-all-branches.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$employee$2d$comp$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/employee-comp-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$employees$2f$employee$2d$settings$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/employees/employee-settings-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$attendance$2d$snapshot$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/attendance-snapshot-service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$attendance$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/attendance/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payroll$2f$payroll$2d$batch$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payroll/payroll-batch-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payroll$2f$components$2f$status$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payroll/components/status-badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/router.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-print.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$store$2d$info$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/store-info/store-info-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$departments$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/departments/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$payroll$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print/payroll-print-helper.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$payroll$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/payroll.mapper.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$attendance$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print/attendance-print-helper.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$attendance$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/attendance.mapper.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$penalty$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print/penalty-print-helper.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$penalty$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/penalty.mapper.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$leave$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print/leave-print-helper.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$leave$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/leave.mapper.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Comments$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Comments.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$comments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-comments.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ActivityHistory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ActivityHistory.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/briefcase.js [app-client] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/info-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$stats$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/stats-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tabs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$related$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/related-data-table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$penalties$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/penalties/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$leaves$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/leaves/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$tasks$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/tasks/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$components$2f$employee$2d$documents$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/components/employee-documents.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$components$2f$employee$2d$account$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/components/employee-account-tab.tsx [app-client] (ecmascript)");
// Import extracted components from detail folder
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$index$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/employees/detail/index.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$PayslipDetailDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/detail/PayslipDetailDialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$AttendanceDetailDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/detail/AttendanceDetailDialog.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const formatCurrency = (value)=>{
    if (typeof value !== 'number') return '-';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};
const formatMonthLabel = (monthKey)=>{
    if (!monthKey) return '—';
    const [year, month] = monthKey.split('-');
    return `Tháng ${month}/${year}`;
};
const formatDateDisplay = (dateString)=>{
    if (!dateString) return '-';
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateCustom"])(new Date(dateString), "dd/MM/yyyy");
};
/**
 * Format EmployeeAddress thành chuỗi hiển thị
 * - 3-cấp: "123 ABC, Quận 7, Phường Tân Phú, TP.HCM" (đầy đủ District + Ward)
 * - 2-cấp: "123 ABC, Phường Tân Phú, TP.HCM" (chỉ Ward, bỏ District)
 */ const formatAddressDisplay = (addr)=>{
    if (!addr) return '-';
    const { street, ward, district, province, inputLevel } = addr;
    if (inputLevel === '3-level') {
        // 3-cấp: Hiển thị District + Ward
        return [
            street,
            district,
            ward,
            province
        ].filter(Boolean).join(', ') || '-';
    } else {
        // 2-cấp: Chỉ hiển thị Ward (bỏ District)
        return [
            street,
            ward,
            province
        ].filter(Boolean).join(', ') || '-';
    }
};
const penaltyStatusVariants = {
    "Chưa thanh toán": "warning",
    "Đã thanh toán": "success",
    "Đã hủy": "secondary"
};
// REMOVED: Internal task status constants
// const internalTaskStatusNames: Record<InternalTaskStatus, string> = { 'To Do': 'Cần làm', 'In Progress': 'Đang làm', 'Done': 'Hoàn thành' };
// const internalTaskStatusVariants: Record<InternalTaskStatus, "default" | "secondary" | "warning" | "success"> = {
//     'To Do': "secondary", 'In Progress': "warning", 'Done': "success"
// };
const leaveStatusVariants = {
    "Chờ duyệt": "warning",
    "Đã duyệt": "success",
    "Đã từ chối": "destructive"
};
const employmentStatusBadgeVariants = {
    "Đang làm việc": "default",
    "Tạm nghỉ": "secondary",
    "Đã nghỉ việc": "destructive"
};
const renderEmploymentStatusBadge = (status)=>{
    if (!status) return undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
        variant: employmentStatusBadgeVariants[status] ?? "secondary",
        children: status
    }, void 0, false, {
        fileName: "[project]/features/employees/components/detail-page.tsx",
        lineNumber: 159,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const PlaceholderTabContent = ({ title })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: "mt-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
            className: "p-0",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-40 items-center justify-center rounded-lg border-dashed",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center gap-1 text-center text-muted-foreground",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-h4 font-semibold tracking-tight",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 170,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm",
                            children: "Chức năng đang được phát triển."
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 171,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/employees/components/detail-page.tsx",
                    lineNumber: 169,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/features/employees/components/detail-page.tsx",
                lineNumber: 168,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/features/employees/components/detail-page.tsx",
            lineNumber: 167,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/features/employees/components/detail-page.tsx",
        lineNumber: 166,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c = PlaceholderTabContent;
function EmployeeDetailPage() {
    _s();
    const { systemId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { findById } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeStore"])();
    const { data: branches } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllBranches"])();
    const { employee: authEmployee } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const getPayrollProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$employee$2d$comp$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeCompStore"])({
        "EmployeeDetailPage.useEmployeeCompStore[getPayrollProfile]": (state)=>state.getPayrollProfile
    }["EmployeeDetailPage.useEmployeeCompStore[getPayrollProfile]"]);
    const { settings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$employees$2f$employee$2d$settings$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeSettingsStore"])();
    const { info: storeInfo } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$store$2d$info$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStoreInfoStore"])();
    const { data: _departments } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$departments$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDepartmentStore"])();
    const { print, printMultiple } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrint"])();
    // FIX: Split selectors to avoid object recreation on every render
    const lockedMonths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$attendance$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAttendanceStore"])({
        "EmployeeDetailPage.useAttendanceStore[lockedMonths]": (state)=>state.lockedMonths
    }["EmployeeDetailPage.useAttendanceStore[lockedMonths]"]);
    const attendanceData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$attendance$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAttendanceStore"])({
        "EmployeeDetailPage.useAttendanceStore[attendanceData]": (state)=>state.attendanceData
    }["EmployeeDetailPage.useAttendanceStore[attendanceData]"]);
    const employee = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[employee]": ()=>systemId ? findById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(systemId)) : null
    }["EmployeeDetailPage.useMemo[employee]"], [
        systemId,
        findById
    ]);
    // Comments from database
    const { comments: dbComments, addComment: dbAddComment, deleteComment: dbDeleteComment } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$comments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComments"])('employee', systemId || '');
    const comments = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[comments]": ()=>dbComments.map({
                "EmployeeDetailPage.useMemo[comments]": (c)=>({
                        id: c.systemId,
                        content: c.content,
                        author: {
                            systemId: c.createdBy || 'system',
                            name: c.createdByName || 'Hệ thống'
                        },
                        createdAt: c.createdAt,
                        updatedAt: c.updatedAt,
                        attachments: c.attachments
                    })
            }["EmployeeDetailPage.useMemo[comments]"])
    }["EmployeeDetailPage.useMemo[comments]"], [
        dbComments
    ]);
    const handleAddComment = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "EmployeeDetailPage.useCallback[handleAddComment]": (content, attachments, _parentId)=>{
            dbAddComment(content, attachments || []);
        }
    }["EmployeeDetailPage.useCallback[handleAddComment]"], [
        dbAddComment
    ]);
    const handleUpdateComment = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "EmployeeDetailPage.useCallback[handleUpdateComment]": (_commentId, _content)=>{
            console.warn('Update comment not yet implemented in database');
        }
    }["EmployeeDetailPage.useCallback[handleUpdateComment]"], []);
    const handleDeleteComment = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "EmployeeDetailPage.useCallback[handleDeleteComment]": (commentId)=>{
            dbDeleteComment(commentId);
        }
    }["EmployeeDetailPage.useCallback[handleDeleteComment]"], [
        dbDeleteComment
    ]);
    const commentCurrentUser = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[commentCurrentUser]": ()=>({
                systemId: authEmployee?.systemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(authEmployee.systemId) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('system'),
                name: authEmployee?.fullName || 'Hệ thống'
            })
    }["EmployeeDetailPage.useMemo[commentCurrentUser]"], [
        authEmployee
    ]);
    // Fetch data for tabs
    const { data: allPenalties } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$penalties$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePenaltyStore"])();
    const { data: allTasks } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$tasks$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTaskStore"])();
    const { data: allLeaveRequests } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$leaves$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLeaveStore"])();
    const employeePenalties = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[employeePenalties]": ()=>allPenalties.filter({
                "EmployeeDetailPage.useMemo[employeePenalties]": (p)=>p.employeeSystemId === employee?.systemId
            }["EmployeeDetailPage.useMemo[employeePenalties]"])
    }["EmployeeDetailPage.useMemo[employeePenalties]"], [
        allPenalties,
        employee?.systemId
    ]);
    // Lọc công việc được giao cho nhân viên này (kiểm tra trong assignees array)
    const employeeTasks = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[employeeTasks]": ()=>{
            if (!employee?.systemId) return [];
            return allTasks.filter({
                "EmployeeDetailPage.useMemo[employeeTasks]": (task)=>task.assignees?.some({
                        "EmployeeDetailPage.useMemo[employeeTasks]": (a)=>a.employeeSystemId === employee.systemId
                    }["EmployeeDetailPage.useMemo[employeeTasks]"]) || task.assigneeId === employee.systemId
            }["EmployeeDetailPage.useMemo[employeeTasks]"]).map({
                "EmployeeDetailPage.useMemo[employeeTasks]": (task)=>({
                        systemId: task.systemId,
                        title: task.title,
                        type: task.priority || 'Trung bình',
                        dueDate: task.dueDate,
                        statusVariant: task.status === 'Hoàn thành' ? 'success' : task.status === 'Đang thực hiện' ? 'default' : task.status === 'Đang chờ' ? 'warning' : task.status === 'Đã hủy' ? 'destructive' : 'secondary',
                        statusName: task.status,
                        link: `/tasks/${task.systemId}`
                    })
            }["EmployeeDetailPage.useMemo[employeeTasks]"]);
        }
    }["EmployeeDetailPage.useMemo[employeeTasks]"], [
        allTasks,
        employee?.systemId
    ]);
    const employeeLeaves = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[employeeLeaves]": ()=>allLeaveRequests.filter({
                "EmployeeDetailPage.useMemo[employeeLeaves]": (l)=>l.employeeSystemId === employee?.systemId
            }["EmployeeDetailPage.useMemo[employeeLeaves]"]).sort({
                "EmployeeDetailPage.useMemo[employeeLeaves]": (a, b)=>new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
            }["EmployeeDetailPage.useMemo[employeeLeaves]"])
    }["EmployeeDetailPage.useMemo[employeeLeaves]"], [
        allLeaveRequests,
        employee?.systemId
    ]);
    const branchName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[branchName]": ()=>{
            if (!employee?.branchSystemId) return 'Chưa phân công';
            return branches.find({
                "EmployeeDetailPage.useMemo[branchName]": (b)=>b.systemId === employee.branchSystemId
            }["EmployeeDetailPage.useMemo[branchName]"])?.name || 'Không tìm thấy';
        }
    }["EmployeeDetailPage.useMemo[branchName]"], [
        employee,
        branches
    ]);
    const payrollProfile = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[payrollProfile]": ()=>employee ? getPayrollProfile(employee.systemId) : null
    }["EmployeeDetailPage.useMemo[payrollProfile]"], [
        employee,
        getPayrollProfile
    ]);
    const payrollShift = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[payrollShift]": ()=>{
            if (!payrollProfile?.workShiftSystemId) {
                return null;
            }
            return settings.workShifts.find({
                "EmployeeDetailPage.useMemo[payrollShift]": (shift)=>shift.systemId === payrollProfile.workShiftSystemId
            }["EmployeeDetailPage.useMemo[payrollShift]"]) ?? null;
        }
    }["EmployeeDetailPage.useMemo[payrollShift]"], [
        payrollProfile?.workShiftSystemId,
        settings.workShifts
    ]);
    const payrollComponents = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[payrollComponents]": ()=>{
            if (!payrollProfile) {
                return [];
            }
            return settings.salaryComponents.filter({
                "EmployeeDetailPage.useMemo[payrollComponents]": (component)=>payrollProfile.salaryComponentSystemIds.includes(component.systemId)
            }["EmployeeDetailPage.useMemo[payrollComponents]"]);
        }
    }["EmployeeDetailPage.useMemo[payrollComponents]"], [
        payrollProfile,
        settings.salaryComponents
    ]);
    const _attendanceSnapshot = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[_attendanceSnapshot]": ()=>{
            if (!employee) {
                return null;
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$attendance$2d$snapshot$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["attendanceSnapshotService"].getLatestLockedSnapshot(employee.systemId);
        }
    }["EmployeeDetailPage.useMemo[_attendanceSnapshot]"], [
        employee
    ]);
    // ✅ Lịch sử chấm công của nhân viên - lấy tất cả các tháng có dữ liệu
    const attendanceHistory = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[attendanceHistory]": ()=>{
            if (!employee) return [];
            const history = [];
            // Duyệt qua tất cả các tháng có dữ liệu
            Object.entries(attendanceData).forEach({
                "EmployeeDetailPage.useMemo[attendanceHistory]": ([monthKey, rows])=>{
                    const employeeRow = rows?.find({
                        "EmployeeDetailPage.useMemo[attendanceHistory]": (r)=>r.employeeSystemId === employee.systemId
                    }["EmployeeDetailPage.useMemo[attendanceHistory]"]);
                    if (employeeRow) {
                        const [year, month] = monthKey.split('-');
                        history.push({
                            systemId: `${monthKey}-${employee.systemId}`,
                            monthKey,
                            monthLabel: `Tháng ${month}/${year}`,
                            workDays: employeeRow.workDays ?? 0,
                            leaveDays: employeeRow.leaveDays ?? 0,
                            absentDays: employeeRow.absentDays ?? 0,
                            lateArrivals: employeeRow.lateArrivals ?? 0,
                            earlyDepartures: employeeRow.earlyDepartures ?? 0,
                            otHours: employeeRow.otHours ?? 0,
                            locked: Boolean(lockedMonths[monthKey])
                        });
                    }
                }
            }["EmployeeDetailPage.useMemo[attendanceHistory]"]);
            // Sắp xếp theo tháng mới nhất
            return history.sort({
                "EmployeeDetailPage.useMemo[attendanceHistory]": (a, b)=>b.monthKey.localeCompare(a.monthKey)
            }["EmployeeDetailPage.useMemo[attendanceHistory]"]);
        }
    }["EmployeeDetailPage.useMemo[attendanceHistory]"], [
        employee,
        attendanceData,
        lockedMonths
    ]);
    // ✅ Handler in phiếu chấm công đơn lẻ
    const handlePrintSingleAttendance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "EmployeeDetailPage.useCallback[handlePrintSingleAttendance]": (row)=>{
            if (!employee) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không thể in', {
                    description: 'Không tìm thấy dữ liệu nhân viên.'
                });
                return;
            }
            // Lấy dữ liệu chấm công của tháng này
            const monthRows = attendanceData[row.monthKey];
            const employeeRow = monthRows?.find({
                "EmployeeDetailPage.useCallback[handlePrintSingleAttendance]": (r)=>r.employeeSystemId === employee.systemId
            }["EmployeeDetailPage.useCallback[handlePrintSingleAttendance]"]);
            if (!employeeRow) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không thể in', {
                    description: 'Không tìm thấy dữ liệu chấm công.'
                });
                return;
            }
            const storeSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$attendance$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo);
            const attendanceForPrint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$attendance$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertAttendanceDetailForPrint"])(row.monthKey, employeeRow);
            print('attendance', {
                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$attendance$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapAttendanceDetailToPrintData"])(attendanceForPrint, storeSettings),
                lineItems: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$attendance$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapAttendanceDetailLineItems"])(attendanceForPrint.dailyDetails)
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đang in phiếu chấm công...', {
                description: `${employee.fullName} - ${row.monthLabel}`
            });
        }
    }["EmployeeDetailPage.useCallback[handlePrintSingleAttendance]"], [
        employee,
        attendanceData,
        storeInfo,
        print
    ]);
    // ✅ Columns cho bảng chấm công
    const attendanceColumns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[attendanceColumns]": ()=>[
                {
                    id: 'monthLabel',
                    accessorKey: 'monthLabel',
                    header: 'Kỳ chấm công',
                    size: 130,
                    cell: {
                        "EmployeeDetailPage.useMemo[attendanceColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: row.monthLabel
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 375,
                                columnNumber: 110
                            }, this)
                    }["EmployeeDetailPage.useMemo[attendanceColumns]"],
                    meta: {
                        displayName: 'Kỳ chấm công'
                    }
                },
                {
                    id: 'locked',
                    accessorKey: 'locked',
                    header: 'Trạng thái',
                    size: 100,
                    cell: {
                        "EmployeeDetailPage.useMemo[attendanceColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: row.locked ? 'default' : 'outline',
                                className: row.locked ? 'bg-green-600' : '',
                                children: row.locked ? 'Đã khóa' : 'Chưa khóa'
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 377,
                                columnNumber: 13
                            }, this)
                    }["EmployeeDetailPage.useMemo[attendanceColumns]"],
                    meta: {
                        displayName: 'Trạng thái'
                    }
                },
                {
                    id: 'workDays',
                    accessorKey: 'workDays',
                    header: {
                        "EmployeeDetailPage.useMemo[attendanceColumns]": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-right w-full block",
                                children: "Ngày công"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 381,
                                columnNumber: 66
                            }, this)
                    }["EmployeeDetailPage.useMemo[attendanceColumns]"],
                    size: 90,
                    cell: {
                        "EmployeeDetailPage.useMemo[attendanceColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-right block tabular-nums font-medium text-green-600",
                                children: row.workDays
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 381,
                                columnNumber: 155
                            }, this)
                    }["EmployeeDetailPage.useMemo[attendanceColumns]"],
                    meta: {
                        displayName: 'Ngày công'
                    }
                },
                {
                    id: 'leaveDays',
                    accessorKey: 'leaveDays',
                    header: {
                        "EmployeeDetailPage.useMemo[attendanceColumns]": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-right w-full block",
                                children: "Nghỉ phép"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 382,
                                columnNumber: 68
                            }, this)
                    }["EmployeeDetailPage.useMemo[attendanceColumns]"],
                    size: 90,
                    cell: {
                        "EmployeeDetailPage.useMemo[attendanceColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-right block tabular-nums text-blue-600",
                                children: row.leaveDays
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 382,
                                columnNumber: 157
                            }, this)
                    }["EmployeeDetailPage.useMemo[attendanceColumns]"],
                    meta: {
                        displayName: 'Nghỉ phép'
                    }
                },
                {
                    id: 'absentDays',
                    accessorKey: 'absentDays',
                    header: {
                        "EmployeeDetailPage.useMemo[attendanceColumns]": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-right w-full block",
                                children: "Vắng"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 383,
                                columnNumber: 70
                            }, this)
                    }["EmployeeDetailPage.useMemo[attendanceColumns]"],
                    size: 80,
                    cell: {
                        "EmployeeDetailPage.useMemo[attendanceColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-right block tabular-nums ${row.absentDays > 0 ? 'text-destructive font-medium' : 'text-muted-foreground'}`,
                                children: row.absentDays
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 383,
                                columnNumber: 154
                            }, this)
                    }["EmployeeDetailPage.useMemo[attendanceColumns]"],
                    meta: {
                        displayName: 'Vắng'
                    }
                },
                {
                    id: 'lateArrivals',
                    accessorKey: 'lateArrivals',
                    header: {
                        "EmployeeDetailPage.useMemo[attendanceColumns]": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-right w-full block",
                                children: "Đi trễ"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 384,
                                columnNumber: 74
                            }, this)
                    }["EmployeeDetailPage.useMemo[attendanceColumns]"],
                    size: 80,
                    cell: {
                        "EmployeeDetailPage.useMemo[attendanceColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-right block tabular-nums ${row.lateArrivals > 0 ? 'text-orange-600' : 'text-muted-foreground'}`,
                                children: row.lateArrivals
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 384,
                                columnNumber: 160
                            }, this)
                    }["EmployeeDetailPage.useMemo[attendanceColumns]"],
                    meta: {
                        displayName: 'Đi trễ'
                    }
                },
                {
                    id: 'earlyDepartures',
                    accessorKey: 'earlyDepartures',
                    header: {
                        "EmployeeDetailPage.useMemo[attendanceColumns]": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-right w-full block",
                                children: "Về sớm"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 385,
                                columnNumber: 80
                            }, this)
                    }["EmployeeDetailPage.useMemo[attendanceColumns]"],
                    size: 80,
                    cell: {
                        "EmployeeDetailPage.useMemo[attendanceColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-right block tabular-nums ${row.earlyDepartures > 0 ? 'text-orange-600' : 'text-muted-foreground'}`,
                                children: row.earlyDepartures
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 385,
                                columnNumber: 166
                            }, this)
                    }["EmployeeDetailPage.useMemo[attendanceColumns]"],
                    meta: {
                        displayName: 'Về sớm'
                    }
                },
                {
                    id: 'otHours',
                    accessorKey: 'otHours',
                    header: {
                        "EmployeeDetailPage.useMemo[attendanceColumns]": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-right w-full block",
                                children: "Làm thêm"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 386,
                                columnNumber: 64
                            }, this)
                    }["EmployeeDetailPage.useMemo[attendanceColumns]"],
                    size: 80,
                    cell: {
                        "EmployeeDetailPage.useMemo[attendanceColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-right block tabular-nums ${row.otHours > 0 ? 'text-purple-600 font-medium' : 'text-muted-foreground'}`,
                                children: [
                                    row.otHours,
                                    "h"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 386,
                                columnNumber: 152
                            }, this)
                    }["EmployeeDetailPage.useMemo[attendanceColumns]"],
                    meta: {
                        displayName: 'Giờ làm thêm'
                    }
                },
                {
                    id: 'actions',
                    header: '',
                    size: 50,
                    cell: {
                        "EmployeeDetailPage.useMemo[attendanceColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: {
                                    "EmployeeDetailPage.useMemo[attendanceColumns]": (e)=>e.stopPropagation()
                                }["EmployeeDetailPage.useMemo[attendanceColumns]"],
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "icon",
                                                className: "h-8 w-8",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 396,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "sr-only",
                                                        children: "Mở menu"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 397,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 395,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                            lineNumber: 394,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                            align: "end",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: {
                                                        "EmployeeDetailPage.useMemo[attendanceColumns]": ()=>{
                                                            setSelectedAttendance(row);
                                                            setIsAttendanceDialogOpen(true);
                                                        }
                                                    }["EmployeeDetailPage.useMemo[attendanceColumns]"],
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 405,
                                                            columnNumber: 33
                                                        }, this),
                                                        "Xem chi tiết"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 401,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: {
                                                        "EmployeeDetailPage.useMemo[attendanceColumns]": ()=>handlePrintSingleAttendance(row)
                                                    }["EmployeeDetailPage.useMemo[attendanceColumns]"],
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 409,
                                                            columnNumber: 33
                                                        }, this),
                                                        "In phiếu chấm công"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 408,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: {
                                                        "EmployeeDetailPage.useMemo[attendanceColumns]": ()=>router.push(`/attendance?month=${row.monthKey}`)
                                                    }["EmployeeDetailPage.useMemo[attendanceColumns]"],
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 413,
                                                            columnNumber: 33
                                                        }, this),
                                                        "Xem bảng chấm công"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 412,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                            lineNumber: 400,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                    lineNumber: 393,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 392,
                                columnNumber: 17
                            }, this)
                    }["EmployeeDetailPage.useMemo[attendanceColumns]"],
                    meta: {
                        displayName: 'Thao tác',
                        sticky: 'right'
                    }
                }
            ]
    }["EmployeeDetailPage.useMemo[attendanceColumns]"], [
        handlePrintSingleAttendance,
        router
    ]);
    // ✅ Custom bulk actions cho bảng chấm công
    const attendanceBulkActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[attendanceBulkActions]": ()=>{
            const handlePrintAttendances = {
                "EmployeeDetailPage.useMemo[attendanceBulkActions].handlePrintAttendances": (rows)=>{
                    if (rows.length === 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Chưa chọn kỳ chấm công nào');
                        return;
                    }
                    const storeSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$attendance$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo);
                    const printOptionsList = rows.map({
                        "EmployeeDetailPage.useMemo[attendanceBulkActions].handlePrintAttendances.printOptionsList": (row)=>{
                            const monthRows = attendanceData[row.monthKey];
                            const employeeRow = monthRows?.find({
                                "EmployeeDetailPage.useMemo[attendanceBulkActions].handlePrintAttendances.printOptionsList": (r)=>r.employeeSystemId === employee?.systemId
                            }["EmployeeDetailPage.useMemo[attendanceBulkActions].handlePrintAttendances.printOptionsList"]);
                            if (!employeeRow) return null;
                            const attendanceForPrint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$attendance$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertAttendanceDetailForPrint"])(row.monthKey, employeeRow);
                            return {
                                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$attendance$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapAttendanceDetailToPrintData"])(attendanceForPrint, storeSettings),
                                lineItems: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$attendance$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapAttendanceDetailLineItems"])(attendanceForPrint.dailyDetails)
                            };
                        }
                    }["EmployeeDetailPage.useMemo[attendanceBulkActions].handlePrintAttendances.printOptionsList"]).filter(Boolean);
                    if (printOptionsList.length === 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy dữ liệu chấm công');
                        return;
                    }
                    printMultiple('attendance', printOptionsList);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đang in ${printOptionsList.length} phiếu chấm công...`);
                }
            }["EmployeeDetailPage.useMemo[attendanceBulkActions].handlePrintAttendances"];
            const handleExportExcel = {
                "EmployeeDetailPage.useMemo[attendanceBulkActions].handleExportExcel": (rows)=>{
                    if (rows.length === 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Chưa chọn dữ liệu nào');
                        return;
                    }
                    const headers = [
                        'Kỳ chấm công',
                        'Trạng thái',
                        'Ngày công',
                        'Nghỉ phép',
                        'Vắng',
                        'Đi trễ',
                        'Về sớm',
                        'Giờ làm thêm'
                    ];
                    const mappedData = rows.map({
                        "EmployeeDetailPage.useMemo[attendanceBulkActions].handleExportExcel.mappedData": (row)=>({
                                'Kỳ chấm công': row.monthLabel,
                                'Trạng thái': row.locked ? 'Đã khóa' : 'Chưa khóa',
                                'Ngày công': row.workDays,
                                'Nghỉ phép': row.leaveDays,
                                'Vắng': row.absentDays,
                                'Đi trễ': row.lateArrivals,
                                'Về sớm': row.earlyDepartures,
                                'Giờ làm thêm': row.otHours
                            })
                    }["EmployeeDetailPage.useMemo[attendanceBulkActions].handleExportExcel.mappedData"]);
                    const ws = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(mappedData, {
                        header: headers
                    });
                    const wb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_new();
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, ws, 'ChamCong');
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeFile"](wb, `ChamCong_${employee?.id || 'NV'}_selected.xlsx`);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã xuất ${rows.length} dòng ra Excel`);
                }
            }["EmployeeDetailPage.useMemo[attendanceBulkActions].handleExportExcel"];
            return [
                {
                    label: 'In phiếu chấm công',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"],
                    onSelect: handlePrintAttendances
                },
                {
                    label: 'Xuất Excel',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"],
                    onSelect: handleExportExcel
                }
            ];
        }
    }["EmployeeDetailPage.useMemo[attendanceBulkActions]"], [
        employee,
        attendanceData,
        storeInfo,
        printMultiple
    ]);
    // ✅ Custom bulk actions cho tab Phiếu phạt
    const penaltyBulkActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[penaltyBulkActions]": ()=>{
            const handlePrintPenalties = {
                "EmployeeDetailPage.useMemo[penaltyBulkActions].handlePrintPenalties": (rows)=>{
                    if (rows.length === 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Chưa chọn phiếu phạt nào');
                        return;
                    }
                    const penaltyStoreSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$penalty$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo);
                    const printOptionsList = rows.map({
                        "EmployeeDetailPage.useMemo[penaltyBulkActions].handlePrintPenalties.printOptionsList": (row)=>{
                            const penaltyForPrint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$penalty$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertPenaltyForPrint"])(row, {
                                employee
                            });
                            return {
                                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$penalty$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapPenaltyToPrintData"])(penaltyForPrint, penaltyStoreSettings),
                                lineItems: []
                            };
                        }
                    }["EmployeeDetailPage.useMemo[penaltyBulkActions].handlePrintPenalties.printOptionsList"]);
                    printMultiple('penalty', printOptionsList);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đang in ${printOptionsList.length} phiếu phạt...`);
                }
            }["EmployeeDetailPage.useMemo[penaltyBulkActions].handlePrintPenalties"];
            const handleExportExcel = {
                "EmployeeDetailPage.useMemo[penaltyBulkActions].handleExportExcel": (rows)=>{
                    if (rows.length === 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Chưa chọn phiếu phạt nào');
                        return;
                    }
                    const headers = [
                        'Mã phiếu',
                        'Lý do',
                        'Ngày lập',
                        'Trạng thái',
                        'Số tiền'
                    ];
                    const mappedData = rows.map({
                        "EmployeeDetailPage.useMemo[penaltyBulkActions].handleExportExcel.mappedData": (row)=>({
                                'Mã phiếu': row.id,
                                'Lý do': row.reason,
                                'Ngày lập': formatDateDisplay(row.issueDate),
                                'Trạng thái': row.status,
                                'Số tiền': row.amount
                            })
                    }["EmployeeDetailPage.useMemo[penaltyBulkActions].handleExportExcel.mappedData"]);
                    const ws = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(mappedData, {
                        header: headers
                    });
                    const wb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_new();
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, ws, 'PhieuPhat');
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeFile"](wb, `PhieuPhat_${employee?.id || 'NV'}_selected.xlsx`);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã xuất ${rows.length} phiếu phạt ra Excel`);
                }
            }["EmployeeDetailPage.useMemo[penaltyBulkActions].handleExportExcel"];
            return [
                {
                    label: 'In phiếu phạt',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"],
                    onSelect: handlePrintPenalties
                },
                {
                    label: 'Xuất Excel',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"],
                    onSelect: handleExportExcel
                }
            ];
        }
    }["EmployeeDetailPage.useMemo[penaltyBulkActions]"], [
        employee,
        storeInfo,
        printMultiple
    ]);
    // ✅ Custom bulk actions cho tab Lịch sử nghỉ phép
    const leaveBulkActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[leaveBulkActions]": ()=>{
            const handlePrintLeaves = {
                "EmployeeDetailPage.useMemo[leaveBulkActions].handlePrintLeaves": (rows)=>{
                    if (rows.length === 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Chưa chọn đơn nghỉ phép nào');
                        return;
                    }
                    const leaveStoreSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$leave$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo);
                    const printOptionsList = rows.map({
                        "EmployeeDetailPage.useMemo[leaveBulkActions].handlePrintLeaves.printOptionsList": (row)=>{
                            const leaveForPrint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$leave$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertLeaveForPrint"])(row, {
                                employee
                            });
                            return {
                                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$leave$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapLeaveToPrintData"])(leaveForPrint, leaveStoreSettings),
                                lineItems: []
                            };
                        }
                    }["EmployeeDetailPage.useMemo[leaveBulkActions].handlePrintLeaves.printOptionsList"]);
                    printMultiple('leave', printOptionsList);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đang in ${printOptionsList.length} đơn nghỉ phép...`);
                }
            }["EmployeeDetailPage.useMemo[leaveBulkActions].handlePrintLeaves"];
            const handleExportExcel = {
                "EmployeeDetailPage.useMemo[leaveBulkActions].handleExportExcel": (rows)=>{
                    if (rows.length === 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Chưa chọn đơn nghỉ phép nào');
                        return;
                    }
                    const headers = [
                        'Mã đơn',
                        'Loại phép',
                        'Từ ngày',
                        'Đến ngày',
                        'Số ngày',
                        'Lý do',
                        'Trạng thái'
                    ];
                    const mappedData = rows.map({
                        "EmployeeDetailPage.useMemo[leaveBulkActions].handleExportExcel.mappedData": (row)=>({
                                'Mã đơn': row.id,
                                'Loại phép': row.leaveTypeName,
                                'Từ ngày': formatDateDisplay(row.startDate),
                                'Đến ngày': formatDateDisplay(row.endDate),
                                'Số ngày': row.numberOfDays,
                                'Lý do': row.reason,
                                'Trạng thái': row.status
                            })
                    }["EmployeeDetailPage.useMemo[leaveBulkActions].handleExportExcel.mappedData"]);
                    const ws = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(mappedData, {
                        header: headers
                    });
                    const wb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_new();
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, ws, 'NghiPhep');
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeFile"](wb, `NghiPhep_${employee?.id || 'NV'}_selected.xlsx`);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã xuất ${rows.length} đơn nghỉ phép ra Excel`);
                }
            }["EmployeeDetailPage.useMemo[leaveBulkActions].handleExportExcel"];
            return [
                {
                    label: 'In đơn nghỉ phép',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"],
                    onSelect: handlePrintLeaves
                },
                {
                    label: 'Xuất Excel',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"],
                    onSelect: handleExportExcel
                }
            ];
        }
    }["EmployeeDetailPage.useMemo[leaveBulkActions]"], [
        employee,
        storeInfo,
        printMultiple
    ]);
    // ✅ Helper functions cho in đơn lẻ
    const handlePrintSinglePenalty = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "EmployeeDetailPage.useCallback[handlePrintSinglePenalty]": (row)=>{
            const penaltyStoreSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$penalty$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo);
            const penaltyForPrint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$penalty$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertPenaltyForPrint"])(row, {
                employee
            });
            print('penalty', {
                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$penalty$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapPenaltyToPrintData"])(penaltyForPrint, penaltyStoreSettings),
                lineItems: []
            });
        }
    }["EmployeeDetailPage.useCallback[handlePrintSinglePenalty]"], [
        employee,
        storeInfo,
        print
    ]);
    const handlePrintSingleLeave = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "EmployeeDetailPage.useCallback[handlePrintSingleLeave]": (row)=>{
            const leaveStoreSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$leave$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo);
            const leaveForPrint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$leave$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertLeaveForPrint"])(row, {
                employee
            });
            print('leave', {
                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$leave$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapLeaveToPrintData"])(leaveForPrint, leaveStoreSettings),
                lineItems: []
            });
        }
    }["EmployeeDetailPage.useCallback[handlePrintSingleLeave]"], [
        employee,
        storeInfo,
        print
    ]);
    const handleExportSinglePenalty = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "EmployeeDetailPage.useCallback[handleExportSinglePenalty]": (row)=>{
            const headers = [
                'Mã phiếu',
                'Lý do',
                'Ngày lập',
                'Trạng thái',
                'Số tiền'
            ];
            const mappedData = [
                {
                    'Mã phiếu': row.id,
                    'Lý do': row.reason,
                    'Ngày lập': formatDateDisplay(row.issueDate),
                    'Trạng thái': row.status,
                    'Số tiền': row.amount
                }
            ];
            const ws = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(mappedData, {
                header: headers
            });
            const wb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_new();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, ws, 'PhieuPhat');
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeFile"](wb, `PhieuPhat_${row.id}.xlsx`);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã xuất phiếu phạt ra Excel');
        }
    }["EmployeeDetailPage.useCallback[handleExportSinglePenalty]"], []);
    const handleExportSingleLeave = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "EmployeeDetailPage.useCallback[handleExportSingleLeave]": (row)=>{
            const headers = [
                'Mã đơn',
                'Loại phép',
                'Từ ngày',
                'Đến ngày',
                'Số ngày',
                'Lý do',
                'Trạng thái'
            ];
            const mappedData = [
                {
                    'Mã đơn': row.id,
                    'Loại phép': row.leaveTypeName,
                    'Từ ngày': formatDateDisplay(row.startDate),
                    'Đến ngày': formatDateDisplay(row.endDate),
                    'Số ngày': row.numberOfDays,
                    'Lý do': row.reason,
                    'Trạng thái': row.status
                }
            ];
            const ws = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(mappedData, {
                header: headers
            });
            const wb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_new();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, ws, 'NghiPhep');
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeFile"](wb, `NghiPhep_${row.id}.xlsx`);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã xuất đơn nghỉ phép ra Excel');
        }
    }["EmployeeDetailPage.useCallback[handleExportSingleLeave]"], []);
    // ✅ Dynamic columns cho Phiếu phạt (có action column)
    const penaltyColumns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[penaltyColumns]": ()=>[
                {
                    id: 'id',
                    accessorKey: 'id',
                    header: 'Mã Phiếu',
                    cell: {
                        "EmployeeDetailPage.useMemo[penaltyColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: row.id
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 666,
                                columnNumber: 79
                            }, this)
                    }["EmployeeDetailPage.useMemo[penaltyColumns]"],
                    meta: {
                        displayName: 'Mã Phiếu'
                    }
                },
                {
                    id: 'reason',
                    accessorKey: 'reason',
                    header: 'Lý do',
                    cell: {
                        "EmployeeDetailPage.useMemo[penaltyColumns]": ({ row })=>row.reason
                    }["EmployeeDetailPage.useMemo[penaltyColumns]"],
                    meta: {
                        displayName: 'Lý do'
                    }
                },
                {
                    id: 'issueDate',
                    accessorKey: 'issueDate',
                    header: 'Ngày',
                    cell: {
                        "EmployeeDetailPage.useMemo[penaltyColumns]": ({ row })=>formatDateDisplay(row.issueDate)
                    }["EmployeeDetailPage.useMemo[penaltyColumns]"],
                    meta: {
                        displayName: 'Ngày'
                    }
                },
                {
                    id: 'status',
                    accessorKey: 'status',
                    header: 'Trạng thái',
                    cell: {
                        "EmployeeDetailPage.useMemo[penaltyColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: penaltyStatusVariants[row.status],
                                children: row.status
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 669,
                                columnNumber: 89
                            }, this)
                    }["EmployeeDetailPage.useMemo[penaltyColumns]"],
                    meta: {
                        displayName: 'Trạng thái'
                    }
                },
                {
                    id: 'amount',
                    accessorKey: 'amount',
                    header: 'Số tiền',
                    cell: {
                        "EmployeeDetailPage.useMemo[penaltyColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-destructive font-semibold",
                                children: formatCurrency(row.amount)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 670,
                                columnNumber: 86
                            }, this)
                    }["EmployeeDetailPage.useMemo[penaltyColumns]"],
                    meta: {
                        displayName: 'Số tiền'
                    }
                },
                {
                    id: 'actions',
                    header: {
                        "EmployeeDetailPage.useMemo[penaltyColumns]": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: "Thao tác"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 673,
                                columnNumber: 27
                            }, this)
                    }["EmployeeDetailPage.useMemo[penaltyColumns]"],
                    cell: {
                        "EmployeeDetailPage.useMemo[penaltyColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "sm",
                                                className: "h-8 w-8 p-0",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 679,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 678,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                            lineNumber: 677,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                            align: "end",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: {
                                                        "EmployeeDetailPage.useMemo[penaltyColumns]": ()=>handlePrintSinglePenalty(row)
                                                    }["EmployeeDetailPage.useMemo[penaltyColumns]"],
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 684,
                                                            columnNumber: 33
                                                        }, this),
                                                        "In phiếu phạt"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 683,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: {
                                                        "EmployeeDetailPage.useMemo[penaltyColumns]": ()=>handleExportSinglePenalty(row)
                                                    }["EmployeeDetailPage.useMemo[penaltyColumns]"],
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 688,
                                                            columnNumber: 33
                                                        }, this),
                                                        "Xuất Excel"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 687,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: {
                                                        "EmployeeDetailPage.useMemo[penaltyColumns]": ()=>router.push(`/penalties/${row.systemId}`)
                                                    }["EmployeeDetailPage.useMemo[penaltyColumns]"],
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 692,
                                                            columnNumber: 33
                                                        }, this),
                                                        "Xem chi tiết"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 691,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                            lineNumber: 682,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                    lineNumber: 676,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 675,
                                columnNumber: 17
                            }, this)
                    }["EmployeeDetailPage.useMemo[penaltyColumns]"],
                    meta: {
                        displayName: 'Thao tác',
                        sticky: 'right'
                    }
                }
            ]
    }["EmployeeDetailPage.useMemo[penaltyColumns]"], [
        handlePrintSinglePenalty,
        handleExportSinglePenalty,
        router
    ]);
    // ✅ Dynamic columns cho Lịch sử nghỉ phép (có action column)
    const leaveColumns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[leaveColumns]": ()=>[
                {
                    id: 'id',
                    accessorKey: 'id',
                    header: 'Mã đơn',
                    cell: {
                        "EmployeeDetailPage.useMemo[leaveColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: row.id
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 705,
                                columnNumber: 77
                            }, this)
                    }["EmployeeDetailPage.useMemo[leaveColumns]"],
                    meta: {
                        displayName: 'Mã đơn'
                    }
                },
                {
                    id: 'leaveTypeName',
                    accessorKey: 'leaveTypeName',
                    header: 'Loại phép',
                    cell: {
                        "EmployeeDetailPage.useMemo[leaveColumns]": ({ row })=>row.leaveTypeName
                    }["EmployeeDetailPage.useMemo[leaveColumns]"],
                    meta: {
                        displayName: 'Loại phép'
                    }
                },
                {
                    id: 'dateRange',
                    header: 'Thời gian',
                    cell: {
                        "EmployeeDetailPage.useMemo[leaveColumns]": ({ row })=>`${formatDateDisplay(row.startDate)} - ${formatDateDisplay(row.endDate)}`
                    }["EmployeeDetailPage.useMemo[leaveColumns]"],
                    meta: {
                        displayName: 'Thời gian'
                    }
                },
                {
                    id: 'numberOfDays',
                    accessorKey: 'numberOfDays',
                    header: 'Số ngày',
                    cell: {
                        "EmployeeDetailPage.useMemo[leaveColumns]": ({ row })=>row.numberOfDays
                    }["EmployeeDetailPage.useMemo[leaveColumns]"],
                    meta: {
                        displayName: 'Số ngày'
                    }
                },
                {
                    id: 'reason',
                    accessorKey: 'reason',
                    header: 'Lý do',
                    cell: {
                        "EmployeeDetailPage.useMemo[leaveColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate max-w-[200px] block",
                                children: row.reason
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 709,
                                columnNumber: 84
                            }, this)
                    }["EmployeeDetailPage.useMemo[leaveColumns]"],
                    meta: {
                        displayName: 'Lý do'
                    }
                },
                {
                    id: 'status',
                    accessorKey: 'status',
                    header: 'Trạng thái',
                    cell: {
                        "EmployeeDetailPage.useMemo[leaveColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: leaveStatusVariants[row.status],
                                children: row.status
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 710,
                                columnNumber: 89
                            }, this)
                    }["EmployeeDetailPage.useMemo[leaveColumns]"],
                    meta: {
                        displayName: 'Trạng thái'
                    }
                },
                {
                    id: 'actions',
                    header: {
                        "EmployeeDetailPage.useMemo[leaveColumns]": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: "Thao tác"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 713,
                                columnNumber: 27
                            }, this)
                    }["EmployeeDetailPage.useMemo[leaveColumns]"],
                    cell: {
                        "EmployeeDetailPage.useMemo[leaveColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "sm",
                                                className: "h-8 w-8 p-0",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 719,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 718,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                            lineNumber: 717,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                            align: "end",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: {
                                                        "EmployeeDetailPage.useMemo[leaveColumns]": ()=>handlePrintSingleLeave(row)
                                                    }["EmployeeDetailPage.useMemo[leaveColumns]"],
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 724,
                                                            columnNumber: 33
                                                        }, this),
                                                        "In đơn nghỉ phép"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 723,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: {
                                                        "EmployeeDetailPage.useMemo[leaveColumns]": ()=>handleExportSingleLeave(row)
                                                    }["EmployeeDetailPage.useMemo[leaveColumns]"],
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 728,
                                                            columnNumber: 33
                                                        }, this),
                                                        "Xuất Excel"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 727,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: {
                                                        "EmployeeDetailPage.useMemo[leaveColumns]": ()=>router.push(`/leaves/${row.systemId}`)
                                                    }["EmployeeDetailPage.useMemo[leaveColumns]"],
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 732,
                                                            columnNumber: 33
                                                        }, this),
                                                        "Xem chi tiết"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 731,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                            lineNumber: 722,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                    lineNumber: 716,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 715,
                                columnNumber: 17
                            }, this)
                    }["EmployeeDetailPage.useMemo[leaveColumns]"],
                    meta: {
                        displayName: 'Thao tác',
                        sticky: 'right'
                    }
                }
            ]
    }["EmployeeDetailPage.useMemo[leaveColumns]"], [
        handlePrintSingleLeave,
        handleExportSingleLeave,
        router
    ]);
    // ✅ Bulk actions cho tab Công việc
    const taskBulkActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[taskBulkActions]": ()=>{
            const handleExportExcel = {
                "EmployeeDetailPage.useMemo[taskBulkActions].handleExportExcel": (rows)=>{
                    if (rows.length === 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Chưa chọn công việc nào');
                        return;
                    }
                    const headers = [
                        'Công việc',
                        'Độ ưu tiên',
                        'Hạn chót',
                        'Trạng thái'
                    ];
                    const mappedData = rows.map({
                        "EmployeeDetailPage.useMemo[taskBulkActions].handleExportExcel.mappedData": (row)=>({
                                'Công việc': row.title,
                                'Độ ưu tiên': row.type,
                                'Hạn chót': formatDateDisplay(row.dueDate),
                                'Trạng thái': row.statusName
                            })
                    }["EmployeeDetailPage.useMemo[taskBulkActions].handleExportExcel.mappedData"]);
                    const ws = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(mappedData, {
                        header: headers
                    });
                    const wb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_new();
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, ws, 'CongViec');
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeFile"](wb, `CongViec_${employee?.id || 'NV'}_selected.xlsx`);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã xuất ${rows.length} công việc ra Excel`);
                }
            }["EmployeeDetailPage.useMemo[taskBulkActions].handleExportExcel"];
            return [
                {
                    label: 'Xuất Excel',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"],
                    onSelect: handleExportExcel
                }
            ];
        }
    }["EmployeeDetailPage.useMemo[taskBulkActions]"], [
        employee
    ]);
    // ✅ Helper export single task
    const handleExportSingleTask = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "EmployeeDetailPage.useCallback[handleExportSingleTask]": (row)=>{
            const headers = [
                'Công việc',
                'Độ ưu tiên',
                'Hạn chót',
                'Trạng thái'
            ];
            const mappedData = [
                {
                    'Công việc': row.title,
                    'Độ ưu tiên': row.type,
                    'Hạn chót': formatDateDisplay(row.dueDate),
                    'Trạng thái': row.statusName
                }
            ];
            const ws = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(mappedData, {
                header: headers
            });
            const wb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_new();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, ws, 'CongViec');
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeFile"](wb, `CongViec_${row.systemId}.xlsx`);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã xuất công việc ra Excel');
        }
    }["EmployeeDetailPage.useCallback[handleExportSingleTask]"], []);
    // ✅ Dynamic columns cho Công việc (có action column)
    const taskColumns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[taskColumns]": ()=>[
                {
                    id: 'title',
                    accessorKey: 'title',
                    header: 'Công việc',
                    cell: {
                        "EmployeeDetailPage.useMemo[taskColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: row.title
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 804,
                                columnNumber: 86
                            }, this)
                    }["EmployeeDetailPage.useMemo[taskColumns]"],
                    meta: {
                        displayName: 'Công việc'
                    }
                },
                {
                    id: 'type',
                    accessorKey: 'type',
                    header: 'Độ ưu tiên',
                    cell: {
                        "EmployeeDetailPage.useMemo[taskColumns]": ({ row })=>row.type
                    }["EmployeeDetailPage.useMemo[taskColumns]"],
                    meta: {
                        displayName: 'Độ ưu tiên'
                    }
                },
                {
                    id: 'dueDate',
                    accessorKey: 'dueDate',
                    header: 'Hạn chót',
                    cell: {
                        "EmployeeDetailPage.useMemo[taskColumns]": ({ row })=>formatDateDisplay(row.dueDate)
                    }["EmployeeDetailPage.useMemo[taskColumns]"],
                    meta: {
                        displayName: 'Hạn chót'
                    }
                },
                {
                    id: 'status',
                    accessorKey: 'statusName',
                    header: 'Trạng thái',
                    cell: {
                        "EmployeeDetailPage.useMemo[taskColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                variant: row.statusVariant,
                                children: row.statusName
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 807,
                                columnNumber: 93
                            }, this)
                    }["EmployeeDetailPage.useMemo[taskColumns]"],
                    meta: {
                        displayName: 'Trạng thái'
                    }
                },
                {
                    id: 'actions',
                    header: {
                        "EmployeeDetailPage.useMemo[taskColumns]": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: "Thao tác"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 810,
                                columnNumber: 27
                            }, this)
                    }["EmployeeDetailPage.useMemo[taskColumns]"],
                    cell: {
                        "EmployeeDetailPage.useMemo[taskColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "sm",
                                                className: "h-8 w-8 p-0",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 816,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 815,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                            lineNumber: 814,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                            align: "end",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: {
                                                        "EmployeeDetailPage.useMemo[taskColumns]": ()=>handleExportSingleTask(row)
                                                    }["EmployeeDetailPage.useMemo[taskColumns]"],
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 821,
                                                            columnNumber: 33
                                                        }, this),
                                                        "Xuất Excel"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 820,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: {
                                                        "EmployeeDetailPage.useMemo[taskColumns]": ()=>router.push(row.link)
                                                    }["EmployeeDetailPage.useMemo[taskColumns]"],
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 825,
                                                            columnNumber: 33
                                                        }, this),
                                                        "Xem chi tiết"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 824,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                            lineNumber: 819,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                    lineNumber: 813,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 812,
                                columnNumber: 17
                            }, this)
                    }["EmployeeDetailPage.useMemo[taskColumns]"],
                    meta: {
                        displayName: 'Thao tác',
                        sticky: 'right'
                    }
                }
            ]
    }["EmployeeDetailPage.useMemo[taskColumns]"], [
        handleExportSingleTask,
        router
    ]);
    const { batches: payrollBatches, payslips: payrollPayslips } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payroll$2f$payroll$2d$batch$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePayrollBatchStore"])();
    const payrollHistory = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[payrollHistory]": ()=>{
            if (!employee) return [];
            return payrollPayslips.filter({
                "EmployeeDetailPage.useMemo[payrollHistory]": (slip)=>slip.employeeSystemId === employee.systemId
            }["EmployeeDetailPage.useMemo[payrollHistory]"]).map({
                "EmployeeDetailPage.useMemo[payrollHistory]": (slip)=>({
                        slip,
                        batch: payrollBatches.find({
                            "EmployeeDetailPage.useMemo[payrollHistory]": (batch)=>batch.systemId === slip.batchSystemId
                        }["EmployeeDetailPage.useMemo[payrollHistory]"])
                    })
            }["EmployeeDetailPage.useMemo[payrollHistory]"]).sort({
                "EmployeeDetailPage.useMemo[payrollHistory]": (a, b)=>{
                    const dateA = new Date(a.batch?.payrollDate ?? a.slip.createdAt).getTime();
                    const dateB = new Date(b.batch?.payrollDate ?? b.slip.createdAt).getTime();
                    return dateB - dateA;
                }
            }["EmployeeDetailPage.useMemo[payrollHistory]"]);
        }
    }["EmployeeDetailPage.useMemo[payrollHistory]"], [
        employee,
        payrollPayslips,
        payrollBatches
    ]);
    const _latestPayslip = payrollHistory[0];
    const displayedPayrollHistory = payrollHistory.slice(0, 5);
    // State for payslip detail dialog
    const [selectedPayslip, setSelectedPayslip] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [isPayslipDialogOpen, setIsPayslipDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    // State for attendance detail dialog
    const [selectedAttendance, setSelectedAttendance] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    // Transform payroll history for RelatedDataTable
    const payrollHistoryTableData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[payrollHistoryTableData]": ()=>displayedPayrollHistory.map({
                "EmployeeDetailPage.useMemo[payrollHistoryTableData]": ({ slip, batch })=>({
                        systemId: slip.systemId,
                        batchId: batch?.id ?? '—',
                        monthLabel: formatMonthLabel(batch?.payPeriod.monthKey ?? slip.periodMonthKey),
                        payDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(batch?.payrollDate || slip.createdAt) || '—',
                        status: batch?.status ?? 'draft',
                        grossEarnings: slip.totals.grossEarnings ?? slip.totals.earnings ?? 0,
                        totalInsurance: slip.totals.totalEmployeeInsurance ?? 0,
                        personalIncomeTax: slip.totals.personalIncomeTax ?? 0,
                        otherDeductions: (slip.totals.penaltyDeductions ?? 0) + (slip.totals.otherDeductions ?? 0),
                        totalDeductions: slip.totals.deductions ?? 0,
                        netPay: slip.totals.netPay,
                        batchSystemId: batch?.systemId,
                        payslipSystemId: slip.systemId,
                        slip,
                        batch
                    })
            }["EmployeeDetailPage.useMemo[payrollHistoryTableData]"])
    }["EmployeeDetailPage.useMemo[payrollHistoryTableData]"], [
        displayedPayrollHistory
    ]);
    // Handle print payslip
    // ✅ Handler in phiếu lương đơn lẻ - sử dụng 4-layer print system
    const handlePrintSinglePayslip = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "EmployeeDetailPage.useCallback[handlePrintSinglePayslip]": (row)=>{
            if (!row.slip || !employee) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không thể in', {
                    description: 'Không tìm thấy dữ liệu phiếu lương.'
                });
                return;
            }
            const storeSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$payroll$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo);
            const payslipForPrint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$payroll$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertPayslipForPrint"])(row.slip, row.batch || {
                systemId: '',
                id: row.batchId,
                title: `Bảng lương ${row.monthLabel}`,
                status: row.status,
                payPeriod: {
                    monthKey: row.slip.periodMonthKey
                },
                payrollDate: row.payDate
            }, {
                employee: {
                    fullName: employee.fullName,
                    id: employee.id,
                    department: employee.department,
                    position: employee.positionName
                },
                departmentName: employee.department
            });
            print('payslip', {
                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$payroll$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapPayslipToPrintData"])(payslipForPrint, storeSettings),
                lineItems: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$payroll$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapPayslipComponentLineItems"])(payslipForPrint.components || [])
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đang in phiếu lương...', {
                description: `${employee.fullName} - ${row.monthLabel}`
            });
        }
    }["EmployeeDetailPage.useCallback[handlePrintSinglePayslip]"], [
        employee,
        storeInfo,
        print
    ]);
    // Payroll columns for RelatedDataTable
    const payrollColumns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[payrollColumns]": ()=>[
                {
                    id: 'batchId',
                    accessorKey: 'batchId',
                    header: 'Mã BL',
                    size: 95,
                    cell: {
                        "EmployeeDetailPage.useMemo[payrollColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: row.batchSystemId ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUTES"].PAYROLL.DETAIL.replace(':systemId', row.batchSystemId) : '#',
                                className: "font-mono text-xs text-primary hover:underline",
                                onClick: {
                                    "EmployeeDetailPage.useMemo[payrollColumns]": (e)=>e.stopPropagation()
                                }["EmployeeDetailPage.useMemo[payrollColumns]"],
                                children: row.batchId
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 925,
                                columnNumber: 13
                            }, this)
                    }["EmployeeDetailPage.useMemo[payrollColumns]"],
                    meta: {
                        displayName: 'Mã BL'
                    }
                },
                {
                    id: 'monthLabel',
                    accessorKey: 'monthLabel',
                    header: 'Kỳ lương',
                    size: 110,
                    cell: {
                        "EmployeeDetailPage.useMemo[payrollColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "whitespace-nowrap",
                                children: row.monthLabel
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 932,
                                columnNumber: 106
                            }, this)
                    }["EmployeeDetailPage.useMemo[payrollColumns]"],
                    meta: {
                        displayName: 'Kỳ lương'
                    }
                },
                {
                    id: 'payDate',
                    accessorKey: 'payDate',
                    header: 'Ngày trả',
                    size: 100,
                    cell: {
                        "EmployeeDetailPage.useMemo[payrollColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "whitespace-nowrap",
                                children: row.payDate
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 933,
                                columnNumber: 100
                            }, this)
                    }["EmployeeDetailPage.useMemo[payrollColumns]"],
                    meta: {
                        displayName: 'Ngày trả'
                    }
                },
                {
                    id: 'status',
                    accessorKey: 'status',
                    header: 'Trạng thái',
                    size: 90,
                    cell: {
                        "EmployeeDetailPage.useMemo[payrollColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payroll$2f$components$2f$status$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PayrollStatusBadge"], {
                                status: row.status
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 934,
                                columnNumber: 99
                            }, this)
                    }["EmployeeDetailPage.useMemo[payrollColumns]"],
                    meta: {
                        displayName: 'Trạng thái'
                    }
                },
                {
                    id: 'grossEarnings',
                    accessorKey: 'grossEarnings',
                    header: {
                        "EmployeeDetailPage.useMemo[payrollColumns]": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-right w-full block",
                                children: "Tổng TN"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 935,
                                columnNumber: 76
                            }, this)
                    }["EmployeeDetailPage.useMemo[payrollColumns]"],
                    size: 115,
                    cell: {
                        "EmployeeDetailPage.useMemo[payrollColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-right block tabular-nums",
                                children: formatCurrency(row.grossEarnings)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 935,
                                columnNumber: 164
                            }, this)
                    }["EmployeeDetailPage.useMemo[payrollColumns]"],
                    meta: {
                        displayName: 'Tổng thu nhập'
                    }
                },
                {
                    id: 'totalInsurance',
                    accessorKey: 'totalInsurance',
                    header: {
                        "EmployeeDetailPage.useMemo[payrollColumns]": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-right w-full block",
                                children: "Bảo hiểm"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 936,
                                columnNumber: 78
                            }, this)
                    }["EmployeeDetailPage.useMemo[payrollColumns]"],
                    size: 100,
                    cell: {
                        "EmployeeDetailPage.useMemo[payrollColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-right block tabular-nums text-orange-600",
                                children: row.totalInsurance > 0 ? `-${formatCurrency(row.totalInsurance)}` : '—'
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 936,
                                columnNumber: 167
                            }, this)
                    }["EmployeeDetailPage.useMemo[payrollColumns]"],
                    meta: {
                        displayName: 'Bảo hiểm'
                    }
                },
                {
                    id: 'personalIncomeTax',
                    accessorKey: 'personalIncomeTax',
                    header: {
                        "EmployeeDetailPage.useMemo[payrollColumns]": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-right w-full block",
                                children: "Thuế TNCN"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 937,
                                columnNumber: 84
                            }, this)
                    }["EmployeeDetailPage.useMemo[payrollColumns]"],
                    size: 100,
                    cell: {
                        "EmployeeDetailPage.useMemo[payrollColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-right block tabular-nums text-purple-600",
                                children: row.personalIncomeTax > 0 ? `-${formatCurrency(row.personalIncomeTax)}` : '—'
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 937,
                                columnNumber: 174
                            }, this)
                    }["EmployeeDetailPage.useMemo[payrollColumns]"],
                    meta: {
                        displayName: 'Thuế TNCN'
                    }
                },
                {
                    id: 'otherDeductions',
                    accessorKey: 'otherDeductions',
                    header: {
                        "EmployeeDetailPage.useMemo[payrollColumns]": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-right w-full block",
                                children: "Khác"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 938,
                                columnNumber: 80
                            }, this)
                    }["EmployeeDetailPage.useMemo[payrollColumns]"],
                    size: 90,
                    cell: {
                        "EmployeeDetailPage.useMemo[payrollColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-right block tabular-nums text-gray-600",
                                children: row.otherDeductions > 0 ? `-${formatCurrency(row.otherDeductions)}` : '—'
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 938,
                                columnNumber: 164
                            }, this)
                    }["EmployeeDetailPage.useMemo[payrollColumns]"],
                    meta: {
                        displayName: 'Khấu trừ khác'
                    }
                },
                {
                    id: 'totalDeductions',
                    accessorKey: 'totalDeductions',
                    header: {
                        "EmployeeDetailPage.useMemo[payrollColumns]": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-right w-full block",
                                children: "Tổng trừ"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 939,
                                columnNumber: 80
                            }, this)
                    }["EmployeeDetailPage.useMemo[payrollColumns]"],
                    size: 110,
                    cell: {
                        "EmployeeDetailPage.useMemo[payrollColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-right block tabular-nums text-destructive font-medium",
                                children: formatCurrency(row.totalDeductions)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 939,
                                columnNumber: 169
                            }, this)
                    }["EmployeeDetailPage.useMemo[payrollColumns]"],
                    meta: {
                        displayName: 'Tổng khấu trừ'
                    }
                },
                {
                    id: 'netPay',
                    accessorKey: 'netPay',
                    header: {
                        "EmployeeDetailPage.useMemo[payrollColumns]": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-right w-full block",
                                children: "Thực lĩnh"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 940,
                                columnNumber: 62
                            }, this)
                    }["EmployeeDetailPage.useMemo[payrollColumns]"],
                    size: 120,
                    cell: {
                        "EmployeeDetailPage.useMemo[payrollColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-right block tabular-nums font-bold text-green-600",
                                children: formatCurrency(row.netPay)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 940,
                                columnNumber: 152
                            }, this)
                    }["EmployeeDetailPage.useMemo[payrollColumns]"],
                    meta: {
                        displayName: 'Thực lĩnh'
                    }
                },
                {
                    id: 'actions',
                    header: '',
                    size: 50,
                    cell: {
                        "EmployeeDetailPage.useMemo[payrollColumns]": ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: {
                                    "EmployeeDetailPage.useMemo[payrollColumns]": (e)=>e.stopPropagation()
                                }["EmployeeDetailPage.useMemo[payrollColumns]"],
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "icon",
                                                className: "h-8 w-8",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 950,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "sr-only",
                                                        children: "Mở menu"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 951,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 949,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                            lineNumber: 948,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                            align: "end",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: {
                                                        "EmployeeDetailPage.useMemo[payrollColumns]": ()=>{
                                                            setSelectedPayslip({
                                                                slip: row.slip,
                                                                batch: row.batch
                                                            });
                                                            setIsPayslipDialogOpen(true);
                                                        }
                                                    }["EmployeeDetailPage.useMemo[payrollColumns]"],
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 959,
                                                            columnNumber: 33
                                                        }, this),
                                                        "Xem chi tiết"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 955,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: {
                                                        "EmployeeDetailPage.useMemo[payrollColumns]": ()=>handlePrintSinglePayslip(row)
                                                    }["EmployeeDetailPage.useMemo[payrollColumns]"],
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 963,
                                                            columnNumber: 33
                                                        }, this),
                                                        "In phiếu lương"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 962,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: {
                                                        "EmployeeDetailPage.useMemo[payrollColumns]": ()=>{
                                                            if (row.batchSystemId) {
                                                                router.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUTES"].PAYROLL.DETAIL.replace(':systemId', row.batchSystemId));
                                                            }
                                                        }
                                                    }["EmployeeDetailPage.useMemo[payrollColumns]"],
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 971,
                                                            columnNumber: 33
                                                        }, this),
                                                        "Xem bảng lương"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 966,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                            lineNumber: 954,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                    lineNumber: 947,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 946,
                                columnNumber: 17
                            }, this)
                    }["EmployeeDetailPage.useMemo[payrollColumns]"],
                    meta: {
                        displayName: 'Thao tác',
                        sticky: 'right'
                    }
                }
            ]
    }["EmployeeDetailPage.useMemo[payrollColumns]"], [
        router,
        handlePrintSinglePayslip
    ]);
    const handlePayrollRowClick = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "EmployeeDetailPage.useCallback[handlePayrollRowClick]": (row)=>{
            const historyItem = displayedPayrollHistory.find({
                "EmployeeDetailPage.useCallback[handlePayrollRowClick].historyItem": (h)=>h.slip.systemId === row.systemId
            }["EmployeeDetailPage.useCallback[handlePayrollRowClick].historyItem"]);
            if (historyItem) {
                setSelectedPayslip(historyItem);
                setIsPayslipDialogOpen(true);
            }
        }
    }["EmployeeDetailPage.useCallback[handlePayrollRowClick]"], [
        displayedPayrollHistory
    ]);
    const handleViewPayroll = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "EmployeeDetailPage.useCallback[handleViewPayroll]": (batchSystemId)=>{
            if (!batchSystemId) return;
            router.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUTES"].PAYROLL.DETAIL.replace(':systemId', batchSystemId));
        }
    }["EmployeeDetailPage.useCallback[handleViewPayroll]"], [
        router
    ]);
    // ✅ Custom bulk actions for payroll table - sử dụng 4-layer print system
    const payrollBulkActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[payrollBulkActions]": ()=>{
            const handlePrintPayslips = {
                "EmployeeDetailPage.useMemo[payrollBulkActions].handlePrintPayslips": (rows)=>{
                    if (rows.length === 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Chưa chọn phiếu lương nào');
                        return;
                    }
                    const storeSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$payroll$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo);
                    // In nhiều phiếu lương cùng lúc
                    const printOptionsList = rows.map({
                        "EmployeeDetailPage.useMemo[payrollBulkActions].handlePrintPayslips.printOptionsList": (row)=>{
                            const payslipForPrint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$payroll$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertPayslipForPrint"])(row.slip, row.batch || {
                                systemId: '',
                                id: row.batchId,
                                title: `Bảng lương ${row.monthLabel}`,
                                status: row.status,
                                payPeriod: {
                                    monthKey: row.slip.periodMonthKey
                                },
                                payrollDate: row.payDate
                            }, {
                                employee: employee ? {
                                    fullName: employee.fullName,
                                    id: employee.id,
                                    department: employee.department,
                                    position: employee.positionName
                                } : undefined,
                                departmentName: employee?.department
                            });
                            return {
                                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$payroll$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapPayslipToPrintData"])(payslipForPrint, storeSettings),
                                lineItems: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$payroll$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapPayslipComponentLineItems"])(payslipForPrint.components || [])
                            };
                        }
                    }["EmployeeDetailPage.useMemo[payrollBulkActions].handlePrintPayslips.printOptionsList"]);
                    // Sử dụng printMultiple để in nhiều phiếu cùng lúc
                    printMultiple('payslip', printOptionsList);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đang in ${rows.length} phiếu lương...`);
                }
            }["EmployeeDetailPage.useMemo[payrollBulkActions].handlePrintPayslips"];
            const handleExportExcel = {
                "EmployeeDetailPage.useMemo[payrollBulkActions].handleExportExcel": (rows)=>{
                    if (rows.length === 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Chưa chọn dữ liệu nào');
                        return;
                    }
                    const headers = [
                        'Mã BL',
                        'Kỳ lương',
                        'Ngày trả',
                        'Trạng thái',
                        'Tổng TN',
                        'Bảo hiểm',
                        'Thuế TNCN',
                        'Khấu trừ khác',
                        'Tổng trừ',
                        'Thực lĩnh'
                    ];
                    const mappedData = rows.map({
                        "EmployeeDetailPage.useMemo[payrollBulkActions].handleExportExcel.mappedData": (row)=>({
                                'Mã BL': row.batchId,
                                'Kỳ lương': row.monthLabel,
                                'Ngày trả': row.payDate,
                                'Trạng thái': row.status,
                                'Tổng TN': row.grossEarnings,
                                'Bảo hiểm': row.totalInsurance,
                                'Thuế TNCN': row.personalIncomeTax,
                                'Khấu trừ khác': row.otherDeductions,
                                'Tổng trừ': row.totalDeductions,
                                'Thực lĩnh': row.netPay
                            })
                    }["EmployeeDetailPage.useMemo[payrollBulkActions].handleExportExcel.mappedData"]);
                    const ws = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(mappedData, {
                        header: headers
                    });
                    const wb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_new();
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, ws, 'Lương');
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeFile"](wb, `Luong_${employee?.id || 'NV'}_selected.xlsx`);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã xuất ${rows.length} dòng ra Excel`);
                }
            }["EmployeeDetailPage.useMemo[payrollBulkActions].handleExportExcel"];
            return [
                {
                    label: 'In phiếu lương',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"],
                    onSelect: handlePrintPayslips
                },
                {
                    label: 'Xuất Excel',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"],
                    onSelect: handleExportExcel
                }
            ];
        }
    }["EmployeeDetailPage.useMemo[payrollBulkActions]"], [
        employee,
        storeInfo,
        printMultiple
    ]);
    // Actions for detail page
    const headerActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[headerActions]": ()=>[
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "outline",
                    size: "sm",
                    className: "h-9",
                    onClick: {
                        "EmployeeDetailPage.useMemo[headerActions]": ()=>router.push('/employees')
                    }["EmployeeDetailPage.useMemo[headerActions]"],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                            className: "mr-2 h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 1086,
                            columnNumber: 13
                        }, this),
                        "Quay lại"
                    ]
                }, "back", true, {
                    fileName: "[project]/features/employees/components/detail-page.tsx",
                    lineNumber: 1085,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    size: "sm",
                    className: "h-9",
                    onClick: {
                        "EmployeeDetailPage.useMemo[headerActions]": ()=>router.push(`/employees/${systemId}/edit`)
                    }["EmployeeDetailPage.useMemo[headerActions]"],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                            className: "mr-2 h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 1090,
                            columnNumber: 13
                        }, this),
                        "Chỉnh sửa"
                    ]
                }, "edit", true, {
                    fileName: "[project]/features/employees/components/detail-page.tsx",
                    lineNumber: 1089,
                    columnNumber: 9
                }, this)
            ]
    }["EmployeeDetailPage.useMemo[headerActions]"], [
        router,
        systemId
    ]);
    // ✅ Auto-generate breadcrumb
    const breadcrumb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[breadcrumb]": ()=>{
            if (!employee) return [
                {
                    label: 'Trang chủ',
                    href: '/',
                    isCurrent: false
                },
                {
                    label: 'Nhân viên',
                    href: '/employees',
                    isCurrent: false
                },
                {
                    label: 'Chi tiết',
                    href: '',
                    isCurrent: true
                }
            ];
            return [
                {
                    label: 'Trang chủ',
                    href: '/',
                    isCurrent: false
                },
                {
                    label: 'Nhân viên',
                    href: '/employees',
                    isCurrent: false
                },
                {
                    label: employee.fullName,
                    href: '',
                    isCurrent: true
                }
            ];
        }
    }["EmployeeDetailPage.useMemo[breadcrumb]"], [
        employee
    ]);
    const headerBadge = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "EmployeeDetailPage.useMemo[headerBadge]": ()=>renderEmploymentStatusBadge(employee?.employmentStatus)
    }["EmployeeDetailPage.useMemo[headerBadge]"], [
        employee?.employmentStatus
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageHeader"])({
        title: employee?.fullName || 'Chi tiết Nhân viên',
        badge: headerBadge,
        actions: headerActions,
        breadcrumb
    });
    if (!employee) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-full items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-h3 font-bold",
                        children: "Không tìm thấy nhân viên"
                    }, void 0, false, {
                        fileName: "[project]/features/employees/components/detail-page.tsx",
                        lineNumber: 1122,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground mt-2",
                        children: "Nhân viên bạn đang tìm kiếm không tồn tại."
                    }, void 0, false, {
                        fileName: "[project]/features/employees/components/detail-page.tsx",
                        lineNumber: 1123,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: ()=>router.push('/employees'),
                        className: "mt-4",
                        size: "sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                className: "mr-2 h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 1125,
                                columnNumber: 13
                            }, this),
                            "Quay về danh sách"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/employees/components/detail-page.tsx",
                        lineNumber: 1124,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/employees/components/detail-page.tsx",
                lineNumber: 1121,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/features/employees/components/detail-page.tsx",
            lineNumber: 1120,
            columnNumber: 7
        }, this);
    }
    const getInitials = (name)=>{
        return name.split(' ').map((n)=>n[0]).join('').toUpperCase().slice(0, 2);
    };
    const calculateWorkDuration = ()=>{
        if (!employee.hireDate) return '0 tháng';
        const months = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMonthsDiff"])(employee.hireDate, new Date());
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        if (years > 0) {
            return `${years} năm ${remainingMonths > 0 ? `${remainingMonths} tháng` : ''}`;
        }
        return `${months} tháng`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full h-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "pt-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col sm:flex-row gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                    className: "h-20 w-20",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarImage"], {
                                            src: employee.avatarUrl,
                                            alt: employee.fullName
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                            lineNumber: 1156,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                            children: getInitials(employee.fullName)
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                            lineNumber: 1157,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                    lineNumber: 1155,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 text-sm text-muted-foreground",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1162,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: employee.workEmail || '—'
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1163,
                                                            columnNumber: 33
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1161,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 text-sm text-muted-foreground",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1166,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: employee.phone || '—'
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1167,
                                                            columnNumber: 33
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1165,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 text-sm text-muted-foreground",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1170,
                                                            columnNumber: 33
                                                        }, this),
                                                        employee.branchSystemId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: `/branches/${employee.branchSystemId}`,
                                                            className: "hover:underline text-primary",
                                                            children: branchName
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1172,
                                                            columnNumber: 37
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: branchName
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1178,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1169,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 text-sm text-muted-foreground",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1182,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                "Làm việc ",
                                                                calculateWorkDuration()
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1183,
                                                            columnNumber: 33
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1181,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                            lineNumber: 1160,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: employee.employmentStatus === "Đang làm việc" ? "default" : employee.employmentStatus === "Tạm nghỉ" ? "secondary" : "destructive",
                                                    children: employee.employmentStatus
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1187,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: "outline",
                                                    children: employee.employeeType
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1190,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: "outline",
                                                    children: employee.id
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1191,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                            lineNumber: 1186,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                    lineNumber: 1159,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 1154,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/employees/components/detail-page.tsx",
                        lineNumber: 1153,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/employees/components/detail-page.tsx",
                    lineNumber: 1152,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$stats$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatsCard"], {
                            title: "Lương cơ bản",
                            value: formatCurrency(employee.baseSalary),
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"],
                            description: "/ tháng"
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 1200,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$stats$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatsCard"], {
                            title: "Ngày phép còn lại",
                            value: 12 - (employee.leaveTaken || 0),
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"],
                            description: `Đã dùng ${employee.leaveTaken || 0}/12 ngày`
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 1206,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$stats$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatsCard"], {
                            title: "Công việc",
                            value: employeeTasks.length,
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"],
                            description: `${employeeTasks.filter((t)=>t.statusName !== 'Hoàn thành').length} đang làm`
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 1212,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/employees/components/detail-page.tsx",
                    lineNumber: 1199,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tabs"], {
                    defaultValue: "personal",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full overflow-x-auto overflow-y-hidden mb-4 pb-1",
                            style: {
                                WebkitOverflowScrolling: 'touch',
                                scrollbarWidth: 'thin'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsList"], {
                                className: "inline-flex w-auto gap-1 p-1 h-auto justify-start",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                        value: "personal",
                                        className: "flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap",
                                        children: "Thông tin cá nhân"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                        lineNumber: 1223,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                        value: "addresses",
                                        className: "flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap",
                                        children: "Địa chỉ"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                        lineNumber: 1224,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                        value: "work",
                                        className: "flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap",
                                        children: "Thông tin công việc"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                        lineNumber: 1225,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                        value: "account",
                                        className: "flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap",
                                        children: "Thông tin đăng nhập"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                        lineNumber: 1226,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                        value: "documents",
                                        className: "flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap",
                                        children: "Tài liệu"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                        lineNumber: 1227,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                        value: "penalties",
                                        className: "flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap",
                                        children: "Phiếu phạt"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                        lineNumber: 1228,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                        value: "leaves",
                                        className: "flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap",
                                        children: "Lịch sử nghỉ phép"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                        lineNumber: 1229,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                        value: "kpi",
                                        className: "flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap",
                                        children: "KPI"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                        lineNumber: 1230,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                        value: "tasks",
                                        className: "flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap",
                                        children: "Công việc"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                        lineNumber: 1231,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                        value: "payroll",
                                        className: "flex-shrink-0 px-3 py-2 text-sm font-normal whitespace-nowrap",
                                        children: "Lương & chấm công"
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                        lineNumber: 1232,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 1222,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 1221,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                            value: "personal",
                            className: "space-y-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-4 md:grid-cols-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                    className: "text-h6",
                                                    children: "Thông tin cá nhân"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1241,
                                                    columnNumber: 29
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 1240,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                className: "grid gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Giới tính",
                                                        value: employee.gender
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1244,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Ngày sinh",
                                                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(employee.dob)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1245,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Nơi sinh",
                                                        value: employee.placeOfBirth
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1246,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Tình trạng hôn nhân",
                                                        value: employee.maritalStatus
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1247,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Số điện thoại",
                                                        value: employee.phone
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1248,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Email cá nhân",
                                                        value: employee.personalEmail
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1249,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 1243,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                        lineNumber: 1239,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                    className: "text-h6",
                                                    children: "Định danh & Ngân hàng"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1256,
                                                    columnNumber: 29
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 1255,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                className: "grid gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Số CCCD",
                                                        value: employee.nationalId
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1259,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Ngày cấp",
                                                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(employee.nationalIdIssueDate)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1260,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Nơi cấp",
                                                        value: employee.nationalIdIssuePlace
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1261,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Mã số thuế",
                                                        value: employee.personalTaxId
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1262,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Số sổ BHXH",
                                                        value: employee.socialInsuranceNumber
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1263,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Ngân hàng",
                                                        value: employee.bankName
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1264,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Chi nhánh",
                                                        value: employee.bankBranch
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1265,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Số tài khoản",
                                                        value: employee.bankAccountNumber
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1266,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 1258,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                        lineNumber: 1254,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        className: "md:col-span-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                    className: "text-h6",
                                                    children: "Liên hệ khẩn cấp"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1273,
                                                    columnNumber: 29
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 1272,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                className: "grid gap-4 md:grid-cols-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Tên người thân",
                                                        value: employee.emergencyContactName
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1276,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "SĐT người thân",
                                                        value: employee.emergencyContactPhone
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1277,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 1275,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                        lineNumber: 1271,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 1237,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 1236,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                            value: "addresses",
                            className: "space-y-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-4 md:grid-cols-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                    className: "text-h6",
                                                    children: "Địa chỉ thường trú"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1287,
                                                    columnNumber: 29
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 1286,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                className: "grid gap-4",
                                                children: employee.permanentAddress ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                            label: "Số nhà, đường",
                                                            value: employee.permanentAddress.street
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1292,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                            label: "Phường/Xã",
                                                            value: employee.permanentAddress.ward
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1293,
                                                            columnNumber: 37
                                                        }, this),
                                                        employee.permanentAddress.inputLevel === '3-level' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                            label: "Quận/Huyện",
                                                            value: employee.permanentAddress.district
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1295,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                            label: "Tỉnh/Thành phố",
                                                            value: employee.permanentAddress.province
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1297,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                            label: "Đầy đủ",
                                                            value: formatAddressDisplay(employee.permanentAddress)
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1298,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-muted-foreground",
                                                    children: "Chưa cập nhật"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1301,
                                                    columnNumber: 34
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 1289,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                        lineNumber: 1285,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                    className: "text-h6",
                                                    children: "Địa chỉ tạm trú"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1307,
                                                    columnNumber: 29
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 1306,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                className: "grid gap-4",
                                                children: employee.temporaryAddress ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                            label: "Số nhà, đường",
                                                            value: employee.temporaryAddress.street
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1312,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                            label: "Phường/Xã",
                                                            value: employee.temporaryAddress.ward
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1313,
                                                            columnNumber: 37
                                                        }, this),
                                                        employee.temporaryAddress.inputLevel === '3-level' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                            label: "Quận/Huyện",
                                                            value: employee.temporaryAddress.district
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1315,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                            label: "Tỉnh/Thành phố",
                                                            value: employee.temporaryAddress.province
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1317,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                            label: "Đầy đủ",
                                                            value: formatAddressDisplay(employee.temporaryAddress)
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1318,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-muted-foreground",
                                                    children: "Chưa cập nhật"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1321,
                                                    columnNumber: 34
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 1309,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                        lineNumber: 1305,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 1284,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 1283,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                            value: "work",
                            className: "space-y-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-4 md:grid-cols-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                    className: "text-h6",
                                                    children: "Thông tin công việc"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1333,
                                                    columnNumber: 29
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 1332,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                className: "grid gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Email công việc",
                                                        value: employee.workEmail
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1336,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Chi nhánh",
                                                        children: employee.branchSystemId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: `/branches/${employee.branchSystemId}`,
                                                            className: "hover:underline text-primary",
                                                            children: branchName
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1339,
                                                            columnNumber: 37
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: branchName
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1345,
                                                            columnNumber: 37
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1337,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Phòng ban",
                                                        value: typeof employee.department === 'object' ? employee.department?.name : employee.department
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1348,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Chức danh",
                                                        value: typeof employee.jobTitle === 'object' ? employee.jobTitle?.name : employee.jobTitle
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1349,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Số hợp đồng",
                                                        value: employee.contractNumber
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1350,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Ngày ký HĐ",
                                                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(employee.contractStartDate)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1351,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Ngày hết hạn HĐ",
                                                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(employee.contractEndDate)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1352,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Ngày vào làm",
                                                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(employee.hireDate)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1353,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Loại nhân viên",
                                                        value: employee.employeeType
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1354,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Trạng thái",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                            variant: employee.employmentStatus === "Đang làm việc" ? "default" : employee.employmentStatus === "Tạm nghỉ" ? "secondary" : "destructive",
                                                            children: employee.employmentStatus
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1356,
                                                            columnNumber: 33
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1355,
                                                        columnNumber: 29
                                                    }, this),
                                                    employee.terminationDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Ngày nghỉ việc",
                                                        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(employee.terminationDate)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1361,
                                                        columnNumber: 33
                                                    }, this),
                                                    employee.reasonForLeaving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Lý do nghỉ việc",
                                                        value: employee.reasonForLeaving
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1364,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 1335,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                        lineNumber: 1331,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                    className: "text-h6",
                                                    children: "Lương & Phụ cấp"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1372,
                                                    columnNumber: 29
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 1371,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                className: "grid gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Lương cơ bản",
                                                        value: formatCurrency(employee.baseSalary)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1375,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Lương đóng BHXH",
                                                        value: formatCurrency(employee.socialInsuranceSalary)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1376,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Phụ cấp chức vụ",
                                                        value: formatCurrency(employee.positionAllowance)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1377,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Phụ cấp ăn trưa",
                                                        value: formatCurrency(employee.mealAllowance)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1378,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Phụ cấp khác",
                                                        value: formatCurrency(employee.otherAllowances)
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1379,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                        label: "Phép đã nghỉ",
                                                        value: `${employee.leaveTaken || 0} / 12 ngày`
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                        lineNumber: 1380,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 1374,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                        lineNumber: 1370,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 1329,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 1328,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                            value: "account",
                            className: "space-y-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$components$2f$employee$2d$account$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmployeeAccountTab"], {
                                employee: employee
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 1387,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 1386,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                            value: "documents",
                            className: "space-y-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$components$2f$employee$2d$documents$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmployeeDocuments"], {
                                employeeSystemId: employee.systemId || employee.id
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 1391,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 1390,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                            value: "penalties",
                            className: "space-y-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                    className: "p-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$related$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RelatedDataTable"], {
                                        data: employeePenalties,
                                        columns: penaltyColumns,
                                        searchKeys: [
                                            'reason',
                                            'id'
                                        ],
                                        searchPlaceholder: "Tìm theo lý do...",
                                        dateFilterColumn: "issueDate",
                                        dateFilterTitle: "Ngày lập phiếu",
                                        exportFileName: `Lich_su_phat_${employee.id}`,
                                        onRowClick: (row)=>router.push(`/penalties/${row.systemId}`),
                                        showCheckbox: true,
                                        customBulkActions: penaltyBulkActions
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                        lineNumber: 1397,
                                        columnNumber: 25
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                    lineNumber: 1396,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 1395,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 1394,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                            value: "leaves",
                            className: "space-y-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                    className: "p-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$related$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RelatedDataTable"], {
                                        data: employeeLeaves,
                                        columns: leaveColumns,
                                        searchKeys: [
                                            'id',
                                            'leaveTypeName',
                                            'reason'
                                        ],
                                        searchPlaceholder: "Tìm theo mã đơn, loại phép...",
                                        dateFilterColumn: "startDate",
                                        dateFilterTitle: "Ngày bắt đầu",
                                        exportFileName: `Lich_su_nghi_phep_${employee.id}`,
                                        onRowClick: (row)=>router.push(`/leaves/${row.systemId}`),
                                        showCheckbox: true,
                                        customBulkActions: leaveBulkActions
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                        lineNumber: 1416,
                                        columnNumber: 25
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                    lineNumber: 1415,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 1414,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 1413,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                            value: "kpi",
                            className: "space-y-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PlaceholderTabContent, {
                                title: "Đánh giá KPI"
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 1433,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 1432,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                            value: "tasks",
                            className: "space-y-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                    className: "p-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$related$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RelatedDataTable"], {
                                        data: employeeTasks,
                                        columns: taskColumns,
                                        searchKeys: [
                                            'title',
                                            'type'
                                        ],
                                        searchPlaceholder: "Tìm công việc...",
                                        dateFilterColumn: "dueDate",
                                        dateFilterTitle: "Hạn chót",
                                        exportFileName: `Cong_viec_${employee.id}`,
                                        onRowClick: (row)=>router.push(row.link),
                                        showCheckbox: true,
                                        customBulkActions: taskBulkActions
                                    }, void 0, false, {
                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                        lineNumber: 1439,
                                        columnNumber: 49
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                    lineNumber: 1438,
                                    columnNumber: 41
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                lineNumber: 1437,
                                columnNumber: 33
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 1436,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabsContent"], {
                            value: "payroll",
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                    className: "text-h6",
                                                    children: "Bảng lương gần đây"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1459,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                    children: "Hiển thị tối đa 5 kỳ gần nhất mà nhân viên tham gia. Click vào dòng để xem chi tiết."
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1460,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                            lineNumber: 1458,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                            children: payrollHistoryTableData.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex h-32 items-center justify-center rounded-lg border border-dashed",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-muted-foreground",
                                                    children: "Nhân viên chưa có phiếu lương nào được tạo."
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1467,
                                                    columnNumber: 49
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 1466,
                                                columnNumber: 45
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$related$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RelatedDataTable"], {
                                                data: payrollHistoryTableData,
                                                columns: payrollColumns,
                                                searchKeys: [
                                                    'batchId',
                                                    'monthLabel'
                                                ],
                                                searchPlaceholder: "Tìm bảng lương...",
                                                exportFileName: `Luong_${employee.id}`,
                                                onRowClick: handlePayrollRowClick,
                                                showCheckbox: true,
                                                defaultSorting: {
                                                    id: 'payDate',
                                                    desc: true
                                                },
                                                customBulkActions: payrollBulkActions
                                            }, void 0, false, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 1472,
                                                columnNumber: 45
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                            lineNumber: 1464,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                    lineNumber: 1457,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                    className: "text-h6",
                                                    children: "Lịch sử chấm công"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1490,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                    children: "Hiển thị dữ liệu chấm công theo từng tháng. Click vào dòng để xem chi tiết."
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1491,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                            lineNumber: 1489,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                            children: attendanceHistory.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex h-32 items-center justify-center rounded-lg border border-dashed",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-muted-foreground",
                                                    children: "Chưa có dữ liệu chấm công cho nhân viên này."
                                                }, void 0, false, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1498,
                                                    columnNumber: 49
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 1497,
                                                columnNumber: 45
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$related$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RelatedDataTable"], {
                                                data: attendanceHistory,
                                                columns: attendanceColumns,
                                                searchKeys: [
                                                    'monthLabel'
                                                ],
                                                searchPlaceholder: "Tìm theo tháng...",
                                                exportFileName: `ChamCong_${employee.id}`,
                                                onRowClick: (row)=>{
                                                    setSelectedAttendance(row);
                                                    setIsAttendanceDialogOpen(true);
                                                },
                                                showCheckbox: true,
                                                defaultSorting: {
                                                    id: 'monthKey',
                                                    desc: true
                                                },
                                                customBulkActions: attendanceBulkActions
                                            }, void 0, false, {
                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                lineNumber: 1503,
                                                columnNumber: 45
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                            lineNumber: 1495,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                    lineNumber: 1488,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-4 md:grid-cols-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                            className: "text-h6",
                                                            children: "Thành phần lương đang áp dụng"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1525,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                            children: payrollProfile?.usesDefaultComponents ? 'Đang dùng cấu hình mặc định từ Cài đặt > Nhân viên' : 'Được cấu hình riêng cho nhân viên này'
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1526,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1524,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                    className: "space-y-4",
                                                    children: [
                                                        payrollComponents.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-muted-foreground",
                                                            children: "Chưa thiết lập thành phần lương."
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1534,
                                                            columnNumber: 49
                                                        }, this),
                                                        payrollComponents.filter((c)=>c.category === 'earning').length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "text-sm font-semibold text-green-700 flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                                                            className: "h-4 w-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                            lineNumber: 1541,
                                                                            columnNumber: 57
                                                                        }, this),
                                                                        " Thu nhập"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                    lineNumber: 1540,
                                                                    columnNumber: 53
                                                                }, this),
                                                                payrollComponents.filter((c)=>c.category === 'earning').map((component)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center justify-between rounded-lg border border-green-200 bg-green-50/50 p-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "font-medium",
                                                                                        children: component.name
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                                        lineNumber: 1549,
                                                                                        columnNumber: 65
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-sm text-muted-foreground",
                                                                                        children: component.type === 'fixed' ? formatCurrency(component.amount) : component.formula || 'Theo công thức'
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                                        lineNumber: 1550,
                                                                                        columnNumber: 65
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                                lineNumber: 1548,
                                                                                columnNumber: 61
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex gap-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                        variant: component.taxable ? 'default' : 'secondary',
                                                                                        className: "text-xs",
                                                                                        children: component.taxable ? 'Tính thuế' : 'Không thuế'
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                                        lineNumber: 1557,
                                                                                        columnNumber: 65
                                                                                    }, this),
                                                                                    component.partOfSocialInsurance && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                        variant: "outline",
                                                                                        className: "text-xs",
                                                                                        children: "Đóng BH"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                                        lineNumber: 1561,
                                                                                        columnNumber: 69
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                                lineNumber: 1556,
                                                                                columnNumber: 61
                                                                            }, this)
                                                                        ]
                                                                    }, component.systemId, true, {
                                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                        lineNumber: 1544,
                                                                        columnNumber: 57
                                                                    }, this))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1539,
                                                            columnNumber: 49
                                                        }, this),
                                                        payrollComponents.filter((c)=>c.category === 'deduction').length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "text-sm font-semibold text-red-700 flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                            className: "h-4 w-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                            lineNumber: 1573,
                                                                            columnNumber: 57
                                                                        }, this),
                                                                        " Khấu trừ"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                    lineNumber: 1572,
                                                                    columnNumber: 53
                                                                }, this),
                                                                payrollComponents.filter((c)=>c.category === 'deduction').map((component)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center justify-between rounded-lg border border-red-200 bg-red-50/50 p-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "font-medium",
                                                                                        children: component.name
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                                        lineNumber: 1581,
                                                                                        columnNumber: 65
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-sm text-muted-foreground",
                                                                                        children: component.type === 'fixed' ? formatCurrency(component.amount) : component.formula || 'Theo công thức'
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                                        lineNumber: 1582,
                                                                                        columnNumber: 65
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                                lineNumber: 1580,
                                                                                columnNumber: 61
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                variant: "destructive",
                                                                                className: "text-xs",
                                                                                children: "Khấu trừ"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                                lineNumber: 1588,
                                                                                columnNumber: 61
                                                                            }, this)
                                                                        ]
                                                                    }, component.systemId, true, {
                                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                        lineNumber: 1576,
                                                                        columnNumber: 57
                                                                    }, this))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1571,
                                                            columnNumber: 49
                                                        }, this),
                                                        payrollComponents.filter((c)=>c.category === 'contribution').length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "text-sm font-semibold text-blue-700 flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                                            className: "h-4 w-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                            lineNumber: 1600,
                                                                            columnNumber: 57
                                                                        }, this),
                                                                        " Đóng góp"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                    lineNumber: 1599,
                                                                    columnNumber: 53
                                                                }, this),
                                                                payrollComponents.filter((c)=>c.category === 'contribution').map((component)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50/50 p-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "font-medium",
                                                                                        children: component.name
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                                        lineNumber: 1608,
                                                                                        columnNumber: 65
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-sm text-muted-foreground",
                                                                                        children: component.type === 'fixed' ? formatCurrency(component.amount) : component.formula || 'Theo công thức'
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                                        lineNumber: 1609,
                                                                                        columnNumber: 65
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                                lineNumber: 1607,
                                                                                columnNumber: 61
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                variant: "secondary",
                                                                                className: "text-xs",
                                                                                children: "Đóng góp"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                                lineNumber: 1615,
                                                                                columnNumber: 61
                                                                            }, this)
                                                                        ]
                                                                    }, component.systemId, true, {
                                                                        fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                        lineNumber: 1603,
                                                                        columnNumber: 57
                                                                    }, this))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1598,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1532,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                            lineNumber: 1523,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                    className: "space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                            className: "text-h6",
                                                            children: "Thông tin trả lương"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1627,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 text-sm text-muted-foreground",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                                                    className: "h-4 w-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                    lineNumber: 1629,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: [
                                                                        "Hình thức: ",
                                                                        payrollProfile?.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                    lineNumber: 1630,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1628,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1626,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                                    className: "space-y-2 text-sm",
                                                    children: [
                                                        payrollProfile?.paymentMethod === 'cash' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-muted-foreground",
                                                            children: "Trả lương trực tiếp, không cần tài khoản ngân hàng."
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1635,
                                                            columnNumber: 49
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                                    label: "Số tài khoản",
                                                                    value: payrollProfile?.payrollBankAccount?.accountNumber || employee.bankAccountNumber || '—'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                    lineNumber: 1638,
                                                                    columnNumber: 53
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                                    label: "Ngân hàng",
                                                                    value: payrollProfile?.payrollBankAccount?.bankName || employee.bankName || '—'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                    lineNumber: 1639,
                                                                    columnNumber: 53
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                                    label: "Chi nhánh",
                                                                    value: payrollProfile?.payrollBankAccount?.bankBranch || employee.bankBranch || '—'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                                    lineNumber: 1640,
                                                                    columnNumber: 53
                                                                }, this)
                                                            ]
                                                        }, void 0, true),
                                                        payrollShift ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                            label: "Ca mặc định",
                                                            value: `${payrollShift.name} (${payrollShift.startTime} - ${payrollShift.endTime})`
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1644,
                                                            columnNumber: 49
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$info$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoItem"], {
                                                            label: "Ca mặc định",
                                                            value: "Theo cài đặt chung"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                                            lineNumber: 1649,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                                    lineNumber: 1633,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/employees/components/detail-page.tsx",
                                            lineNumber: 1625,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/employees/components/detail-page.tsx",
                                    lineNumber: 1522,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 1455,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$PayslipDetailDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PayslipDetailDialog"], {
                            open: isPayslipDialogOpen,
                            onOpenChange: setIsPayslipDialogOpen,
                            selectedPayslip: selectedPayslip,
                            onViewPayroll: handleViewPayroll
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 1657,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$detail$2f$AttendanceDetailDialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AttendanceDetailDialog"], {
                            open: isAttendanceDialogOpen,
                            onOpenChange: setIsAttendanceDialogOpen,
                            selectedAttendance: selectedAttendance,
                            employee: {
                                fullName: employee.fullName,
                                id: employee.id
                            },
                            onPrintSingle: handlePrintSingleAttendance
                        }, void 0, false, {
                            fileName: "[project]/features/employees/components/detail-page.tsx",
                            lineNumber: 1665,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/employees/components/detail-page.tsx",
                    lineNumber: 1220,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Comments$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Comments"], {
                    entityType: "employee",
                    entityId: employee.systemId,
                    comments: comments,
                    onAddComment: handleAddComment,
                    onUpdateComment: handleUpdateComment,
                    onDeleteComment: handleDeleteComment,
                    currentUser: commentCurrentUser,
                    title: "Bình luận",
                    placeholder: "Thêm bình luận về nhân viên..."
                }, void 0, false, {
                    fileName: "[project]/features/employees/components/detail-page.tsx",
                    lineNumber: 1676,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ActivityHistory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActivityHistory"], {
                    history: employee.activityHistory || [],
                    title: "Lịch sử hoạt động",
                    emptyMessage: "Chưa có lịch sử hoạt động",
                    groupByDate: true,
                    maxHeight: "400px"
                }, void 0, false, {
                    fileName: "[project]/features/employees/components/detail-page.tsx",
                    lineNumber: 1689,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/employees/components/detail-page.tsx",
            lineNumber: 1150,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/employees/components/detail-page.tsx",
        lineNumber: 1149,
        columnNumber: 5
    }, this);
}
_s(EmployeeDetailPage, "rohfLvMSi5GTyNP20O9wo/Mc5EA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllBranches"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$employee$2d$comp$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeCompStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$employees$2f$employee$2d$settings$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEmployeeSettingsStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$store$2d$info$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStoreInfoStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$departments$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDepartmentStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrint"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$attendance$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAttendanceStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$attendance$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAttendanceStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$comments$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComments"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$penalties$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePenaltyStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$tasks$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTaskStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$leaves$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLeaveStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payroll$2f$payroll$2d$batch$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePayrollBatchStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageHeader"]
    ];
});
_c1 = EmployeeDetailPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "PlaceholderTabContent");
__turbopack_context__.k.register(_c1, "EmployeeDetailPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=features_employees_f723cd0f._.js.map
module.exports = [
"[project]/features/employees/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
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
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildAuditFields = (createdAt, createdBy = SEED_AUTHOR)=>({
        createdAt,
        updatedAt: createdAt,
        createdBy,
        updatedBy: createdBy
    });
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('1'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('2'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000003')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('3'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000004')),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('4'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('5'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('6'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('7'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('NV000007'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('8'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000009'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('9'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000010'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('10'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000011'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('11'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000012'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('12'),
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
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
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
}),
"[project]/features/employees/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "employeeRepository",
    ()=>employeeRepository,
    "useEmployeeStore",
    ()=>useEmployeeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$generator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/breadcrumb-generator.ts [app-ssr] (ecmascript)"); // ✅ NEW
var __TURBOPACK__imported__module__$5b$project$5d2f$repositories$2f$in$2d$memory$2d$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/repositories/in-memory-repository.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/activity-history-helper.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"], 'employees', {
    businessIdField: 'id',
    persistKey: 'hrm-employees',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
// ✅ Wrap add method to include activity history
const originalAdd = baseStore.getState().add;
const wrappedAdd = (item)=>{
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    const historyEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('created', `${userInfo.name} đã tạo hồ sơ nhân viên ${item.fullName} (${item.id})`, userInfo);
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
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
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
            historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('updated', `${userInfo.name} đã cập nhật ${label}: "${oldDisplay || '(trống)'}" → "${newDisplay}"`, userInfo, {
                field: key,
                oldValue,
                newValue
            }));
        }
    });
    // If status changed specifically
    if (updates.employmentStatus && updates.employmentStatus !== currentEmployee.employmentStatus) {
        historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('status_changed', `${userInfo.name} đã thay đổi trạng thái làm việc từ "${currentEmployee.employmentStatus}" thành "${updates.employmentStatus}"`, userInfo, {
            field: 'employmentStatus',
            oldValue: currentEmployee.employmentStatus,
            newValue: updates.employmentStatus
        }));
    }
    // If no specific changes tracked, add generic update entry
    if (historyEntries.length === 0) {
        historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('updated', `${userInfo.name} đã cập nhật thông tin nhân viên`, userInfo));
    }
    const updatedHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(currentEmployee.activityHistory, ...historyEntries);
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
const employeeRepository = (0, __TURBOPACK__imported__module__$5b$project$5d2f$repositories$2f$in$2d$memory$2d$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createInMemoryRepository"])(()=>baseStore.getState());
const persistence = {
    create: (payload)=>employeeRepository.create(payload),
    update: (systemId, payload)=>employeeRepository.update(systemId, payload),
    softDelete: (systemId)=>employeeRepository.softDelete(systemId),
    restore: (systemId)=>employeeRepository.restore(systemId),
    hardDelete: (systemId)=>employeeRepository.hardDelete(systemId)
};
// ✅ Register for breadcrumb auto-generation
(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$breadcrumb$2d$generator$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerBreadcrumbStore"])('employees', ()=>baseStore.getState());
// Augmented methods
const augmentedMethods = {
    // FIX: Changed `page: number = 1` to `page: number` to make it a required parameter, matching Combobox prop type.
    // ✅ CRITICAL FIX: Create fresh Fuse instance on each search to avoid stale data
    searchEmployees: async (query, page, limit = 20)=>{
        return new Promise((resolve)=>{
            setTimeout(()=>{
                const allEmployees = baseStore.getState().data;
                // ✅ Create fresh Fuse instance with current data
                const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](allEmployees, {
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
}),
"[project]/features/employees/api/employees-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/features/employees/hooks/use-employees.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/api/employees-api.ts [app-ssr] (ecmascript)");
// Re-export from use-all-employees for backward compatibility
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$all$2d$employees$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/hooks/use-all-employees.ts [app-ssr] (ecmascript)");
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.list(params),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchEmployees"])(params),
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
function useEmployee(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.detail(id),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchEmployee"])(id),
        enabled: !!id,
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000
    });
}
function useEmployeeSearch(query, limit = 20) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.search(query),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["searchEmployees"])(query, limit),
        enabled: query.length >= 2,
        staleTime: 30_000
    });
}
function useEmployeesByDepartment(departmentId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.byDepartment(departmentId),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchEmployeesByDepartment"])(departmentId),
        enabled: !!departmentId,
        staleTime: 60_000
    });
}
function useEmployeesByBranch(branchId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: employeeKeys.byBranch(branchId),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchEmployeesByBranch"])(branchId),
        enabled: !!branchId,
        staleTime: 60_000
    });
}
function useEmployeeMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createEmployee"],
        onSuccess: (data)=>{
            queryClient.invalidateQueries({
                queryKey: employeeKeys.lists()
            });
            options.onCreateSuccess?.(data);
        },
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateEmployee"],
        onSuccess: (data, variables)=>{
            queryClient.invalidateQueries({
                queryKey: employeeKeys.detail(variables.systemId)
            });
            queryClient.invalidateQueries({
                queryKey: employeeKeys.lists()
            });
            options.onUpdateSuccess?.(data);
        },
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteEmployee"],
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: employeeKeys.all
            });
            options.onDeleteSuccess?.();
        },
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
function useActiveEmployees(params = {}) {
    return useEmployees({
        ...params,
        status: 'active'
    });
}
function usePrefetchEmployee() {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (id)=>{
        queryClient.prefetchQuery({
            queryKey: employeeKeys.detail(id),
            queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$api$2f$employees$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchEmployee"])(id),
            staleTime: 60_000
        });
    };
}
;
}),
"[project]/features/employees/hooks/use-all-employees.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$employees$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/employees/hooks/use-employees.ts [app-ssr] (ecmascript) <locals>");
;
;
function useAllEmployees() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$hooks$2f$use$2d$employees$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEmployees"])({
        limit: 30
    });
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useActiveEmployees() {
    const { data, isLoading, isError, error } = useAllEmployees();
    const activeEmployees = data.filter((e)=>!e.isDeleted && e.isActive !== false);
    return {
        data: activeEmployees,
        isLoading,
        isError,
        error
    };
}
function useEmployeeOptions() {
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
function useEmployeeFinder() {
    const { data } = useAllEmployees();
    const findById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        if (!systemId) return undefined;
        return data.find((e)=>e.systemId === systemId);
    }, [
        data
    ]);
    return {
        findById
    };
}
function useEmployeeSearcher() {
    const { data } = useAllEmployees();
    const searchEmployees = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async (query, _page = 0, limit = 100)=>{
        const lowerQuery = query.toLowerCase();
        const filtered = data.filter((e)=>e.fullName?.toLowerCase().includes(lowerQuery) || e.id?.toLowerCase().includes(lowerQuery) || e.phone?.includes(query));
        return {
            items: filtered.slice(0, limit).map((e)=>({
                    value: e.systemId,
                    label: e.fullName || e.id || 'N/A'
                })),
            total: filtered.length,
            hasNextPage: filtered.length > limit
        };
    }, [
        data
    ]);
    return {
        searchEmployees
    };
}
}),
"[project]/features/products/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildAuditFields = (createdAt, createdBy = SEED_AUTHOR)=>({
        createdAt,
        updatedAt: createdAt,
        createdBy,
        updatedBy: createdBy
    });
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000001'),
        name: 'Laptop Dell Inspiron 15',
        thumbnailImage: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 12000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 15000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 50,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 30
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-01T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000002'),
        name: 'Chuột Logitech MX Master 3',
        thumbnailImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 1500000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 2000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 100,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 80
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-02T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000003'),
        name: 'Điện thoại iPhone 15 Pro',
        thumbnailImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 25000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 28000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 20,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 15
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-03T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000004'),
        name: 'Ốp lưng iPhone 15 Pro',
        thumbnailImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 200000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 300000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 200,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 150
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 2,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-04T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000005'),
        name: 'Máy tính bảng iPad Air',
        thumbnailImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 15000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 18000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 30,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 20
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000006'),
        name: 'Đồng hồ Apple Watch Series 9',
        thumbnailImage: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 10000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 12000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 40,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 25
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-06T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000007'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000007'),
        name: 'Tai nghe AirPods Pro',
        thumbnailImage: 'https://images.unsplash.com/photo-1519671282429-b44660ead0a7?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 5000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 6000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 60,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 40
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-07T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000008'),
        name: 'Bàn phím cơ Keychron K2',
        thumbnailImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 2000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 2500000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 35,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 25
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-08T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000009'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000009'),
        name: 'Keycap custom',
        thumbnailImage: 'https://images.unsplash.com/photo-1505740106531-4243f3831c78?auto=format&fit=crop&w=600&q=80',
        unit: 'Bộ',
        costPrice: 600000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 800000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 50,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 30
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-09T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000010'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000010'),
        name: 'Switch Gateron Yellow',
        thumbnailImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
        unit: 'Cái',
        costPrice: 3000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 5000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 500,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 300
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 90,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-10T08:00:00Z')
    },
    // ═══════════════════════════════════════════════════════════════
    // COMBO PRODUCTS - Sản phẩm bundle
    // ═══════════════════════════════════════════════════════════════
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000011'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('COMBO001'),
        name: 'Combo Bàn phím + Keycap + Switch',
        thumbnailImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
        shortDescription: 'Bộ combo custom keyboard siêu hot',
        type: 'combo',
        unit: 'Bộ',
        costPrice: 0,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 3000000
        },
        inventoryByBranch: {},
        committedByBranch: {},
        inTransitByBranch: {},
        // Combo items: Bàn phím (1) + Keycap (1) + Switch (90 cái)
        comboItems: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000008'),
                quantity: 1
            },
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000009'),
                quantity: 1
            },
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000010'),
                quantity: 90
            }
        ],
        comboPricingType: 'sum_discount_percent',
        comboDiscount: 10,
        status: 'active',
        ...buildAuditFields('2024-06-01T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000012'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('COMBO002'),
        name: 'Combo iPhone + Ốp lưng',
        thumbnailImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
        shortDescription: 'Mua iPhone kèm ốp lưng giá ưu đãi',
        type: 'combo',
        unit: 'Bộ',
        costPrice: 0,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 27500000
        },
        inventoryByBranch: {},
        committedByBranch: {},
        inTransitByBranch: {},
        comboItems: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000003'),
                quantity: 1
            },
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000004'),
                quantity: 1
            }
        ],
        comboPricingType: 'sum_discount_amount',
        comboDiscount: 800000,
        status: 'active',
        ...buildAuditFields('2024-06-15T08:00:00Z')
    }
];
}),
"[project]/features/products/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductStore",
    ()=>useProductStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/activity-history-helper.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"], 'products', {
    businessIdField: 'id',
    persistKey: 'hrm-products',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
// Helper to check if product tracks stock
const canModifyStock = (product)=>{
    if (!product) return false;
    // Services, digital products, and combos don't track stock directly
    if (product.type === 'service' || product.type === 'digital' || product.type === 'combo') return false;
    // Explicitly disabled stock tracking
    if (product.isStockTracked === false) return false;
    return true;
};
// Define custom methods
const updateInventory = (productSystemId, branchSystemId, quantityChange)=>{
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!product) return state;
        // Skip if product doesn't track stock
        if (!canModifyStock(product)) {
            console.warn(`[updateInventory] Skipped: Product ${productSystemId} does not track stock`);
            return state;
        }
        const oldQuantity = product.inventoryByBranch?.[branchSystemId] || 0;
        const newQuantity = oldQuantity + quantityChange;
        // ✅ Removed COMPLAINT_ADJUSTMENT stock history creation
        // Stock history will be created by inventory check balance instead
        return {
            data: state.data.map((p)=>{
                if (p.systemId === productSystemId) {
                    const newInventoryByBranch = {
                        ...p.inventoryByBranch
                    };
                    newInventoryByBranch[branchSystemId] = newQuantity;
                    return {
                        ...p,
                        inventoryByBranch: newInventoryByBranch
                    };
                }
                return p;
            })
        };
    });
};
const commitStock = (productSystemId, branchSystemId, quantity)=>{
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!canModifyStock(product)) {
            console.warn(`[commitStock] Skipped: Product ${productSystemId} does not track stock`);
            return state;
        }
        return {
            data: state.data.map((p)=>{
                if (p.systemId === productSystemId) {
                    const newCommitted = {
                        ...p.committedByBranch
                    };
                    newCommitted[branchSystemId] = (newCommitted[branchSystemId] || 0) + quantity;
                    return {
                        ...p,
                        committedByBranch: newCommitted
                    };
                }
                return p;
            })
        };
    });
};
const uncommitStock = (productSystemId, branchSystemId, quantity)=>{
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!canModifyStock(product)) {
            console.warn(`[uncommitStock] Skipped: Product ${productSystemId} does not track stock`);
            return state;
        }
        return {
            data: state.data.map((p)=>{
                if (p.systemId === productSystemId) {
                    const newCommitted = {
                        ...p.committedByBranch
                    };
                    newCommitted[branchSystemId] = Math.max(0, (newCommitted[branchSystemId] || 0) - quantity);
                    return {
                        ...p,
                        committedByBranch: newCommitted
                    };
                }
                return p;
            })
        };
    });
};
const dispatchStock = (productSystemId, branchSystemId, quantity)=>{
    console.log('🔴 [dispatchStock] Called with:', {
        productSystemId,
        branchSystemId,
        quantity
    });
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!product) {
            console.error('❌ [dispatchStock] Product not found:', productSystemId);
            return state;
        }
        // Skip if product doesn't track stock
        if (!canModifyStock(product)) {
            console.warn(`[dispatchStock] Skipped: Product ${productSystemId} does not track stock`);
            return state;
        }
        console.log('📦 [dispatchStock] Current inventory:', product.inventoryByBranch);
        console.log('📦 [dispatchStock] Current committed:', product.committedByBranch);
        return {
            data: state.data.map((product)=>{
                if (product.systemId === productSystemId) {
                    const newInventory = {
                        ...product.inventoryByBranch
                    };
                    const oldInventory = newInventory[branchSystemId] || 0;
                    newInventory[branchSystemId] = oldInventory - quantity;
                    const newCommitted = {
                        ...product.committedByBranch
                    };
                    newCommitted[branchSystemId] = Math.max(0, (newCommitted[branchSystemId] || 0) - quantity);
                    const newInTransit = {
                        ...product.inTransitByBranch
                    };
                    newInTransit[branchSystemId] = (newInTransit[branchSystemId] || 0) + quantity;
                    console.log('✅ [dispatchStock] Updated inventory:', {
                        old: oldInventory,
                        new: newInventory[branchSystemId],
                        change: -quantity
                    });
                    return {
                        ...product,
                        inventoryByBranch: newInventory,
                        committedByBranch: newCommitted,
                        inTransitByBranch: newInTransit
                    };
                }
                return product;
            })
        };
    });
    console.log('✅ [dispatchStock] Completed');
};
const completeDelivery = (productSystemId, branchSystemId, quantity)=>{
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!canModifyStock(product)) {
            return state;
        }
        return {
            data: state.data.map((p)=>{
                if (p.systemId === productSystemId) {
                    const newInTransit = {
                        ...p.inTransitByBranch
                    };
                    newInTransit[branchSystemId] = Math.max(0, (newInTransit[branchSystemId] || 0) - quantity);
                    return {
                        ...p,
                        inTransitByBranch: newInTransit
                    };
                }
                return p;
            })
        };
    });
};
const returnStockFromTransit = (productSystemId, branchSystemId, quantity)=>{
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!canModifyStock(product)) {
            return state;
        }
        return {
            data: state.data.map((p)=>{
                if (p.systemId === productSystemId) {
                    const newInTransit = {
                        ...p.inTransitByBranch
                    };
                    newInTransit[branchSystemId] = Math.max(0, (newInTransit[branchSystemId] || 0) - quantity);
                    const newInventory = {
                        ...p.inventoryByBranch
                    };
                    newInventory[branchSystemId] = (newInventory[branchSystemId] || 0) + quantity;
                    return {
                        ...p,
                        inventoryByBranch: newInventory,
                        inTransitByBranch: newInTransit
                    };
                }
                return p;
            })
        };
    });
};
const updateLastPurchasePrice = (productSystemId, price, date)=>{
    baseStore.setState((state)=>({
            data: state.data.map((product)=>{
                if (product.systemId === productSystemId) {
                    // Only update if the new date is newer or equal to the existing lastPurchaseDate
                    const existingDate = product.lastPurchaseDate ? new Date(product.lastPurchaseDate).getTime() : 0;
                    const newDateTs = new Date(date).getTime();
                    if (newDateTs >= existingDate) {
                        return {
                            ...product,
                            lastPurchasePrice: price,
                            lastPurchaseDate: date
                        };
                    }
                }
                return product;
            })
        }));
};
const searchProducts = async (query, page = 1, limit = 10)=>{
    const allProducts = baseStore.getState().data;
    // ✅ Create fresh Fuse instance with current data (avoid stale data)
    const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](allProducts, {
        keys: [
            'name',
            'id',
            'sku',
            'barcode'
        ],
        threshold: 0.3
    });
    const results = fuse.search(query);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);
    return {
        items: paginatedResults.map((result)=>({
                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(result.item.systemId),
                label: `${result.item.name} (${result.item.id})`
            })),
        hasNextPage: endIndex < results.length
    };
};
// Wrapped add method with activity history logging
const addProduct = (product)=>{
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    const newProduct = baseStore.getState().add(product);
    // Add activity history entry
    const historyEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCreatedEntry"])(userInfo, `${userInfo.name} đã tạo sản phẩm ${newProduct.name} (${newProduct.id})`);
    baseStore.getState().update(newProduct.systemId, {
        ...newProduct,
        activityHistory: [
            historyEntry
        ]
    });
    return newProduct;
};
// Wrapped update method with activity history logging
const updateProduct = (systemId, updatedProduct)=>{
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    const existingProduct = baseStore.getState().data.find((p)=>p.systemId === systemId);
    const historyEntries = [];
    if (existingProduct) {
        // Track status changes
        if (existingProduct.status !== updatedProduct.status) {
            const statusLabels = {
                'active': 'Đang kinh doanh',
                'inactive': 'Ngừng kinh doanh',
                'discontinued': 'Ngừng sản xuất'
            };
            historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createStatusChangedEntry"])(userInfo, statusLabels[existingProduct.status || 'active'], statusLabels[updatedProduct.status || 'active'], `${userInfo.name} đã đổi trạng thái từ "${statusLabels[existingProduct.status || 'active']}" sang "${statusLabels[updatedProduct.status || 'active']}"`));
        }
        // Track field changes
        const fieldsToTrack = [
            {
                key: 'name',
                label: 'Tên sản phẩm'
            },
            {
                key: 'id',
                label: 'Mã SKU'
            },
            {
                key: 'description',
                label: 'Mô tả'
            },
            {
                key: 'shortDescription',
                label: 'Mô tả ngắn'
            },
            {
                key: 'type',
                label: 'Loại sản phẩm'
            },
            {
                key: 'categorySystemId',
                label: 'Danh mục'
            },
            {
                key: 'brandSystemId',
                label: 'Thương hiệu'
            },
            {
                key: 'unit',
                label: 'Đơn vị tính'
            },
            {
                key: 'costPrice',
                label: 'Giá vốn'
            },
            {
                key: 'minPrice',
                label: 'Giá tối thiểu'
            },
            {
                key: 'barcode',
                label: 'Mã vạch'
            },
            {
                key: 'primarySupplierSystemId',
                label: 'Nhà cung cấp chính'
            },
            {
                key: 'warrantyPeriodMonths',
                label: 'Thời hạn bảo hành'
            },
            {
                key: 'reorderLevel',
                label: 'Mức đặt hàng lại'
            },
            {
                key: 'safetyStock',
                label: 'Tồn kho an toàn'
            },
            {
                key: 'maxStock',
                label: 'Tồn kho tối đa'
            }
        ];
        const changes = [];
        for (const field of fieldsToTrack){
            const oldVal = existingProduct[field.key];
            const newVal = updatedProduct[field.key];
            if (oldVal !== newVal && !(oldVal === undefined && newVal === undefined)) {
                if (field.key === 'status') continue;
                const oldDisplay = oldVal !== undefined && oldVal !== null && oldVal !== '' ? String(oldVal) : '(trống)';
                const newDisplay = newVal !== undefined && newVal !== null && newVal !== '' ? String(newVal) : '(trống)';
                changes.push(`${field.label}: ${oldDisplay} → ${newDisplay}`);
            }
        }
        // Track price changes separately
        if (existingProduct.costPrice !== updatedProduct.costPrice) {
            changes.push(`Giá vốn: ${existingProduct.costPrice?.toLocaleString('vi-VN')} → ${updatedProduct.costPrice?.toLocaleString('vi-VN')}`);
        }
        if (changes.length > 0) {
            historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createUpdatedEntry"])(userInfo, `${userInfo.name} đã cập nhật: ${changes.join(', ')}`));
        }
    }
    const productWithHistory = {
        ...updatedProduct,
        activityHistory: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(existingProduct?.activityHistory, ...historyEntries)
    };
    baseStore.getState().update(systemId, productWithHistory);
};
const useProductStore = ()=>{
    const state = baseStore();
    return {
        ...state,
        add: addProduct,
        update: updateProduct,
        updateInventory,
        commitStock,
        uncommitStock,
        dispatchStock,
        completeDelivery,
        returnStockFromTransit,
        updateLastPurchasePrice,
        searchProducts
    };
};
// Export getState method for non-hook usage
useProductStore.getState = ()=>{
    const state = baseStore.getState();
    return {
        ...state,
        add: addProduct,
        update: updateProduct,
        updateInventory,
        commitStock,
        uncommitStock,
        dispatchStock,
        completeDelivery,
        returnStockFromTransit,
        updateLastPurchasePrice,
        searchProducts
    };
};
useProductStore.subscribe = baseStore.subscribe;
}),
"[project]/features/products/combo-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Combo Product Utilities
 * ═══════════════════════════════════════════════════════════════
 * Tham khảo: Sapo Combo
 * - Combo không có tồn kho riêng
 * - Tồn kho combo = MIN(tồn kho SP con / số lượng trong combo)
 * - Tối đa 20 sản phẩm con
 * - Không cho phép combo lồng combo
 * ═══════════════════════════════════════════════════════════════
 */ __turbopack_context__.s([
    "MAX_COMBO_ITEMS",
    ()=>MAX_COMBO_ITEMS,
    "MIN_COMBO_ITEMS",
    ()=>MIN_COMBO_ITEMS,
    "calculateComboCostPrice",
    ()=>calculateComboCostPrice,
    "calculateComboLastPurchasePrice",
    ()=>calculateComboLastPurchasePrice,
    "calculateComboMinPrice",
    ()=>calculateComboMinPrice,
    "calculateComboPrice",
    ()=>calculateComboPrice,
    "calculateComboPricesByPolicy",
    ()=>calculateComboPricesByPolicy,
    "calculateComboStock",
    ()=>calculateComboStock,
    "calculateComboStockAllBranches",
    ()=>calculateComboStockAllBranches,
    "calculateFinalComboPricesByPolicy",
    ()=>calculateFinalComboPricesByPolicy,
    "canAddToCombo",
    ()=>canAddToCombo,
    "getComboBottleneckProducts",
    ()=>getComboBottleneckProducts,
    "getComboSummary",
    ()=>getComboSummary,
    "hasComboStock",
    ()=>hasComboStock,
    "isComboProduct",
    ()=>isComboProduct,
    "validateComboItems",
    ()=>validateComboItems
]);
const MAX_COMBO_ITEMS = 20;
const MIN_COMBO_ITEMS = 2;
function isComboProduct(product) {
    return product.type === 'combo';
}
function canAddToCombo(product) {
    if (product.type === 'combo') return false;
    if (product.status === 'discontinued') return false;
    if (product.isDeleted) return false;
    return true;
}
function validateComboItems(comboItems, allProducts) {
    // Check minimum items
    if (comboItems.length < MIN_COMBO_ITEMS) {
        return `Combo phải có ít nhất ${MIN_COMBO_ITEMS} sản phẩm`;
    }
    // Check maximum items
    if (comboItems.length > MAX_COMBO_ITEMS) {
        return `Combo chỉ được tối đa ${MAX_COMBO_ITEMS} sản phẩm`;
    }
    // Check for duplicate products
    const productIds = comboItems.map((item)=>item.productSystemId);
    const uniqueIds = new Set(productIds);
    if (uniqueIds.size !== productIds.length) {
        return 'Combo không được chứa sản phẩm trùng lặp';
    }
    // Check each item
    for (const item of comboItems){
        // Check quantity
        if (item.quantity < 1) {
            return 'Số lượng sản phẩm trong combo phải >= 1';
        }
        if (!Number.isInteger(item.quantity)) {
            return 'Số lượng sản phẩm trong combo phải là số nguyên';
        }
        // Check product exists and is valid
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) {
            return 'Sản phẩm trong combo không tồn tại';
        }
        if (!canAddToCombo(product)) {
            return `Sản phẩm "${product.name}" không thể thêm vào combo`;
        }
    }
    return null;
}
function calculateComboStock(comboItems, allProducts, branchSystemId) {
    if (!comboItems || comboItems.length === 0) return 0;
    let minComboQuantity = Infinity;
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) return 0; // If any product not found, combo unavailable
        // Available = On-hand - Committed
        const onHand = product.inventoryByBranch?.[branchSystemId] || 0;
        const committed = product.committedByBranch?.[branchSystemId] || 0;
        const available = onHand - committed;
        // How many combos can we make from this product?
        const comboQuantityFromThisProduct = Math.floor(available / item.quantity);
        minComboQuantity = Math.min(minComboQuantity, comboQuantityFromThisProduct);
    }
    return minComboQuantity === Infinity ? 0 : Math.max(0, minComboQuantity);
}
function calculateComboStockAllBranches(comboItems, allProducts) {
    if (!comboItems || comboItems.length === 0) return {};
    // Collect all branch IDs from child products
    const allBranchIds = new Set();
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (product?.inventoryByBranch) {
            Object.keys(product.inventoryByBranch).forEach((branchId)=>{
                allBranchIds.add(branchId);
            });
        }
    }
    // Calculate stock for each branch
    const result = {};
    for (const branchId of allBranchIds){
        result[branchId] = calculateComboStock(comboItems, allProducts, branchId);
    }
    return result;
}
function calculateComboPrice(comboItems, allProducts, pricingPolicySystemId, comboPricingType, comboDiscount = 0) {
    if (comboPricingType === 'fixed') {
        // Fixed price is stored directly, not calculated
        return comboDiscount; // In fixed mode, comboDiscount IS the price
    }
    // Calculate sum of child products' prices
    let sumPrice = 0;
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) continue;
        const unitPrice = product.prices?.[pricingPolicySystemId] || 0;
        sumPrice += unitPrice * item.quantity;
    }
    // Apply discount
    if (comboPricingType === 'sum_discount_percent') {
        const discountAmount = sumPrice * (comboDiscount / 100);
        return Math.round(sumPrice - discountAmount);
    }
    if (comboPricingType === 'sum_discount_amount') {
        return Math.max(0, sumPrice - comboDiscount);
    }
    return sumPrice;
}
const isNumber = (value)=>typeof value === 'number' && Number.isFinite(value);
function calculateComboCostPrice(comboItems, allProducts, options = {}) {
    const { fallbackPricingPolicyId, allowPriceFallback = true } = options;
    let totalCost = 0;
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) continue;
        let unitCost = product.costPrice;
        if (!isNumber(unitCost) && isNumber(product.lastPurchasePrice)) {
            unitCost = product.lastPurchasePrice;
        }
        if (!isNumber(unitCost) && allowPriceFallback) {
            if (fallbackPricingPolicyId && isNumber(product.prices?.[fallbackPricingPolicyId])) {
                unitCost = product.prices[fallbackPricingPolicyId];
            }
            if (!isNumber(unitCost)) {
                const firstPrice = Object.values(product.prices || {}).find((price)=>isNumber(price));
                if (isNumber(firstPrice)) {
                    unitCost = firstPrice;
                }
            }
        }
        if (!isNumber(unitCost) && isNumber(product.minPrice)) {
            unitCost = product.minPrice;
        }
        totalCost += (unitCost || 0) * item.quantity;
    }
    return totalCost;
}
function calculateComboLastPurchasePrice(comboItems, allProducts) {
    let total = 0;
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) continue;
        total += (product.lastPurchasePrice || 0) * item.quantity;
    }
    return total;
}
function calculateComboMinPrice(comboItems, allProducts) {
    let total = 0;
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) continue;
        total += (product.minPrice || 0) * item.quantity;
    }
    return total;
}
function calculateComboPricesByPolicy(comboItems, allProducts) {
    const pricesByPolicy = {};
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product || !product.prices) continue;
        for (const [policyId, price] of Object.entries(product.prices)){
            if (!pricesByPolicy[policyId]) {
                pricesByPolicy[policyId] = 0;
            }
            pricesByPolicy[policyId] += (price || 0) * item.quantity;
        }
    }
    return pricesByPolicy;
}
function calculateFinalComboPricesByPolicy(comboItems, allProducts, comboPricingType, comboDiscount = 0, _defaultPolicyId) {
    // Get raw sum prices first
    const rawPricesByPolicy = calculateComboPricesByPolicy(comboItems, allProducts);
    const finalPricesByPolicy = {};
    if (comboPricingType === 'fixed') {
        // For fixed pricing, only policies that exist on child products should be auto-filled.
        for (const policyId of Object.keys(rawPricesByPolicy)){
            finalPricesByPolicy[policyId] = comboDiscount; // comboDiscount IS the price in fixed mode
        }
        return finalPricesByPolicy;
    }
    // For discount-based pricing, apply discount to each policy's sum
    for (const [policyId, sumPrice] of Object.entries(rawPricesByPolicy)){
        if (comboPricingType === 'sum_discount_percent') {
            const discountAmount = sumPrice * (comboDiscount / 100);
            finalPricesByPolicy[policyId] = Math.round(sumPrice - discountAmount);
        } else if (comboPricingType === 'sum_discount_amount') {
            finalPricesByPolicy[policyId] = Math.max(0, sumPrice - comboDiscount);
        } else {
            // No discount, use raw sum
            finalPricesByPolicy[policyId] = sumPrice;
        }
    }
    return finalPricesByPolicy;
}
function getComboSummary(comboItems, allProducts, branchSystemId) {
    const itemCount = comboItems?.length || 0;
    if (!branchSystemId) {
        return `${itemCount} sản phẩm`;
    }
    const stock = calculateComboStock(comboItems, allProducts, branchSystemId);
    return `${itemCount} sản phẩm, tồn kho: ${stock}`;
}
function hasComboStock(comboItems, allProducts, branchSystemId, requiredQuantity) {
    const available = calculateComboStock(comboItems, allProducts, branchSystemId);
    return available >= requiredQuantity;
}
function getComboBottleneckProducts(comboItems, allProducts, branchSystemId) {
    if (!comboItems || comboItems.length === 0) return [];
    const comboStock = calculateComboStock(comboItems, allProducts, branchSystemId);
    const bottlenecks = [];
    for (const item of comboItems){
        const product = allProducts.find((p)=>p.systemId === item.productSystemId);
        if (!product) continue;
        const onHand = product.inventoryByBranch?.[branchSystemId] || 0;
        const committed = product.committedByBranch?.[branchSystemId] || 0;
        const available = onHand - committed;
        const comboQuantityFromThisProduct = Math.floor(available / item.quantity);
        // This product is a bottleneck if it limits the combo quantity
        if (comboQuantityFromThisProduct === comboStock) {
            bottlenecks.push({
                product,
                availableForCombo: comboQuantityFromThisProduct,
                itemQuantity: item.quantity
            });
        }
    }
    return bottlenecks;
}
}),
"[project]/features/products/api/products-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Products API - Isolated API functions
 * 
 * ⚠️ IMPORTANT: This file should ONLY contain:
 * - Fetch functions
 * - Type imports from ../types
 * - NO store imports
 * - NO cross-feature imports
 */ __turbopack_context__.s([
    "createProduct",
    ()=>createProduct,
    "deleteProduct",
    ()=>deleteProduct,
    "fetchProduct",
    ()=>fetchProduct,
    "fetchProductInventory",
    ()=>fetchProductInventory,
    "fetchProducts",
    ()=>fetchProducts,
    "searchProducts",
    ()=>searchProducts,
    "updateProduct",
    ()=>updateProduct
]);
const API_BASE = '/api/products';
async function fetchProducts(params = {}) {
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
        throw new Error(`Failed to fetch products: ${res.statusText}`);
    }
    return res.json();
}
async function fetchProduct(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch product ${id}: ${res.statusText}`);
    }
    return res.json();
}
async function createProduct(data) {
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
        throw new Error(error.message || `Failed to create product: ${res.statusText}`);
    }
    return res.json();
}
async function updateProduct({ systemId, ...data }) {
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
        throw new Error(error.message || `Failed to update product: ${res.statusText}`);
    }
    return res.json();
}
async function deleteProduct(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || `Failed to delete product: ${res.statusText}`);
    }
}
async function searchProducts(query, limit = 20) {
    const res = await fetch(`${API_BASE}?search=${encodeURIComponent(query)}&limit=${limit}`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to search products: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data || [];
}
async function fetchProductInventory(productId) {
    const res = await fetch(`${API_BASE}/${productId}/inventory`, {
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch product inventory: ${res.statusText}`);
    }
    return res.json();
}
}),
"[project]/features/products/hooks/use-products.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "productKeys",
    ()=>productKeys,
    "useActiveProducts",
    ()=>useActiveProducts,
    "useProduct",
    ()=>useProduct,
    "useProductInventory",
    ()=>useProductInventory,
    "useProductMutations",
    ()=>useProductMutations,
    "useProductSearch",
    ()=>useProductSearch,
    "useProducts",
    ()=>useProducts,
    "useProductsByBrand",
    ()=>useProductsByBrand,
    "useProductsByCategory",
    ()=>useProductsByCategory
]);
/**
 * useProducts - React Query hooks for products
 * 
 * ⚠️ IMPORTANT: Direct import pattern
 * - Import this file directly: import { useProducts } from '@/features/products/hooks/use-products'
 * - NEVER import from '@/features/products' or '@/features/products/store'
 * 
 * This hook is ISOLATED - it only depends on:
 * - @tanstack/react-query
 * - Local API functions
 * - Local types
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/api/products-api.ts [app-ssr] (ecmascript)");
;
;
const productKeys = {
    all: [
        'products'
    ],
    lists: ()=>[
            ...productKeys.all,
            'list'
        ],
    list: (params)=>[
            ...productKeys.lists(),
            params
        ],
    details: ()=>[
            ...productKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...productKeys.details(),
            id
        ],
    search: (query)=>[
            ...productKeys.all,
            'search',
            query
        ],
    inventory: (id)=>[
            ...productKeys.all,
            'inventory',
            id
        ]
};
function useProducts(params = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: productKeys.list(params),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchProducts"])(params),
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
function useProduct(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: productKeys.detail(id),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchProduct"])(id),
        enabled: !!id,
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000
    });
}
function useProductSearch(query, limit = 20) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: productKeys.search(query),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["searchProducts"])(query, limit),
        enabled: query.length >= 2,
        staleTime: 30_000
    });
}
function useProductInventory(productId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: productKeys.inventory(productId),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchProductInventory"])(productId),
        enabled: !!productId,
        staleTime: 30_000
    });
}
function useProductMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createProduct"],
        onSuccess: (data)=>{
            queryClient.invalidateQueries({
                queryKey: productKeys.lists()
            });
            options.onCreateSuccess?.(data);
        },
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProduct"],
        onSuccess: (data, variables)=>{
            queryClient.invalidateQueries({
                queryKey: productKeys.detail(variables.systemId)
            });
            queryClient.invalidateQueries({
                queryKey: productKeys.lists()
            });
            options.onUpdateSuccess?.(data);
        },
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$api$2f$products$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteProduct"],
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: productKeys.all
            });
            options.onDeleteSuccess?.();
        },
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
function useProductsByCategory(categoryId) {
    return useProducts({
        categoryId: categoryId || undefined,
        limit: 100
    });
}
function useProductsByBrand(brandId) {
    return useProducts({
        brandId: brandId || undefined,
        limit: 100
    });
}
function useActiveProducts(params = {}) {
    return useProducts({
        ...params,
        status: 'active'
    });
}
}),
"[project]/features/products/hooks/use-all-products.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useActiveProducts",
    ()=>useActiveProducts,
    "useAllProducts",
    ()=>useAllProducts,
    "useProductFinder",
    ()=>useProductFinder
]);
/**
 * useAllProducts - Convenience hook for components needing all products as flat array
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/hooks/use-products.ts [app-ssr] (ecmascript)");
;
;
function useAllProducts() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProducts"])({
        limit: 50
    });
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useActiveProducts() {
    const { data, isLoading } = useAllProducts();
    const activeProducts = data.filter((p)=>!p.isDeleted && p.isActive !== false);
    return {
        data: activeProducts,
        isLoading
    };
}
function useProductFinder() {
    const { data } = useAllProducts();
    const findById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        if (!systemId) return undefined;
        return data.find((p)=>p.systemId === systemId);
    }, [
        data
    ]);
    return {
        findById
    };
}
}),
"[project]/features/products/image-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getProductImageUrl",
    ()=>getProductImageUrl,
    "useImageStore",
    ()=>useImageStore
]);
/**
 * Product Image Store
 * 
 * Quản lý staging images và permanent images cho products
 * Tương tự như document-store.ts của Employee
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
;
const useImageStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        stagingImages: {},
        permanentImages: {},
        permanentMeta: {},
        updateStagingImage: (productSystemId, type, files, sessionId)=>{
            const key = `${productSystemId}-${type}`;
            set((state)=>({
                    stagingImages: {
                        ...state.stagingImages,
                        [key]: {
                            type,
                            sessionId,
                            files
                        }
                    }
                }));
        },
        clearStagingImages: (productSystemId)=>{
            if (productSystemId) {
                set((state)=>{
                    const filtered = Object.entries(state.stagingImages).filter(([key])=>!key.startsWith(productSystemId));
                    return {
                        stagingImages: Object.fromEntries(filtered)
                    };
                });
            } else {
                set({
                    stagingImages: {}
                });
            }
        },
        updatePermanentImages: (productSystemId, type, files, fetchedAt)=>{
            set((state)=>{
                const existing = state.permanentImages[productSystemId] || {
                    thumbnail: [],
                    gallery: []
                };
                const timestamp = fetchedAt ?? Date.now();
                return {
                    permanentImages: {
                        ...state.permanentImages,
                        [productSystemId]: {
                            ...existing,
                            [type]: files
                        }
                    },
                    permanentMeta: {
                        ...state.permanentMeta,
                        [productSystemId]: {
                            lastFetched: timestamp
                        }
                    }
                };
            });
        },
        clearPermanentImages: (productSystemId)=>{
            set((state)=>{
                const { [productSystemId]: _, ...rest } = state.permanentImages;
                const { [productSystemId]: __, ...restMeta } = state.permanentMeta;
                return {
                    permanentImages: rest,
                    permanentMeta: restMeta
                };
            });
        },
        getStagingImages: (productSystemId, type)=>{
            const key = `${productSystemId}-${type}`;
            return get().stagingImages[key]?.files || [];
        },
        getPermanentImages: (productSystemId, type)=>{
            return get().permanentImages[productSystemId]?.[type] || [];
        },
        getSessionId: (productSystemId, type)=>{
            const key = `${productSystemId}-${type}`;
            return get().stagingImages[key]?.sessionId;
        }
    }));
function getProductImageUrl(product, serverThumbnail, serverGallery) {
    // Ưu tiên 1: Ảnh từ server (upload thực)
    if (serverThumbnail) return serverThumbnail;
    if (serverGallery) return serverGallery;
    // Ưu tiên 2: Ảnh từ product data
    if (!product) return undefined;
    return product.thumbnailImage || product.galleryImages?.[0] || product.images?.[0];
}
}),
"[project]/features/products/components/product-image.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductImage",
    ()=>ProductImage,
    "useProductImage",
    ()=>useProductImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * ProductImage Component
 * 
 * Component hiển thị ảnh sản phẩm với logic ưu tiên:
 * 1. Ảnh từ server (upload thực) - ưu tiên cao nhất
 * 2. Ảnh từ product data (mock/seed)
 * 3. Icon placeholder nếu không có ảnh
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/image-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$upload$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/file-upload-api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$lazy$2d$image$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/lazy-image.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
};
const iconSizes = {
    xs: 'h-4 w-4',
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
};
function ProductImage({ productSystemId, productData, alt, size = 'md', className }) {
    // Get image from store (server images)
    const permanentImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useImageStore"])((state)=>state.permanentImages[productSystemId]);
    const lastFetched = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useImageStore"])((state)=>state.permanentMeta[productSystemId]?.lastFetched);
    const updatePermanentImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useImageStore"])((state)=>state.updatePermanentImages);
    const storeThumbnail = permanentImages?.thumbnail?.[0]?.url;
    const storeGallery = permanentImages?.gallery?.[0]?.url;
    // ✅ Ưu tiên ảnh từ server trước, sau đó mới đến product data
    const displayImage = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        // 1. Ảnh từ server (ưu tiên cao nhất)
        if (storeThumbnail) return storeThumbnail;
        if (storeGallery) return storeGallery;
        // 2. Ảnh từ product data (mock/seed)
        if (!productData) return undefined;
        return productData.thumbnailImage || productData.galleryImages?.[0] || productData.images?.[0];
    }, [
        storeThumbnail,
        storeGallery,
        productData
    ]);
    // Fetch image from server if not yet fetched
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (!lastFetched && productSystemId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$upload$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FileUploadAPI"].getProductFiles(productSystemId).then((files)=>{
                if (!files || !Array.isArray(files)) return;
                const mapToServerFile = (f)=>({
                        id: f.id,
                        sessionId: '',
                        name: f.name,
                        originalName: f.originalName,
                        slug: f.slug,
                        filename: f.filename,
                        size: f.size,
                        type: f.type,
                        url: f.url,
                        status: 'permanent',
                        uploadedAt: f.uploadedAt,
                        metadata: f.metadata
                    });
                const thumbnailFiles = files.filter((f)=>f.documentName === 'thumbnail').map(mapToServerFile);
                const galleryFiles = files.filter((f)=>f.documentName === 'gallery').map(mapToServerFile);
                updatePermanentImages(productSystemId, 'thumbnail', thumbnailFiles);
                updatePermanentImages(productSystemId, 'gallery', galleryFiles);
            }).catch((err)=>console.error("Failed to load product image", err));
        }
    }, [
        productSystemId,
        lastFetched,
        updatePermanentImages
    ]);
    const sizeClass = sizeClasses[size];
    const iconSize = iconSizes[size];
    const displayAlt = alt || productData?.name || 'Product';
    if (displayImage) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(sizeClass, "flex-shrink-0 rounded overflow-hidden bg-muted", className),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$lazy$2d$image$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LazyImage"], {
                src: displayImage,
                alt: displayAlt,
                className: "w-full h-full object-cover"
            }, void 0, false, {
                fileName: "[project]/features/products/components/product-image.tsx",
                lineNumber: 122,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/features/products/components/product-image.tsx",
            lineNumber: 121,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(sizeClass, "flex-shrink-0 bg-muted rounded flex items-center justify-center", className),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(iconSize, "text-muted-foreground")
        }, void 0, false, {
            fileName: "[project]/features/products/components/product-image.tsx",
            lineNumber: 133,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/products/components/product-image.tsx",
        lineNumber: 132,
        columnNumber: 5
    }, this);
}
function useProductImage(productSystemId, productData) {
    const permanentImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useImageStore"])((state)=>state.permanentImages[productSystemId]);
    const lastFetched = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useImageStore"])((state)=>state.permanentMeta[productSystemId]?.lastFetched);
    const updatePermanentImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$image$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useImageStore"])((state)=>state.updatePermanentImages);
    const storeThumbnail = permanentImages?.thumbnail?.[0]?.url;
    const storeGallery = permanentImages?.gallery?.[0]?.url;
    // Fetch if needed
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (!lastFetched && productSystemId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$file$2d$upload$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FileUploadAPI"].getProductFiles(productSystemId).then((files)=>{
                if (!files || !Array.isArray(files)) return;
                const mapToServerFile = (f)=>({
                        id: f.id,
                        sessionId: '',
                        name: f.name,
                        originalName: f.originalName,
                        slug: f.slug,
                        filename: f.filename,
                        size: f.size,
                        type: f.type,
                        url: f.url,
                        status: 'permanent',
                        uploadedAt: f.uploadedAt,
                        metadata: f.metadata
                    });
                const thumbnailFiles = files.filter((f)=>f.documentName === 'thumbnail').map(mapToServerFile);
                const galleryFiles = files.filter((f)=>f.documentName === 'gallery').map(mapToServerFile);
                updatePermanentImages(productSystemId, 'thumbnail', thumbnailFiles);
                updatePermanentImages(productSystemId, 'gallery', galleryFiles);
            }).catch(()=>{});
        }
    }, [
        productSystemId,
        lastFetched,
        updatePermanentImages
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        // 1. Ảnh từ server (ưu tiên cao nhất)
        if (storeThumbnail) return storeThumbnail;
        if (storeGallery) return storeGallery;
        // 2. Ảnh từ product data
        if (!productData) return undefined;
        return productData.thumbnailImage || productData.galleryImages?.[0] || productData.images?.[0];
    }, [
        storeThumbnail,
        storeGallery,
        productData
    ]);
}
}),
"[project]/features/stock-history/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildAuditFields = (createdAt, createdBy = SEED_AUTHOR)=>({
        createdAt,
        updatedAt: createdAt,
        createdBy,
        updatedBy: createdBy
    });
const rawData = [
    // PROD000001 - Laptop Dell Inspiron 15 (Khởi tạo: CN000001=50, CN000002=30)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000001'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000001'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 50,
        newStockLevel: 50,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000001'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000002'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000001'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 30,
        newStockLevel: 30,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000001'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000003'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000001'),
        date: '2025-11-01T09:30:00Z',
        employeeName: 'Trần Thị B',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -1,
        newStockLevel: 49,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000001'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000002 - Chuột Logitech MX Master 3 (Khởi tạo: CN000001=100, CN000002=80)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000004'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000002'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 100,
        newStockLevel: 100,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000002'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000005'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000002'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 80,
        newStockLevel: 80,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000002'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000006'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000002'),
        date: '2025-11-01T09:30:00Z',
        employeeName: 'Trần Thị B',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -1,
        newStockLevel: 99,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000001'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000003 - Điện thoại iPhone 15 Pro (Khởi tạo: CN000001=20, CN000002=15)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000007'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000003'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 20,
        newStockLevel: 20,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000003'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000008'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000003'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 15,
        newStockLevel: 15,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000003'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000009'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000003'),
        date: '2025-11-03T14:20:00Z',
        employeeName: 'Phạm Văn D',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -1,
        newStockLevel: 19,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000002'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000004 - Ốp lưng iPhone 15 Pro (Khởi tạo: CN000001=200, CN000002=150)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000010'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000004'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 200,
        newStockLevel: 200,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000004'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000011'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000004'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 150,
        newStockLevel: 150,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000004'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000012'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000004'),
        date: '2025-11-03T14:20:00Z',
        employeeName: 'Phạm Văn D',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -2,
        newStockLevel: 198,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000002'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000005 - Máy tính bảng iPad Air (Khởi tạo: CN000001=30, CN000002=20)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000013'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000005'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 30,
        newStockLevel: 30,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000005'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000014'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000005'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 20,
        newStockLevel: 20,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000005'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000015'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000005'),
        date: '2025-11-05T10:15:00Z',
        employeeName: 'Trần Thị B',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -1,
        newStockLevel: 29,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000003'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000006 - Đồng hồ Apple Watch Series 9 (Khởi tạo: CN000001=40, CN000002=25)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000016'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000006'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 40,
        newStockLevel: 40,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000006'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000017'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000006'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 25,
        newStockLevel: 25,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000006'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000018'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000006'),
        date: '2025-11-07T16:45:00Z',
        employeeName: 'Võ Thị F',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -1,
        newStockLevel: 39,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000004'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000007 - Tai nghe AirPods Pro (Khởi tạo: CN000001=60, CN000002=40)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000019'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000007'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 60,
        newStockLevel: 60,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000007'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000020'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000007'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 40,
        newStockLevel: 40,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000007'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000021'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000007'),
        date: '2025-11-07T16:45:00Z',
        employeeName: 'Võ Thị F',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -1,
        newStockLevel: 59,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000004'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000008 - Bàn phím cơ Keychron K2 (Khởi tạo: CN000001=35, CN000002=25)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000022'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000008'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 35,
        newStockLevel: 35,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000008'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000023'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000008'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 25,
        newStockLevel: 25,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000008'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000024'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000008'),
        date: '2025-11-08T11:00:00Z',
        employeeName: 'Phạm Văn D',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -1,
        newStockLevel: 34,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000005'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000009 - Keycap custom (Khởi tạo: CN000001=50, CN000002=30)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000025'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000009'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 50,
        newStockLevel: 50,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000009'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000026'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000009'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 30,
        newStockLevel: 30,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000009'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000027'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000009'),
        date: '2025-11-08T11:00:00Z',
        employeeName: 'Phạm Văn D',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -1,
        newStockLevel: 49,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000005'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000010 - Switch Gateron Yellow (Khởi tạo: CN000001=500, CN000002=300)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000028'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000010'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 500,
        newStockLevel: 500,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000010'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000029'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000010'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 300,
        newStockLevel: 300,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000010'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000030'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000010'),
        date: '2025-11-10T09:45:00Z',
        employeeName: 'Vũ Quốc H',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -2,
        newStockLevel: 498,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000006'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000011 - Laptop HP Spectre (Khởi tạo: CN000001=25, CN000002=15)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000031'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000011'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 25,
        newStockLevel: 25,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000011'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000032'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000011'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 15,
        newStockLevel: 15,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000011'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000033'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000011'),
        date: '2025-11-10T09:45:00Z',
        employeeName: 'Vũ Quốc H',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -1,
        newStockLevel: 24,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000006'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000012 - Màn hình LG UltraFine (Khởi tạo: CN000001=40, CN000002=20)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000034'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000012'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 40,
        newStockLevel: 40,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000012'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000035'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000012'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 20,
        newStockLevel: 20,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000012'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000036'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000012'),
        date: '2025-11-12T13:00:00Z',
        employeeName: 'Nguyễn Văn I',
        action: 'Nhập hàng từ NCC',
        quantityChange: 10,
        newStockLevel: 50,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PNK000001'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000013 - Máy in Canon LBP2900 (Khởi tạo: CN000001=30, CN000002=20)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000037'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000013'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 30,
        newStockLevel: 30,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000013'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000038'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000013'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 20,
        newStockLevel: 20,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000013'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000039'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000013'),
        date: '2025-11-12T13:00:00Z',
        employeeName: 'Nguyễn Văn I',
        action: 'Nhập hàng từ NCC',
        quantityChange: 5,
        newStockLevel: 35,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PNK000001'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000014 - Balo laptop Targus (Khởi tạo: CN000001=80, CN000002=60)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000040'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000014'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 80,
        newStockLevel: 80,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000014'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000041'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000014'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 60,
        newStockLevel: 60,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000014'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000042'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000014'),
        date: '2025-11-13T15:20:00Z',
        employeeName: 'Lê Thị J',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -3,
        newStockLevel: 77,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000007'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    // PROD000015 - Ổ cứng SSD Samsung 980 Pro (Khởi tạo: CN000001=120, CN000002=80)
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000043'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000015'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 120,
        newStockLevel: 120,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000015'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000044'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000015'),
        date: '2025-10-01T08:00:00Z',
        employeeName: 'Hệ thống',
        action: 'Khởi tạo tồn kho',
        quantityChange: 80,
        newStockLevel: 80,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PROD000015'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000002'),
        branch: 'Chi nhánh Hà Nội'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SH000045'),
        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PROD000015'),
        date: '2025-11-13T15:20:00Z',
        employeeName: 'Lê Thị J',
        action: 'Xuất bán (Đơn hàng)',
        quantityChange: -2,
        newStockLevel: 118,
        documentId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000007'),
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CN000001'),
        branch: 'Chi nhánh Trung tâm'
    }
];
const data = rawData.map((entry)=>({
        ...entry,
        ...buildAuditFields(entry.date)
    }));
}),
"[project]/features/stock-history/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useStockHistoryStore",
    ()=>useStockHistoryStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/stock-history/data.ts [app-ssr] (ecmascript)");
;
;
;
// ✨ Migration helper: Convert SKU to systemId for old data
function migrateHistoryData(entries) {
    // Map SKU → systemId from products
    const skuToSystemId = {
        'DV-WEB-01': 'SP00000001',
        'DV-WEB-02': 'SP00000002',
        'DV-WEB-03': 'SP00000003',
        'DV-MKT-01': 'SP00000004',
        'DV-MKT-02': 'SP00000005',
        'DV-MKT-03': 'SP00000006',
        'DV-SEO-01': 'SP00000007',
        'DV-SEO-02': 'SP00000008',
        'DV-IT-01': 'SP00000009',
        'DV-DSN-01': 'SP00000010',
        'SW-CRM-01': 'SP00000011',
        'SW-ERP-01': 'SP00000012',
        'SW-WIN-01': 'SP00000013',
        'SW-OFF-01': 'SP00000014',
        'SW-ADOBE-01': 'SP00000015',
        'HW-SRV-01': 'SP00000016',
        'HW-SRV-02': 'SP00000017',
        'HW-PC-01': 'SP00000018',
        'HW-PC-02': 'SP00000019',
        'HW-LT-01': 'SP00000020',
        'HW-NET-01': 'SP00000021',
        'HW-NET-02': 'SP00000022',
        'HW-CAM-01': 'SP00000023',
        'MISC-HOST-01': 'SP00000024',
        'MISC-HOST-02': 'SP00000025',
        'MISC-SSL-01': 'SP00000026',
        'MISC-DOMAIN-COM': 'SP00000027',
        'MISC-DOMAIN-VN': 'SP00000028',
        'MISC-PRINT-01': 'SP00000029',
        'MISC-PRINT-02': 'SP00000030'
    };
    return entries.map((entry)=>({
            ...entry,
            productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(skuToSystemId[entry.productId] || entry.productId) // Convert or keep if already systemId
        }));
}
let entryCounter = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"].length;
const useStockHistoryStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        entries: migrateHistoryData(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"]),
        addEntry: (entry)=>set((state)=>{
                entryCounter++;
                const newEntry = {
                    ...entry,
                    systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`HISTORY${String(Date.now()).slice(-6)}_${entryCounter}`)
                };
                return {
                    entries: [
                        ...state.entries,
                        newEntry
                    ]
                };
            }),
        getHistoryForProduct: (productId, branchSystemId = 'all')=>{
            const productHistory = get().entries.filter((e)=>e.productId === productId);
            const sortedHistory = productHistory.sort((a, b)=>new Date(b.date).getTime() - new Date(a.date).getTime());
            if (branchSystemId === 'all') {
                return sortedHistory;
            }
            return sortedHistory.filter((e)=>e.branchSystemId === branchSystemId);
        }
    }));
}),
"[project]/features/cashbook/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildAuditFields = (createdAt, createdBy = SEED_AUTHOR)=>({
        createdAt,
        updatedAt: createdAt,
        createdBy,
        updatedBy: createdBy
    });
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACCOUNT000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TK000001'),
        name: 'Quỹ tiền mặt',
        initialBalance: 1727238671,
        type: 'cash',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001'),
        isActive: true,
        isDefault: true,
        minBalance: 1000000,
        maxBalance: 5000000000,
        ...buildAuditFields('2024-01-01T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACCOUNT000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TK000002'),
        name: 'Tài khoản Vietcombank',
        initialBalance: 500000000,
        type: 'bank',
        bankAccountNumber: '0123456789',
        bankBranch: 'PGD Bến Thành',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001'),
        isActive: true,
        isDefault: true,
        bankName: 'Vietcombank',
        bankCode: 'VCB',
        accountHolder: 'CÔNG TY TNHH ABC',
        minBalance: 5000000,
        ...buildAuditFields('2024-01-02T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACCOUNT000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TK000003'),
        name: 'Tài khoản ACB',
        initialBalance: 250000000,
        type: 'bank',
        bankAccountNumber: '9876543210',
        bankBranch: 'Chi nhánh Sài Gòn',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002'),
        isActive: true,
        isDefault: false,
        bankName: 'ACB',
        bankCode: 'ACB',
        accountHolder: 'CÔNG TY TNHH ABC',
        ...buildAuditFields('2024-01-03T08:00:00Z')
    }
];
}),
"[project]/features/cashbook/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCashbookStore",
    ()=>useCashbookStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/cashbook/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
;
;
;
const CASH_ACCOUNT_ENTITY = 'cash-accounts';
const SYSTEM_ID_PREFIX = 'ACCOUNT';
const BUSINESS_ID_PREFIX = 'TK';
const BUSINESS_ID_DIGITS = 6;
const getNextSystemId = (accounts)=>{
    const currentCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(accounts, SYSTEM_ID_PREFIX);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])(CASH_ACCOUNT_ENTITY, currentCounter + 1));
};
const ensureBusinessId = (accounts, provided)=>{
    if (provided && provided.trim()) {
        return provided;
    }
    const existingIds = accounts.map((acc)=>acc.id);
    const startCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])(accounts, BUSINESS_ID_PREFIX);
    const { nextId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(BUSINESS_ID_PREFIX, existingIds, startCounter, BUSINESS_ID_DIGITS);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(nextId);
};
const useCashbookStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        accounts: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"],
        getAccountById: (id)=>get().accounts.find((a)=>a.id === id),
        add: (item)=>set((state)=>{
                const newAccount = {
                    ...item,
                    systemId: getNextSystemId(state.accounts),
                    id: ensureBusinessId(state.accounts, item.id)
                };
                return {
                    accounts: [
                        ...state.accounts,
                        newAccount
                    ]
                };
            }),
        update: (systemId, updatedItem)=>set((state)=>({
                    accounts: state.accounts.map((acc)=>acc.systemId === systemId ? updatedItem : acc)
                })),
        remove: (systemId)=>set((state)=>({
                    accounts: state.accounts.filter((acc)=>acc.systemId !== systemId)
                })),
        setDefault: (systemId)=>set((state)=>{
                const targetAccount = state.accounts.find((acc)=>acc.systemId === systemId);
                if (!targetAccount) return state;
                return {
                    accounts: state.accounts.map((acc)=>({
                            ...acc,
                            isDefault: (acc.type === targetAccount.type ? acc.systemId === systemId : acc.isDefault) ?? false
                        }))
                };
            })
    }));
}),
"[project]/features/receipts/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RECEIPT000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PT000001'),
        date: '2024-11-10',
        amount: 5_000_000,
        payerTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('KHACHHANG'),
        payerTypeName: 'Khách hàng',
        payerName: 'Nguyễn Văn A',
        payerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUSTOMER000001'),
        description: 'Thu tiền bán hàng',
        paymentMethodSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('TIENMAT'),
        paymentMethodName: 'Tiền mặt',
        accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACC_CASH'),
        paymentReceiptTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RT_SALE'),
        paymentReceiptTypeName: 'Bán hàng',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001'),
        branchName: 'Chi nhánh 1',
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('admin'),
        createdAt: '2024-11-10T10:00:00Z',
        status: 'completed',
        category: 'sale',
        affectsDebt: false,
        runningBalance: 1_732_238_671,
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUSTOMER000001'),
        customerName: 'Nguyễn Văn A'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RECEIPT000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PT000002'),
        date: '2024-11-11',
        amount: 3_000_000,
        payerTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('KHACHHANG'),
        payerTypeName: 'Khách hàng',
        payerName: 'Trần Thị B',
        payerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUSTOMER000002'),
        description: 'Thu tiền khách hàng thanh toán công nợ',
        paymentMethodSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CHUYENKHOAN'),
        paymentMethodName: 'Chuyển khoản',
        accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACC_VCB'),
        paymentReceiptTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RT_PAYMENT'),
        paymentReceiptTypeName: 'Thu công nợ',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001'),
        branchName: 'Chi nhánh 1',
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('admin'),
        createdAt: '2024-11-11T14:30:00Z',
        status: 'completed',
        category: 'customer_payment',
        affectsDebt: true,
        runningBalance: 503_000_000,
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUSTOMER000002'),
        customerName: 'Trần Thị B'
    }
];
}),
"[project]/features/receipts/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useReceiptStore",
    ()=>useReceiptStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/receipts/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/finance/document-lookups.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
// Helper to get current user info
const getCurrentUserInfo = ()=>{
    const currentUserSystemId = __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]?.() || 'SYSTEM';
    const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().data.find((e)=>e.systemId === currentUserSystemId);
    return {
        systemId: currentUserSystemId,
        name: employee?.fullName || 'Hệ thống',
        avatar: employee?.avatarUrl
    };
};
// Helper to create history entry
const createHistoryEntry = (action, description, metadata)=>({
        id: crypto.randomUUID(),
        action,
        timestamp: new Date(),
        user: getCurrentUserInfo(),
        description,
        metadata
    });
const SYSTEM_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM');
const getCurrentReceiptAuthor = ()=>{
    const userId = __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]?.();
    return userId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(userId) : SYSTEM_AUTHOR;
};
const RECEIPT_ENTITY = 'receipts';
const SYSTEM_ID_PREFIX = 'RECEIPT';
const BUSINESS_ID_PREFIX = 'PT';
const BUSINESS_ID_DIGITS = 6;
const normalizeReceiptStatus = (status)=>status === 'cancelled' ? 'cancelled' : 'completed';
const ensureReceiptMetadata = (receipt)=>{
    let mutated = false;
    const updates = {};
    const targetGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickTargetGroup"])({
        systemId: receipt.payerTypeSystemId,
        name: receipt.payerTypeName
    });
    if (targetGroup) {
        if (receipt.payerTypeSystemId !== targetGroup.systemId) {
            updates.payerTypeSystemId = targetGroup.systemId;
            mutated = true;
        }
        if (receipt.payerTypeName !== targetGroup.name) {
            updates.payerTypeName = targetGroup.name;
            mutated = true;
        }
    }
    const paymentMethod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickPaymentMethod"])({
        systemId: receipt.paymentMethodSystemId,
        name: receipt.paymentMethodName
    });
    if (paymentMethod) {
        if (receipt.paymentMethodSystemId !== paymentMethod.systemId) {
            updates.paymentMethodSystemId = paymentMethod.systemId;
            mutated = true;
        }
        if (receipt.paymentMethodName !== paymentMethod.name) {
            updates.paymentMethodName = paymentMethod.name;
            mutated = true;
        }
    }
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickAccount"])({
        accountSystemId: receipt.accountSystemId,
        branchSystemId: receipt.branchSystemId,
        paymentMethodName: paymentMethod?.name ?? receipt.paymentMethodName
    });
    if (account && receipt.accountSystemId !== account.systemId) {
        updates.accountSystemId = account.systemId;
        mutated = true;
    }
    const receiptType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickReceiptType"])({
        systemId: receipt.paymentReceiptTypeSystemId,
        name: receipt.paymentReceiptTypeName
    });
    if (receiptType) {
        if (receipt.paymentReceiptTypeSystemId !== receiptType.systemId) {
            updates.paymentReceiptTypeSystemId = receiptType.systemId;
            mutated = true;
        }
        if (receipt.paymentReceiptTypeName !== receiptType.name) {
            updates.paymentReceiptTypeName = receiptType.name;
            mutated = true;
        }
    }
    if (!receipt.customerName && receipt.payerName) {
        updates.customerName = receipt.payerName;
        mutated = true;
    }
    if (!receipt.customerSystemId && receipt.payerSystemId) {
        updates.customerSystemId = receipt.payerSystemId;
        mutated = true;
    }
    return mutated ? {
        ...receipt,
        ...updates
    } : receipt;
};
const backfillReceiptMetadata = (receipts)=>{
    let mutated = false;
    const updated = receipts.map((receipt)=>{
        const normalized = ensureReceiptMetadata(receipt);
        if (normalized !== receipt) {
            mutated = true;
        }
        return normalized;
    });
    return mutated ? updated : receipts;
};
const initialReceipts = backfillReceiptMetadata(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"].map((receipt)=>({
        ...receipt,
        status: normalizeReceiptStatus(receipt.status)
    })));
let systemIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(initialReceipts, SYSTEM_ID_PREFIX);
let businessIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])(initialReceipts, BUSINESS_ID_PREFIX);
const getNextSystemId = ()=>{
    systemIdCounter += 1;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])(RECEIPT_ENTITY, systemIdCounter));
};
const ensureReceiptBusinessId = (receipts, provided)=>{
    if (provided && `${provided}`.trim().length > 0) {
        const normalized = `${provided}`.trim().toUpperCase();
        const parsedCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractCounterFromBusinessId"])(normalized, BUSINESS_ID_PREFIX);
        if (parsedCounter > businessIdCounter) {
            businessIdCounter = parsedCounter;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(normalized);
    }
    const existingIds = receipts.map((receipt)=>receipt.id).filter(Boolean);
    const { nextId, updatedCounter } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(BUSINESS_ID_PREFIX, existingIds, businessIdCounter, BUSINESS_ID_DIGITS);
    businessIdCounter = updatedCounter;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(nextId);
};
const useReceiptStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["subscribeWithSelector"])((set, get)=>({
        data: initialReceipts,
        businessIdCounter,
        systemIdCounter,
        add: (item)=>{
            let createdReceipt = null;
            set((state)=>{
                const systemId = getNextSystemId();
                const id = ensureReceiptBusinessId(state.data, item.id);
                const createdBy = item.createdBy ?? getCurrentReceiptAuthor();
                const newReceipt = {
                    ...item,
                    systemId,
                    id,
                    createdBy,
                    createdAt: item.createdAt || new Date().toISOString(),
                    status: normalizeReceiptStatus(item.status),
                    orderAllocations: item.orderAllocations ?? []
                };
                const normalizedReceipt = ensureReceiptMetadata(newReceipt);
                createdReceipt = normalizedReceipt;
                return {
                    data: [
                        ...state.data,
                        normalizedReceipt
                    ],
                    businessIdCounter,
                    systemIdCounter
                };
            });
            return createdReceipt;
        },
        addMultiple: (items)=>{
            set((state)=>{
                const created = [];
                items.forEach((item)=>{
                    const context = [
                        ...state.data,
                        ...created
                    ];
                    const systemId = getNextSystemId();
                    const id = ensureReceiptBusinessId(context, item.id);
                    const createdBy = item.createdBy ?? getCurrentReceiptAuthor();
                    const newReceipt = {
                        ...item,
                        systemId,
                        id,
                        createdBy,
                        createdAt: item.createdAt || new Date().toISOString(),
                        status: normalizeReceiptStatus(item.status),
                        orderAllocations: item.orderAllocations ?? []
                    };
                    created.push(ensureReceiptMetadata(newReceipt));
                });
                return {
                    data: [
                        ...state.data,
                        ...created
                    ],
                    businessIdCounter,
                    systemIdCounter
                };
            });
        },
        update: (systemId, item)=>{
            set((state)=>({
                    data: state.data.map((r)=>r.systemId === systemId ? {
                            ...item,
                            status: normalizeReceiptStatus(item.status),
                            updatedAt: new Date().toISOString()
                        } : r),
                    businessIdCounter,
                    systemIdCounter
                }));
        },
        remove: (systemId)=>{
            set((state)=>({
                    data: state.data.filter((r)=>r.systemId !== systemId),
                    businessIdCounter,
                    systemIdCounter
                }));
        },
        findById: (systemId)=>{
            return get().data.find((r)=>r.systemId === systemId);
        },
        getActive: ()=>{
            return get().data.filter((r)=>r.status !== 'cancelled');
        },
        cancel: (systemId, reason)=>{
            const receipt = get().findById(systemId);
            if (receipt && receipt.status !== 'cancelled') {
                const historyEntry = createHistoryEntry('cancelled', `Đã hủy phiếu thu${reason ? `: ${reason}` : ''}`, {
                    oldValue: 'Hoàn thành',
                    newValue: 'Đã hủy',
                    note: reason
                });
                get().update(systemId, {
                    ...receipt,
                    status: 'cancelled',
                    cancelledAt: new Date().toISOString(),
                    activityHistory: [
                        ...receipt.activityHistory || [],
                        historyEntry
                    ]
                });
            }
        }
    })));
}),
"[project]/features/finance/document-lookups.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_CUSTOMER_GROUP",
    ()=>DEFAULT_CUSTOMER_GROUP,
    "pickAccount",
    ()=>pickAccount,
    "pickPaymentMethod",
    ()=>pickPaymentMethod,
    "pickPaymentType",
    ()=>pickPaymentType,
    "pickReceiptType",
    ()=>pickReceiptType,
    "pickTargetGroup",
    ()=>pickTargetGroup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$target$2d$groups$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/target-groups/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$methods$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/payments/methods/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/cashbook/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/receipt-types/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/payments/types/store.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const normalizeName = (value)=>(value ?? '').trim().toLowerCase();
const DEFAULT_CUSTOMER_GROUP = 'khách hàng';
const pickTargetGroup = (options)=>{
    const groups = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$target$2d$groups$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTargetGroupStore"].getState().data ?? [];
    if (groups.length === 0) {
        return null;
    }
    if (options?.systemId) {
        const match = groups.find((group)=>group.systemId === options.systemId);
        if (match) {
            return match;
        }
    }
    const lookupNames = [
        options?.name,
        options?.fallbackName,
        DEFAULT_CUSTOMER_GROUP
    ].filter(Boolean);
    for (const candidate of lookupNames){
        const normalized = normalizeName(candidate);
        const match = groups.find((group)=>normalizeName(group.name) === normalized);
        if (match) {
            return match;
        }
    }
    return groups[0] ?? null;
};
const pickPaymentMethod = (options)=>{
    const methods = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$methods$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentMethodStore"].getState().data ?? [];
    if (methods.length === 0) {
        return null;
    }
    if (options?.systemId) {
        const match = methods.find((method)=>method.systemId === options.systemId);
        if (match) {
            return match;
        }
    }
    if (options?.name) {
        const normalized = normalizeName(options.name);
        const match = methods.find((method)=>normalizeName(method.name) === normalized);
        if (match) {
            return match;
        }
    }
    return methods.find((method)=>method.isDefault) ?? methods[0] ?? null;
};
const pickAccount = (options)=>{
    const { accounts } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCashbookStore"].getState();
    if (!accounts || accounts.length === 0) {
        return null;
    }
    if (options.accountSystemId) {
        const match = accounts.find((account)=>account.systemId === options.accountSystemId);
        if (match) {
            return match;
        }
    }
    let preferredType = options.preferredType;
    if (!preferredType && options.paymentMethodName) {
        const normalizedMethod = normalizeName(options.paymentMethodName);
        preferredType = normalizedMethod === 'tiền mặt' ? 'cash' : normalizedMethod === 'chuyển khoản' ? 'bank' : undefined;
    }
    const candidates = preferredType ? accounts.filter((account)=>account.type === preferredType) : accounts;
    if (candidates.length === 0) {
        return accounts[0];
    }
    return candidates.find((account)=>account.branchSystemId && options.branchSystemId && account.branchSystemId === options.branchSystemId) ?? candidates.find((account)=>account.isDefault) ?? candidates[0];
};
const pickReceiptType = (options)=>{
    const types = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptTypeStore"].getState().data ?? [];
    if (types.length === 0) {
        return null;
    }
    if (options?.systemId) {
        const match = types.find((type)=>type.systemId === options.systemId);
        if (match) {
            return match;
        }
    }
    if (options?.name) {
        const normalized = normalizeName(options.name);
        const match = types.find((type)=>normalizeName(type.name) === normalized);
        if (match) {
            return match;
        }
    }
    return types[0] ?? null;
};
const pickPaymentType = (options)=>{
    const types = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentTypeStore"].getState().data ?? [];
    if (types.length === 0) {
        return null;
    }
    if (options?.systemId) {
        const match = types.find((type)=>type.systemId === options.systemId);
        if (match) {
            return match;
        }
    }
    if (options?.name) {
        const normalized = normalizeName(options.name);
        const match = types.find((type)=>normalizeName(type.name) === normalized);
        if (match) {
            return match;
        }
    }
    return types[0] ?? null;
};
}),
"[project]/features/finance/document-helpers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPaymentDocument",
    ()=>createPaymentDocument,
    "createReceiptDocument",
    ()=>createReceiptDocument
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/receipts/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payments/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/finance/document-lookups.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const asBusinessIdOrUndefined = (value)=>{
    if (!value) {
        return undefined;
    }
    return typeof value === 'string' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(value) : value;
};
const createReceiptDocument = (options)=>{
    if (!options.branchSystemId) {
        return {
            document: null,
            error: 'Thiếu mã chi nhánh khi tạo phiếu thu.'
        };
    }
    const targetGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickTargetGroup"])({
        systemId: options.payerTargetGroupSystemId,
        name: options.payerTargetGroupName
    });
    if (!targetGroup) {
        return {
            document: null,
            error: 'Chưa cấu hình nhóm đối tượng (Target Group) cho phiếu thu.'
        };
    }
    const paymentMethod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickPaymentMethod"])({
        systemId: options.paymentMethodSystemId,
        name: options.paymentMethodName
    });
    if (!paymentMethod) {
        return {
            document: null,
            error: 'Chưa cấu hình phương thức thu tiền.'
        };
    }
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickAccount"])({
        accountSystemId: options.accountSystemId,
        preferredType: options.accountPreference,
        branchSystemId: options.branchSystemId,
        paymentMethodName: paymentMethod.name
    });
    if (!account) {
        return {
            document: null,
            error: 'Chưa cấu hình tài khoản quỹ phù hợp để tạo phiếu thu.'
        };
    }
    const receiptType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickReceiptType"])({
        systemId: options.receiptTypeSystemId,
        name: options.receiptTypeName
    });
    if (!receiptType) {
        return {
            document: null,
            error: 'Chưa cấu hình loại phiếu thu.'
        };
    }
    const timestamp = options.date ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
    const payload = {
        date: timestamp,
        amount: options.amount,
        payerTypeSystemId: targetGroup.systemId,
        payerTypeName: targetGroup.name,
        payerName: options.customerName,
        payerSystemId: options.customerSystemId,
        description: options.description,
        paymentMethodSystemId: paymentMethod.systemId,
        paymentMethodName: paymentMethod.name,
        accountSystemId: account.systemId,
        paymentReceiptTypeSystemId: receiptType.systemId,
        paymentReceiptTypeName: receiptType.name,
        branchSystemId: options.branchSystemId,
        branchName: options.branchName,
        createdBy: options.createdBy,
        createdAt: timestamp,
        status: options.status ?? 'completed',
        category: options.category,
        originalDocumentId: asBusinessIdOrUndefined(options.originalDocumentId),
        linkedOrderSystemId: options.linkedOrderSystemId,
        linkedSalesReturnSystemId: options.linkedSalesReturnSystemId,
        linkedWarrantySystemId: options.linkedWarrantySystemId,
        linkedComplaintSystemId: options.linkedComplaintSystemId,
        customerSystemId: options.customerSystemId,
        customerName: options.customerName,
        affectsDebt: options.affectsDebt ?? true
    };
    const receipt = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].getState().add(payload);
    return {
        document: receipt
    };
};
const createPaymentDocument = (options)=>{
    if (!options.branchSystemId) {
        return {
            document: null,
            error: 'Thiếu mã chi nhánh khi tạo phiếu chi.'
        };
    }
    const targetGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickTargetGroup"])({
        systemId: options.recipientTargetGroupSystemId,
        name: options.recipientTargetGroupName
    });
    if (!targetGroup) {
        return {
            document: null,
            error: 'Chưa cấu hình nhóm đối tượng (Target Group) cho phiếu chi.'
        };
    }
    const paymentMethod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickPaymentMethod"])({
        systemId: options.paymentMethodSystemId,
        name: options.paymentMethodName
    });
    if (!paymentMethod) {
        return {
            document: null,
            error: 'Chưa cấu hình phương thức chi tiền.'
        };
    }
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickAccount"])({
        accountSystemId: options.accountSystemId,
        preferredType: options.accountPreference,
        branchSystemId: options.branchSystemId,
        paymentMethodName: paymentMethod.name
    });
    if (!account) {
        return {
            document: null,
            error: 'Chưa cấu hình tài khoản quỹ phù hợp để tạo phiếu chi.'
        };
    }
    const paymentType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickPaymentType"])({
        systemId: options.paymentTypeSystemId,
        name: options.paymentTypeName
    });
    if (!paymentType) {
        return {
            document: null,
            error: 'Chưa cấu hình loại phiếu chi.'
        };
    }
    const timestamp = options.date ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
    const payload = {
        date: timestamp,
        amount: options.amount,
        recipientTypeSystemId: targetGroup.systemId,
        recipientTypeName: targetGroup.name,
        recipientName: options.recipientName,
        recipientSystemId: options.recipientSystemId,
        description: options.description,
        paymentMethodSystemId: paymentMethod.systemId,
        paymentMethodName: paymentMethod.name,
        accountSystemId: account.systemId,
        paymentReceiptTypeSystemId: paymentType.systemId,
        paymentReceiptTypeName: paymentType.name,
        branchSystemId: options.branchSystemId,
        branchName: options.branchName,
        createdBy: options.createdBy,
        createdAt: timestamp,
        status: options.status ?? 'completed',
        category: options.category,
        originalDocumentId: asBusinessIdOrUndefined(options.originalDocumentId),
        linkedOrderSystemId: options.linkedOrderSystemId,
        linkedSalesReturnSystemId: options.linkedSalesReturnSystemId,
        linkedWarrantySystemId: options.linkedWarrantySystemId,
        linkedComplaintSystemId: options.linkedComplaintSystemId,
        customerSystemId: options.customerSystemId,
        customerName: options.customerName ?? options.recipientName,
        affectsDebt: options.affectsDebt ?? true
    };
    const payment = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentStore"].getState().add(payload);
    return {
        document: payment
    };
};
}),
"[project]/features/sales-returns/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildAuditFields = (createdAt, createdBy = SEED_AUTHOR)=>({
        createdAt,
        updatedAt: createdAt,
        createdBy,
        updatedBy: createdBy
    });
const data = [
    // Phiếu trả hàng đã hoàn tất - Hoàn tiền
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RETURN000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TH000001'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000001'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000001'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000001'),
        customerName: 'Công ty Cổ phần Bất động sản Hưng Thịnh',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
        branchName: 'Chi nhánh Trung tâm',
        returnDate: '2025-11-10 09:30',
        reason: 'Sản phẩm lỗi kỹ thuật',
        note: 'Chuột bị lỗi nút click, khách yêu cầu hoàn tiền',
        notes: 'Đã kiểm tra và xác nhận lỗi từ nhà sản xuất',
        items: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000002'),
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000002'),
                productName: 'Chuột Logitech MX Master 3',
                returnQuantity: 1,
                unitPrice: 2000000,
                totalValue: 2000000,
                note: 'Lỗi nút click trái'
            }
        ],
        totalReturnValue: 2000000,
        isReceived: true,
        exchangeItems: [],
        subtotalNew: 0,
        shippingFeeNew: 0,
        grandTotalNew: 0,
        finalAmount: -2000000,
        refundMethod: 'Tiền mặt',
        refundAmount: 2000000,
        accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACC000001'),
        creatorSystemId: SEED_AUTHOR,
        creatorName: 'Nguyễn Văn A',
        ...buildAuditFields('2025-11-10T09:30:00Z')
    },
    // Phiếu trả hàng - Đổi hàng
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RETURN000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TH000002'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000003'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000003'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000003'),
        customerName: 'Anh Trần Minh Hoàng',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
        branchName: 'Chi nhánh Trung tâm',
        returnDate: '2025-11-15 14:00',
        reason: 'Đổi sang sản phẩm khác',
        note: 'Khách muốn đổi iPad Air sang iPad Pro',
        items: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000005'),
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000005'),
                productName: 'Máy tính bảng iPad Air',
                returnQuantity: 1,
                unitPrice: 18000000,
                totalValue: 18000000,
                note: 'Đổi lên model cao hơn'
            }
        ],
        totalReturnValue: 18000000,
        isReceived: true,
        exchangeItems: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000011'),
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000011'),
                productName: 'Máy tính bảng iPad Pro 12.9"',
                quantity: 1,
                unitPrice: 28000000,
                discount: 0,
                discountType: 'fixed'
            }
        ],
        subtotalNew: 28000000,
        shippingFeeNew: 0,
        grandTotalNew: 28000000,
        finalAmount: 10000000,
        payments: [
            {
                method: 'Chuyển khoản',
                accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACC000002'),
                amount: 10000000
            }
        ],
        creatorSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002'),
        creatorName: 'Trần Thị B',
        ...buildAuditFields('2025-11-15T14:00:00Z')
    },
    // Phiếu trả hàng - Chưa nhận hàng
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RETURN000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TH000003'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000006'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000006'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000005'),
        customerName: 'Chị Nguyễn Thị Hương',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
        branchName: 'Chi nhánh Trung tâm',
        returnDate: '2025-12-05 11:00',
        reason: 'Sản phẩm không đúng mô tả',
        note: 'Khách phản ánh màu sắc laptop không đúng như hình',
        items: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000001'),
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000001'),
                productName: 'Laptop Dell Inspiron 15',
                returnQuantity: 1,
                unitPrice: 15000000,
                totalValue: 15000000,
                note: 'Khách muốn đổi màu bạc sang màu đen'
            }
        ],
        totalReturnValue: 15000000,
        isReceived: false,
        exchangeItems: [],
        subtotalNew: 0,
        shippingFeeNew: 0,
        grandTotalNew: 0,
        finalAmount: -15000000,
        deliveryMethod: 'Dịch vụ giao hàng',
        shippingPartnerId: 'GHN',
        creatorSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000003'),
        creatorName: 'Phạm Văn D',
        ...buildAuditFields('2025-12-05T11:00:00Z')
    },
    // Phiếu trả hàng - Hoàn tiền một phần
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RETURN000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TH000004'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000007'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000007'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000006'),
        customerName: 'Anh Phạm Văn Tùng',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
        branchName: 'Chi nhánh Trung tâm',
        returnDate: '2025-12-07 16:30',
        reason: 'Trả một phần đơn hàng',
        note: 'Khách chỉ giữ lại chuột, trả webcam',
        items: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000009'),
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000009'),
                productName: 'Webcam Logitech C920',
                returnQuantity: 1,
                unitPrice: 1200000,
                totalValue: 1200000,
                note: 'Không cần dùng webcam'
            }
        ],
        totalReturnValue: 1200000,
        isReceived: true,
        exchangeItems: [],
        subtotalNew: 0,
        shippingFeeNew: 0,
        grandTotalNew: 0,
        finalAmount: -1200000,
        refunds: [
            {
                method: 'Tiền mặt',
                accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACC000001'),
                amount: 1200000
            }
        ],
        creatorSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000004'),
        creatorName: 'Võ Thị F',
        ...buildAuditFields('2025-12-07T16:30:00Z')
    },
    // Phiếu trả hàng - Đổi + Hoàn tiền chênh lệch
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('RETURN000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('TH000005'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000010'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000010'),
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000009'),
        customerName: 'Anh Đỗ Văn Hùng',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
        branchName: 'Chi nhánh Trung tâm',
        returnDate: '2025-12-09 10:00',
        reason: 'Đổi sang model cũ hơn',
        note: 'Khách muốn đổi AirPods Pro sang AirPods 3, lấy lại tiền chênh lệch',
        items: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000004'),
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000004'),
                productName: 'Tai nghe AirPods Pro',
                returnQuantity: 1,
                unitPrice: 5000000,
                totalValue: 5000000,
                note: 'Đổi xuống model thấp hơn'
            }
        ],
        totalReturnValue: 5000000,
        isReceived: true,
        exchangeItems: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000012'),
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000012'),
                productName: 'Tai nghe AirPods 3',
                quantity: 1,
                unitPrice: 4000000,
                discount: 0,
                discountType: 'fixed'
            }
        ],
        subtotalNew: 4000000,
        shippingFeeNew: 0,
        grandTotalNew: 4000000,
        finalAmount: -1000000,
        refunds: [
            {
                method: 'Tiền mặt',
                accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACC000001'),
                amount: 1000000
            }
        ],
        creatorSystemId: SEED_AUTHOR,
        creatorName: 'Nguyễn Văn A',
        ...buildAuditFields('2025-12-09T10:00:00Z')
    }
];
// Reminder constant để giữ `createdAt/createdBy` trong file, tránh quên audit metadata khi bổ sung seed thật.
const __salesReturnMetadataReminder = [
    'createdAt',
    'createdBy'
];
void __salesReturnMetadataReminder;
}),
"[project]/features/sales-returns/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSalesReturnStore",
    ()=>useSalesReturnStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/sales-returns/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
// Other stores
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/stock-history/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/finance/document-helpers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/shipping/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/combo-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
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
/**
 * ✅ Helper: Expand combo return items to child products
 * When a combo is returned, we need to add stock back to child products
 */ const getReturnStockItems = (returnItems)=>{
    const { findById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
    const expandedItems = [];
    returnItems.forEach((item)=>{
        const product = findById(item.productSystemId);
        if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
            // Combo → expand to child products
            product.comboItems.forEach((comboItem)=>{
                const childProduct = findById(comboItem.productSystemId);
                expandedItems.push({
                    productSystemId: comboItem.productSystemId,
                    productName: childProduct?.name || 'SP không xác định',
                    quantity: comboItem.quantity * item.returnQuantity
                });
            });
        } else {
            // Regular product
            expandedItems.push({
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId),
                productName: item.productName,
                quantity: item.returnQuantity
            });
        }
    });
    return expandedItems;
};
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"], 'sales-returns', {
    persistKey: 'hrm-sales-returns' // ✅ Enable localStorage persistence
});
const originalAdd = baseStore.getState().add;
const augmentedMethods = {
    addWithSideEffects: (item)=>{
        const orderSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.orderSystemId);
        const orderBusinessId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(item.orderId);
        const customerSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.customerSystemId);
        const branchSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.branchSystemId);
        const creatorSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.creatorSystemId ?? item.creatorId ?? 'SYSTEM');
        const exchangeOrderSystemId = item.exchangeOrderSystemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.exchangeOrderSystemId) : undefined;
        const accountSystemId = item.accountSystemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.accountSystemId) : undefined;
        const paymentVoucherSystemId = item.paymentVoucherSystemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.paymentVoucherSystemId) : undefined;
        const paymentVoucherSystemIds = item.paymentVoucherSystemIds?.map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"]);
        const receiptVoucherSystemIds = item.receiptVoucherSystemIds?.map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"]);
        const formattedItems = item.items.map((lineItem)=>({
                ...lineItem,
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(lineItem.productSystemId),
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(lineItem.productId)
            }));
        const formattedPayments = item.payments?.map((payment)=>({
                ...payment,
                accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(payment.accountSystemId)
            }));
        const formattedRefunds = item.refunds?.map((refund)=>({
                ...refund,
                accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(refund.accountSystemId)
            }));
        const newItemData = {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(''),
            orderSystemId,
            orderId: orderBusinessId,
            customerSystemId,
            customerName: item.customerName,
            branchSystemId,
            branchName: item.branchName,
            returnDate: item.returnDate,
            reason: item.reason,
            note: item.note,
            notes: item.notes,
            reference: item.reference,
            items: formattedItems,
            totalReturnValue: item.totalReturnValue,
            isReceived: item.isReceived,
            exchangeItems: item.exchangeItems ?? [],
            exchangeOrderSystemId,
            subtotalNew: item.subtotalNew,
            shippingFeeNew: item.shippingFeeNew,
            discountNew: item.discountNew,
            discountNewType: item.discountNewType,
            grandTotalNew: item.grandTotalNew,
            deliveryMethod: item.deliveryMethod,
            shippingPartnerId: item.shippingPartnerId,
            shippingServiceId: item.shippingServiceId,
            shippingAddress: item.shippingAddress,
            packageInfo: item.packageInfo,
            configuration: item.configuration,
            finalAmount: item.finalAmount,
            refundMethod: item.refundMethod,
            refundAmount: item.refundAmount,
            accountSystemId,
            refunds: formattedRefunds,
            payments: formattedPayments,
            paymentVoucherSystemId,
            paymentVoucherSystemIds,
            receiptVoucherSystemIds,
            creatorSystemId,
            creatorName: item.creatorName
        };
        // --- Side Effects ---
        const { update: updateOrder, findById: findOrderById, add: addOrder } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOrderStore"].getState();
        const { updateInventory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
        const { addEntry: addStockHistory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStockHistoryStore"].getState();
        const { updateDebt, incrementReturnStats } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
        const order = findOrderById(newItemData.orderSystemId);
        if (!order) return {
            newReturn: null,
            newOrderSystemId: null
        };
        // ✅ IMPORTANT: Create the return FIRST to get IDs for exchange order
        const newReturn = originalAdd(newItemData);
        if (!newReturn) return {
            newReturn: null,
            newOrderSystemId: null
        };
        // ✅ Update customer return stats
        const totalReturnQty = newItemData.items.reduce((sum, item)=>sum + item.returnQuantity, 0);
        if (totalReturnQty > 0) {
            incrementReturnStats(newItemData.customerSystemId, totalReturnQty);
        }
        let newOrderSystemId;
        // Create a new sales order for the exchange items
        if (newItemData.exchangeItems && newItemData.exchangeItems.length > 0) {
            console.log('🔄 [Sales Return] Creating exchange order...', {
                exchangeItems: newItemData.exchangeItems,
                finalAmount: newItemData.finalAmount,
                payments: newItemData.payments
            });
            // ✅ Calculate payments for exchange order based on sales return logic
            const exchangeOrderPayments = newItemData.finalAmount > 0 && newItemData.payments ? newItemData.payments.map((p, index)=>({
                    systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`PAYMENT-${Date.now()}-${index}`),
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(`PAY-${Date.now()}-${index}`),
                    date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateCustom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), 'yyyy-MM-dd'),
                    method: p.method,
                    amount: p.amount,
                    createdBy: creatorSystemId,
                    description: 'Thanh toán đơn đổi hàng'
                })) : [];
            // If company refunded customer (finalAmount < 0)
            // The exchange order will have COD = grandTotal (shipper collects on delivery)
            // No payments array needed - will be handled by COD in shipping
            // ✅ Determine status and packagings based on delivery method
            let finalMainStatus = 'Đặt hàng';
            let finalDeliveryStatus = 'Chờ đóng gói';
            const packagings = [];
            const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateCustom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), 'yyyy-MM-dd HH:mm');
            // ✅ Helper to get next packaging systemId
            const PACKAGING_SYSTEM_ID_PREFIX = 'PACKAGE';
            const allOrders = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOrderStore"].getState().data;
            const allPackagings = allOrders.flatMap((o)=>o.packagings || []);
            const maxPackagingCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(allPackagings, PACKAGING_SYSTEM_ID_PREFIX);
            let packagingCounter = maxPackagingCounter;
            const getNextPackagingSystemId = ()=>{
                packagingCounter++;
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])('packaging', packagingCounter));
            };
            // Check if using shipping partner or pickup
            const isPickup = newItemData.deliveryMethod === 'pickup';
            const isShippingPartner = newItemData.shippingPartnerId && newItemData.shippingServiceId;
            if (isPickup) {
                // Nhận tại cửa hàng - Tạo packaging request ngay
                finalMainStatus = 'Đang giao dịch';
                finalDeliveryStatus = 'Chờ đóng gói';
                packagings.push({
                    systemId: getNextPackagingSystemId(),
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(''),
                    requestDate: now,
                    requestingEmployeeId: creatorSystemId,
                    requestingEmployeeName: newItemData.creatorName,
                    status: 'Chờ đóng gói',
                    printStatus: 'Chưa in',
                    deliveryStatus: 'Chờ đóng gói'
                });
            } else if (isShippingPartner) {
                // Đẩy qua hãng vận chuyển - Tạo packaging đã đóng gói với tracking
                finalMainStatus = 'Đang giao dịch';
                finalDeliveryStatus = 'Chờ lấy hàng';
                // Get partner info
                const { data: partners } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useShippingPartnerStore"].getState();
                const partner = partners.find((p)=>p.systemId === newItemData.shippingPartnerId);
                const service = partner?.services.find((s)=>s.id === newItemData.shippingServiceId);
                packagings.push({
                    systemId: getNextPackagingSystemId(),
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(''),
                    requestDate: now,
                    confirmDate: now,
                    requestingEmployeeId: creatorSystemId,
                    requestingEmployeeName: newItemData.creatorName,
                    confirmingEmployeeId: creatorSystemId,
                    confirmingEmployeeName: newItemData.creatorName,
                    status: 'Đã đóng gói',
                    deliveryStatus: 'Chờ lấy hàng',
                    printStatus: 'Chưa in',
                    deliveryMethod: 'Dịch vụ giao hàng',
                    carrier: partner?.name,
                    service: service?.name,
                    trackingCode: newItemData.packageInfo?.trackingCode || `VC${Date.now()}`,
                    shippingFeeToPartner: newItemData.shippingFeeNew,
                    codAmount: 0,
                    payer: 'Người nhận',
                    weight: newItemData.packageInfo?.weight,
                    dimensions: `${newItemData.packageInfo?.length || 0}x${newItemData.packageInfo?.width || 0}x${newItemData.packageInfo?.height || 0}`
                });
            }
            // else: deliver-later → keep default 'Đặt hàng', 'Chờ đóng gói', no packagings
            const newOrderPayload = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(''),
                customerSystemId: order.customerSystemId,
                customerName: order.customerName,
                branchSystemId: order.branchSystemId,
                branchName: order.branchName,
                salespersonSystemId: creatorSystemId,
                salesperson: newItemData.creatorName,
                orderDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateCustom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), 'yyyy-MM-dd HH:mm'),
                lineItems: newItemData.exchangeItems,
                subtotal: newItemData.subtotalNew,
                shippingFee: newItemData.shippingFeeNew,
                tax: 0,
                // ✅ IMPORTANT: grandTotal should be NET amount (after subtracting return value)
                // grandTotal = subtotalNew + shippingFee - totalReturnValue
                grandTotal: newItemData.finalAmount > 0 ? newItemData.finalAmount : newItemData.grandTotalNew,
                paidAmount: exchangeOrderPayments.reduce((sum, p)=>sum + p.amount, 0),
                // ✅ Store return value info for display
                linkedSalesReturnId: newReturn.id,
                linkedSalesReturnSystemId: newReturn.systemId,
                linkedSalesReturnValue: newItemData.totalReturnValue,
                payments: exchangeOrderPayments,
                notes: `Đơn hàng đổi từ phiếu trả ${newReturn.id} của đơn hàng ${order.id}`,
                sourceSalesReturnId: newReturn.id,
                // ✅ Pass shipping info from form
                deliveryMethod: newItemData.deliveryMethod === 'pickup' ? 'Nhận tại cửa hàng' : 'Dịch vụ giao hàng',
                shippingPartnerId: newItemData.shippingPartnerId,
                shippingServiceId: newItemData.shippingServiceId,
                shippingAddress: newItemData.shippingAddress,
                packageInfo: newItemData.packageInfo,
                configuration: newItemData.configuration,
                // ✅ Add required status fields based on delivery method
                status: finalMainStatus,
                paymentStatus: exchangeOrderPayments.length > 0 ? exchangeOrderPayments.reduce((sum, p)=>sum + p.amount, 0) >= newItemData.grandTotalNew ? 'Thanh toán toàn bộ' : 'Thanh toán 1 phần' : 'Chưa thanh toán',
                deliveryStatus: finalDeliveryStatus,
                printStatus: 'Chưa in',
                stockOutStatus: 'Chưa xuất kho',
                returnStatus: 'Chưa trả hàng',
                codAmount: 0,
                packagings: packagings
            };
            console.log('📦 [Sales Return] New order payload:', newOrderPayload);
            const newOrder = addOrder(newOrderPayload);
            console.log('✅ [Sales Return] New order created:', newOrder);
            if (newOrder) {
                newOrderSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(newOrder.systemId);
                // ✅ Save exchange order systemId to sales return
                newItemData.exchangeOrderSystemId = newOrderSystemId;
                console.log('🎉 [Sales Return] Exchange order systemId:', newOrderSystemId);
            } else {
                console.error('❌ [Sales Return] Failed to create exchange order!');
            }
        }
        // Adjust customer debt if needed
        const creditAmount = newItemData.totalReturnValue - newItemData.grandTotalNew - (newItemData.refundAmount || 0);
        if (creditAmount > 0) {
            updateDebt(newItemData.customerSystemId, -creditAmount);
        }
        // ✅ newReturn already created above, use it directly
        // ✅ NOW create vouchers with correct originalDocumentId
        // Handle Financials AFTER creating the return
        const finalAmount = newItemData.finalAmount;
        if (finalAmount < 0 && newItemData.refunds && newItemData.refunds.length > 0) {
            const createdVoucherIds = [];
            newItemData.refunds.forEach((refund)=>{
                if (!refund.amount || refund.amount <= 0) {
                    return;
                }
                const { document, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPaymentDocument"])({
                    amount: refund.amount,
                    description: `Hoàn tiền đổi/trả hàng từ đơn ${order.id} (Phiếu: ${newReturn.id}) qua ${refund.method}`,
                    recipientName: newItemData.customerName,
                    recipientSystemId: newItemData.customerSystemId,
                    customerSystemId: newItemData.customerSystemId,
                    customerName: newItemData.customerName,
                    paymentMethodName: refund.method,
                    accountSystemId: refund.accountSystemId,
                    paymentTypeName: 'Hoàn tiền khách hàng',
                    branchSystemId: newReturn.branchSystemId,
                    branchName: newReturn.branchName,
                    createdBy: creatorSystemId,
                    originalDocumentId: newReturn.id,
                    linkedSalesReturnSystemId: newReturn.systemId,
                    linkedOrderSystemId: newReturn.orderSystemId,
                    category: 'complaint_refund',
                    affectsDebt: true
                });
                if (error) {
                    console.error('[Sales Return] Failed to create payment voucher:', error);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Không thể tạo phiếu chi hoàn tiền: ${error}`);
                    return;
                }
                if (document) {
                    createdVoucherIds.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(document.systemId));
                }
            });
            if (createdVoucherIds.length > 0) {
                baseStore.getState().update(newReturn.systemId, {
                    ...newReturn,
                    paymentVoucherSystemIds: createdVoucherIds
                });
            }
        } else if (finalAmount > 0 && newItemData.payments && newItemData.payments.length > 0) {
            const createdVoucherIds = [];
            newItemData.payments.forEach((payment)=>{
                if (!payment.amount || payment.amount <= 0) {
                    return;
                }
                const { document, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createReceiptDocument"])({
                    amount: payment.amount,
                    description: `Thu tiền chênh lệch đổi hàng từ đơn ${order.id} (Phiếu: ${newReturn.id})`,
                    customerName: newReturn.customerName,
                    customerSystemId: newItemData.customerSystemId,
                    paymentMethodName: payment.method,
                    accountSystemId: payment.accountSystemId,
                    receiptTypeName: 'Thanh toán cho đơn hàng',
                    branchSystemId: newReturn.branchSystemId,
                    branchName: newReturn.branchName,
                    createdBy: creatorSystemId,
                    originalDocumentId: newReturn.id,
                    linkedSalesReturnSystemId: newReturn.systemId,
                    linkedOrderSystemId: newReturn.orderSystemId,
                    category: 'sale',
                    affectsDebt: false
                });
                if (error) {
                    console.error('[Sales Return] Failed to create receipt voucher:', error);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Không thể tạo phiếu thu đổi hàng: ${error}`);
                    return;
                }
                if (document) {
                    createdVoucherIds.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(document.systemId));
                }
            });
            if (createdVoucherIds.length > 0) {
                baseStore.getState().update(newReturn.systemId, {
                    ...newReturn,
                    receiptVoucherSystemIds: createdVoucherIds
                });
            }
        }
        // ✅ Update inventory for returned items ONLY if isReceived = true
        // ✅ For combo products, add stock to child products instead
        if (newReturn.isReceived) {
            console.log('✅ [Sales Return] Updating inventory - items received');
            // Expand combo items to child products
            const stockItems = getReturnStockItems(newReturn.items);
            stockItems.forEach((item)=>{
                if (item.quantity > 0) {
                    const product = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState().findById(item.productSystemId);
                    const oldStock = product?.inventoryByBranch[newReturn.branchSystemId] || 0;
                    updateInventory(item.productSystemId, newReturn.branchSystemId, item.quantity); // Add stock back
                    addStockHistory({
                        productId: item.productSystemId,
                        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])().toISOString(),
                        employeeName: newReturn.creatorName,
                        action: 'Nhập hàng từ khách trả',
                        quantityChange: item.quantity,
                        newStockLevel: oldStock + item.quantity,
                        documentId: newReturn.id,
                        branchSystemId: newReturn.branchSystemId,
                        branch: newReturn.branchName
                    });
                }
            });
        } else {
            console.log('⏸️ [Sales Return] Inventory NOT updated - waiting for receipt confirmation');
        }
        // Update original order's return status
        const previousReturnsForOrder = baseStore.getState().data.filter((r)=>r.orderSystemId === order.systemId);
        const totalReturnedQty = previousReturnsForOrder.flatMap((r)=>r.items).reduce((sum, item)=>sum + item.returnQuantity, 0);
        const totalOrderedQty = order.lineItems.reduce((sum, item)=>sum + item.quantity, 0);
        const newReturnStatus = totalReturnedQty >= totalOrderedQty ? 'Trả hàng toàn bộ' : 'Trả hàng một phần';
        updateOrder(order.systemId, {
            ...order,
            returnStatus: newReturnStatus
        });
        return {
            newReturn,
            newOrderSystemId
        };
    },
    /**
   * ✅ Confirm receipt of returned items and update inventory
   * Use this when isReceived was false initially and items are now received
   * ✅ For combo products, add stock to child products instead
   */ confirmReceipt: (returnSystemId)=>{
        const salesReturn = baseStore.getState().findById(returnSystemId);
        if (!salesReturn) {
            console.error('❌ [Sales Return] Return not found:', returnSystemId);
            return {
                success: false,
                message: 'Không tìm thấy phiếu trả hàng'
            };
        }
        if (salesReturn.isReceived) {
            console.warn('⚠️ [Sales Return] Already received:', returnSystemId);
            return {
                success: false,
                message: 'Hàng đã được nhận trước đó'
            };
        }
        const { updateInventory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
        const { addEntry: addStockHistory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStockHistoryStore"].getState();
        // ✅ Expand combo items to child products
        const stockItems = getReturnStockItems(salesReturn.items);
        // Update inventory for all returned items (including expanded combo children)
        stockItems.forEach((item)=>{
            if (item.quantity > 0) {
                const product = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState().findById(item.productSystemId);
                const oldStock = product?.inventoryByBranch[salesReturn.branchSystemId] || 0;
                updateInventory(item.productSystemId, salesReturn.branchSystemId, item.quantity);
                addStockHistory({
                    productId: item.productSystemId,
                    date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])().toISOString(),
                    employeeName: salesReturn.creatorName,
                    action: 'Nhập hàng từ khách trả (xác nhận)',
                    quantityChange: item.quantity,
                    newStockLevel: oldStock + item.quantity,
                    documentId: salesReturn.id,
                    branchSystemId: salesReturn.branchSystemId,
                    branch: salesReturn.branchName
                });
            }
        });
        // Update the return record
        baseStore.getState().update(returnSystemId, {
            ...salesReturn,
            isReceived: true
        });
        console.log('✅ [Sales Return] Receipt confirmed and inventory updated:', returnSystemId);
        return {
            success: true,
            message: 'Đã xác nhận nhận hàng và cập nhật tồn kho'
        };
    }
};
const useSalesReturnStore = ()=>{
    const state = baseStore();
    return {
        ...state,
        ...augmentedMethods
    };
};
// Export getState for non-hook usage
useSalesReturnStore.getState = ()=>{
    const state = baseStore.getState();
    return {
        ...state,
        ...augmentedMethods
    };
};
}),
"[project]/features/payments/data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PAYMENT000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PC000001'),
        date: '2024-11-12',
        amount: 2000000,
        recipientTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('NHACUNGCAP'),
        recipientTypeName: 'Nhà cung cấp',
        recipientName: 'Công ty TNHH ABC',
        recipientSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SUPPLIER000001'),
        description: 'Thanh toán tiền hàng nhập kho',
        paymentMethodSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CHUYENKHOAN'),
        paymentMethodName: 'Chuyển khoản',
        accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACCOUNT000002'),
        paymentReceiptTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PT_PURCHASE'),
        paymentReceiptTypeName: 'Mua hàng',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001'),
        branchName: 'Chi nhánh 1',
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('admin'),
        createdAt: '2024-11-12T09:00:00Z',
        status: 'completed',
        category: 'purchase',
        affectsDebt: false,
        runningBalance: 501000000
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PAYMENT000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('PC000002'),
        date: '2024-11-13',
        amount: 1500000,
        recipientTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('NHANVIEN'),
        recipientTypeName: 'Nhân viên',
        recipientName: 'Lê Văn C',
        recipientSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001'),
        description: 'Tạm ứng lương tháng 11',
        paymentMethodSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('TIENMAT'),
        paymentMethodName: 'Tiền mặt',
        accountSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ACCOUNT000001'),
        paymentReceiptTypeSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PT_SALARY'),
        paymentReceiptTypeName: 'Chi lương',
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001'),
        branchName: 'Chi nhánh 1',
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('admin'),
        createdAt: '2024-11-13T15:00:00Z',
        status: 'completed',
        category: 'salary',
        affectsDebt: false,
        runningBalance: 1730738671
    }
];
}),
"[project]/features/payments/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePaymentStore",
    ()=>usePaymentStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payments/data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/finance/document-lookups.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
// Helper to get current user info
const getCurrentUserInfo = ()=>{
    const currentUserSystemId = __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]?.() || 'SYSTEM';
    const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().data.find((e)=>e.systemId === currentUserSystemId);
    return {
        systemId: currentUserSystemId,
        name: employee?.fullName || 'Hệ thống',
        avatar: employee?.avatarUrl
    };
};
// Helper to create history entry
const createHistoryEntry = (action, description, metadata)=>({
        id: crypto.randomUUID(),
        action,
        timestamp: new Date(),
        user: getCurrentUserInfo(),
        description,
        metadata
    });
const PAYMENT_ENTITY = 'payments';
const SYSTEM_ID_PREFIX = 'PAYMENT';
const BUSINESS_ID_PREFIX = 'PC';
const BUSINESS_ID_DIGITS = 6;
const PURCHASE_ORDER_SYSTEM_PREFIX = 'PURCHASE';
const PURCHASE_ORDER_BUSINESS_PREFIX = 'PO';
const normalizePaymentStatus = (status)=>status === 'cancelled' ? 'cancelled' : 'completed';
const normalizePayment = (payment)=>({
        ...payment,
        status: normalizePaymentStatus(payment.status)
    });
const ensurePaymentMetadata = (payment)=>{
    let mutated = false;
    const updates = {};
    const targetGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickTargetGroup"])({
        systemId: payment.recipientTypeSystemId,
        name: payment.recipientTypeName
    });
    if (targetGroup) {
        if (payment.recipientTypeSystemId !== targetGroup.systemId) {
            updates.recipientTypeSystemId = targetGroup.systemId;
            mutated = true;
        }
        if (payment.recipientTypeName !== targetGroup.name) {
            updates.recipientTypeName = targetGroup.name;
            mutated = true;
        }
    }
    const paymentMethod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickPaymentMethod"])({
        systemId: payment.paymentMethodSystemId,
        name: payment.paymentMethodName
    });
    if (paymentMethod) {
        if (payment.paymentMethodSystemId !== paymentMethod.systemId) {
            updates.paymentMethodSystemId = paymentMethod.systemId;
            mutated = true;
        }
        if (payment.paymentMethodName !== paymentMethod.name) {
            updates.paymentMethodName = paymentMethod.name;
            mutated = true;
        }
    }
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickAccount"])({
        accountSystemId: payment.accountSystemId,
        branchSystemId: payment.branchSystemId,
        paymentMethodName: paymentMethod?.name ?? payment.paymentMethodName
    });
    if (account && payment.accountSystemId !== account.systemId) {
        updates.accountSystemId = account.systemId;
        mutated = true;
    }
    const paymentType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$lookups$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pickPaymentType"])({
        systemId: payment.paymentReceiptTypeSystemId,
        name: payment.paymentReceiptTypeName
    });
    if (paymentType) {
        if (payment.paymentReceiptTypeSystemId !== paymentType.systemId) {
            updates.paymentReceiptTypeSystemId = paymentType.systemId;
            mutated = true;
        }
        if (payment.paymentReceiptTypeName !== paymentType.name) {
            updates.paymentReceiptTypeName = paymentType.name;
            mutated = true;
        }
    }
    const normalizedGroupName = targetGroup?.name?.trim().toLowerCase();
    if (normalizedGroupName === 'khách hàng') {
        if (!payment.customerName && payment.recipientName) {
            updates.customerName = payment.recipientName;
            mutated = true;
        }
        if (!payment.customerSystemId && payment.recipientSystemId) {
            updates.customerSystemId = payment.recipientSystemId;
            mutated = true;
        }
    }
    return mutated ? {
        ...payment,
        ...updates
    } : payment;
};
const backfillPaymentMetadata = (payments)=>{
    let mutated = false;
    const updated = payments.map((payment)=>{
        const normalized = ensurePaymentMetadata(payment);
        if (normalized !== payment) {
            mutated = true;
        }
        return normalized;
    });
    return mutated ? updated : payments;
};
const initialPayments = backfillPaymentMetadata(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["data"].map(normalizePayment));
let systemIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(initialPayments, SYSTEM_ID_PREFIX);
let businessIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])(initialPayments, BUSINESS_ID_PREFIX);
const getNextSystemId = ()=>{
    systemIdCounter += 1;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])(PAYMENT_ENTITY, systemIdCounter));
};
const ensurePaymentBusinessId = (payments, provided)=>{
    if (provided && `${provided}`.trim().length > 0) {
        const normalized = `${provided}`.trim().toUpperCase();
        const parsedCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractCounterFromBusinessId"])(normalized, BUSINESS_ID_PREFIX);
        if (parsedCounter > businessIdCounter) {
            businessIdCounter = parsedCounter;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(normalized);
    }
    const existingIds = payments.map((payment)=>payment.id).filter(Boolean);
    const { nextId, updatedCounter } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(BUSINESS_ID_PREFIX, existingIds, businessIdCounter, BUSINESS_ID_DIGITS);
    businessIdCounter = updatedCounter;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(nextId);
};
const reconcileLinkedDocuments = (payment)=>{
    if (!payment.originalDocumentId) {
        return payment;
    }
    const normalizedDocId = payment.originalDocumentId.toUpperCase();
    const nextPayment = {
        ...payment
    };
    if (!nextPayment.purchaseOrderSystemId && normalizedDocId.startsWith(PURCHASE_ORDER_SYSTEM_PREFIX)) {
        nextPayment.purchaseOrderSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(payment.originalDocumentId);
    }
    if (!nextPayment.purchaseOrderId && normalizedDocId.startsWith(PURCHASE_ORDER_BUSINESS_PREFIX)) {
        nextPayment.purchaseOrderId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(payment.originalDocumentId);
    }
    return nextPayment;
};
const buildPayment = (input, existingPayments)=>{
    const systemId = getNextSystemId();
    const id = ensurePaymentBusinessId(existingPayments, input.id);
    const basePayment = {
        ...input,
        systemId,
        id,
        createdAt: input.createdAt || new Date().toISOString(),
        status: normalizePaymentStatus(input.status)
    };
    return reconcileLinkedDocuments(basePayment);
};
const usePaymentStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        data: initialPayments,
        businessIdCounter,
        systemIdCounter,
        add: (item)=>{
            let createdPayment = null;
            set((state)=>{
                const newPayment = buildPayment(item, state.data);
                createdPayment = newPayment;
                return {
                    data: [
                        ...state.data,
                        newPayment
                    ],
                    businessIdCounter,
                    systemIdCounter
                };
            });
            return createdPayment;
        },
        addMultiple: (items)=>{
            set((state)=>{
                const created = [];
                items.forEach((item)=>{
                    const context = [
                        ...state.data,
                        ...created
                    ];
                    const payment = buildPayment(item, context);
                    created.push(payment);
                });
                return {
                    data: [
                        ...state.data,
                        ...created
                    ],
                    businessIdCounter,
                    systemIdCounter
                };
            });
        },
        update: (systemId, item)=>{
            set((state)=>({
                    data: state.data.map((payment)=>payment.systemId === systemId ? reconcileLinkedDocuments({
                            ...item,
                            systemId,
                            status: normalizePaymentStatus(item.status),
                            updatedAt: new Date().toISOString()
                        }) : payment),
                    businessIdCounter,
                    systemIdCounter
                }));
        },
        remove: (systemId)=>{
            set((state)=>({
                    data: state.data.filter((payment)=>payment.systemId !== systemId),
                    businessIdCounter,
                    systemIdCounter
                }));
        },
        findById: (systemId)=>{
            return get().data.find((payment)=>payment.systemId === systemId);
        },
        getActive: ()=>{
            return get().data.filter((payment)=>payment.status !== 'cancelled');
        },
        cancel: (systemId, reason)=>{
            const payment = get().findById(systemId);
            if (payment && payment.status !== 'cancelled') {
                const historyEntry = createHistoryEntry('cancelled', `Đã hủy phiếu chi${reason ? `: ${reason}` : ''}`, {
                    oldValue: 'Hoàn thành',
                    newValue: 'Đã hủy',
                    note: reason
                });
                get().update(systemId, {
                    ...payment,
                    status: 'cancelled',
                    cancelledAt: new Date().toISOString(),
                    activityHistory: [
                        ...payment.activityHistory || [],
                        historyEntry
                    ]
                });
            }
        }
    }));
}),
"[project]/features/shipments/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useShipmentStore",
    ()=>useShipmentStore
]);
/**
 * Shipment Store - Entity riêng cho vận đơn
 * 
 * ⚠️ ID Format theo ID-GOVERNANCE.md:
 * - SystemId: SHIPMENT000001
 * - BusinessId: VC000001
 * 
 * Relationship: Shipment 1:1 Packaging (via packagingSystemId)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
;
;
;
;
// ========================================
// CONSTANTS
// ========================================
const SHIPMENT_SYSTEM_ID_PREFIX = 'SHIPMENT';
const SHIPMENT_BUSINESS_ID_PREFIX = 'VC';
// ========================================
// INITIAL SEED DATA
// ========================================
const initialData = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000001'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000001'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000001'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000001'),
        trackingCode: 'GHN000001',
        carrier: 'GHN',
        service: 'Chuẩn',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Đã đối soát',
        shippingFeeToPartner: 25000,
        codAmount: 0,
        payer: 'Người gửi',
        createdAt: '2025-11-01 08:30',
        dispatchedAt: '2025-11-02 08:00',
        deliveredAt: '2025-11-05 15:30'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000002'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000002'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000002'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000002'),
        trackingCode: 'JT000245',
        carrier: 'J&T Express',
        service: 'Gói chuẩn',
        deliveryStatus: 'Đang giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 30000,
        codAmount: 5000000,
        payer: 'Người nhận',
        createdAt: '2025-11-03 16:00',
        dispatchedAt: '2025-11-04 09:00'
    },
    // Thêm dữ liệu mẫu mới
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000003'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000005'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000005'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000005'),
        trackingCode: 'GHTK123456',
        carrier: 'GHTK',
        service: 'Nhanh',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 35000,
        codAmount: 12500000,
        payer: 'Người nhận',
        createdAt: '2025-11-08 10:00',
        dispatchedAt: '2025-11-08 14:00',
        deliveredAt: '2025-11-10 11:30'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000004'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000006'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000006'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000006'),
        trackingCode: 'VTP789012',
        carrier: 'Viettel Post',
        service: 'Tiêu chuẩn',
        deliveryStatus: 'Đang giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 28000,
        codAmount: 8900000,
        payer: 'Người nhận',
        createdAt: '2025-11-09 09:15',
        dispatchedAt: '2025-11-09 15:30'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000005'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000007'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000007'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000007'),
        trackingCode: 'GHN345678',
        carrier: 'GHN',
        service: 'Express',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 45000,
        codAmount: 23800000,
        payer: 'Người nhận',
        createdAt: '2025-11-07 08:00',
        dispatchedAt: '2025-11-07 10:00',
        deliveredAt: '2025-11-08 09:30'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000006'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000008'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000008'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000008'),
        trackingCode: 'BEST567890',
        carrier: 'Best Express',
        service: 'Tiết kiệm',
        deliveryStatus: 'Chờ lấy hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 22000,
        codAmount: 4500000,
        payer: 'Người nhận',
        createdAt: '2025-11-10 07:30'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000007'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000007'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000009'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000009'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000009'),
        trackingCode: 'NJV901234',
        carrier: 'Ninja Van',
        service: 'Standard',
        deliveryStatus: 'Đã giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Đã đối soát',
        shippingFeeToPartner: 32000,
        codAmount: 15600000,
        payer: 'Người gửi',
        createdAt: '2025-11-05 11:00',
        dispatchedAt: '2025-11-05 16:00',
        deliveredAt: '2025-11-07 14:30'
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SHIPMENT000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('VC000008'),
        packagingSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('PACKAGE000010'),
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000010'),
        orderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('DH000010'),
        trackingCode: 'JT567891',
        carrier: 'J&T Express',
        service: 'Siêu tốc',
        deliveryStatus: 'Đang giao hàng',
        printStatus: 'Đã in',
        reconciliationStatus: 'Chưa đối soát',
        shippingFeeToPartner: 55000,
        codAmount: 31200000,
        payer: 'Người nhận',
        createdAt: '2025-11-10 14:00',
        dispatchedAt: '2025-11-10 16:30'
    }
];
// ========================================
// HELPER FUNCTIONS
// ========================================
let shipmentSystemIdCounter = 0;
let shipmentBusinessIdCounter = 0;
function initCounters(shipments) {
    shipmentSystemIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(shipments, SHIPMENT_SYSTEM_ID_PREFIX);
    shipmentBusinessIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])(shipments, SHIPMENT_BUSINESS_ID_PREFIX);
}
function getNextShipmentSystemId() {
    shipmentSystemIdCounter++;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])('shipments', shipmentSystemIdCounter);
}
function getNextShipmentBusinessId() {
    shipmentBusinessIdCounter++;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateBusinessId"])('shipments', shipmentBusinessIdCounter);
}
// Initialize counters
initCounters(initialData);
const useShipmentStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        data: initialData,
        findById: (systemId)=>{
            return get().data.find((s)=>s.systemId === systemId);
        },
        findByPackagingSystemId: (packagingSystemId)=>{
            return get().data.find((s)=>s.packagingSystemId === packagingSystemId);
        },
        findByTrackingCode: (trackingCode)=>{
            return get().data.find((s)=>s.trackingCode === trackingCode);
        },
        createShipment: (data)=>{
            const newShipment = {
                systemId: getNextShipmentSystemId(),
                id: getNextShipmentBusinessId(),
                ...data
            };
            set((state)=>({
                    data: [
                        ...state.data,
                        newShipment
                    ]
                }));
            return newShipment;
        },
        updateShipment: (systemId, updates)=>{
            set((state)=>({
                    data: state.data.map((s)=>s.systemId === systemId ? {
                            ...s,
                            ...updates
                        } : s)
                }));
        },
        deleteShipment: (systemId)=>{
            set((state)=>({
                    data: state.data.filter((s)=>s.systemId !== systemId)
                }));
        },
        getNextSystemId: ()=>getNextShipmentSystemId(),
        getNextBusinessId: ()=>getNextShipmentBusinessId()
    }), {
    name: 'hrm-shipments',
    partialize: (state)=>({
            data: state.data
        }),
    onRehydrateStorage: ()=>(state)=>{
            if (state?.data) {
                initCounters(state.data);
                // ✅ MIGRATION: Merge seed data - add new shipments from initialData if not exist
                const existingIds = new Set(state.data.map((s)=>s.systemId));
                const newShipments = initialData.filter((s)=>!existingIds.has(s.systemId));
                if (newShipments.length > 0) {
                    useShipmentStore.setState((prev)=>({
                            data: [
                                ...prev.data,
                                ...newShipments
                            ]
                        }));
                    initCounters([
                        ...state.data,
                        ...newShipments
                    ]);
                }
            }
        }
}));
}),
"[project]/features/warranty/notification-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getWarrantyNotificationSummary",
    ()=>getWarrantyNotificationSummary,
    "isWarrantyNotificationEnabled",
    ()=>isWarrantyNotificationEnabled,
    "loadWarrantyNotificationSettings",
    ()=>loadWarrantyNotificationSettings,
    "notifyWarrantyAssigned",
    ()=>notifyWarrantyAssigned,
    "notifyWarrantyBulkAction",
    ()=>notifyWarrantyBulkAction,
    "notifyWarrantyCreated",
    ()=>notifyWarrantyCreated,
    "notifyWarrantyError",
    ()=>notifyWarrantyError,
    "notifyWarrantyOverdue",
    ()=>notifyWarrantyOverdue,
    "notifyWarrantyProcessed",
    ()=>notifyWarrantyProcessed,
    "notifyWarrantyProcessing",
    ()=>notifyWarrantyProcessing,
    "notifyWarrantyReminder",
    ()=>notifyWarrantyReminder,
    "notifyWarrantyReturned",
    ()=>notifyWarrantyReturned,
    "notifyWarrantyStatusChange",
    ()=>notifyWarrantyStatusChange,
    "saveWarrantyNotificationSettings",
    ()=>saveWarrantyNotificationSettings,
    "showWarrantyLoading",
    ()=>showWarrantyLoading,
    "showWarrantyNotification",
    ()=>showWarrantyNotification
]);
/**
 * Warranty Notification Utilities
 * Handle notification settings and events for warranty tickets
 * Pattern copied from Complaints notification system
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
;
// Storage key
const _STORAGE_KEY = 'warranty-notification-settings';
// Default notification settings
const defaultNotifications = {
    emailOnCreate: true,
    emailOnAssign: true,
    emailOnProcessing: false,
    emailOnProcessed: true,
    emailOnReturned: true,
    emailOnOverdue: true,
    smsOnOverdue: false,
    inAppNotifications: true,
    reminderNotifications: true
};
function loadWarrantyNotificationSettings() {
    return defaultNotifications;
}
function saveWarrantyNotificationSettings(_settings) {
    console.warn('saveWarrantyNotificationSettings is deprecated. Use useWarrantyNotificationSettings hook instead.');
}
function showWarrantyNotification(type, message, options) {
    const settings = loadWarrantyNotificationSettings();
    // Always show if inAppNotifications is enabled
    if (settings.inAppNotifications) {
        switch(type){
            case 'success':
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(message, options);
                break;
            case 'error':
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(message, options);
                break;
            case 'info':
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info(message, options);
                break;
            case 'warning':
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].warning(message, options);
                break;
        }
    }
}
function showWarrantyLoading(message) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].loading(message);
}
function isWarrantyNotificationEnabled(event) {
    const settings = loadWarrantyNotificationSettings();
    return settings[event] || false;
}
function notifyWarrantyCreated(ticketId) {
    if (isWarrantyNotificationEnabled('emailOnCreate')) {
        showWarrantyNotification('success', `Đã tạo phiếu bảo hành ${ticketId}`, {
            description: 'Phiếu mới đã được tạo thành công'
        });
    }
}
function notifyWarrantyAssigned(ticketId, employeeName) {
    if (isWarrantyNotificationEnabled('emailOnAssign')) {
        showWarrantyNotification('info', `Phiếu ${ticketId} được gán cho ${employeeName}`, {
            description: 'Đã cập nhật người phụ trách'
        });
    }
}
function notifyWarrantyProcessing(ticketId) {
    if (isWarrantyNotificationEnabled('emailOnProcessing')) {
        showWarrantyNotification('info', `Phiếu ${ticketId} đang được xử lý`, {
            description: 'Nhân viên đã bắt đầu xử lý phiếu'
        });
    }
}
function notifyWarrantyProcessed(ticketId) {
    if (isWarrantyNotificationEnabled('emailOnProcessed')) {
        showWarrantyNotification('success', `Phiếu ${ticketId} đã xử lý xong`, {
            description: 'Sản phẩm sẵn sàng để trả khách'
        });
    }
}
function notifyWarrantyReturned(ticketId, orderId) {
    if (isWarrantyNotificationEnabled('emailOnReturned')) {
        showWarrantyNotification('success', `Phiếu ${ticketId} đã trả hàng`, {
            description: orderId ? `Liên kết với đơn hàng ${orderId}` : 'Đã hoàn tất quy trình'
        });
    }
}
function notifyWarrantyOverdue(ticketId, type) {
    if (isWarrantyNotificationEnabled('emailOnOverdue')) {
        const typeLabels = {
            response: 'phản hồi',
            processing: 'xử lý',
            return: 'trả hàng'
        };
        showWarrantyNotification('warning', `Phiếu ${ticketId} quá hạn ${typeLabels[type]}`, {
            description: 'Vui lòng kiểm tra và xử lý ngay',
            duration: 10000
        });
    }
}
function notifyWarrantyReminder(ticketId, message) {
    if (isWarrantyNotificationEnabled('reminderNotifications')) {
        showWarrantyNotification('info', `Nhắc nhở: ${ticketId}`, {
            description: message,
            duration: 8000
        });
    }
}
function notifyWarrantyStatusChange(ticketId, oldStatus, newStatus) {
    showWarrantyNotification('info', `Phiếu ${ticketId} đã chuyển trạng thái`, {
        description: `${oldStatus} → ${newStatus}`
    });
}
function notifyWarrantyBulkAction(action, count) {
    showWarrantyNotification('success', `Đã ${action} ${count} phiếu bảo hành`, {
        description: 'Thao tác hàng loạt thành công'
    });
}
function notifyWarrantyError(message, details) {
    showWarrantyNotification('error', message, {
        description: details,
        duration: 5000
    });
}
function getWarrantyNotificationSummary() {
    const settings = loadWarrantyNotificationSettings();
    const enabledCount = Object.values(settings).filter(Boolean).length;
    const totalCount = Object.keys(settings).length;
    return {
        enabled: enabledCount,
        total: totalCount,
        percentage: Math.round(enabledCount / totalCount * 100)
    };
}
}),
"[project]/features/warranty/use-realtime-updates.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getWarrantyDataVersion",
    ()=>getWarrantyDataVersion,
    "triggerWarrantyDataUpdate",
    ()=>triggerWarrantyDataUpdate,
    "useRealtimeUpdates",
    ()=>useRealtimeUpdates
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
;
;
function useRealtimeUpdates(dataVersion, onRefresh, interval = 30000 // 30 seconds default
) {
    const [hasUpdates, setHasUpdates] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [lastVersion, setLastVersion] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](dataVersion);
    const [isPolling, setIsPolling] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false); // Default OFF for warranty
    const checkForUpdates = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        // In real app, this would check localStorage or make API call
        if ("TURBOPACK compile-time truthy", 1) return false;
        //TURBOPACK unreachable
        ;
    }, [
        lastVersion
    ]);
    const handleRefresh = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        setLastVersion(dataVersion);
        setHasUpdates(false);
        onRefresh();
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã làm mới dữ liệu bảo hành');
    }, [
        dataVersion,
        onRefresh
    ]);
    const showUpdateNotification = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Có cập nhật mới cho bảo hành', {
            duration: 10000,
            position: 'top-right',
            action: {
                label: 'Làm mới',
                onClick: ()=>{
                    handleRefresh();
                }
            }
        });
    }, [
        handleRefresh
    ]);
    // Check for updates periodically
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (!isPolling) return;
        const timer = setInterval(()=>{
            // Simulate checking for updates
            // In real app, this would be a fetch to server
            const hasNewData = checkForUpdates();
            if (hasNewData && dataVersion !== lastVersion) {
                setHasUpdates(true);
                showUpdateNotification();
            }
        }, interval);
        return ()=>clearInterval(timer);
    }, [
        isPolling,
        interval,
        dataVersion,
        lastVersion,
        checkForUpdates,
        showUpdateNotification
    ]);
    // Check if data version changed
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (dataVersion !== lastVersion) {
            setHasUpdates(true);
        }
    }, [
        dataVersion,
        lastVersion
    ]);
    const togglePolling = ()=>{
        setIsPolling((prev)=>!prev);
        if (!isPolling) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Đã bật chế độ cập nhật tự động (30s)', {
                duration: 3000
            });
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Đã tắt chế độ cập nhật tự động', {
                duration: 3000
            });
        }
    };
    return {
        hasUpdates,
        isPolling,
        refresh: handleRefresh,
        togglePolling
    };
}
function triggerWarrantyDataUpdate() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function getWarrantyDataVersion() {
    if ("TURBOPACK compile-time truthy", 1) return 0;
    //TURBOPACK unreachable
    ;
}
}),
"[project]/features/warranty/initial-data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WARRANTY_SEED_AUDIT_TEMPLATE",
    ()=>WARRANTY_SEED_AUDIT_TEMPLATE,
    "warrantyInitialData",
    ()=>warrantyInitialData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-audit.ts [app-ssr] (ecmascript)");
;
;
/**
 * Initial Warranty Data
 * Empty array - data will be persisted in localStorage by createCrudStore
 * 
 * Example of properly typed warranty record:
 * {
 *   systemId: asSystemId('WARRANTY00000001'),
 *   id: asBusinessId('WR001'),
 *   branchSystemId: asSystemId('BRANCH00000001'),
 *   employeeSystemId: asSystemId('NV00000001'),
 *   customerSystemId: asSystemId('CUSTOMER00000001'),
 *   linkedOrderSystemId: asSystemId('ORDER00000123'),
 *   products: [
 *     {
 *       systemId: asSystemId('WARPROD00000001'),
 *       productSystemId: asSystemId('PRODUCT00000045'),
 *       sku: asBusinessId('SKU001'),
 *       ...
 *     }
 *   ],
 *   ...
 * }
 */ const seedCustomer = {
    systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUST000001'),
    name: 'Công ty Cổ phần Bất động sản Hưng Thịnh',
    phone: '0901112233',
    address: '123 Đường ABC, Phường 1, Quận 1, TP.HCM'
};
const seedBranch = {
    systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000003'),
    name: 'Chi nhánh Trung tâm'
};
const warrantyOwner = {
    systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002'),
    name: 'Trần Thị Bình'
};
const warrantyInitialData = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('WARRANTY000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('BH000001'),
        branchSystemId: seedBranch.systemId,
        branchName: seedBranch.name,
        employeeSystemId: warrantyOwner.systemId,
        employeeName: warrantyOwner.name,
        customerSystemId: seedCustomer.systemId,
        customerName: seedCustomer.name,
        customerPhone: seedCustomer.phone,
        customerAddress: seedCustomer.address,
        trackingCode: 'GHN-WAR-0001',
        publicTrackingCode: 'wh8ut4nz9p',
        shippingFee: 45000,
        referenceUrl: 'https://docs.google.com/spreadsheets/d/war-0001',
        linkedOrderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000001'),
        receivedImages: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=640&q=80'
        ],
        products: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('WARPROD000001'),
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SP000001'),
                sku: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000001'),
                productName: 'Laptop Dell Inspiron 15',
                quantity: 1,
                unitPrice: 15000000,
                issueDescription: 'Máy tự tắt khi sử dụng hơn 30 phút',
                resolution: 'replace',
                deductionAmount: 0,
                productImages: [
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80'
                ],
                notes: 'Cần sao lưu dữ liệu trước khi chuyển hãng'
            },
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('WARPROD000002'),
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SP000002'),
                sku: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000002'),
                productName: 'Chuột Logitech MX Master 3',
                quantity: 1,
                unitPrice: 2000000,
                issueDescription: 'Con lăn bị kẹt định kỳ',
                resolution: 'return',
                productImages: [
                    'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=400&q=80'
                ],
                notes: 'Đã vệ sinh nhưng lỗi tái diễn'
            }
        ],
        processedImages: [
            'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=640&q=80'
        ],
        status: 'processed',
        settlementStatus: 'pending',
        stockDeducted: false,
        processingStartedAt: '2025-11-13T01:30:00Z',
        processedAt: '2025-11-13T09:00:00Z',
        notes: 'Đợi xác nhận của khách về phương án đổi mới laptop.',
        summary: {
            totalProducts: 2,
            totalReplaced: 1,
            totalReturned: 1,
            totalDeduction: 0,
            totalOutOfStock: 0,
            totalSettlement: 0
        },
        history: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('WARHIST000001'),
                action: 'create',
                actionLabel: 'Tạo phiếu bảo hành',
                performedBy: warrantyOwner.name,
                performedBySystemId: warrantyOwner.systemId,
                performedAt: '2025-11-12T09:00:00Z',
                note: 'Tiếp nhận phiếu bảo hành từ khách Hưng Thịnh.',
                linkedOrderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000001')
            },
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('WARHIST000002'),
                action: 'update_status',
                actionLabel: 'Bắt đầu xử lý',
                performedBy: warrantyOwner.name,
                performedBySystemId: warrantyOwner.systemId,
                performedAt: '2025-11-13T01:30:00Z',
                note: 'Chuyển trạng thái sang Đang xử lý và gửi thiết bị sang ASUS.'
            },
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('WARHIST000003'),
                action: 'update_status',
                actionLabel: 'Hoàn tất xử lý',
                performedBy: warrantyOwner.name,
                performedBySystemId: warrantyOwner.systemId,
                performedAt: '2025-11-13T09:00:00Z',
                note: 'Laptop sẽ đổi máy mới, chuột vệ sinh và trả lại.'
            }
        ],
        comments: [],
        subtasks: [],
        createdBy: warrantyOwner.name,
        createdBySystemId: warrantyOwner.systemId,
        createdAt: '2025-11-12T09:00:00Z',
        updatedAt: '2025-11-13T09:00:00Z',
        updatedBySystemId: warrantyOwner.systemId
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('WARRANTY000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('BH000002'),
        branchSystemId: seedBranch.systemId,
        branchName: seedBranch.name,
        employeeSystemId: warrantyOwner.systemId,
        employeeName: warrantyOwner.name,
        customerSystemId: seedCustomer.systemId,
        customerName: seedCustomer.name,
        customerPhone: seedCustomer.phone,
        customerAddress: seedCustomer.address,
        trackingCode: 'GHTK-WAR-0452',
        publicTrackingCode: 'r9bth1e6md',
        shippingFee: 30000,
        linkedOrderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000005'),
        receivedImages: [
            'https://images.unsplash.com/photo-1581291518823-11e99804a128?auto=format&fit=crop&w=640&q=80'
        ],
        products: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('WARPROD000003'),
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SP000008'),
                sku: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000008'),
                productName: 'Bàn phím cơ Keychron K2',
                quantity: 1,
                unitPrice: 2500000,
                issueDescription: 'Phím space bị kẹt sau 1 tuần sử dụng',
                resolution: 'replace',
                productImages: [
                    'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80'
                ]
            },
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('WARPROD000004'),
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SP000010'),
                sku: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000010'),
                productName: 'Switch Gateron Yellow',
                quantity: 6,
                unitPrice: 5000,
                issueDescription: 'Một số switch không nhận tín hiệu sau khi lắp',
                resolution: 'deduct',
                deductionAmount: 60000,
                productImages: [],
                notes: 'Khách đề nghị hoàn tiền cho số switch lỗi'
            }
        ],
        status: 'pending',
        settlementStatus: 'pending',
        stockDeducted: false,
        notes: 'Đang chờ kỹ thuật kiểm tra bàn phím.',
        summary: {
            totalProducts: 2,
            totalReplaced: 0,
            totalReturned: 0,
            totalDeduction: 60000,
            totalOutOfStock: 0,
            totalSettlement: 60000
        },
        history: [
            {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('WARHIST000004'),
                action: 'create',
                actionLabel: 'Tạo phiếu bảo hành',
                performedBy: warrantyOwner.name,
                performedBySystemId: warrantyOwner.systemId,
                performedAt: '2025-11-18T03:00:00Z',
                note: 'Khách gửi bàn phím Keychron cần bảo hành.',
                linkedOrderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('ORDER000005')
            }
        ],
        comments: [],
        subtasks: [],
        createdBy: warrantyOwner.name,
        createdBySystemId: warrantyOwner.systemId,
        createdAt: '2025-11-18T03:00:00Z',
        updatedAt: '2025-11-18T03:00:00Z',
        updatedBySystemId: warrantyOwner.systemId
    }
];
const WARRANTY_SEED_AUDIT_TEMPLATE = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
    createdAt: '2024-02-01T00:00:00Z'
});
}),
"[project]/features/warranty/store/base-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "baseStore",
    ()=>baseStore,
    "generatePublicTrackingCode",
    ()=>generatePublicTrackingCode,
    "getCurrentUserName",
    ()=>getCurrentUserName,
    "originalAdd",
    ()=>originalAdd,
    "originalRemove",
    ()=>originalRemove,
    "originalUpdate",
    ()=>originalUpdate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$initial$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/initial-data.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
;
;
;
function getCurrentUserName() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])().name;
}
function generatePublicTrackingCode() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for(let i = 0; i < 10; i++){
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$initial$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warrantyInitialData"], 'warranty', {
    businessIdField: 'id',
    persistKey: 'hrm-warranty-tickets',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
const originalAdd = baseStore.getState().add;
const originalUpdate = baseStore.getState().update;
const originalRemove = baseStore.getState().remove;
}),
"[project]/features/warranty/store/stock-management.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "commitWarrantyStock",
    ()=>commitWarrantyStock,
    "deductWarrantyStock",
    ()=>deductWarrantyStock,
    "rollbackWarrantyStock",
    ()=>rollbackWarrantyStock,
    "uncommitWarrantyStock",
    ()=>uncommitWarrantyStock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/stock-history/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/base-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
function commitWarrantyStock(ticket) {
    const replaceProducts = ticket.products.filter((p)=>p.resolution === 'replace');
    if (replaceProducts.length > 0) {
        const productStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
        const productCache = new Map();
        productStore.data.forEach((p)=>productCache.set(p.id, p));
        replaceProducts.forEach((warrantyProduct)=>{
            if (!warrantyProduct.sku) {
                console.warn('Sản phẩm thiếu SKU, bỏ qua commit:', warrantyProduct.productName);
                return;
            }
            const product = productCache.get(warrantyProduct.sku);
            if (!product) {
                console.warn('Không tìm thấy sản phẩm trong kho:', warrantyProduct.sku);
                return;
            }
            const quantityToCommit = warrantyProduct.quantity || 1;
            // Reuse productStore.commitStock()
            productStore.commitStock(product.systemId, ticket.branchSystemId, quantityToCommit);
            console.log('✅ [COMMIT STOCK] Giữ hàng thay thế:', {
                productId: product.id,
                productName: product.name,
                quantity: quantityToCommit,
                warranty: ticket.id,
                branch: ticket.branchName
            });
        });
    }
}
function uncommitWarrantyStock(ticket, options) {
    const replaceProducts = ticket.products.filter((p)=>p.resolution === 'replace');
    if (replaceProducts.length > 0) {
        const productStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
        const productCache = new Map();
        productStore.data.forEach((p)=>productCache.set(p.id, p));
        replaceProducts.forEach((warrantyProduct)=>{
            if (!warrantyProduct.sku) return;
            const product = productCache.get(warrantyProduct.sku);
            if (product) {
                const quantityToUncommit = warrantyProduct.quantity || 1;
                // Reuse productStore.uncommitStock()
                productStore.uncommitStock(product.systemId, ticket.branchSystemId, quantityToUncommit);
                console.log('Đã uncommit stock:', {
                    productId: product.id,
                    quantity: quantityToUncommit,
                    warranty: ticket.id
                });
            }
        });
        if (!options?.silent) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Đã giải phóng hàng giữ chỗ', {
                description: `${replaceProducts.length} sản phẩm đã được trả lại kho có thể bán`,
                duration: 3000
            });
        }
    }
}
function deductWarrantyStock(ticket) {
    console.log('📤 [DEDUCT FUNCTION CALLED]:', {
        ticketId: ticket.id,
        ticketStatus: ticket.status,
        stockDeducted: ticket.stockDeducted,
        productsCount: ticket.products.length,
        replaceProducts: ticket.products.filter((p)=>p.resolution === 'replace').length
    });
    const replacedProducts = ticket.products.filter((p)=>p.resolution === 'replace');
    if (replacedProducts.length > 0) {
        const productStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
        const stockHistoryStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStockHistoryStore"].getState();
        const productCache = new Map();
        productStore.data.forEach((p)=>productCache.set(p.id, p));
        const deductionResults = [];
        let hasErrors = false;
        replacedProducts.forEach((warrantyProduct)=>{
            if (!warrantyProduct.sku) {
                deductionResults.push(`Sản phẩm "${warrantyProduct.productName}" không có SKU`);
                hasErrors = true;
                return;
            }
            const product = productCache.get(warrantyProduct.sku);
            if (!product) {
                deductionResults.push(`Không tìm thấy SP SKU: ${warrantyProduct.sku}`);
                hasErrors = true;
                return;
            }
            const currentInventory = product.inventoryByBranch[ticket.branchSystemId] || 0;
            const quantityToDeduct = warrantyProduct.quantity || 1;
            console.log('📤 [DEDUCT] Before:', {
                productId: product.id,
                currentInventory,
                quantityToDeduct,
                branchSystemId: ticket.branchSystemId
            });
            if (currentInventory < quantityToDeduct) {
                deductionResults.push(`${product.name} (${product.id}): Không đủ hàng (Tồn: ${currentInventory}, Cần: ${quantityToDeduct})`);
                hasErrors = true;
                return;
            }
            // ✅ Xuất kho trực tiếp (không dùng dispatchStock vì warranty không có inTransit)
            // -Tồn kho
            productStore.updateInventory(product.systemId, ticket.branchSystemId, -quantityToDeduct);
            // -Đang giao dịch (uncommit)
            productStore.uncommitStock(product.systemId, ticket.branchSystemId, quantityToDeduct);
            // ✅ Lấy lại product sau khi update
            const freshProductStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
            const updatedProduct = freshProductStore.data.find((p)=>p.systemId === product.systemId);
            const newStockLevel = updatedProduct?.inventoryByBranch[ticket.branchSystemId] || currentInventory - quantityToDeduct;
            console.log('✅ [DEDUCT] After:', {
                productId: product.id,
                newStockLevel,
                expectedLevel: currentInventory - quantityToDeduct
            });
            stockHistoryStore.addEntry({
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(product.systemId),
                date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])()),
                employeeName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserName"])(),
                action: 'Xuất bảo hành (đổi mới)',
                quantityChange: -quantityToDeduct,
                newStockLevel,
                documentId: ticket.id,
                branchSystemId: ticket.branchSystemId,
                branch: ticket.branchName
            });
            deductionResults.push(`${product.name} (${product.id}): Trừ ${quantityToDeduct} cái (Còn: ${newStockLevel})`);
        });
        if (hasErrors) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Có lỗi khi xuất kho', {
                description: deductionResults.join('\n'),
                duration: 6000
            });
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã xuất kho sản phẩm thay thế', {
                description: `Xuất ${replacedProducts.length} sản phẩm tại chi nhánh ${ticket.branchName}`,
                duration: 4000
            });
        }
    }
}
function rollbackWarrantyStock(ticket) {
    console.log('🔄 [ROLLBACK FUNCTION CALLED]:', {
        ticketId: ticket.id,
        ticketStatus: ticket.status,
        stockDeducted: ticket.stockDeducted,
        productsCount: ticket.products.length,
        replaceProducts: ticket.products.filter((p)=>p.resolution === 'replace').length
    });
    const replacedProducts = ticket.products.filter((p)=>p.resolution === 'replace');
    if (replacedProducts.length > 0) {
        const productStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
        const stockHistoryStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStockHistoryStore"].getState();
        const productCache = new Map();
        productStore.data.forEach((p)=>productCache.set(p.id, p));
        const rollbackResults = [];
        replacedProducts.forEach((warrantyProduct)=>{
            if (!warrantyProduct.sku) {
                rollbackResults.push(`Sản phẩm "${warrantyProduct.productName}" không có SKU`);
                return;
            }
            const product = productCache.get(warrantyProduct.sku);
            if (!product) {
                rollbackResults.push(`Không tìm thấy SP SKU: ${warrantyProduct.sku}`);
                return;
            }
            const quantityToRollback = warrantyProduct.quantity || 1;
            const currentInventory = product.inventoryByBranch[ticket.branchSystemId] || 0;
            console.log('🔄 [ROLLBACK] Before:', {
                productId: product.id,
                currentInventory,
                quantityToRollback,
                branchSystemId: ticket.branchSystemId
            });
            // ✅ Hoàn kho: +Tồn kho (warranty xuất trực tiếp, không qua inTransit)
            productStore.updateInventory(product.systemId, ticket.branchSystemId, quantityToRollback);
            // ✅ Lấy lại product sau khi update để có inventory mới
            const freshProductStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
            const updatedProduct = freshProductStore.data.find((p)=>p.systemId === product.systemId);
            const newStockLevel = updatedProduct?.inventoryByBranch[ticket.branchSystemId] || currentInventory + quantityToRollback;
            console.log('✅ [ROLLBACK] After:', {
                productId: product.id,
                newStockLevel,
                expectedLevel: currentInventory + quantityToRollback
            });
            // Note: Không cần uncommit vì khi deduct đã uncommit rồi
            stockHistoryStore.addEntry({
                productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(product.systemId),
                date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])()),
                employeeName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserName"])(),
                action: 'Hoàn kho (Hủy bảo hành)',
                quantityChange: quantityToRollback,
                newStockLevel,
                documentId: ticket.id,
                branchSystemId: ticket.branchSystemId,
                branch: ticket.branchName
            });
            rollbackResults.push(`${product.name} (${product.id}): Hoàn ${quantityToRollback} cái`);
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info('Đã hoàn kho sản phẩm thay thế', {
            description: rollbackResults.join('\n'),
            duration: 4000
        });
    }
}
}),
"[project]/features/warranty/store/product-management.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addHistory",
    ()=>addHistory,
    "addProduct",
    ()=>addProduct,
    "calculateSettlementStatus",
    ()=>calculateSettlementStatus,
    "calculateSummary",
    ()=>calculateSummary,
    "recalculateSummary",
    ()=>recalculateSummary,
    "removeProduct",
    ()=>removeProduct,
    "updateProduct",
    ()=>updateProduct
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/base-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$stock$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/stock-management.ts [app-ssr] (ecmascript)");
;
;
;
;
function calculateSummary(products) {
    const outOfStockProducts = products.filter((p)=>p.resolution === 'out_of_stock' || p.resolution === 'deduct');
    const totalSettlement = outOfStockProducts.reduce((sum, p)=>{
        if (p.resolution === 'deduct') return sum + (p.deductionAmount || 0);
        if (p.resolution === 'out_of_stock') return sum + (p.quantity || 1) * (p.unitPrice || 0);
        return sum;
    }, 0);
    return {
        totalProducts: products.reduce((sum, p)=>sum + (p.quantity || 1), 0),
        totalReplaced: products.filter((p)=>p.resolution === 'replace').reduce((sum, p)=>sum + (p.quantity || 1), 0),
        totalReturned: products.filter((p)=>p.resolution === 'return').reduce((sum, p)=>sum + (p.quantity || 1), 0),
        totalDeduction: totalSettlement,
        totalOutOfStock: outOfStockProducts.reduce((sum, p)=>sum + (p.quantity || 1), 0),
        totalSettlement: totalSettlement
    };
}
function adjustReplacementStock(ticket, previousProduct, nextProduct) {
    if (!ticket) return;
    const previousQty = previousProduct?.resolution === 'replace' ? previousProduct.quantity || 1 : 0;
    const nextQty = nextProduct?.resolution === 'replace' ? nextProduct.quantity || 1 : 0;
    if (previousQty === nextQty) {
        return;
    }
    const diff = Math.abs(nextQty - previousQty);
    const referenceProduct = nextQty > previousQty ? nextProduct : previousProduct;
    if (!referenceProduct || diff <= 0) return;
    const tempProduct = {
        ...referenceProduct,
        quantity: diff
    };
    const tempTicket = {
        ...ticket,
        products: [
            tempProduct
        ]
    };
    if (nextQty > previousQty) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$stock$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commitWarrantyStock"])(tempTicket);
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$stock$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["uncommitWarrantyStock"])(tempTicket, {
            silent: true
        });
    }
}
function addProduct(ticketSystemId, product) {
    const ticket = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].getState().data.find((t)=>t.systemId === ticketSystemId);
    if (!ticket) return;
    const newProduct = {
        ...product,
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`WP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    };
    adjustReplacementStock(ticket, undefined, newProduct);
    const updatedProducts = [
        ...ticket.products,
        newProduct
    ];
    const summary = calculateSummary(updatedProducts);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalUpdate"])(ticketSystemId, {
        ...ticket,
        products: updatedProducts,
        summary,
        updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])())
    });
    // Add history
    const resolutionLabels = {
        replace: 'Thay thế',
        refund: 'Hoàn tiền',
        deduct: 'Trừ tiền',
        warranty_extension: 'Gia hạn BH',
        no_warranty: 'Không BH',
        out_of_stock: 'Hết hàng',
        return: 'Trả hàng'
    };
    const resolution = resolutionLabels[newProduct.resolution] || newProduct.resolution;
    const quantity = newProduct.quantity || 1;
    addHistory(ticketSystemId, `Thêm SP: ${newProduct.productName} (${resolution}, SL: ${quantity})`, (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserName"])());
}
function updateProduct(ticketSystemId, productSystemId, updates) {
    const ticket = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].getState().data.find((t)=>t.systemId === ticketSystemId);
    if (!ticket) return;
    const originalProduct = ticket.products.find((p)=>p.systemId === productSystemId);
    if (!originalProduct) return;
    const updatedProducts = ticket.products.map((p)=>p.systemId === productSystemId ? {
            ...p,
            ...updates
        } : p);
    const summary = calculateSummary(updatedProducts);
    const updatedProduct = updatedProducts.find((p)=>p.systemId === productSystemId);
    adjustReplacementStock(ticket, originalProduct, updatedProduct);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalUpdate"])(ticketSystemId, {
        ...ticket,
        products: updatedProducts,
        summary,
        updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])())
    });
    // Add history
    if (updatedProduct) {
        addHistory(ticketSystemId, `Cập nhật SP: ${updatedProduct.productName}`, (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserName"])());
    }
}
function removeProduct(ticketSystemId, productSystemId) {
    const ticket = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].getState().data.find((t)=>t.systemId === ticketSystemId);
    if (!ticket) return;
    const productToRemove = ticket.products.find((p)=>p.systemId === productSystemId);
    const updatedProducts = ticket.products.filter((p)=>p.systemId !== productSystemId);
    const summary = calculateSummary(updatedProducts);
    if (productToRemove) {
        adjustReplacementStock(ticket, productToRemove, undefined);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalUpdate"])(ticketSystemId, {
        ...ticket,
        products: updatedProducts,
        summary,
        updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])())
    });
    if (productToRemove) {
        addHistory(ticketSystemId, `Xóa SP: ${productToRemove.productName}`, (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserName"])());
    }
}
function recalculateSummary(ticketSystemId) {
    const ticket = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].getState().data.find((t)=>t.systemId === ticketSystemId);
    if (!ticket) return;
    const summary = calculateSummary(ticket.products);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalUpdate"])(ticketSystemId, {
        ...ticket,
        summary
    });
}
function calculateSettlementStatus(totalSettlement, totalPaid, shippingFee = 0) {
    if (totalSettlement <= 0) return 'completed';
    const netAmount = totalSettlement - shippingFee;
    if (netAmount <= 0) return 'completed';
    if (totalPaid === 0) return 'pending';
    if (totalPaid >= netAmount) return 'completed';
    return 'partial';
}
function addHistory(ticketSystemId, action, performedBy, note, metadata) {
    const ticket = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].getState().data.find((t)=>t.systemId === ticketSystemId);
    if (!ticket) return;
    const historyEntry = {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`WH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
        action,
        actionLabel: action,
        performedBy,
        performedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])()),
        note,
        metadata
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalUpdate"])(ticketSystemId, {
        ...ticket,
        history: [
            ...ticket.history || [],
            historyEntry
        ]
    });
}
}),
"[project]/features/warranty/store/status-management.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateStatus",
    ()=>updateStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/base-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/product-management.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$stock$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/stock-management.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$notification$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/notification-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/use-realtime-updates.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
const STATUS_ORDER = {
    incomplete: 0,
    pending: 1,
    processed: 2,
    returned: 3,
    completed: 4,
    cancelled: 5
};
const TIMESTAMP_STAGES = [
    {
        key: 'processingStartedAt',
        stageOrder: STATUS_ORDER.pending
    },
    {
        key: 'processedAt',
        stageOrder: STATUS_ORDER.processed
    },
    {
        key: 'returnedAt',
        stageOrder: STATUS_ORDER.returned
    },
    {
        key: 'completedAt',
        stageOrder: STATUS_ORDER.completed
    }
];
function computeTimestampUpdates(ticket, newStatus, nowIso) {
    const updates = {};
    const oldOrder = STATUS_ORDER[ticket.status] ?? 0;
    const newOrder = STATUS_ORDER[newStatus] ?? oldOrder;
    TIMESTAMP_STAGES.forEach(({ key, stageOrder })=>{
        const currentValue = ticket[key];
        const crossedForward = newOrder >= stageOrder && oldOrder < stageOrder;
        if (newStatus !== 'cancelled' && crossedForward && !currentValue) {
            updates[key] = nowIso;
            return;
        }
        const movedBackward = newOrder < stageOrder;
        if (movedBackward && currentValue) {
            updates[key] = undefined;
        }
    });
    return updates;
}
function updateStatus(ticketSystemId, newStatus, note) {
    const ticket = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].getState().data.find((t)=>t.systemId === ticketSystemId);
    if (!ticket) return;
    console.log('[STATUS CHANGE]', {
        ticketId: ticket.id,
        oldStatus: ticket.status,
        newStatus: newStatus,
        productsCount: ticket.products.length,
        replacedProducts: ticket.products.filter((p)=>p.resolution === 'replace').length
    });
    const nowIso = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])());
    const timestampUpdates = computeTimestampUpdates(ticket, newStatus, nowIso);
    const baseUpdate = {
        ...ticket,
        ...timestampUpdates,
        status: newStatus,
        updatedAt: nowIso
    };
    // XUẤT KHO khi completed (CHỈ 1 LẦN DUY NHẤT - không trừ lại khi reopen)
    if (newStatus === 'completed' && ticket.status !== 'completed' && !ticket.stockDeducted) {
        console.log('[COMPLETED - DEDUCT] Xuất kho (LẦN ĐẦU TIÊN):', {
            ticketId: ticket.id,
            oldStatus: ticket.status,
            newStatus: newStatus,
            stockDeducted: ticket.stockDeducted,
            action: '-Đang giao dịch + -Tồn kho'
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$stock$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deductWarrantyStock"])(ticket);
        // Set flag để không trừ lại lần nữa
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalUpdate"])(ticketSystemId, {
            ...baseUpdate,
            stockDeducted: true
        });
    } else if (newStatus === 'completed' && ticket.stockDeducted) {
        console.log('[COMPLETED - SKIP DEDUCT] Đã trừ kho rồi, bỏ qua:', {
            ticketId: ticket.id,
            oldStatus: ticket.status,
            newStatus: newStatus,
            stockDeducted: ticket.stockDeducted
        });
        // Chỉ update status, KHÔNG trừ kho nữa
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalUpdate"])(ticketSystemId, baseUpdate);
    } else {
        // Normal status update (không phải completed)
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalUpdate"])(ticketSystemId, baseUpdate);
    }
    // KHÔNG ROLLBACK KHO khi mở lại từ completed
    // Lý do:
    // - Kết thúc = Đơn đã xong, hàng đã xuất, tiền đã thanh toán đầy đủ
    // - Mở lại (completed → returned) CHỈ để xem lại, KHÔNG được sửa/thay đổi gì
    // - Nếu cần điều chỉnh → Phải tạo phiếu mới, hoàn hàng thủ công, tạo phiếu thu/chi riêng
    // - Giữ nguyên inventory và payment history để đảm bảo tính toàn vẹn dữ liệu
    // KHÔNG ROLLBACK KHO khi mở lại từ completed
    // Lý do:
    // - Kết thúc = Đơn đã xong, hàng đã xuất, tiền đã thanh toán đầy đủ
    // - Mở lại (completed → returned) CHỈ để xem lại, KHÔNG được sửa/thay đổi gì
    // - Nếu cần điều chỉnh → Phải tạo phiếu mới, hoàn hàng thủ công, tạo phiếu thu/chi riêng
    // - Giữ nguyên inventory và payment history để đảm bảo tính toàn vẹn dữ liệu
    // Add history với format rõ ràng
    const statusLabels = {
        incomplete: 'Chưa đủ thông tin',
        pending: 'Chưa xử lý',
        processed: 'Đã xử lý',
        returned: 'Đã trả hàng',
        completed: 'Kết thúc'
    };
    const oldStatusLabel = statusLabels[ticket.status] || ticket.status;
    const newStatusLabel = statusLabels[newStatus] || newStatus;
    // Format history dựa trên hướng chuyển đổi
    let historyAction;
    if (ticket.status === 'completed' && (newStatus === 'returned' || newStatus === 'processed')) {
        // Mở lại từ "Kết thúc"
        historyAction = `Mở lại từ ${oldStatusLabel}`;
    } else if (ticket.status === 'returned' && newStatus === 'processed') {
        // Mở lại từ "Đã trả hàng"
        historyAction = `Mở lại từ ${oldStatusLabel}`;
    } else if (newStatus === 'completed') {
        // Kết thúc phiếu
        historyAction = 'Kết thúc phiếu bảo hành';
    } else {
        // Chuyển trạng thái bình thường
        historyAction = `Chuyển trạng thái: ${oldStatusLabel} → ${newStatusLabel}`;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addHistory"])(ticketSystemId, historyAction, (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserName"])(), note);
    // Send notifications
    if (ticket.status !== newStatus) {
        if (newStatus === 'pending') {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$notification$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyWarrantyProcessing"])(ticket.id);
        } else if (newStatus === 'processed') {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$notification$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyWarrantyProcessed"])(ticket.id);
        } else if (newStatus === 'returned') {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$notification$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyWarrantyReturned"])(ticket.id, undefined);
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["triggerWarrantyDataUpdate"])();
}
}),
"[project]/features/warranty/store/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWarrantyStore",
    ()=>useWarrantyStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$workflow$2d$templates$2d$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/printer/workflow-templates-page.tsx [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$notification$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/notification-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/use-realtime-updates.ts [app-ssr] (ecmascript)");
// Import base store và các modules
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/base-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$stock$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/stock-management.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/product-management.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$status$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/status-management.ts [app-ssr] (ecmascript)");
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
// Override add() for custom logic
__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].setState({
    add: (item)=>{
        // Auto ID generation by createCrudStore
        const newTicket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalAdd"])(item);
        // Copy workflow template subtasks
        const subtasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$workflow$2d$templates$2d$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getWorkflowTemplate"])('warranty');
        if (subtasks && subtasks.length > 0) {
            newTicket.subtasks = subtasks;
        }
        // Generate public tracking code
        if (!newTicket.publicTrackingCode) {
            newTicket.publicTrackingCode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generatePublicTrackingCode"])();
        }
        // Commit stock for replace products
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$stock$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commitWarrantyStock"])(newTicket);
        // Add initial history
        if (!newTicket.history || newTicket.history.length === 0) {
            newTicket.history = [
                {
                    systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`WH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
                    action: 'Tạo phiếu bảo hành',
                    actionLabel: 'Tạo phiếu bảo hành',
                    performedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserName"])(),
                    performedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])())
                }
            ];
        }
        // Update state to include subtasks, history, publicTrackingCode
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].setState((state)=>({
                data: state.data.map((t)=>t.systemId === newTicket.systemId ? newTicket : t)
            }));
        // Send notification
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$notification$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyWarrantyCreated"])(newTicket.id);
        // Trigger realtime update
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["triggerWarrantyDataUpdate"])();
        return newTicket;
    },
    update: (systemId, updates)=>{
        const oldTicket = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].getState().data.find((t)=>t.systemId === systemId);
        if (!oldTicket) return;
        // Check if history is explicitly provided
        const hasExplicitHistory = updates.history && updates.history.length > (oldTicket.history?.length || 0);
        // Track changes for auto-history
        const changes = [];
        if (!hasExplicitHistory) {
            if (updates.customerName && updates.customerName !== oldTicket.customerName) {
                changes.push(`Tên khách hàng: "${oldTicket.customerName}" → "${updates.customerName}"`);
            }
            if (updates.customerPhone && updates.customerPhone !== oldTicket.customerPhone) {
                changes.push(`Số điện thoại: "${oldTicket.customerPhone}" → "${updates.customerPhone}"`);
            }
            if (updates.trackingCode && updates.trackingCode !== oldTicket.trackingCode) {
                changes.push(`Mã vận đơn: "${oldTicket.trackingCode}" → "${updates.trackingCode}"`);
            }
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalUpdate"])(systemId, updates);
        // Add auto-history
        if (!hasExplicitHistory && changes.length > 0) {
            changes.forEach((change)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addHistory"])(systemId, change, (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserName"])());
            });
        }
        // Trigger realtime update
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["triggerWarrantyDataUpdate"])();
    },
    remove: (systemId)=>{
        const ticket = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].getState().data.find((t)=>t.systemId === systemId);
        if (ticket) {
            // Add history before deletion
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addHistory"])(systemId, 'Xóa phiếu bảo hành (chuyển vào thùng rác)', (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserName"])());
            // Uncommit stock
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$stock$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["uncommitWarrantyStock"])(ticket);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["originalRemove"])(systemId);
        // Trigger realtime update
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$use$2d$realtime$2d$updates$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["triggerWarrantyDataUpdate"])();
    }
});
const useWarrantyStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((_set, _get)=>({
        ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].getState(),
        // Warranty-specific methods
        addProduct: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addProduct"],
        updateProduct: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProduct"],
        removeProduct: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["removeProduct"],
        updateStatus: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$status$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateStatus"],
        addHistory: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addHistory"],
        recalculateSummary: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["recalculateSummary"],
        calculateSummary: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateSummary"],
        calculateSettlementStatus: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$product$2d$management$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateSettlementStatus"],
        // Placeholder methods for backward compatibility
        addComment: ()=>console.warn('addComment: Use generic Comments component instead'),
        updateComment: ()=>console.warn('updateComment: Use generic Comments component instead'),
        deleteComment: ()=>console.warn('deleteComment: Use generic Comments component instead'),
        replyComment: ()=>console.warn('replyComment: Use generic Comments component instead'),
        generateNextSystemId: ()=>{
            // Generate next systemId using same pattern as createCrudStore
            const maxSystemId = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].getState().data.reduce((max, item)=>{
                const match = item.systemId.match(/WARRANTY(\d{6})/);
                return match ? Math.max(max, parseInt(match[1])) : max;
            }, 0);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`WARRANTY${String(maxSystemId + 1).padStart(6, '0')}`);
        },
        _migrate: ()=>console.warn('_migrate: No longer needed with createCrudStore')
    }));
// Subscribe to base store changes
__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$base$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseStore"].subscribe((state)=>{
    useWarrantyStore.setState(state);
});
}),
"[project]/features/warranty/store.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$warranty$2f$store$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/warranty/store/index.ts [app-ssr] (ecmascript)");
;
}),
"[project]/features/complaints/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useComplaintStore",
    ()=>useComplaintStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/smart-prefix.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
;
;
;
const complaintSeedData = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("COMPLAINT000001"),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("PKN000001"),
        publicTrackingCode: "rb5n8xzhrm",
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("ORDER000001"),
        orderCode: "DH000001",
        orderValue: 16550000,
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("BRANCH000003"),
        branchName: "Chi nhánh Trung tâm",
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CUST000001"),
        customerId: "KH000001",
        customerName: "Công ty Cổ phần Bất động sản Hưng Thịnh",
        customerPhone: "0901112233",
        type: "missing-items",
        description: "Khách nhận thiếu adapter USB-C trong hộp laptop Dell Inspiron 15.",
        images: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CMPIMG000001"),
                url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=640&q=80",
                uploadedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
                uploadedAt: new Date("2025-11-14T09:00:00Z"),
                description: "Ảnh khách chụp hộp sản phẩm",
                type: "initial"
            }
        ],
        employeeImages: [],
        status: "investigating",
        verification: "pending-verification",
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
        createdAt: new Date("2025-11-14T08:45:00Z"),
        assignedTo: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000005"),
        assigneeName: "Lê Văn Kho",
        assignedAt: new Date("2025-11-14T09:15:00Z"),
        investigationNote: "Kho xác nhận thiếu phụ kiện trong kiện hàng. Đang kiểm tra tồn kho để gửi bổ sung.",
        evidenceImages: [],
        proposedSolution: "Gửi bổ sung adapter trong 24h và tặng voucher 2% cho đơn tiếp theo.",
        timeline: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CMPACT000001"),
                actionType: "created",
                performedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
                performedAt: new Date("2025-11-14T08:45:00Z"),
                note: "Tạo phiếu khiếu nại từ khách Hưng Thịnh."
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CMPACT000002"),
                actionType: "assigned",
                performedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000002"),
                performedAt: new Date("2025-11-14T09:15:00Z"),
                note: "Giao cho nhân viên kho kiểm tra."
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CMPACT000003"),
                actionType: "investigated",
                performedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000005"),
                performedAt: new Date("2025-11-14T11:00:00Z"),
                note: "Đang chờ adapter bổ sung từ kho trung tâm."
            }
        ],
        priority: "high",
        tags: [
            "Hưng Thịnh",
            "Thiếu phụ kiện"
        ],
        updatedAt: new Date("2025-11-14T11:15:00Z"),
        affectedProducts: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("SP000001"),
                productId: "SP000001",
                productName: "Laptop Dell Inspiron 15",
                unitPrice: 15000000,
                quantityOrdered: 1,
                quantityReceived: 1,
                quantityMissing: 1,
                quantityDefective: 0,
                quantityExcess: 0,
                issueType: "missing",
                note: "Thiếu adapter USB-C trong hộp",
                resolutionType: "replacement"
            }
        ]
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("COMPLAINT000002"),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])("PKN000002"),
        publicTrackingCode: "m1p9l0sdxz",
        orderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("ORDER000005"),
        orderCode: "DH000005",
        orderValue: 3775000,
        branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("BRANCH000004"),
        branchName: "Chi nhánh Quận 3",
        customerSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CUST000001"),
        customerId: "KH000001",
        customerName: "Công ty Cổ phần Bất động sản Hưng Thịnh",
        customerPhone: "0901112233",
        type: "product-condition",
        description: "Keycap custom bị trầy và 6 switch Gateron không nhận tín hiệu sau khi lắp.",
        images: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CMPIMG000002"),
                url: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=640&q=80",
                uploadedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000003"),
                uploadedAt: new Date("2025-11-19T02:20:00Z"),
                description: "Ảnh khách gửi về keycap trầy",
                type: "initial"
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CMPIMG000003"),
                url: "https://images.unsplash.com/photo-1478562853135-c3c9e3ef7905?auto=format&fit=crop&w=640&q=80",
                uploadedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000003"),
                uploadedAt: new Date("2025-11-19T02:25:00Z"),
                description: "Ảnh switch lỗi",
                type: "initial"
            }
        ],
        employeeImages: [],
        status: "resolved",
        verification: "verified-correct",
        createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000003"),
        createdAt: new Date("2025-11-19T02:10:00Z"),
        assignedTo: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000003"),
        assigneeName: "Trần Thị Hoa",
        assignedAt: new Date("2025-11-19T02:15:00Z"),
        investigationNote: "Đã test tại cửa hàng, xác nhận 6 switch lỗi. Keycap bị trầy do quá trình đóng gói.",
        evidenceImages: [
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=640&q=80"
        ],
        proposedSolution: "Hoàn 60.000đ cho switch lỗi và gửi kèm bộ switch mới dự phòng.",
        timeline: [
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CMPACT000004"),
                actionType: "created",
                performedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000003"),
                performedAt: new Date("2025-11-19T02:10:00Z"),
                note: "Khách báo switch lỗi và keycap trầy."
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CMPACT000005"),
                actionType: "investigated",
                performedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000003"),
                performedAt: new Date("2025-11-19T10:30:00Z"),
                note: "Đã kiểm tra thực tế, xác nhận lỗi."
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CMPACT000006"),
                actionType: "verified",
                performedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000003"),
                performedAt: new Date("2025-11-20T04:00:00Z"),
                note: "Xác nhận lỗi thuộc về kho đóng gói."
            },
            {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("CMPACT000007"),
                actionType: "resolved",
                performedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000003"),
                performedAt: new Date("2025-11-20T05:00:00Z"),
                note: "Hoàn tiền và tạo voucher xin lỗi khách."
            }
        ],
        resolution: "refund",
        resolutionNote: "Hoàn 60.000đ cho switch lỗi, tặng voucher 5% và gửi switch mới.",
        resolvedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000003"),
        resolvedAt: new Date("2025-11-20T05:00:00Z"),
        responsibleUserId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("EMP000003"),
        isVerifiedCorrect: true,
        priority: "medium",
        tags: [
            "Keychron",
            "Switch lỗi"
        ],
        updatedAt: new Date("2025-11-20T05:30:00Z"),
        affectedProducts: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("SP000008"),
                productId: "SP000008",
                productName: "Bàn phím cơ Keychron K2",
                unitPrice: 2500000,
                quantityOrdered: 1,
                quantityReceived: 1,
                quantityMissing: 0,
                quantityDefective: 1,
                quantityExcess: 0,
                issueType: "defective",
                note: "Keycap trầy nhẹ",
                resolutionType: "replacement"
            },
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])("SP000010"),
                productId: "SP000010",
                productName: "Switch Gateron Yellow",
                unitPrice: 5000,
                quantityOrdered: 90,
                quantityReceived: 90,
                quantityMissing: 0,
                quantityDefective: 6,
                quantityExcess: 0,
                issueType: "defective",
                note: "6 switch không nhận tín hiệu",
                resolutionType: "refund"
            }
        ]
    }
];
// =============================================
// HELPER FUNCTIONS
// =============================================
/**
 * Generate random public tracking code (10 chars: a-z, 0-9)
 * Example: rb5n8xzhrm
 */ function generatePublicTrackingCode() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for(let i = 0; i < 10; i++){
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
// =============================================
// DEFAULT VALUES
// =============================================
const defaultFilters = {
    status: "all",
    type: "all",
    verification: "all",
    assignedTo: "all",
    priority: "all"
};
const useComplaintStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        // Initial State - Load sample data if empty
        complaints: complaintSeedData,
        filters: defaultFilters,
        searchQuery: "",
        selectedComplaintId: null,
        // =============================================
        // CRUD ACTIONS (Using store-factory logic)
        // =============================================
        addComplaint: (complaintData)=>{
            const currentComplaints = get().complaints;
            const BUSINESS_PREFIX = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['complaints']; // 'PKN'
            const SYSTEM_PREFIX = 'COMPLAINT';
            // Generate SystemId (6 digits) - COMPLAINT000001, COMPLAINT000002
            const maxSystemIdNumber = currentComplaints.length > 0 ? Math.max(...currentComplaints.map((c)=>{
                const match = c.systemId.match(/COMPLAINT(\d{6})/);
                return match ? parseInt(match[1]) : 0;
            })) : 0;
            const systemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`${SYSTEM_PREFIX}${String(maxSystemIdNumber + 1).padStart(6, '0')}`);
            // Generate Business ID (6 digits) - PKN000001, PKN000002 (if not provided)
            const idValue = complaintData.id ?? null;
            let id = idValue ? String(idValue) : '';
            if (!id) {
                const maxBusinessIdNumber = currentComplaints.length > 0 ? Math.max(...currentComplaints.map((c)=>{
                    const match = c.id?.match(/PKN(\d{6})/);
                    return match ? parseInt(match[1]) : 0;
                })) : 0;
                id = `${BUSINESS_PREFIX}${String(maxBusinessIdNumber + 1).padStart(6, '0')}`;
            } else {
                // Validate unique ID (case-insensitive)
                const existingIds = currentComplaints.map((c)=>c.id?.toLowerCase());
                if (existingIds.includes(id.toLowerCase())) {
                    throw new Error(`Mã "${id}" đã tồn tại! Vui lòng sử dụng mã khác.`);
                }
                // Sanitize ID: uppercase + remove spaces
                id = id.toUpperCase().trim().replace(/\s+/g, '');
            }
            const businessId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(id);
            // [NOTE] Generate public tracking code for customer
            const publicTrackingCode = complaintData.publicTrackingCode || generatePublicTrackingCode();
            const now = new Date();
            const initialAction = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`action_${Date.now()}`),
                actionType: "created",
                performedBy: complaintData.createdBy,
                performedAt: now,
                note: complaintData.description
            };
            const newComplaint = {
                ...complaintData,
                systemId,
                id: businessId,
                publicTrackingCode,
                createdAt: now,
                updatedAt: now,
                status: "pending",
                verification: "pending-verification",
                timeline: [
                    initialAction
                ]
            };
            set((state)=>({
                    complaints: [
                        newComplaint,
                        ...state.complaints
                    ]
                }));
            return systemId; // Return systemId for internal use
        },
        updateComplaint: (systemId, updates)=>{
            set((state)=>({
                    complaints: state.complaints.map((complaint)=>complaint.systemId === systemId ? {
                            ...complaint,
                            ...updates,
                            updatedAt: new Date()
                        } : complaint)
                }));
        },
        deleteComplaint: (systemId)=>{
            set((state)=>({
                    complaints: state.complaints.filter((c)=>c.systemId !== systemId)
                }));
        },
        getComplaintById: (systemId)=>{
            return get().complaints.find((c)=>c.systemId === systemId);
        },
        // =============================================
        // WORKFLOW ACTIONS
        // =============================================
        assignComplaint: (id, userId, userName)=>{
            const complaint = get().complaints.find((c)=>c.systemId === id);
            if (!complaint) return;
            const action = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`action_${Date.now()}`),
                actionType: "assigned",
                performedBy: userId,
                performedAt: new Date(),
                note: userName ? `Khiếu nại được giao cho ${userName}` : `Khiếu nại được giao cho nhân viên xử lý`
            };
            get().updateComplaint(id, {
                assignedTo: userId,
                assigneeName: userName,
                assignedAt: new Date(),
                status: "investigating",
                timeline: [
                    ...complaint.timeline,
                    action
                ]
            });
        },
        startInvestigation: (id, note)=>{
            const complaint = get().complaints.find((c)=>c.systemId === id);
            if (!complaint) return;
            const action = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`action_${Date.now()}`),
                actionType: "investigated",
                performedBy: complaint.assignedTo || complaint.createdBy,
                performedAt: new Date(),
                note
            };
            get().updateComplaint(id, {
                status: "investigating",
                timeline: [
                    ...complaint.timeline,
                    action
                ]
            });
        },
        submitEvidence: (id, evidenceImages, investigationNote, proposedSolution)=>{
            const complaint = get().complaints.find((c)=>c.systemId === id);
            if (!complaint) return;
            const action = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`action_${Date.now()}`),
                actionType: "investigated",
                performedBy: complaint.assignedTo || complaint.createdBy,
                performedAt: new Date(),
                note: investigationNote,
                images: evidenceImages
            };
            get().updateComplaint(id, {
                evidenceImages,
                investigationNote,
                proposedSolution,
                timeline: [
                    ...complaint.timeline,
                    action
                ]
            });
        },
        verifyComplaint: (id, isCorrect, note)=>{
            const complaint = get().complaints.find((c)=>c.systemId === id);
            if (!complaint) return;
            const action = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`action_${Date.now()}`),
                actionType: "verified",
                performedBy: complaint.createdBy,
                performedAt: new Date(),
                note
            };
            get().updateComplaint(id, {
                verification: isCorrect ? "verified-correct" : "verified-incorrect",
                isVerifiedCorrect: isCorrect,
                timeline: [
                    ...complaint.timeline,
                    action
                ]
            });
        },
        resolveComplaint: (id, resolution, resolutionNote, responsibleUserId)=>{
            const complaint = get().complaints.find((c)=>c.systemId === id);
            if (!complaint) return;
            const action = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`action_${Date.now()}`),
                actionType: "resolved",
                performedBy: complaint.createdBy,
                performedAt: new Date(),
                note: resolutionNote
            };
            const updatePayload = {
                status: "resolved",
                resolution,
                resolutionNote,
                resolvedBy: complaint.createdBy,
                resolvedAt: new Date(),
                timeline: [
                    ...complaint.timeline,
                    action
                ]
            };
            if (responsibleUserId) {
                updatePayload.responsibleUserId = responsibleUserId;
            }
            get().updateComplaint(id, updatePayload);
        },
        rejectComplaint: (id, reason)=>{
            const complaint = get().complaints.find((c)=>c.systemId === id);
            if (!complaint) return;
            const action = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`action_${Date.now()}`),
                actionType: "rejected",
                performedBy: complaint.createdBy,
                performedAt: new Date(),
                note: reason
            };
            get().updateComplaint(id, {
                status: "ended",
                resolution: "rejected",
                resolutionNote: reason,
                resolvedBy: complaint.createdBy,
                resolvedAt: new Date(),
                timeline: [
                    ...complaint.timeline,
                    action
                ]
            });
        },
        // =============================================
        // IMAGE ACTIONS
        // =============================================
        addComplaintImage: (id, image)=>{
            const complaint = get().complaints.find((c)=>c.systemId === id);
            if (!complaint) return;
            get().updateComplaint(id, {
                images: [
                    ...complaint.images,
                    image
                ]
            });
        },
        removeComplaintImage: (id, imageId)=>{
            const complaint = get().complaints.find((c)=>c.systemId === id);
            if (!complaint) return;
            get().updateComplaint(id, {
                images: complaint.images.filter((img)=>img.id !== imageId)
            });
        },
        // =============================================
        // FILTER & SEARCH ACTIONS
        // =============================================
        setFilters: (filters)=>{
            set((state)=>({
                    filters: {
                        ...state.filters,
                        ...filters
                    }
                }));
        },
        resetFilters: ()=>{
            set({
                filters: defaultFilters
            });
        },
        setSearchQuery: (query)=>{
            set({
                searchQuery: query
            });
        },
        setSelectedComplaint: (id)=>{
            set({
                selectedComplaintId: id
            });
        },
        // =============================================
        // COMPUTED GETTERS
        // =============================================
        getFilteredComplaints: ()=>{
            const { complaints, filters, searchQuery } = get();
            return complaints.filter((complaint)=>{
                // Status filter
                if (filters.status !== "all" && complaint.status !== filters.status) {
                    return false;
                }
                // Type filter
                if (filters.type !== "all" && complaint.type !== filters.type) {
                    return false;
                }
                // Verification filter
                if (filters.verification !== "all" && complaint.verification !== filters.verification) {
                    return false;
                }
                // Assignee filter
                if (filters.assignedTo !== "all" && complaint.assignedTo !== filters.assignedTo) {
                    return false;
                }
                // Priority filter
                if (filters.priority !== "all" && complaint.priority !== filters.priority) {
                    return false;
                }
                // Date range filter
                if (filters.dateRange) {
                    const complaintDate = new Date(complaint.createdAt);
                    if (complaintDate < filters.dateRange.from || complaintDate > filters.dateRange.to) {
                        return false;
                    }
                }
                // Search query
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    return (complaint.orderCode || complaint.orderSystemId).toLowerCase().includes(query) || // [NOTE] Fallback
                    complaint.customerName.toLowerCase().includes(query) || complaint.customerPhone.includes(query) || complaint.description.toLowerCase().includes(query) || complaint.id.toLowerCase().includes(query) // Search by business ID too
                    ;
                }
                return true;
            });
        },
        getComplaintsByStatus: (status)=>{
            return get().complaints.filter((c)=>c.status === status);
        },
        getComplaintsByAssignee: (userId)=>{
            return get().complaints.filter((c)=>c.assignedTo === userId);
        },
        getStats: ()=>{
            const complaints = get().complaints;
            return {
                total: complaints.length,
                pending: complaints.filter((c)=>c.status === "pending").length,
                investigating: complaints.filter((c)=>c.status === "investigating").length,
                resolved: complaints.filter((c)=>c.status === "resolved").length,
                rejected: complaints.filter((c)=>c.resolution === "rejected").length,
                verifiedCorrect: complaints.filter((c)=>c.verification === "verified-correct").length,
                verifiedIncorrect: complaints.filter((c)=>c.verification === "verified-incorrect").length
            };
        }
    }), {
    name: "complaint-storage",
    version: 4,
    // Migration function to add publicTrackingCode and update ID format
    migrate: (persistedState, version)=>{
        if (version < 4) {
            console.warn('[Complaints] Migrating to new ID system. Clearing old data...');
            // Clear old data and use fresh sample data
            return {
                complaints: complaintSeedData,
                filters: defaultFilters,
                searchQuery: "",
                selectedComplaintId: null
            };
        }
        return persistedState;
    }
}));
}),
];

//# sourceMappingURL=features_cf0c0805._.js.map
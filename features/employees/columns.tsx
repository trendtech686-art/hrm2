import * as React from "react";
import { formatDate, formatDateCustom, toISODate, toISODateTime } from '../../lib/date-utils';
import type { Employee } from './types'
import type { Branch } from "../settings/branches/types";
import { Checkbox } from "../../components/ui/checkbox"
import { DataTableColumnHeader } from "../../components/data-table/data-table-column-header"
import { Badge } from "../../components/ui/badge"
import type { ColumnDef } from '../../components/data-table/types';
import { Button } from "../../components/ui/button";
import { Pencil, Trash2, RotateCcw, Mail, FileText, Clock, Eye, MoreHorizontal } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return '';
    return new Intl.NumberFormat('vi-VN').format(value);
};

const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return formatDateCustom(date, "dd/MM/yyyy");
};

const formatAddress = (address: any): string => {
  if (!address) return '';
  if (typeof address === 'string') return address;
  
  const parts = [
    address.street,
    address.ward,
    address.district,
    address.province
  ].filter(Boolean);
  
  return parts.join(', ');
};


export const getColumns = (
  onDelete: (systemId: string) => void,
  onRestore: (systemId: string) => void,
  navigate: (path: string) => void,
  branches: Branch[]
): ColumnDef<Employee>[] => [
  {
    id: "select",
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
        <Checkbox
          checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
          onCheckedChange={(value) => onToggleAll?.(!!value)}
          aria-label="Select all"
        />
    ),
    cell: ({ onToggleSelect, isSelected }) => (
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          aria-label="Select row"
        />
    ),
    size: 48,
    meta: {
      displayName: "Chọn",
      sticky: "left",
    }
  },
  // Personal Info
  {
    id: "fullName",
    accessorKey: "fullName",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Họ và tên"
        sortKey="fullName"
        isSorted={sorting?.id === 'fullName'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        // FIX: Correctly call `setSorting` with a function to update the state based on the previous state.
        onSort={() => setSorting?.((s: any) => ({ id: 'fullName', desc: s.id === 'fullName' ? !s.desc : false }))}
       />
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.fullName}>
        {row.fullName}
      </div>
    ),
    meta: {
      displayName: "Họ và tên",
      group: "Thông tin cá nhân"
    },
  },
  {
    id: "gender",
    accessorKey: "gender",
    header: "Giới tính",
    cell: ({ row }) => row.gender,
    meta: {
      displayName: "Giới tính",
      group: "Thông tin cá nhân"
    },
  },
  {
    id: "dob",
    accessorKey: "dob",
    header: "Ngày sinh",
    cell: ({ row }) => formatDate(row.dob),
    meta: {
      displayName: "Ngày sinh",
      group: "Thông tin cá nhân"
    },
  },
  {
    id: "placeOfBirth",
    accessorKey: "placeOfBirth",
    header: "Nơi sinh",
    cell: ({ row }) => row.placeOfBirth,
    meta: {
        displayName: "Nơi sinh",
        group: "Thông tin cá nhân"
    },
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Số điện thoại",
    cell: ({ row }) => row.phone,
    meta: {
      displayName: "Số điện thoại",
      group: "Thông tin cá nhân"
    },
  },
  {
    id: "personalEmail",
    accessorKey: "personalEmail",
    header: "Email cá nhân",
    cell: ({ row }) => row.personalEmail,
    meta: {
      displayName: "Email cá nhân",
      group: "Thông tin cá nhân"
    },
  },
  {
    id: "maritalStatus",
    accessorKey: "maritalStatus",
    header: "Tình trạng hôn nhân",
    cell: ({ row }) => row.maritalStatus,
    meta: {
        displayName: "Tình trạng hôn nhân",
        group: "Thông tin cá nhân"
    },
  },
  {
    id: "permanentAddress",
    accessorKey: "permanentAddress",
    header: "Địa chỉ thường trú",
    cell: ({ row }) => {
      const addressStr = formatAddress(row.permanentAddress);
      return (
        <div className="max-w-[250px] truncate" title={addressStr}>
          {addressStr}
        </div>
      );
    },
    meta: {
        displayName: "Địa chỉ thường trú",
        group: "Thông tin cá nhân"
    },
  },
  {
    id: "temporaryAddress",
    accessorKey: "temporaryAddress",
    header: "Địa chỉ tạm trú",
    cell: ({ row }) => {
      const addressStr = formatAddress(row.temporaryAddress);
      return (
        <div className="max-w-[250px] truncate" title={addressStr}>
          {addressStr}
        </div>
      );
    },
    meta: {
        displayName: "Địa chỉ tạm trú",
        group: "Thông tin cá nhân"
    },
  },
  {
    id: "nationalId",
    accessorKey: "nationalId",
    header: "Số CCCD/Passport",
    cell: ({ row }) => row.nationalId,
    meta: {
        displayName: "Số CCCD/Passport",
        group: "Thông tin cá nhân"
    },
  },
  {
    id: "nationalIdIssueDate",
    accessorKey: "nationalIdIssueDate",
    header: "Ngày cấp CCCD",
    cell: ({ row }) => formatDate(row.nationalIdIssueDate),
    meta: {
        displayName: "Ngày cấp CCCD",
        group: "Thông tin cá nhân"
    },
  },
  {
    id: "nationalIdIssuePlace",
    accessorKey: "nationalIdIssuePlace",
    header: "Nơi cấp CCCD",
    cell: ({ row }) => row.nationalIdIssuePlace,
    meta: {
        displayName: "Nơi cấp CCCD",
        group: "Thông tin cá nhân"
    },
  },
  {
    id: "personalTaxId",
    accessorKey: "personalTaxId",
    header: "Mã số thuế",
    cell: ({ row }) => row.personalTaxId,
    meta: {
        displayName: "Mã số thuế",
        group: "Thông tin cá nhân"
    },
  },
  {
    id: "socialInsuranceNumber",
    accessorKey: "socialInsuranceNumber",
    header: "Số sổ BHXH",
    cell: ({ row }) => row.socialInsuranceNumber,
    meta: {
        displayName: "Số sổ BHXH",
        group: "Thông tin cá nhân"
    },
  },
  {
    id: "bankAccountNumber",
    accessorKey: "bankAccountNumber",
    header: "Số tài khoản",
    cell: ({ row }) => row.bankAccountNumber,
    meta: {
        displayName: "Số tài khoản",
        group: "Thông tin cá nhân"
    },
  },
  {
    id: "bankName",
    accessorKey: "bankName",
    header: "Ngân hàng",
    cell: ({ row }) => row.bankName,
    meta: {
        displayName: "Ngân hàng",
        group: "Thông tin cá nhân"
    },
  },
  {
    id: "bankBranch",
    accessorKey: "bankBranch",
    header: "Chi nhánh NH",
    cell: ({ row }) => row.bankBranch,
    meta: {
        displayName: "Chi nhánh NH",
        group: "Thông tin cá nhân"
    },
  },
  {
    id: "emergencyContactName",
    accessorKey: "emergencyContactName",
    header: "Tên người thân (KC)",
    cell: ({ row }) => row.emergencyContactName,
    meta: {
        displayName: "Tên người thân (KC)",
        group: "Thông tin cá nhân"
    },
  },
  {
    id: "emergencyContactPhone",
    accessorKey: "emergencyContactPhone",
    header: "SĐT người thân (KC)",
    cell: ({ row }) => row.emergencyContactPhone,
    meta: {
        displayName: "SĐT người thân (KC)",
        group: "Thông tin cá nhân"
    },
  },
  // Employment Info
  {
    id: "id",
    accessorKey: "id",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Mã NV"
        sortKey="id"
        isSorted={sorting?.id === 'id'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        // FIX: Correctly call `setSorting` with a function to update the state based on the previous state.
        onSort={() => setSorting?.((s: any) => ({ id: 'id', desc: s.id === 'id' ? !s.desc : false }))}
       />
    ),
    cell: ({ row }) => <div className="font-medium">{row.id}</div>,
    meta: {
      displayName: "Mã NV",
      group: "Thông tin công việc"
    },
  },
  {
    id: "workEmail",
    accessorKey: "workEmail",
    header: "Email công việc",
    cell: ({ row }) => (
      <div className="max-w-[180px] truncate" title={row.workEmail}>
        {row.workEmail}
      </div>
    ),
    meta: {
      displayName: "Email công việc",
      group: "Thông tin công việc"
    },
  },
  {
    id: "branch",
    accessorKey: "branchSystemId",
    header: "Chi nhánh",
    cell: ({ row }) => {
        const branch = branches.find(b => b.systemId === row.branchSystemId);
        return branch ? branch.name : '';
    },
    meta: {
      displayName: "Chi nhánh",
      group: "Thông tin công việc"
    },
  },
  {
    id: "department",
    accessorKey: "department",
    header: ({ sorting, setSorting }) => (
       <DataTableColumnHeader 
        title="Phòng ban"
        sortKey="department"
        isSorted={sorting?.id === 'department'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        // FIX: Correctly call `setSorting` with a function to update the state based on the previous state.
        onSort={() => setSorting?.((s: any) => ({ id: 'department', desc: s.id === 'department' ? !s.desc : false }))}
       />
    ),
    cell: ({ row }) => row.department,
    meta: {
      displayName: "Phòng ban",
      group: "Thông tin công việc"
    },
  },
  {
    id: "jobTitle",
    accessorKey: "jobTitle",
    header: "Chức danh",
    cell: ({ row }) => row.jobTitle,
    meta: {
      displayName: "Chức danh",
      group: "Thông tin công việc"
    },
  },
  {
    id: "hireDate",
    accessorKey: "hireDate",
    header: ({ sorting, setSorting }) => (
       <DataTableColumnHeader 
        title="Ngày vào làm"
        sortKey="hireDate"
        isSorted={sorting?.id === 'hireDate'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        // FIX: Correctly call `setSorting` with a function to update the state based on the previous state.
        onSort={() => setSorting?.((s: any) => ({ id: 'hireDate', desc: s.id === 'hireDate' ? !s.desc : false }))}
       />
    ),
    cell: ({ row }) => formatDate(row.hireDate),
    meta: {
      displayName: "Ngày vào làm",
      group: "Thông tin công việc"
    },
  },
  {
    id: "employeeType",
    accessorKey: "employeeType",
    header: "Loại nhân viên",
    cell: ({ row }) => row.employeeType,
    meta: {
        displayName: "Loại nhân viên",
        group: "Thông tin công việc"
    },
  },
  {
    id: "employmentStatus",
    accessorKey: "employmentStatus",
    header: "Trạng thái",
    cell: ({ row }) => {
        const status = row.employmentStatus;
        
        if (status === "Đang làm việc") {
          return (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-body-sm">Đang làm việc</span>
            </div>
          );
        }
        
        if (status === "Tạm nghỉ") {
          return (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              <span className="text-body-sm">Tạm nghỉ</span>
            </div>
          );
        }
        
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-gray-400"></div>
            <span className="text-body-sm">{status}</span>
          </div>
        );
    },
    meta: {
      displayName: "Trạng thái",
      group: "Thông tin công việc"
    },
  },
  {
    id: "terminationDate",
    accessorKey: "terminationDate",
    header: "Ngày nghỉ việc",
    cell: ({ row }) => formatDate(row.terminationDate),
    meta: {
        displayName: "Ngày nghỉ việc",
        group: "Thông tin công việc"
    },
  },
  {
    id: "reasonForLeaving",
    accessorKey: "reasonForLeaving",
    header: "Lý do nghỉ việc",
    cell: ({ row }) => row.reasonForLeaving,
    meta: {
        displayName: "Lý do nghỉ việc",
        group: "Thông tin công việc"
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ sorting, setSorting }) => (
       <DataTableColumnHeader 
        title="Ngày khởi tạo"
        sortKey="createdAt"
        isSorted={sorting?.id === 'createdAt'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: any) => ({ id: 'createdAt', desc: s.id === 'createdAt' ? !s.desc : false }))}
       />
    ),
    cell: ({ row }) => {
      if (!row.createdAt) return '';
      return (
        <div className="flex flex-col">
          <span className="text-body-sm">{formatDateDisplay(row.createdAt)}</span>
          <span className="text-body-xs text-muted-foreground">
            {formatDateCustom(new Date(row.createdAt), 'HH:mm')}
          </span>
        </div>
      );
    },
    meta: {
        displayName: "Ngày khởi tạo",
        group: "Thông tin công việc"
    },
  },
  // Salary & Contract
  {
    id: "baseSalary",
    accessorKey: "baseSalary",
    header: "Lương cơ bản",
    cell: ({ row }) => formatCurrency(row.baseSalary),
    meta: {
        displayName: "Lương cơ bản",
        group: "Lương & Hợp đồng"
    },
  },
  {
    id: "socialInsuranceSalary",
    accessorKey: "socialInsuranceSalary",
    header: "Lương đóng BHXH",
    cell: ({ row }) => formatCurrency(row.socialInsuranceSalary),
    meta: {
        displayName: "Lương đóng BHXH",
        group: "Lương & Hợp đồng"
    },
  },
  {
    id: "positionAllowance",
    accessorKey: "positionAllowance",
    header: "Phụ cấp chức vụ",
    cell: ({ row }) => formatCurrency(row.positionAllowance),
    meta: {
        displayName: "Phụ cấp chức vụ",
        group: "Lương & Hợp đồng"
    },
  },
  {
    id: "mealAllowance",
    accessorKey: "mealAllowance",
    header: "Phụ cấp ăn trưa",
    cell: ({ row }) => formatCurrency(row.mealAllowance),
    meta: {
        displayName: "Phụ cấp ăn trưa",
        group: "Lương & Hợp đồng"
    },
  },
  {
    id: "otherAllowances",
    accessorKey: "otherAllowances",
    header: "Phụ cấp khác",
    cell: ({ row }) => formatCurrency(row.otherAllowances),
    meta: {
        displayName: "Phụ cấp khác",
        group: "Lương & Hợp đồng"
    },
  },
  // Leave
  {
    id: "leaveTaken",
    accessorKey: "leaveTaken",
    header: "Phép đã nghỉ",
    cell: ({ row }) => row.leaveTaken,
    meta: {
        displayName: "Phép đã nghỉ",
        group: "Quản lý nghỉ phép"
    },
  },
   {
    id: "actions",
    header: () => <div className="text-center">Hành động</div>,
    cell: ({ row }) => {
      const employee = row as unknown as Employee;
      const isDeleted = employee.isDeleted;
      
      return (
       <div className="flex items-center justify-center gap-0.5">
        {isDeleted ? (
          // ✅ Show Restore button for deleted items
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-7 w-7 p-0 text-green-600 hover:text-green-600 hover:bg-green-600/10" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRestore(employee.systemId);
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Khôi phục</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          // ✅ Show Quick Actions Menu for active items
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-7 w-7 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/employees/${employee.systemId}/edit`);
                }}
              >
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/payroll?employee=${employee.systemId}`);
                }}
              >
                Xem bảng lương
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/attendance?employee=${employee.systemId}`);
                }}
              >
                Xem chấm công
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(employee.systemId);
                }}
              >
                Chuyển vào thùng rác
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
       </div>
      );
    },
    size: 100,
    meta: {
      displayName: "Hành động",
      sticky: "right",
    },
  },
];

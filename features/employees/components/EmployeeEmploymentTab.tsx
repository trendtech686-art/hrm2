import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { asBusinessId } from '@/lib/id-types';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { CurrencyInput } from "../../../components/ui/currency-input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select.tsx";
import { DatePicker } from "../../../components/ui/date-picker.tsx";
import type { EmployeeFormValues } from "../employee-form.tsx";
import type { JobTitle } from "../../settings/job-titles/types.ts";
import type { Branch } from "../../settings/branches/types.ts";

interface EmployeeEmploymentTabProps {
  form: UseFormReturn<EmployeeFormValues, any, EmployeeFormValues>;
  jobTitles: JobTitle[];
  branches: Branch[];
  isEditMode: boolean;
}

export function EmployeeEmploymentTab({ form, jobTitles, branches, isEditMode }: EmployeeEmploymentTabProps) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Thông tin công việc, Lương & Nghỉ phép</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ID field - User can input custom ID or leave blank for auto-generation */}
        <FormField name="id" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Mã nhân viên</FormLabel>
            <FormControl>
              <Input 
                placeholder="Bỏ trống để tự động sinh mã (6 số)" 
                {...field} 
                value={field.value as string || ''} 
              />
            </FormControl>
            <FormMessage />
            <p className="text-xs text-muted-foreground mt-1">
              {isEditMode ? 'Có thể sửa mã. Chỉ cho phép chữ và số.' : 'Ví dụ: NV000001, NVKT01, NV2024...'}
            </p>
          </FormItem> 
        )} />
        <FormField name="workEmail" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Email công việc</FormLabel>
            <FormControl>
              <Input type="email" placeholder="username@company.com" {...field} value={field.value as string || ''} />
            </FormControl>
            <FormMessage />
          </FormItem> 
        )} />
        <FormField name="branchSystemId" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Chi nhánh</FormLabel>
            <Select onValueChange={field.onChange} value={field.value as any}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chi nhánh" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem> 
        )} />
        <FormField name="department" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Phòng ban</FormLabel>
            <Select onValueChange={field.onChange} value={field.value as any}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Kỹ thuật">Kỹ thuật</SelectItem>
                <SelectItem value="Nhân sự">Nhân sự</SelectItem>
                <SelectItem value="Kinh doanh">Kinh doanh</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem> 
        )} />
        <FormField name="jobTitle" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Chức danh</FormLabel>
            <Select onValueChange={field.onChange} value={field.value as any}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chức danh" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {jobTitles.map(jt => (<SelectItem key={jt.systemId} value={jt.name}>{jt.name}</SelectItem>))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem> 
        )} />
        <FormField name="hireDate" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Ngày vào làm</FormLabel>
            <FormControl>
              <DatePicker value={field.value as Date} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem> 
        )} />
        <FormField name="employeeType" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Loại nhân viên</FormLabel>
            <Select onValueChange={field.onChange} value={field.value as any}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại NV" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Chính thức">Chính thức</SelectItem>
                <SelectItem value="Thử việc">Thử việc</SelectItem>
                <SelectItem value="Thực tập sinh">Thực tập sinh</SelectItem>
                <SelectItem value="Bán thời gian">Bán thời gian</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem> 
        )} />
        <FormField name="employmentStatus" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Trạng thái làm việc</FormLabel>
            <Select onValueChange={field.onChange} value={field.value as any}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Đang làm việc">Đang làm việc</SelectItem>
                <SelectItem value="Tạm nghỉ">Tạm nghỉ</SelectItem>
                <SelectItem value="Đã nghỉ việc">Đã nghỉ việc</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem> 
        )} />
        <FormField name="terminationDate" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Ngày nghỉ việc</FormLabel>
            <FormControl>
              <DatePicker value={field.value as Date} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem> 
        )} />
        
        <FormField name="contractType" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Loại hợp đồng</FormLabel>
            <Select onValueChange={field.onChange} value={field.value as any}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại hợp đồng" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Không xác định">Không xác định</SelectItem>
                <SelectItem value="Thử việc">Thử việc</SelectItem>
                <SelectItem value="1 năm">1 năm</SelectItem>
                <SelectItem value="2 năm">2 năm</SelectItem>
                <SelectItem value="3 năm">3 năm</SelectItem>
                <SelectItem value="Vô thời hạn">Vô thời hạn</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem> 
        )} />
        <FormField name="contractNumber" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Số hợp đồng</FormLabel>
            <FormControl>
              <Input placeholder="Số hợp đồng" {...field} value={field.value as string || ''} />
            </FormControl>
            <FormMessage />
          </FormItem> 
        )} />
        <FormField name="contractStartDate" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Ngày bắt đầu HĐ</FormLabel>
            <FormControl>
              <DatePicker value={field.value as Date} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem> 
        )} />
        <FormField name="contractEndDate" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Ngày kết thúc HĐ</FormLabel>
            <FormControl>
              <DatePicker value={field.value as Date} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem> 
        )} />
        
        <div className="md:col-span-2 lg:col-span-3 pt-4">
          <h4 className="text-md font-medium border-b pb-2 mb-4">Lương & Phụ cấp</h4>
        </div>
        <FormField name="baseSalary" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Lương cơ bản</FormLabel>
            <FormControl>
              <CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" />
            </FormControl>
            <FormMessage />
          </FormItem> 
        )} />
        <FormField name="socialInsuranceSalary" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Lương đóng BHXH</FormLabel>
            <FormControl>
              <CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" />
            </FormControl>
            <FormMessage />
          </FormItem> 
        )} />
        <FormField name="positionAllowance" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Phụ cấp chức vụ</FormLabel>
            <FormControl>
              <CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" />
            </FormControl>
            <FormMessage />
          </FormItem> 
        )} />
        <FormField name="mealAllowance" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Phụ cấp ăn trưa</FormLabel>
            <FormControl>
              <CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" />
            </FormControl>
            <FormMessage />
          </FormItem> 
        )} />
        <FormField name="otherAllowances" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Phụ cấp khác</FormLabel>
            <FormControl>
              <CurrencyInput value={field.value as number} onChange={field.onChange} placeholder="0" />
            </FormControl>
            <FormMessage />
          </FormItem> 
        )} />

        <div className="md:col-span-2 lg:col-span-3 pt-4">
          <h4 className="text-md font-medium border-b pb-2 mb-4">Nghỉ phép</h4>
        </div>
        <FormField name="leaveTaken" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Số phép đã sử dụng</FormLabel>
            <FormControl>
              <Input type="number" min="0" {...field} value={field.value as any} onChange={e => field.onChange(Math.max(0, parseInt(e.target.value, 10) || 0))} />
            </FormControl>
            <FormMessage />
          </FormItem> 
        )} />
      </div>
    </div>
  );
}

import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form.tsx";
import { Input } from "../../../components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select.tsx";
import { DatePicker } from "../../../components/ui/date-picker.tsx";
import type { EmployeeFormValues } from "../employee-form.tsx";

interface EmployeePersonalTabProps {
  form: UseFormReturn<EmployeeFormValues, any, EmployeeFormValues>;
}

export function EmployeePersonalTab({ form }: EmployeePersonalTabProps) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Thông tin cá nhân</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FormField 
          name="fullName" 
          control={form.control} 
          rules={{ 
            required: "Họ và tên là bắt buộc",
            minLength: { value: 2, message: "Họ và tên phải có ít nhất 2 ký tự" }
          }}
          render={({ field }) => ( 
            <FormItem>
              <FormLabel>Họ và tên <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Nguyễn Văn A" {...field} value={field.value as string || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        <FormField name="dob" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Ngày sinh</FormLabel>
            <FormControl>
              <DatePicker value={field.value as Date} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="gender" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Giới tính</FormLabel>
            <Select onValueChange={field.onChange} value={field.value as any}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Nam">Nam</SelectItem>
                <SelectItem value="Nữ">Nữ</SelectItem>
                <SelectItem value="Khác">Khác</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="placeOfBirth" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Nơi sinh</FormLabel>
            <FormControl>
              <Input placeholder="VD: TP.HCM" {...field} value={field.value as string || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField 
          name="phone" 
          control={form.control}
          rules={{
            pattern: {
              value: /^[0-9]{10,11}$/,
              message: "Số điện thoại phải có 10-11 chữ số"
            }
          }}
          render={({ field }) => ( 
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input 
                  placeholder="09xxxxxxxx" 
                  {...field} 
                  value={field.value as string || ''} 
                  maxLength={11}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        <FormField 
          name="personalEmail" 
          control={form.control}
          rules={{
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email không hợp lệ"
            }
          }}
          render={({ field }) => ( 
            <FormItem>
              <FormLabel>Email cá nhân</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@example.com" {...field} value={field.value as string || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        <FormField name="maritalStatus" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Tình trạng hôn nhân</FormLabel>
            <Select onValueChange={field.onChange} value={field.value as any}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tình trạng" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Độc thân">Độc thân</SelectItem>
                <SelectItem value="Đã kết hôn">Đã kết hôn</SelectItem>
                <SelectItem value="Khác">Khác</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        
        <FormField name="nationalId" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Số CCCD/Passport</FormLabel>
            <FormControl>
              <Input {...field} value={field.value as string || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="nationalIdIssueDate" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Ngày cấp</FormLabel>
            <FormControl>
              <DatePicker value={field.value as Date} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="nationalIdIssuePlace" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Nơi cấp</FormLabel>
            <FormControl>
              <Input {...field} value={field.value as string || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField name="personalTaxId" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Mã số thuế cá nhân</FormLabel>
            <FormControl>
              <Input {...field} value={field.value as string || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="socialInsuranceNumber" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Số sổ BHXH</FormLabel>
            <FormControl>
              <Input {...field} value={field.value as string || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        
        <div className="md:col-span-2 lg:col-span-3 pt-4">
          <h4 className="text-md font-medium border-b pb-2 mb-4">Thông tin liên hệ khẩn cấp</h4>
        </div>
        <FormField name="emergencyContactName" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Họ và tên người thân</FormLabel>
            <FormControl>
              <Input {...field} value={field.value as string || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="emergencyContactPhone" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Số điện thoại người thân</FormLabel>
            <FormControl>
              <Input {...field} value={field.value as string || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        
        <div className="md:col-span-2 lg:col-span-3 pt-4">
          <h4 className="text-md font-medium border-b pb-2 mb-4">Thông tin ngân hàng</h4>
        </div>
        <FormField name="bankAccountNumber" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Số tài khoản</FormLabel>
            <FormControl>
              <Input {...field} value={field.value as string || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="bankName" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Tên ngân hàng</FormLabel>
            <FormControl>
              <Input {...field} value={field.value as string || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField name="bankBranch" control={form.control} render={({ field }) => ( 
          <FormItem>
            <FormLabel>Chi nhánh</FormLabel>
            <FormControl>
              <Input {...field} value={field.value as string || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
    </div>
  );
}

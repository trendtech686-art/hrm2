import * as React from "react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Supplier } from "./types.ts"
import { useEmployeeStore } from "../employees/store.ts"
import { useSupplierStore } from "./store.ts";
// ✅ REMOVED: import { generateNextId } - use id: '' instead
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form.tsx"
import { Input } from "../../components/ui/input.tsx"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx"
import { CurrencyInput } from "../../components/ui/currency-input.tsx";
import { Textarea } from "../../components/ui/textarea.tsx";
import { VirtualizedCombobox } from "../../components/ui/virtualized-combobox.tsx";
import { Switch } from "../../components/ui/switch.tsx";
import { Label } from "../../components/ui/label.tsx";

const supplierFormSchema = z.object({
  id: z.string().min(1, "Mã nhà cung cấp là bắt buộc"),
  name: z.string().min(1, "Tên nhà cung cấp là bắt buộc"),
  taxCode: z.string()
    .regex(/^[0-9]{10}$|^[0-9]{13}$/, "Mã số thuế phải có 10 hoặc 13 chữ số")
    .optional()
    .or(z.literal("")),
  phone: z.string().min(1, "Số điện thoại là bắt buộc").regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  website: z.string().url("Website không hợp lệ").optional().or(z.literal("")),
  accountManager: z.string().min(1, "Người phụ trách là bắt buộc"),
  status: z.enum(["Đang Giao Dịch", "Ngừng Giao Dịch"]),
  currentDebt: z.number().optional(),
  bankAccount: z.string()
    .regex(/^[0-9]{9,20}$/, "Số tài khoản phải từ 9-20 chữ số")
    .optional()
    .or(z.literal("")),
  bankName: z.string().optional().or(z.literal("")),
  contactPerson: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

type SupplierFormData = z.infer<typeof supplierFormSchema>;
export type SupplierFormValues = SupplierFormData;

type SupplierFormProps = {
  initialData: Supplier | null
  onSubmit: (values: SupplierFormValues) => void;
  onCancel: () => void;
}

export function SupplierForm({ initialData, onSubmit, onCancel }: SupplierFormProps) {
  const { data: employees } = useEmployeeStore();
  const { data: suppliers } = useSupplierStore();
  
  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: initialData || {
      id: "", // ✅ Empty string = auto-generate by store
      name: "",
      taxCode: "",
      phone: "",
      email: "",
      address: "",
      website: "",
      accountManager: "",
      status: "Đang Giao Dịch",
      currentDebt: 0,
      bankAccount: "",
      bankName: "",
      contactPerson: "",
      notes: "",
    },
  })

  const employeeOptions = React.useMemo(() => 
    employees.map(emp => ({
      value: emp.fullName,
      label: `${emp.fullName} (${emp.id})`,
    })),
    [employees]
  );

  const selectedEmployee = React.useMemo(() => {
    const value = form.watch('accountManager');
    return employeeOptions.find(opt => opt.value === value) || null;
  }, [form.watch('accountManager'), employeeOptions]);

  return (
    <Form {...form}>
      <form id="supplier-form" onSubmit={form.handleSubmit((data) => onSubmit(data))} className="space-y-6">
        {/* Thông tin cơ bản */}
        <div className="space-y-4">
          <h3 className="text-h3 font-semibold">Thông tin cơ bản</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="id" render={({ field }) => (
                <FormItem><FormLabel>Mã nhà cung cấp *</FormLabel><FormControl><Input placeholder="VD: NCC000001" {...field} disabled={!!initialData} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Tên nhà cung cấp *</FormLabel><FormControl><Input placeholder="Nhập tên nhà cung cấp" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="taxCode" render={({ field }) => (
                <FormItem><FormLabel>Mã số thuế (10 hoặc 13 số)</FormLabel><FormControl><Input placeholder="0123456789" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Đang giao dịch</FormLabel>
                    <div className="text-body-sm text-muted-foreground">
                      {field.value === "Đang Giao Dịch" ? "Đang hoạt động" : "Tạm ngừng"}
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === "Đang Giao Dịch"}
                      onCheckedChange={(checked) => 
                        field.onChange(checked ? "Đang Giao Dịch" : "Ngừng Giao Dịch")
                      }
                    />
                  </FormControl>
                </FormItem>
            )} />
          </div>
        </div>

        {/* Thông tin liên hệ */}
        <div className="space-y-4">
          <h3 className="text-h3 font-semibold">Thông tin liên hệ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Số điện thoại *</FormLabel><FormControl><Input placeholder="09xxxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="contact@company.com" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem><FormLabel>Địa chỉ</FormLabel><FormControl><Input placeholder="Nhập địa chỉ" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="website" render={({ field }) => (
                <FormItem><FormLabel>Website</FormLabel><FormControl><Input placeholder="https://company.com" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="contactPerson" render={({ field }) => (
                <FormItem><FormLabel>Người liên hệ</FormLabel><FormControl><Input placeholder="Tên người liên hệ" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        </div>

        {/* Thông tin quản lý */}
        <div className="space-y-4">
          <h3 className="text-h3 font-semibold">Thông tin quản lý</h3>
          <FormField control={form.control} name="accountManager" render={({ field }) => (
              <FormItem>
              <FormLabel>Người phụ trách *</FormLabel>
              <FormControl>
                <VirtualizedCombobox
                  options={employeeOptions}
                  value={selectedEmployee}
                  onChange={(option) => field.onChange(option?.value || "")}
                  placeholder="Chọn nhân viên phụ trách"
                  searchPlaceholder="Tìm nhân viên..."
                  emptyPlaceholder="Không tìm thấy nhân viên"
                  estimatedItemHeight={40}
                  maxHeight={320}
                />
              </FormControl>
              <FormMessage />
              </FormItem>
          )} />
          <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem><FormLabel>Ghi chú</FormLabel><FormControl><Textarea placeholder="Nhập ghi chú (nếu có)" rows={3} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        {/* Thông tin ngân hàng */}
        <div className="space-y-4">
          <h3 className="text-h3 font-semibold">Thông tin ngân hàng</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="bankName" render={({ field }) => (
                <FormItem><FormLabel>Tên ngân hàng</FormLabel><FormControl><Input placeholder="VD: Vietcombank" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="bankAccount" render={({ field }) => (
                <FormItem><FormLabel>Số tài khoản (9-20 số)</FormLabel><FormControl><Input placeholder="Nhập số tài khoản" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        </div>

        {/* Công nợ */}
        <div className="space-y-4">
          <h3 className="text-h3 font-semibold">Công nợ</h3>
          <FormField control={form.control} name="currentDebt" render={({ field }) => (
            <FormItem>
              <FormLabel>Công nợ đầu kỳ</FormLabel>
              <FormControl><CurrencyInput value={field.value as number} onChange={field.onChange} disabled={!!initialData} /></FormControl>
              <FormMessage />
              {initialData && <p className="text-body-sm text-muted-foreground">Công nợ chỉ được thiết lập khi tạo mới nhà cung cấp</p>}
            </FormItem>
          )} />
        </div>
      </form>
    </Form>
  )
}


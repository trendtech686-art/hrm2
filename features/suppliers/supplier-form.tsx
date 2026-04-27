import * as React from "react";
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import type { Supplier } from '@/lib/types/prisma-extended'
import type { CustomerAddress } from '@/lib/types/prisma-extended'
import { useAllEmployees } from "../employees/hooks/use-all-employees"
import { AddressFormDialog } from '@/features/customers/components/address-form-dialog'
import { Button } from "../../components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import { CurrencyInput } from "../../components/ui/currency-input";
import { Textarea } from "../../components/ui/textarea";
import { VirtualizedCombobox } from "../../components/ui/virtualized-combobox";
import { Switch } from "../../components/ui/switch";
import { logError } from '@/lib/logger'

const supplierFormSchema = z.object({
  id: z.string().optional().or(z.literal("")),
  name: z.string().min(1, "Tên nhà cung cấp là bắt buộc"),
  taxCode: z.string()
    .regex(/^[0-9]{10}$|^[0-9]{13}$/, "Mã số thuế phải có 10 hoặc 13 chữ số")
    .optional()
    .or(z.literal("")),
  phone: z.string().min(1, "Số điện thoại là bắt buộc").regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  addressData: z.record(z.string(), z.unknown()).optional().nullable(),
  website: z.string().url("Website không hợp lệ").optional().or(z.literal("")),
  accountManager: z.string().optional().or(z.literal("")),
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
  formRef?: React.RefObject<HTMLFormElement | null>;
}

type AddressParts = {
  street: string;
  province: string;
  provinceId: string;
  district: string;
  districtId: number;
  ward: string;
  wardId: string;
  inputLevel: '2-level' | '3-level';
};

const parseAddressData = (data: Record<string, unknown> | null | undefined): AddressParts => {
  if (!data) return { street: '', province: '', provinceId: '', district: '', districtId: 0, ward: '', wardId: '', inputLevel: '2-level' };
  return {
    street: (data.street as string) || '',
    province: (data.province as string) || '',
    provinceId: (data.provinceId as string) || '',
    district: (data.district as string) || '',
    districtId: (data.districtId as number) || 0,
    ward: (data.ward as string) || '',
    wardId: (data.wardId as string) || '',
    inputLevel: (data.inputLevel as '2-level' | '3-level') || '2-level',
  };
};

const formatAddress = (parts: AddressParts): string =>
  [parts.street, parts.ward, parts.district !== parts.ward ? parts.district : '', parts.province]
    .filter(Boolean)
    .join(', ');

export function SupplierForm({ initialData, onSubmit, onCancel: _onCancel, formRef }: SupplierFormProps) {
  const { data: employees } = useAllEmployees({ enabled: false });

  // Address dialog state — fallback: khi addressData null nhưng có text address, dùng text làm street
  const [addressParts, setAddressParts] = React.useState<AddressParts>(() => {
    const parsed = parseAddressData(initialData?.addressData as Record<string, unknown> | null);
    if (!parsed.street && !parsed.province && initialData?.address) {
      return { ...parsed, street: initialData.address };
    }
    return parsed;
  });
  const [isAddressDialogOpen, setIsAddressDialogOpen] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<CustomerAddress | null>(null);
  
  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: initialData
      ? {
          id: initialData.id ?? '',
          name: initialData.name ?? '',
          taxCode: initialData.taxCode ?? '',
          phone: initialData.phone ?? '',
          email: initialData.email ?? '',
          address: initialData.address ?? '',
          addressData: (initialData.addressData as Record<string, unknown>) ?? null,
          website: initialData.website ?? '',
          accountManager: initialData.accountManager ?? '',
          status: (initialData.status as 'Đang Giao Dịch' | 'Ngừng Giao Dịch') ?? 'Đang Giao Dịch',
          currentDebt: initialData.currentDebt ? Number(initialData.currentDebt) : 0,
          bankAccount: initialData.bankAccount ?? '',
          bankName: initialData.bankName ?? '',
          contactPerson: initialData.contactPerson ?? '',
          notes: initialData.notes ?? '',
        }
      : {
          id: '',
          name: '',
          taxCode: '',
          phone: '',
          email: '',
          address: '',
          addressData: null,
          website: '',
          accountManager: '',
          status: 'Đang Giao Dịch',
          currentDebt: 0,
          bankAccount: '',
          bankName: '',
          contactPerson: '',
          notes: '',
        },
  })

  const employeeOptions = React.useMemo(() => 
    employees.map(emp => ({
      value: emp.fullName,
      label: `${emp.fullName} (${emp.id})`,
    })),
    [employees]
  );

  const accountManagerValue = useWatch({ control: form.control, name: 'accountManager' });
  const selectedEmployee = React.useMemo(() => {
    return employeeOptions.find(opt => opt.value === accountManagerValue) || null;
  }, [accountManagerValue, employeeOptions]);

  // Address dialog handlers
  const openAddressDialog = React.useCallback(() => {
    const source = addressParts;
    if (source.street || source.province || source.ward) {
      setEditingAddress({
        id: '',
        label: 'Địa chỉ nhà cung cấp',
        street: source.street,
        province: source.province,
        provinceId: source.provinceId,
        district: source.district || '',
        districtId: source.districtId || 0,
        ward: source.ward,
        wardId: source.wardId || '',
        contactName: '',
        contactPhone: '',
        notes: '',
        isDefaultShipping: false,
        isDefaultBilling: false,
        inputLevel: source.inputLevel || '2-level',
        autoFilled: source.inputLevel === '2-level',
      });
    } else {
      setEditingAddress(null);
    }
    setIsAddressDialogOpen(true);
  }, [addressParts]);

  const handleAddressDialogSave = React.useCallback(
    (addressData: Omit<CustomerAddress, 'id'>) => {
      const nextParts: AddressParts = {
        street: addressData.street,
        ward: addressData.ward || '',
        wardId: addressData.wardId || '',
        province: addressData.province,
        provinceId: addressData.provinceId || '',
        district: addressData.district || '',
        districtId: addressData.districtId || 0,
        inputLevel: addressData.inputLevel,
      };
      setAddressParts(nextParts);
      form.setValue('address', formatAddress(nextParts), { shouldDirty: true });
      form.setValue('addressData', nextParts as unknown as Record<string, unknown>, { shouldDirty: true });
      toast.success('Đã cập nhật địa chỉ');
    },
    [form]
  );

  // Handle form validation errors
  const handleFormSubmit = form.handleSubmit(
    (data) => {
      onSubmit(data);
    },
    (errors) => {
      // Show first validation error as toast
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        toast.error(firstError.message as string);
      } else {
        toast.error('Vui lòng kiểm tra lại thông tin nhập vào');
      }
      logError('Form validation errors', errors);
    }
  );

  return (
    <Form {...form}>
      <form ref={formRef} id="supplier-form" onSubmit={handleFormSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <div className="space-y-4">
          <h3 className="text-h3 font-semibold">Thông tin cơ bản</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="id" render={({ field }) => (
                <FormItem><FormLabel>Mã nhà cung cấp</FormLabel><FormControl><Input placeholder="Tự động tạo nếu để trống" {...field} /></FormControl><FormMessage /></FormItem>
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
                    <div className="text-sm text-muted-foreground">
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
          <section className="border border-border rounded-lg p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-medium">Địa chỉ</h4>
                <p className="text-sm text-muted-foreground">Chọn tỉnh/thành, phường/xã và số nhà.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={openAddressDialog}>
                {addressParts.province ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ'}
              </Button>
            </div>
            {addressParts.street || addressParts.ward || addressParts.province ? (
              <dl className="grid gap-2 text-sm">
                {addressParts.province && (
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Tỉnh/Thành phố</span>
                    <span className="font-medium">{addressParts.province}</span>
                  </div>
                )}
                {addressParts.ward && (
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Phường/Xã</span>
                    <span className="font-medium">{addressParts.ward}</span>
                  </div>
                )}
                {addressParts.street && (
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Số nhà, đường</span>
                    <span className="font-medium">{addressParts.street}</span>
                  </div>
                )}
              </dl>
            ) : (
              <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
                Chưa có địa chỉ. Nhấn &quot;Thêm địa chỉ&quot; để nhập.
              </div>
            )}
          </section>
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
              <FormLabel>Người phụ trách</FormLabel>
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
              {initialData && <p className="text-sm text-muted-foreground">Công nợ chỉ được thiết lập khi tạo mới nhà cung cấp</p>}
            </FormItem>
          )} />
        </div>
      </form>
      <AddressFormDialog
        isOpen={isAddressDialogOpen}
        onOpenChange={(open) => {
          setIsAddressDialogOpen(open);
          if (!open) setEditingAddress(null);
        }}
        onSave={handleAddressDialogSave}
        editingAddress={editingAddress}
        hideDefaultSwitches
        hideContactFields
        forcedAddressLevel="2-level"
        title="Địa chỉ nhà cung cấp"
        description="Chọn tỉnh/thành phố, phường/xã và nhập số nhà."
      />
    </Form>
  )
}


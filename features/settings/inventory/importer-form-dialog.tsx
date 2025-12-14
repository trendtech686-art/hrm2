import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { Importer } from "./types";

const importerFormSchema = z.object({
  id: z.string()
    .min(1, "Mã đơn vị là bắt buộc")
    .max(50, "Mã đơn vị không được quá 50 ký tự")
    .regex(/^[A-Z0-9-_]+$/, "Mã chỉ được chứa chữ in hoa, số, gạch ngang và gạch dưới"),
  name: z.string()
    .min(1, "Tên đơn vị là bắt buộc")
    .max(200, "Tên đơn vị không được quá 200 ký tự"),
  address: z.string().max(500, "Địa chỉ không được quá 500 ký tự").optional(),
  origin: z.string().max(100, "Xuất xứ không được quá 100 ký tự").optional(),
  phone: z.string().max(20, "Số điện thoại không được quá 20 ký tự").optional(),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  taxCode: z.string().max(20, "Mã số thuế không được quá 20 ký tự").optional(),
  usageGuide: z.string().max(500, "Hướng dẫn sử dụng không được quá 500 ký tự").optional(),
  isDefault: z.boolean(),
  isActive: z.boolean(),
});

export type ImporterFormValues = z.infer<typeof importerFormSchema>;

interface ImporterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: Importer | null;
  onSubmit: (values: ImporterFormValues) => void;
  existingIds: string[];
}

export function ImporterFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  existingIds,
}: ImporterFormDialogProps) {
  const form = useForm<ImporterFormValues>({
    resolver: zodResolver(importerFormSchema),
    defaultValues: {
      id: "",
      name: "",
      address: "",
      origin: "",
      phone: "",
      email: "",
      taxCode: "",
      usageGuide: "",
      isDefault: false,
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          id: initialData.id,
          name: initialData.name,
          address: initialData.address || "",
          origin: initialData.origin || "",
          phone: initialData.phone || "",
          email: initialData.email || "",
          taxCode: initialData.taxCode || "",
          usageGuide: initialData.usageGuide || "",
          isDefault: initialData.isDefault ?? false,
          isActive: initialData.isActive ?? true,
        });
      } else {
        form.reset({
          id: "",
          name: "",
          address: "",
          origin: "",
          phone: "",
          email: "",
          taxCode: "",
          usageGuide: "",
          isDefault: false,
          isActive: true,
        });
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = (values: ImporterFormValues) => {
    // Validate unique ID
    if (!initialData && existingIds.includes(values.id)) {
      form.setError("id", {
        type: "manual",
        message: "Mã đơn vị đã tồn tại",
      });
      return;
    }
    
    if (initialData && initialData.id !== values.id && existingIds.includes(values.id)) {
      form.setError("id", {
        type: "manual",
        message: "Mã đơn vị đã tồn tại",
      });
      return;
    }
    
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Chỉnh sửa đơn vị nhập khẩu" : "Thêm đơn vị nhập khẩu mới"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Cập nhật thông tin đơn vị nhập khẩu"
              : "Điền thông tin để thêm đơn vị nhập khẩu mới"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã đơn vị *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: NK001"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        disabled={!!initialData}
                      />
                    </FormControl>
                    <FormDescription>
                      Chỉ chứa chữ in hoa, số, gạch ngang
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã số thuế</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: 0123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đơn vị *</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: CÔNG TY TNHH XNK ABC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Địa chỉ đầy đủ của đơn vị nhập khẩu"
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xuất xứ mặc định</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Trung Quốc, Việt Nam, ..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Xuất xứ này sẽ được sử dụng mặc định khi in tem phụ sản phẩm
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: 0912345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: info@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="usageGuide"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hướng dẫn sử dụng mặc định</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="VD: Bên trong bao bì SP"
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Hướng dẫn này sẽ được sử dụng mặc định khi in tem phụ sản phẩm
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-6">
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer">Mặc định</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer">Hoạt động</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit">
                {initialData ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

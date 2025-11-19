import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { SalesChannel } from "./types.ts";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Checkbox } from "../../../components/ui/checkbox.tsx";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip.tsx";

const formSchema = z.object({
  id: z.string().max(20, "Mã không được vượt quá 20 ký tự").default(""),
  name: z.string().min(1, "Tên nguồn bán hàng không được để trống").max(120, "Tên không được vượt quá 120 ký tự"),
  isApplied: z.boolean().default(true),
  isDefault: z.boolean().default(false),
});

export type SalesChannelFormValues = z.input<typeof formSchema>;

type FormProps = {
  initialData?: SalesChannel | null;
  onSubmit: (values: SalesChannelFormValues) => void;
};

export function SalesChannelForm({ initialData, onSubmit }: FormProps) {
  const form = useForm<SalesChannelFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          id: String(initialData.id ?? ""),
          name: initialData.name ?? "",
          isApplied: initialData.isApplied ?? true,
          isDefault: initialData.isDefault ?? false,
        }
      : {
          id: "",
          name: "",
          isApplied: true,
          isDefault: false,
        },
    mode: "onBlur",
  });

  return (
    <Form {...form}>
      <form
        id="sales-channel-form"
        onSubmit={form.handleSubmit((values) => onSubmit(formSchema.parse(values)))}
        className="space-y-6 pt-4"
      >
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã nguồn bán hàng</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Để trống để hệ thống tự sinh"
                  className="h-9 uppercase"
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormDescription>Mã hiển thị trong breadcrumb và tiêu đề.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên nguồn bán hàng <span className="text-destructive">*</span></FormLabel>
              <FormControl><Input {...field} placeholder="Nhập tên nguồn bán hàng" className="h-9" /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="isApplied"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                  />
                </FormControl>
                <div className="flex items-center">
                    <FormLabel className="font-normal">Áp dụng cho cửa hàng</FormLabel>
                     <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="ml-1.5 h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Nếu bỏ chọn, nguồn bán hàng sẽ bị ẩn ở các màn hình tạo đơn hàng, trả hàng,...</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="isDefault"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                  />
                </FormControl>
                <div className="flex items-center">
                    <FormLabel className="font-normal">Đặt làm mặc định</FormLabel>
                     <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="ml-1.5 h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Nguồn bán hàng mặc định sẽ được chọn sẵn khi tạo đơn hàng mới.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}

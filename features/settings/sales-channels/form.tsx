import * as React from "react";
import { useForm } from "react-hook-form";
import type { SalesChannel } from "./types.ts";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Checkbox } from "../../../components/ui/checkbox.tsx";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip.tsx";

export type SalesChannelFormValues = Omit<SalesChannel, 'systemId'>;

type FormProps = {
  initialData?: SalesChannel | null;
  onSubmit: (values: SalesChannelFormValues) => void;
};

export function SalesChannelForm({ initialData, onSubmit }: FormProps) {
  const form = useForm<SalesChannelFormValues>({
    defaultValues: initialData || {
      name: "",
      isApplied: true,
      isDefault: false,
    },
  });

  return (
    <Form {...form}>
      <form id="sales-channel-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Tên nguồn bán hàng không được để trống" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên nguồn bán hàng <span className="text-destructive">*</span></FormLabel>
              {/* FIX: Explicitly cast `field.value` to `string` to match the expected prop type of `Input`. */}
              <FormControl><Input {...field} placeholder="Nhập tên nguồn bán hàng" value={field.value as string} /></FormControl>
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
                {/* FIX: Explicitly cast `field.value` to `boolean` to match the expected prop type of `Checkbox`. */}
                <FormControl><Checkbox checked={field.value as boolean} onCheckedChange={field.onChange} /></FormControl>
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
                {/* FIX: Explicitly cast `field.value` to `boolean` to match the expected prop type of `Checkbox`. */}
                <FormControl><Checkbox checked={field.value as boolean} onCheckedChange={field.onChange} /></FormControl>
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

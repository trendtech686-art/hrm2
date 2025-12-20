import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PricingPolicy } from "./types";
import { pricingPolicySchema, validateUniqueId } from "./validation";
import { usePricingPolicyStore } from "./store";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Switch } from "../../../components/ui/switch";
import type * as z from "zod";

export type PricingPolicyFormValues = z.infer<typeof pricingPolicySchema>;

type Props = {
  initialData?: PricingPolicy | null;
  onSubmit: (values: PricingPolicyFormValues) => void;
};

export function PricingPolicyForm({ initialData, onSubmit }: Props) {
  const { data } = usePricingPolicyStore();
  
  const form = useForm<PricingPolicyFormValues>({
    resolver: zodResolver(pricingPolicySchema),
    defaultValues: initialData || {
      id: '',
      name: '',
      type: 'Bán hàng' as const,
      description: '',
      isActive: true,
      isDefault: false,
    },
  });

  const { handleSubmit, control, setError } = form;

  const onFormSubmit = (values: PricingPolicyFormValues) => {
    // Validate unique ID
    const existingIds = data.map(p => p.id);
    const currentId = initialData?.id;
    
    if (!validateUniqueId(values.id, existingIds, currentId)) {
      setError('id', {
        type: 'manual',
        message: 'Mã này đã tồn tại trong hệ thống',
      });
      return;
    }

    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form id="pricing-policy-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 pt-4">
        <div className="grid grid-cols-2 gap-4">
            <FormField control={control} name="name" render={({ field }) => (
                <FormItem>
                    <FormLabel>Tên chính sách giá <span className="text-destructive">*</span></FormLabel>
                    <FormControl><Input {...field} value={field.value ?? ''} placeholder="Nhập tên chính sách giá" className="h-9" /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={control} name="id" render={({ field }) => (
                <FormItem>
                    <FormLabel>Mã chính sách giá <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        value={field.value ?? ''}
                        placeholder="VD: GIA001" 
                        className="uppercase h-9"
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormDescription>Chỉ chứa chữ in hoa và số, tối đa 20 ký tự</FormDescription>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
        
        <FormField control={control} name="description" render={({ field }) => (
            <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                    <Textarea 
                        {...field} 
                        value={field.value ?? ''}
                        placeholder="Nhập mô tả cho chính sách giá này"
                        rows={3}
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />
        
        <FormField control={control} name="type" render={({ field }) => (
            <FormItem className="space-y-3">
                <FormLabel>Áp dụng cho <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                        <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="Nhập hàng" /></FormControl>
                            <FormLabel className="font-normal">Nhập hàng</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="Bán hàng" /></FormControl>
                            <FormLabel className="font-normal">Bán hàng</FormLabel>
                        </FormItem>
                    </RadioGroup>
                </FormControl>
                <FormMessage />
            </FormItem>
        )} />

        <FormField control={control} name="isDefault" render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Đặt làm mặc định</FormLabel>
              <FormDescription>
                Nếu bật, chính sách này sẽ được áp dụng làm mặc định cho loại giá tương ứng
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )} />
        
        <FormField control={control} name="isActive" render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <FormLabel className="text-base">Trạng thái hoạt động</FormLabel>
                    <FormDescription>
                        Bật để kích hoạt chính sách giá này
                    </FormDescription>
                </div>
                <FormControl>
                    <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                </FormControl>
            </FormItem>
        )} />
      </form>
    </Form>
  );
}

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { TargetGroup } from "./types.ts";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form.tsx";
import { Input } from "../../../components/ui/input.tsx";

const formSchema = z.object({
  id: z.string().default(""),
  name: z.string().min(1, "Tên nhóm là bắt buộc").max(100, "Tên không được vượt quá 100 ký tự"),
});

export type TargetGroupFormValues = z.input<typeof formSchema>;

type FormProps = {
  initialData?: TargetGroup | null;
  onSubmit: (values: TargetGroupFormValues) => void;
};

export function TargetGroupForm({ initialData, onSubmit }: FormProps) {
  const form = useForm<TargetGroupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          id: String(initialData.id ?? ""),
          name: initialData.name ?? "",
        }
      : {
          id: "",
          name: "",
        },
    mode: "onBlur",
  });

  return (
    <Form {...form}>
      <form
        id="target-group-form"
        onSubmit={form.handleSubmit((values) => onSubmit(formSchema.parse(values)))}
        className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto px-1"
      >
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Tên nhóm <span className="text-destructive">*</span></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="id" render={({ field }) => (
          <FormItem><FormLabel>Mã nhóm</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
      </form>
    </Form>
  );
}

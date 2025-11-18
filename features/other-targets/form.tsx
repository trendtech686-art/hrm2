import * as React from "react";
import { useForm } from "react-hook-form";
import type { OtherTarget } from "./types.ts";
import { useOtherTargetStore } from "./store.ts";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form.tsx";
import { Input } from "../../components/ui/input.tsx";

export type OtherTargetFormValues = Omit<OtherTarget, 'systemId'>;

type FormProps = {
  initialData?: OtherTarget | null;
  onSubmit: (values: OtherTargetFormValues) => void;
};

export function OtherTargetForm({ initialData, onSubmit }: FormProps) {
  const form = useForm<OtherTargetFormValues>({
    defaultValues: initialData || {
      name: "",
    },
  });

  return (
    <Form {...form}>
      <form id="other-target-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Tên đối tượng <span className="text-destructive">*</span></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
      </form>
    </Form>
  );
}

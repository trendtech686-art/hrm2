import * as React from "react";
import { useForm } from "react-hook-form";
import type { SalaryComponent, SalaryComponentCategory } from '@/lib/types/prisma-extended';
import { Button } from "../../../components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Switch } from "../../../components/ui/switch";
import { DialogFooter } from "../../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { CurrencyInput } from "../../../components/ui/currency-input";
import { Textarea } from "../../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Checkbox } from "../../../components/ui/checkbox";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { useAllDepartments } from "../departments/hooks/use-all-departments";
import { Info, Calculator, Building2, Banknote, Receipt, Coins, Loader2, Check, X, Sparkles } from "lucide-react";
import type { SystemId } from "@/lib/id-types";
import { useEmployeeSettings, useEmployeeSettingsMutation } from "./hooks/use-employee-settings";
import { FORMULA_VARIABLES, FORMULA_FUNCTIONS, validateFormulaSyntax, previewFormula } from "@/lib/payroll/formula-helpers";
import { cn } from "@/lib/utils";

export type SalaryComponentFormValues = Omit<SalaryComponent, 'systemId' | 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>;

type SalaryComponentFormProps = {
  initialData?: SalaryComponentFormValues | undefined;
  onSubmit: (values: SalaryComponentFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
};

const categoryOptions: { value: SalaryComponentCategory; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'earning', label: 'Thu nhập', icon: <Banknote className="h-4 w-4" />, color: 'bg-green-500/10 text-green-700 border-green-200' },
  { value: 'deduction', label: 'Khấu trừ', icon: <Receipt className="h-4 w-4" />, color: 'bg-red-500/10 text-red-700 border-red-200' },
  { value: 'contribution', label: 'Đóng góp', icon: <Coins className="h-4 w-4" />, color: 'bg-blue-500/10 text-blue-700 border-blue-200' },
];

export function SalaryComponentForm({ initialData, onSubmit, onCancel, isPending }: SalaryComponentFormProps) {
  const { data: departments } = useAllDepartments();
  const { data: settings } = useEmployeeSettings();
  const saveMutation = useEmployeeSettingsMutation();
  
  // Format số để hiển thị
  const _formatNumber = (n: number) => n.toLocaleString('vi-VN');
  
  const form = useForm<SalaryComponentFormValues>({
    defaultValues: initialData || {
      name: '',
      description: '',
      category: 'earning',
      type: 'fixed',
      amount: 0,
      formula: '',
      taxable: false,
      partOfSocialInsurance: false,
      isActive: true,
      sortOrder: 0,
      applicableDepartmentSystemIds: [],
    },
  });

  // Reset form when initialData changes (compare by name to avoid object reference loops)
  const initialName = initialData?.name;
  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({
        name: '',
        description: '',
        category: 'earning',
        type: 'fixed',
        amount: 0,
        formula: '',
        taxable: false,
        partOfSocialInsurance: false,
        isActive: true,
        sortOrder: 0,
        applicableDepartmentSystemIds: [],
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialName]);

  const componentType = form.watch('type');
  const selectedCategory = form.watch('category');
  const selectedDepartments = form.watch('applicableDepartmentSystemIds') || [];

  const handleDepartmentToggle = (departmentSystemId: SystemId) => {
    const current = form.getValues('applicableDepartmentSystemIds') || [];
    if (current.includes(departmentSystemId)) {
      form.setValue('applicableDepartmentSystemIds', current.filter(id => id !== departmentSystemId));
    } else {
      form.setValue('applicableDepartmentSystemIds', [...current, departmentSystemId]);
    }
  };

  const handleSelectAllDepartments = () => {
    const allIds = departments.map(d => d.systemId);
    form.setValue('applicableDepartmentSystemIds', allIds);
  };

  const handleClearAllDepartments = () => {
    form.setValue('applicableDepartmentSystemIds', []);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Thông tin cơ bản
            </TabsTrigger>
            <TabsTrigger value="calculation" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Tính toán
            </TabsTrigger>
            <TabsTrigger value="scope" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Phạm vi áp dụng
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Thông tin cơ bản */}
          <TabsContent value="basic" className="space-y-4 mt-0">
            <FormField control={form.control} name="name" rules={{ required: 'Tên thành phần là bắt buộc' }} render={({ field }) => (
              <FormItem>
                <FormLabel>Tên thành phần <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input placeholder="VD: Phụ cấp ăn trưa, Thưởng KPI..." {...field} value={field.value ?? ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Mô tả chi tiết về thành phần lương này..." 
                    className="resize-none" 
                    rows={3}
                    {...field} 
                    value={field.value ?? ''} 
                  />
                </FormControl>
                <FormDescription>Ghi chú về cách tính hoặc điều kiện áp dụng</FormDescription>
              </FormItem>
            )} />

            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel>Phân loại <span className="text-destructive">*</span></FormLabel>
                <div className="grid grid-cols-3 gap-2">
                  {categoryOptions.map(option => (
                    <Card 
                      key={option.value}
                      className={`cursor-pointer transition-all ${
                        field.value === option.value 
                          ? `ring-2 ring-primary ${option.color}` 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => field.onChange(option.value)}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-3 gap-1">
                        {option.icon}
                        <span className="text-sm font-medium">{option.label}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="sortOrder" render={({ field }) => (
                <FormItem>
                  <FormLabel>Thứ tự hiển thị</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field} 
                      value={field.value ?? 0}
                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>Số nhỏ hơn hiển thị trước</FormDescription>
                </FormItem>
              )} />

              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3 shadow-sm h-fit mt-6">
                  <div className="space-y-0.5">
                    <FormLabel>Kích hoạt</FormLabel>
                    <FormDescription>Bật/tắt thành phần này</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value ?? true} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
            </div>
          </TabsContent>

          {/* Tab 2: Tính toán */}
          <TabsContent value="calculation" className="space-y-4 mt-0">
            <FormField control={form.control} name="type" render={({ field }) => (
              <FormItem>
                <FormLabel>Loại giá trị</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? 'fixed'}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fixed">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        Khoản cố định
                      </div>
                    </SelectItem>
                    <SelectItem value="formula">
                      <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Theo công thức
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  {componentType === 'fixed' 
                    ? 'Số tiền cố định cho mỗi kỳ lương'
                    : 'Tính dựa trên công thức với các biến'}
                </FormDescription>
              </FormItem>
            )} />

            {componentType === 'fixed' ? (
              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tiền</FormLabel>
                  <FormControl>
                    <CurrencyInput 
                      value={field.value ?? 0} 
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            ) : (
              <FormulaEditor
                value={form.watch('formula') ?? ''}
                onChange={v => form.setValue('formula', v, { shouldDirty: true })}
                mealAllowancePerDay={settings?.mealAllowancePerDay ?? 30000}
                onChangeMealAllowance={(v) => {
                  if (settings) saveMutation.mutate({ ...settings, mealAllowancePerDay: v });
                }}
              />
            )}

            <div className="space-y-3 pt-2">
              <FormField control={form.control} name="taxable" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border  border-border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Tính thuế TNCN</FormLabel>
                    <FormDescription>Thành phần này có chịu thuế thu nhập cá nhân không?</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value ?? false} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              
              <FormField control={form.control} name="partOfSocialInsurance" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border  border-border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Tính vào lương đóng BHXH</FormLabel>
                    <FormDescription>Thành phần này có tính vào cơ sở đóng bảo hiểm xã hội không?</FormDescription>
                  </div>
                  <FormControl><Switch checked={field.value ?? false} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
            </div>
          </TabsContent>

          {/* Tab 3: Phạm vi áp dụng */}
          <TabsContent value="scope" className="space-y-4 mt-0">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Phòng ban áp dụng</label>
              <p className="text-sm text-muted-foreground">
                Chọn các phòng ban sẽ được áp dụng thành phần lương này. Để trống = áp dụng tất cả.
              </p>
              
              <div className="flex items-center gap-2 py-2">
                <Button type="button" variant="outline" size="sm" onClick={handleSelectAllDepartments}>
                  Chọn tất cả
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={handleClearAllDepartments}>
                  Bỏ chọn tất cả
                </Button>
                {selectedDepartments.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    Đã chọn: {selectedDepartments.length}/{departments.length}
                  </Badge>
                )}
              </div>

              <ScrollArea className="h-50 rounded-md border p-3">
                <div className="space-y-2">
                  {departments.map(department => (
                    <div 
                      key={department.systemId}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleDepartmentToggle(department.systemId)}
                    >
                      <Checkbox 
                        checked={selectedDepartments.includes(department.systemId)}
                        onCheckedChange={() => handleDepartmentToggle(department.systemId)}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{department.name}</p>
                        <p className="text-xs text-muted-foreground">Mã: {department.id}</p>
                      </div>
                    </div>
                  ))}
                  {departments.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Chưa có phòng ban nào trong hệ thống
                    </p>
                  )}
                </div>
              </ScrollArea>

              {selectedDepartments.length === 0 && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Không chọn phòng ban = áp dụng cho tất cả nhân viên
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* See <FormulaEditor/> component below */}
        <DialogFooter className="pt-6 border-t mt-4">
          <div className="flex items-center gap-2 mr-auto">
            <Badge variant={selectedCategory === 'earning' ? 'default' : selectedCategory === 'deduction' ? 'destructive' : 'secondary'}>
              {categoryOptions.find(c => c.value === selectedCategory)?.label}
            </Badge>
            <Badge variant="outline">
              {componentType === 'fixed' ? 'Cố định' : 'Công thức'}
            </Badge>
          </div>
          <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

// ---------------------------------------------------------------------------
// FormulaEditor — công cụ nhập công thức có autocomplete biến + preview realtime.
// Admin thấy ngay kết quả khi gõ, biết biến nào đang dùng, biến nào sai.
// ---------------------------------------------------------------------------
type FormulaEditorProps = {
  value: string;
  onChange: (v: string) => void;
  mealAllowancePerDay: number;
  onChangeMealAllowance: (v: number) => void;
};

function FormulaEditor({ value, onChange, mealAllowancePerDay, onChangeMealAllowance }: FormulaEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const validation = React.useMemo(() => validateFormulaSyntax(value || ''), [value]);
  const preview = React.useMemo(
    () => (value ? previewFormula(value, { mealAllowancePerDay }) : null),
    [value, mealAllowancePerDay],
  );

  const insertToken = (token: string) => {
    const el = textareaRef.current;
    if (!el) {
      onChange(value + token);
      return;
    }
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const next = value.slice(0, start) + token + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + token.length;
      el.setSelectionRange(cursor, cursor);
    });
  };

  const groupedVars = React.useMemo(() => {
    const groups: Record<string, typeof FORMULA_VARIABLES[number][]> = {};
    for (const v of FORMULA_VARIABLES) {
      (groups[v.category] ||= []).push(v);
    }
    return groups;
  }, []);

  const categoryLabels: Record<string, string> = {
    base: 'Lương',
    attendance: 'Chấm công',
    ot: 'Làm thêm',
    rate: 'Tỷ lệ / Đơn giá',
    allowance: 'Phụ cấp',
  };

  const usedVariables = React.useMemo(() => {
    if (!value) return new Set<string>();
    const used = new Set<string>();
    for (const v of FORMULA_VARIABLES) {
      if (new RegExp(`\\b${v.name}\\b`).test(value)) used.add(v.name);
    }
    return used;
  }, [value]);

  return (
    <div className="space-y-3">
      <FormItem>
        <FormLabel>Công thức</FormLabel>
        <Textarea
          ref={textareaRef}
          placeholder="VD: baseSalary * 0.1 hoặc round(baseSalary / standardWorkDays * workDays)"
          className="font-mono text-sm resize-none"
          rows={3}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        <div className="flex items-center justify-between gap-2 text-xs mt-1">
          {value.trim() === '' ? (
            <span className="text-muted-foreground">Nhập công thức để xem kiểm tra & kết quả mẫu</span>
          ) : validation.ok ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Check className="h-3.5 w-3.5" />
              Công thức hợp lệ
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-destructive">
              <X className="h-3.5 w-3.5" />
              {validation.error}
            </span>
          )}
          {preview !== null && (
            <span className="inline-flex items-center gap-1 text-muted-foreground font-mono">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Kết quả mẫu: <span className="font-semibold text-foreground">{preview.toLocaleString('vi-VN')} đ</span>
            </span>
          )}
        </div>
      </FormItem>

      {/* Biến có thể dùng — click để chèn */}
      <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Biến có sẵn — click để chèn
          </p>
          {usedVariables.size > 0 && (
            <Badge variant="outline" className="text-xs">Đang dùng: {usedVariables.size}</Badge>
          )}
        </div>
        {Object.entries(groupedVars).map(([cat, vars]) => (
          <div key={cat} className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">{categoryLabels[cat] ?? cat}</p>
            <div className="flex flex-wrap gap-1.5">
              {vars.map(v => {
                const isUsed = usedVariables.has(v.name);
                return (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => insertToken(v.name)}
                    title={`${v.label} — ${v.description} (VD: ${v.example.toLocaleString('vi-VN')})`}
                    className={cn(
                      'inline-flex items-center gap-1 rounded border px-2 py-1 text-xs font-mono transition-colors',
                      isUsed
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    {v.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="pt-1 border-t">
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Hàm</p>
          <div className="flex flex-wrap gap-1.5">
            {FORMULA_FUNCTIONS.map(f => (
              <button
                key={f.name}
                type="button"
                onClick={() => insertToken(`${f.name}()`)}
                title={`${f.signature} — ${f.description}`}
                className="inline-flex items-center gap-1 rounded border border-border bg-background px-2 py-1 text-xs font-mono hover:bg-accent hover:text-accent-foreground"
              >
                {f.signature}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Nhập mức phụ cấp ăn trưa khi dùng biến `mealAllowancePerDay` */}
      {usedVariables.has('mealAllowancePerDay') && (
        <div className="space-y-2 rounded-lg border bg-amber-50 dark:bg-amber-950/20 p-3">
          <label htmlFor="meal-allowance-input" className="text-sm font-medium">
            Mức phụ cấp ăn trưa / ngày (VNĐ)
          </label>
          <CurrencyInput id="meal-allowance-input" value={mealAllowancePerDay} onChange={onChangeMealAllowance} />
          <p className="text-xs text-muted-foreground">
            Giá trị này là cài đặt chung cho cả hệ thống. VD: 30.000đ × 20 ngày = 600.000đ
          </p>
        </div>
      )}
    </div>
  );
}

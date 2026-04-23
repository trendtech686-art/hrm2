'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Sparkles, Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CurrencyInput } from '@/components/ui/currency-input';
import { NumberInput } from '@/components/ui/number-input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  FORMULA_VARIABLES,
  FORMULA_FUNCTIONS,
  validateFormulaSyntax,
  previewFormula,
} from '@/lib/payroll/formula-helpers';

/**
 * Trang tính thử công thức lương.
 *
 * Mục đích: admin nhập công thức + các giá trị giả định → thấy ngay kết quả.
 * Giúp tự tin trước khi lưu công thức vào thành phần lương chính thức.
 *
 * Không gọi API, không lưu gì — hoàn toàn client-side, an toàn.
 */
export function PayrollSimulatorPage() {
  const [formula, setFormula] = React.useState('baseSalary * 0.1');
  const [ctx, setCtx] = React.useState<Record<string, number>>({
    baseSalary: 15_000_000,
    workDays: 22,
    standardWorkDays: 26,
    leaveDays: 0,
    absentDays: 0,
    lateArrivals: 0,
    earlyDepartures: 0,
    otHours: 0,
    otHoursWeekday: 0,
    otHoursWeekend: 0,
    otHoursHoliday: 0,
    otPayWeekday: 0,
    otPayWeekend: 0,
    otPayHoliday: 0,
    otPayTotal: 0,
    otHourlyRate: 86_538,
    otRateWeekend: 2,
    otRateHoliday: 3,
    mealAllowancePerDay: 30_000,
  });

  const validation = React.useMemo(() => validateFormulaSyntax(formula), [formula]);
  const result = React.useMemo(() => previewFormula(formula, ctx), [formula, ctx]);

  const usedVariables = React.useMemo(() => {
    const used = new Set<string>();
    for (const v of FORMULA_VARIABLES) {
      if (new RegExp(`\\b${v.name}\\b`).test(formula)) used.add(v.name);
    }
    return used;
  }, [formula]);

  const EXAMPLES: { label: string; formula: string }[] = [
    { label: 'Phụ cấp ăn trưa', formula: 'mealAllowancePerDay * workDays' },
    { label: 'Thưởng doanh số 10%', formula: 'baseSalary * 0.1' },
    { label: 'Lương theo ngày công', formula: 'round(baseSalary / standardWorkDays * workDays)' },
    { label: 'Khấu trừ đi trễ (50k/lần)', formula: 'lateArrivals * 50000' },
    { label: 'Thưởng OT tối đa 3 triệu', formula: 'min(otPayTotal, 3000000)' },
  ];

  const categoryLabels: Record<string, string> = {
    base: 'Lương',
    attendance: 'Chấm công',
    ot: 'Làm thêm',
    rate: 'Tỷ lệ / Đơn giá',
    allowance: 'Phụ cấp',
  };

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings/employees">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tính thử công thức lương</h1>
            <p className="text-sm text-muted-foreground">
              Nhập công thức và giá trị giả định để xem kết quả trước khi áp dụng vào thành phần lương chính thức.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* LEFT: Editor + Result */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Công thức
              </CardTitle>
              <CardDescription>
                Có thể dùng <code className="font-mono text-xs bg-muted px-1 rounded">+ - * / %</code>,
                điều kiện <code className="font-mono text-xs bg-muted px-1 rounded">? :</code>,
                hàm <code className="font-mono text-xs bg-muted px-1 rounded">round/floor/ceil/min/max</code>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                rows={4}
                className="font-mono text-sm"
                value={formula}
                onChange={e => setFormula(e.target.value)}
                placeholder="VD: baseSalary * 0.1"
              />
              <div className="flex items-center justify-between">
                {validation.ok ? (
                  <Badge variant="outline" className="gap-1 border-emerald-500 text-emerald-600">
                    <Check className="h-3.5 w-3.5" /> Công thức hợp lệ
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <X className="h-3.5 w-3.5" /> {validation.error}
                  </Badge>
                )}
                {usedVariables.size > 0 && (
                  <Badge variant="secondary">
                    Biến đang dùng: {usedVariables.size}
                  </Badge>
                )}
              </div>

              <Separator />

              <div>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
                  Ví dụ công thức
                </Label>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLES.map(ex => (
                    <Button
                      key={ex.label}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormula(ex.formula)}
                    >
                      {ex.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Kết quả
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result === null ? (
                <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
                  <p className="text-sm">
                    {validation.ok
                      ? 'Không tính được kết quả. Kiểm tra lại công thức.'
                      : 'Sửa công thức cho hợp lệ để xem kết quả.'}
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border bg-linear-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/10 p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Kết quả</p>
                  <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                    {result.toLocaleString('vi-VN')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">đồng</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Biến & hàm có thể dùng</CardTitle>
              <CardDescription>
                Click để chèn vào công thức. Tất cả biến này tương ứng với dữ liệu thật khi tính lương.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(
                FORMULA_VARIABLES.reduce((acc, v) => {
                  (acc[v.category] ||= []).push(v);
                  return acc;
                }, {} as Record<string, typeof FORMULA_VARIABLES[number][]>),
              ).map(([cat, vars]) => (
                <div key={cat} className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {categoryLabels[cat] ?? cat}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {vars.map(v => {
                      const isUsed = usedVariables.has(v.name);
                      return (
                        <button
                          key={v.name}
                          type="button"
                          onClick={() => setFormula(f => f + (f ? ' ' : '') + v.name)}
                          title={`${v.label} — ${v.description}`}
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
              <Separator />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Hàm</p>
                <div className="flex flex-wrap gap-1.5">
                  {FORMULA_FUNCTIONS.map(f => (
                    <button
                      key={f.name}
                      type="button"
                      onClick={() => setFormula(v => v + (v ? ' ' : '') + `${f.name}()`)}
                      title={`${f.signature} — ${f.description}`}
                      className="inline-flex items-center gap-1 rounded border border-border bg-background px-2 py-1 text-xs font-mono hover:bg-accent hover:text-accent-foreground"
                    >
                      {f.signature}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Input values */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-base">Giá trị giả định</CardTitle>
              <CardDescription>
                Chỉ hiện biến đang được dùng trong công thức (nếu có). Bấm "Hiện tất cả" để chỉnh mọi biến.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto">
              {FORMULA_VARIABLES.filter(v => usedVariables.size === 0 || usedVariables.has(v.name)).map(v => (
                <div key={v.name} className="space-y-1">
                  <Label htmlFor={`var-${v.name}`} className="text-xs">
                    <span className="font-mono text-foreground">{v.name}</span>
                    <span className="text-muted-foreground"> — {v.label}</span>
                  </Label>
                  {v.category === 'base' || v.category === 'allowance' || v.name.toLowerCase().includes('pay') || v.name.toLowerCase().includes('rate') ? (
                    <CurrencyInput
                      id={`var-${v.name}`}
                      value={ctx[v.name] ?? 0}
                      onChange={val => setCtx(c => ({ ...c, [v.name]: val }))}
                    />
                  ) : (
                    <NumberInput
                      id={`var-${v.name}`}
                      value={ctx[v.name] ?? 0}
                      onChange={val => setCtx(c => ({ ...c, [v.name]: typeof val === 'number' ? val : 0 }))}
                    />
                  )}
                </div>
              ))}
              {usedVariables.size === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Công thức chưa dùng biến nào. Nhập công thức để chỉ hiện các biến liên quan.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/**
 * Insurance & Tax Settings Component
 * Cài đặt bảo hiểm xã hội và thuế TNCN theo luật Việt Nam
 */

import * as React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { NumberInput } from '../../../components/ui/number-input';
import { Separator } from '../../../components/ui/separator';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { PlusCircle, Trash2, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';
import type { EmployeeSettings } from '@/lib/types/prisma-extended';

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);

export function InsuranceTaxSettings() {
  const { control, watch, setValue } = useFormContext<EmployeeSettings>();
  
  const { fields: taxBracketFields, append: appendBracket, remove: removeBracket } = useFieldArray({
    control,
    name: 'taxSettings.taxBrackets',
  });

  const baseSalaryReference = watch('insuranceRates.baseSalaryReference');
  const calculatedCap = baseSalaryReference * 20;

  // Auto-update cap when base salary changes
  React.useEffect(() => {
    if (baseSalaryReference) {
      setValue('insuranceRates.insuranceSalaryCap', calculatedCap);
    }
  }, [baseSalaryReference, calculatedCap, setValue]);

  const handleAddBracket = () => {
    const lastBracket = taxBracketFields[taxBracketFields.length - 1];
    const fromAmount = lastBracket?.toAmount ?? 0;
    appendBracket({
      fromAmount,
      toAmount: fromAmount + 10000000,
      rate: 35,
    });
  };

  return (
    <div className="space-y-6">
      {/* Insurance Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt Bảo hiểm xã hội</CardTitle>
          <CardDescription>
            Tỷ lệ đóng BHXH, BHYT, BHTN theo quy định hiện hành (Luật BHXH 2024)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Base Salary Reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="insuranceRates.baseSalaryReference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mức lương cơ sở</FormLabel>
                  <FormControl>
                    <NumberInput 
                      {...field} 
                      value={field.value as number}
                      step={10000}
                    />
                  </FormControl>
                  <FormDescription>
                    Lương cơ sở từ 1/7/2024: 2,340,000đ
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="insuranceRates.insuranceSalaryCap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trần đóng BHXH (20 x lương cơ sở)</FormLabel>
                  <FormControl>
                    <NumberInput 
                      {...field} 
                      value={field.value as number}
                      disabled
                    />
                  </FormControl>
                  <FormDescription>
                    Tự động tính = {formatCurrency(calculatedCap)}
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* BHXH Rates */}
          <div>
            <h4 className="text-sm font-medium mb-4">Bảo hiểm xã hội (BHXH)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="insuranceRates.socialInsurance.employeeRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người lao động đóng (%)</FormLabel>
                    <FormControl>
                      <NumberInput 
                        {...field} 
                        value={field.value as number}
                        step={0.1}
                        min={0}
                        max={100}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="insuranceRates.socialInsurance.employerRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doanh nghiệp đóng (%)</FormLabel>
                    <FormControl>
                      <NumberInput 
                        {...field} 
                        value={field.value as number}
                        step={0.1}
                        min={0}
                        max={100}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* BHYT Rates */}
          <div>
            <h4 className="text-sm font-medium mb-4">Bảo hiểm y tế (BHYT)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="insuranceRates.healthInsurance.employeeRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người lao động đóng (%)</FormLabel>
                    <FormControl>
                      <NumberInput 
                        {...field} 
                        value={field.value as number}
                        step={0.1}
                        min={0}
                        max={100}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="insuranceRates.healthInsurance.employerRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doanh nghiệp đóng (%)</FormLabel>
                    <FormControl>
                      <NumberInput 
                        {...field} 
                        value={field.value as number}
                        step={0.1}
                        min={0}
                        max={100}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* BHTN Rates */}
          <div>
            <h4 className="text-sm font-medium mb-4">Bảo hiểm thất nghiệp (BHTN)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="insuranceRates.unemploymentInsurance.employeeRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người lao động đóng (%)</FormLabel>
                    <FormControl>
                      <NumberInput 
                        {...field} 
                        value={field.value as number}
                        step={0.1}
                        min={0}
                        max={100}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="insuranceRates.unemploymentInsurance.employerRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doanh nghiệp đóng (%)</FormLabel>
                    <FormControl>
                      <NumberInput 
                        {...field} 
                        value={field.value as number}
                        step={0.1}
                        min={0}
                        max={100}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Summary */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Tổng tỷ lệ đóng bảo hiểm</AlertTitle>
            <AlertDescription>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <span className="font-medium">Người lao động:</span>{' '}
                  {(watch('insuranceRates.socialInsurance.employeeRate') ?? 0) +
                    (watch('insuranceRates.healthInsurance.employeeRate') ?? 0) +
                    (watch('insuranceRates.unemploymentInsurance.employeeRate') ?? 0)}%
                </div>
                <div>
                  <span className="font-medium">Doanh nghiệp:</span>{' '}
                  {(watch('insuranceRates.socialInsurance.employerRate') ?? 0) +
                    (watch('insuranceRates.healthInsurance.employerRate') ?? 0) +
                    (watch('insuranceRates.unemploymentInsurance.employerRate') ?? 0)}%
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Tax Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt Thuế thu nhập cá nhân (TNCN)</CardTitle>
          <CardDescription>
            Giảm trừ gia cảnh và biểu thuế lũy tiến theo Luật thuế TNCN hiện hành
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Deductions */}
          <div>
            <h4 className="text-sm font-medium mb-4">Giảm trừ gia cảnh</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={control}
                name="taxSettings.personalDeduction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giảm trừ bản thân (đồng/tháng)</FormLabel>
                    <FormControl>
                      <NumberInput 
                        {...field} 
                        value={field.value as number}
                        step={100000}
                      />
                    </FormControl>
                    <FormDescription>
                      Mức hiện hành: 11,000,000đ/tháng
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="taxSettings.dependentDeduction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giảm trừ người phụ thuộc (đồng/tháng/người)</FormLabel>
                    <FormControl>
                      <NumberInput 
                        {...field} 
                        value={field.value as number}
                        step={100000}
                      />
                    </FormControl>
                    <FormDescription>
                      Mức hiện hành: 4,400,000đ/người/tháng
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Tax Brackets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium">Biểu thuế lũy tiến từng phần</h4>
              <Button type="button" variant="outline" size="sm" onClick={handleAddBracket}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Thêm bậc thuế
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Bậc</TableHead>
                  <TableHead>Từ (đồng)</TableHead>
                  <TableHead>Đến (đồng)</TableHead>
                  <TableHead className="w-[120px]">Thuế suất (%)</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxBracketFields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`taxSettings.taxBrackets.${index}.fromAmount`}
                        render={({ field }) => (
                          <NumberInput 
                            {...field} 
                            value={field.value as number}
                            step={1000000}
                            className="w-full"
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`taxSettings.taxBrackets.${index}.toAmount`}
                        render={({ field }) => (
                          <NumberInput 
                            {...field} 
                            value={field.value as number ?? 0}
                            step={1000000}
                            className="w-full"
                            placeholder="Không giới hạn"
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={control}
                        name={`taxSettings.taxBrackets.${index}.rate`}
                        render={({ field }) => (
                          <NumberInput 
                            {...field} 
                            value={field.value as number}
                            step={1}
                            min={0}
                            max={100}
                            className="w-full"
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      {taxBracketFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeBracket(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <p className="text-xs text-muted-foreground mt-2">
              * Để trống hoặc nhập 0 ở cột "Đến" cho bậc cuối cùng (không giới hạn)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Minimum Wage */}
      <Card>
        <CardHeader>
          <CardTitle>Lương tối thiểu vùng</CardTitle>
          <CardDescription>
            Theo Nghị định 74/2024/NĐ-CP (áp dụng từ 1/7/2024)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField
              control={control}
              name="minimumWage.region1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vùng I</FormLabel>
                  <FormControl>
                    <NumberInput 
                      {...field} 
                      value={field.value as number}
                      step={10000}
                    />
                  </FormControl>
                  <FormDescription>Hà Nội, TP.HCM...</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="minimumWage.region2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vùng II</FormLabel>
                  <FormControl>
                    <NumberInput 
                      {...field} 
                      value={field.value as number}
                      step={10000}
                    />
                  </FormControl>
                  <FormDescription>Đà Nẵng, Cần Thơ...</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="minimumWage.region3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vùng III</FormLabel>
                  <FormControl>
                    <NumberInput 
                      {...field} 
                      value={field.value as number}
                      step={10000}
                    />
                  </FormControl>
                  <FormDescription>Thành phố tỉnh...</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="minimumWage.region4"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vùng IV</FormLabel>
                  <FormControl>
                    <NumberInput 
                      {...field} 
                      value={field.value as number}
                      step={10000}
                    />
                  </FormControl>
                  <FormDescription>Nông thôn...</FormDescription>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Standard Work Days */}
      <Card>
        <CardHeader>
          <CardTitle>Ngày công chuẩn</CardTitle>
          <CardDescription>
            Số ngày công chuẩn để tính lương tháng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="standardWorkDays"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>Số ngày công chuẩn/tháng</FormLabel>
                <FormControl>
                  <NumberInput 
                    {...field} 
                    value={field.value as number}
                    min={20}
                    max={31}
                  />
                </FormControl>
                <FormDescription>
                  Thông thường là 26 ngày (không tính Chủ Nhật)
                </FormDescription>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}

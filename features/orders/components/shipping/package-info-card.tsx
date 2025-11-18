/**
 * PackageInfoCard
 * Display package information (weight, dimensions, COD)
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Weight, Ruler, DollarSign } from 'lucide-react';
import type { PackageInfo } from './types';

interface PackageInfoCardProps {
  packageInfo: PackageInfo;
  onChange?: (info: PackageInfo) => void;
  editable?: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

export function PackageInfoCard({
  packageInfo,
  onChange,
  editable = false,
}: PackageInfoCardProps) {
  const handleChange = (field: keyof PackageInfo, value: number) => {
    if (onChange) {
      onChange({ ...packageInfo, [field]: value });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Package className="h-4 w-4" />
          Thông tin kiện hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weight with Unit Selector */}
        <div className="space-y-2">
          <Label htmlFor="weight" className="flex items-center gap-2">
            <Weight className="h-4 w-4" />
            Khối lượng
          </Label>
          {editable ? (
            <div className="flex gap-2">
              <Input
                id="weight"
                type="number"
                className="flex-1"
                value={packageInfo.weight}
                onChange={(e) => handleChange('weight', Number(e.target.value))}
                placeholder="0"
              />
              <Select
                value={packageInfo.weightUnit || 'gram'}
                onValueChange={(value: 'gram' | 'kilogram') => 
                  onChange?.({ ...packageInfo, weightUnit: value })
                }
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gram">Gram (g)</SelectItem>
                  <SelectItem value="kilogram">Kilogram (kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <p className="text-sm font-medium">
              {packageInfo.weightUnit === 'kilogram' 
                ? `${packageInfo.weight} kg` 
                : `${formatCurrency(packageInfo.weight)} g`
              }
              {packageInfo.weightUnit === 'gram' && packageInfo.weight >= 1000 && (
                <span className="text-muted-foreground ml-2">
                  (~{(packageInfo.weight / 1000).toFixed(2)} kg)
                </span>
              )}
            </p>
          )}
        </div>

        {/* Dimensions */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Kích thước (cm)
          </Label>
          {editable ? (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="length" className="text-xs text-muted-foreground">
                  Dài
                </Label>
                <Input
                  id="length"
                  type="number"
                  value={packageInfo.length}
                  onChange={(e) => handleChange('length', Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="width" className="text-xs text-muted-foreground">
                  Rộng
                </Label>
                <Input
                  id="width"
                  type="number"
                  value={packageInfo.width}
                  onChange={(e) => handleChange('width', Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="height" className="text-xs text-muted-foreground">
                  Cao
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={packageInfo.height}
                  onChange={(e) => handleChange('height', Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>
          ) : (
            <p className="text-sm font-medium">
              {packageInfo.length} × {packageInfo.width} × {packageInfo.height} cm
            </p>
          )}
        </div>

        {/* COD Amount */}
        <div className="space-y-2">
          <Label htmlFor="codAmount" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Tiền thu hộ (COD)
          </Label>
          {editable ? (
            <CurrencyInput
              value={packageInfo.codAmount}
              onChange={(value) => handleChange('codAmount', value)}
              placeholder="0"
            />
          ) : (
            <p className="text-sm font-medium">
              {formatCurrency(packageInfo.codAmount)} ₫
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Số tiền khách cần thanh toán khi nhận hàng
          </p>
        </div>

        {/* Insurance Value */}
        {packageInfo.insuranceValue !== undefined && packageInfo.insuranceValue > 0 && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              🛡️ Giá trị bảo hiểm
            </Label>
            <p className="text-sm font-medium">
              {formatCurrency(packageInfo.insuranceValue)} ₫
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

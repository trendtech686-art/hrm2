import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card.tsx';
import { Label } from '../../../../components/ui/label.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select.tsx';
import { Button } from '../../../../components/ui/button.tsx';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { usePkgxSettingsStore } from '../store';
import { usePricingPolicyStore } from '../../pricing/store.ts';
import { PKGX_PRICE_FIELDS } from '../constants';
import type { SystemId } from '../../../../lib/id-types';

export function PriceMappingTab() {
  const { settings, updatePriceMapping, addLog } = usePkgxSettingsStore();
  const pricingPolicies = usePricingPolicyStore((state) => state.data);

  // Filter only selling price policies
  const sellingPolicies = pricingPolicies.filter((p) => p.type === 'Bán hàng' && p.isActive);

  const handleChange = (field: keyof typeof settings.priceMapping, value: string) => {
    updatePriceMapping(field, value === 'none' ? null : (value as SystemId));
  };

  const handleSave = () => {
    // Log the mapping save
    const mappingSummary = PKGX_PRICE_FIELDS
      .filter(pf => settings.priceMapping[pf.key as keyof typeof settings.priceMapping])
      .map(pf => {
        const policyId = settings.priceMapping[pf.key as keyof typeof settings.priceMapping];
        const policy = pricingPolicies.find(p => p.systemId === policyId);
        return `${pf.field} → ${policy?.name || policyId}`;
      })
      .join(', ');
    
    addLog({
      action: 'save_mapping',
      status: 'success',
      message: 'Đã lưu mapping bảng giá',
      details: {
        total: PKGX_PRICE_FIELDS.filter(pf => settings.priceMapping[pf.key as keyof typeof settings.priceMapping]).length,
      }
    });
    
    toast.success('Đã lưu mapping bảng giá');
  };

  const getPolicyName = (policyId: SystemId | null) => {
    if (!policyId) return '-- Không áp dụng --';
    const policy = pricingPolicies.find((p) => p.systemId === policyId);
    return policy?.name || policyId;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Mapping Bảng giá HRM → PKGX</CardTitle>
        <CardDescription>
          Chọn bảng giá trong HRM tương ứng với mỗi loại giá trên PKGX
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {PKGX_PRICE_FIELDS.map((priceField) => (
          <div key={priceField.key} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <Label className="text-base font-medium">{priceField.label}</Label>
              <p className="text-sm text-muted-foreground">{priceField.description}</p>
            </div>
            <Select
              value={settings.priceMapping[priceField.key as keyof typeof settings.priceMapping] || 'none'}
              onValueChange={(value) => handleChange(priceField.key as keyof typeof settings.priceMapping, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn bảng giá..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">-- Không áp dụng --</SelectItem>
                {sellingPolicies.map((policy) => (
                  <SelectItem key={policy.systemId} value={policy.systemId}>
                    {policy.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Tóm tắt mapping hiện tại:</h4>
          <div className="bg-muted p-4 rounded-lg text-sm space-y-1">
            {PKGX_PRICE_FIELDS.map((priceField) => (
              <div key={priceField.key} className="flex justify-between">
                <span className="text-muted-foreground">{priceField.field}:</span>
                <span className="font-medium">
                  {getPolicyName(settings.priceMapping[priceField.key as keyof typeof settings.priceMapping])}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Lưu mapping
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

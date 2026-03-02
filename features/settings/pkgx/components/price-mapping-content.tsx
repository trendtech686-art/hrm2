import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { toast } from 'sonner';
import { usePkgxSettings, usePkgxLogMutations, usePkgxSectionMutation } from '../hooks/use-pkgx-settings';
import { useAllPricingPolicies } from '../../pricing/hooks/use-all-pricing-policies';
import { PKGX_PRICE_FIELDS } from '../constants';
import type { SystemId } from '../../../../lib/id-types';

type PriceMapping = Record<string, SystemId | null>;

interface PriceMappingContentProps {
  onStateChange: (state: { isDirty: boolean; isSaving: boolean }) => void;
  saveRef: React.MutableRefObject<(() => void) | null>;
}

export function PriceMappingContent({ onStateChange, saveRef }: PriceMappingContentProps) {
  const { data: settings } = usePkgxSettings();
  const { addLog } = usePkgxLogMutations();
  const { data: pricingPolicies = [] } = useAllPricingPolicies();
  
  // Local state for mapping - only save to server when clicking "Lưu mapping"
  const [localMapping, setLocalMapping] = React.useState<PriceMapping>({});
  const [isDirty, setIsDirty] = React.useState(false);
  
  // Mutation to save all mappings at once (optimized API)
  const saveMappingMutation = usePkgxSectionMutation('priceMapping');

  // Sync local state with server data when loaded
  React.useEffect(() => {
    if (settings?.priceMapping) {
      setLocalMapping(settings.priceMapping as PriceMapping);
      setIsDirty(false);
    }
  }, [settings?.priceMapping]);

  // Filter only selling price policies
  const sellingPolicies = pricingPolicies.filter((p) => p.type === 'Bán hàng' && p.isActive);

  // Update local state only - no API call
  const handleChange = (field: string, value: string) => {
    setLocalMapping(prev => ({
      ...prev,
      [field]: value === 'none' ? null : value as SystemId
    }));
    setIsDirty(true);
  };

  // Save all mappings to server - use ref to avoid re-render loop
  React.useEffect(() => {
    saveRef.current = () => {
      saveMappingMutation.mutate(localMapping, {
        onSuccess: () => {
          setIsDirty(false);
          toast.success('Đã lưu mapping bảng giá');
          
          // Log the mapping save (fire and forget - don't block)
          const mappedCount = PKGX_PRICE_FIELDS.filter(pf => localMapping[pf.key]).length;
          addLog.mutate({
            action: 'save_mapping',
            status: 'success',
            message: 'Đã lưu mapping bảng giá',
            details: { total: mappedCount }
          });
        },
        onError: (err) => {
          toast.error(`Lỗi: ${err.message}`);
        },
        onSettled: () => {
          // Ensure isPending is reset regardless of success/error
        }
      });
    };
  }, [localMapping, saveMappingMutation, addLog, saveRef]);

  // Debug: log isPending changes
  React.useEffect(() => {
  }, [saveMappingMutation.isPending]);

  // Notify parent of state changes (only isDirty and isSaving)
  React.useEffect(() => {
    onStateChange({
      isDirty,
      isSaving: saveMappingMutation.isPending,
    });
  }, [isDirty, saveMappingMutation.isPending, onStateChange]);

  const getPolicyName = (policyId: SystemId | null) => {
    if (!policyId) return '-- Không áp dụng --';
    const policy = pricingPolicies.find((p) => p.systemId === policyId);
    return policy?.name || policyId;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle size="lg">Mapping Bảng giá HRM → PKGX</CardTitle>
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
              value={localMapping[priceField.key] || 'none'}
              onValueChange={(value) => handleChange(priceField.key, value)}
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
                  {getPolicyName(localMapping[priceField.key] ?? null)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {isDirty && (
          <div className="text-sm text-amber-600 text-right">
            Có thay đổi chưa lưu
          </div>
        )}
      </CardContent>
    </Card>
  );
}

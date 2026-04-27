import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Button } from '../../../../components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAllPricingPolicies } from '../../pricing/hooks/use-all-pricing-policies';
import { PKGX_PRICE_FIELDS } from '../constants';
import type { SystemId } from '../../../../lib/id-types';

type PriceMapping = Record<string, SystemId | null>;

// Hook to fetch price mappings from database
function usePriceMappings() {
  return useQuery({
    queryKey: ['pkgx', 'price-mappings'],
    queryFn: async (): Promise<PriceMapping> => {
      const res = await fetch('/api/pkgx/price-mappings');
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      
      // Convert array of mappings to key-value object
      const mappings: PriceMapping = {};
      for (const field of PKGX_PRICE_FIELDS) {
        mappings[field.key] = null;
      }
      for (const m of json.data) {
        const field = PKGX_PRICE_FIELDS.find(f => f.field === m.priceType);
        if (field) {
          mappings[field.key] = m.pricingPolicyId;
        }
      }
      return mappings;
    },
    // Always refetch: price mapping changes affect display immediately
    staleTime: 0,
  });
}

// Hook to update price mappings
function usePriceMappingMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PriceMapping) => {
      const res = await fetch('/api/pkgx/price-mappings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to update');
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pkgx', 'price-mappings'] });
    },
  });
}

export function PriceMappingTab() {
  const { data: serverMapping, isLoading } = usePriceMappings();
  const { data: pricingPolicies = [] } = useAllPricingPolicies();
  const mutation = usePriceMappingMutation();
  
  // Local draft state for unsaved changes
  const [draft, setDraft] = useState<PriceMapping>({});
  
  // Sync draft with server data when it loads/changes
  useEffect(() => {
    if (serverMapping) {
      setDraft(serverMapping);
    }
  }, [serverMapping]);

  // Filter only selling price policies
  const sellingPolicies = pricingPolicies.filter((p) => p.type === 'Bán hàng' && p.isActive);

  // Handle change - update draft only
  const handleChange = (field: string, value: string) => {
    setDraft(prev => ({
      ...prev,
      [field]: value === 'none' ? null : value as SystemId
    }));
  };
  
  // Save to server
  const handleSave = () => {
    mutation.mutate(draft, {
      onSuccess: () => {
        toast.success('Đã lưu mapping bảng giá');
      },
      onError: (err) => {
        toast.error(`Lỗi: ${err.message}`);
      }
    });
  };

  const getPolicyName = (policyId: SystemId | null) => {
    if (!policyId) return '-- Không áp dụng --';
    const policy = pricingPolicies.find((p) => p.systemId === policyId);
    return policy?.name || policyId;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

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
              value={draft[priceField.key] || 'none'}
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

        <div className="flex items-center gap-4 pt-4 border-t">
          <Button onClick={handleSave} disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Lưu mapping
          </Button>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Tóm tắt mapping hiện tại:</h4>
          <div className="bg-muted p-4 rounded-lg text-sm space-y-1">
            {PKGX_PRICE_FIELDS.map((priceField) => (
              <div key={priceField.key} className="flex justify-between">
                <span className="text-muted-foreground">{priceField.field}:</span>
                <span className="font-medium">
                  {getPolicyName(draft[priceField.key] ?? null)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

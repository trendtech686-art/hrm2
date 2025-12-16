import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card.tsx';
import { Label } from '../../../../components/ui/label.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select.tsx';
import { Badge } from '../../../../components/ui/badge.tsx';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useTrendtechSettingsStore } from '../store';
import { usePricingPolicyStore } from '../../pricing/store';

export function PriceMappingTab() {
  const { settings, updatePriceMapping, addLog } = useTrendtechSettingsStore();
  const pricingPolicyStore = usePricingPolicyStore();
  
  const pricingPolicies = React.useMemo(() => pricingPolicyStore.getActive(), [pricingPolicyStore]);
  const { priceMapping } = settings;

  const handleUpdateMapping = (field: 'price' | 'compareAtPrice', policyId: string | null) => {
    updatePriceMapping(field, policyId as any);
    
    const policyName = policyId 
      ? pricingPolicies.find(p => p.systemId === policyId)?.name || 'Unknown'
      : 'Không chọn';
    
    addLog({
      action: 'save_mapping',
      status: 'success',
      message: `Đã mapping ${field} → ${policyName}`,
      details: {},
    });
    
    toast.success(`Đã cập nhật mapping giá`);
  };

  const getPolicyName = (policyId: string | null) => {
    if (!policyId) return 'Chưa chọn';
    return pricingPolicies.find(p => p.systemId === policyId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mapping giá</CardTitle>
          <CardDescription>
            Liên kết bảng giá HRM với các loại giá trên Trendtech
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Trendtech chỉ có 2 loại giá:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>price</strong>: Giá bán hiện tại (hiển thị cho khách)</li>
            <li><strong>compareAtPrice</strong>: Giá gốc (để gạch ngang, tạo hiệu ứng giảm giá)</li>
          </ul>
        </CardContent>
      </Card>

      {/* Price Mapping */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Giá bán (price)</CardTitle>
          <CardDescription>
            Giá hiển thị cho khách hàng trên website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Bảng giá HRM</Label>
              <Select 
                value={priceMapping.price || 'none'} 
                onValueChange={(v) => handleUpdateMapping('price', v === 'none' ? null : v)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Chọn bảng giá..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- Không chọn --</SelectItem>
                  {pricingPolicies.map((policy) => (
                    <SelectItem key={policy.systemId} value={policy.systemId}>
                      {policy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <ArrowRight className="h-5 w-5 text-muted-foreground mt-6" />
            
            <div className="flex-1">
              <Label>Giá Trendtech</Label>
              <div className="mt-2 p-3 border rounded-md bg-muted/50">
                <Badge variant="secondary">price</Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  Giá bán hiện tại
                </p>
              </div>
            </div>
          </div>
          
          {priceMapping.price && (
            <p className="text-sm text-green-600 mt-2">
              ✓ Đang sử dụng: {getPolicyName(priceMapping.price)}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Compare At Price Mapping */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Giá gốc (compareAtPrice)</CardTitle>
          <CardDescription>
            Giá gốc để gạch ngang, tạo hiệu ứng giảm giá
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Bảng giá HRM</Label>
              <Select 
                value={priceMapping.compareAtPrice || 'none'} 
                onValueChange={(v) => handleUpdateMapping('compareAtPrice', v === 'none' ? null : v)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Chọn bảng giá..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- Không chọn --</SelectItem>
                  {pricingPolicies.map((policy) => (
                    <SelectItem key={policy.systemId} value={policy.systemId}>
                      {policy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <ArrowRight className="h-5 w-5 text-muted-foreground mt-6" />
            
            <div className="flex-1">
              <Label>Giá Trendtech</Label>
              <div className="mt-2 p-3 border rounded-md bg-muted/50">
                <Badge variant="secondary">compareAtPrice</Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  Giá gốc (gạch ngang)
                </p>
              </div>
            </div>
          </div>
          
          {priceMapping.compareAtPrice && (
            <p className="text-sm text-green-600 mt-2">
              ✓ Đang sử dụng: {getPolicyName(priceMapping.compareAtPrice)}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

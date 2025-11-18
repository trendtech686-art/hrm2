/**
 * Pickup Addresses Tab - V2 Simplified
 * Map Sapo branches to partner warehouses - Simple list view
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Loader2, Save, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { PartnerAccount, PickupAddress } from '@/lib/types/shipping-config';
import { useBranchStore } from '@/features/settings/branches/store';
import { toast } from 'sonner';
import { getBaseUrl } from '@/lib/api-config';

interface PickupAddressesTabProps {
  partnerCode: string;
  account: PartnerAccount;
  onAccountUpdate: (account: PartnerAccount) => void;
  getMappingsRef?: (ref: { getMappings: () => BranchMapping[]; getPickupAddresses: () => PickupAddress[] }) => void;
}

interface PartnerWarehouse {
  id: string;
  name: string;
  address: string;
  province: string;
  district: string;
  ward?: string;
  tel?: string;
}

interface BranchMapping {
  branchId: string;
  warehouseId: string;
}

export function PickupAddressesTab({
  partnerCode,
  account,
  onAccountUpdate,
  getMappingsRef,
}: PickupAddressesTabProps) {
  const { data: branches } = useBranchStore();
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [partnerWarehouses, setPartnerWarehouses] = useState<PartnerWarehouse[]>([]);
  const [mappings, setMappings] = useState<BranchMapping[]>([]);

  // Expose methods to parent
  useEffect(() => {
    if (getMappingsRef) {
      getMappingsRef({
        getMappings: () => mappings,
        getPickupAddresses: () => convertMappingsToPickupAddresses(mappings),
      });
    }
  }, [mappings, getMappingsRef, partnerWarehouses]); // Add partnerWarehouses dependency

  // Initialize mappings from existing pickup addresses
  useEffect(() => {
    const initialMappings = branches.map(branch => {
      const existing = account.pickupAddresses?.find(p => p.sapoBranchId === branch.systemId);
      return {
        branchId: branch.systemId, // Use systemId instead of id
        warehouseId: existing?.partnerWarehouseId || '',
      };
    });
    setMappings(initialMappings);
  }, [branches, account.pickupAddresses]);

  // Load partner warehouses on mount and when account changes
  useEffect(() => {
    if (partnerCode === 'GHTK' && account.credentials.apiToken) {
      loadGHTKWarehouses();
    }
  }, [partnerCode, account.credentials.apiToken]); // Re-load if account changes

  const loadGHTKWarehouses = async () => {
    setLoadingWarehouses(true);
    try {
      const apiToken = account.credentials.apiToken; // GHTK uses 'apiToken' field
      const baseUrl = getBaseUrl();
      const response = await fetch(
        `${baseUrl}/api/shipping/ghtk/list-pick-addresses?apiToken=${encodeURIComponent(apiToken)}`
      );
      const data = await response.json();

      console.log('[PickupAddresses] GHTK API raw response:', data);

      if (data.success && data.data) {
        console.log('[PickupAddresses] First warehouse raw data:', data.data[0]);
        
        const warehouses: PartnerWarehouse[] = data.data
          .map((w: any, index: number) => {
            // Try to parse province/district from pick_address if not provided
            const address = w.pick_address || w.address || '';
            const addressParts = address.split(',').map((s: string) => s.trim()).filter(s => s); // Filter empty strings
            
            // Parse: "29 đào xuyên, Xã Bát Tràng, Xã Bát Tràng, Hà Nội"
            // Last part is usually province, second-to-last is district
            const parsedProvince = addressParts.length > 0 ? addressParts[addressParts.length - 1] : '';
            const parsedDistrict = addressParts.length > 1 ? addressParts[addressParts.length - 2] : '';
            
            // ✅ Safe ID extraction with fallback to index
            const warehouseId = w.pick_address_id || w.id || `warehouse_${index}`;
            
            // Skip if no valid ID found
            if (!warehouseId || warehouseId === 'undefined') {
              console.warn('[PickupAddresses] Skipping warehouse without valid ID:', w);
              return null;
            }
            
            return {
              id: String(warehouseId), // Ensure string type
              name: w.pick_name || w.name || `Kho ${index + 1}`,
              address: address,
              // Use GHTK fields if available, otherwise parse from address
              province: w.pick_province || w.province || w.city || parsedProvince,
              district: w.pick_district || w.district || parsedDistrict,
              ward: w.pick_ward || w.ward || '',
              tel: w.pick_tel || w.tel || w.phone || '',
            };
          })
          .filter((w): w is PartnerWarehouse => w !== null); // Remove null entries
        
        console.log('[PickupAddresses] Loaded warehouses:', warehouses);
        console.log('[PickupAddresses] First parsed warehouse:', warehouses[0]);
        setPartnerWarehouses(warehouses);
      } else {
        throw new Error(data.message || 'Không thể tải danh sách kho');
      }
    } catch (error) {
      console.error('Failed to load warehouses:', error);
      toast.error('Lỗi', { description: 'Không thể tải danh sách kho từ GHTK' });
    } finally {
      setLoadingWarehouses(false);
    }
  };

  const handleMappingChange = (branchId: string, warehouseId: string) => {
    const newMappings = mappings.map(m => 
      m.branchId === branchId ? { ...m, warehouseId } : m
    );
    setMappings(newMappings);
  };

  // Convert mappings to pickup addresses
  const convertMappingsToPickupAddresses = (
    currentMappings: BranchMapping[]
  ): PickupAddress[] => {
    console.log('[PickupAddresses] Converting mappings:', {
      totalMappings: currentMappings.length,
      mappings: currentMappings,
      totalBranches: branches.length,
      totalWarehouses: partnerWarehouses.length,
      warehouseIds: partnerWarehouses.map(w => w.id)
    });

    return currentMappings
      .filter(m => m.warehouseId) // Only save branches with warehouse selected
      .map((m, index) => {
        const branch = branches.find(b => b.systemId === m.branchId);
        const warehouse = partnerWarehouses.find(w => w.id === m.warehouseId);

        // ✅ Safety check: Skip if branch or warehouse not found
        if (!branch || !warehouse) {
          console.warn('[PickupAddresses] Missing data:', { 
            branchId: m.branchId, 
            warehouseId: m.warehouseId,
            branchFound: !!branch,
            warehouseFound: !!warehouse
          });
          return null;
        }

        return {
          id: `pickup_${m.branchId}_${m.warehouseId}`,
          
          // Sapo branch info - use systemId for matching
          sapoBranchId: branch.systemId,
          sapoBranchName: branch.name,
          sapoAddress: branch.address,
          sapoProvince: branch.province,
          sapoDistrict: branch.district,
          sapoWard: branch.ward,
          sapoPhone: branch.phone,
          
          // Partner warehouse info - fallback to branch address if warehouse incomplete
          partnerWarehouseId: warehouse.id,
          partnerWarehouseName: warehouse.name,
          partnerWarehouseAddress: warehouse.address || branch.address,
          partnerWarehouseProvince: warehouse.province || branch.province || '',
          partnerWarehouseDistrict: warehouse.district || branch.district || '',
          partnerWarehouseWard: warehouse.ward || branch.ward || '',
          partnerWarehouseTel: warehouse.tel || branch.phone || '',
          
          isDefault: index === 0, // First one is default
          active: true,
        };
      })
      .filter(addr => addr !== null) as PickupAddress[]; // Remove null entries
  };

  if (loadingWarehouses) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Đang tải danh sách kho...</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Địa chỉ lấy hàng</h3>
          <p className="text-sm text-muted-foreground">
            Ánh xạ chi nhánh Sapo với kho của đối tác vận chuyển
          </p>
        </div>

        {partnerWarehouses.length === 0 ? (
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Không tìm thấy kho nào từ GHTK</p>
              <Button variant="link" onClick={loadGHTKWarehouses} className="mt-2">
                <RefreshCw className="w-4 h-4 mr-2" />
                Thử tải lại
              </Button>
            </div>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b font-semibold text-sm">
                <div className="col-span-3">Chi nhánh Sapo</div>
                <div className="col-span-5">Địa chỉ</div>
                <div className="col-span-4">Kho</div>
              </div>

              {/* Table Body */}
              <div className="divide-y">
                {branches.map((branch) => {
                  const mapping = mappings.find(m => m.branchId === branch.systemId);
                  const selectedWarehouse = partnerWarehouses.find(
                    w => w.id === mapping?.warehouseId
                  );

                  return (
                    <div key={branch.systemId} className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-colors">
                      {/* Chi nhánh Sapo */}
                      <div className="col-span-3">
                        <div className="font-medium">{branch.name}</div>
                        {branch.id && (
                          <div className="text-xs text-muted-foreground mt-1">
                            ID: {branch.id}
                          </div>
                        )}
                      </div>

                      {/* Địa chỉ */}
                      <div className="col-span-5">
                        <div className="text-sm">{branch.address}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {[branch.ward, branch.district, branch.province]
                            .filter(Boolean)
                            .join(', ')}
                        </div>
                        {branch.phone && (
                          <div className="text-xs text-muted-foreground mt-1">
                            SĐT: {branch.phone}
                          </div>
                        )}
                      </div>

                      {/* Kho */}
                      <div className="col-span-4">
                        <Select
                          value={mapping?.warehouseId || ''}
                          onValueChange={(value) => handleMappingChange(branch.systemId, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn kho giao hàng" />
                          </SelectTrigger>
                          <SelectContent>
                            {partnerWarehouses.map((warehouse) => (
                              <SelectItem key={warehouse.id} value={warehouse.id}>
                                <div className="py-1">
                                  <div className="font-medium">{warehouse.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {warehouse.address}, {[warehouse.ward, warehouse.district, warehouse.province]
                                      .filter(Boolean)
                                      .join(', ')}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedWarehouse && (
                          <div className="text-xs text-muted-foreground mt-2">
                            ID: {selectedWarehouse.id}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>

            {/* Note Section */}
            <div className="border-t bg-amber-50 p-4">
              <div className="flex gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-amber-800">
                  <div className="font-semibold mb-1">Lưu ý</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Nếu bạn có nhiều cửa hàng (Địa điểm lấy hàng), bạn cần tạo thêm địa chỉ lấy hàng - kho hàng tương ứng với tài khoản Giao Hàng Tiết Kiệm để đến lúc kết nối với Sapo.</li>
                    <li>Thêm mới địa chỉ lấy hàng - kho hàng trên Giao Hàng Tiết Kiệm tại <a href="https://khachhang.giaohangtietkiem.vn" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">đây</a>.</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}

/**
 * Pickup Addresses Tab - V2 Simplified
 * Map Sapo branches to partner warehouses - Simple list view
 */

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { mobileBleedCardClass } from '@/components/layout/page-section';
import { MapPin, Loader2, RefreshCw, Check, ChevronsUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PartnerAccount, PickupAddress } from '@/lib/types/shipping-config';
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches';
import { toast } from 'sonner';
import { getBaseUrl } from '@/lib/api-config';
import { logError } from '@/lib/logger'

interface PickupAddressesTabProps {
  partnerCode: string;
  account: PartnerAccount;
  onAccountUpdate: (account: PartnerAccount) => void;
  getMappingsRef?: ((ref: { getMappings: () => BranchMapping[]; getPickupAddresses: () => PickupAddress[] }) => void) | undefined;
}

interface PartnerWarehouse {
  id: string;
  name: string;
  address: string;
  province: string;
  district: string;
  ward?: string | undefined;
  tel?: string | undefined;
}

interface BranchMapping {
  branchId: string;
  warehouseId: string;
}

export function PickupAddressesTab({
  partnerCode,
  account,
  onAccountUpdate: _onAccountUpdate,
  getMappingsRef,
}: PickupAddressesTabProps) {
  const { data: branches } = useAllBranches();
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [partnerWarehouses, setPartnerWarehouses] = useState<PartnerWarehouse[]>([]);
  const [mappings, setMappings] = useState<BranchMapping[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Checkbox state for bulk selection
  const [selectedBranchIds, setSelectedBranchIds] = useState<Set<string>>(new Set());
  
  // Combobox open state per branch
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  // Expose methods to parent
  useEffect(() => {
    if (getMappingsRef) {
      getMappingsRef({
        getMappings: () => mappings,
        getPickupAddresses: () => convertMappingsToPickupAddresses(mappings),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- convertMappingsToPickupAddresses is a stable helper function
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- loadGHTKWarehouses is defined after but stable
  }, [partnerCode, account.credentials.apiToken]); // Re-load if account changes

  const loadGHTKWarehouses = async () => {
    setLoadingWarehouses(true);
    try {
      const apiToken = account.credentials.apiToken ?? ''; // GHTK uses 'apiToken' field
      const baseUrl = getBaseUrl();
      const response = await fetch(
        `${baseUrl}/api/shipping/ghtk/list-pick-addresses?apiToken=${encodeURIComponent(apiToken)}`
      );
      const data = await response.json();


      if (data.success && data.data) {
        
        const warehouses: PartnerWarehouse[] = data.data
          .map((w: { pick_address_id?: string; id?: string; pick_address?: string; address?: string; pick_name?: string; name?: string; pick_province?: string; province?: string; city?: string; pick_district?: string; district?: string; pick_ward?: string; ward?: string; pick_tel?: string; tel?: string; phone?: string }, index: number) => {
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
          .filter((w: PartnerWarehouse | null): w is PartnerWarehouse => w !== null); // Remove null entries
        
        setPartnerWarehouses(warehouses);
      } else {
        throw new Error(data.message || 'Không thể tải danh sách kho');
      }
    } catch (error) {
      logError('Failed to load warehouses', error);
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

  // Bulk mapping change for selected branches
  const handleBulkMappingChange = (warehouseId: string) => {
    const newMappings = mappings.map(m => 
      selectedBranchIds.has(m.branchId) ? { ...m, warehouseId } : m
    );
    setMappings(newMappings);
    setSelectedBranchIds(new Set()); // Clear selection after bulk action
  };

  // Pagination logic
  const paginatedBranches = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return branches.slice(startIndex, startIndex + pageSize);
  }, [branches, currentPage, pageSize]);

  const totalPages = Math.ceil(branches.length / pageSize);

  // Select all logic
  const isAllSelected = paginatedBranches.length > 0 && 
    paginatedBranches.every(b => selectedBranchIds.has(b.systemId));
  const isSomeSelected = paginatedBranches.some(b => selectedBranchIds.has(b.systemId)) && !isAllSelected;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(selectedBranchIds);
      paginatedBranches.forEach(b => newSelected.add(b.systemId));
      setSelectedBranchIds(newSelected);
    } else {
      const newSelected = new Set(selectedBranchIds);
      paginatedBranches.forEach(b => newSelected.delete(b.systemId));
      setSelectedBranchIds(newSelected);
    }
  };

  const handleSelectOne = (branchId: string, checked: boolean) => {
    const newSelected = new Set(selectedBranchIds);
    if (checked) {
      newSelected.add(branchId);
    } else {
      newSelected.delete(branchId);
    }
    setSelectedBranchIds(newSelected);
  };

  // Convert mappings to pickup addresses
  const convertMappingsToPickupAddresses = (
    currentMappings: BranchMapping[]
  ): PickupAddress[] => {

    return currentMappings
      .filter(m => m.warehouseId) // Only save branches with warehouse selected
      .map((m, index) => {
        const branch = branches.find(b => b.systemId === m.branchId);
        const warehouse = partnerWarehouses.find(w => w.id === m.warehouseId);

        // ✅ Safety check: Skip if branch or warehouse not found
        if (!branch || !warehouse) {
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
          <Card className={cn(mobileBleedCardClass, 'p-8')}>
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
          <Card className={mobileBleedCardClass}>
            <CardContent className="p-0">
              {/* Bulk actions bar */}
              {selectedBranchIds.size > 0 && (
                <div className="flex items-center gap-4 p-4 bg-blue-50 border-b">
                  <span className="text-sm font-medium">
                    Đã chọn {selectedBranchIds.size} chi nhánh
                  </span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        Gán kho cho tất cả
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Tìm kho..." />
                        <CommandList className="max-h-[300px] overflow-y-auto">
                          <CommandEmpty>Không tìm thấy kho</CommandEmpty>
                          <CommandGroup>
                            {partnerWarehouses.map((warehouse) => (
                              <CommandItem
                                key={warehouse.id}
                                value={`${warehouse.name} ${warehouse.address}`}
                                onSelect={() => handleBulkMappingChange(warehouse.id)}
                              >
                                <div className="py-1">
                                  <div className="font-medium">{warehouse.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {warehouse.address}
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedBranchIds(new Set())}
                  >
                    Bỏ chọn
                  </Button>
                </div>
              )}

              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b font-semibold text-sm items-center">
                <div className="col-span-1 flex items-center">
                  <Checkbox
                    checked={isAllSelected ? true : isSomeSelected ? "indeterminate" : false}
                    onCheckedChange={handleSelectAll}
                  />
                </div>
                <div className="col-span-2">Chi nhánh Sapo</div>
                <div className="col-span-5">Địa chỉ</div>
                <div className="col-span-4">Kho</div>
              </div>

              {/* Table Body */}
              <div className="divide-y">
                {paginatedBranches.map((branch) => {
                  const mapping = mappings.find(m => m.branchId === branch.systemId);
                  const selectedWarehouse = partnerWarehouses.find(
                    w => w.id === mapping?.warehouseId
                  );
                  const isOpen = openPopover === branch.systemId;

                  return (
                    <div key={branch.systemId} className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/30 transition-colors items-center">
                      {/* Checkbox */}
                      <div className="col-span-1">
                        <Checkbox
                          checked={selectedBranchIds.has(branch.systemId)}
                          onCheckedChange={(checked) => handleSelectOne(branch.systemId, checked === true)}
                        />
                      </div>

                      {/* Chi nhánh Sapo */}
                      <div className="col-span-2">
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

                      {/* Kho - Combobox */}
                      <div className="col-span-4">
                        <Popover open={isOpen} onOpenChange={(open) => setOpenPopover(open ? branch.systemId : null)}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={isOpen}
                              className="w-full justify-between"
                            >
                              {selectedWarehouse ? (
                                <span className="truncate">{selectedWarehouse.name}</span>
                              ) : (
                                <span className="text-muted-foreground">Chọn kho giao hàng</span>
                              )}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Tìm kho..." />
                              <CommandList className="max-h-[300px] overflow-y-auto">
                                <CommandEmpty>Không tìm thấy kho</CommandEmpty>
                                <CommandGroup>
                                  {partnerWarehouses.map((warehouse) => (
                                    <CommandItem
                                      key={warehouse.id}
                                      value={`${warehouse.name} ${warehouse.address}`}
                                      onSelect={() => {
                                        handleMappingChange(branch.systemId, warehouse.id);
                                        setOpenPopover(null);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          mapping?.warehouseId === warehouse.id ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      <div className="py-1">
                                        <div className="font-medium">{warehouse.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {warehouse.address}
                                        </div>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
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

            {/* Pagination */}
            {branches.length > pageSize && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Hiển thị {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, branches.length)} trên {branches.length} chi nhánh
                  </span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[70px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm px-2">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Note Section */}
            <div className="border-t bg-amber-50 p-4">
              <div className="flex gap-2">
                <div className="shrink-0 mt-0.5">
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

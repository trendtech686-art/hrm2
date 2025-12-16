import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card.tsx';
import { Button } from '../../../../components/ui/button.tsx';
import { Badge } from '../../../../components/ui/badge.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table.tsx';
import { Plus, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTrendtechSettingsStore } from '../store';
import { useBrandStore } from '../../inventory/brand-store';
import { nanoid } from 'nanoid';

export function BrandMappingTab() {
  const { 
    settings, 
    addBrandMapping, 
    deleteBrandMapping, 
    syncBrandsFromTrendtech,
    addLog,
  } = useTrendtechSettingsStore();
  const brandStore = useBrandStore();
  const [isSyncing, setIsSyncing] = React.useState(false);
  
  const hrmBrands = React.useMemo(() => brandStore.getActive(), [brandStore]);
  const trendtechBrands = settings.brands;
  const mappings = settings.brandMappings;

  // Get unmapped HRM brands
  const unmappedHrmBrands = React.useMemo(() => {
    const mappedIds = new Set(mappings.map((m) => m.hrmBrandSystemId));
    return hrmBrands.filter((b) => !mappedIds.has(b.systemId));
  }, [hrmBrands, mappings]);

  const handleSyncBrands = async () => {
    setIsSyncing(true);
    try {
      await syncBrandsFromTrendtech();
      toast.success('Đã đồng bộ danh sách thương hiệu từ Trendtech');
    } catch (error) {
      toast.error('Lỗi đồng bộ thương hiệu: ' + (error instanceof Error ? error.message : 'Unknown'));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddMapping = (hrmBrandId: string, trendtechBrandId: string) => {
    const hrmBrand = hrmBrands.find((b) => b.systemId === hrmBrandId);
    const trendtechBrand = trendtechBrands.find((b) => b.id === parseInt(trendtechBrandId, 10));
    
    if (!hrmBrand || !trendtechBrand) return;
    
    addBrandMapping({
      id: nanoid(),
      hrmBrandSystemId: hrmBrand.systemId,
      hrmBrandName: hrmBrand.name,
      trendtechBrandId: trendtechBrand.id,
      trendtechBrandName: trendtechBrand.name,
    });
    
    addLog({
      action: 'save_mapping',
      status: 'success',
      message: `Đã mapping: ${hrmBrand.name} → ${trendtechBrand.name}`,
      details: { brandId: trendtechBrand.id },
    });
    
    toast.success(`Đã mapping: ${hrmBrand.name} → ${trendtechBrand.name}`);
  };

  const handleDeleteMapping = (id: string) => {
    const mapping = mappings.find((m) => m.id === id);
    deleteBrandMapping(id);
    
    addLog({
      action: 'save_mapping',
      status: 'info',
      message: `Đã xóa mapping: ${mapping?.hrmBrandName}`,
      details: {},
    });
    
    toast.success('Đã xóa mapping');
  };

  return (
    <div className="space-y-6">
      {/* Sync Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Danh sách thương hiệu Trendtech</CardTitle>
          <CardDescription>
            Đồng bộ danh sách thương hiệu từ website Trendtech
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Số thương hiệu: <Badge>{trendtechBrands.length}</Badge></p>
            </div>
            <Button onClick={handleSyncBrands} disabled={isSyncing || !settings.enabled}>
              {isSyncing ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Đang đồng bộ...</>
              ) : (
                <><RefreshCw className="h-4 w-4 mr-2" />Đồng bộ từ Trendtech</>
              )}
            </Button>
          </div>
          
          {!settings.enabled && (
            <p className="text-sm text-amber-600">
              Vui lòng bật tích hợp Trendtech trong tab Cấu hình chung để đồng bộ
            </p>
          )}
        </CardContent>
      </Card>

      {/* Mapping Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mapping thương hiệu</CardTitle>
          <CardDescription>
            Liên kết thương hiệu HRM với thương hiệu Trendtech
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mappings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có mapping nào. Thêm mapping bên dưới.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thương hiệu HRM</TableHead>
                  <TableHead>→</TableHead>
                  <TableHead>Thương hiệu Trendtech</TableHead>
                  <TableHead className="w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappings.map((mapping) => (
                  <TableRow key={mapping.id}>
                    <TableCell>{mapping.hrmBrandName}</TableCell>
                    <TableCell>→</TableCell>
                    <TableCell>
                      {mapping.trendtechBrandName}
                      <Badge variant="outline" className="ml-2">ID: {mapping.trendtechBrandId}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteMapping(mapping.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Mapping Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thêm mapping mới</CardTitle>
        </CardHeader>
        <CardContent>
          <AddMappingForm
            unmappedHrmBrands={unmappedHrmBrands}
            trendtechBrands={trendtechBrands}
            onAdd={handleAddMapping}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function AddMappingForm({
  unmappedHrmBrands,
  trendtechBrands,
  onAdd,
}: {
  unmappedHrmBrands: any[];
  trendtechBrands: any[];
  onAdd: (hrmId: string, trendtechId: string) => void;
}) {
  const [selectedHrm, setSelectedHrm] = React.useState('');
  const [selectedTrendtech, setSelectedTrendtech] = React.useState('');

  const handleAdd = () => {
    if (selectedHrm && selectedTrendtech) {
      onAdd(selectedHrm, selectedTrendtech);
      setSelectedHrm('');
      setSelectedTrendtech('');
    }
  };

  return (
    <div className="flex items-end gap-4">
      <div className="flex-1 space-y-2">
        <label className="text-sm font-medium">Thương hiệu HRM</label>
        <Select value={selectedHrm} onValueChange={setSelectedHrm}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn thương hiệu HRM..." />
          </SelectTrigger>
          <SelectContent>
            {unmappedHrmBrands.map((brand) => (
              <SelectItem key={brand.systemId} value={brand.systemId}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-2">
        <label className="text-sm font-medium">Thương hiệu Trendtech</label>
        <Select value={selectedTrendtech} onValueChange={setSelectedTrendtech}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn thương hiệu Trendtech..." />
          </SelectTrigger>
          <SelectContent>
            {trendtechBrands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id.toString()}>
                {brand.name} (ID: {brand.id})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleAdd} disabled={!selectedHrm || !selectedTrendtech}>
        <Plus className="h-4 w-4 mr-2" />
        Thêm
      </Button>
    </div>
  );
}

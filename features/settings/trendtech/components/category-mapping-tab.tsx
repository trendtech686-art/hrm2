import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Plus, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTrendtechSettingsStore } from '../store';
import { useProductCategoryStore } from '../../inventory/product-category-store';
import { nanoid } from 'nanoid';

export function CategoryMappingTab() {
  const { 
    settings, 
    addCategoryMapping, 
    deleteCategoryMapping, 
    syncCategoriesFromTrendtech,
    addLog,
  } = useTrendtechSettingsStore();
  const categoryStore = useProductCategoryStore();
  const [isSyncing, setIsSyncing] = React.useState(false);
  
  const hrmCategories = React.useMemo(() => categoryStore.getActive(), [categoryStore]);
  const trendtechCategories = settings.categories;
  const mappings = settings.categoryMappings;

  // Get unmapped HRM categories
  const unmappedHrmCategories = React.useMemo(() => {
    const mappedIds = new Set(mappings.map((m) => m.hrmCategorySystemId));
    return hrmCategories.filter((c) => !mappedIds.has(c.systemId));
  }, [hrmCategories, mappings]);

  const handleSyncCategories = async () => {
    setIsSyncing(true);
    try {
      await syncCategoriesFromTrendtech();
      toast.success('Đã đồng bộ danh sách danh mục từ Trendtech');
    } catch (error) {
      toast.error('Lỗi đồng bộ danh mục: ' + (error instanceof Error ? error.message : 'Unknown'));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddMapping = (hrmCategoryId: string, trendtechCatId: string) => {
    const hrmCategory = hrmCategories.find((c) => c.systemId === hrmCategoryId);
    const trendtechCategory = trendtechCategories.find((c) => c.id === parseInt(trendtechCatId, 10));
    
    if (!hrmCategory || !trendtechCategory) return;
    
    addCategoryMapping({
      id: nanoid(),
      hrmCategorySystemId: hrmCategory.systemId,
      hrmCategoryName: hrmCategory.name,
      trendtechCatId: trendtechCategory.id,
      trendtechCatName: trendtechCategory.name,
    });
    
    addLog({
      action: 'save_mapping',
      status: 'success',
      message: `Đã mapping: ${hrmCategory.name} → ${trendtechCategory.name}`,
      details: { categoryId: trendtechCategory.id },
    });
    
    toast.success(`Đã mapping: ${hrmCategory.name} → ${trendtechCategory.name}`);
  };

  const handleDeleteMapping = (id: string) => {
    const mapping = mappings.find((m) => m.id === id);
    deleteCategoryMapping(id);
    
    addLog({
      action: 'save_mapping',
      status: 'info',
      message: `Đã xóa mapping: ${mapping?.hrmCategoryName}`,
      details: {},
    });
    
    toast.success('Đã xóa mapping');
  };

  return (
    <div className="space-y-6">
      {/* Sync Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Danh sách danh mục Trendtech</CardTitle>
          <CardDescription>
            Đồng bộ danh sách danh mục từ website Trendtech
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Số danh mục: <Badge>{trendtechCategories.length}</Badge></p>
            </div>
            <Button onClick={handleSyncCategories} disabled={isSyncing || !settings.enabled}>
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
          <CardTitle className="text-lg">Mapping danh mục</CardTitle>
          <CardDescription>
            Liên kết danh mục HRM với danh mục Trendtech
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
                  <TableHead>Danh mục HRM</TableHead>
                  <TableHead>→</TableHead>
                  <TableHead>Danh mục Trendtech</TableHead>
                  <TableHead className="w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappings.map((mapping) => (
                  <TableRow key={mapping.id}>
                    <TableCell>{mapping.hrmCategoryName}</TableCell>
                    <TableCell>→</TableCell>
                    <TableCell>
                      {mapping.trendtechCatName}
                      <Badge variant="outline" className="ml-2">ID: {mapping.trendtechCatId}</Badge>
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
            unmappedHrmCategories={unmappedHrmCategories}
            trendtechCategories={trendtechCategories}
            onAdd={handleAddMapping}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function AddMappingForm({
  unmappedHrmCategories,
  trendtechCategories,
  onAdd,
}: {
  unmappedHrmCategories: any[];
  trendtechCategories: any[];
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
        <label className="text-sm font-medium">Danh mục HRM</label>
        <Select value={selectedHrm} onValueChange={setSelectedHrm}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn danh mục HRM..." />
          </SelectTrigger>
          <SelectContent>
            {unmappedHrmCategories.map((cat) => (
              <SelectItem key={cat.systemId} value={cat.systemId}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-2">
        <label className="text-sm font-medium">Danh mục Trendtech</label>
        <Select value={selectedTrendtech} onValueChange={setSelectedTrendtech}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn danh mục Trendtech..." />
          </SelectTrigger>
          <SelectContent>
            {trendtechCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.name} (ID: {cat.id})
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

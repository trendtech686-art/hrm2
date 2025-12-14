import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card.tsx';
import { Button } from '../../../../components/ui/button.tsx';
import { Input } from '../../../../components/ui/input.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table.tsx';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../../components/ui/dialog.tsx';
import { Label } from '../../../../components/ui/label.tsx';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { usePkgxSettingsStore } from '../store';
import type { PkgxBrand } from '../types';

export function BrandListTab() {
  const { settings, addBrand, updateBrand, deleteBrand } = usePkgxSettingsStore();
  const [search, setSearch] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingBrand, setEditingBrand] = React.useState<PkgxBrand | null>(null);
  const [formData, setFormData] = React.useState({ id: '', name: '' });

  const filteredBrands = React.useMemo(() => {
    if (!search) return settings.brands;
    const q = search.toLowerCase();
    return settings.brands.filter(
      (b) => b.name.toLowerCase().includes(q) || b.id.toString().includes(q)
    );
  }, [settings.brands, search]);

  const handleOpenAdd = () => {
    setEditingBrand(null);
    setFormData({ id: '', name: '' });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (brand: PkgxBrand) => {
    setEditingBrand(brand);
    setFormData({ id: brand.id.toString(), name: brand.name });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const id = parseInt(formData.id, 10);
    if (isNaN(id) || id <= 0) {
      toast.error('ID phải là số dương');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Tên thương hiệu không được để trống');
      return;
    }

    if (editingBrand) {
      updateBrand(editingBrand.id, { id, name: formData.name.trim() });
      toast.success('Đã cập nhật thương hiệu');
    } else {
      if (settings.brands.some((b) => b.id === id)) {
        toast.error('ID thương hiệu đã tồn tại');
        return;
      }
      addBrand({ id, name: formData.name.trim() });
      toast.success('Đã thêm thương hiệu mới');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (brand: PkgxBrand) => {
    if (confirm(`Xóa thương hiệu "${brand.name}" (ID: ${brand.id})?`)) {
      deleteBrand(brand.id);
      toast.success('Đã xóa thương hiệu');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Danh sách thương hiệu PKGX</CardTitle>
        <Button onClick={handleOpenAdd} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Thêm thương hiệu
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo ID hoặc tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="border rounded-lg max-h-[500px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">ID</TableHead>
                <TableHead>Tên thương hiệu</TableHead>
                <TableHead className="w-24 text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell className="font-mono">{brand.id}</TableCell>
                  <TableCell>{brand.name}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(brand)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(brand)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredBrands.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    Không tìm thấy thương hiệu nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm text-muted-foreground">
          Tổng: {settings.brands.length} thương hiệu
        </p>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBrand ? 'Sửa thương hiệu' : 'Thêm thương hiệu mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ID thương hiệu (brand_id)</Label>
              <Input
                type="number"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="VD: 15"
              />
            </div>
            <div className="space-y-2">
              <Label>Tên thương hiệu</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Hoco"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>{editingBrand ? 'Cập nhật' : 'Thêm'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../../components/ui/dialog';
import { Label } from '../../../../components/ui/label';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { usePkgxSettingsStore } from '../store';
import type { PkgxCategory } from '../types';

export function CategoryListTab() {
  const { settings, addCategory, updateCategory, deleteCategory } = usePkgxSettingsStore();
  const [search, setSearch] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<PkgxCategory | null>(null);
  const [formData, setFormData] = React.useState({ id: '', name: '' });

  const filteredCategories = React.useMemo(() => {
    if (!search) return settings.categories;
    const q = search.toLowerCase();
    return settings.categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.id.toString().includes(q)
    );
  }, [settings.categories, search]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ id: '', name: '' });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (category: PkgxCategory) => {
    setEditingCategory(category);
    setFormData({ id: category.id.toString(), name: category.name });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const id = parseInt(formData.id, 10);
    if (isNaN(id) || id <= 0) {
      toast.error('ID phải là số dương');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Tên danh mục không được để trống');
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, { id, name: formData.name.trim() });
      toast.success('Đã cập nhật danh mục');
    } else {
      if (settings.categories.some((c) => c.id === id)) {
        toast.error('ID danh mục đã tồn tại');
        return;
      }
      addCategory({ id, name: formData.name.trim() });
      toast.success('Đã thêm danh mục mới');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (category: PkgxCategory) => {
    if (confirm(`Xóa danh mục "${category.name}" (ID: ${category.id})?`)) {
      deleteCategory(category.id);
      toast.success('Đã xóa danh mục');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Danh sách danh mục PKGX</CardTitle>
        <Button onClick={handleOpenAdd} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Thêm danh mục
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
                <TableHead>Tên danh mục</TableHead>
                <TableHead className="w-24 text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-mono">{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(category)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(category)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    Không tìm thấy danh mục nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm text-muted-foreground">
          Tổng: {settings.categories.length} danh mục
        </p>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ID danh mục (cat_id)</Label>
              <Input
                type="number"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="VD: 315"
              />
            </div>
            <div className="space-y-2">
              <Label>Tên danh mục</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Tai nghe Bluetooth TWS"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>{editingCategory ? 'Cập nhật' : 'Thêm'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

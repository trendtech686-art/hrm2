import * as React from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { Switch } from '../../components/ui/switch';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Plus, Trash2, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { toast } from 'sonner';

export interface CustomerContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

const PAGE_SIZE = 5;

interface CustomerContactsProps {
  contacts: CustomerContact[];
  onUpdate: (contacts: CustomerContact[]) => void;
}

export function CustomerContacts({ contacts = [], onUpdate }: CustomerContactsProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deletingContact, setDeletingContact] = React.useState<CustomerContact | null>(null);
  const [editingContact, setEditingContact] = React.useState<CustomerContact | null>(null);
  
  // Form state
  const [formData, setFormData] = React.useState<Omit<CustomerContact, 'id'>>({
    name: '',
    role: '',
    phone: '',
    email: '',
    isPrimary: false,
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(contacts.length / PAGE_SIZE);
  const paginatedContacts = contacts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  
  // Checkbox selection
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const allSelected = paginatedContacts.length > 0 && paginatedContacts.every(c => selectedIds.has(c.id));
  const someSelected = paginatedContacts.some(c => selectedIds.has(c.id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newIds = new Set(selectedIds);
      paginatedContacts.forEach(c => newIds.add(c.id));
      setSelectedIds(newIds);
    } else {
      const newIds = new Set(selectedIds);
      paginatedContacts.forEach(c => newIds.delete(c.id));
      setSelectedIds(newIds);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newIds = new Set(selectedIds);
    if (checked) {
      newIds.add(id);
    } else {
      newIds.delete(id);
    }
    setSelectedIds(newIds);
  };
  
  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    const newContacts = contacts.filter(c => !selectedIds.has(c.id));
    onUpdate(newContacts);
    setSelectedIds(new Set());
    toast.success(`Đã xóa ${selectedIds.size} liên hệ`);
  };

  const handleAddNew = () => {
    setEditingContact(null);
    setFormData({
      name: '',
      role: '',
      phone: '',
      email: '',
      isPrimary: false,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (contact: CustomerContact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      role: contact.role,
      phone: contact.phone,
      email: contact.email,
      isPrimary: contact.isPrimary,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập họ và tên');
      return;
    }

    let newContacts: CustomerContact[];
    let savedContactId: string;

    if (editingContact) {
      // Update existing
      savedContactId = editingContact.id;
      newContacts = contacts.map(c =>
        c.id === editingContact.id 
          ? { ...formData, id: c.id } 
          : c
      );
    } else {
      // Add new
      savedContactId = crypto.randomUUID();
      newContacts = [...contacts, { ...formData, id: savedContactId }];
    }

    // If setting as primary, unset other primaries
    if (formData.isPrimary) {
      newContacts = newContacts.map(c => {
        if (c.id !== savedContactId) {
          return { ...c, isPrimary: false };
        }
        return c;
      });
    }

    onUpdate(newContacts);
    setIsDialogOpen(false);
    toast.success(editingContact ? 'Đã cập nhật liên hệ' : 'Đã thêm liên hệ mới');
  };

  const handleDelete = (contact: CustomerContact) => {
    setDeletingContact(contact);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingContact) return;
    const newContacts = contacts.filter(c => c.id !== deletingContact.id);
    onUpdate(newContacts);
    toast.success('Đã xóa liên hệ');
    setIsDeleteDialogOpen(false);
    setDeletingContact(null);
  };

  const handleSetPrimary = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;
    
    // If already primary, toggle off (no primary). Otherwise, set as primary
    const newIsPrimary = !contact.isPrimary;
    
    const newContacts = contacts.map(c => ({
      ...c,
      isPrimary: c.id === id ? newIsPrimary : false,
    }));
    onUpdate(newContacts);
    toast.success(newIsPrimary ? 'Đã đặt làm liên hệ chính' : 'Đã bỏ liên hệ chính');
  };

  return (
    <div className="space-y-4 p-4 rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium">Danh sách liên hệ</h3>
          {selectedIds.size > 0 && (
            <Button 
              type="button" 
              variant="destructive" 
              size="sm"
              onClick={handleDeleteSelected}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa {selectedIds.size} liên hệ
            </Button>
          )}
        </div>
        <Button type="button" onClick={handleAddNew} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Thêm liên hệ
        </Button>
      </div>

      {contacts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Chưa có liên hệ nào. Nhấn "Thêm liên hệ" để tạo mới.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <div className="rounded-md border border-border ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox 
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Chọn tất cả"
                      className={someSelected && !allSelected ? 'opacity-50' : ''}
                    />
                  </TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Chức vụ/Vai trò</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Liên hệ chính</TableHead>
                  <TableHead className="w-12.5"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedContacts.map((contact) => (
                  <TableRow 
                    key={contact.id} 
                    className="cursor-pointer"
                    onClick={() => handleEdit(contact)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedIds.has(contact.id)}
                        onCheckedChange={(checked) => handleSelectOne(contact.id, !!checked)}
                        aria-label={`Chọn liên hệ ${contact.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {contact.name}
                    </TableCell>
                    <TableCell>{contact.role || '—'}</TableCell>
                    <TableCell>{contact.phone || '—'}</TableCell>
                    <TableCell>{contact.email || '—'}</TableCell>
                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                      <Switch 
                        checked={contact.isPrimary}
                        onCheckedChange={() => handleSetPrimary(contact.id)}
                        aria-label="Đặt làm liên hệ chính"
                      />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Mở menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(contact)}>
                            Sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleSetPrimary(contact.id)}>
                            Đặt làm liên hệ chính
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(contact)}
                            className="text-destructive focus:text-destructive"
                          >
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-2">
              <div className="text-sm text-muted-foreground">
                Hiển thị {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, contacts.length)} / {contacts.length} liên hệ
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Trang {currentPage} / {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingContact ? 'Sửa liên hệ' : 'Thêm liên hệ mới'}</DialogTitle>
            <DialogDescription>
              {editingContact ? 'Cập nhật thông tin liên hệ' : 'Nhập thông tin liên hệ mới'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Chức vụ / Vai trò</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                placeholder="Kế toán, Mua hàng..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="09xxxxxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@example.com"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isPrimary"
                checked={formData.isPrimary}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPrimary: !!checked }))}
              />
              <Label htmlFor="isPrimary" className="cursor-pointer">
                Đặt làm liên hệ chính
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button type="button" onClick={handleSave}>
              {editingContact ? 'Cập nhật' : 'Thêm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa liên hệ</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa liên hệ này?
            </DialogDescription>
          </DialogHeader>
          {deletingContact && (
            <div className="py-4 space-y-2">
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium text-sm">{deletingContact.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {deletingContact.role && `${deletingContact.role} • `}
                  {deletingContact.phone || deletingContact.email || 'Không có thông tin liên lạc'}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Hành động này không thể hoàn tác.
              </p>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Hủy
            </Button>
            <Button 
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              className="w-full sm:w-auto"
            >
              Xóa liên hệ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

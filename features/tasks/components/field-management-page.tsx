import { useState } from 'react';
import { Plus, Edit, Trash2, Copy, Eye, EyeOff, GripVertical } from 'lucide-react';
import { useAllCustomFields } from '../hooks/use-all-custom-fields';
import { useCustomFieldMutations } from '../hooks/use-custom-fields';
import { PREDEFINED_FIELDS, FIELD_CATEGORIES } from '../custom-fields-types';
import type { CustomFieldDefinition, CustomFieldType } from '../custom-fields-types';
import { toast } from 'sonner';
import { usePageHeader } from '@/contexts/page-header-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CustomFieldInput } from '@/components/CustomFieldInput';

const FIELD_TYPES: { value: CustomFieldType; label: string }[] = [
  { value: 'text', label: 'Văn bản ngắn' },
  { value: 'textarea', label: 'Văn bản dài' },
  { value: 'number', label: 'Số' },
  { value: 'currency', label: 'Tiền tệ' },
  { value: 'percentage', label: 'Phần trăm' },
  { value: 'date', label: 'Ngày tháng' },
  { value: 'checkbox', label: 'Hộp kiểm' },
  { value: 'select', label: 'Chọn một' },
  { value: 'multiselect', label: 'Chọn nhiều' },
  { value: 'url', label: 'URL' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Số điện thoại' },
];

export function FieldManagementPage() {
  const { data, getActive, getByCategory, getCategories } = useAllCustomFields();
  const { create, update, remove } = useCustomFieldMutations({
    onSuccess: () => toast.success('Đã cập nhật'),
    onError: (error) => toast.error(error.message),
  });
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomFieldDefinition | null>(null);

  usePageHeader({
    title: 'Quản lý trường tùy chỉnh',
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Công việc', href: '/tasks' },
      { label: 'Trường tùy chỉnh', href: '/tasks/fields' },
    ],
  });

  const categories = getCategories();
  const fields = selectedCategory === 'all'
    ? getActive()
    : getByCategory(selectedCategory);

  const stats = {
    total: data.length,
    active: data.filter(f => f.isActive).length,
    categories: categories.length,
  };

  const handleAddPredefined = (predefined: Partial<CustomFieldDefinition>) => {
    const field: Omit<CustomFieldDefinition, 'systemId' | 'createdAt' | 'updatedAt'> = {
      id: predefined.id || '',
      name: predefined.name || '',
      type: predefined.type || 'text',
      required: predefined.required || false,
      isActive: predefined.isActive !== false,
      order: predefined.order || 0,
      category: predefined.category,
      description: predefined.description,
      helpText: predefined.helpText,
      placeholder: predefined.placeholder,
      defaultValue: predefined.defaultValue,
      min: predefined.min,
      max: predefined.max,
      step: predefined.step,
      maxLength: predefined.maxLength,
      options: predefined.options,
      visibleToRoles: predefined.visibleToRoles,
      editableByRoles: predefined.editableByRoles,
      createdBy: 'CURRENT_USER',
    };
    create.mutate(field);
  };

  const handleToggleActive = (field: CustomFieldDefinition) => {
    update.mutate({
      systemId: field.systemId,
      data: { isActive: !field.isActive },
    });
  };

  const handleDelete = (fieldId: string) => {
    if (confirm('Bạn có chắc muốn xóa trường này?')) {
      remove.mutate(fieldId);
    }
  };

  const handleDuplicate = (field: CustomFieldDefinition) => {
    const duplicate: Omit<CustomFieldDefinition, 'systemId' | 'createdAt' | 'updatedAt'> = {
      ...field,
      name: `${field.name} (Copy)`,
      id: `${field.id}_copy_${Date.now()}`,
      createdBy: 'CURRENT_USER',
    };
    create.mutate(duplicate);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số trường</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-50">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {Object.entries(FIELD_CATEGORIES).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tạo trường mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tạo trường tùy chỉnh</DialogTitle>
                <DialogDescription>
                  Hoặc chọn từ các mẫu có sẵn bên dưới
                </DialogDescription>
              </DialogHeader>
              <FieldForm
                onSubmit={(field) => {
                  create.mutate(field);
                  setIsCreateDialogOpen(false);
                }}
                onCancel={() => setIsCreateDialogOpen(false)}
              />

              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-3">Trường mẫu</h4>
                <div className="grid grid-cols-2 gap-2">
                  {PREDEFINED_FIELDS.map((field, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start"
                      onClick={() => {
                        handleAddPredefined(field);
                        setIsCreateDialogOpen(false);
                      }}
                    >
                      <Plus className="h-3 w-3 mr-2" />
                      {field.name}
                    </Button>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Fields List */}
      <div className="space-y-4">
        {fields.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Không có trường nào. Tạo trường mới hoặc chọn từ mẫu có sẵn.
            </CardContent>
          </Card>
        ) : (
          fields.map((field) => (
            <Card key={field.systemId}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <CardTitle className="text-lg">{field.name}</CardTitle>
                      <Badge variant="outline">
                        {FIELD_TYPES.find(t => t.value === field.type)?.label}
                      </Badge>
                      {field.required && (
                        <Badge variant="destructive">Bắt buộc</Badge>
                      )}
                      {!field.isActive && (
                        <Badge variant="secondary">Đã tắt</Badge>
                      )}
                    </div>
                    {field.description && (
                      <CardDescription>{field.description}</CardDescription>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>ID: {field.id}</span>
                      {field.category && (
                        <>
                          <span>•</span>
                          <span>{FIELD_CATEGORIES[field.category as keyof typeof FIELD_CATEGORIES]}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleActive(field)}
                      title={field.isActive ? 'Tắt trường' : 'Bật trường'}
                    >
                      {field.isActive ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingField(field)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDuplicate(field)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(field.systemId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Xem trước</h4>
                    <div className="border rounded-md p-4 bg-muted/30">
                      <CustomFieldInput
                        field={field}
                        value={undefined}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                  </div>
                  {field.helpText && (
                    <div className="text-sm text-muted-foreground">
                      💡 {field.helpText}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      {editingField && (
        <Dialog open={!!editingField} onOpenChange={() => setEditingField(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa trường</DialogTitle>
            </DialogHeader>
            <FieldForm
              initialData={editingField}
              onSubmit={(field) => {
                update.mutate({
                  systemId: editingField.systemId,
                  data: field,
                });
                setEditingField(null);
              }}
              onCancel={() => setEditingField(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Field form component
interface FieldFormProps {
  initialData?: Partial<CustomFieldDefinition>;
  onSubmit: (field: Omit<CustomFieldDefinition, 'systemId' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

function FieldForm({ initialData, onSubmit, onCancel }: FieldFormProps) {
  const [formData, setFormData] = useState<Partial<CustomFieldDefinition>>({
    name: '',
    type: 'text',
    required: false,
    isActive: true,
    order: 0,
    category: 'general',
    ...initialData,
  });

  const [options, setOptions] = useState<string>(
    initialData?.options?.map(o => `${o.value}|${o.label}${o.color ? `|${o.color}` : ''}`).join('\n') || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const field: Omit<CustomFieldDefinition, 'systemId' | 'createdAt' | 'updatedAt'> = {
      id: formData.id || formData.name?.toLowerCase().replace(/\s+/g, '_') || '',
      name: formData.name || '',
      type: formData.type || 'text',
      required: formData.required || false,
      isActive: formData.isActive !== false,
      order: formData.order || 0,
      category: formData.category,
      description: formData.description,
      helpText: formData.helpText,
      placeholder: formData.placeholder,
      defaultValue: formData.defaultValue,
      min: formData.min,
      max: formData.max,
      step: formData.step,
      maxLength: formData.maxLength,
      visibleToRoles: formData.visibleToRoles,
      editableByRoles: formData.editableByRoles,
      createdBy: 'CURRENT_USER',
    };

    // Parse options for select/multiselect
    if (field.type === 'select' || field.type === 'multiselect') {
      field.options = options.split('\n').filter(Boolean).map(line => {
        const [value, label, color] = line.split('|');
        return { value: value.trim(), label: label?.trim() || value.trim(), color: color?.trim() };
      });
    }

    onSubmit(field);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tên trường *</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>ID trường *</Label>
          <Input
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            placeholder="Auto-generated from name"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Loại trường *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value as CustomFieldType })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FIELD_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Danh mục</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(FIELD_CATEGORIES).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Mô tả</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Văn bản hướng dẫn</Label>
        <Input
          value={formData.helpText}
          onChange={(e) => setFormData({ ...formData, helpText: e.target.value })}
          placeholder="Hiển thị bên cạnh tên trường"
        />
      </div>

      <div className="space-y-2">
        <Label>Placeholder</Label>
        <Input
          value={formData.placeholder}
          onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
        />
      </div>

      {(formData.type === 'select' || formData.type === 'multiselect') && (
        <div className="space-y-2">
          <Label>Tùy chọn (mỗi dòng một tùy chọn: value|label|color)</Label>
          <Textarea
            value={options}
            onChange={(e) => setOptions(e.target.value)}
            rows={5}
            placeholder="low|Thấp|#10b981&#10;medium|Trung bình|#f59e0b&#10;high|Cao|#ef4444"
          />
          <p className="text-xs text-muted-foreground">
            Ví dụ: low|Thấp|#10b981 (màu tùy chọn)
          </p>
        </div>
      )}

      {(formData.type === 'number' || formData.type === 'currency' || formData.type === 'percentage') && (
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Giá trị tối thiểu</Label>
            <Input
              type="number"
              value={formData.min ?? ''}
              onChange={(e) => setFormData({ ...formData, min: e.target.value ? parseFloat(e.target.value) : undefined })}
            />
          </div>
          <div className="space-y-2">
            <Label>Giá trị tối đa</Label>
            <Input
              type="number"
              value={formData.max ?? ''}
              onChange={(e) => setFormData({ ...formData, max: e.target.value ? parseFloat(e.target.value) : undefined })}
            />
          </div>
          <div className="space-y-2">
            <Label>Bước nhảy</Label>
            <Input
              type="number"
              value={formData.step ?? ''}
              onChange={(e) => setFormData({ ...formData, step: e.target.value ? parseFloat(e.target.value) : undefined })}
            />
          </div>
        </div>
      )}

      {(formData.type === 'text' || formData.type === 'textarea') && (
        <div className="space-y-2">
          <Label>Độ dài tối đa</Label>
          <Input
            type="number"
            value={formData.maxLength ?? ''}
            onChange={(e) => setFormData({ ...formData, maxLength: e.target.value ? parseInt(e.target.value) : undefined })}
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="required"
          checked={formData.required}
          onCheckedChange={(checked) => setFormData({ ...formData, required: !!checked })}
        />
        <Label htmlFor="required" className="font-normal cursor-pointer">
          Trường bắt buộc
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="active"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
        />
        <Label htmlFor="active" className="font-normal cursor-pointer">
          Kích hoạt trường
        </Label>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">
          {initialData?.systemId ? 'Cập nhật' : 'Tạo trường'}
        </Button>
      </DialogFooter>
    </form>
  );
}

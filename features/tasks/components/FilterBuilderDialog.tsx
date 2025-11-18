/**
 * Filter Builder Dialog
 * Visual query builder for creating advanced filter views
 */

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Trash2,
  Copy,
  GripVertical,
  X,
  Save,
  Palette,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SavedView,
  FilterGroup,
  FilterCondition,
  FilterLogic,
  FILTER_FIELD_META,
  FilterOperator,
  FilterField,
} from '../types-filter';
import { toast } from 'sonner';

interface FilterBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  view?: SavedView; // If editing existing view
  onSave: (view: Omit<SavedView, 'id' | 'createdAt' | 'updatedAt'>) => void;
  employees: Array<{ systemId: string; fullName: string }>;
}

// Color options for view customization
const VIEW_COLORS = [
  { value: 'blue', label: 'Xanh dương', class: 'bg-blue-500' },
  { value: 'green', label: 'Xanh lá', class: 'bg-green-500' },
  { value: 'red', label: 'Đỏ', class: 'bg-red-500' },
  { value: 'orange', label: 'Cam', class: 'bg-orange-500' },
  { value: 'purple', label: 'Tím', class: 'bg-purple-500' },
  { value: 'pink', label: 'Hồng', class: 'bg-pink-500' },
  { value: 'yellow', label: 'Vàng', class: 'bg-yellow-500' },
  { value: 'teal', label: 'Xanh ngọc', class: 'bg-teal-500' },
  { value: 'indigo', label: 'Chàm', class: 'bg-indigo-500' },
  { value: 'gray', label: 'Xám', class: 'bg-gray-500' },
];

// Icon options
const VIEW_ICONS = ['⭐', '📌', '🎯', '🔥', '⚡', '💎', '🚀', '📊', '📋', '✅'];

export function FilterBuilderDialog({
  open,
  onOpenChange,
  view,
  onSave,
  employees,
}: FilterBuilderDialogProps) {
  // Form state
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [icon, setIcon] = React.useState('⭐');
  const [color, setColor] = React.useState('blue');
  const [isDefault, setIsDefault] = React.useState(false);
  const [isShared, setIsShared] = React.useState(false);
  const [groupLogic, setGroupLogic] = React.useState<FilterLogic>('AND');
  const [filterGroups, setFilterGroups] = React.useState<FilterGroup[]>([]);

  // Initialize form when view changes
  React.useEffect(() => {
    if (view) {
      setName(view.name);
      setDescription(view.description || '');
      setIcon(view.icon || '⭐');
      setColor(view.color || 'blue');
      setIsDefault(view.isDefault || false);
      setIsShared(view.isShared || false);
      setGroupLogic(view.groupLogic);
      setFilterGroups(view.filterGroups);
    } else {
      // Reset for new view
      setName('');
      setDescription('');
      setIcon('⭐');
      setColor('blue');
      setIsDefault(false);
      setIsShared(false);
      setGroupLogic('AND');
      setFilterGroups([createEmptyGroup()]);
    }
  }, [view, open]);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên view');
      return;
    }

    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

    onSave({
      name: name.trim(),
      description: description.trim(),
      icon,
      color,
      isDefault,
      isShared,
      createdBy: user.username || 'unknown',
      filterGroups: filterGroups.filter(g => g.conditions.length > 0),
      groupLogic,
      sortBy: undefined,
      sortOrder: 'asc',
      viewMode: 'list',
    });

    onOpenChange(false);
  };

  // Group operations
  const addGroup = () => {
    setFilterGroups([...filterGroups, createEmptyGroup()]);
  };

  const removeGroup = (groupId: string) => {
    setFilterGroups(filterGroups.filter(g => g.id !== groupId));
  };

  const updateGroupLogic = (groupId: string, logic: FilterLogic) => {
    setFilterGroups(
      filterGroups.map(g => (g.id === groupId ? { ...g, logic } : g))
    );
  };

  // Condition operations
  const addCondition = (groupId: string) => {
    setFilterGroups(
      filterGroups.map(g =>
        g.id === groupId
          ? { ...g, conditions: [...g.conditions, createEmptyCondition()] }
          : g
      )
    );
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    setFilterGroups(
      filterGroups.map(g =>
        g.id === groupId
          ? { ...g, conditions: g.conditions.filter(c => c.id !== conditionId) }
          : g
      )
    );
  };

  const updateCondition = (
    groupId: string,
    conditionId: string,
    updates: Partial<FilterCondition>
  ) => {
    setFilterGroups(
      filterGroups.map(g =>
        g.id === groupId
          ? {
              ...g,
              conditions: g.conditions.map(c =>
                c.id === conditionId ? { ...c, ...updates } : c
              ),
            }
          : g
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {view ? 'Chỉnh sửa view' : 'Tạo view mới'}
          </DialogTitle>
          <DialogDescription>
            Tạo bộ lọc tùy chỉnh để quản lý công việc hiệu quả hơn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên view *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="VD: Công việc ưu tiên cao"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Select value={icon} onValueChange={setIcon}>
                  <SelectTrigger id="icon">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VIEW_ICONS.map(ico => (
                      <SelectItem key={ico} value={ico}>
                        <span className="text-lg">{ico}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Mô tả ngắn về view này..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Màu sắc</Label>
              <div className="flex flex-wrap gap-2">
                {VIEW_COLORS.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setColor(c.value)}
                    className={cn(
                      'h-8 w-8 rounded-full transition-all',
                      c.class,
                      color === c.value && 'ring-2 ring-offset-2 ring-primary'
                    )}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="default"
                  checked={isDefault}
                  onCheckedChange={setIsDefault}
                />
                <Label htmlFor="default" className="cursor-pointer">
                  Đặt làm view mặc định
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="shared"
                  checked={isShared}
                  onCheckedChange={setIsShared}
                />
                <Label htmlFor="shared" className="cursor-pointer">
                  Chia sẻ với team
                </Label>
              </div>
            </div>
          </div>

          {/* Filter Groups */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Điều kiện lọc</Label>
              {filterGroups.length > 1 && (
                <Select
                  value={groupLogic}
                  onValueChange={v => setGroupLogic(v as FilterLogic)}
                >
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">Phải thỏa TẤT CẢ</SelectItem>
                    <SelectItem value="OR">Thỏa MỘT trong các</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {filterGroups.map((group, groupIndex) => (
              <FilterGroupBuilder
                key={group.id}
                group={group}
                groupIndex={groupIndex}
                onRemove={() => removeGroup(group.id)}
                onUpdateLogic={logic => updateGroupLogic(group.id, logic)}
                onAddCondition={() => addCondition(group.id)}
                onRemoveCondition={conditionId =>
                  removeCondition(group.id, conditionId)
                }
                onUpdateCondition={(conditionId, updates) =>
                  updateCondition(group.id, conditionId, updates)
                }
                employees={employees}
                canRemoveGroup={filterGroups.length > 1}
              />
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={addGroup}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm nhóm điều kiện
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Lưu view
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Filter Group Builder Component
 */
interface FilterGroupBuilderProps {
  group: FilterGroup;
  groupIndex: number;
  onRemove: () => void;
  onUpdateLogic: (logic: FilterLogic) => void;
  onAddCondition: () => void;
  onRemoveCondition: (conditionId: string) => void;
  onUpdateCondition: (conditionId: string, updates: Partial<FilterCondition>) => void;
  employees: Array<{ systemId: string; fullName: string }>;
  canRemoveGroup: boolean;
}

function FilterGroupBuilder({
  group,
  groupIndex,
  onRemove,
  onUpdateLogic,
  onAddCondition,
  onRemoveCondition,
  onUpdateCondition,
  employees,
  canRemoveGroup,
}: FilterGroupBuilderProps) {
  return (
    <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
      <div className="flex items-center justify-between">
        <Badge variant="outline">Nhóm {groupIndex + 1}</Badge>
        <div className="flex items-center gap-2">
          {group.conditions.length > 1 && (
            <Select value={group.logic} onValueChange={v => onUpdateLogic(v as FilterLogic)}>
              <SelectTrigger className="w-[100px] h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">VÀ</SelectItem>
                <SelectItem value="OR">HOẶC</SelectItem>
              </SelectContent>
            </Select>
          )}
          {canRemoveGroup && (
            <Button variant="ghost" size="sm" onClick={onRemove} className="h-7 w-7 p-0">
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {group.conditions.map((condition, index) => (
        <ConditionBuilder
          key={condition.id}
          condition={condition}
          conditionIndex={index}
          onRemove={() => onRemoveCondition(condition.id)}
          onUpdate={updates => onUpdateCondition(condition.id, updates)}
          employees={employees}
          canRemove={group.conditions.length > 1}
        />
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={onAddCondition}
        className="w-full h-8"
      >
        <Plus className="mr-2 h-3 w-3" />
        Thêm điều kiện
      </Button>
    </div>
  );
}

/**
 * Condition Builder Component
 */
interface ConditionBuilderProps {
  condition: FilterCondition;
  conditionIndex: number;
  onRemove: () => void;
  onUpdate: (updates: Partial<FilterCondition>) => void;
  employees: Array<{ systemId: string; fullName: string }>;
  canRemove: boolean;
}

function ConditionBuilder({
  condition,
  conditionIndex,
  onRemove,
  onUpdate,
  employees,
  canRemove,
}: ConditionBuilderProps) {
  const fieldMeta = FILTER_FIELD_META.find(f => f.field === condition.field);
  const needsValue = !['is_empty', 'is_not_empty'].includes(condition.operator);

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="text-xs">
        {conditionIndex + 1}
      </Badge>

      {/* Field Selection */}
      <Select
        value={condition.field}
        onValueChange={v => onUpdate({ field: v as FilterField, operator: 'equals', value: '' })}
      >
        <SelectTrigger className="w-[180px] h-8 text-xs">
          <SelectValue placeholder="Chọn trường" />
        </SelectTrigger>
        <SelectContent>
          {FILTER_FIELD_META.map(f => (
            <SelectItem key={f.field} value={f.field}>
              {f.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Operator Selection */}
      {fieldMeta && (
        <Select
          value={condition.operator}
          onValueChange={v => onUpdate({ operator: v as FilterOperator })}
        >
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fieldMeta.operators.map(op => (
              <SelectItem key={op} value={op}>
                {getOperatorLabel(op)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Value Input */}
      {needsValue && fieldMeta && (
        <ValueInput
          fieldMeta={fieldMeta}
          value={condition.value}
          onChange={v => onUpdate({ value: v })}
          employees={employees}
        />
      )}

      {canRemove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-8 w-8 p-0 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

/**
 * Value Input Component
 */
function ValueInput({
  fieldMeta,
  value,
  onChange,
  employees,
}: {
  fieldMeta: any;
  value: any;
  onChange: (value: any) => void;
  employees: Array<{ systemId: string; fullName: string }>;
}) {
  if (fieldMeta.type === 'select' && fieldMeta.options) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="flex-1 h-8 text-xs">
          <SelectValue placeholder="Chọn giá trị" />
        </SelectTrigger>
        <SelectContent>
          {fieldMeta.options.map((opt: any) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (fieldMeta.field === 'assigneeId') {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="flex-1 h-8 text-xs">
          <SelectValue placeholder="Chọn người" />
        </SelectTrigger>
        <SelectContent>
          {employees.map(emp => (
            <SelectItem key={emp.systemId} value={emp.systemId}>
              {emp.fullName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (fieldMeta.type === 'date') {
    return (
      <Input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 h-8 text-xs"
      />
    );
  }

  if (fieldMeta.type === 'number') {
    return (
      <Input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-8 text-xs"
        placeholder="0"
      />
    );
  }

  return (
    <Input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="flex-1 h-8 text-xs"
      placeholder="Nhập giá trị..."
    />
  );
}

/**
 * Helper functions
 */
function createEmptyGroup(): FilterGroup {
  return {
    id: `group_${Date.now()}`,
    logic: 'AND',
    conditions: [createEmptyCondition()],
  };
}

function createEmptyCondition(): FilterCondition {
  return {
    id: `condition_${Date.now()}_${Math.random()}`,
    field: 'status',
    operator: 'equals',
    value: '',
  };
}

function getOperatorLabel(operator: FilterOperator): string {
  const labels: Record<FilterOperator, string> = {
    equals: 'Bằng',
    not_equals: 'Không bằng',
    contains: 'Chứa',
    not_contains: 'Không chứa',
    in: 'Trong danh sách',
    not_in: 'Không trong danh sách',
    greater_than: 'Lớn hơn',
    less_than: 'Nhỏ hơn',
    is_empty: 'Trống',
    is_not_empty: 'Không trống',
    before: 'Trước',
    after: 'Sau',
    between: 'Trong khoảng',
  };
  return labels[operator] || operator;
}

import * as React from 'react';
import { Star, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import type { PayrollTemplate } from '../../lib/payroll-types';
import type { SystemId } from '../../lib/id-types';
import { formatDateForDisplay } from '@/lib/date-utils';

interface TemplateCardProps {
  template: PayrollTemplate;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onEdit: (systemId: SystemId) => void;
  onDelete: (systemId: SystemId) => void;
  onSetDefault: (systemId: SystemId) => void;
}

export function TemplateCard({
  template,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
}: TemplateCardProps) {
  return (
    <Card className={`transition-colors ${isSelected ? 'border-primary bg-primary/5' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            className="mt-1 h-4 w-4"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-body-xs text-muted-foreground">
                {template.id}
              </span>
              {template.isDefault && (
                <Badge variant="success" className="gap-1 text-xs">
                  <Star className="h-3 w-3" /> Mặc định
                </Badge>
              )}
            </div>
            <h3 className="font-medium text-body-sm truncate">{template.name}</h3>
            {template.description && (
              <p className="text-body-xs text-muted-foreground line-clamp-2 mt-1">
                {template.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-3 text-body-xs text-muted-foreground">
              <span>{template.componentSystemIds.length} thành phần</span>
              {template.createdAt && (
                <span>Tạo: {formatDateForDisplay(template.createdAt)}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 pt-3 border-t">
          {!template.isDefault && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 flex-1 text-body-xs"
              onClick={() => onSetDefault(template.systemId)}
            >
              <Star className="mr-1 h-3.5 w-3.5" />
              Đặt mặc định
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-8 flex-1"
            onClick={() => onEdit(template.systemId)}
          >
            <Pencil className="mr-1 h-3.5 w-3.5" />
            Sửa
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-red-500 hover:text-red-500"
            onClick={() => onDelete(template.systemId)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

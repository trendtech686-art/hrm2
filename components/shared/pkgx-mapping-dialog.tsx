import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VirtualizedCombobox, type ComboboxOption } from '@/components/ui/virtualized-combobox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link, AlertCircle, Lightbulb, AlertTriangle, Loader2 } from 'lucide-react';

// ========================================
// Types
// ========================================

export type MappingEntityType = 'product' | 'brand' | 'category';

export interface MappingItem {
  id: string;
  name: string;
  subText?: string; // e.g., SKU, ID display
}

export interface MappingSuggestion {
  item: MappingItem;
  score: number;
  matchType?: 'exact' | 'sku' | 'name';
}

export interface MappingValidationError {
  field?: string;
  message: string;
  details?: Record<string, any>;
}

export interface MappingValidationWarning {
  field?: string;
  message: string;
  details?: Record<string, any>;
}

export interface MappingValidation {
  isValid: boolean;
  errors: MappingValidationError[];
  warnings: MappingValidationWarning[];
}

export interface PkgxMappingDialogProps {
  // Dialog state
  open: boolean;
  onOpenChange: (open: boolean) => void;
  
  // Entity type
  type: MappingEntityType;
  
  // For editing existing mapping
  isEditing?: boolean;
  
  // HRM items (source - to select from)
  hrmItems: MappingItem[];
  selectedHrmId: string;
  onSelectHrmId: (id: string) => void;
  
  // PKGX items (target - to select from)
  pkgxItems: MappingItem[];
  selectedPkgxId: string;
  onSelectPkgxId: (id: string) => void;
  
  // Suggestions for PKGX (based on selected HRM)
  pkgxSuggestions?: MappingSuggestion[];
  
  // Validation
  validation?: MappingValidation | null;
  hasErrors?: boolean;
  isValidating?: boolean;
  
  // Warning confirm state (need to click confirm twice if has warnings)
  showWarningConfirm?: boolean;
  
  // Actions
  onConfirm: () => void;
  onCancel: () => void;
  
  // Loading state
  isLoading?: boolean;
}

// ========================================
// Entity Labels (Vietnamese)
// ========================================

const ENTITY_LABELS: Record<MappingEntityType, {
  title: string;
  titleEdit: string;
  description: string;
  hrmLabel: string;
  pkgxLabel: string;
  hrmPlaceholder: string;
  pkgxPlaceholder: string;
  confirmTextAdd: string;
  confirmTextUpdate: string;
}> = {
  product: {
    title: 'Thêm liên kết sản phẩm',
    titleEdit: 'Sửa liên kết sản phẩm',
    description: 'Chọn sản phẩm HRM và sản phẩm PKGX tương ứng',
    hrmLabel: 'Sản phẩm HRM',
    pkgxLabel: 'Sản phẩm PKGX',
    hrmPlaceholder: 'Chọn sản phẩm HRM...',
    pkgxPlaceholder: 'Chọn sản phẩm PKGX...',
    confirmTextAdd: 'Thêm',
    confirmTextUpdate: 'Cập nhật',
  },
  brand: {
    title: 'Thêm mapping thương hiệu',
    titleEdit: 'Sửa mapping thương hiệu',
    description: 'Chọn thương hiệu HRM và thương hiệu PKGX tương ứng',
    hrmLabel: 'Thương hiệu HRM',
    pkgxLabel: 'Thương hiệu PKGX',
    hrmPlaceholder: 'Chọn thương hiệu HRM...',
    pkgxPlaceholder: 'Chọn thương hiệu PKGX...',
    confirmTextAdd: 'Thêm',
    confirmTextUpdate: 'Cập nhật',
  },
  category: {
    title: 'Thêm mapping danh mục',
    titleEdit: 'Sửa mapping danh mục',
    description: 'Chọn danh mục HRM và danh mục PKGX tương ứng',
    hrmLabel: 'Danh mục HRM',
    pkgxLabel: 'Danh mục PKGX',
    hrmPlaceholder: 'Chọn danh mục HRM...',
    pkgxPlaceholder: 'Chọn danh mục PKGX...',
    confirmTextAdd: 'Thêm',
    confirmTextUpdate: 'Cập nhật',
  },
};

// ========================================
// Component
// ========================================

export function PkgxMappingDialog({
  open,
  onOpenChange,
  type,
  isEditing = false,
  hrmItems,
  selectedHrmId,
  onSelectHrmId,
  pkgxItems,
  selectedPkgxId,
  onSelectPkgxId,
  pkgxSuggestions = [],
  validation,
  hasErrors = false,
  isValidating = false,
  showWarningConfirm = false,
  onConfirm,
  onCancel,
  isLoading = false,
}: PkgxMappingDialogProps) {
  const labels = ENTITY_LABELS[type];
  
  // Determine title and confirm text
  const title = isEditing ? labels.titleEdit : labels.title;
  const confirmText = isEditing ? labels.confirmTextUpdate : labels.confirmTextAdd;
  const confirmTextWithWarning = `Xác nhận ${confirmText.toLowerCase()}`;
  
  // Get field error from validation
  const getFieldError = (field: string): string | undefined => {
    if (!validation) return undefined;
    const error = validation.errors.find(e => e.field === field);
    return error?.message;
  };
  
  // Field names vary by entity type
  const hrmFieldName = type === 'product' ? 'hrmProductSystemId' : 
                       type === 'brand' ? 'hrmBrandSystemId' : 'hrmCategorySystemId';
  const pkgxFieldName = type === 'product' ? 'pkgxProductId' : 
                        type === 'brand' ? 'pkgxBrandId' : 'pkgxCategoryId';

  // Convert MappingItem[] to ComboboxOption[]
  const hrmOptions: ComboboxOption[] = React.useMemo(() => 
    hrmItems.map((item) => ({
      value: item.id,
      label: item.name,
      subtitle: item.subText,
    })), [hrmItems]);
  
  const pkgxOptions: ComboboxOption[] = React.useMemo(() => 
    pkgxItems.map((item) => ({
      value: item.id,
      label: item.name,
      subtitle: item.subText,
    })), [pkgxItems]);
  
  // Get selected option objects
  const selectedHrmOption = hrmOptions.find(o => o.value === selectedHrmId) || null;
  const selectedPkgxOption = pkgxOptions.find(o => o.value === selectedPkgxId) || null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* HRM Select - Using VirtualizedCombobox for better UX with many items */}
          <div className="space-y-2">
            <Label>{labels.hrmLabel}</Label>
            <VirtualizedCombobox
              value={selectedHrmOption}
              onChange={(option) => onSelectHrmId(option?.value || '')}
              options={hrmOptions}
              placeholder={labels.hrmPlaceholder}
              searchPlaceholder="Tìm kiếm..."
              emptyPlaceholder="Không tìm thấy kết quả"
            />
            {getFieldError(hrmFieldName) && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {getFieldError(hrmFieldName)}
              </p>
            )}
          </div>
          
          {/* PKGX Select - Using VirtualizedCombobox for better UX with many items */}
          <div className="space-y-2">
            <Label>{labels.pkgxLabel}</Label>
            <VirtualizedCombobox
              value={selectedPkgxOption}
              onChange={(option) => onSelectPkgxId(option?.value || '')}
              options={pkgxOptions}
              placeholder={labels.pkgxPlaceholder}
              searchPlaceholder="Tìm kiếm..."
              emptyPlaceholder="Không tìm thấy kết quả"
            />
            {getFieldError(pkgxFieldName) && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {getFieldError(pkgxFieldName)}
              </p>
            )}
          </div>
          
          {/* PKGX Suggestions */}
          {pkgxSuggestions.length > 0 && selectedHrmId && !selectedPkgxId && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground flex items-center gap-1">
                <Lightbulb className="h-3 w-3" />
                Gợi ý {labels.pkgxLabel.toLowerCase()} phù hợp:
              </Label>
              <div className="flex flex-wrap gap-2">
                {pkgxSuggestions.slice(0, 3).map((s) => (
                  <Button
                    key={s.item.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => onSelectPkgxId(s.item.id)}
                  >
                    {s.item.name}
                    <Badge 
                      variant={s.matchType === 'exact' ? 'default' : 'secondary'} 
                      className="ml-1 text-xs"
                    >
                      {s.matchType === 'exact' ? 'Trùng tên' : Math.round(s.score * 100) + '%'}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Validation Errors */}
          {validation && validation.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lỗi validation</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {validation.errors.map((err, i) => (
                    <li key={i}>{err.message}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Validation Warnings */}
          {validation && validation.warnings.length > 0 && validation.errors.length === 0 && (
            <Alert variant="default" className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-700 dark:text-yellow-400">Cảnh báo</AlertTitle>
              <AlertDescription className="text-yellow-600 dark:text-yellow-300">
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {validation.warnings.map((w, i) => (
                    <li key={i}>
                      {w.message}
                      {/* Show suggestion button for suggestedBrand/suggestedCategory */}
                      {w.details?.suggestedBrand && (
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          className="h-auto p-0 ml-1 text-yellow-700"
                          onClick={() => onSelectPkgxId(w.details!.suggestedBrand.id.toString())}
                        >
                          → Chọn "{w.details.suggestedBrand.name}"
                        </Button>
                      )}
                      {w.details?.suggestedCategory && (
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          className="h-auto p-0 ml-1 text-yellow-700"
                          onClick={() => onSelectPkgxId(w.details!.suggestedCategory.id.toString())}
                        >
                          → Chọn "{w.details.suggestedCategory.name}"
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
                {showWarningConfirm && (
                  <p className="mt-3 font-medium">Bấm "{confirmTextWithWarning}" lần nữa để xác nhận.</p>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isLoading || isValidating}>
            Hủy
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={hasErrors || isLoading || isValidating}
          >
            {(isLoading || isValidating) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {!isLoading && !isValidating && <Link className="h-4 w-4 mr-2" />}
            {showWarningConfirm ? confirmTextWithWarning : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PkgxMappingDialog;

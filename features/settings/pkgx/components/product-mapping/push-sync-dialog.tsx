'use client';

import * as React from 'react';
import { Button } from '../../../../../components/ui/button';
import { Label } from '../../../../../components/ui/label';
import { Switch } from '../../../../../components/ui/switch';
import { ScrollArea } from '../../../../../components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../../../components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../../components/ui/tooltip';
import { Upload, ArrowRight, Settings2, Loader2 } from 'lucide-react';
import { PUSH_SYNC_FIELDS, type PushSyncFieldKey, type PkgxProductRow } from './types';

// ========================================
// Push Sync Dialog Component
// ========================================

export interface PushSyncDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: PkgxProductRow | null;
  selectedFields: PushSyncFieldKey[];
  isPushing: boolean;
  onToggleField: (field: PushSyncFieldKey) => void;
  onSelectAll: () => void;
  onPush: () => void;
}

export function PushSyncDialog({
  open,
  onOpenChange,
  product,
  selectedFields,
  isPushing,
  onToggleField,
  onSelectAll,
  onPush,
}: PushSyncDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-600" />
            Đẩy dữ liệu từ HRM → PKGX
          </DialogTitle>
          <DialogDescription>
            Chọn các trường cần đẩy từ HRM lên cập nhật PKGX
          </DialogDescription>
        </DialogHeader>
        
        {product && (
          <div className="space-y-4 py-4">
            {/* Product info */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex-1">
                <div className="text-sm font-medium text-green-600">HRM (Nguồn)</div>
                <div className="text-sm truncate">{product.linkedHrmProduct?.name}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-green-600 shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-muted-foreground">PKGX (Đích)</div>
                <div className="text-sm truncate">{product.goods_name}</div>
              </div>
            </div>
            
            {/* Field selection - Flat grid with tooltip and validation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Chọn trường cần đẩy lên:</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSelectAll}
                  className="text-xs h-7"
                >
                  {selectedFields.length === PUSH_SYNC_FIELDS.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </Button>
              </div>
              
              <ScrollArea className="h-[350px] pr-4">
                <TooltipProvider delayDuration={200}>
                  <div className="grid grid-cols-4 gap-2">
                    {PUSH_SYNC_FIELDS.map((field) => {
                      // Check if this is a special field (sync_prices)
                      const isSpecialField = 'isSpecial' in field && field.isSpecial === true;
                      
                      // Get HRM value for this field
                      const hrmValue = isSpecialField 
                        ? 'Sử dụng cấu hình từ tab Mapping giá'
                        : product.linkedHrmProduct?.[field.hrmField as keyof typeof product.linkedHrmProduct];
                      const hasValue = isSpecialField || (hrmValue !== undefined && hrmValue !== null && hrmValue !== '');
                      
                      // Format display value
                      const displayValue = (() => {
                        if (isSpecialField) return 'Theo cấu hình Mapping giá';
                        if (!hasValue) return 'Chưa có dữ liệu';
                        if (typeof hrmValue === 'boolean') return hrmValue ? 'Có' : 'Không';
                        if (typeof hrmValue === 'number') {
                          return hrmValue.toLocaleString('vi-VN');
                        }
                        if (typeof hrmValue === 'string') {
                          return hrmValue.length > 50 ? hrmValue.substring(0, 50) + '...' : hrmValue;
                        }
                        return String(hrmValue);
                      })();
                      
                      return (
                        <Tooltip key={field.key}>
                          <TooltipTrigger asChild>
                            <div 
                              className={`flex items-center justify-between p-2 rounded border hover:bg-muted/50 ${
                                isSpecialField ? 'col-span-2 bg-blue-50 border-blue-200' :
                                !hasValue ? 'border-dashed opacity-60' : ''
                              }`}
                            >
                              <div className="flex items-center gap-1 min-w-0 flex-1">
                                <span className="text-xs truncate">{field.label}</span>
                                {isSpecialField && <Settings2 className="h-3 w-3 text-blue-500 shrink-0" />}
                              </div>
                              <Switch 
                                checked={selectedFields.includes(field.key)} 
                                onCheckedChange={() => onToggleField(field.key)} 
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <div className="text-xs space-y-1">
                              <div className="font-medium">{field.label}</div>
                              {isSpecialField ? (
                                <div className="text-blue-600">
                                  Giá sẽ được đồng bộ theo cấu hình trong tab "Mapping giá"
                                  <br />
                                  (shop_price, market_price, partner_price, ace_price, deal_price)
                                </div>
                              ) : (
                                <div className="text-muted-foreground">
                                  HRM ({field.hrmField}): <span className={hasValue ? 'text-green-600' : 'text-orange-500'}>{displayValue}</span>
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </TooltipProvider>
              </ScrollArea>
            </div>
            
            {/* Selected count */}
            <div className="text-sm text-muted-foreground text-center">
              Đã chọn {selectedFields.length} / {PUSH_SYNC_FIELDS.length} trường
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button 
            onClick={onPush} 
            disabled={selectedFields.length === 0 || isPushing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isPushing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Đẩy lên PKGX ({selectedFields.length} trường)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

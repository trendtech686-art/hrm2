/**
 * Address Conversion Dialog
 * 
 * Dialog chuyển đổi địa chỉ 2 cấp → 3 cấp
 * Hiển thị danh sách gợi ý District+Ward để user chọn
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { findMatchingWards, formatSuggestion, type WardSuggestion } from '../utils/address-conversion-helper';
import type { EnhancedCustomerAddress } from '../types/enhanced-address';

type AddressConversionDialogProps = {
  address: EnhancedCustomerAddress; // Địa chỉ 2 cấp cần convert
  onSuccess: (updatedAddress: EnhancedCustomerAddress) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function AddressConversionDialog({
  address,
  onSuccess,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AddressConversionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<WardSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<WardSuggestion | null>(null);
  const [loading, setLoading] = useState(false);

  // Use controlled or uncontrolled mode
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  // Load suggestions khi mở dialog
  useEffect(() => {
    if (open) {
      setLoading(true);
      
      // Tìm gợi ý dựa trên province + ward hiện tại
      const results = findMatchingWards(address.provinceId, address.ward);
      
      setSuggestions(results);
      setLoading(false);
      
      // Auto-select first suggestion nếu có
      if (results.length > 0) {
        setSelectedSuggestion(results[0]);
      }
    }
  }, [open, address.provinceId, address.ward]);

  const handleConvert = () => {
    if (!selectedSuggestion) {
      toast.error('Vui lòng chọn một địa chỉ');
      return;
    }

    // Tạo địa chỉ 3 cấp mới
    const updatedAddress: EnhancedCustomerAddress = {
      ...address,
      inputLevel: '3-level',
      autoFilled: false, // User chọn
      convertedAt: new Date().toISOString(),
      
      // Update district info
      district: selectedSuggestion.district.name,
      districtId: selectedSuggestion.district.id,
      
      // Update ward info (có thể khác với ward cũ)
      ward: selectedSuggestion.ward.name,
      wardId: selectedSuggestion.ward.id,
      
      updatedAt: new Date().toISOString(),
    };

    toast.success('Địa chỉ đã được chuyển đổi sang 3 cấp!');
    onSuccess(updatedAddress);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Chuyển đổi địa chỉ
          </DialogTitle>
          <DialogDescription>
            Chọn Quận/Huyện và Phường/Xã chính xác để hoàn thiện địa chỉ 3 cấp
          </DialogDescription>
        </DialogHeader>

        {/* Địa chỉ hiện tại (2 cấp) */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-semibold">Địa chỉ hiện tại (2 cấp)</Label>
            <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg space-y-1">
              <div className="text-sm">
                <strong>Tỉnh/Thành phố:</strong> {address.province}
              </div>
              <div className="text-sm">
                <strong>Phường/Xã:</strong> {address.ward}
              </div>
              <div className="text-sm">
                <strong>Địa chỉ chi tiết:</strong> {address.street}
              </div>
              <div className="text-xs text-orange-700 mt-2">
                ⚠️ Thiếu Quận/Huyện - Cần bổ sung để gửi API vận chuyển
              </div>
            </div>
          </div>

          {/* Danh sách gợi ý */}
          <div>
            <Label className="text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Địa chỉ bạn nhập tương ứng với địa chỉ nào sau đây?
            </Label>
            
            {loading ? (
              <div className="mt-2 p-4 text-center text-muted-foreground">
                Đang tìm kiếm...
              </div>
            ) : suggestions.length === 0 ? (
              <Alert className="mt-2 border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700">
                  Không tìm thấy gợi ý phù hợp. Vui lòng kiểm tra lại tên Phường/Xã.
                </AlertDescription>
              </Alert>
            ) : (
              <RadioGroup
                value={selectedSuggestion?.ward.id}
                onValueChange={(value) => {
                  const suggestion = suggestions.find(s => s.ward.id === value);
                  setSelectedSuggestion(suggestion || null);
                }}
                className="mt-2 space-y-2 max-h-[400px] overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={`${suggestion.ward.id}-${index}`}
                    className="flex items-start space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer"
                  >
                    <RadioGroupItem
                      value={suggestion.ward.id}
                      id={`suggestion-${suggestion.ward.id}-${index}`}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={`suggestion-${suggestion.ward.id}-${index}`}
                      className="cursor-pointer flex-1"
                    >
                      <div className="text-sm">
                        {address.street}, {formatSuggestion(suggestion)}, {address.province}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Match: {suggestion.matchScore}%
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleConvert}
            disabled={!selectedSuggestion || suggestions.length === 0}
          >
            Áp dụng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Address Migration Component
 * 
 * Chuyển đổi địa chỉ cũ (chỉ có 2 cấp, thiếu district) sang format mới
 * Hiển thị nút "Cập nhật địa chỉ" cho dữ liệu legacy
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { convertLegacyAddress } from '../utils/enhanced-address-helper';
import { getDistrictByWardId } from '@/features/provinces/ward-district-mapping';
import { RefreshCw, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

type LegacyAddress = {
  id?: string;
  label?: string;
  street: string;
  ward?: string;
  district?: string;
  province?: string;
  contactName?: string;
  contactPhone?: string;
};

type AddressMigrationDialogProps = {
  legacyAddress: LegacyAddress;
  provinceId: string;
  wardId: string;
  onSuccess: (convertedAddress: any) => void;
};

export function AddressMigrationDialog({
  legacyAddress,
  provinceId,
  wardId,
  onSuccess,
}: AddressMigrationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');

  // Preview district sẽ được điền
  const districtPreview = getDistrictByWardId(wardId);

  const handleConvert = () => {
    setIsConverting(true);
    setError('');

    try {
      const result = convertLegacyAddress(legacyAddress, provinceId, wardId);

      if (!result.success) {
        setError(result.error || 'Có lỗi xảy ra');
        setIsConverting(false);
        return;
      }

      // Success
      onSuccess(result.address);
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Cập nhật địa chỉ 3 cấp
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cập nhật địa chỉ sang định dạng mới</DialogTitle>
          <DialogDescription>
            Hệ thống sẽ tự động điền thông tin Quận/Huyện để đảm bảo tương thích với API vận chuyển
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Address */}
          <div className="space-y-2">
            <div className="font-medium text-sm flex items-center gap-2">
              <Badge variant="secondary">Hiện tại</Badge>
              Địa chỉ đang lưu
            </div>
            <div className="bg-muted p-4 rounded-lg text-sm space-y-1">
              <div>{legacyAddress.street}</div>
              {legacyAddress.ward && <div>Phường/Xã: {legacyAddress.ward}</div>}
              {legacyAddress.district && <div>Quận/Huyện: {legacyAddress.district}</div>}
              {legacyAddress.province && <div>Tỉnh/TP: {legacyAddress.province}</div>}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* New Address Preview */}
          <div className="space-y-2">
            <div className="font-medium text-sm flex items-center gap-2">
              <Badge variant="default">Sau khi cập nhật</Badge>
              Địa chỉ mới (đầy đủ 3 cấp)
            </div>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-sm space-y-1">
              <div>{legacyAddress.street}</div>
              <div>Phường/Xã: {legacyAddress.ward}</div>
              <div className="flex items-center gap-2 text-green-700 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                Quận/Huyện: {districtPreview?.districtName || '(Tự động điền)'}
                <Badge variant="secondary" className="text-xs">TỰ ĐỘNG</Badge>
              </div>
              <div>Tỉnh/TP: {legacyAddress.province}</div>
            </div>
          </div>

          {/* Info */}
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-1">Lợi ích khi cập nhật:</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Tương thích với API vận chuyển (GHN, GHTK, VTP, J&T)</li>
                <li>Tính phí giao hàng chính xác hơn</li>
                <li>Tạo đơn vận chuyển tự động không lỗi</li>
                <li>Dữ liệu đầy đủ, chuẩn hóa theo quy định mới</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleConvert} disabled={isConverting}>
            {isConverting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Xác nhận cập nhật
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Badge hiển thị trạng thái địa chỉ cần migrate
 */
export function AddressNeedsMigrationBadge({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <Badge variant="outline" className="gap-1 border-orange-300 text-orange-700 bg-orange-50">
      <AlertCircle className="h-3 w-3" />
      Cần cập nhật
    </Badge>
  );
}

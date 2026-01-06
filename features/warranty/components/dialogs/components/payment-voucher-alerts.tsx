'use client'

import * as React from 'react';
import { Alert, AlertDescription } from '../../../../../components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface WarrantyInfoAlertProps {
  warrantyId: string;
  customer: {
    name: string;
    phone: string;
  };
  actualRemainingAmount: number;
}

/**
 * Alert hiển thị thông tin warranty
 */
export function WarrantyInfoAlert({
  warrantyId,
  customer,
  actualRemainingAmount,
}: WarrantyInfoAlertProps) {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">Phiếu bảo hành:</span>
          <span className="font-mono">{warrantyId}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Khách hàng:</span>
          <span>{customer.name} • {customer.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Cần bù trừ:</span>
          <span className="font-semibold text-red-600">
            {actualRemainingAmount.toLocaleString('vi-VN')} đ
          </span>
        </div>
      </AlertDescription>
    </Alert>
  );
}

interface MissingConfigAlertProps {
  warrantyRefundType: unknown;
  warrantyOrderDeductionType: unknown;
}

/**
 * Alert cảnh báo thiếu cấu hình loại phiếu chi
 */
export function MissingConfigAlert({
  warrantyRefundType,
  warrantyOrderDeductionType,
}: MissingConfigAlertProps) {
  if (warrantyRefundType && warrantyOrderDeductionType) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <strong>Thiếu cấu hình:</strong> Không tìm thấy loại phiếu chi phù hợp trong cài đặt.
        Vui lòng vào <strong>Cài đặt {'>'} Loại phiếu chi</strong> để kiểm tra các loại:
        <ul className="mt-2 ml-4 list-disc text-sm">
          {!warrantyRefundType && <li><strong>HOANTIEN_BH</strong> - Hoàn tiền bảo hành</li>}
          {!warrantyOrderDeductionType && <li><strong>TRAVAO_DONHANG</strong> - Trả bảo hành vào đơn hàng</li>}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

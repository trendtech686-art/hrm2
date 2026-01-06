'use client';

/**
 * Loading, Error, and Not Found states for warranty tracking page
 */
import * as React from 'react';
import { Clock, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrackingStateProps {
  trackingCode?: string;
}

/**
 * Tracking disabled state
 */
export function TrackingDisabledState() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <AlertCircle className="h-5 w-5" />
            Tính năng tạm thời không khả dụng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Tính năng theo dõi công khai hiện đang tắt. Vui lòng liên hệ bộ phận hỗ trợ để được hỗ trợ.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Loading state
 */
export function TrackingLoadingState() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary animate-spin" />
            Đang tải dữ liệu bảo hành...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-body-sm text-muted-foreground">
            Vui lòng chờ trong giây lát.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Unknown error state
 */
export function TrackingErrorState() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Không thể tải dữ liệu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Đã xảy ra lỗi khi tải thông tin phiếu bảo hành. Vui lòng thử lại sau.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Not found state
 */
export function TrackingNotFoundState({ trackingCode }: TrackingStateProps) {
  const isMissingCode = !trackingCode;
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            {isMissingCode ? 'Thiếu mã tra cứu' : 'Không tìm thấy phiếu bảo hành'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isMissingCode
              ? 'Vui lòng kiểm tra lại đường dẫn tra cứu bảo hành.'
              : 'Phiếu bảo hành không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại mã phiếu.'}
          </p>
          {!isMissingCode && trackingCode && (
            <p className="text-body-sm text-muted-foreground mt-4">
              Mã phiếu: <span className="font-mono font-semibold">{trackingCode}</span>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

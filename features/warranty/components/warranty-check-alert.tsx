import * as React from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '../../../components/ui/alert.tsx';
import { Badge } from '../../../components/ui/badge.tsx';
import { Button } from '../../../components/ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog.tsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table.tsx';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import type { WarrantyCheckResult, ProductWarrantyInfo } from '../utils/warranty-checker.ts';
import { getWarrantyStatusBadge } from '../utils/warranty-checker.ts';
import { formatDate } from '../../../lib/date-utils.ts';

interface WarrantyCheckAlertProps {
  result: WarrantyCheckResult;
  productName: string;
  requestedQuantity: number;
}

/**
 * Component hiển thị cảnh báo kiểm tra bảo hành
 * - Hiển thị warnings nếu có
 * - Link xem chi tiết lịch sử mua hàng
 */
export function WarrantyCheckAlert({
  result,
  productName,
  requestedQuantity,
}: WarrantyCheckAlertProps) {
  if (result.warnings.length === 0) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-900">Sản phẩm hợp lệ</AlertTitle>
        <AlertDescription className="text-green-800">
          Tất cả {requestedQuantity} sản phẩm đều còn trong thời hạn bảo hành.
        </AlertDescription>
      </Alert>
    );
  }

  // Xác định mức độ nghiêm trọng
  const severity = result.isValid ? 'warning' : 'error';
  const Icon = severity === 'error' ? AlertCircle : AlertTriangle;
  const colorClass = severity === 'error' 
    ? 'border-red-200 bg-red-50' 
    : 'border-yellow-200 bg-yellow-50';
  const iconColorClass = severity === 'error' ? 'text-red-600' : 'text-yellow-600';
  const titleColorClass = severity === 'error' ? 'text-red-900' : 'text-yellow-900';
  const textColorClass = severity === 'error' ? 'text-red-800' : 'text-yellow-800';

  return (
    <Alert className={colorClass + " py-2"}>
      <Icon className={`h-3 w-3 ${iconColorClass}`} />
      <AlertTitle className={titleColorClass + " text-xs font-medium"}>Cảnh báo bảo hành</AlertTitle>
      <AlertDescription className={`${textColorClass} space-y-1`}>
        {/* Warnings list */}
        <div className="space-y-0.5">
          {result.warnings.map((warning, index) => (
            <p key={index} className="text-xs">
              {warning}
            </p>
          ))}
        </div>

        {/* Summary */}
        {result.productHistory.length > 0 && (
          <div className="mt-1 text-[10px] space-y-0.5">
            <p>
              <strong>Tổng mua:</strong> {result.totalPurchased} | <strong>Còn BH:</strong> {result.totalStillUnderWarranty} | <strong>Hết hạn:</strong> {result.totalExpired}
            </p>
          </div>
        )}

        {/* View details button */}
        {result.productHistory.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-1 h-6 text-[10px] px-2"
              >
                <Info className="h-2 w-2 mr-1" />
                Chi tiết
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Lịch sử mua hàng: {productName}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>Sản phẩm này đã được mua {result.totalPurchased} cái từ {result.productHistory.length} đơn hàng.</p>
                  <p>Phân bổ theo FIFO (First In First Out): Sản phẩm mua trước sẽ được tính bảo hành trước.</p>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Đơn hàng</TableHead>
                        <TableHead>Ngày mua</TableHead>
                        <TableHead className="text-right">Số lượng</TableHead>
                        <TableHead className="text-right">Đơn giá</TableHead>
                        <TableHead>BH (tháng)</TableHead>
                        <TableHead>Hết hạn</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.productHistory.map((item, index) => {
                        const badge = getWarrantyStatusBadge(item.daysRemaining);
                        return (
                          <TableRow key={index} className={item.isExpired ? 'bg-red-50' : ''}>
                            <TableCell className="font-medium">{item.orderId}</TableCell>
                            <TableCell>{formatDate(item.orderDate)}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">
                              {new Intl.NumberFormat('vi-VN').format(item.unitPrice)} đ
                            </TableCell>
                            <TableCell>{item.warrantyPeriodMonths} tháng</TableCell>
                            <TableCell>{formatDate(item.warrantyExpiry)}</TableCell>
                            <TableCell>
                              <Badge variant={badge.variant}>{badge.label}</Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* FIFO Allocation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Phân bổ FIFO cho {requestedQuantity} cái gửi bảo hành:</h4>
                  <div className="space-y-1 text-sm text-blue-800">
                    {(() => {
                      let remaining = requestedQuantity;
                      const allocations: React.ReactNode[] = [];
                      
                      for (let i = 0; i < result.productHistory.length && remaining > 0; i++) {
                        const item = result.productHistory[i];
                        const allocated = Math.min(remaining, item.quantity);
                        const status = item.isExpired ? '❌ Hết hạn' : '✅ Còn hạn';
                        
                        allocations.push(
                          <p key={i}>
                            • {allocated} cái từ đơn <strong>{item.orderId}</strong> ({formatDate(item.orderDate)}) - {status}
                          </p>
                        );
                        
                        remaining -= allocated;
                      }
                      
                      return allocations;
                    })()}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AlertDescription>
    </Alert>
  );
}

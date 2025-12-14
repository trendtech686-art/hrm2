import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.tsx";
import type { Complaint } from '../types.ts';
import { formatOrderAddress } from '../../orders/address-utils.ts';
import { formatDateForDisplay } from '@/lib/date-utils';

interface Props {
  complaint: Complaint;
  relatedOrder: any;
  employees: any[];
}

export const ComplaintOrderInfo: React.FC<Props> = React.memo(({ complaint, relatedOrder, employees }) => {
  const navigate = useNavigate();
  const displayedShippingAddress = formatOrderAddress(relatedOrder?.shippingAddress) || "Chưa có";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Thông tin đơn hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mã đơn hàng:</span>
            <button
              onClick={() => navigate(`/orders/${complaint.orderSystemId}`)} 
              className="font-medium text-primary hover:underline cursor-pointer"
            >
              {complaint.orderCode || complaint.orderSystemId}
            </button>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mã vận đơn:</span>
            {relatedOrder?.packagings?.[0]?.trackingCode ? (
              <button
                onClick={() => navigate(`/shipments/${relatedOrder.packagings[0].systemId}`)}
                className="font-medium text-primary hover:underline"
              >
                {relatedOrder.packagings[0].trackingCode}
              </button>
            ) : (
              <span className="font-medium">Chưa có</span>
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Khách hàng:</span>
            <button
              onClick={() => {
                navigate(`/customers/${complaint.customerSystemId}`);
              }}
              className="font-medium text-primary hover:underline cursor-pointer"
            >
              {complaint.customerName}
            </button>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Số điện thoại:</span>
            <span className="font-medium">{complaint.customerPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Địa chỉ giao hàng:</span>
            <span className="font-medium text-right">{displayedShippingAddress}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Người tạo đơn:</span>
            <button
              onClick={() => {
                // Find employee by name
                const creator = employees.find(e => e.fullName === relatedOrder?.salesperson);
                if (creator) {
                  navigate(`/employees/${creator.systemId}`);
                } else {
                  toast.info("Không tìm thấy thông tin nhân viên");
                }
              }}
              className="font-medium text-primary hover:underline cursor-pointer disabled:text-muted-foreground disabled:no-underline disabled:cursor-default"
              disabled={!relatedOrder?.salesperson || relatedOrder.salesperson === "Chưa có"}
            >
              {relatedOrder?.salesperson || "Chưa có"}
            </button>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ngày bán:</span>
            <span className="font-medium">
              {relatedOrder ? formatDateForDisplay(relatedOrder.orderDate) : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Giá trị đơn:</span>
            <span className="font-medium">
              {complaint.orderValue ? complaint.orderValue.toLocaleString('vi-VN') : (relatedOrder?.grandTotal || 0).toLocaleString('vi-VN')} đ
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Thời gian giao hàng:</span>
            <span className="font-medium">
              {relatedOrder?.expectedDeliveryDate ? formatDateForDisplay(relatedOrder.expectedDeliveryDate) : "Chưa có"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Thời gian xuất kho:</span>
            <span className="font-medium">
              {relatedOrder?.packagings?.[0]?.requestDate ? formatDateForDisplay(relatedOrder.packagings[0].requestDate) : "Chưa xuất"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Chi nhánh:</span>
            <span className="font-medium">
              {complaint.branchName || "Chưa có"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nhân viên xử lý:</span>
            <button
              onClick={() => {
                if (complaint.assignedTo) {
                  navigate(`/employees/${complaint.assignedTo}`);
                }
              }}
              className="font-medium text-primary hover:underline cursor-pointer disabled:text-muted-foreground disabled:no-underline disabled:cursor-default"
              disabled={!complaint.assignedTo}
            >
              {complaint.assignedTo 
                ? employees.find((e) => e.systemId === complaint.assignedTo)?.fullName || "Chưa xác định"
                : "Chưa phân công"}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

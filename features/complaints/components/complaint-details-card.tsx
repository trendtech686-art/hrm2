'use client'

import React from 'react';
import { useNavigate } from '@/lib/next-compat';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { cn } from "../../../lib/utils";
import { formatTrackingInfo, isTrackingEnabled } from '../tracking-utils';
import { showNotification } from '../notification-utils';
import type { Complaint } from '../types';

interface Props {
  complaint: Complaint;
  currentUser: any;
  employees: any[];
}

export const ComplaintDetailsCard: React.FC<Props> = React.memo(({ complaint, currentUser, employees }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{complaint.id}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tracking Link - If enabled */}
        {isTrackingEnabled() && (
          <div className="bg-muted/50 p-3 rounded-lg border">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Link theo dõi công khai</div>
                <div className="font-mono text-sm break-all">
                  {formatTrackingInfo(complaint).url}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-9"
                onClick={() => {
                  navigator.clipboard.writeText(formatTrackingInfo(complaint).url);
                  showNotification('success', 'Đã copy link');
                }}
              >
                Sao chép
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Gửi link này cho khách hàng để họ theo dõi tiến độ xử lý
            </div>
          </div>
        )}
        
        {/* Meta info */}
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Tạo bởi:</span>
            <span className="font-medium">
              {(() => {
                // If createdBy matches current user's systemId, show current user's name
                if (complaint.createdBy === currentUser.systemId) {
                  return currentUser.name;
                }
                // Find employee by systemId or name
                const creator = employees.find(e => 
                  e.systemId === complaint.createdBy || 
                  e.fullName === complaint.createdBy
                );
                return creator ? creator.fullName : complaint.createdBy;
              })()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Tạo lúc:</span>
            <span className="font-medium">
              {new Date(complaint.createdAt).toLocaleString("vi-VN")}
            </span>
          </div>
          {complaint.resolvedAt && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Đóng lúc:</span>
              <span className="font-medium text-green-600">
                {new Date(complaint.resolvedAt).toLocaleString("vi-VN")}
              </span>
            </div>
          )}
          {complaint.endedAt && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Kết thúc lúc:</span>
              <span className="font-medium text-blue-600">
                {new Date(complaint.endedAt).toLocaleString("vi-VN")}
              </span>
            </div>
          )}
          {complaint.isVerifiedCorrect !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Xác minh:</span>
              <span className={cn("font-medium", complaint.isVerifiedCorrect ? "text-red-600" : "text-green-600")}>
                {complaint.isVerifiedCorrect ? "Lỗi thật" : "Khách sai"}
              </span>
            </div>
          )}
          {complaint.responsibleUserId && (
            <div className="flex items-center gap-2 md:col-span-2">
              <span className="text-muted-foreground">Người chịu trách nhiệm:</span>
              <button
                onClick={() => navigate(`/employees/${complaint.responsibleUserId}`)}
                className="font-medium text-primary hover:underline"
              >
                {employees.find((e) => e.systemId === complaint.responsibleUserId)?.fullName}
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

'use client';

import * as React from 'react';
import { Clock, Printer, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AttendanceHistoryRow } from './types';

interface EmployeeBasic {
  fullName: string;
  id: string;
}

interface AttendanceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAttendance: AttendanceHistoryRow | null;
  employee: EmployeeBasic;
  onPrintSingle: (attendance: AttendanceHistoryRow) => void;
}

export function AttendanceDetailDialog({
  open,
  onOpenChange,
  selectedAttendance,
  employee,
  onPrintSingle,
}: AttendanceDetailDialogProps) {
  const router = useRouter();

  if (!selectedAttendance) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Chi tiết chấm công
          </DialogTitle>
          <DialogDescription>
            {selectedAttendance?.monthLabel} -{' '}
            {selectedAttendance?.locked ? 'Đã khóa' : 'Chưa khóa'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Thông tin chung */}
          <div className="grid grid-cols-2 gap-4 text-sm border rounded-lg p-4 bg-muted/30">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nhân viên:</span>
              <span className="font-medium">{employee.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mã NV:</span>
              <span className="font-mono">{employee.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kỳ chấm công:</span>
              <span className="font-medium">{selectedAttendance.monthLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trạng thái:</span>
              <Badge
                variant={selectedAttendance.locked ? 'default' : 'outline'}
                className={selectedAttendance.locked ? 'bg-green-600' : ''}
              >
                {selectedAttendance.locked ? 'Đã khóa' : 'Chưa khóa'}
              </Badge>
            </div>
          </div>

          {/* Thống kê chi tiết */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950 border">
              <p className="text-2xl font-bold text-green-600">
                {selectedAttendance.workDays}
              </p>
              <p className="text-xs text-muted-foreground">Ngày công</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border">
              <p className="text-2xl font-bold text-blue-600">
                {selectedAttendance.leaveDays}
              </p>
              <p className="text-xs text-muted-foreground">Nghỉ phép</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950 border">
              <p className="text-2xl font-bold text-destructive">
                {selectedAttendance.absentDays}
              </p>
              <p className="text-xs text-muted-foreground">Vắng</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950 border">
              <p className="text-2xl font-bold text-orange-600">
                {selectedAttendance.lateArrivals}
              </p>
              <p className="text-xs text-muted-foreground">Đi trễ</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950 border">
              <p className="text-2xl font-bold text-orange-600">
                {selectedAttendance.earlyDepartures}
              </p>
              <p className="text-xs text-muted-foreground">Về sớm</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950 border">
              <p className="text-2xl font-bold text-purple-600">
                {selectedAttendance.otHours}
              </p>
              <p className="text-xs text-muted-foreground">Giờ làm thêm</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onPrintSingle(selectedAttendance)}
            >
              <Printer className="mr-2 h-4 w-4" />
              In phiếu
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                router.push(`/attendance?month=${selectedAttendance.monthKey}`);
              }}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Xem bảng chấm công
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import * as React from 'react';
import type { Customer } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Bell, Check, Clock, MoreHorizontal, HelpCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useCustomerSlaEngineStore } from '../sla/store';
import { useCustomerStore } from '../store';
import { formatDaysRemaining } from '../../reports/customer-sla-report/sla-utils';
import { SLA_TYPE_BADGES } from '../sla/constants';
import type { CustomerSlaAlert } from '../sla/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';
import { Progress } from '../../../components/ui/progress';
import { toast } from 'sonner';

type Props = {
  customer: Customer;
};

export function CustomerSlaStatusCard({ customer }: Props) {
  const entry = useCustomerSlaEngineStore((state) => state.index?.entries[customer.systemId]);
  const acknowledge = useCustomerSlaEngineStore((state) => state.acknowledge);
  const snooze = useCustomerSlaEngineStore((state) => state.snooze);
  const getAck = useCustomerSlaEngineStore((state) => state.getAck);
  const isSnoozed = useCustomerSlaEngineStore((state) => state.isSnoozed);
  const getSnoozeRemaining = useCustomerSlaEngineStore((state) => state.getSnoozeRemaining);
  const updateCustomer = useCustomerStore((state) => state.update);
  const triggerReevaluation = useCustomerSlaEngineStore((state) => state.triggerReevaluation);

  // Handle acknowledge: update SLA store AND customer's lastContactDate (only for follow-up SLA)
  const handleAcknowledge = React.useCallback((alert: CustomerSlaAlert) => {
    const now = new Date().toISOString();
    
    // 1. Update SLA acknowledgement
    acknowledge(customer.systemId, alert, { actionType: 'acknowledged' });
    
    // 2. Only update customer's lastContactDate for follow-up SLA to reset that cycle
    // For other SLA types (re-engagement, debt-payment), just acknowledge without resetting baseline
    if (alert.slaType === 'follow-up') {
      updateCustomer(customer.systemId, {
        lastContactDate: now,
      });
      
      toast.success('Đã xác nhận xử lý SLA', {
        description: 'Ngày liên hệ cuối đã được cập nhật',
      });
      
      // 3. Trigger re-evaluation after a short delay
      setTimeout(() => triggerReevaluation(), 500);
    } else {
      toast.success('Đã xác nhận xử lý SLA', {
        description: `SLA "${alert.slaName}" đã được đánh dấu xử lý`,
      });
    }
  }, [customer.systemId, acknowledge, updateCustomer, triggerReevaluation]);

  // Handle snooze
  const handleSnooze = React.useCallback((alert: CustomerSlaAlert, days: number) => {
    snooze(customer.systemId, alert, days);
    toast.success(`Đã tạm ẩn ${days} ngày`, {
      description: `SLA sẽ hiển thị lại sau ${days} ngày`,
    });
  }, [customer.systemId, snooze]);

  if (!entry) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trạng thái SLA</CardTitle>
          <CardDescription>Không có cảnh báo nào</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-body-sm text-muted-foreground">
            Khách hàng này hiện không có SLA nào cần theo dõi.
          </p>
        </CardContent>
      </Card>
    );
  }

  const alerts = entry.alerts;
  const debtAlert = entry.debtAlert;
  const healthAlert = entry.healthAlert;

  // Calculate summary stats
  const totalAlerts = alerts.length + (debtAlert ? 1 : 0) + (healthAlert ? 1 : 0);
  const overdueCount = alerts.filter(a => a.alertLevel === 'overdue').length;
  const criticalCount = alerts.filter(a => a.alertLevel === 'critical').length;
  const warningCount = alerts.filter(a => a.alertLevel === 'warning').length;
  const acknowledgedCount = alerts.filter(a => {
    const ack = getAck(customer.systemId, a.slaType);
    return ack?.targetDate === a.targetDate;
  }).length;
  const snoozedCount = alerts.filter(a => isSnoozed(customer.systemId, a.slaType)).length;
  const processedCount = acknowledgedCount + snoozedCount;
  const progressPercent = totalAlerts > 0 ? Math.round((processedCount / totalAlerts) * 100) : 0;

  if (!alerts.length && !debtAlert && !healthAlert) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trạng thái SLA</CardTitle>
          <CardDescription>Không có cảnh báo nào</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-body-sm text-muted-foreground">
            Khách hàng này hiện không có SLA nào cần theo dõi.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trạng thái SLA</CardTitle>
        <CardDescription>Danh sách cảnh báo cần xử lý</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Bar */}
        <div className="bg-muted/50 rounded-lg p-3 space-y-3">
          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-body-sm">
              <span className="text-muted-foreground">Tiến độ xử lý</span>
              <span className="font-medium">{processedCount}/{totalAlerts} ({progressPercent}%)</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
          
          {/* Alert counts by level */}
          <div className="flex flex-wrap gap-2">
            {overdueCount > 0 && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="destructive" className="cursor-help">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {overdueCount} quá hạn
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>SLA đã quá hạn mục tiêu, cần xử lý ngay</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {criticalCount > 0 && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="warning" className="cursor-help">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {criticalCount} nghiêm trọng
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>SLA sắp đến hạn (còn 1-2 ngày), ưu tiên xử lý</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {warningCount > 0 && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="cursor-help">
                      <Info className="h-3 w-3 mr-1" />
                      {warningCount} cảnh báo
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>SLA cần theo dõi, còn vài ngày để xử lý</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {acknowledgedCount > 0 && (
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                <Check className="h-3 w-3 mr-1" />
                {acknowledgedCount} đã xử lý
              </Badge>
            )}
            {snoozedCount > 0 && (
              <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                <Clock className="h-3 w-3 mr-1" />
                {snoozedCount} tạm ẩn
              </Badge>
            )}
          </div>
        </div>

        {alerts.map(alert => {
          const ack = getAck(customer.systemId, alert.slaType);
          const isAcknowledged = ack?.targetDate === alert.targetDate;
          const alertIsSnoozed = isSnoozed(customer.systemId, alert.slaType);
          const snoozeRemaining = getSnoozeRemaining(customer.systemId, alert.slaType);
          const badgeMeta = SLA_TYPE_BADGES[alert.slaType];
          const colorClass = badgeMeta?.color || 'text-slate-600 bg-slate-100';
          
          return (
            <div key={`${alert.slaType}-${alert.targetDate}`} className="border rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={colorClass}>{badgeMeta?.label || alert.slaName}</Badge>
                    <span className="text-body-sm font-medium">{formatDaysRemaining(alert.daysRemaining)}</span>
                  </div>
                  <p className="text-body-sm text-muted-foreground">
                    Ngày mục tiêu: {format(new Date(alert.targetDate), 'dd/MM/yyyy', { locale: vi })}
                  </p>
                </div>
                <Badge variant={alert.alertLevel === 'overdue' ? 'destructive' : 'secondary'}>
                  {alert.alertLevel === 'overdue' ? 'Quá hạn' : alert.alertLevel === 'critical' ? 'Nghiêm trọng' : alert.alertLevel === 'warning' ? 'Cảnh báo' : 'Bình thường'}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-body-sm text-muted-foreground">
                <span>Phụ trách: {alert.assignee || '—'}</span>
                <span>Hoạt động cuối: {alert.lastActivityDate ? format(new Date(alert.lastActivityDate), 'dd/MM/yyyy', { locale: vi }) : '—'}</span>
              </div>
              <div className="flex justify-end gap-2">
                {alertIsSnoozed ? (
                  <Badge variant="outline" className="text-amber-600">
                    <Clock className="h-3 w-3 mr-1" /> Tạm ẩn còn {snoozeRemaining} ngày
                  </Badge>
                ) : isAcknowledged ? (
                  <Badge variant="outline" className="text-green-600">
                    <Check className="h-3 w-3 mr-1" /> Đã xác nhận {format(new Date(ack!.acknowledgedAt), 'dd/MM HH:mm', { locale: vi })}
                  </Badge>
                ) : (
                  <div className="flex gap-2">
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleAcknowledge(alert)}>
                            <Check className="h-4 w-4 mr-1" /> Đã xử lý
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          {alert.slaType === 'follow-up' ? (
                            <p>Xác nhận đã liên hệ khách hàng. Ngày liên hệ cuối sẽ được cập nhật và chu kỳ SLA được làm mới.</p>
                          ) : alert.slaType === 're-engagement' ? (
                            <p>Xác nhận đã tiếp cận lại khách hàng. Cảnh báo sẽ được đánh dấu đã xử lý.</p>
                          ) : (
                            <p>Xác nhận đã xử lý SLA này. Cảnh báo sẽ được đánh dấu hoàn thành.</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleSnooze(alert, 1)}>
                                <Clock className="h-4 w-4 mr-2" /> Tạm ẩn 1 ngày
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSnooze(alert, 3)}>
                                <Clock className="h-4 w-4 mr-2" /> Tạm ẩn 3 ngày
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSnooze(alert, 7)}>
                                <Clock className="h-4 w-4 mr-2" /> Tạm ẩn 7 ngày
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleSnooze(alert, 30)}>
                                <Clock className="h-4 w-4 mr-2" /> Tạm ẩn 30 ngày
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>Tạm ẩn cảnh báo này trong một khoảng thời gian</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {debtAlert && (
            <div className="border rounded-lg p-3 space-y-2 bg-rose-50">
            <div className="flex items-center gap-2">
              <Badge variant="destructive">Công nợ</Badge>
              <span className="text-body-sm font-medium">{debtAlert.debtStatus}</span>
            </div>
            <p className="text-body-sm text-rose-700">
              Nợ quá hạn: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(debtAlert.overdueAmount)}
            </p>
            {debtAlert.oldestDueDate && (
              <p className="text-body-xs text-muted-foreground">
                Hạn sớm nhất: {format(new Date(debtAlert.oldestDueDate), 'dd/MM/yyyy', { locale: vi })}
              </p>
            )}
          </div>
        )}

        {healthAlert && (
          <div className="border rounded-lg p-3 space-y-2 bg-purple-50">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-600 hover:bg-purple-700">Rủi ro churn</Badge>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3.5 w-3.5 text-purple-600 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-sm p-4">
                    <div className="text-body-xs space-y-3">
                      <p className="font-semibold text-base">Cách tính điểm sức khỏe (Health Score):</p>
                      
                      <div className="space-y-1">
                        <p className="font-medium">1. Recency (Thời gian mua gần nhất) - Tối đa 30đ:</p>
                        <ul className="list-disc list-inside pl-1 text-muted-foreground">
                          <li>Mua trong 7 ngày: +30đ</li>
                          <li>Mua trong 30 ngày: +25đ</li>
                          <li>...giảm dần...</li>
                          <li>Trên 1 năm: +5đ</li>
                        </ul>
                      </div>

                      <div className="space-y-1">
                        <p className="font-medium">2. Frequency (Tần suất mua) - Tối đa 25đ:</p>
                        <ul className="list-disc list-inside pl-1 text-muted-foreground">
                          <li>Trên 20 đơn: +25đ</li>
                          <li>Trên 10 đơn: +20đ</li>
                          <li>...giảm dần...</li>
                        </ul>
                      </div>

                      <div className="space-y-1">
                        <p className="font-medium">3. Monetary (Tổng chi tiêu) - Tối đa 30đ:</p>
                        <ul className="list-disc list-inside pl-1 text-muted-foreground">
                          <li>Trên 500 triệu: +30đ</li>
                          <li>Trên 200 triệu: +25đ</li>
                          <li>...giảm dần...</li>
                        </ul>
                      </div>

                      <div className="space-y-1">
                        <p className="font-medium">4. Payment Behavior (Hành vi thanh toán) - Tối đa 15đ:</p>
                        <p className="text-muted-foreground mb-1">Dựa trên tỷ lệ nợ hiện tại / hạn mức tín dụng.</p>
                        <ul className="list-disc list-inside pl-1 text-muted-foreground">
                          <li>Dùng &lt; 20% hạn mức: +15đ (Tốt)</li>
                          <li>Dùng &gt; 80% hạn mức: 0đ (Rủi ro)</li>
                          <li>Nếu không có hạn mức nợ: Mặc định +15đ</li>
                        </ul>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-body-sm font-medium">{healthAlert.churnRisk === 'high' ? 'Rủi ro cao' : healthAlert.churnRisk === 'medium' ? 'Rủi ro trung bình' : 'Rủi ro thấp'}</span>
            </div>
            <p className="text-body-sm text-purple-700">
              Health score: {healthAlert.healthScore}/100 • Không mua: {healthAlert.daysSinceLastPurchase} ngày
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

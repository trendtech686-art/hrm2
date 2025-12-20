/**
 * ============================================
 * WARRANTY STATISTICS PAGE
 * ============================================
 * Dashboard thống kê và phân tích phiếu bảo hành
 */

'use client'

import * as React from "react";
import { useNavigate } from '@/lib/next-compat';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { usePageHeader } from "../../contexts/page-header-context";
import { useWarrantyStore } from "./store";
import { useWarrantyStatistics, formatMinutes } from "./hooks/use-warranty-statistics";
import { WARRANTY_STATUS_LABELS } from "./types";
import { cn } from "../../lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  BarChart3,
  Target,
  ArrowLeft,
  Activity,
  Package,
} from "lucide-react";

/**
 * Statistics Card Component
 */
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
}

function StatCard({ title, value, subtitle, icon, trend, colorClass = "text-blue-600" }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-body-sm text-muted-foreground mb-1">{title}</div>
            <div className={cn("text-3xl font-bold", colorClass)}>{value}</div>
            {subtitle && <div className="text-body-xs text-muted-foreground mt-1">{subtitle}</div>}
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={cn("text-body-xs font-medium", trend.isPositive ? "text-green-600" : "text-red-600")}>
                  {Math.abs(trend.value).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          {icon && <div className={cn("p-3 rounded-lg bg-muted", colorClass)}>{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Progress Bar Component
 */
interface ProgressBarProps {
  label: string;
  value: number;
  total: number;
  percentage: number;
  color?: string;
}

function ProgressBar({ label, value, total, percentage, color = "bg-blue-500" }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-body-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {value} / {total} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={cn("h-full transition-all", color)} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

/**
 * Main Statistics Page
 */
export function WarrantyStatisticsPage() {
  const navigate = useNavigate();
  const { data: tickets } = useWarrantyStore();

  const stats = useWarrantyStatistics(tickets);

  const actions = React.useMemo(() => [
    <Button key="back" variant="outline" onClick={() => navigate("/warranty")}>
      <ArrowLeft className="h-4 w-4 mr-2" />
      Quay lại
    </Button>
  ], [navigate]);

  usePageHeader({ 
    actions,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Bảo hành', href: '/warranty', isCurrent: false },
      { label: 'Thống kê bảo hành', href: '', isCurrent: true }
    ] as any
  });

  return (
    <div className="w-full h-full">
      <div className="space-y-6">
        {/* ============================================
          OVERVIEW STATS
      ============================================ */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng phiếu"
          value={stats.overview.total}
          icon={<Activity className="h-5 w-5" />}
          colorClass="text-blue-600"
          trend={{
            value: stats.trend.changePercentage,
            isPositive: stats.trend.isIncreasing,
          }}
        />

        <StatCard
          title="Đã hoàn thành"
          value={stats.overview.returned}
          subtitle={`${((stats.overview.returned / stats.overview.total || 0) * 100).toFixed(1)}% tổng số`}
          icon={<CheckCircle className="h-5 w-5" />}
          colorClass="text-green-600"
        />

        <StatCard
          title="Đang xử lý"
          value={stats.overview.pending + stats.overview.processed}
          subtitle={`${(((stats.overview.pending + stats.overview.processed) / stats.overview.total || 0) * 100).toFixed(1)}% tổng số`}
          icon={<Clock className="h-5 w-5" />}
          colorClass="text-orange-600"
        />

        <StatCard
          title="Chưa xử lý"
          value={stats.overview.incomplete}
          subtitle={`${((stats.overview.incomplete / stats.overview.total || 0) * 100).toFixed(1)}% tổng số`}
          icon={<AlertTriangle className="h-5 w-5" />}
          colorClass="text-red-600"
        />
      </div>

      {/* ============================================
          TIME-BASED METRICS
      ============================================ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Thời gian xử lý trung bình
          </CardTitle>
          <CardDescription>Hiệu suất phản hồi và xử lý bảo hành</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-body-sm text-blue-600 dark:text-blue-400 mb-1">Phản hồi TB</div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {formatMinutes(stats.avgTimes.responseTime)}
              </div>
              <div className="text-body-xs text-blue-600 dark:text-blue-400 mt-1">Mục tiêu: 2h</div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-body-sm text-green-600 dark:text-green-400 mb-1">Xử lý TB</div>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {formatMinutes(stats.avgTimes.processingTime)}
              </div>
              <div className="text-body-xs text-green-600 dark:text-green-400 mt-1">Mục tiêu: 24h</div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-body-sm text-purple-600 dark:text-purple-400 mb-1">Trả hàng TB</div>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {formatMinutes(stats.avgTimes.returnTime)}
              </div>
              <div className="text-body-xs text-purple-600 dark:text-purple-400 mt-1">Mục tiêu: 48h</div>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="text-body-sm text-orange-600 dark:text-orange-400 mb-1">Tổng thời gian</div>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {formatMinutes(stats.avgTimes.totalTime)}
              </div>
              <div className="text-body-xs text-orange-600 dark:text-orange-400 mt-1">
                Từ nhận đến trả
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ============================================
            BY STATUS
        ============================================ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Phân bố theo trạng thái
            </CardTitle>
            <CardDescription>Tỷ lệ phiếu bảo hành theo từng trạng thái</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.byStatus.map((item) => (
              <ProgressBar
                key={item.status}
                label={WARRANTY_STATUS_LABELS[item.status]}
                value={item.count}
                total={stats.overview.total}
                percentage={item.percentage}
                color={
                  item.status === 'incomplete' ? 'bg-blue-500' :
                  item.status === 'pending' ? 'bg-yellow-500' :
                  item.status === 'processed' ? 'bg-green-500' :
                  'bg-gray-500'
                }
              />
            ))}
          </CardContent>
        </Card>

        {/* ============================================
            BY BRANCH
        ============================================ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Theo chi nhánh
            </CardTitle>
            <CardDescription>Phân bố phiếu bảo hành theo chi nhánh</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.byBranch.slice(0, 5).map((item) => (
              <ProgressBar
                key={item.branchId}
                label={item.branchName}
                value={item.count}
                total={stats.overview.total}
                percentage={item.percentage}
                color="bg-indigo-500"
              />
            ))}
            {stats.byBranch.length > 5 && (
              <div className="text-body-sm text-muted-foreground text-center pt-2">
                Và {stats.byBranch.length - 5} chi nhánh khác...
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ============================================
          TOP EMPLOYEES
      ============================================ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Top nhân viên xử lý
          </CardTitle>
          <CardDescription>Nhân viên xử lý nhiều phiếu bảo hành nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.byEmployee.slice(0, 10).map((employee, index) => (
              <div key={employee.employeeId} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full font-bold text-body-sm",
                    index === 0 ? "bg-yellow-100 text-yellow-700" :
                    index === 1 ? "bg-gray-100 text-gray-700" :
                    index === 2 ? "bg-orange-100 text-orange-700" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{employee.employeeName}</div>
                    <div className="text-body-xs text-muted-foreground">
                      TB: {formatMinutes(employee.avgProcessingTime)} / phiếu
                    </div>
                  </div>
                </div>
                <Badge variant="secondary">
                  {employee.count} phiếu
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ============================================
          TREND ANALYSIS
      ============================================ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Xu hướng theo tháng
          </CardTitle>
          <CardDescription>So sánh số lượng phiếu tháng này với tháng trước</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-body-sm text-muted-foreground mb-1">Tháng trước</div>
              <div className="text-2xl font-bold">{stats.trend.lastMonth}</div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="text-body-sm text-muted-foreground mb-1">Tháng này</div>
              <div className="text-2xl font-bold">{stats.trend.thisMonth}</div>
            </div>

            <div className={cn(
              "p-4 rounded-lg",
              stats.trend.isIncreasing ? "bg-red-50 dark:bg-red-950/20" : "bg-green-50 dark:bg-green-950/20"
            )}>
              <div className="text-body-sm text-muted-foreground mb-1">Thay đổi</div>
              <div className={cn(
                "text-2xl font-bold flex items-center gap-2",
                stats.trend.isIncreasing ? "text-red-600" : "text-green-600"
              )}>
                {stats.trend.isIncreasing ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                {Math.abs(stats.trend.changePercentage).toFixed(1)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

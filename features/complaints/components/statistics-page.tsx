/**
 * ============================================
 * COMPLAINT STATISTICS PAGE
 * ============================================
 * Dashboard thống kê và phân tích khiếu nại
 */

'use client'

import * as React from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePageHeader } from "@/contexts/page-header-context";
import { mobileBleedCardClass } from '@/components/layout/page-section';

import { useComplaintStatisticsServer } from "../hooks/use-complaint-statistics-server";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/router";
import type { BreadcrumbItem } from "@/lib/breadcrumb-system";
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
} from "lucide-react";

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
    <Card className={mobileBleedCardClass}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-sm text-muted-foreground mb-1">{title}</div>
            <div className={cn("text-3xl font-bold", colorClass)}>{value}</div>
            {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={cn("text-xs font-medium", trend.isPositive ? "text-green-600" : "text-red-600")}>
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

function ProgressBar({ label, value, total, percentage, color = "bg-primary" }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
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
export function ComplaintStatisticsPage() {
  const router = useRouter();
  // ⚡ PERFORMANCE: Server-side statistics instead of loading ALL complaints to client
  const { data: stats, isLoading } = useComplaintStatisticsServer();

  const headerSubtitle = React.useMemo(() => {
    if (!stats) {
      return "Theo dõi SLA phản hồi 4h/48h và xu hướng tuần gần nhất.";
    }
    const processing = stats.overview.pending + stats.overview.investigating;
    return [
      `Tổng ${stats.overview.total}`,
      `Đang xử lý ${processing}`,
      `Đúng hạn SLA ${stats.timeBased.slaComplianceRate.toFixed(1)}%`,
      `Tuần này ${stats.trend.totalThisWeek} khiếu nại`,
    ].join(" • ");
  }, [stats]);

  const actions = React.useMemo(() => [
    <Button
      key="export"
      variant="outline"
      size="sm"
      onClick={() => window.print?.()}
    >
      <BarChart3 className="h-4 w-4 mr-2" />
      Xuất báo cáo
    </Button>,
    <Button
      key="back"
      variant="outline"
      size="sm"
      onClick={() => router.push(ROUTES.INTERNAL.COMPLAINTS)}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Quay lại
    </Button>,
  ], [router]);

  const breadcrumb = React.useMemo<BreadcrumbItem[]>(() => [
    { label: "Trang chủ", href: ROUTES.ROOT },
    { label: "Quản lý Khiếu nại", href: ROUTES.INTERNAL.COMPLAINTS },
    { label: "Thống kê khiếu nại", href: "/complaints/statistics", isCurrent: true },
  ], []);

  usePageHeader({
    title: "Thống kê khiếu nại",
    subtitle: headerSubtitle,
    breadcrumb,
    showBackButton: true,
    backPath: ROUTES.INTERNAL.COMPLAINTS,
    docLink: {
      href: "docs/complaint-detail-refactor-plan.md",
      label: "Checklist SLA khiếu nại",
    },
    actions,
  });

  if (isLoading || !stats) {
    return (
      <div className="w-full h-full flex items-center justify-center py-20">
        <div className="text-muted-foreground">Đang tải thống kê...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="space-y-6">
        {/* ============================================
            OVERVIEW STATS - Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols
        ============================================ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            title="Tổng"
            value={stats.overview.total}
            icon={<Activity className="h-5 w-5" />}
            colorClass="text-blue-600"
            trend={{
              value: stats.trend.changePercentage,
              isPositive: !stats.trend.isIncreasing, // Giảm là tốt
            }}
          />

          <StatCard
            title="Đã giải quyết"
            value={stats.overview.resolved}
            subtitle={`${stats.overview.resolvedPercentage.toFixed(0)}%`}
            icon={<CheckCircle className="h-5 w-5" />}
            colorClass="text-green-600"
          />

          <StatCard
            title="Đang xử lý"
            value={stats.overview.investigating + stats.overview.pending}
            subtitle={`${(stats.overview.investigatingPercentage + stats.overview.pendingPercentage).toFixed(0)}%`}
            icon={<Clock className="h-5 w-5" />}
            colorClass="text-orange-600"
          />

          <StatCard
            title="SLA"
            value={`${stats.timeBased.slaComplianceRate.toFixed(0)}%`}
            subtitle={`${stats.timeBased.onTimeSLA} đúng hạn`}
            icon={<Target className="h-5 w-5" />}
            colorClass={stats.timeBased.slaComplianceRate >= 80 ? "text-green-600" : "text-red-600"}
          />
        </div>

        {/* ============================================
            TIME-BASED METRICS - Mobile: stacked, Desktop: 3 cols
        ============================================ */}
        <Card className={mobileBleedCardClass}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              Thời gian xử lý
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Mobile: stack vertically, Desktop: 3 cols */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-info/10 rounded-lg border border-info/20">
                <div className="text-xs text-info mb-1">Phản hồi TB</div>
                <div className="text-xl font-bold text-info">{stats.timeBased.avgResponseTimeFormatted}</div>
                <div className="text-xs text-info/80 mt-0.5">Mục tiêu: 4h</div>
              </div>

              <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                <div className="text-xs text-success mb-1">Giải quyết TB</div>
                <div className="text-xl font-bold text-success">{stats.timeBased.avgResolutionTimeFormatted}</div>
                <div className="text-xs text-success/80 mt-0.5">Mục tiêu: 48h</div>
              </div>

              <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                <div className="text-xs text-warning mb-1">Quá hạn SLA</div>
                <div className="text-xl font-bold text-warning">{stats.timeBased.overdueCount}</div>
                <div className="text-xs text-warning/80 mt-0.5">
                  {((stats.timeBased.overdueCount / (stats.overview.resolved + stats.overview.rejected || 1)) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ============================================
              VERIFICATION STATS
          ============================================ */}
          <Card className={mobileBleedCardClass}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Xác minh khiếu nại
              </CardTitle>
              <CardDescription>Tỷ lệ khiếu nại đúng/sai</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressBar
                label="Khiếu nại đúng"
                value={stats.verification.verifiedCorrect}
                total={stats.verification.verifiedCorrect + stats.verification.verifiedIncorrect}
                percentage={stats.verification.correctRate}
                color="bg-red-500"
              />

              <ProgressBar
                label="Khách hàng sai"
                value={stats.verification.verifiedIncorrect}
                total={stats.verification.verifiedCorrect + stats.verification.verifiedIncorrect}
                percentage={stats.verification.incorrectRate}
                color="bg-green-500"
              />

              <div className="pt-2 border-t">
                <div className="text-sm text-muted-foreground">
                  Chưa xác minh: <span className="font-medium">{stats.verification.pendingVerification}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ============================================
              BY TYPE
          ============================================ */}
          <Card className={mobileBleedCardClass}>
            <CardHeader>
              <CardTitle>Phân loại khiếu nại</CardTitle>
              <CardDescription>Thống kê theo loại khiếu nại</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.byType.map((item) => (
                <div key={item.type} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{item.count}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ============================================
              BY RESOLUTION
          ============================================ */}
          <Card className={mobileBleedCardClass}>
            <CardHeader>
              <CardTitle>Phương án giải quyết</CardTitle>
              <CardDescription>Phân bổ theo cách xử lý</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.byResolution.map((item) => (
                <div key={item.resolution} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-sm font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{item.count}</span>
                    <Badge className="bg-info/15 text-info-foreground">{item.percentage.toFixed(1)}%</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ============================================
              BY PRIORITY
          ============================================ */}
          <Card className={mobileBleedCardClass}>
            <CardHeader>
              <CardTitle>Độ ưu tiên</CardTitle>
              <CardDescription>Phân bổ theo mức độ khẩn cấp</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.byPriority.map((item) => (
                <div key={item.priority} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{item.count}</span>
                      {item.avgResolutionTime > 0 && (
                        <span className="text-xs text-muted-foreground">
                          (TB: {Math.round(item.avgResolutionTime / (60 * 60 * 1000))}h)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

          {/* ============================================
              TOP PERFORMERS (BY ASSIGNEE) - Mobile optimized
          ============================================ */}
          {stats.byAssignee.length > 0 && (
            <Card className={mobileBleedCardClass}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4" />
                  Hiệu suất nhân viên
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.byAssignee.slice(0, 5).map((assignee, index) => (
                    <div key={assignee.assigneeId} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                      <div className="shrink-0 w-7 h-7 rounded-full bg-info/15 flex items-center justify-center font-bold text-xs text-info">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{assignee.assigneeName}</div>
                        <div className="text-xs text-muted-foreground">
                          {assignee.totalAssigned} KN • {assignee.resolved} đã giải quyết
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-sm font-medium text-green-600">
                          {assignee.resolutionRate.toFixed(0)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          TB: {Math.round(assignee.avgResolutionTime / (60 * 60 * 1000))}h
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        {/* ============================================
            TREND ANALYSIS
        ============================================ */}
        <Card className={mobileBleedCardClass}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Xu hướng 7 ngày
            </CardTitle>
            <CardDescription>So sánh tuần này với tuần trước</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Khiếu nại mới</div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{stats.trend.totalThisWeek}</div>
                  <div className="flex items-center gap-1">
                    {stats.trend.isIncreasing ? (
                      <TrendingUp className="h-4 w-4 text-red-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-600" />
                    )}
                    <span className={cn("text-sm font-medium", stats.trend.isIncreasing ? "text-red-600" : "text-green-600")}>
                      {Math.abs(stats.trend.changePercentage).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Tuần trước: {stats.trend.totalLastWeek}
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Đã giải quyết</div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{stats.trend.resolvedThisWeek}</div>
                  <div className="flex items-center gap-1">
                    {stats.trend.resolutionRateChange > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={cn("text-sm font-medium", stats.trend.resolutionRateChange > 0 ? "text-green-600" : "text-red-600")}>
                      {Math.abs(stats.trend.resolutionRateChange).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Tuần trước: {stats.trend.resolvedLastWeek}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

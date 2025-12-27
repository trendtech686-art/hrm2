/**
 * Reports Index Page
 * 
 * Trang tổng quan báo cáo - hiển thị danh sách các nhóm báo cáo
 */

'use client'

import * as React from 'react';
import Link from 'next/link';
import { 
  AreaChart, 
  TrendingUp, 
  Truck, 
  Undo2, 
  Wallet, 
  Package,
  Users,
  ShoppingCart,
  Building2,
  Calendar,
  FileBarChart,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/router';
import { usePageHeader } from '@/contexts/page-header-context';

type ReportItem = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
};

type ReportGroup = {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  reports: ReportItem[];
};

const reportGroups: ReportGroup[] = [
  {
    title: 'Báo cáo Bán hàng',
    description: 'Phân tích doanh thu, đơn hàng và hiệu suất bán hàng',
    icon: TrendingUp,
    color: 'text-green-600 bg-green-100 dark:bg-green-900/30',
    reports: [
      { 
        title: 'Theo thời gian', 
        description: 'Doanh thu theo ngày, tuần, tháng', 
        href: ROUTES.REPORTS.SALES_BY_TIME,
        icon: Calendar,
      },
      { 
        title: 'Theo nhân viên', 
        description: 'Hiệu suất bán hàng từng nhân viên', 
        href: ROUTES.REPORTS.SALES_BY_EMPLOYEE,
        icon: Users,
      },
      { 
        title: 'Theo sản phẩm', 
        description: 'Doanh thu và số lượng theo sản phẩm', 
        href: ROUTES.REPORTS.SALES_BY_PRODUCT,
        icon: Package,
      },
      { 
        title: 'Theo đơn hàng', 
        description: 'Chi tiết từng đơn hàng', 
        href: ROUTES.REPORTS.SALES_BY_ORDER,
        icon: ShoppingCart,
      },
      { 
        title: 'Theo chi nhánh', 
        description: 'So sánh doanh thu các chi nhánh', 
        href: ROUTES.REPORTS.SALES_BY_BRANCH,
        icon: Building2,
      },
      { 
        title: 'Theo khách hàng', 
        description: 'Phân tích khách hàng mua hàng', 
        href: ROUTES.REPORTS.SALES_BY_CUSTOMER,
        icon: Users,
      },
    ],
  },
  {
    title: 'Báo cáo Giao hàng',
    description: 'Theo dõi vận đơn, tỷ lệ giao thành công',
    icon: Truck,
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
    reports: [
      { 
        title: 'Theo thời gian', 
        description: 'Số lượng giao hàng theo thời gian', 
        href: ROUTES.REPORTS.DELIVERY_BY_TIME,
        icon: Calendar,
        badge: 'Soon',
      },
      { 
        title: 'Theo nhân viên', 
        description: 'Hiệu suất giao hàng từng nhân viên', 
        href: ROUTES.REPORTS.DELIVERY_BY_EMPLOYEE,
        icon: Users,
        badge: 'Soon',
      },
      { 
        title: 'Theo đơn vị vận chuyển', 
        description: 'So sánh các đơn vị vận chuyển', 
        href: ROUTES.REPORTS.DELIVERY_BY_CARRIER,
        icon: Truck,
        badge: 'Soon',
      },
      { 
        title: 'Theo chi nhánh', 
        description: 'Giao hàng theo từng chi nhánh', 
        href: ROUTES.REPORTS.DELIVERY_BY_BRANCH,
        icon: Building2,
        badge: 'Soon',
      },
    ],
  },
  {
    title: 'Báo cáo Trả hàng',
    description: 'Phân tích đơn trả hàng và lý do',
    icon: Undo2,
    color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
    reports: [
      { 
        title: 'Theo đơn hàng', 
        description: 'Chi tiết từng đơn trả hàng', 
        href: ROUTES.REPORTS.RETURNS_BY_ORDER,
        icon: ShoppingCart,
        badge: 'Soon',
      },
      { 
        title: 'Theo sản phẩm', 
        description: 'Sản phẩm bị trả nhiều nhất', 
        href: ROUTES.REPORTS.RETURNS_BY_PRODUCT,
        icon: Package,
        badge: 'Soon',
      },
    ],
  },
  {
    title: 'Báo cáo Thanh toán',
    description: 'Theo dõi dòng tiền và phương thức thanh toán',
    icon: Wallet,
    color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
    reports: [
      { 
        title: 'Theo thời gian', 
        description: 'Dòng tiền theo thời gian', 
        href: ROUTES.REPORTS.PAYMENT_BY_TIME,
        icon: Calendar,
        badge: 'Soon',
      },
      { 
        title: 'Theo phương thức', 
        description: 'So sánh các phương thức thanh toán', 
        href: ROUTES.REPORTS.PAYMENT_BY_METHOD,
        icon: Wallet,
        badge: 'Soon',
      },
      { 
        title: 'Theo chi nhánh', 
        description: 'Thanh toán theo từng chi nhánh', 
        href: ROUTES.REPORTS.PAYMENT_BY_BRANCH,
        icon: Building2,
        badge: 'Soon',
      },
    ],
  },
  {
    title: 'Báo cáo Tồn kho',
    description: 'Theo dõi hàng tồn kho và xuất nhập',
    icon: Package,
    color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
    reports: [
      { 
        title: 'Theo sản phẩm', 
        description: 'Tồn kho từng sản phẩm', 
        href: ROUTES.REPORTS.INVENTORY_BY_PRODUCT,
        icon: Package,
        badge: 'Soon',
      },
      { 
        title: 'Theo chi nhánh', 
        description: 'Tồn kho theo từng chi nhánh', 
        href: ROUTES.REPORTS.INVENTORY_BY_BRANCH,
        icon: Building2,
        badge: 'Soon',
      },
      { 
        title: 'Theo danh mục', 
        description: 'Tồn kho theo danh mục sản phẩm', 
        href: ROUTES.REPORTS.INVENTORY_BY_CATEGORY,
        icon: FileBarChart,
        badge: 'Soon',
      },
    ],
  },
];

export function ReportsIndexPage() {
  usePageHeader({
    title: 'Báo cáo',
    subtitle: 'Tổng quan tất cả các báo cáo kinh doanh',
    actions: [],
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header summary */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="p-3 rounded-full bg-primary/10">
          <AreaChart className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Trung tâm Báo cáo</h2>
          <p className="text-sm text-muted-foreground">
            Chọn loại báo cáo bạn muốn xem. Các báo cáo giúp bạn phân tích và đưa ra quyết định kinh doanh.
          </p>
        </div>
      </div>

      {/* Report groups */}
      <div className="grid gap-6">
        {reportGroups.map((group) => (
          <Card key={group.title}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${group.color}`}>
                  <group.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{group.title}</CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {group.reports.map((report) => (
                  <Link
                    key={report.href}
                    href={report.badge ? '#' : report.href}
                    className={report.badge ? 'pointer-events-none' : ''}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto py-3 px-4"
                      disabled={!!report.badge}
                    >
                      <report.icon className="h-4 w-4 mr-3 shrink-0" />
                      <div className="flex flex-col items-start text-left flex-1 min-w-0">
                        <div className="flex items-center gap-2 w-full">
                          <span className="font-medium truncate">{report.title}</span>
                          {report.badge && (
                            <Badge variant="secondary" className="text-xs shrink-0">
                              {report.badge}
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground truncate w-full">
                          {report.description}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 ml-2 shrink-0 opacity-50" />
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ReportsIndexPage;

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  MapPin,
  Users,
  Receipt,
  Tags,
  Printer,
  Warehouse,
  Settings2,
  Settings,
  Paintbrush,
  UserCog,
  Landmark,
  Truck,
  History,
  UsersIcon,
  Package,
  ShoppingCart,
  FileText,
  Download,
  Upload,
  Home,
  ChevronRight,
  ListChecks,
  MessageSquareWarning,
  ShieldCheck,
  Hash,
  TrendingUp,
  ListTodo,
  Globe,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { SettingsActionButton } from '../../components/settings/SettingsActionButton.tsx';
import { MobileSearchBar } from '../../components/mobile/mobile-search-bar.tsx';
import { useMediaQuery } from '../../lib/use-media-query.ts';
import { useSettingsPageHeader } from './use-settings-page-header.tsx';
import { Button } from '../../components/ui/button.tsx';

type SettingsItem = {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  badge?: 'new' | 'beta';
  iconColor?: string;
};


// Settings organized by logical categories
const basicSettings: SettingsItem[] = [
  { 
    icon: Store, 
    title: 'Thông tin cửa hàng', 
    description: 'Quản lý thông tin liên hệ, địa chỉ và logo của cửa hàng', 
    href: '/settings/store-info',
    iconColor: 'text-blue-600'
  },
  { 
    icon: MapPin, 
    title: 'Tỉnh thành - Quận huyện', 
    description: 'Quản lý danh sách tỉnh thành, quận huyện, phường xã', 
    href: '/settings/provinces',
    iconColor: 'text-green-600'
  },
  { 
    icon: Users, 
    title: 'Nhân viên & Phân quyền', 
    description: 'Quản lý tài khoản và phân quyền nhân viên', 
    href: '/settings/employee-roles',
    iconColor: 'text-purple-600'
  },
  { 
    icon: UserCog, 
    title: 'Cài đặt nhân viên', 
    description: 'Quy định về giờ làm việc, nghỉ phép, lương thưởng, loại phạt', 
    href: '/settings/employees',
    iconColor: 'text-indigo-600'
  },
];

const businessSettings: SettingsItem[] = [
  { 
    icon: Settings, 
    title: 'Cấu hình bán hàng', 
    description: 'Thiết lập quy trình và chính sách bán hàng', 
    href: '/settings/sales-config',
    iconColor: 'text-orange-600'
  },
  { 
    icon: UsersIcon, 
    title: 'Cài đặt khách hàng', 
    description: 'Quản lý loại khách hàng, nhóm, nguồn và xếp hạng', 
    href: '/settings/customers',
    iconColor: 'text-pink-600'
  },
  { 
    icon: Package, 
    title: 'Quản lý kho & Sản phẩm', 
    description: 'Cấu hình thông tin sản phẩm và quản lý kho', 
    href: '/settings/inventory',
    iconColor: 'text-amber-600'
  },
  { 
    icon: Tags, 
    title: 'Chính sách giá', 
    description: 'Tạo và quản lý các chính sách giá bán', 
    href: '/settings/pricing',
    iconColor: 'text-emerald-600'
  },
];

const financialSettings: SettingsItem[] = [
  { 
    icon: Landmark, 
    title: 'Cài đặt thanh toán', 
    description: 'Quản lý phiếu thu chi và hình thức thanh toán', 
    href: '/settings/payments',
    iconColor: 'text-teal-600'
  },
  { 
    icon: Receipt, 
    title: 'Thuế', 
    description: 'Cấu hình các mức thuế suất đầu vào và đầu ra', 
    href: '/settings/taxes',
    iconColor: 'text-cyan-600'
  },
];

const operationalSettings: SettingsItem[] = [
  { 
    icon: Globe, 
    title: 'Website phukiengiaxuong.com.vn', 
    description: 'Đồng bộ sản phẩm, danh mục, thương hiệu với website PKGX', 
    href: '/settings/pkgx',
    badge: 'new' as const,
    iconColor: 'text-rose-600'
  },
  { 
    icon: Globe, 
    title: 'Website Trendtech', 
    description: 'Đồng bộ sản phẩm với website Trendtech (Next.js)', 
    href: '/settings/trendtech',
    badge: 'new' as const,
    iconColor: 'text-blue-600'
  },
  { 
    icon: Truck, 
    title: 'Cài đặt vận chuyển', 
    description: 'Quản lý đối tác và hình thức vận chuyển', 
    href: '/settings/shipping',
    badge: 'new' as const,
    iconColor: 'text-violet-600'
  },
  { 
    icon: ListTodo, 
    title: 'Công việc', 
    description: 'Cấu hình SLA, mẫu công việc, bằng chứng và thông báo', 
    href: '/settings/tasks',
    badge: 'new' as const,
    iconColor: 'text-purple-600'
  },
  { 
    icon: MessageSquareWarning, 
    title: 'Khiếu nại', 
    description: 'Cấu hình SLA, mẫu phản hồi và thông báo khiếu nại', 
    href: '/settings/complaints',
    badge: 'new' as const,
    iconColor: 'text-red-600'
  },
  { 
    icon: ShieldCheck, 
    title: 'Bảo hành', 
    description: 'Cấu hình SLA, mẫu phản hồi và thông báo bảo hành', 
    href: '/settings/warranty',
    badge: 'new' as const,
    iconColor: 'text-blue-600'
  },
  { 
    icon: ListChecks, 
    title: 'Quy trình', 
    description: 'Cài đặt quy trình xử lý cho bảo hành và các chức năng khác', 
    href: '/settings/workflow-templates',
    iconColor: 'text-indigo-600'
  },
  { 
    icon: Printer, 
    title: 'Mẫu in', 
    description: 'Thiết lập và tùy chỉnh mẫu in theo chi nhánh', 
    href: '/settings/print-templates',
    iconColor: 'text-slate-600'
  },
  { 
    icon: History, 
    title: 'Lịch sử nhập xuất', 
    description: 'Xem lịch sử import/export dữ liệu', 
    href: '/settings/import-export-logs',
    iconColor: 'text-gray-600'
  },
];

const systemSettings: SettingsItem[] = [
  { 
    icon: Hash, 
    title: 'Quản lý ID & Prefix', 
    description: 'Cấu hình prefix, counter và kiểm tra số thứ tự cho tất cả entities', 
    href: '/settings/id-counters',
    badge: 'new' as const,
    iconColor: 'text-blue-600'
  },
  { 
    icon: History, 
    title: 'Nhật ký hệ thống', 
    description: 'Theo dõi lịch sử hoạt động và thay đổi', 
    href: '/settings/system-logs',
    iconColor: 'text-stone-600'
  },
  { 
    icon: Paintbrush, 
    title: 'Giao diện', 
    description: 'Tùy chỉnh theme và giao diện ứng dụng', 
    href: '/settings/appearance',
    iconColor: 'text-fuchsia-600'
  },
  { 
    icon: Settings2, 
    title: 'Cài đặt khác', 
    description: 'Các thiết lập nâng cao và cấu hình hệ thống', 
    href: '/settings/other',
    iconColor: 'text-gray-500'
  },
];

type SettingsSectionId = 'basic' | 'business' | 'financial' | 'operational' | 'system';

type SettingsSection = {
  id: SettingsSectionId;
  label: string;
  description: string;
  accentClass: string;
  items: SettingsItem[];
};

type SettingsTableItem = SettingsItem & {
  sectionId: SettingsSectionId;
  sectionLabel: string;
  sectionAccent: string;
};

const settingsSections: SettingsSection[] = [
  {
    id: 'basic',
    label: 'Cài đặt cơ bản',
    description: 'Thông tin cơ bản về cửa hàng và nhân viên',
    accentClass: 'bg-blue-600',
    items: basicSettings,
  },
  {
    id: 'business',
    label: 'Cài đặt kinh doanh',
    description: 'Cấu hình bán hàng, khách hàng và sản phẩm',
    accentClass: 'bg-orange-600',
    items: businessSettings,
  },
  {
    id: 'financial',
    label: 'Cài đặt tài chính',
    description: 'Quản lý thanh toán và thuế',
    accentClass: 'bg-teal-600',
    items: financialSettings,
  },
  {
    id: 'operational',
    label: 'Cài đặt vận hành',
    description: 'Quy trình, SLA và các tác vụ hỗ trợ',
    accentClass: 'bg-violet-600',
    items: operationalSettings,
  },
  {
    id: 'system',
    label: 'Cài đặt hệ thống',
    description: 'Nhật ký, giao diện và cấu hình ID',
    accentClass: 'bg-gray-600',
    items: systemSettings,
  },
];

const settingsTableData: SettingsTableItem[] = settingsSections.flatMap((section) =>
  section.items.map((item) => ({
    ...item,
    sectionId: section.id,
    sectionLabel: section.label,
    sectionAccent: section.accentClass,
  }))
);

export function SettingsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const isMobile = !useMediaQuery("(min-width: 768px)");
  const navigate = useNavigate();
  const filteredSettings = React.useMemo(() => {
    if (!searchQuery) return settingsTableData;
    const lowercasedQuery = searchQuery.toLowerCase();
    return settingsTableData.filter((setting) =>
      setting.title.toLowerCase().includes(lowercasedQuery) ||
      setting.description.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery]);
  
  useSettingsPageHeader({
    title: 'Cài đặt hệ thống',
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Cài đặt', href: '/settings', isCurrent: true }
    ],
    actions: [
      <SettingsActionButton key="import" variant="outline">
        <Upload className="h-4 w-4" />
        {!isMobile && 'Import'}
      </SettingsActionButton>,
      <SettingsActionButton key="export" variant="outline">
        <Download className="h-4 w-4" />
        {!isMobile && 'Export'}
      </SettingsActionButton>
    ]
  });

  const handleNavigate = React.useCallback((href: string) => {
    navigate(href);
  }, [navigate]);

  return (
    <div className="space-y-4">
      {/* Search Bar - Mobile Optimized */}
      <MobileSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder={isMobile ? "Tìm kiếm cài đặt..." : "Tìm kiếm theo tên hoặc mô tả cấu hình..."}
      />

      {/* Settings Groups */}
      {settingsSections.map((section) => {
          const sectionItems = section.items.filter((item) => {
            if (!searchQuery) return true;
            const lowercasedQuery = searchQuery.toLowerCase();
            return (
              item.title.toLowerCase().includes(lowercasedQuery) ||
              item.description.toLowerCase().includes(lowercasedQuery)
            );
          });

          if (sectionItems.length === 0) return null;

          return (
            <div key={section.id} className="space-y-4">
              {/* Section Header */}
              <div className="flex items-center gap-2">
                <div className={`h-1 w-6 rounded-full ${section.accentClass}`} />
                <div>
                  <h2 className="text-h5 font-semibold">{section.label}</h2>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </div>

              {/* Settings Cards Grid */}
              <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
                {sectionItems.map((item) => {
                  return (
                    <Card
                      key={item.href}
                      className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                      onClick={() => handleNavigate(item.href)}
                    >
                      <CardHeader className="p-4 pb-2 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-h6 font-semibold leading-tight group-hover:text-primary transition-colors">
                            {item.title}
                          </CardTitle>
                          {item.badge && (
                            <Badge variant={item.badge === 'new' ? 'default' : 'secondary'} className="text-xs h-5">
                              {item.badge === 'new' ? 'Mới' : 'Beta'}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <CardDescription className="text-xs line-clamp-2 leading-relaxed">
                          {item.description}
                        </CardDescription>
                        <div className="mt-2 flex items-center text-xs text-muted-foreground group-hover:text-primary transition-colors">
                          <span>Cấu hình</span>
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* No Results */}
        {filteredSettings.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Settings2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-h4 font-semibold mb-2">Không tìm thấy cài đặt</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Không có cài đặt nào khớp với từ khóa "<strong>{searchQuery}</strong>". Vui lòng thử lại với từ khóa khác.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                Xóa bộ lọc
              </Button>
            </CardContent>
          </Card>
        )}
    </div>
  );
}

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
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { Separator } from '../../components/ui/separator.tsx';
import { Button } from '../../components/ui/button.tsx';
import { ResponsiveContainer } from '../../components/mobile/responsive-container.tsx';
import { MobileSearchBar } from '../../components/mobile/mobile-search-bar.tsx';
import { useMediaQuery } from '../../lib/use-media-query.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';

type SettingsCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  badge?: 'new' | 'beta';
  iconColor?: string;
};

const SettingsCard: React.FC<SettingsCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  href, 
  badge,
  iconColor = 'text-primary'
}) => {
  const navigate = useNavigate();
  const isMobile = !useMediaQuery("(min-width: 768px)");

  const handleCardClick = () => {
    navigate(href);
  };

  return (
    <Card
      onClick={handleCardClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick()}
      tabIndex={0}
      role="button"
      className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none h-full"
    >
      <CardHeader className={isMobile ? 'p-3' : 'p-3.5'}>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className={`rounded-md p-1 ${isMobile ? 'bg-primary/10' : 'bg-primary/5 group-hover:bg-primary/10'} transition-colors`}>
              <Icon className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} ${iconColor}`} />
            </div>
            <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold group-hover:text-primary transition-colors`}>
              {title}
            </CardTitle>
          </div>
          {badge && (
            <Badge variant={badge === 'new' ? 'destructive' : 'secondary'} className="text-[9px] h-4 px-1">
              {badge === 'new' ? 'Mới' : 'Beta'}
            </Badge>
          )}
        </div>
        <CardDescription className={`${isMobile ? 'text-[11px]' : 'text-xs'} leading-relaxed line-clamp-2`}>
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};


// Settings organized by logical categories
const basicSettings = [
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
    description: 'Quy định về giờ làm việc, nghỉ phép, lương thưởng', 
    href: '/settings/employees',
    iconColor: 'text-indigo-600'
  },
];

const businessSettings = [
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
    href: '/customers/settings',
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

const financialSettings = [
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

const operationalSettings = [
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

const systemSettings = [
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

export function SettingsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const isMobile = !useMediaQuery("(min-width: 768px)");
  const navigate = useNavigate();
  
  usePageHeader({
    title: 'Cài đặt hệ thống',
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Cài đặt', href: '/settings', isCurrent: true }
    ],
    actions: [
      <Button key="import" variant="outline" size={isMobile ? "sm" : "default"}>
        <Upload className="h-4 w-4 mr-2" />
        {!isMobile && 'Import'}
      </Button>,
      <Button key="export" variant="outline" size={isMobile ? "sm" : "default"}>
        <Download className="h-4 w-4 mr-2" />
        {!isMobile && 'Export'}
      </Button>
    ]
  });

  const allSettings = [
    ...basicSettings,
    ...businessSettings,
    ...financialSettings,
    ...operationalSettings,
    ...systemSettings
  ];

  const filterSettings = (settings: typeof basicSettings) => {
    if (!searchQuery) return settings;
    const lowercasedQuery = searchQuery.toLowerCase();
    return settings.filter(s => 
      s.title.toLowerCase().includes(lowercasedQuery) || 
      s.description.toLowerCase().includes(lowercasedQuery)
    );
  };

  const filteredBasicSettings = filterSettings(basicSettings);
  const filteredBusinessSettings = filterSettings(businessSettings);
  const filteredFinancialSettings = filterSettings(financialSettings);
  const filteredOperationalSettings = filterSettings(operationalSettings);
  const filteredSystemSettings = filterSettings(systemSettings);

  const hasResults = searchQuery === '' || 
    filteredBasicSettings.length > 0 ||
    filteredBusinessSettings.length > 0 ||
    filteredFinancialSettings.length > 0 ||
    filteredOperationalSettings.length > 0 ||
    filteredSystemSettings.length > 0;

  return (
    <ResponsiveContainer maxWidth="full" padding={isMobile ? "sm" : "md"}>
      <div className="space-y-6">
        {/* Search Bar - Mobile Optimized */}
        <MobileSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={isMobile ? "Tìm kiếm cài đặt..." : "Tìm kiếm theo tên hoặc mô tả cấu hình..."}
        />

        {!hasResults && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Không tìm thấy cài đặt nào phù hợp</p>
          </div>
        )}

        {/* Basic Settings Section */}
        {(searchQuery === '' || filteredBasicSettings.length > 0) && (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-blue-600 rounded-full" />
              <div>
                <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-foreground`}>
                  Cài đặt cơ bản
                </h2>
                <p className="text-sm text-muted-foreground">
                  Thông tin cơ bản về cửa hàng và nhân viên
                </p>
              </div>
            </div>
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
              {filteredBasicSettings.map(setting => 
                <SettingsCard key={setting.title} {...setting} />
              )}
            </div>
          </section>
        )}

        {(searchQuery === '' || filteredBusinessSettings.length > 0) && (
          <>
            <Separator />
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-orange-600 rounded-full" />
                <div>
                  <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-foreground`}>
                    Cài đặt kinh doanh
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Cấu hình bán hàng, khách hàng và sản phẩm
                  </p>
                </div>
              </div>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                {filteredBusinessSettings.map(setting => 
                  <SettingsCard key={setting.title} {...setting} />
                )}
              </div>
            </section>
          </>
        )}

        {(searchQuery === '' || filteredFinancialSettings.length > 0) && (
          <>
            <Separator />
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-teal-600 rounded-full" />
                <div>
                  <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-foreground`}>
                    Cài đặt tài chính
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Quản lý thanh toán và thuế
                  </p>
                </div>
              </div>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                {filteredFinancialSettings.map(setting => 
                  <SettingsCard key={setting.title} {...setting} />
                )}
              </div>
            </section>
          </>
        )}

        {(searchQuery === '' || filteredOperationalSettings.length > 0) && (
          <>
            <Separator />
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-violet-600 rounded-full" />
                <div>
                  <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-foreground`}>
                    Cài đặt vận hành
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Vận chuyển, in ấn và lịch sử hoạt động
                  </p>
                </div>
              </div>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                {filteredOperationalSettings.map(setting => 
                  <SettingsCard key={setting.title} {...setting} />
                )}
              </div>
            </section>
          </>
        )}

        {(searchQuery === '' || filteredSystemSettings.length > 0) && (
          <>
            <Separator />
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-gray-600 rounded-full" />
                <div>
                  <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-foreground`}>
                    Cài đặt hệ thống
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Nhật ký, giao diện và các thiết lập nâng cao
                  </p>
                </div>
              </div>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                {filteredSystemSettings.map(setting => 
                  <SettingsCard key={setting.title} {...setting} />
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </ResponsiveContainer>
  );
}

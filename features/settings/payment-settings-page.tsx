import * as React from 'react';
import { Plus, FileText, Wallet, Users, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs.tsx';
import { Button } from '../../components/ui/button.tsx';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { ReceiptTypesPageContent } from './receipt-types/page-content.tsx';
import { PaymentTypesPageContent } from './payments/types/page-content.tsx';
import { PaymentMethodsPageContent } from './payments/methods/page-content.tsx';
import { TargetGroupsPageContent } from './target-groups/page-content.tsx';
import { CashAccountsPageContent } from './cash-accounts/page-content.tsx';

export function PaymentSettingsPage() {
  const [activeTab, setActiveTab] = React.useState('receipt-types');

  // ✅ No header actions - managed by tab content
  usePageHeader({
    title: 'Cài đặt thanh toán',
    subtitle: 'Quản lý phiếu thu chi và hình thức thanh toán',
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Cài đặt', href: '/settings' },
      { label: 'Cài đặt thanh toán', href: '/settings/payments', isCurrent: true },
    ],
  });

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="w-full overflow-x-auto overflow-y-hidden mb-4 pb-1">
          <TabsList className="inline-flex w-auto gap-1 p-1 h-auto justify-start">
            <TabsTrigger value="receipt-types" className="flex-shrink-0">
              Loại phiếu thu
            </TabsTrigger>
            <TabsTrigger value="payment-types" className="flex-shrink-0">
              Loại phiếu chi
            </TabsTrigger>
            <TabsTrigger value="payment-methods" className="flex-shrink-0">
              Hình thức thanh toán
            </TabsTrigger>
            <TabsTrigger value="cash-accounts" className="flex-shrink-0">
              Tài khoản quỹ
            </TabsTrigger>
            <TabsTrigger value="target-groups" className="flex-shrink-0">
              Nhóm đối tượng
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="receipt-types">
          <Card>
            <CardHeader>
              <CardTitle>Loại phiếu thu</CardTitle>
              <CardDescription>
                Quản lý các loại phiếu thu: Thu từ khách hàng, Thu khác...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReceiptTypesPageContent />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-types">
          <Card>
            <CardHeader>
              <CardTitle>Loại phiếu chi</CardTitle>
              <CardDescription>
                Quản lý các loại phiếu chi: Chi cho nhà cung cấp, Chi lương, Chi khác...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentTypesPageContent />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods">
          <Card>
            <CardHeader>
              <CardTitle>Hình thức thanh toán</CardTitle>
              <CardDescription>
                Quản lý các hình thức thanh toán: Tiền mặt, Chuyển khoản, Ví điện tử...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentMethodsPageContent />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-accounts">
          <Card>
            <CardHeader>
              <CardTitle>Tài khoản quỹ</CardTitle>
              <CardDescription>
                Quản lý các tài khoản quỹ tiền mặt và ngân hàng của doanh nghiệp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CashAccountsPageContent />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="target-groups">
          <Card>
            <CardHeader>
              <CardTitle>Nhóm đối tượng</CardTitle>
              <CardDescription>
                Quản lý các nhóm đối tượng: Khách hàng, Nhà cung cấp, Nhân viên, Đối tác...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TargetGroupsPageContent />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

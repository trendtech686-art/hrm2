import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { TabsContent } from '../../components/ui/tabs.tsx';
import { useSettingsPageHeader } from './use-settings-page-header.tsx';
import { ReceiptTypesPageContent } from './receipt-types/page-content.tsx';
import { PaymentTypesPageContent } from './payments/types/page-content.tsx';
import { PaymentMethodsPageContent } from './payments/methods/page-content.tsx';
import { TargetGroupsPageContent } from './target-groups/page-content.tsx';
import { CashAccountsPageContent } from './cash-accounts/page-content.tsx';
import { useTabActionRegistry } from './use-tab-action-registry.ts';
import { SettingsVerticalTabs } from '../../components/settings/SettingsVerticalTabs.tsx';

export function PaymentSettingsPage() {
  const [activeTab, setActiveTab] = React.useState('receipt-types');
  const { headerActions, registerActions } = useTabActionRegistry(activeTab);
  const registerReceiptTypesActions = React.useMemo(() => registerActions('receipt-types'), [registerActions]);
  const registerPaymentTypesActions = React.useMemo(() => registerActions('payment-types'), [registerActions]);
  const registerPaymentMethodsActions = React.useMemo(() => registerActions('payment-methods'), [registerActions]);
  const registerCashAccountsActions = React.useMemo(() => registerActions('cash-accounts'), [registerActions]);
  const registerTargetGroupsActions = React.useMemo(() => registerActions('target-groups'), [registerActions]);

  useSettingsPageHeader({
    title: 'Cài đặt thanh toán',
    subtitle: 'Quản lý phiếu thu chi và hình thức thanh toán',
    actions: headerActions,
  });

  const tabs = React.useMemo(
    () => [
      { value: 'receipt-types', label: 'Loại phiếu thu' },
      { value: 'payment-types', label: 'Loại phiếu chi' },
      { value: 'payment-methods', label: 'Hình thức thanh toán' },
      { value: 'cash-accounts', label: 'Tài khoản quỹ' },
      { value: 'target-groups', label: 'Nhóm đối tượng' },
    ],
    [],
  );

  return (
    <SettingsVerticalTabs value={activeTab} onValueChange={setActiveTab} tabs={tabs}>
        <TabsContent value="receipt-types" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Loại phiếu thu</CardTitle>
              <CardDescription>
                Quản lý các loại phiếu thu: Thu từ khách hàng, Thu khác...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReceiptTypesPageContent
                isActive={activeTab === 'receipt-types'}
                onRegisterActions={registerReceiptTypesActions}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-types" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Loại phiếu chi</CardTitle>
              <CardDescription>
                Quản lý các loại phiếu chi: Chi cho nhà cung cấp, Chi lương, Chi khác...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentTypesPageContent
                isActive={activeTab === 'payment-types'}
                onRegisterActions={registerPaymentTypesActions}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Hình thức thanh toán</CardTitle>
              <CardDescription>
                Quản lý các hình thức thanh toán: Tiền mặt, Chuyển khoản, Ví điện tử...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentMethodsPageContent
                isActive={activeTab === 'payment-methods'}
                onRegisterActions={registerPaymentMethodsActions}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-accounts" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Tài khoản quỹ</CardTitle>
              <CardDescription>
                Quản lý các tài khoản quỹ tiền mặt và ngân hàng của doanh nghiệp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CashAccountsPageContent
                isActive={activeTab === 'cash-accounts'}
                onRegisterActions={registerCashAccountsActions}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="target-groups" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Nhóm đối tượng</CardTitle>
              <CardDescription>
                Quản lý các nhóm đối tượng: Khách hàng, Nhà cung cấp, Nhân viên, Đối tác...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TargetGroupsPageContent
                isActive={activeTab === 'target-groups'}
                onRegisterActions={registerTargetGroupsActions}
              />
            </CardContent>
          </Card>
        </TabsContent>
    </SettingsVerticalTabs>
  );
}

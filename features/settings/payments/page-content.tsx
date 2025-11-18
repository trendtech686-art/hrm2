import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs.tsx';
import { CreditCard, Receipt } from 'lucide-react';
import { PaymentMethodsPageContent } from './methods/page-content.tsx';
import { PaymentTypesPageContent } from './types/page-content.tsx';

export function PaymentsSettingsPageContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Cài đặt thanh toán</h2>
        <p className="text-muted-foreground">
          Quản lý phương thức thanh toán và loại phiếu chi
        </p>
      </div>

      <Tabs defaultValue="methods" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="methods" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Phương thức thanh toán
          </TabsTrigger>
          <TabsTrigger value="types" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Loại phiếu chi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="methods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phương thức thanh toán</CardTitle>
              <CardDescription>
                Quản lý các phương thức thanh toán như tiền mặt, chuyển khoản, thẻ tín dụng, v.v.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentMethodsPageContent />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loại phiếu chi</CardTitle>
              <CardDescription>
                Quản lý các loại phiếu chi để phân loại mục đích chi tiền
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentTypesPageContent />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
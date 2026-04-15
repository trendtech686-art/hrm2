'use client'

import * as React from 'react';
import { useSettingsPageHeader } from './use-settings-page-header';
import { Card, CardContent } from '../../components/ui/card';
import { SettingsPlaceholder } from '../../components/settings/SettingsPlaceholder';
import { ReceiptCent } from 'lucide-react';

export function TaxesPage() {
  useSettingsPageHeader({ title: 'Thuế' });

  return (
    <Card>
      <CardContent className="p-6">
        <SettingsPlaceholder
          icon={ReceiptCent}
          title="Quản lý thuế"
          description="Vui lòng sử dụng trang Giá & Thuế để quản lý thuế"
        >
          <p>
            Quản lý thuế đã được gộp vào trang <strong>Cài đặt &gt; Chính sách giá</strong>.
          </p>
        </SettingsPlaceholder>
      </CardContent>
    </Card>
  );
}

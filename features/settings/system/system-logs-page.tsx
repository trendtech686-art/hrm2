import * as React from 'react';
import { SettingsPlaceholder } from '../../../components/settings/SettingsPlaceholder';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { Card, CardContent } from '../../../components/ui/card';
import { History } from 'lucide-react';

export function SystemLogsPage() {
  useSettingsPageHeader({
    title: 'Nhật ký hệ thống',
  });

  return (
    <Card>
      <CardContent className="p-6">
        <SettingsPlaceholder
          icon={History}
          title="Nhật ký hệ thống"
          description="Chức năng đang được phát triển"
        >
          <p>
            Tính năng nhật ký sẽ ghi nhận thao tác cấu hình, đăng nhập và activity quan trọng để phục vụ audit nội bộ.
            Chúng tôi đang hoàn thiện bộ lọc theo thời gian và export CSV.
          </p>
        </SettingsPlaceholder>
      </CardContent>
    </Card>
  );
}

import * as React from 'react';
import { Card, CardContent } from './card';

interface PlaceholderTabContentProps {
  title: string;
  description?: string;
}

/**
 * PlaceholderTabContent - Component hiển thị tab đang phát triển
 * 
 * Sử dụng cho các tab chưa implement
 * 
 * @example
 * ```tsx
 * <TabsContent value="kpi">
 *   <PlaceholderTabContent 
 *     title="Đánh giá KPI" 
 *     description="Tính năng quản lý đánh giá KPI sẽ sớm được ra mắt"
 *   />
 * </TabsContent>
 * ```
 */
export function PlaceholderTabContent({ 
  title, 
  description = "Chức năng đang được phát triển." 
}: PlaceholderTabContentProps) {
  return (
    <Card className="mt-4">
      <CardContent className="p-0">
        <div className="flex h-40 items-center justify-center rounded-lg border-dashed">
          <div className="flex flex-col items-center gap-1 text-center text-muted-foreground">
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className="text-sm">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

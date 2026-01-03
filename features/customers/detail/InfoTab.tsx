'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { formatDate as formatDateUtil } from '@/lib/date-utils';
import { sanitizeToText } from '@/lib/sanitize';
import { ExternalLink, HelpCircle } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { ProgressiveImage } from '../../../components/ui/progressive-image';
import { CopyableText } from '../../../components/shared/copy-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';
import { 
  getHealthScoreLevel, 
  getSegmentLabel, 
  getSegmentBadgeVariant,
  type CustomerSegment,
} from '../intelligence-utils';
import { getLifecycleStageVariant } from '../lifecycle-utils';
import type { Customer, CustomerLifecycleStage } from '@/lib/types/prisma-extended';
import { formatCurrency } from './types';

// Simple detail item component - no icons for cleaner look
const DetailItem = ({ label, value, onClick, className = '' }: { 
  label: string; 
  value?: React.ReactNode; 
  onClick?: (() => void) | undefined;
  className?: string;
}) => (
  <div className={`space-y-1 ${className}`}>
    <dt className="text-body-sm text-muted-foreground">{label}</dt>
    <dd 
      className={`text-body-sm font-medium ${onClick ? 'text-primary hover:underline cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {value !== null && value !== undefined && value !== '' ? value : '—'}
    </dd>
  </div>
);

export interface InfoTabProps {
  customer: Customer;
  currentDebt: number;
  daysSinceLastPurchase: number | null;
  realtimeHealthScore: number;
  realtimeChurnRisk: { label: string; reason: string; variant: "default" | "secondary" | "destructive" | "outline" | "warning" | "success" } | null;
  realtimeRFMScores: { recency: number; frequency: number; monetary: number } | null;
  realtimeSegment: string | null;
  realtimeLifecycleStage: string | null;
  // Lookup functions
  getTypeName: (id?: string) => string | undefined;
  getGroupName: (id?: string) => string | undefined;
  getSourceName: (id?: string) => string | undefined;
  getEmployeeName: (id?: string) => string | undefined;
  findCustomerById: (id: string) => Customer | null | undefined;
}

export function InfoTab({
  customer,
  currentDebt,
  daysSinceLastPurchase,
  realtimeHealthScore,
  realtimeChurnRisk,
  realtimeRFMScores,
  realtimeSegment,
  realtimeLifecycleStage,
  getTypeName,
  getGroupName,
  getSourceName,
  getEmployeeName,
  findCustomerById,
}: InfoTabProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Images Section */}
      {customer.images && customer.images.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-body-base font-medium">Hình ảnh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {customer.images.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(url, '_blank')}
                >
                  <ProgressiveImage
                    src={url}
                    alt={`${customer.name} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && (
                    <Badge className="absolute top-1.5 left-1.5 text-body-xs" variant="secondary">
                      Chính
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Thông tin cơ bản - Grid layout clean với icon copy */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-body-base font-medium">Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
            <CopyableText label="Mã khách hàng" value={customer.id} />
            <CopyableText label="Tên khách hàng" value={customer.name} />
            <CopyableText label="Email" value={customer.email} />
            <CopyableText label="Số điện thoại" value={customer.phone} />
            <CopyableText label="Zalo" value={customer.zaloPhone} />
          </dl>
        </CardContent>
      </Card>

      {/* Phân loại */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-body-base font-medium">Phân loại</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
            <DetailItem label="Loại khách hàng" value={getTypeName(customer.type)} />
            <DetailItem label="Nhóm khách hàng" value={getGroupName(customer.customerGroup)} />
            <DetailItem label="Nguồn" value={getSourceName(customer.source)} />
            <DetailItem label="Chiến dịch" value={customer.campaign} />
            <DetailItem 
              label="Người giới thiệu" 
              value={customer.referredBy ? findCustomerById(customer.referredBy)?.name : undefined}
              onClick={customer.referredBy ? () => router.push(`/customers/${customer.referredBy}`) : undefined}
            />
            <DetailItem label="Bảng giá" value={customer.pricingLevel} />
          </dl>
        </CardContent>
      </Card>

      {/* Chỉ số khách hàng - Tính toán REALTIME */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-body-base font-medium">Chỉ số khách hàng</CardTitle>
          <p className="text-body-xs text-muted-foreground mt-1">Phân tích hành vi mua hàng để đánh giá mức độ trung thành và rủi ro (tính toán realtime)</p>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-4">
            {/* Điểm sức khỏe KH - với Tooltip */}
            <div className="space-y-1">
              <dt className="text-body-sm text-muted-foreground flex items-center gap-1">
                Điểm sức khỏe KH
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="text-body-xs space-y-1">
                        <p className="font-semibold">Cách tính điểm (tổng 100):</p>
                        <ul className="list-disc list-inside space-y-0.5">
                          <li><strong>Recency (30đ):</strong> Thời gian từ lần mua gần nhất</li>
                          <li><strong>Frequency (25đ):</strong> Tổng số đơn hàng</li>
                          <li><strong>Monetary (30đ):</strong> Tổng chi tiêu</li>
                          <li><strong>Payment (15đ):</strong> Tỷ lệ sử dụng hạn mức công nợ</li>
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </dt>
              <dd>
                <span className={`text-h4 font-bold ${realtimeHealthScore >= 70 ? 'text-green-600' : realtimeHealthScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {realtimeHealthScore}/100
                </span>
                <p className="text-body-xs text-muted-foreground mt-1">
                  {getHealthScoreLevel(realtimeHealthScore).label}
                </p>
              </dd>
            </div>

            {/* Vòng đời khách hàng */}
            <div className="space-y-1">
              <dt className="text-body-sm text-muted-foreground">Vòng đời</dt>
              <dd>
                <Badge variant={getLifecycleStageVariant(realtimeLifecycleStage as CustomerLifecycleStage | undefined)}>{realtimeLifecycleStage}</Badge>
                <p className="text-body-xs text-muted-foreground mt-1">
                  {daysSinceLastPurchase !== null 
                    ? `Mua cách đây ${daysSinceLastPurchase} ngày`
                    : 'Chưa mua hàng'}
                </p>
              </dd>
            </div>

            {/* Phân khúc RFM */}
            {realtimeSegment && (
              <div className="space-y-1">
                <dt className="text-body-sm text-muted-foreground">Phân khúc RFM</dt>
                <dd>
                  <Badge variant={getSegmentBadgeVariant(realtimeSegment as CustomerSegment)}>{getSegmentLabel(realtimeSegment as CustomerSegment)}</Badge>
                  <p className="text-body-xs text-muted-foreground mt-1">{realtimeSegment}</p>
                </dd>
              </div>
            )}

            {/* Điểm RFM */}
            {realtimeRFMScores && (
              <div className="space-y-1">
                <dt className="text-body-sm text-muted-foreground">Điểm RFM</dt>
                <dd>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" title="Recency - Thời gian từ lần mua gần nhất (1-5, cao = mua gần đây)">R: {realtimeRFMScores.recency}</Badge>
                    <Badge variant="outline" title="Frequency - Tần suất mua hàng (1-5, cao = mua thường xuyên)">F: {realtimeRFMScores.frequency}</Badge>
                    <Badge variant="outline" title="Monetary - Giá trị đơn hàng (1-5, cao = chi tiêu nhiều)">M: {realtimeRFMScores.monetary}</Badge>
                  </div>
                </dd>
              </div>
            )}

            {/* Rủi ro rời bỏ */}
            {realtimeChurnRisk && (
              <div className="space-y-1">
                <dt className="text-body-sm text-muted-foreground flex items-center gap-1">
                  Rủi ro rời bỏ
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-sm p-4">
                        <div className="text-body-xs space-y-3">
                          <p className="font-semibold text-base">Cách tính điểm sức khỏe (Health Score):</p>
                          
                          <div className="space-y-1">
                            <p className="font-medium">1. Recency (Thời gian mua gần nhất) - Tối đa 30đ:</p>
                            <ul className="list-disc list-inside pl-1 text-muted-foreground">
                              <li>Mua trong 7 ngày: +30đ</li>
                              <li>Mua trong 30 ngày: +25đ</li>
                              <li>...giảm dần...</li>
                              <li>Trên 1 năm: +5đ</li>
                            </ul>
                          </div>

                          <div className="space-y-1">
                            <p className="font-medium">2. Frequency (Tần suất mua) - Tối đa 25đ:</p>
                            <ul className="list-disc list-inside pl-1 text-muted-foreground">
                              <li>Trên 20 đơn: +25đ</li>
                              <li>Trên 10 đơn: +20đ</li>
                              <li>...giảm dần...</li>
                            </ul>
                          </div>

                          <div className="space-y-1">
                            <p className="font-medium">3. Monetary (Tổng chi tiêu) - Tối đa 30đ:</p>
                            <ul className="list-disc list-inside pl-1 text-muted-foreground">
                              <li>Trên 500 triệu: +30đ</li>
                              <li>Trên 200 triệu: +25đ</li>
                              <li>...giảm dần...</li>
                            </ul>
                          </div>

                          <div className="space-y-1">
                            <p className="font-medium">4. Payment Behavior (Hành vi thanh toán) - Tối đa 15đ:</p>
                            <p className="text-muted-foreground mb-1">Dựa trên tỷ lệ nợ hiện tại / hạn mức tín dụng.</p>
                            <ul className="list-disc list-inside pl-1 text-muted-foreground">
                              <li>Dùng &lt; 20% hạn mức: +15đ (Tốt)</li>
                              <li>Dùng &gt; 80% hạn mức: 0đ (Rủi ro)</li>
                              <li>Nếu không có hạn mức nợ: Mặc định +15đ</li>
                            </ul>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </dt>
                <dd>
                  <Badge variant={realtimeChurnRisk.variant}>
                    {realtimeChurnRisk.label}
                  </Badge>
                  <p className="text-body-xs text-muted-foreground mt-1">
                    {realtimeChurnRisk.reason}
                  </p>
                </dd>
              </div>
            )}

            {/* Tỷ lệ công nợ/Hạn mức */}
            {customer.maxDebt && customer.maxDebt > 0 && (
              <div className="space-y-1">
                <dt className="text-body-sm text-muted-foreground">Tỷ lệ công nợ/Hạn mức</dt>
                <dd>
                  {(() => {
                    const debtRatio = ((currentDebt || 0) / customer.maxDebt) * 100;
                    const variant = debtRatio >= 90 ? 'destructive' : debtRatio >= 70 ? 'warning' : 'success';
                    return (
                      <>
                        <span className={`text-h4 font-bold ${variant === 'destructive' ? 'text-red-600' : variant === 'warning' ? 'text-yellow-600' : 'text-green-600'}`}>
                          {debtRatio.toFixed(0)}%
                        </span>
                        <p className="text-body-xs text-muted-foreground mt-1">
                          {formatCurrency(currentDebt)} / {formatCurrency(customer.maxDebt)}
                        </p>
                      </>
                    );
                  })()}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Ngân hàng & Mạng xã hội */}
      {(customer.bankName || customer.bankAccount || customer.social?.website || customer.social?.facebook || customer.social?.linkedin) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-body-base font-medium">Ngân hàng & Mạng xã hội</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
              <DetailItem label="Ngân hàng" value={customer.bankName} />
              <CopyableText label="Số tài khoản" value={customer.bankAccount} />
              {customer.social?.website && (
                <div className="space-y-1">
                  <dt className="text-body-sm text-muted-foreground">Website</dt>
                  <dd>
                    <a 
                      href={customer.social.website.startsWith('http') ? customer.social.website : `https://${customer.social.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {customer.social.website}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </dd>
                </div>
              )}
              {customer.social?.facebook && (
                <div className="space-y-1">
                  <dt className="text-body-sm text-muted-foreground">Facebook</dt>
                  <dd>
                    <a 
                      href={customer.social.facebook.startsWith('http') ? customer.social.facebook : `https://facebook.com/${customer.social.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {customer.social.facebook}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </dd>
                </div>
              )}
              {customer.social?.linkedin && (
                <DetailItem label="Instagram" value={customer.social.linkedin} />
              )}
            </dl>
          </CardContent>
        </Card>
      )}

      {/* Thống kê mua hàng */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-body-base font-medium">Thống kê mua hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
            <DetailItem label="Tổng đơn hàng" value={customer.totalOrders?.toString()} />
            <DetailItem label="Tổng chi tiêu" value={formatCurrency(customer.totalSpent)} />
            <DetailItem label="SL đã mua" value={customer.totalQuantityPurchased?.toString()} />
            <DetailItem label="SL trả lại" value={customer.totalQuantityReturned?.toString()} />
            <DetailItem label="Lần mua gần nhất" value={formatDateUtil(customer.lastPurchaseDate)} />
            <DetailItem label="Giao hàng thất bại" value={customer.failedDeliveries?.toString()} />
          </dl>
        </CardContent>
      </Card>

      {/* Quản lý */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-body-base font-medium">Quản lý</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
            <DetailItem 
              label="NV phụ trách" 
              value={customer.accountManagerName || getEmployeeName(customer.accountManagerId)}
              onClick={customer.accountManagerId ? () => router.push(`/employees/${customer.accountManagerId}`) : undefined}
            />
            <DetailItem label="Ngày tạo" value={formatDateUtil(customer.createdAt)} />
            <DetailItem 
              label="Người tạo" 
              value={getEmployeeName(customer.createdBy)}
              onClick={customer.createdBy ? () => router.push(`/employees/${customer.createdBy}`) : undefined}
            />
            <DetailItem label="Cập nhật" value={formatDateUtil(customer.updatedAt)} />
            <DetailItem 
              label="Người cập nhật" 
              value={getEmployeeName(customer.updatedBy)}
              onClick={customer.updatedBy ? () => router.push(`/employees/${customer.updatedBy}`) : undefined}
            />
          </dl>
        </CardContent>
      </Card>

      {/* Ghi chú */}
      {customer.notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-body-base font-medium">Ghi chú</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body-sm text-muted-foreground whitespace-pre-wrap">{sanitizeToText(customer.notes)}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

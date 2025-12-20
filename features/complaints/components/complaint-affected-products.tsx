'use client'

import React from 'react';
import { useNavigate } from '@/lib/next-compat';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { ImagePreviewDialog } from "../../../components/ui/image-preview-dialog";
import { useProductStore } from "../../products/store";
import { useProductTypeStore } from "../../settings/inventory/product-type-store";
import { Package, Eye } from 'lucide-react';
import type { Complaint } from '../types';
import type { SystemId } from "@/lib/id-types";

interface Props {
  complaint: Complaint;
}

export const ComplaintAffectedProducts: React.FC<Props> = React.memo(({ complaint }) => {
  const navigate = useNavigate();
  const { findById: findProductById } = useProductStore();
  const { findById: findProductTypeById } = useProductTypeStore();
  const [previewImage, setPreviewImage] = React.useState<{ url: string; title: string } | null>(null);

  const getProductTypeName = React.useCallback((productTypeSystemId: SystemId) => {
    const productType = findProductTypeById(productTypeSystemId);
    return productType?.name || 'Hàng hóa';
  }, [findProductTypeById]);

  // Get confirmed quantities from last verified-correct action
  // ONLY show if complaint is currently verified-correct
  const lastVerifiedCorrect = React.useMemo(() => {
    if (complaint.verification !== 'verified-correct') return null;
    
    return [...complaint.timeline]
      .reverse()
      .find(a => a.actionType === 'verified-correct');
  }, [complaint.timeline, complaint.verification]);
  
  const confirmedQuantities = lastVerifiedCorrect?.metadata?.confirmedQuantities as Record<SystemId, number> | undefined;

  if (!complaint.affectedProducts || complaint.affectedProducts.length === 0) {
    return null;
  }

  return (
    <>
      {/* Card: Sản phẩm bị ảnh hưởng */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sản phẩm bị ảnh hưởng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-center p-2 font-medium w-16">Ảnh</th>
                  <th className="text-left p-2 font-medium min-w-[200px]">Sản phẩm</th>
                  <th className="text-right p-2 font-medium w-24">Đơn giá</th>
                  <th className="text-center p-2 font-medium w-20">SL đặt</th>
                  <th className="text-left p-2 font-medium w-20">Loại lỗi</th>
                  <th className="text-center p-2 font-medium w-16">Thừa</th>
                  <th className="text-center p-2 font-medium w-16">Thiếu</th>
                  <th className="text-center p-2 font-medium w-16">Hỏng</th>
                  {confirmedQuantities && (
                    <th className="text-center p-2 font-medium w-24">Thực tế</th>
                  )}
                  <th className="text-right p-2 font-medium w-28">Tổng tiền</th>
                  <th className="text-left p-2 font-medium min-w-[120px]">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {complaint.affectedProducts.map((item, idx) => {
                  const product = findProductById(item.productSystemId);
                  const productTypeName = product?.productTypeSystemId 
                    ? getProductTypeName(product.productTypeSystemId)
                    : 'Hàng hóa';
                  const imageUrl = product?.thumbnailImage || product?.galleryImages?.[0] || product?.images?.[0];
                  
                  const totalAmount = (
                    (item.quantityMissing || 0) + 
                    (item.quantityDefective || 0) + 
                    (item.quantityExcess || 0)
                  ) * (item.unitPrice || 0);
                  
                  const issueTypeLabel = {
                    excess: 'Thừa',
                    missing: 'Thiếu',
                    defective: 'Hỏng',
                    other: 'Khác'
                  }[item.issueType] || item.issueType;
                  
                  // Get customer reported quantity
                  const customerReported = item.issueType === 'excess' 
                    ? (item.quantityExcess || 0)
                    : item.issueType === 'missing'
                    ? (item.quantityMissing || 0)
                    : item.issueType === 'defective'
                    ? (item.quantityDefective || 0)
                    : 0;
                  
                  // Get confirmed quantity from verification
                  const confirmedQty = confirmedQuantities?.[item.productSystemId];
                  const hasDifference = confirmedQty !== undefined && confirmedQty !== customerReported;
                  
                  return (
                    <tr key={idx} className="border-b last:border-0">
                      {/* Ảnh sản phẩm */}
                      <td className="p-2">
                        {imageUrl ? (
                          <div
                            className="group/thumbnail relative w-10 h-9 rounded border overflow-hidden bg-muted cursor-pointer mx-auto"
                            onClick={() => setPreviewImage({ url: imageUrl, title: item.productName })}
                          >
                            <img src={imageUrl} alt={item.productName} className="w-full h-full object-cover transition-all group-hover/thumbnail:brightness-75" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumbnail:opacity-100 transition-opacity">
                              <Eye className="w-3 h-3 text-white drop-shadow-md" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-10 h-9 bg-muted rounded flex items-center justify-center mx-auto">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => navigate(`/products/${item.productSystemId}`)}
                          className="font-medium text-sm text-primary hover:underline text-left"
                        >
                          {item.productName}
                        </button>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>{productTypeName}</span>
                          <span>-</span>
                          <span>{item.productId}</span>
                        </div>
                      </td>
                      <td className="p-2 text-right text-sm">
                        {(item.unitPrice || 0).toLocaleString('vi-VN')}đ
                      </td>
                      <td className="p-2 text-center">{item.quantityOrdered || 0}</td>
                      <td className="p-2">
                        <span className="text-xs px-2 py-1 rounded bg-muted">
                          {issueTypeLabel}
                        </span>
                      </td>
                      <td className="p-2 text-center">{item.quantityExcess || 0}</td>
                      <td className="p-2 text-center">{item.quantityMissing || 0}</td>
                      <td className="p-2 text-center">{item.quantityDefective || 0}</td>
                      {confirmedQuantities && (
                        <td className="p-2 text-center">
                          {confirmedQty !== undefined ? (
                            <div className="flex flex-col items-center gap-1">
                              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                                hasDifference 
                                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' 
                                  : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              }`}>
                                {confirmedQty}
                              </span>
                              {hasDifference && (
                                <span className="text-xs text-orange-600 font-normal">
                                  ({confirmedQty! > customerReported ? '+' : ''}{confirmedQty! - customerReported})
                                </span>
                              )}
                            </div>
                          ) : '-'}
                        </td>
                      )}
                      <td className="p-2 text-right">
                        <span className={`font-semibold text-sm ${totalAmount > 0 ? 'text-red-600' : ''}`}>
                          {totalAmount.toLocaleString('vi-VN')}đ
                        </span>
                      </td>
                      <td className="p-2 text-xs text-muted-foreground">{item.note || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Card: Tổng kết sản phẩm */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tổng kết sản phẩm bị ảnh hưởng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Thừa */}
            {(() => {
              const excessItems = complaint.affectedProducts.filter(p => p.issueType === 'excess' && (p.quantityExcess || 0) > 0);
              const totalExcessQty = excessItems.reduce((sum, p) => sum + (p.quantityExcess || 0), 0);
              const totalExcessAmount = excessItems.reduce((sum, p) => {
                const qty = p.quantityExcess || 0;
                const price = p.unitPrice || 0;
                return sum + (qty * price);
              }, 0);
              
              if (totalExcessQty === 0) return null;
              
              return (
                <div className="space-y-2 p-4 rounded-lg border bg-card">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Thừa</p>
                  <p className="text-2xl font-bold tracking-tight">{totalExcessQty}</p>
                  <p className="text-sm font-medium text-foreground">
                    {totalExcessAmount.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              );
            })()}
            
            {/* Thiếu */}
            {(() => {
              const missingItems = complaint.affectedProducts.filter(p => p.issueType === 'missing' && (p.quantityMissing || 0) > 0);
              const totalMissingQty = missingItems.reduce((sum, p) => sum + (p.quantityMissing || 0), 0);
              const totalMissingAmount = missingItems.reduce((sum, p) => {
                const qty = p.quantityMissing || 0;
                const price = p.unitPrice || 0;
                return sum + (qty * price);
              }, 0);
              
              if (totalMissingQty === 0) return null;
              
              return (
                <div className="space-y-2 p-4 rounded-lg border bg-card">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Thiếu</p>
                  <p className="text-2xl font-bold tracking-tight">{totalMissingQty}</p>
                  <p className="text-sm font-medium text-foreground">
                    {totalMissingAmount.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              );
            })()}
            
            {/* Hỏng */}
            {(() => {
              const defectiveItems = complaint.affectedProducts.filter(p => p.issueType === 'defective' && (p.quantityDefective || 0) > 0);
              const totalDefectiveQty = defectiveItems.reduce((sum, p) => sum + (p.quantityDefective || 0), 0);
              const totalDefectiveAmount = defectiveItems.reduce((sum, p) => {
                const qty = p.quantityDefective || 0;
                const price = p.unitPrice || 0;
                return sum + (qty * price);
              }, 0);
              
              if (totalDefectiveQty === 0) return null;
              
              return (
                <div className="space-y-2 p-4 rounded-lg border bg-card">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Hỏng</p>
                  <p className="text-2xl font-bold tracking-tight">{totalDefectiveQty}</p>
                  <p className="text-sm font-medium text-foreground">
                    {totalDefectiveAmount.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              );
            })()}
            
            {/* Khác */}
            {(() => {
              const otherItems = complaint.affectedProducts.filter(p => p.issueType === 'other');
              
              if (otherItems.length === 0) return null;
              
              return (
                <div className="space-y-2 p-4 rounded-lg border bg-card">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Khác</p>
                  <p className="text-2xl font-bold tracking-tight">{otherItems.length}</p>
                  <p className="text-sm font-medium text-foreground">
                    Xem ghi chú
                  </p>
                </div>
              );
            })()}
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <ImagePreviewDialog
        images={previewImage ? [previewImage.url] : []}
        open={!!previewImage}
        onOpenChange={(open) => !open && setPreviewImage(null)}
        title={previewImage?.title}
      />
    </>
  );
});

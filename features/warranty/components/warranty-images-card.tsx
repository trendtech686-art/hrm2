'use client'

/**
 * WarrantyImagesCard - Simple Image Upload for Warranty Form
 * 
 * Flow đơn giản giống Product:
 * 1. Upload ảnh → Lưu file + database ngay (permanent)
 * 2. Xóa ảnh → Xóa file + database ngay  
 * 3. Save form → Dùng URL từ value để cập nhật warranty
 * 
 * Không có staging, không có confirm, không có session.
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { SimpleImageUpload, type UploadedImage } from '../../../components/ui/simple-image-upload';

interface WarrantyImagesCardProps {
  /** Card title */
  title: string;
  /** Warranty systemId - để lưu ảnh vào đúng entity */
  warrantyId?: string;
  /** Document name: 'received' hoặc 'processed' */
  documentName: 'received' | 'processed';
  /** Current images */
  images: UploadedImage[];
  /** Called when images change */
  onImagesChange: (images: UploadedImage[]) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Helper text */
  helperText?: string;
}

/**
 * Card upload hình ảnh cho phiếu bảo hành
 * Sử dụng SimpleImageUpload - upload trực tiếp permanent
 */
export function WarrantyImagesCard({
  title,
  warrantyId,
  documentName,
  images,
  onImagesChange,
  disabled = false,
  helperText,
}: WarrantyImagesCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <SimpleImageUpload
          value={images}
          onChange={(val) => onImagesChange((val as UploadedImage[] | null) || [])}
          entityType="warranty"
          entityId={warrantyId}
          documentName={documentName}
          multiple={true}
          maxFiles={50}
          maxSize={10 * 1024 * 1024} // 10MB per file
          disabled={disabled}
          helperText={helperText || `Tải lên hình ảnh ${documentName === 'received' ? 'lúc nhận hàng' : 'đã xử lý'}. Tối đa 50 ảnh.`}
        />
      </CardContent>
    </Card>
  );
}

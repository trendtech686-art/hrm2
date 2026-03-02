'use client';

/**
 * ImagesTab - Simple Image Upload for Product Form
 * 
 * Flow đơn giản:
 * 1. Upload ảnh → Lưu file + database ngay (permanent)
 * 2. Xóa ảnh → Xóa file + database ngay
 * 3. Save form → Dùng URL để cập nhật product.thumbnailImage
 */

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { SimpleImageUpload, type UploadedImage } from '@/components/ui/simple-image-upload';
import type { ProductFormCompleteValues } from './types';

interface ImagesTabProps {
  /**
   * Product systemId - để lưu ảnh vào đúng entity
   */
  productId?: string;
  
  /**
   * Current thumbnail image
   */
  thumbnailImage: UploadedImage | null;
  
  /**
   * Called when thumbnail changes
   */
  onThumbnailChange: (image: UploadedImage | null) => void;
  
  /**
   * Current gallery images
   */
  galleryImages: UploadedImage[];
  
  /**
   * Called when gallery changes
   */
  onGalleryChange: (images: UploadedImage[]) => void;
}

export function ImagesTab({
  productId,
  thumbnailImage,
  onThumbnailChange,
  galleryImages,
  onGalleryChange,
}: ImagesTabProps) {
  const form = useFormContext<ProductFormCompleteValues>();

  return (
    <>
      {/* Ảnh chính (thumbnail) - chỉ 1 ảnh */}
      <Card>
        <CardHeader>
          <CardTitle>Ảnh chính</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleImageUpload
            value={thumbnailImage}
            onChange={(val) => onThumbnailChange(val as UploadedImage | null)}
            entityType="products"
            entityId={productId}
            documentName="thumbnail"
            multiple={false}
            maxSize={5 * 1024 * 1024}
            helperText="Tải lên ảnh đại diện chính của sản phẩm. Chỉ được phép 1 ảnh."
          />
        </CardContent>
      </Card>

      {/* Ảnh album (gallery) - nhiều ảnh */}
      <Card>
        <CardHeader>
          <CardTitle>Album ảnh</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleImageUpload
            value={galleryImages}
            onChange={(val) => onGalleryChange((val as UploadedImage[] | null) || [])}
            entityType="products"
            entityId={productId}
            documentName="gallery"
            multiple={true}
            maxFiles={19}
            maxSize={5 * 1024 * 1024}
            helperText="Tải lên các hình ảnh phụ cho bộ sưu tập sản phẩm. Tối đa 19 ảnh."
          />
        </CardContent>
      </Card>

      {/* Video Links */}
      <Card>
        <CardHeader>
          <CardTitle>Video Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="videoLinks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Danh sách Video</FormLabel>
                <FormControl>
                  <Textarea
                    value={(field.value as string[] | undefined)?.join('\n') || ''}
                    onChange={(e) => {
                      const links = e.target.value.split('\n').filter(Boolean);
                      field.onChange(links.length > 0 ? links : undefined);
                    }}
                    placeholder="https://youtube.com/watch?v=xxx&#10;https://tiktok.com/@channel/video/xxx&#10;https://drive.google.com/file/d/xxx"
                    rows={5}
                  />
                </FormControl>
                <FormDescription>
                  Mỗi link trên một dòng. Hỗ trợ: YouTube, TikTok, Google Drive, Vimeo, Facebook
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </>
  );
}

// Legacy props type for backward compatibility during migration
export interface LegacyImagesTabProps {
  thumbnailStagingFiles: unknown[];
  setThumbnailStagingFiles: React.Dispatch<React.SetStateAction<unknown[]>>;
  thumbnailSessionId: string | null;
  setThumbnailSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  galleryStagingFiles: unknown[];
  setGalleryStagingFiles: React.Dispatch<React.SetStateAction<unknown[]>>;
  gallerySessionId: string | null;
  setGallerySessionId: React.Dispatch<React.SetStateAction<string | null>>;
}

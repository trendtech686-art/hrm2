'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploadManager } from '@/components/ui/image-upload-manager';
import type { StagingFile } from '@/lib/file-upload-api';
import type { ProductFormCompleteValues } from './types';

interface ImagesTabProps {
  thumbnailStagingFiles: StagingFile[];
  setThumbnailStagingFiles: React.Dispatch<React.SetStateAction<StagingFile[]>>;
  thumbnailSessionId: string | null;
  setThumbnailSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  galleryStagingFiles: StagingFile[];
  setGalleryStagingFiles: React.Dispatch<React.SetStateAction<StagingFile[]>>;
  gallerySessionId: string | null;
  setGallerySessionId: React.Dispatch<React.SetStateAction<string | null>>;
}

export function ImagesTab({
  thumbnailStagingFiles,
  setThumbnailStagingFiles,
  thumbnailSessionId,
  setThumbnailSessionId,
  galleryStagingFiles,
  setGalleryStagingFiles,
  gallerySessionId,
  setGallerySessionId,
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
          <ImageUploadManager
            value={thumbnailStagingFiles}
            onChange={setThumbnailStagingFiles}
            {...(thumbnailSessionId ? { sessionId: thumbnailSessionId } : {})}
            onSessionChange={(nextSessionId) => setThumbnailSessionId(nextSessionId)}
            maxFiles={1}
            maxSize={5 * 1024 * 1024}
            maxTotalSize={5 * 1024 * 1024}
            description="Tải lên ảnh đại diện chính của sản phẩm. Chỉ được phép 1 ảnh."
          />
        </CardContent>
      </Card>

      {/* Ảnh album (gallery) - nhiều ảnh */}
      <Card>
        <CardHeader>
          <CardTitle>Album ảnh</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploadManager
            value={galleryStagingFiles}
            onChange={setGalleryStagingFiles}
            {...(gallerySessionId ? { sessionId: gallerySessionId } : {})}
            onSessionChange={(nextSessionId) => setGallerySessionId(nextSessionId)}
            maxFiles={19}
            maxSize={5 * 1024 * 1024}
            maxTotalSize={50 * 1024 * 1024}
            description="Tải lên các hình ảnh phụ cho bộ sưu tập sản phẩm. Tối đa 19 ảnh."
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

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { ProgressiveImage } from "../../../components/ui/progressive-image";
import type { Complaint, ComplaintImage } from '../types';

interface NormalizedImage {
  id: string;
  url: string;
}

// Extended complaint type with employeeImages
type ComplaintWithEmployeeImages = Complaint & {
  employeeImages?: unknown[];
};

interface Props {
  complaint: Complaint;
  onImagePreview: (images: string[], index: number) => void;
}

/**
 * Normalize images from various DB formats (String[] or object[]) into { id, url }
 */
function normalizeImageArray(images: unknown, prefix = 'img'): NormalizedImage[] {
  if (!images || !Array.isArray(images)) return [];
  
  return images.map((img, idx) => {
    if (typeof img === 'object' && img !== null && 'url' in img) {
      return { id: (img as { id?: string }).id || `${prefix}-${idx}`, url: (img as { url: string }).url };
    }
    if (typeof img === 'string') {
      return { id: `${prefix}-${idx}`, url: img };
    }
    return null;
  }).filter((img): img is NormalizedImage => img !== null);
}

/** Reusable image grid with hover overlay */
function ImageGrid({ images, altPrefix, onImagePreview }: { 
  images: NormalizedImage[]; 
  altPrefix: string; 
  onImagePreview: (urls: string[], index: number) => void;
}) {
  if (images.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-4">Chưa có hình ảnh</p>;
  }

  const imageUrls = images.map(i => i.url);

  return (
    <>
      <div className="grid grid-cols-5 gap-2">
        {images.map((img, idx) => (
          <div 
            key={img.id} 
            className="relative group aspect-square cursor-pointer"
            onClick={() => onImagePreview(imageUrls, idx)}
          >
            <ProgressiveImage
              src={img.url}
              alt={`${altPrefix} ${idx + 1}`}
              className="w-full h-full object-cover rounded border-2 transition-all shadow-sm"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all rounded flex items-center justify-center opacity-0 group-hover:opacity-100">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {images.length} hình • Click để xem lớn
      </p>
    </>
  );
}

export const ComplaintImagesSection: React.FC<Props> = React.memo(({ complaint, onImagePreview }) => {
  const customerImages = React.useMemo(
    () => normalizeImageArray(complaint.images, 'img'),
    [complaint.images]
  );
  const employeeImages = React.useMemo(
    () => normalizeImageArray((complaint as ComplaintWithEmployeeImages).employeeImages, 'emp-img'),
    [(complaint as ComplaintWithEmployeeImages).employeeImages]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Hình ảnh từ khách hàng ({customerImages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageGrid images={customerImages} altPrefix="Hình khách hàng" onImagePreview={onImagePreview} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hình ảnh kiểm tra từ nhân viên ({employeeImages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageGrid images={employeeImages} altPrefix="Hình nhân viên" onImagePreview={onImagePreview} />
        </CardContent>
      </Card>
    </div>
  );
});

ComplaintImagesSection.displayName = 'ComplaintImagesSection';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { ProgressiveImage } from "../../../components/ui/progressive-image";
import type { Complaint, ComplaintImage } from '../types';

interface EmployeeImage {
  id?: string;
  url: string;
}

// Extended complaint type with employeeImages
type ComplaintWithEmployeeImages = Complaint & {
  employeeImages?: EmployeeImage[];
};

interface Props {
  complaint: Complaint;
  onImagePreview: (images: string[], index: number) => void;
}

/**
 * Helper to normalize images from both database formats:
 * - Prisma schema stores: images: String[] (just URLs)
 * - TypeScript type expects: images: ComplaintImage[] (objects with type, url, etc.)
 */
function normalizeImages(images: unknown): ComplaintImage[] {
  if (!images || !Array.isArray(images)) return [];
  
  return images.map((img, idx) => {
    // If it's already a ComplaintImage object
    if (typeof img === 'object' && img !== null && 'url' in img) {
      return img as ComplaintImage;
    }
    // If it's a string URL, convert to ComplaintImage with default type
    if (typeof img === 'string') {
      return {
        id: `img-${idx}` as ComplaintImage['id'],
        url: img,
        uploadedBy: '' as ComplaintImage['uploadedBy'],
        uploadedAt: new Date(),
        type: 'initial' as const,
      };
    }
    return null;
  }).filter((img): img is ComplaintImage => img !== null);
}

export const ComplaintImagesSection: React.FC<Props> = React.memo(({ complaint, onImagePreview }) => {
  // Normalize images to handle both String[] from DB and ComplaintImage[] from types
  const normalizedImages = normalizeImages(complaint.images);
  const customerImages = normalizedImages.filter(img => img.type === 'initial');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Customer Images */}
      <Card>
        <CardHeader>
          <CardTitle>
            Hình ảnh từ khách hàng ({customerImages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {customerImages.length > 0 ? (
            <>
              <div className="grid grid-cols-5 gap-2">
                {customerImages.map((img, idx) => {
                  const imageUrls = customerImages.map(i => i.url);
                  return (
                    <div 
                      key={img.id || idx} 
                      className="relative group aspect-square cursor-pointer"
                      onClick={() => onImagePreview(imageUrls, idx)}
                    >
                      <ProgressiveImage
                        src={img.url}
                        alt={`Hình khách hàng ${idx + 1}`}
                        className="w-full h-full object-cover rounded border-2 transition-all shadow-sm"
                      />
                      {/* Hover overlay with icon */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all rounded flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {customerImages.length} hình • Click để xem lớn
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Chưa có hình ảnh</p>
          )}
        </CardContent>
      </Card>

      {/* Employee Images */}
      <Card>
        <CardHeader>
          <CardTitle>
            Hình ảnh kiểm tra từ nhân viên ({normalizeEmployeeImages((complaint as ComplaintWithEmployeeImages).employeeImages).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const employeeImgs = normalizeEmployeeImages((complaint as ComplaintWithEmployeeImages).employeeImages);
            return employeeImgs.length > 0 ? (
              <>
                <div className="grid grid-cols-5 gap-2">
                  {employeeImgs.map((img, idx) => {
                    const imageUrls = employeeImgs.map(i => i.url);
                    return (
                      <div 
                        key={img.id || idx} 
                        className="relative group aspect-square cursor-pointer"
                        onClick={() => onImagePreview(imageUrls, idx)}
                      >
                        <ProgressiveImage
                          src={img.url}
                          alt={`Hình nhân viên ${idx + 1}`}
                          className="w-full h-full object-cover rounded border-2 transition-all shadow-sm"
                        />
                        {/* Hover overlay with icon */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all rounded flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {employeeImgs.length} hình • Click để xem lớn
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Chưa có hình ảnh</p>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
});

ComplaintImagesSection.displayName = 'ComplaintImagesSection';

/**
 * Helper to normalize employee images from database format
 */
function normalizeEmployeeImages(images: unknown): EmployeeImage[] {
  if (!images || !Array.isArray(images)) return [];
  
  return images.map((img, idx) => {
    // If it's already an object with url
    if (typeof img === 'object' && img !== null && 'url' in img) {
      return img as EmployeeImage;
    }
    // If it's a string URL
    if (typeof img === 'string') {
      return { id: `emp-img-${idx}`, url: img };
    }
    return null;
  }).filter((img): img is EmployeeImage => img !== null);
}

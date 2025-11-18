import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.tsx";
import { ProgressiveImage } from "../../../components/ui/progressive-image.tsx";
import type { Complaint } from '../types.ts';

interface Props {
  complaint: Complaint;
  onImagePreview: (images: string[], index: number) => void;
}

export const ComplaintImagesSection: React.FC<Props> = React.memo(({ complaint, onImagePreview }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Customer Images */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Hình ảnh từ khách hàng ({complaint.images?.filter(img => img.type === "initial").length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {complaint.images && complaint.images.length > 0 ? (
            <>
              <div className="grid grid-cols-5 gap-2">
                {complaint.images
                  .filter((img) => img.type === "initial")
                  .map((img, idx) => {
                    const customerImages = complaint.images.filter(i => i.type === "initial").map(i => i.url);
                    return (
                      <div 
                        key={img.id} 
                        className="relative group aspect-square cursor-pointer"
                        onClick={() => onImagePreview(customerImages, idx)}
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
                {complaint.images.filter(img => img.type === "initial").length} hình • Click để xem lớn
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
          <CardTitle className="text-base">
            Hình ảnh kiểm tra từ nhân viên ({(complaint as any).employeeImages?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(complaint as any).employeeImages && (complaint as any).employeeImages.length > 0 ? (
            <>
              <div className="grid grid-cols-5 gap-2">
                {(complaint as any).employeeImages.map((img: any, idx: number) => {
                  const employeeImages = (complaint as any).employeeImages.map((i: any) => i.url);
                  return (
                    <div 
                      key={img.id || idx} 
                      className="relative group aspect-square cursor-pointer"
                      onClick={() => onImagePreview(employeeImages, idx)}
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
                {(complaint as any).employeeImages.length} hình • Click để xem lớn
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Chưa có hình ảnh</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card.tsx';
import { LazyImage } from '../../../../components/ui/lazy-image.tsx';

interface WarrantyImageGalleryCardProps {
  title: string;
  images?: string[] | null;
  emptyMessage: string;
  footnote?: string;
  onPreview: (images: string[], initialIndex: number) => void;
}

export function WarrantyImageGalleryCard({ title, images, emptyMessage, footnote, onPreview }: WarrantyImageGalleryCardProps) {
  const validImages = React.useMemo(() => (images || []).filter((url): url is string => Boolean(url && url.trim())), [images]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {validImages.length > 0 ? (
          <>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {validImages.map((url, idx) => (
                <div
                  key={idx}
                  className="relative group cursor-pointer h-40 w-40 flex-shrink-0"
                  onClick={() => onPreview(validImages, idx)}
                >
                  <LazyImage
                    src={url}
                    alt={`${title} ${idx + 1}`}
                    className="h-full w-full object-cover rounded-lg border-2 transition-all shadow-sm"
                    rootMargin="300px"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {validImages.length} hình • Click để xem lớn{footnote ? ` • ${footnote}` : ''}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  );
}

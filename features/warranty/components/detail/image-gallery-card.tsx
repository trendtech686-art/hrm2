import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { LazyImage } from '../../../../components/ui/lazy-image';
import { mobileBleedCardClass } from '@/components/layout/page-section';

interface WarrantyImageGalleryCardProps {
  title: string;
  images?: string[] | null | undefined;
  emptyMessage: string;
  footnote?: string | undefined;
  onPreview: (images: string[], initialIndex: number) => void;
}

export function WarrantyImageGalleryCard({ title, images, emptyMessage, footnote, onPreview }: WarrantyImageGalleryCardProps) {
  const validImages = React.useMemo(() => (images || []).filter((url): url is string => Boolean(url && url.trim())), [images]);

  return (
    <Card className={mobileBleedCardClass}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {validImages.length > 0 ? (
          <>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {validImages.map((url, idx) => (
                <div
                  key={idx}
                  role="button"
                  tabIndex={0}
                  className="relative group cursor-pointer h-40 w-40 shrink-0"
                  onClick={() => onPreview(validImages, idx)}
                  onKeyDown={(e) => { if (e.key === 'Enter') onPreview(validImages, idx); }}
                >
                  <LazyImage
                    src={url}
                    alt={`${title} ${idx + 1}`}
                    className="h-full w-full object-cover rounded-lg border-2 transition-all shadow-sm"
                    rootMargin="300px"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all rounded-lg flex items-center justify-center md:opacity-0 md:group-hover:opacity-100">
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
          <div className="flex min-h-[160px] flex-col items-center justify-center px-4 py-8 text-center">
            <svg className="mb-2 h-10 w-10 text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

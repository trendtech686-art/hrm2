/**
 * ProductImage Component
 * 
 * Component hiển thị ảnh sản phẩm với logic ưu tiên:
 * 1. Ảnh từ server (upload thực) - ưu tiên cao nhất
 * 2. Ảnh từ product data (mock/seed)
 * 3. Icon placeholder nếu không có ảnh
 */

import * as React from 'react';
import { Package } from 'lucide-react';
import { useImageStore } from '../image-store';
import { FileUploadAPI } from '@/lib/file-upload-api';
import { LazyImage } from '@/components/ui/lazy-image';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  productSystemId: string;
  productData?: {
    thumbnailImage?: string;
    galleryImages?: string[];
    images?: string[];
    name?: string;
  } | null;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  xs: 'w-8 h-8',
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

const iconSizes = {
  xs: 'h-4 w-4',
  sm: 'h-5 w-5',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export function ProductImage({ 
  productSystemId, 
  productData, 
  alt,
  size = 'md',
  className 
}: ProductImageProps) {
  // Get image from store (server images)
  const permanentImages = useImageStore(state => state.permanentImages[productSystemId]);
  const lastFetched = useImageStore(state => state.permanentMeta[productSystemId]?.lastFetched);
  const updatePermanentImages = useImageStore(state => state.updatePermanentImages);

  const storeThumbnail = permanentImages?.thumbnail?.[0]?.url;
  const storeGallery = permanentImages?.gallery?.[0]?.url;

  // ✅ Ưu tiên ảnh từ server trước, sau đó mới đến product data
  const displayImage = React.useMemo(() => {
    // 1. Ảnh từ server (ưu tiên cao nhất)
    if (storeThumbnail) return storeThumbnail;
    if (storeGallery) return storeGallery;
    // 2. Ảnh từ product data (mock/seed)
    if (!productData) return undefined;
    return productData.thumbnailImage || productData.galleryImages?.[0] || productData.images?.[0];
  }, [storeThumbnail, storeGallery, productData]);

  // Fetch image from server if not yet fetched
  React.useEffect(() => {
    if (!lastFetched && productSystemId) {
      FileUploadAPI.getProductFiles(productSystemId)
        .then(files => {
          if (!files || !Array.isArray(files)) return;
          
          const mapToServerFile = (f: any) => ({
            id: f.id,
            sessionId: '',
            name: f.name,
            originalName: f.originalName,
            slug: f.slug,
            filename: f.filename,
            size: f.size,
            type: f.type,
            url: f.url,
            status: 'permanent' as const,
            uploadedAt: f.uploadedAt,
            metadata: f.metadata
          });

          const thumbnailFiles = files.filter(f => f.documentName === 'thumbnail').map(mapToServerFile);
          const galleryFiles = files.filter(f => f.documentName === 'gallery').map(mapToServerFile);
          
          updatePermanentImages(productSystemId, 'thumbnail', thumbnailFiles);
          updatePermanentImages(productSystemId, 'gallery', galleryFiles);
        })
        .catch(err => console.error("Failed to load product image", err));
    }
  }, [productSystemId, lastFetched, updatePermanentImages]);

  const sizeClass = sizeClasses[size];
  const iconSize = iconSizes[size];
  const displayAlt = alt || productData?.name || 'Product';

  if (displayImage) {
    return (
      <div className={cn(sizeClass, "flex-shrink-0 rounded overflow-hidden bg-muted", className)}>
        <LazyImage
          src={displayImage}
          alt={displayAlt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={cn(sizeClass, "flex-shrink-0 bg-muted rounded flex items-center justify-center", className)}>
      <Package className={cn(iconSize, "text-muted-foreground")} />
    </div>
  );
}

/**
 * Hook để lấy URL ảnh sản phẩm với logic ưu tiên server
 */
export function useProductImage(
  productSystemId: string,
  productData?: {
    thumbnailImage?: string;
    galleryImages?: string[];
    images?: string[];
  } | null
) {
  const permanentImages = useImageStore(state => state.permanentImages[productSystemId]);
  const lastFetched = useImageStore(state => state.permanentMeta[productSystemId]?.lastFetched);
  const updatePermanentImages = useImageStore(state => state.updatePermanentImages);

  const storeThumbnail = permanentImages?.thumbnail?.[0]?.url;
  const storeGallery = permanentImages?.gallery?.[0]?.url;

  // Fetch if needed
  React.useEffect(() => {
    if (!lastFetched && productSystemId) {
      FileUploadAPI.getProductFiles(productSystemId)
        .then(files => {
          if (!files || !Array.isArray(files)) return;
          
          const mapToServerFile = (f: any) => ({
            id: f.id,
            sessionId: '',
            name: f.name,
            originalName: f.originalName,
            slug: f.slug,
            filename: f.filename,
            size: f.size,
            type: f.type,
            url: f.url,
            status: 'permanent' as const,
            uploadedAt: f.uploadedAt,
            metadata: f.metadata
          });

          const thumbnailFiles = files.filter(f => f.documentName === 'thumbnail').map(mapToServerFile);
          const galleryFiles = files.filter(f => f.documentName === 'gallery').map(mapToServerFile);
          
          updatePermanentImages(productSystemId, 'thumbnail', thumbnailFiles);
          updatePermanentImages(productSystemId, 'gallery', galleryFiles);
        })
        .catch(() => {});
    }
  }, [productSystemId, lastFetched, updatePermanentImages]);

  return React.useMemo(() => {
    // 1. Ảnh từ server (ưu tiên cao nhất)
    if (storeThumbnail) return storeThumbnail;
    if (storeGallery) return storeGallery;
    // 2. Ảnh từ product data
    if (!productData) return undefined;
    return productData.thumbnailImage || productData.galleryImages?.[0] || productData.images?.[0];
  }, [storeThumbnail, storeGallery, productData]);
}

/**
 * Product Image Store
 * 
 * Quản lý staging images và permanent images cho products
 * Tương tự như document-store.ts của Employee
 */

import { create } from 'zustand';
import type { StagingFile } from '@/lib/file-upload-api';

export type ProductImageType = 'thumbnail' | 'gallery';

type ImageState = {
  // Staging images - chưa confirm, theo sessionId
  stagingImages: Record<string, {
    type: ProductImageType;
    sessionId: string;
    files: StagingFile[];
  }>;
  
  // Permanent images - đã confirm, theo productSystemId
  permanentImages: Record<string, {
    thumbnail: StagingFile[];
    gallery: StagingFile[];
  }>;
  permanentMeta: Record<string, {
    lastFetched: number;
  }>;
  
  // Actions
  updateStagingImage: (
    productSystemId: string,
    type: ProductImageType,
    files: StagingFile[],
    sessionId: string
  ) => void;
  
  clearStagingImages: (productSystemId?: string) => void;
  
  updatePermanentImages: (
    productSystemId: string,
    type: ProductImageType,
    files: StagingFile[],
    fetchedAt?: number
  ) => void;
  
  clearPermanentImages: (productSystemId: string) => void;
  
  getStagingImages: (productSystemId: string, type: ProductImageType) => StagingFile[];
  
  getPermanentImages: (productSystemId: string, type: ProductImageType) => StagingFile[];
  
  getSessionId: (productSystemId: string, type: ProductImageType) => string | undefined;
};

export const useImageStore = create<ImageState>((set, get) => ({
  stagingImages: {},
  permanentImages: {},
  permanentMeta: {},
  
  updateStagingImage: (productSystemId, type, files, sessionId) => {
    const key = `${productSystemId}-${type}`;
    set(state => ({
      stagingImages: {
        ...state.stagingImages,
        [key]: { type, sessionId, files }
      }
    }));
  },
  
  clearStagingImages: (productSystemId) => {
    if (productSystemId) {
      set(state => {
        const filtered = Object.entries(state.stagingImages).filter(
          ([key]) => !key.startsWith(productSystemId)
        );
        return { stagingImages: Object.fromEntries(filtered) };
      });
    } else {
      set({ stagingImages: {} });
    }
  },
  
  updatePermanentImages: (productSystemId, type, files, fetchedAt) => {
    set(state => {
      const existing = state.permanentImages[productSystemId] || {
        thumbnail: [],
        gallery: []
      };

      const timestamp = fetchedAt ?? Date.now();
      return {
        permanentImages: {
          ...state.permanentImages,
          [productSystemId]: {
            ...existing,
            [type]: files
          }
        },
        permanentMeta: {
          ...state.permanentMeta,
          [productSystemId]: {
            lastFetched: timestamp
          }
        }
      };
    });
  },
  
  clearPermanentImages: (productSystemId) => {
    set(state => {
      const { [productSystemId]: _, ...rest } = state.permanentImages;
      const { [productSystemId]: __, ...restMeta } = state.permanentMeta;
      return { permanentImages: rest, permanentMeta: restMeta };
    });
  },
  
  getStagingImages: (productSystemId, type) => {
    const key = `${productSystemId}-${type}`;
    return get().stagingImages[key]?.files || [];
  },
  
  getPermanentImages: (productSystemId, type) => {
    return get().permanentImages[productSystemId]?.[type] || [];
  },
  
  getSessionId: (productSystemId, type) => {
    const key = `${productSystemId}-${type}`;
    return get().stagingImages[key]?.sessionId;
  }
}));

/**
 * Helper: Lấy ảnh sản phẩm với thứ tự ưu tiên đúng
 * 1. Ảnh từ server (permanentImages) - upload thực
 * 2. Ảnh từ product data (mock/seed data)
 */
export function getProductImageUrl(
  product: { thumbnailImage?: string; galleryImages?: string[]; images?: string[] } | null | undefined,
  serverThumbnail?: string,
  serverGallery?: string
): string | undefined {
  // Ưu tiên 1: Ảnh từ server (upload thực)
  if (serverThumbnail) return serverThumbnail;
  if (serverGallery) return serverGallery;
  
  // Ưu tiên 2: Ảnh từ product data
  if (!product) return undefined;
  return product.thumbnailImage || product.galleryImages?.[0] || product.images?.[0];
}

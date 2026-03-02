/**
 * Hook quản lý state hình ảnh cho từng sản phẩm trong warranty products
 */
import * as React from 'react';
import type { StagingFile } from '@/lib/file-upload-api';

// Simple file type for permanent images (only id and url needed)
export interface SimpleImageFile {
  id: string;
  url: string;
}

export interface ProductImageState {
  permanentFiles: Record<string, SimpleImageFile[]>;
  stagingFiles: Record<string, StagingFile[]>;
  sessionIds: Record<string, string>;
  filesToDelete: Record<string, string[]>;
}

export interface UseProductImagesStateResult {
  productPermanentFiles: Record<string, SimpleImageFile[]>;
  productStagingFiles: Record<string, StagingFile[]>;
  productSessionIds: Record<string, string>;
  productFilesToDelete: Record<string, string[]>;
  setProductPermanentFiles: React.Dispatch<React.SetStateAction<Record<string, SimpleImageFile[]>>>;
  setProductStagingFiles: React.Dispatch<React.SetStateAction<Record<string, StagingFile[]>>>;
  setProductSessionIds: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setProductFilesToDelete: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  handleMarkForDeletion: (productSystemId: string, fileId: string) => void;
  handleStagingFilesChange: (productSystemId: string, files: StagingFile[]) => void;
  handleSessionChange: (productSystemId: string, sessionId: string) => void;
  getImagesState: () => ProductImageState;
}

export function useProductImagesState(
  initialState?: Partial<ProductImageState>
): UseProductImagesStateResult {
  // State for per-product images
  const [productPermanentFiles, setProductPermanentFiles] = React.useState<Record<string, SimpleImageFile[]>>(
    initialState?.permanentFiles || {}
  );
  const [productStagingFiles, setProductStagingFiles] = React.useState<Record<string, StagingFile[]>>(
    initialState?.stagingFiles || {}
  );
  const [productSessionIds, setProductSessionIds] = React.useState<Record<string, string>>(
    initialState?.sessionIds || {}
  );
  const [productFilesToDelete, setProductFilesToDelete] = React.useState<Record<string, string[]>>(
    initialState?.filesToDelete || {}
  );

  // Handler - mark file for deletion (toggle)
  const handleMarkForDeletion = React.useCallback((productSystemId: string, fileId: string) => {
    setProductFilesToDelete(prev => {
      const currentMarked = prev[productSystemId] || [];
      if (currentMarked.includes(fileId)) {
        return {
          ...prev,
          [productSystemId]: currentMarked.filter(id => id !== fileId),
        };
      } else {
        return {
          ...prev,
          [productSystemId]: [...currentMarked, fileId],
        };
      }
    });
  }, []);

  // Handler - update staging files for a product
  const handleStagingFilesChange = React.useCallback((productSystemId: string, files: StagingFile[]) => {
    console.log('[PRODUCT IMAGES] Staging files changed:', { productSystemId, filesCount: files.length, files });
    setProductStagingFiles(prev => ({
      ...prev,
      [productSystemId]: files,
    }));
  }, []);

  // Handler - update session ID for a product
  const handleSessionChange = React.useCallback((productSystemId: string, sessionId: string) => {
    console.log('[PRODUCT IMAGES] Session changed:', { productSystemId, sessionId });
    setProductSessionIds(prev => ({
      ...prev,
      [productSystemId]: sessionId,
    }));
  }, []);

  // Get current state snapshot
  const getImagesState = React.useCallback((): ProductImageState => ({
    permanentFiles: productPermanentFiles,
    stagingFiles: productStagingFiles,
    sessionIds: productSessionIds,
    filesToDelete: productFilesToDelete,
  }), [productPermanentFiles, productStagingFiles, productSessionIds, productFilesToDelete]);

  return {
    productPermanentFiles,
    productStagingFiles,
    productSessionIds,
    productFilesToDelete,
    setProductPermanentFiles,
    setProductStagingFiles,
    setProductSessionIds,
    setProductFilesToDelete,
    handleMarkForDeletion,
    handleStagingFilesChange,
    handleSessionChange,
    getImagesState,
  };
}

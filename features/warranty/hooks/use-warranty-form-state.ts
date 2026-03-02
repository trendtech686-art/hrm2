'use client'

import * as React from 'react';
import type { StagingFile } from '../../../lib/file-upload-api';
import type { SimpleImageFile } from './use-product-images-state';

/**
 * State type cho product images
 */
export interface ProductImagesState {
  productPermanentFiles: Record<string, SimpleImageFile[]>;
  productStagingFiles: Record<string, StagingFile[]>;
  productSessionIds: Record<string, string>; // Changed from string | null to string for consistency
  productFilesToDelete: Record<string, string[]>;
}

/**
 * Props trả về từ hook useWarrantyFormState
 */
export interface WarrantyFormStateReturn {
  // Received images state
  receivedPermanentFiles: StagingFile[];
  setReceivedPermanentFiles: React.Dispatch<React.SetStateAction<StagingFile[]>>;
  receivedStagingFiles: StagingFile[];
  setReceivedStagingFiles: React.Dispatch<React.SetStateAction<StagingFile[]>>;
  receivedSessionId: string | null;
  setReceivedSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  receivedFilesToDelete: string[];
  setReceivedFilesToDelete: React.Dispatch<React.SetStateAction<string[]>>;
  
  // Processed images state
  processedPermanentFiles: StagingFile[];
  setProcessedPermanentFiles: React.Dispatch<React.SetStateAction<StagingFile[]>>;
  processedStagingFiles: StagingFile[];
  setProcessedStagingFiles: React.Dispatch<React.SetStateAction<StagingFile[]>>;
  processedSessionId: string | null;
  setProcessedSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  processedFilesToDelete: string[];
  setProcessedFilesToDelete: React.Dispatch<React.SetStateAction<string[]>>;
  
  // Product images state
  productImagesState: ProductImagesState;
  setProductImagesState: React.Dispatch<React.SetStateAction<ProductImagesState>>;
  
  // Submission state
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Hook quản lý state của warranty form
 * Tách riêng để giảm kích thước file form page chính
 */
export function useWarrantyFormState(): WarrantyFormStateReturn {
  // ===== RECEIVED IMAGES STATE =====
  const [receivedPermanentFiles, setReceivedPermanentFiles] = React.useState<StagingFile[]>([]);
  const [receivedStagingFiles, setReceivedStagingFiles] = React.useState<StagingFile[]>([]);
  const [receivedSessionId, setReceivedSessionId] = React.useState<string | null>(null);
  const [receivedFilesToDelete, setReceivedFilesToDelete] = React.useState<string[]>([]);
  
  // ===== PROCESSED IMAGES STATE =====
  const [processedPermanentFiles, setProcessedPermanentFiles] = React.useState<StagingFile[]>([]);
  const [processedStagingFiles, setProcessedStagingFiles] = React.useState<StagingFile[]>([]);
  const [processedSessionId, setProcessedSessionId] = React.useState<string | null>(null);
  const [processedFilesToDelete, setProcessedFilesToDelete] = React.useState<string[]>([]);
  
  // ===== PRODUCT IMAGES STATE =====
  const [productImagesState, setProductImagesState] = React.useState<ProductImagesState>({
    productPermanentFiles: {},
    productStagingFiles: {},
    productSessionIds: {},
    productFilesToDelete: {},
  });
  
  // ===== SUBMISSION STATE =====
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // ✅ Memoize return object để tránh re-render không cần thiết
  return React.useMemo(() => ({
    // Received images
    receivedPermanentFiles,
    setReceivedPermanentFiles,
    receivedStagingFiles,
    setReceivedStagingFiles,
    receivedSessionId,
    setReceivedSessionId,
    receivedFilesToDelete,
    setReceivedFilesToDelete,
    
    // Processed images
    processedPermanentFiles,
    setProcessedPermanentFiles,
    processedStagingFiles,
    setProcessedStagingFiles,
    processedSessionId,
    setProcessedSessionId,
    processedFilesToDelete,
    setProcessedFilesToDelete,
    
    // Product images
    productImagesState,
    setProductImagesState,
    
    // Submission
    isSubmitting,
    setIsSubmitting,
  }), [
    receivedPermanentFiles,
    receivedStagingFiles,
    receivedSessionId,
    receivedFilesToDelete,
    processedPermanentFiles,
    processedStagingFiles,
    processedSessionId,
    processedFilesToDelete,
    productImagesState,
    isSubmitting,
  ]);
}

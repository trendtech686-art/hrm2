import * as React from 'react';
import { toast } from 'sonner';
import { FileUploadAPI, type StagingFile, type ServerFile } from '../lib/file-upload-api';

type EntityType = 'customer' | 'product' | 'supplier' | 'employee' | 'customer-contract';

type UseImageUploadOptions = {
  /**
   * Loại entity: 'customer' | 'product' | 'supplier' | 'employee' | 'customer-contract'
   */
  entityType: EntityType;
  
  /**
   * Initial images URLs (for edit mode)
   */
  initialImages?: string[];
};

type UseImageUploadReturn = {
  /**
   * Staging files đang upload
   */
  stagingFiles: StagingFile[];
  
  /**
   * Session ID hiện tại
   */
  sessionId: string | null;
  
  /**
   * Update staging files
   */
  setStagingFiles: React.Dispatch<React.SetStateAction<StagingFile[]>>;
  
  /**
   * Update session ID
   */
  setSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  
  /**
   * Confirm images từ staging → permanent
   * Gọi sau khi save entity thành công
   */
  confirmImages: (entityId: string, entityData?: Record<string, any>) => Promise<ServerFile[] | null>;
  
  /**
   * Check xem có images cần confirm không
   */
  hasImages: boolean;
  
  /**
   * Số lượng images đang staging
   */
  imageCount: number;
};

/**
 * Hook quản lý upload hình ảnh với staging system
 * 
 * Workflow:
 * 1. User upload → Lưu vào staging với sessionId
 * 2. User save entity → Call confirmImages() để move staging → permanent
 * 3. Images xuất hiện trên detail page với URLs permanent
 * 
 * @example
 * ```tsx
 * const { 
 *   stagingFiles, 
 *   sessionId, 
 *   setStagingFiles, 
 *   setSessionId, 
 *   confirmImages,
 *   hasImages 
 * } = useImageUpload({ entityType: 'customer' });
 * 
 * // In form
 * <ImageUploadManager
 *   value={stagingFiles}
 *   onChange={setStagingFiles}
 *   sessionId={sessionId || undefined}
 *   onSessionChange={setSessionId}
 * />
 * 
 * // On submit
 * await onSubmit(formValues);
 * if (hasImages) {
 *   await confirmImages(customerId, formValues);
 * }
 * ```
 */
export function useImageUpload(options: UseImageUploadOptions): UseImageUploadReturn {
  const { entityType, initialImages } = options;
  
  const [stagingFiles, setStagingFiles] = React.useState<StagingFile[]>([]);
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  
  const hasImages = stagingFiles.length > 0;
  const imageCount = stagingFiles.length;
  
  /**
   * Confirm images từ staging → permanent
   */
  const confirmImages = React.useCallback(
    async (entityId: string, entityData?: Record<string, any>) => {
      if (!sessionId || stagingFiles.length === 0) {
        return null;
      }
      
      try {
        let response: ServerFile[] = [];
        
        switch (entityType) {
          case 'customer':
            response = await FileUploadAPI.confirmCustomerImages(
              sessionId,
              entityId,
              entityData
            );
            break;

          case 'customer-contract':
            response = await FileUploadAPI.confirmStagingFiles(
              sessionId,
              entityId,
              'contracts',
              'contract-file',
              entityData
            );
            break;
            
          case 'product':
            response = await FileUploadAPI.confirmStagingFiles(
              sessionId,
              entityId,
              'products',
              'gallery',
              entityData
            );
            break;
            
          case 'supplier':
            // TODO: Implement when needed
            throw new Error('Supplier images not implemented yet');
            
          case 'employee':
            response = await FileUploadAPI.confirmStagingFiles(
              sessionId,
              entityId,
              'employees',
              'avatar',
              entityData
            );
            break;
            
          default:
            throw new Error(`Unknown entity type: ${entityType}`);
        }
        
        console.log(`[useImageUpload] Confirmed ${response.length} images for ${entityType} ${entityId}`);
        
        toast.success('Thành công', {
          description: `Đã lưu ${stagingFiles.length} hình ảnh`
        });
        
        // Clear staging state after successful confirm
        setStagingFiles([]);
        setSessionId(null);
        
        return response;
      } catch (error) {
        console.error('[useImageUpload] Failed to confirm images:', error);
        
        toast.warning('Cảnh báo', {
          description: `Đã lưu ${entityType} nhưng có lỗi khi xác nhận hình ảnh`
        });
        
        throw error; // Re-throw để caller có thể handle
      }
    },
    [sessionId, stagingFiles.length, entityType]
  );
  
  return {
    stagingFiles,
    sessionId,
    setStagingFiles,
    setSessionId,
    confirmImages,
    hasImages,
    imageCount,
  };
}

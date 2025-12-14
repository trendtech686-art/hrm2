import * as React from 'react';
import { NewDocumentsUpload } from './new-documents-upload.tsx';
import type { StagingFile } from '../../lib/file-upload-api.ts';

type ImageUploadManagerProps = {
  /**
   * Current staging files (images being uploaded)
   */
  value?: StagingFile[];
  
  /**
   * Callback when files change
   */
  onChange?: (files: StagingFile[]) => void;
  
  /**
   * Current session ID for staging uploads
   */
  sessionId?: string;
  
  /**
   * Callback when session ID changes
   */
  onSessionChange?: (sessionId: string) => void;
  
  /**
   * Maximum number of images
   * @default 10
   */
  maxFiles?: number;
  
  /**
   * Maximum size per image in bytes
   * @default 5MB (5 * 1024 * 1024)
   */
  maxSize?: number;
  
  /**
   * Maximum total size for all images in bytes
   * @default 20MB (20 * 1024 * 1024)
   */
  maxTotalSize?: number;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Additional CSS class
   */
  className?: string;
  
  /**
   * Description text to show above upload area
   */
  description?: string;

  /**
   * Number of already saved files counted toward maxFiles
   */
  existingFileCount?: number;
};

/**
 * ImageUploadManager - Component quản lý upload hình ảnh với staging system
 * 
 * Sử dụng cho: Customer, Product, Supplier, Employee profile, v.v.
 * 
 * Features:
 * - Upload to staging trước, confirm sau khi save entity
 * - Auto compression (max 1920x1080, 80% quality)
 * - Drag & drop support
 * - Preview images
 * - Validation (size, type, count)
 * - Session-based để tránh conflict
 * 
 * @example
 * ```tsx
 * const [images, setImages] = useState<StagingFile[]>([]);
 * const [sessionId, setSessionId] = useState<string | null>(null);
 * 
 * <ImageUploadManager
 *   value={images}
 *   onChange={setImages}
 *   sessionId={sessionId || undefined}
 *   onSessionChange={setSessionId}
 *   maxFiles={10}
 *   description="Tải lên hình ảnh khách hàng. Ảnh đầu tiên sẽ là ảnh đại diện."
 * />
 * ```
 */
export function ImageUploadManager({
  value = [],
  onChange,
  sessionId,
  onSessionChange,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB
  maxTotalSize = 20 * 1024 * 1024, // 20MB
  disabled = false,
  className,
  description = "Tải lên hình ảnh. Ảnh đầu tiên sẽ được dùng làm ảnh đại diện.",
  existingFileCount = 0,
}: ImageUploadManagerProps) {
  return (
    <div className={className}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
        <NewDocumentsUpload
          accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] }}
          maxSize={maxSize}
          maxFiles={maxFiles}
          maxTotalSize={maxTotalSize}
          existingFileCount={existingFileCount}
          value={value}
          onChange={onChange ?? (() => {})}
          sessionId={sessionId}
          onSessionChange={onSessionChange ?? (() => {})}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

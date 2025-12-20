/**
 * ExcelFileDropzone
 * 
 * Component kéo thả file Excel cho import
 * - Hỗ trợ kéo thả
 * - Upload lên server staging (tùy chọn)
 * - Preview file đã chọn
 * - Validate file Excel
 */

import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { 
  FileSpreadsheet, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { FileUploadAPI, type StagingFile } from '../../lib/file-upload-api';

// ============================================
// TYPES
// ============================================

interface ExcelFile {
  file: File;
  serverFile?: StagingFile; // Optional: nếu đã upload lên server
  status: 'selected' | 'uploading' | 'uploaded' | 'error';
  errorMessage?: string;
}

interface ExcelFileDropzoneProps {
  value: ExcelFile | null;
  onChange: (file: ExcelFile | null) => void;
  
  // Upload options
  uploadToServer?: boolean; // Có upload lên server staging không
  sessionId?: string;
  onSessionChange?: (sessionId: string) => void;
  
  // Validation
  maxSize?: number; // Default 10MB
  
  // UI
  className?: string;
  disabled?: boolean;
}

// ============================================
// HELPERS
// ============================================

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const isExcelFile = (file: File) => {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
  ];
  const validExtensions = ['.xlsx', '.xls'];
  
  return (
    validTypes.includes(file.type) ||
    validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
  );
};

// ============================================
// COMPONENT
// ============================================

export function ExcelFileDropzone({
  value,
  onChange,
  uploadToServer = false,
  sessionId,
  onSessionChange,
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
  disabled = false,
}: ExcelFileDropzoneProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [currentSessionId, setCurrentSessionId] = React.useState(sessionId || '');

  // Update session ID when prop changes
  React.useEffect(() => {
    if (sessionId) {
      setCurrentSessionId(sessionId);
    }
  }, [sessionId]);

  const handleUploadToServer = React.useCallback(async (file: File): Promise<StagingFile | null> => {
    if (!uploadToServer) return null;
    
    try {
      setIsUploading(true);
      const result = await FileUploadAPI.uploadToStaging([file], currentSessionId || undefined);
      
      if (result.sessionId && result.sessionId !== currentSessionId) {
        setCurrentSessionId(result.sessionId);
        onSessionChange?.(result.sessionId);
      }
      
      return result.files[0] || null;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Không thể upload file lên server');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [uploadToServer, currentSessionId, onSessionChange]);

  const onDrop = React.useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(rejection => {
        const { file, errors } = rejection;
        errors.forEach((error: any) => {
          switch (error.code) {
            case 'file-too-large':
              toast.error(`File "${file.name}" quá lớn`, {
                description: `Kích thước tối đa: ${formatFileSize(maxSize)}`
              });
              break;
            case 'file-invalid-type':
              toast.error(`File "${file.name}" không đúng định dạng`, {
                description: 'Chỉ chấp nhận file Excel (.xlsx, .xls)'
              });
              break;
            default:
              toast.error(`Lỗi: ${error.message}`);
          }
        });
      });
      return;
    }

    // Handle accepted file (only take first one)
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate Excel
    if (!isExcelFile(file)) {
      toast.error('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
      return;
    }

    // Create initial state
    const newExcelFile: ExcelFile = {
      file,
      status: uploadToServer ? 'uploading' : 'selected',
    };
    onChange(newExcelFile);

    // Upload to server if required
    if (uploadToServer) {
      const serverFile = await handleUploadToServer(file);
      if (serverFile) {
        onChange({
          file,
          serverFile,
          status: 'uploaded',
        });
      } else {
        onChange({
          file,
          status: 'error',
          errorMessage: 'Không thể upload file',
        });
      }
    }
  }, [maxSize, uploadToServer, onChange, handleUploadToServer]);

  const handleRemove = React.useCallback(() => {
    onChange(null);
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxSize,
    maxFiles: 1,
    disabled: disabled || isUploading,
    multiple: false,
  });

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={cn('space-y-3', className)}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'relative rounded-lg border-2 border-dashed p-8 text-center cursor-pointer',
          'transition-all duration-200 ease-in-out',
          'hover:border-primary/50 hover:bg-primary/5',
          isDragActive && 'border-primary bg-primary/10',
          isDragAccept && 'border-green-500 bg-green-50',
          isDragReject && 'border-red-500 bg-red-50',
          (disabled || isUploading) && 'opacity-50 cursor-not-allowed pointer-events-none',
          value && 'border-solid border-primary/30 bg-primary/5'
        )}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          // Uploading state
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <div>
              <p className="text-sm font-medium">Đang tải lên...</p>
              <p className="text-xs text-muted-foreground">Vui lòng đợi</p>
            </div>
          </div>
        ) : value ? (
          // File selected state
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <FileSpreadsheet className="h-12 w-12 text-green-600" />
              {value.status === 'uploaded' && (
                <CheckCircle2 className="absolute -bottom-1 -right-1 h-5 w-5 text-green-600 bg-white rounded-full" />
              )}
              {value.status === 'error' && (
                <AlertCircle className="absolute -bottom-1 -right-1 h-5 w-5 text-red-500 bg-white rounded-full" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium truncate max-w-[250px]">{value.file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(value.file.size)}
                {value.status === 'uploaded' && ' • Đã tải lên server'}
                {value.status === 'error' && ` • ${value.errorMessage || 'Lỗi'}`}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4 mr-1" />
              Xóa và chọn file khác
            </Button>
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center gap-3">
            <div className={cn(
              'p-4 rounded-full',
              isDragActive ? 'bg-primary/20' : 'bg-muted'
            )}>
              <Upload className={cn(
                'h-8 w-8',
                isDragActive ? 'text-primary' : 'text-muted-foreground'
              )} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragActive ? 'Thả file vào đây' : 'Kéo thả file Excel vào đây'}
              </p>
              <p className="text-xs text-muted-foreground">
                hoặc click để chọn file • Tối đa {formatFileSize(maxSize)}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Chấp nhận .xlsx, .xls</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export type { ExcelFile, ExcelFileDropzoneProps };

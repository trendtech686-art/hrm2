import * as React from 'react';
import { Download, Eye, X } from 'lucide-react';
import { Button } from './button.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog.tsx';
import { Badge } from './badge.tsx';
import type { UploadedFile } from './file-upload.tsx';

type FilePreviewProps = {
  file: UploadedFile;
  onDownload?: (file: UploadedFile) => void;
  onDelete?: (file: UploadedFile) => void;
  showDelete?: boolean;
};

export function FilePreview({ file, onDownload, onDelete, showDelete = false }: FilePreviewProps) {
  const downloadFile = () => {
    // Create download link
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onDownload?.(file);
  };

  const isImage = file.type.startsWith('image/');
  const isPDF = file.type.includes('pdf');

  return (
    <div className="flex items-center gap-2 p-2 border rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="text-xs">
            {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {(file.size / 1024).toFixed(1)} KB
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {/* Preview Button */}
        {(isImage || isPDF) && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>{file.name}</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-auto">
                {isImage ? (
                  <img 
                    src={file.url} 
                    alt={file.name}
                    className="max-w-full h-auto mx-auto"
                  />
                ) : isPDF ? (
                  <iframe
                    src={file.url}
                    className="w-full h-[600px] border-0"
                    title={file.name}
                  />
                ) : null}
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Download Button */}
        <Button variant="ghost" size="sm" onClick={downloadFile}>
          <Download className="h-4 w-4" />
        </Button>
        
        {/* Delete Button */}
        {showDelete && onDelete && (
          <Button variant="ghost" size="sm" onClick={() => onDelete(file)}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

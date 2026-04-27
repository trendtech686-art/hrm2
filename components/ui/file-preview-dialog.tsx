import { useState, type ReactNode } from "react";
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Eye, Download, FileText, FileSpreadsheet, File } from "lucide-react";

interface FilePreviewDialogProps {
  file: {
    name: string;
    url: string;
    type?: string;
  };
  trigger?: ReactNode;
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'pdf':
      return <FileText className="h-5 w-5 text-red-500" />;
    case 'xlsx':
    case 'xls':
    case 'csv':
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    case 'doc':
    case 'docx':
      return <FileText className="h-5 w-5 text-blue-500" />;
    default:
      return <File className="h-5 w-5 text-muted-foreground" />;
  }
};

const getFileType = (fileName: string): 'pdf' | 'image' | 'office' | 'unknown' => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  if (ext === 'pdf') return 'pdf';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return 'image';
  if (['xlsx', 'xls', 'csv', 'doc', 'docx', 'ppt', 'pptx'].includes(ext || '')) return 'office';
  return 'unknown';
};

export function FilePreviewDialog({ file, trigger }: FilePreviewDialogProps) {
  const [open, setOpen] = useState(false);
  const fileType = getFileType(file.name);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderPreview = () => {
    switch (fileType) {
      case 'pdf':
        return (
          <div className="w-full h-150 border border-border rounded-lg overflow-hidden bg-muted">
            <iframe
              src={file.url}
              className="w-full h-full"
              title={file.name}
            />
          </div>
        );

      case 'image':
        return (
          <div className="relative w-full h-150 bg-muted rounded-lg p-4 flex items-center justify-center">
            <Image
              src={file.url}
              alt={file.name}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-contain rounded-lg"
            />
          </div>
        );

      case 'office': {
        const isLocalhost = typeof window !== 'undefined' && 
          (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (isLocalhost) {
          const fileTypeName = ext === 'xlsx' || ext === 'xls' ? 'Excel' : 
                              ext === 'doc' || ext === 'docx' ? 'Word' : 
                              ext === 'ppt' || ext === 'pptx' ? 'PowerPoint' : 'Office';
          return (
            <div className="w-full h-64 flex flex-col items-center justify-center gap-4 bg-muted/30 rounded-lg border-2 border-dashed border-border">
              {getFileIcon(file.name)}
              <div className="text-center">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-2">File {fileTypeName} không thể xem trước trên môi trường localhost.</p>
                <p className="text-xs text-muted-foreground">Vui lòng tải xuống để xem nội dung.</p>
              </div>
              <Button onClick={handleDownload} size="sm">
                <Download className="mr-2 h-4 w-4" />
                Tải xuống để xem
              </Button>
            </div>
          );
        }
        return (
          <div className="w-full h-150 border border-border rounded-lg overflow-hidden">
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.url)}`}
              className="w-full h-full"
              title={file.name}
            />
          </div>
        );
      }

      default:
        return (
          <div className="w-full h-100 flex flex-col items-center justify-center gap-4 bg-muted/30 rounded-lg border-2 border-dashed border-border">
            {getFileIcon(file.name)}
            <div className="text-center">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Không thể xem trước loại file này
              </p>
            </div>
            <Button onClick={handleDownload} size="sm">
              <Download className="mr-2 h-4 w-4" />
              Tải xuống để xem
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <div onClick={() => setOpen(true)} onKeyDown={(e) => e.key === 'Enter' && setOpen(true)} className="cursor-pointer" role="button" tabIndex={0}>
            {trigger}
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setOpen(true)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}

      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon(file.name)}
              <DialogTitle className="text-lg">{file.name}</DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Tải xuống
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4">
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Component for use in data tables
export function FilePreviewButton({ file }: { file: { name: string; url: string } }) {
  return (
    <FilePreviewDialog
      file={file}
      trigger={
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Eye className="h-4 w-4" />
        </Button>
      }
    />
  );
}

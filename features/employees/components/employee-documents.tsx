import * as React from 'react';
import { toast } from 'sonner';
import { getBaseUrl, getFileUrl } from '@/lib/api-config';
import { useEmployeeDocuments } from '../hooks/use-employee-documents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImagePreviewDialog } from '@/components/ui/image-preview-dialog';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { 
  Download, 
  Eye, 
  File, 
  FileText, 
  Image,
  FolderOpen,
  Search,
  Copy
} from 'lucide-react';
import type { EmployeeDocument, ServerFile } from '../hooks/use-employee-documents';
import { logError } from '@/lib/logger'

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return Image;
  if (type === 'application/pdf') return FileText;
  return File;
};

const getPreviewType = (file: ServerFile): 'image' | 'pdf' | 'office' | 'unknown' => {
  if (file.type?.startsWith('image/')) return 'image';
  if (file.type === 'application/pdf') return 'pdf';
  const ext = (file.originalName || file.name || '').split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return 'image';
  if (['xlsx', 'xls', 'csv', 'doc', 'docx', 'ppt', 'pptx'].includes(ext || '')) return 'office';
  return 'unknown';
};

const documentTypeLabels: Record<string, string> = {
  'legal': 'Giấy tờ pháp lý',
  'work-process': 'Hồ sơ công việc',
  'termination': 'Hồ sơ nghỉ việc',
  'decisions': 'Quyết định',
  'kpi': 'Đánh giá KPI',
  'requests': 'Đơn từ'
};

interface EmployeeDocumentsProps {
  employeeSystemId: string;
}

export function EmployeeDocuments({ employeeSystemId }: EmployeeDocumentsProps) {
  const { data: documents = [], isLoading, error: queryError, refetch } = useEmployeeDocuments(employeeSystemId);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [error, setError] = React.useState<string | null>(queryError ? 'Không thể tải tài liệu. Vui lòng kiểm tra kết nối server.' : null);
  
  // Preview modal state
  const [previewFile, setPreviewFile] = React.useState<ServerFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  
  // Image preview state (for carousel with zoom/rotate)
  const [imagePreviewOpen, setImagePreviewOpen] = React.useState(false);
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const [previewImageIndex, setPreviewImageIndex] = React.useState(0);

  // Get documents for this employee (with search filter)
  const employeeDocuments = React.useMemo(() => {
    if (!searchQuery) return documents;
    
    return documents.filter(doc => 
      doc.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.files.some(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [documents, searchQuery]);

  // Group documents by type
  const documentsByType = React.useMemo(() => {
    const grouped: Record<string, EmployeeDocument[]> = {};
    employeeDocuments.forEach(doc => {
      if (!grouped[doc.documentType]) {
        grouped[doc.documentType] = [];
      }
      grouped[doc.documentType].push(doc);
    });
    return grouped;
  }, [employeeDocuments]);

  // Group documents by name within each type (for grid layout)
  const documentsByName = React.useMemo(() => {
    const result: Record<string, Record<string, EmployeeDocument>> = {
      'legal': {},
      'work-process': {},
      'termination': {},
      'decisions': {},
      'kpi': {},
      'requests': {}
    };
    
    employeeDocuments.forEach(doc => {
      if (result[doc.documentType]) {
        result[doc.documentType][doc.documentName] = doc;
      }
    });
    
    return result;
  }, [employeeDocuments]);

  // Sync query error to local state
  React.useEffect(() => {
    if (queryError) setError('Không thể tải tài liệu. Vui lòng kiểm tra kết nối server.');
    else setError(null);
  }, [queryError]);

  const handleDownload = async (file: ServerFile) => {
    try {
      const downloadUrl = getFileUrl(file.url);
      
      // Fetch file as blob to force download
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.originalName || file.name || file.filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      logError('Download failed', error);
      toast.error('Không thể tải file. Vui lòng thử lại.');
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      logError('Failed to copy', err);
    }
  };

  const _handleDownloadAll = async (documentType: string, docs: EmployeeDocument[]) => {
    try {
      const [{ default: JSZip }, { saveAs }] = await Promise.all([
        import('jszip'),
        import('file-saver'),
      ]);
      const zip = new JSZip();
      const _baseUrl = getBaseUrl();
      
      // Create folder for each document
      for (const doc of docs) {
        const folderName = doc.documentName.replace(/[^a-zA-Z0-9]/g, '_');
        const folder = zip.folder(folderName);
        
        if (folder) {
          for (const file of doc.files) {
            try {
              const downloadUrl = getFileUrl(file.url);
              const response = await fetch(downloadUrl);
              const blob = await response.blob();
              folder.file(file.originalName || file.name, blob);
            } catch (error) {
              logError(`Failed to download file: ${file.name}`, error);
            }
          }
        }
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      const typeLabel = documentTypeLabels[documentType] || documentType;
      saveAs(content, `${typeLabel}_${new Date().toISOString().split('T')[0]}.zip`);
      
    } catch (error) {
      logError('Failed to create ZIP', error);
      toast.error('Không thể tải xuống tất cả files. Vui lòng thử lại.');
    }
  };

  const handlePreview = (file: ServerFile) => {
    const previewType = getPreviewType(file);
    
    if (previewType === 'image') {
      // Collect all images from all documents for carousel
      const allImages: string[] = [];
      let targetIndex = 0;
      
      documents.forEach(doc => {
        doc.files.forEach(f => {
          if (getPreviewType(f) === 'image') {
            if (f.id === file.id || f.url === file.url) {
              targetIndex = allImages.length;
            }
            allImages.push(getFileUrl(f.url));
          }
        });
      });
      
      setPreviewImages(allImages);
      setPreviewImageIndex(targetIndex);
      setImagePreviewOpen(true);
    } else {
      // Non-image files use the regular dialog
      setPreviewFile(file);
      setIsPreviewOpen(true);
    }
  };
  
  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewFile(null);
  };

  const renderPreviewContent = () => {
    if (!previewFile) return null;
    const previewType = getPreviewType(previewFile);
    const fileUrl = getFileUrl(previewFile.url);
    
    // Check if running on localhost - Office Online can't access local files
    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    switch (previewType) {
      case 'pdf':
        return (
          <div className="w-full h-[80vh] border border-border rounded-lg overflow-hidden bg-gray-50">
            <iframe
              src={fileUrl}
              className="w-full h-full"
              title={previewFile.originalName || previewFile.name}
            />
          </div>
        );
      case 'office':
        // Office Online can't access localhost URLs
        if (isLocalhost) {
          const ext = (previewFile.originalName || previewFile.name || '').split('.').pop()?.toLowerCase();
          const fileTypeName = ext === 'xlsx' || ext === 'xls' ? 'Excel' : 
                              ext === 'doc' || ext === 'docx' ? 'Word' : 
                              ext === 'ppt' || ext === 'pptx' ? 'PowerPoint' : 'Office';
          return (
            <div className="w-full h-64 flex flex-col items-center justify-center gap-4 bg-muted/30 rounded-lg border-2 border-dashed border-border">
              <File className="h-12 w-12 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium">{previewFile.originalName || previewFile.name}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  File {fileTypeName} không thể xem trước trên môi trường localhost.
                </p>
                <p className="text-xs text-muted-foreground">
                  Vui lòng tải xuống để xem nội dung.
                </p>
              </div>
              <Button onClick={() => handleDownload(previewFile)} size="sm">
                <Download className="mr-2 h-4 w-4" />
                Tải xuống để xem
              </Button>
            </div>
          );
        }
        return (
          <div className="w-full h-[80vh] border border-border rounded-lg overflow-hidden">
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
              className="w-full h-full"
              title={previewFile.originalName || previewFile.name}
            />
          </div>
        );
      default:
        return (
          <div className="w-full h-64 flex flex-col items-center justify-center gap-4 bg-muted/30 rounded-lg border-2 border-dashed border-border">
            <File className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">{previewFile.originalName || previewFile.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Không thể xem trước loại file này
              </p>
            </div>
            <Button onClick={() => handleDownload(previewFile)} size="sm">
              <Download className="mr-2 h-4 w-4" />
              Tải xuống để xem
            </Button>
          </div>
        );
    }
  };

  if (isLoading && documents.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Đang tải tài liệu...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-destructive mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-h5 font-medium mb-2">Không thể tải tài liệu</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setError(null);
                refetch();
              }}
            >
              Thử lại
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (Object.keys(documentsByType).length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-h5 font-medium mb-2">Chưa có tài liệu</h3>
          <p className="text-muted-foreground">
            Nhân viên này chưa có tài liệu nào được upload.
          </p>
        </CardContent>
      </Card>
    );
  }

  const renderFileCard = (file: ServerFile) => {
    const FileIcon = getFileIcon(file.type);
    const isImage = file.type.startsWith('image/');
    
    return (
      <div 
        key={file.id} 
        className="border border-border rounded-lg p-2 bg-background hover:bg-muted/50 transition-colors"
      >
        <div className="flex flex-col gap-2">
          <div 
            className="w-full aspect-square rounded bg-muted flex items-center justify-center overflow-hidden cursor-pointer" 
            role="button"
            tabIndex={0}
            onClick={() => handlePreview(file)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePreview(file); } }}
          >
            {isImage ? (
              <OptimizedImage 
                src={file.url} 
                alt={file.name}
                fill
                containerClassName="w-full h-full"
                className="object-cover cursor-pointer"
                onClick={() => handlePreview(file)}
                fallback={<FileIcon className="w-12 h-12 text-muted-foreground" />}
              />
            ) : (
              <FileIcon className="w-12 h-12 text-muted-foreground" />
            )}
          </div>
          <div className="space-y-0.5">
            <p className="font-medium text-xs truncate" title={file.name}>
              {file.originalName || file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" className="flex-1 h-7 px-1" onClick={() => handleDownload(file)}>
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="ghost" className="flex-1 h-7 px-1" onClick={() => handlePreview(file)}>
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="ghost" className="flex-1 h-7 px-1" onClick={() => handleCopy(file.originalName || file.name)}>
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderDocumentSection = (
    type: string,
    index: number,
    title: string,
    borderColor: string
  ) => {
    if (Object.keys(documentsByName[type]).length === 0) return null;
    
    return (
      <Card className={`border-l-4 ${borderColor}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-primary">{index}. {title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(documentsByName[type]).map(([docName, doc]) => (
              <div key={doc.id} className="space-y-3 p-3 border border-border rounded-lg bg-muted/30">
                <h5 className="text-sm font-medium text-foreground">{docName}</h5>
                <div className="grid grid-cols-3 gap-2">
                  {doc.files.map((file) => renderFileCard(file))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <h3 className="text-h4 font-semibold flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Tài liệu nhân viên
        </h3>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tài liệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-muted-foreground">Đang tải tài liệu...</span>
        </div>
      ) : employeeDocuments.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              {searchQuery ? 'Không tìm thấy tài liệu phù hợp' : 'Chưa có tài liệu nào'}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {renderDocumentSection('legal', 1, 'Tài liệu pháp lý', 'border-l-blue-500')}
          {/* Section 2: Work process + multi-file documents (decisions, kpi, requests) */}
          {(Object.keys(documentsByName['work-process']).length > 0 || 
            Object.keys(documentsByName['decisions']).length > 0 ||
            Object.keys(documentsByName['kpi']).length > 0 ||
            Object.keys(documentsByName['requests']).length > 0) && (
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-primary">2. Tài liệu trong quá trình làm việc</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(documentsByName['work-process']).map(([docName, doc]) => (
                    <div key={doc.id} className="space-y-3 p-3 border border-border rounded-lg bg-muted/30">
                      <h5 className="text-sm font-medium text-foreground">{docName}</h5>
                      <div className="grid grid-cols-3 gap-2">
                        {doc.files.map((file) => renderFileCard(file))}
                      </div>
                    </div>
                  ))}
                  {Object.entries(documentsByName['decisions']).map(([docName, doc]) => (
                    <div key={doc.id} className="space-y-3 p-3 border border-border rounded-lg bg-muted/30">
                      <h5 className="text-sm font-medium text-foreground">{docName}</h5>
                      <div className="grid grid-cols-3 gap-2">
                        {doc.files.map((file) => renderFileCard(file))}
                      </div>
                    </div>
                  ))}
                  {Object.entries(documentsByName['kpi']).map(([docName, doc]) => (
                    <div key={doc.id} className="space-y-3 p-3 border border-border rounded-lg bg-muted/30">
                      <h5 className="text-sm font-medium text-foreground">{docName}</h5>
                      <div className="grid grid-cols-3 gap-2">
                        {doc.files.map((file) => renderFileCard(file))}
                      </div>
                    </div>
                  ))}
                  {Object.entries(documentsByName['requests']).map(([docName, doc]) => (
                    <div key={doc.id} className="space-y-3 p-3 border border-border rounded-lg bg-muted/30">
                      <h5 className="text-sm font-medium text-foreground">{docName}</h5>
                      <div className="grid grid-cols-3 gap-2">
                        {doc.files.map((file) => renderFileCard(file))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {renderDocumentSection('termination', 3, 'Tài liệu khi nghỉ việc', 'border-l-red-500')}
        </div>
      )}
      
      {/* Image Preview Modal - with carousel, zoom, rotate */}
      <ImagePreviewDialog
        images={previewImages}
        initialIndex={previewImageIndex}
        open={imagePreviewOpen}
        onOpenChange={setImagePreviewOpen}
        title="Xem ảnh tài liệu"
      />
      
      {/* File Preview Modal - for PDF, office docs only */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-hidden p-6">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg flex items-center gap-2">
                {previewFile && (() => {
                  const FileIcon = getFileIcon(previewFile.type);
                  return <FileIcon className="h-5 w-5" />;
                })()}
                {previewFile?.originalName || previewFile?.name || 'Xem trước tài liệu'}
              </DialogTitle>
              {previewFile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(previewFile)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Tải xuống
                </Button>
              )}
            </div>
          </DialogHeader>
          
          <div className="mt-2">
            {renderPreviewContent()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import * as React from 'react';
import { formatDate } from '@/lib/date-utils';
import { getBaseUrl, getFileUrl } from '../../lib/api-config';
import { useDocumentStore } from './document-store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { ProgressiveImage } from '../../components/ui/progressive-image';
import { Dialog, DialogContent, DialogTitle } from '../../components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { 
  Download, 
  Eye, 
  File, 
  FileText, 
  Image,
  Calendar,
  FolderOpen,
  Search,
  Copy,
  Archive,
  X
} from 'lucide-react';
import type { EmployeeDocument, ServerFile } from './document-store';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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
  const { documents, refreshDocuments, loadedEmployees } = useDocumentStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Preview modal state - React-based instead of DOM manipulation (fixes memory leak)
  const [previewFile, setPreviewFile] = React.useState<ServerFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  
  // Check if data is already cached
  const isCached = loadedEmployees.has(employeeSystemId);

  // Get documents for this employee
  const employeeDocuments = React.useMemo(() => {
    const filtered = documents.filter(doc => doc.employeeSystemId === employeeSystemId);
    
    if (!searchQuery) return filtered;
    
    return filtered.filter(doc => 
      doc.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.files.some(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [documents, employeeSystemId, searchQuery]);

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
      'termination': {}
    };
    
    employeeDocuments.forEach(doc => {
      if (result[doc.documentType]) {
        result[doc.documentType][doc.documentName] = doc;
      }
    });
    
    return result;
  }, [employeeDocuments]);

  // Load documents only once (store handles cache)
  React.useEffect(() => {
    if (employeeSystemId) {
      const { loadedEmployees } = useDocumentStore.getState();
      
      // Skip loading if already in cache
      if (loadedEmployees.has(employeeSystemId)) {
        console.log('✅ Documents already cached for:', employeeSystemId);
        return;
      }
      
      console.log('🔄 Loading documents for:', employeeSystemId);
      setIsLoading(true);
      setError(null);
      refreshDocuments(employeeSystemId)
        .catch((err) => {
          console.error('Failed to load documents:', err);
          setError('Không thể tải tài liệu. Vui lòng kiểm tra kết nối server.');
        })
        .finally(() => setIsLoading(false));
    }
  }, [employeeSystemId, refreshDocuments]);

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
      console.error('Download failed:', error);
      alert('Không thể tải file. Vui lòng thử lại.');
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Toast notification would be nice here
      console.log('Copied to clipboard:', text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadAll = async (documentType: string, docs: EmployeeDocument[]) => {
    try {
      const zip = new JSZip();
      const baseUrl = getBaseUrl();
      
      // Create folder for each document
      for (const doc of docs) {
        const folderName = doc.documentName.replace(/[^a-zA-Z0-9]/g, '_');
        const folder = zip.folder(folderName);
        
        if (folder) {
          // Download each file and add to ZIP
          for (const file of doc.files) {
            try {
              const downloadUrl = getFileUrl(file.url);
              const response = await fetch(downloadUrl);
              const blob = await response.blob();
              folder.file(file.originalName || file.name, blob);
            } catch (error) {
              console.error('Failed to download file:', file.name, error);
            }
          }
        }
      }
      
      // Generate ZIP and download
      const content = await zip.generateAsync({ type: 'blob' });
      const typeLabel = documentTypeLabels[documentType] || documentType;
      saveAs(content, `${typeLabel}_${new Date().toISOString().split('T')[0]}.zip`);
      
      console.log('Downloaded all files as ZIP');
    } catch (error) {
      console.error('Failed to create ZIP:', error);
      alert('Không thể tải xuống tất cả files. Vui lòng thử lại.');
    }
  };

  const handlePreview = (file: ServerFile) => {
    // Use React state instead of DOM manipulation to prevent memory leaks
    setPreviewFile(file);
    setIsPreviewOpen(true);
  };
  
  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewFile(null);
  };

  if (isLoading && !isCached) {
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
                setIsLoading(true);
                refreshDocuments(employeeSystemId).finally(() => setIsLoading(false));
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

  return (
    <div className="space-y-6">
      {/* Search Box */}
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
          {/* 1. Tài liệu pháp lý */}
          {Object.keys(documentsByName['legal']).length > 0 && (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-h6 text-primary">1. Tài liệu pháp lý</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(documentsByName['legal']).map(([docName, doc]) => (
                    <div key={doc.id} className="space-y-3 p-3 border rounded-lg bg-muted/30">
                      <h5 className="text-sm font-medium text-foreground">{docName}</h5>
                      <div className="grid grid-cols-3 gap-2">
                        {doc.files.map((file) => {
                          const FileIcon = getFileIcon(file.type);
                          const isImage = file.type.startsWith('image/');
                          
                          return (
                            <div 
                              key={file.id} 
                              className="border rounded-lg p-2 bg-background hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex flex-col gap-2">
                                <div className="w-full aspect-square rounded bg-muted flex items-center justify-center overflow-hidden">
                                  {isImage ? (
                                    <img 
                                      src={getFileUrl(file.url)} 
                                      alt={file.name}
                                      className="w-full h-full object-cover cursor-pointer"
                                      onClick={() => handlePreview(file)}
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                      }}
                                    />
                                  ) : null}
                                  <FileIcon className={`w-12 h-12 text-muted-foreground ${isImage ? 'hidden' : ''}`} />
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
                                  {isImage && (
                                    <Button size="sm" variant="ghost" className="flex-1 h-7 px-1" onClick={() => handlePreview(file)}>
                                      <Eye className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                  <Button size="sm" variant="ghost" className="flex-1 h-7 px-1" onClick={() => handleCopy(file.originalName || file.name)}>
                                    <Copy className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 2. Tài liệu trong quá trình làm việc */}
          {Object.keys(documentsByName['work-process']).length > 0 && (
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-h6 text-primary">2. Tài liệu trong quá trình làm việc</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(documentsByName['work-process']).map(([docName, doc]) => (
                    <div key={doc.id} className="space-y-3 p-3 border rounded-lg bg-muted/30">
                      <h5 className="text-sm font-medium text-foreground">{docName}</h5>
                      <div className="grid grid-cols-3 gap-2">
                        {doc.files.map((file) => {
                          const FileIcon = getFileIcon(file.type);
                          const isImage = file.type.startsWith('image/');
                          
                          return (
                            <div 
                              key={file.id} 
                              className="border rounded-lg p-2 bg-background hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex flex-col gap-2">
                                <div className="w-full aspect-square rounded bg-muted flex items-center justify-center overflow-hidden">
                                  {isImage ? (
                                    <img 
                                      src={getFileUrl(file.url)} 
                                      alt={file.name}
                                      className="w-full h-full object-cover cursor-pointer"
                                      onClick={() => handlePreview(file)}
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                      }}
                                    />
                                  ) : null}
                                  <FileIcon className={`w-12 h-12 text-muted-foreground ${isImage ? 'hidden' : ''}`} />
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
                                  {isImage && (
                                    <Button size="sm" variant="ghost" className="flex-1 h-7 px-1" onClick={() => handlePreview(file)}>
                                      <Eye className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                  <Button size="sm" variant="ghost" className="flex-1 h-7 px-1" onClick={() => handleCopy(file.originalName || file.name)}>
                                    <Copy className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 3. Tài liệu khi nghỉ việc */}
          {Object.keys(documentsByName['termination']).length > 0 && (
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-h6 text-primary">3. Tài liệu khi nghỉ việc</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(documentsByName['termination']).map(([docName, doc]) => (
                    <div key={doc.id} className="space-y-3 p-3 border rounded-lg bg-muted/30">
                      <h5 className="text-sm font-medium text-foreground">{docName}</h5>
                      <div className="grid grid-cols-3 gap-2">
                        {doc.files.map((file) => {
                          const FileIcon = getFileIcon(file.type);
                          const isImage = file.type.startsWith('image/');
                          
                          return (
                            <div 
                              key={file.id} 
                              className="border rounded-lg p-2 bg-background hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex flex-col gap-2">
                                <div className="w-full aspect-square rounded bg-muted flex items-center justify-center overflow-hidden">
                                  {isImage ? (
                                    <img 
                                      src={getFileUrl(file.url)} 
                                      alt={file.name}
                                      className="w-full h-full object-cover cursor-pointer"
                                      onClick={() => handlePreview(file)}
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                      }}
                                    />
                                  ) : null}
                                  <FileIcon className={`w-12 h-12 text-muted-foreground ${isImage ? 'hidden' : ''}`} />
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
                                  {isImage && (
                                    <Button size="sm" variant="ghost" className="flex-1 h-7 px-1" onClick={() => handlePreview(file)}>
                                      <Eye className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                  <Button size="sm" variant="ghost" className="flex-1 h-7 px-1" onClick={() => handleCopy(file.originalName || file.name)}>
                                    <Copy className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {/* Image Preview Modal - React-based to prevent memory leaks */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent 
          className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-black/95 border-0"
          onClick={handleClosePreview}
        >
          <VisuallyHidden>
            <DialogTitle>
              {previewFile?.originalName || previewFile?.name || 'Xem trước ảnh'}
            </DialogTitle>
          </VisuallyHidden>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-white hover:bg-gray-100 rounded-full w-10 h-10 shadow-lg"
            onClick={handleClosePreview}
          >
            <X className="h-6 w-6" />
          </Button>
          
          {previewFile && (
            <div 
              className="flex items-center justify-center w-full h-full min-h-[50vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getFileUrl(previewFile.url)}
                alt={previewFile.originalName || previewFile.name}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

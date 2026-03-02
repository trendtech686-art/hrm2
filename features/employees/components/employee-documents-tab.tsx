/**
 * Employee Documents Tab Component
 * Extracted from employee-form.tsx for better maintainability
 * 
 * Contains:
 * - Legal documents section
 * - Work process documents section
 * - Termination documents section
 * - Multi-file documents (decisions, KPI, requests)
 */

import * as React from 'react';
import { Search } from 'lucide-react';
import type { StagingFile } from '@/lib/file-upload-api';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NewDocumentsUpload } from '@/components/ui/new-documents-upload';
import { ExistingDocumentsViewer } from '@/components/ui/existing-documents-viewer';

// Document lists - exported for reuse
export const legalDocuments = [
  "Sơ yếu lý lịch",
  "Căn cước công dân (CCCD) / CMND",
  "Giấy khai sinh",
  "Sổ hộ khẩu / Giấy xác nhận thông tin cư trú",
  "Giấy khám sức khỏe",
  "Bằng cấp, chứng chỉ chuyên môn",
];

export const workProcessDocuments = [
  "Hợp đồng lao động (và các phụ lục)",
  "Quyết định tuyển dụng / Bổ nhiệm",
  "Cam kết bảo mật thông tin (NDA)",
  "Hồ sơ Thuế thu nhập cá nhân (TNCN)",
  "Thông tin tài khoản ngân hàng",
  "Hồ sơ Bảo hiểm (BHXH, BHYT, BHTN)",
  "Bản mô tả công việc",
];

export const terminationDocuments = [
  "Đơn xin thôi việc / Thông báo chấm dứt hợp đồng",
  "Quyết định thôi việc",
  "Biên bản bàn giao công việc & tài sản",
  "Thỏa thuận chấm dứt hợp đồng",
  "Hồ sơ thanh toán chế độ (lương, phép năm, trợ cấp)",
  "Hồ sơ chốt sổ Bảo hiểm xã hội",
];

export const multiFileDocuments = [
  { id: "decisions", title: "Các quyết định (lương, thưởng, thăng chức, kỷ luật)", maxFiles: 25, description: "Tối đa 25 file, 80MB" },
  { id: "kpi", title: "Tài liệu đánh giá hiệu suất (KPI)", maxFiles: 15, description: "Tối đa 15 file, 60MB" },
  { id: "requests", title: "Đơn từ (nghỉ phép, nghỉ ốm,...)", maxFiles: 30, description: "Tối đa 30 file, 100MB" },
];

interface DocumentCallbacks {
  onChange: (files: StagingFile[]) => void;
  onSessionChange: (sessionId: string) => void;
}

interface EmployeeDocumentsTabProps {
  isEditMode: boolean;
  getPermanentFiles: (documentType: string, documentName: string) => StagingFile[];
  getStagingFiles: (documentType: string, documentName: string) => StagingFile[];
  getDocumentCallbacks: (documentType: string, documentName: string) => DocumentCallbacks;
  getDocumentSessionId: (documentType: string, documentName: string) => string | undefined;
  handleDocumentUpload: (documentType: string, documentName: string, files: StagingFile[]) => void;
  handleRefreshDocuments: () => Promise<void>;
  handleMarkForDeletion: (fileId: string) => void;
  filesToDelete: string[];
}

// Single document upload card component
interface DocumentCardProps {
  documentType: string;
  documentName: string;
  isEditMode: boolean;
  permanentFiles: StagingFile[];
  stagingFiles: StagingFile[];
  callbacks: DocumentCallbacks;
  sessionId: string | undefined;
  handleDocumentUpload: (documentType: string, documentName: string, files: StagingFile[]) => void;
  handleRefreshDocuments: () => Promise<void>;
  handleMarkForDeletion: (fileId: string) => void;
  filesToDelete: string[];
  maxFiles: number;
  maxTotalSize: number;
  description?: string;
}

function DocumentCard({
  documentType,
  documentName,
  isEditMode,
  permanentFiles,
  stagingFiles,
  callbacks,
  sessionId,
  handleDocumentUpload,
  handleRefreshDocuments,
  handleMarkForDeletion,
  filesToDelete,
  maxFiles,
  maxTotalSize,
  description,
}: DocumentCardProps) {
  const hasExistingFiles = permanentFiles.length > 0;

  return (
    <div className="space-y-3 p-3 border border-border rounded-lg bg-muted/30">
      <div className="flex items-start justify-between">
        <h5 className="text-sm font-medium text-foreground">{documentName}</h5>
        {description && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full whitespace-nowrap">
            {description}
          </span>
        )}
      </div>

      {/* Existing files section */}
      {isEditMode && hasExistingFiles && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
            <span>✓</span>
            <span>File đã lưu vĩnh viễn</span>
          </div>
          <ExistingDocumentsViewer
            files={permanentFiles}
            onChange={(updatedFiles) => {
              const allFiles = [...updatedFiles, ...stagingFiles];
              handleDocumentUpload(documentType, documentName, allFiles);
            }}
            onRefresh={handleRefreshDocuments}
            onMarkForDeletion={handleMarkForDeletion}
            markedForDeletion={filesToDelete}
          />
        </div>
      )}

      {/* New files upload section */}
      <div className="space-y-2">
        {isEditMode && hasExistingFiles && (
          <div className="flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded">
            <span>📤</span>
            <span>Thêm file mới (tạm thời)</span>
          </div>
        )}
        <NewDocumentsUpload
          maxFiles={maxFiles}
          maxTotalSize={maxTotalSize}
          value={stagingFiles}
          onChange={callbacks.onChange}
          sessionId={sessionId}
          onSessionChange={callbacks.onSessionChange}
        />
      </div>
    </div>
  );
}

export function EmployeeDocumentsTab({
  isEditMode,
  getPermanentFiles,
  getStagingFiles,
  getDocumentCallbacks,
  getDocumentSessionId,
  handleDocumentUpload,
  handleRefreshDocuments,
  handleMarkForDeletion,
  filesToDelete,
}: EmployeeDocumentsTabProps) {
  const [documentSearch, setDocumentSearch] = React.useState('');

  const lowercasedSearch = documentSearch.toLowerCase();
  const filteredLegalDocuments = legalDocuments.filter(doc => doc.toLowerCase().includes(lowercasedSearch));
  const filteredWorkProcessDocuments = workProcessDocuments.filter(doc => doc.toLowerCase().includes(lowercasedSearch));
  const filteredMultiFileDocuments = multiFileDocuments.filter(doc => doc.title.toLowerCase().includes(lowercasedSearch));
  const filteredTerminationDocuments = terminationDocuments.filter(doc => doc.toLowerCase().includes(lowercasedSearch));

  const hasSearchResults = filteredLegalDocuments.length > 0 || filteredWorkProcessDocuments.length > 0 || filteredMultiFileDocuments.length > 0 || filteredTerminationDocuments.length > 0;
  const isSearching = documentSearch.trim().length > 0;
  const showNoResultsMessage = isSearching && !hasSearchResults;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h3 className="text-h5 font-medium">Tài liệu & Hồ sơ nhân viên</h3>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tài liệu..."
            className="w-full pl-8 h-9"
            value={documentSearch}
            onChange={(e) => setDocumentSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 3-Row Layout */}
      <div className="space-y-6">
        {/* Row 1: Legal Documents */}
        {(!isSearching || filteredLegalDocuments.length > 0) && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-primary">1. Tài liệu pháp lý</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(isSearching ? filteredLegalDocuments : legalDocuments).map(doc => (
                  <DocumentCard
                    key={doc}
                    documentType="legal"
                    documentName={doc}
                    isEditMode={isEditMode}
                    permanentFiles={getPermanentFiles('legal', doc)}
                    stagingFiles={getStagingFiles('legal', doc)}
                    callbacks={getDocumentCallbacks('legal', doc)}
                    sessionId={getDocumentSessionId('legal', doc)}
                    handleDocumentUpload={handleDocumentUpload}
                    handleRefreshDocuments={handleRefreshDocuments}
                    handleMarkForDeletion={handleMarkForDeletion}
                    filesToDelete={filesToDelete}
                    maxFiles={3}
                    maxTotalSize={30 * 1024 * 1024}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Row 2: Work Process Documents */}
        {(!isSearching || filteredWorkProcessDocuments.length > 0 || filteredMultiFileDocuments.length > 0) && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-primary">2. Tài liệu trong quá trình làm việc</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(isSearching ? filteredWorkProcessDocuments : workProcessDocuments).map(doc => (
                  <DocumentCard
                    key={doc}
                    documentType="work-process"
                    documentName={doc}
                    isEditMode={isEditMode}
                    permanentFiles={getPermanentFiles('work-process', doc)}
                    stagingFiles={getStagingFiles('work-process', doc)}
                    callbacks={getDocumentCallbacks('work-process', doc)}
                    sessionId={getDocumentSessionId('work-process', doc)}
                    handleDocumentUpload={handleDocumentUpload}
                    handleRefreshDocuments={handleRefreshDocuments}
                    handleMarkForDeletion={handleMarkForDeletion}
                    filesToDelete={filesToDelete}
                    maxFiles={5}
                    maxTotalSize={40 * 1024 * 1024}
                  />
                ))}
                {(isSearching ? filteredMultiFileDocuments : multiFileDocuments).map(doc => (
                  <DocumentCard
                    key={doc.id}
                    documentType={doc.id}
                    documentName={doc.title}
                    isEditMode={isEditMode}
                    permanentFiles={getPermanentFiles(doc.id, doc.title)}
                    stagingFiles={getStagingFiles(doc.id, doc.title)}
                    callbacks={getDocumentCallbacks(doc.id, doc.title)}
                    sessionId={getDocumentSessionId(doc.id, doc.title)}
                    handleDocumentUpload={handleDocumentUpload}
                    handleRefreshDocuments={handleRefreshDocuments}
                    handleMarkForDeletion={handleMarkForDeletion}
                    filesToDelete={filesToDelete}
                    maxFiles={doc.id === 'requests' ? 30 : doc.id === 'decisions' ? 25 : 15}
                    maxTotalSize={doc.id === 'requests' ? 100 * 1024 * 1024 : doc.id === 'decisions' ? 80 * 1024 * 1024 : 60 * 1024 * 1024}
                    description={doc.description}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Row 3: Termination Documents */}
        {(!isSearching || filteredTerminationDocuments.length > 0) && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-primary">3. Tài liệu khi nghỉ việc</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(isSearching ? filteredTerminationDocuments : terminationDocuments).map(doc => (
                  <DocumentCard
                    key={doc}
                    documentType="termination"
                    documentName={doc}
                    isEditMode={isEditMode}
                    permanentFiles={getPermanentFiles('termination', doc)}
                    stagingFiles={getStagingFiles('termination', doc)}
                    callbacks={getDocumentCallbacks('termination', doc)}
                    sessionId={getDocumentSessionId('termination', doc)}
                    handleDocumentUpload={handleDocumentUpload}
                    handleRefreshDocuments={handleRefreshDocuments}
                    handleMarkForDeletion={handleMarkForDeletion}
                    filesToDelete={filesToDelete}
                    maxFiles={5}
                    maxTotalSize={35 * 1024 * 1024}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {showNoResultsMessage && (
        <div className="text-center text-muted-foreground py-8">
          Không tìm thấy tài liệu nào khớp với &quot;{documentSearch}&quot;.
        </div>
      )}
    </>
  );
}

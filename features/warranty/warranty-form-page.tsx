'use client'

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

// Contexts
import { usePageHeader } from '../../contexts/page-header-context';
import { asSystemId } from '../../lib/id-types';

// Types & Store
import type { WarrantyFormValues } from './types';
import { useWarrantyStore } from './store';
import { useWarrantyFinder, useAllWarranties } from './hooks/use-all-warranties';

// UI Components
import { Button } from '../../components/ui/button';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Card, CardContent } from '../../components/ui/card';

// REUSE from orders module
import { CustomerSelector } from '../orders/components/customer-selector';
import { OrderNotes } from '../orders/components/order-notes';

// Warranty-specific components
import { WarrantyFormInfoCard } from './components/cards/warranty-form-info-card';
import { WarrantyProductsSection } from './components/warranty-products-section';
import { WarrantySummary } from './components/warranty-summary';
import { WarrantyReceivedImagesCard } from './components/warranty-received-images-card';
import { WarrantyProcessedImagesCard } from './components/warranty-processed-images-card';

// Hooks - TÁCH RIÊNG
import { useWarrantyFormState } from './hooks/use-warranty-form-state';
import { useWarrantyFormSubmit } from './hooks/use-warranty-form-submit';

// Utils - TÁCH RIÊNG
import { urlToStagingFile, getWarrantyFormDefaultValues, getWarrantyFormBreadcrumb, getWarrantyFormTitle } from './utils/warranty-form-helpers';

// Stores for lookup
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import { useAllEmployees } from '../employees/hooks/use-all-employees';

/**
 * Trang tạo/sửa phiếu bảo hành
 * 
 * Layout 2 cột giống OrderForm:
 * - Left (flex-grow-7): Customer, Additional Info, Products+Images, Notes
 * - Right (flex-grow-3): Summary
 */
export function WarrantyFormPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { setPageHeader } = usePageHeader();
  const location = window.location;
  
  // Check if this is "update mode" (limited editing for incomplete status)
  const isUpdateMode = location.pathname.includes('/update');
  
  // ===== STATE MANAGEMENT - Tách ra hook riêng =====
  const formState = useWarrantyFormState();
  
  const { add, update, generateNextSystemId } = useWarrantyStore();
  const { findById } = useWarrantyFinder();
  const { data: allTickets } = useAllWarranties();
  const { data: branches } = useAllBranches();
  const { data: employees } = useAllEmployees();

  const isEditing = !!systemId;
  const ticketSystemId = React.useMemo(() => (systemId ? asSystemId(systemId) : null), [systemId]);
  const ticket = React.useMemo(() => (ticketSystemId ? findById(ticketSystemId) : null), [findById, ticketSystemId]);

  // Prevent editing if ticket is returned (đã trả hàng cho khách)
  const isReadOnly = React.useMemo(() => {
    if (!ticket) return false;
    return ticket.status === 'returned';
  }, [ticket]);

  // Form
  const form = useForm<WarrantyFormValues>({
    defaultValues: getWarrantyFormDefaultValues(),
  });

  // Memoize combined image URLs to avoid recalculating on every render
  const receivedImageUrls = React.useMemo(() => [
    ...formState.receivedPermanentFiles.map(img => img.url),
    ...formState.receivedStagingFiles.map(img => img.url)
  ], [formState.receivedPermanentFiles, formState.receivedStagingFiles]);

  const processedImageUrls = React.useMemo(() => [
    ...formState.processedPermanentFiles.map(img => img.url),
    ...formState.processedStagingFiles.map(img => img.url)
  ], [formState.processedPermanentFiles, formState.processedStagingFiles]);

  // Sync images to form
  React.useEffect(() => {
    form.setValue('receivedImages', receivedImageUrls, { shouldDirty: false });
  }, [receivedImageUrls, form]);

  React.useEffect(() => {
    form.setValue('processedImages', processedImageUrls, { shouldDirty: false });
  }, [processedImageUrls, form]);

  // Redirect if trying to edit a returned ticket
  React.useEffect(() => {
    if (isReadOnly && isEditing) {
      toast.error('Không thể chỉnh sửa phiếu đã trả hàng cho khách');
      router.push(`/warranty/${systemId}`);
    }
  }, [isReadOnly, isEditing, systemId, router]);

  // ===== FILE DELETION HANDLERS =====
  const handleMarkReceivedForDeletion = React.useCallback((fileId: string) => {
    formState.setReceivedFilesToDelete(prev => {
      if (prev.includes(fileId)) {
        return prev.filter(id => id !== fileId);
      } else {
        return [...prev, fileId];
      }
    });
  }, [formState]);

  const handleMarkProcessedForDeletion = React.useCallback((fileId: string) => {
    formState.setProcessedFilesToDelete(prev => {
      if (prev.includes(fileId)) {
        return prev.filter(id => id !== fileId);
      } else {
        return [...prev, fileId];
      }
    });
  }, [formState]);

  // Load ticket form data
  React.useEffect(() => {
    if (!isEditing || !ticket) return;
    
    form.reset({
      id: ticket.id,
      customer: ticket.customerName ? {
        name: ticket.customerName,
        phone: ticket.customerPhone,
      } : null,
      branchSystemId: ticket.branchSystemId || '',
      employeeSystemId: ticket.employeeSystemId || '',
      trackingCode: ticket.trackingCode,
      shippingFee: ticket.shippingFee,
      referenceUrl: ticket.referenceUrl || '',
      externalReference: ticket.externalReference || '',
      receivedImages: ticket.receivedImages,
      products: ticket.products,
      processedImages: ticket.processedImages,
      status: ticket.status,
      notes: ticket.notes || '',
      settlementMethod: '',
      settlementAmount: 0,
      settlementBankAccount: '',
      settlementTransactionCode: '',
      settlementDueDate: '',
      settlementVoucherCode: '',
    });
  }, [isEditing, ticket, form]);

  // Load received images
  React.useEffect(() => {
    if (!isEditing || !ticket) return;
    
    const receivedPermanent = (ticket.receivedImages || [])
      .filter((url): url is string => !!url && typeof url === 'string')
      .map((url, idx) => urlToStagingFile(url, idx, 'existing-received'));
    
    formState.setReceivedPermanentFiles(receivedPermanent);
    formState.setReceivedStagingFiles([]);
    formState.setReceivedSessionId(null);
  }, [isEditing, ticket, formState]);

  // Load processed images
  React.useEffect(() => {
    if (!isEditing || !ticket) return;
    
    const processedPermanent = (ticket.processedImages || [])
      .filter((url): url is string => !!url && typeof url === 'string')
      .map((url, idx) => urlToStagingFile(url, idx, 'existing-processed'));
    
    formState.setProcessedPermanentFiles(processedPermanent);
    formState.setProcessedStagingFiles([]);
    formState.setProcessedSessionId(null);
  }, [isEditing, ticket, formState]);

  // ===== SUBMIT HANDLER - Tách ra hook riêng =====
  const { onSubmit } = useWarrantyFormSubmit({
    isEditing,
    ticket: ticket ?? null,
    allTickets,
    branches,
    employees,
    generateNextSystemId: generateNextSystemId ?? (() => ''),
    add,
    update,
    ...formState,
  });

  // Page header - Memoize actions
  const actions = React.useMemo(() => [
    <Button
      key="cancel"
      type="button"
      variant="outline"
      onClick={() => router.push('/warranty')}
      size="sm"
      className="h-9"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Quay lại
    </Button>,
    <Button
      key="save"
      type="submit"
      form="warranty-form"
      disabled={isReadOnly || formState.isSubmitting}
      size="sm"
      className="h-9"
    >
      {formState.isSubmitting ? 'Đang lưu...' : (isEditing ? 'Lưu thay đổi' : 'Tạo phiếu')}
    </Button>,
  ], [router, isReadOnly, formState.isSubmitting, isEditing]);

  // Set page header
  React.useEffect(() => {
    setPageHeader({
      title: getWarrantyFormTitle(isUpdateMode, isEditing, ticket?.id),
      breadcrumb: getWarrantyFormBreadcrumb(isUpdateMode, isEditing, ticket),
      backPath: '/warranty',
      actions,
    });
  }, [isEditing, isUpdateMode, ticket, actions, setPageHeader]);

  return (
    <FormProvider {...form}>
      <form id="warranty-form" onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
        <ScrollArea className="flex-grow">
          <div className="pr-4 space-y-4">
            {/* Read-only warning */}
            {isReadOnly && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="pt-6">
                  <p className="text-body-sm text-amber-800">
                    <strong>Lưu ý:</strong> Phiếu đã xử lý/trả hàng. Không thể chỉnh sửa.
                  </p>
                </CardContent>
              </Card>
            )}
            
            {/* Update mode warning */}
            {isUpdateMode && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <p className="text-body-sm text-blue-800">
                    <strong>Chế độ cập nhật thông tin:</strong> Chỉ có thể thêm/sửa sản phẩm bảo hành và ghi chú. Các thông tin khác đã bị khóa.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Hàng 1: Thông tin khách hàng (70%) + Thông tin bổ sung (30%) */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-[70%]">
                <CustomerSelector disabled={isReadOnly || isUpdateMode} />
              </div>
              <div className="w-full md:w-[30%]">
                <WarrantyFormInfoCard disabled={isReadOnly || isUpdateMode} />
              </div>
            </div>

            {/* Hàng 2: Hình ảnh đơn hàng - 2 cards 50-50 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WarrantyReceivedImagesCard
                isEditing={isEditing}
                disabled={isReadOnly || isUpdateMode}
                permanentFiles={formState.receivedPermanentFiles}
                setPermanentFiles={formState.setReceivedPermanentFiles}
                stagingFiles={formState.receivedStagingFiles}
                setStagingFiles={formState.setReceivedStagingFiles}
                sessionId={formState.receivedSessionId}
                setSessionId={formState.setReceivedSessionId}
                filesToDelete={formState.receivedFilesToDelete}
                onMarkForDeletion={handleMarkReceivedForDeletion}
              />
              
              <WarrantyProcessedImagesCard
                isEditing={isEditing}
                disabled={isReadOnly}
                permanentFiles={formState.processedPermanentFiles}
                setPermanentFiles={formState.setProcessedPermanentFiles}
                stagingFiles={formState.processedStagingFiles}
                setStagingFiles={formState.setProcessedStagingFiles}
                sessionId={formState.processedSessionId}
                setSessionId={formState.setProcessedSessionId}
                filesToDelete={formState.processedFilesToDelete}
                onMarkForDeletion={handleMarkProcessedForDeletion}
              />
            </div>

            {/* Hàng 3: Danh sách sản phẩm bảo hành */}
            <WarrantyProductsSection 
              disabled={isReadOnly} 
              onProductImagesStateChange={formState.setProductImagesState}
            />

            {/* Hàng 4: Ghi chú (30%) + Thanh toán (70%) */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-[30%]">
                <OrderNotes disabled={isReadOnly} />
              </div>
              <div className="w-full md:w-[70%]">
                <WarrantySummary disabled={isReadOnly} />
              </div>
            </div>
          </div>
        </ScrollArea>
      </form>
    </FormProvider>
  );
}

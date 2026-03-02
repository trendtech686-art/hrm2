'use client'

import * as React from 'react';
import { useParams, usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

// Contexts
import { usePageHeader } from '../../contexts/page-header-context';
import { useAuth } from '../../contexts/auth-context';
import { asSystemId } from '../../lib/id-types';
import { generateSubEntityId } from '@/lib/id-utils';

// Types & Store
import type { WarrantyFormValues, WarrantyTicket } from './types';
import { useWarranty, warrantyKeys } from './hooks/use-warranties';
import { useWarrantyFinder, useAllWarranties } from './hooks/use-all-warranties';
import { createWarranty, updateWarranty } from './api/warranties-api';

// UI Components
import { Button } from '../../components/ui/button';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Card, CardContent } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import type { UploadedImage } from '../../components/ui/simple-image-upload';

// REUSE from orders module
import { CustomerSelector } from '../orders/components/customer-selector';
import { OrderNotes } from '../orders/components/order-notes';

// Warranty-specific components
import { WarrantyFormInfoCard } from './components/cards/warranty-form-info-card';
import { WarrantyProductsSection } from './components/warranty-products-section';
import { WarrantySummary } from './components/warranty-summary';
import { WarrantyImagesCard } from './components/warranty-images-card';

// Utils
import { getWarrantyFormDefaultValues, getWarrantyFormBreadcrumb, getWarrantyFormTitle, extractCustomerAddress, calculateWarrantySummary } from './utils/warranty-form-helpers';
import { validateWarrantyFormData, validateBranchAndEmployee } from './utils/warranty-form-validation';
import { getCurrentDate, toISODateTime } from '../../lib/date-utils';

// Stores for lookup
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import { useAllEmployees } from '../employees/hooks/use-all-employees';

/**
 * Trang tạo/sửa phiếu bảo hành
 * 
 * Flow đơn giản giống Product:
 * - Upload ảnh → Lưu ngay (permanent)
 * - Xóa ảnh → Xóa ngay
 * - Save form → Dùng URL từ images để cập nhật warranty
 */
export function WarrantyFormPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { setPageHeader } = usePageHeader();
  const { user } = useAuth();
  
  // Check if this is "update mode" (limited editing for incomplete status)
  const isUpdateMode = pathname.includes('/update');
  
  const { findById } = useWarrantyFinder();
  const { data: allTickets } = useAllWarranties();
  const { data: branches } = useAllBranches();
  const { data: employees } = useAllEmployees();

  // ✅ React Query for single ticket
  const { data: ticketFromQuery, isLoading } = useWarranty(systemId);

  const isEditing = !!systemId;
  const ticketSystemId = React.useMemo(() => (systemId ? asSystemId(systemId) : null), [systemId]);
  
  // ✅ Ưu tiên React Query, fallback to store
  const ticket = React.useMemo(() => {
    if (ticketSystemId) {
      return ticketFromQuery || findById(ticketSystemId) || null;
    }
    return null;
  }, [ticketSystemId, ticketFromQuery, findById]);

  // Prevent editing if ticket is returned (đã trả hàng cho khách)
  const isReadOnly = React.useMemo(() => {
    if (!ticket) return false;
    return ticket.status === 'RETURNED';
  }, [ticket]);

  // Form
  const form = useForm<WarrantyFormValues>({
    defaultValues: getWarrantyFormDefaultValues(),
  });

  // ═══════════════════════════════════════════════════════════════
  // SIMPLIFIED IMAGE MANAGEMENT - Giống Product
  // Images are uploaded permanently when selected, no staging needed
  // ═══════════════════════════════════════════════════════════════
  const [receivedImages, setReceivedImages] = React.useState<UploadedImage[]>([]);
  const [processedImages, setProcessedImages] = React.useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Load existing images when editing
  React.useEffect(() => {
    if (isEditing && ticket) {
      // Load received images from ticket
      const existingReceivedImages = (ticket.receivedImages || [])
        .filter((url): url is string => !!url && typeof url === 'string')
        .map((url, idx) => ({
          id: generateSubEntityId('received'),
          url,
          name: `received-${idx + 1}.jpg`,
          size: 0,
        }));
      setReceivedImages(existingReceivedImages);
      
      // Load processed images from ticket
      const existingProcessedImages = (ticket.processedImages || [])
        .filter((url): url is string => !!url && typeof url === 'string')
        .map((url, idx) => ({
          id: generateSubEntityId('processed'),
          url,
          name: `processed-${idx + 1}.jpg`,
          size: 0,
        }));
      setProcessedImages(existingProcessedImages);
    }
  }, [isEditing, ticket]);

  // Sync images to form (for validation if needed)
  React.useEffect(() => {
    form.setValue('receivedImages', receivedImages.map(img => img.url), { shouldDirty: false });
  }, [receivedImages, form]);

  React.useEffect(() => {
    form.setValue('processedImages', processedImages.map(img => img.url), { shouldDirty: false });
  }, [processedImages, form]);

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

  // Redirect if trying to edit a returned ticket
  React.useEffect(() => {
    if (isReadOnly && isEditing) {
      toast.error('Không thể chỉnh sửa phiếu đã trả hàng cho khách');
      router.push(`/warranty/${systemId}`);
    }
  }, [isReadOnly, isEditing, systemId, router]);

  // ✅ Ref để lấy state hình ảnh sản phẩm khi submit
  const getProductImagesStateRef = React.useRef<(() => {
    productPermanentFiles: Record<string, { id: string; url: string }[]>;
    productStagingFiles: Record<string, import('@/lib/file-upload-api').StagingFile[]>;
    productSessionIds: Record<string, string>;
    productFilesToDelete: Record<string, string[]>;
  }) | null>(null);

  // ===== SUBMIT HANDLER - Đơn giản hóa =====
  const onSubmit = React.useCallback(async (data: WarrantyFormValues) => {
    setIsSubmitting(true);
    
    try {
      // ===== VALIDATION =====
      if (!validateWarrantyFormData(data, isEditing, allTickets || [])) {
        setIsSubmitting(false);
        return;
      }

      // ===== LOOKUP DATA =====
      const { branch, employee } = validateBranchAndEmployee(
        data.branchSystemId,
        data.employeeSystemId,
        branches || [],
        employees || []
      );
      
      if (!branch || !employee) {
        setIsSubmitting(false);
        return;
      }

      // ===== EXTRACT DATA =====
      const customerAddress = extractCustomerAddress(data.customer);
      const summary = calculateWarrantySummary(data.products);
      
      // Get image URLs directly from state - no staging needed!
      const finalReceivedImageUrls = receivedImages.map(img => img.url);
      const finalProcessedImageUrls = processedImages.map(img => img.url);

      // ===== PREPARE DATA =====
      const ticketData = {
        id: isEditing && ticket ? ticket.id : (data.id?.trim() || ''),
        branchSystemId: data.branchSystemId,
        branchName: branch.name,
        employeeSystemId: data.employeeSystemId,
        employeeName: employee.fullName,
        customerName: data.customer?.name || '',
        customerPhone: data.customer?.phone || '',
        customerAddress: customerAddress,
        trackingCode: data.trackingCode.trim(),
        shippingFee: data.shippingFee || 0,
        referenceUrl: data.referenceUrl?.trim() || undefined,
        externalReference: data.externalReference?.trim() || undefined,
        receivedImages: finalReceivedImageUrls,
        products: data.products || [],
        processedImages: finalProcessedImageUrls,
        status: (data.products && data.products.length > 0) 
          ? 'PROCESSING' as const
          : 'RECEIVED' as const,
        summary,
        notes: data.notes || '',
        createdBy: user?.name || 'Admin',
        createdAt: toISODateTime(getCurrentDate()),
        updatedAt: toISODateTime(getCurrentDate()),
      };

      if (isEditing && ticket) {
        // ===== UPDATE EXISTING TICKET =====
        const hasProducts = data.products && data.products.length > 0;
        const shouldTransitionToProcessing = ticket.status === 'RECEIVED' && hasProducts;
        
        const updateData = {
          ...ticketData,
          status: shouldTransitionToProcessing ? 'PROCESSING' as const : ticket.status,
        };
        
        await updateWarranty(ticket.systemId, updateData as Partial<WarrantyTicket>);
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: warrantyKeys.all });
        
        toast.success('Đã cập nhật phiếu bảo hành', {
          description: `Mã: ${ticket.id}`,
        });
        
        router.push(`/warranty/${ticket.systemId}`);
      } else {
        // ===== CREATE NEW TICKET =====
        const createdWarranty = await createWarranty(ticketData as Partial<WarrantyTicket>);
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: warrantyKeys.all });
        
        toast.success('Đã tạo phiếu bảo hành', { 
          description: `Mã: ${createdWarranty.id} - Khách: ${data.customer?.name}`,
        });
        
        router.push(`/warranty/${createdWarranty.systemId}`);
      }
    } catch (error) {
      console.error('Error saving warranty ticket:', error);
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
      toast.error('Lỗi lưu phiếu bảo hành', { 
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isEditing,
    ticket,
    allTickets,
    branches,
    employees,
    receivedImages,
    processedImages,
    user,
    router,
    queryClient,
  ]);

  // ✅ Handler để submit form từ page header button
  const handleSubmitClick = React.useCallback(() => {
    const formElement = document.getElementById('warranty-form') as HTMLFormElement;
    if (formElement) {
      formElement.requestSubmit();
    }
  }, []);

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
      type="button"
      onClick={handleSubmitClick}
      disabled={isReadOnly || isSubmitting}
      size="sm"
      className="h-9"
    >
      {isSubmitting ? 'Đang lưu...' : (isEditing ? 'Lưu thay đổi' : 'Tạo phiếu')}
    </Button>,
  ], [router, isReadOnly, isSubmitting, isEditing, handleSubmitClick]);

  // Set page header
  React.useEffect(() => {
    setPageHeader({
      title: getWarrantyFormTitle(isUpdateMode, isEditing, ticket?.id),
      breadcrumb: getWarrantyFormBreadcrumb(isUpdateMode, isEditing, ticket),
      backPath: '/warranty',
      actions,
    });
  }, [isEditing, isUpdateMode, ticket, actions, setPageHeader]);

  // Loading state
  if (isEditing && isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <FormProvider {...form}>
      <form id="warranty-form" onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
        <ScrollArea className="grow">
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
              <WarrantyImagesCard
                title="Hình ảnh lúc nhận"
                warrantyId={ticket?.systemId}
                documentName="received"
                images={receivedImages}
                onImagesChange={setReceivedImages}
                disabled={isReadOnly || isUpdateMode}
                helperText="Tải lên hình ảnh sản phẩm khi nhận từ khách hàng"
              />
              
              <WarrantyImagesCard
                title="Hình ảnh đã xử lý"
                warrantyId={ticket?.systemId}
                documentName="processed"
                images={processedImages}
                onImagesChange={setProcessedImages}
                disabled={isReadOnly}
                helperText="Tải lên hình ảnh sản phẩm sau khi xử lý bảo hành"
              />
            </div>

            {/* Hàng 3: Danh sách sản phẩm bảo hành */}
            <WarrantyProductsSection 
              disabled={isReadOnly} 
              getImagesStateRef={getProductImagesStateRef}
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

            {/* Sticky Submit Button - Mobile */}
            <div className="sticky bottom-0 bg-background pt-4 pb-2 border-t mt-4 -mx-4 px-4 flex justify-end gap-2 md:hidden">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/warranty')}
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isReadOnly || isSubmitting}
                size="sm"
              >
                {isSubmitting ? 'Đang lưu...' : (isEditing ? 'Lưu thay đổi' : 'Tạo phiếu')}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </form>
    </FormProvider>
  );
}

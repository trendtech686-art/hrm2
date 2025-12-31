'use client'

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';
import { asSystemId, asBusinessId } from '../../lib/id-types';

// Types & Store
import type { WarrantyFormValues, WarrantyProduct, SettlementType } from './types';
import { useWarrantyStore } from './store';
import { getCurrentDate, toISODateTime } from '../../lib/date-utils';

// UI Components
import { Button } from '../../components/ui/button';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { usePageHeader } from '../../contexts/page-header-context';
import { ExistingDocumentsViewer } from '../../components/ui/existing-documents-viewer';
import { NewDocumentsUpload } from '../../components/ui/new-documents-upload';
import type { StagingFile } from '../../lib/file-upload-api';
import { FileUploadAPI } from '../../lib/file-upload-api';

// REUSE from orders module
import { CustomerSelector } from '../orders/components/customer-selector';
import { OrderNotes } from '../orders/components/order-notes';

// Warranty-specific adapters
import { WarrantyFormInfoCard } from './components/index';
import { WarrantyProductsSection } from './components/warranty-products-section';
import { WarrantySummary } from './components/warranty-summary';

// Stores for lookup
import { useBranchStore } from '../settings/branches/store';
import { useEmployeeStore } from '../employees/store';

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
  
  // State for image upload - SEPARATE permanent and staging files (like Employee module)
  const [receivedPermanentFiles, setReceivedPermanentFiles] = React.useState<StagingFile[]>([]);
  const [receivedStagingFiles, setReceivedStagingFiles] = React.useState<StagingFile[]>([]);
  const [processedPermanentFiles, setProcessedPermanentFiles] = React.useState<StagingFile[]>([]);
  const [processedStagingFiles, setProcessedStagingFiles] = React.useState<StagingFile[]>([]);
  const [receivedSessionId, setReceivedSessionId] = React.useState<string | null>(null);
  const [processedSessionId, setProcessedSessionId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Mark for deletion state - for safe deletion mode
  const [receivedFilesToDelete, setReceivedFilesToDelete] = React.useState<string[]>([]);
  const [processedFilesToDelete, setProcessedFilesToDelete] = React.useState<string[]>([]);
  
  // ===== PRODUCT IMAGES STATE (from WarrantyProductsSection) =====
  const [productImagesState, setProductImagesState] = React.useState<{
    productPermanentFiles: Record<string, StagingFile[]>;
    productStagingFiles: Record<string, StagingFile[]>;
    productSessionIds: Record<string, string | null>;
    productFilesToDelete: Record<string, string[]>;
  }>({
    productPermanentFiles: {},
    productStagingFiles: {},
    productSessionIds: {},
    productFilesToDelete: {},
  });
  
  const { user } = useAuth();
  const { findById, add, update, generateNextSystemId, data: allTickets } = useWarrantyStore();
  const { data: branches } = useBranchStore();
  const { data: employees } = useEmployeeStore();

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
    defaultValues: {
      id: '', // Mã phiếu bảo hành
      customer: null,
      branchSystemId: '',
      employeeSystemId: '',
      trackingCode: '',
      shippingFee: undefined,
      referenceUrl: '',
      externalReference: '',
      receivedImages: [],
      processedImages: [],
      products: [],
      status: 'incomplete',
      notes: '',
      settlementMethod: '',
      settlementAmount: 0,
      settlementBankAccount: '',
      settlementTransactionCode: '',
      settlementDueDate: '',
      settlementVoucherCode: '',
    },
  });

  const { handleSubmit: _handleSubmit, formState: { errors: _errors, isDirty: _isDirty } } = form;

  // Memoize combined image URLs to avoid recalculating on every render
  const receivedImageUrls = React.useMemo(() => [
    ...receivedPermanentFiles.map(img => img.url),
    ...receivedStagingFiles.map(img => img.url)
  ], [receivedPermanentFiles, receivedStagingFiles]);

  const processedImageUrls = React.useMemo(() => [
    ...processedPermanentFiles.map(img => img.url),
    ...processedStagingFiles.map(img => img.url)
  ], [processedPermanentFiles, processedStagingFiles]);

  // Sync images to form - use memoized values
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

  // Handler for marking files for deletion (SAFE mode - like Employee)
  const handleMarkReceivedForDeletion = React.useCallback((fileId: string) => {
    setReceivedFilesToDelete(prev => {
      if (prev.includes(fileId)) {
        // Remove from delete list (unmark)
        return prev.filter(id => id !== fileId);
      } else {
        // Add to delete list (mark)
        return [...prev, fileId];
      }
    });
  }, []);

  const handleMarkProcessedForDeletion = React.useCallback((fileId: string) => {
    setProcessedFilesToDelete(prev => {
      if (prev.includes(fileId)) {
        // Remove from delete list (unmark)
        return prev.filter(id => id !== fileId);
      } else {
        // Add to delete list (mark)
        return [...prev, fileId];
      }
    });
  }, []);

  // Helper to convert URL to StagingFile - memoized
  const urlToStagingFile = React.useCallback((url: string, idx: number, prefix: string): StagingFile => {
    const filename = url.split('/').pop() || `image-${idx}`;
    return {
      id: `${prefix}-${idx}`,
      sessionId: '',
      name: filename,
      originalName: filename,
      slug: filename,
      filename: filename,
      size: 0,
      type: 'image/jpeg',
      url,
      status: 'staging' as const,
      uploadedAt: new Date().toISOString(),
      metadata: '',
    };
  }, []);

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
      // Settlement fields are not stored in ticket anymore
      settlementMethod: '',
      settlementAmount: 0,
      settlementBankAccount: '',
      settlementTransactionCode: '',
      settlementDueDate: '',
      settlementVoucherCode: '',
    });
  }, [isEditing, ticket, form]);

  // Load received images separately
  React.useEffect(() => {
    if (!isEditing || !ticket) return;
    
    const receivedPermanent: StagingFile[] = (ticket.receivedImages || [])
      .filter((url): url is string => !!url && typeof url === 'string')
      .map((url, idx) => urlToStagingFile(url, idx, 'existing-received'));
    
    setReceivedPermanentFiles(receivedPermanent);
    setReceivedStagingFiles([]);
    setReceivedSessionId(null);
  }, [isEditing, ticket, urlToStagingFile]);

  // Load processed images separately
  React.useEffect(() => {
    if (!isEditing || !ticket) return;
    
    const processedPermanent: StagingFile[] = (ticket.processedImages || [])
      .filter((url): url is string => !!url && typeof url === 'string')
      .map((url, idx) => urlToStagingFile(url, idx, 'existing-processed'));
    
    setProcessedPermanentFiles(processedPermanent);
    setProcessedStagingFiles([]);
    setProcessedSessionId(null);
  }, [isEditing, ticket, urlToStagingFile]);

  // Helper: Validate form data
  const validateFormData = React.useCallback((data: WarrantyFormValues) => {
    // Check customer
    if (!data.customer) {
      toast.error('Thiếu thông tin khách hàng', { 
        description: 'Vui lòng chọn khách hàng từ danh sách',
        duration: 4000
      });
      return false;
    }
    if (!data.customer.name || data.customer.name.trim() === '') {
      toast.error('Thiếu tên khách hàng', { 
        description: 'Tên khách hàng không được để trống',
        duration: 4000
      });
      return false;
    }
    if (!data.customer.phone || data.customer.phone.trim() === '') {
      toast.error('Thiếu số điện thoại', { 
        description: 'Số điện thoại khách hàng không được để trống',
        duration: 4000
      });
      return false;
    }
    
    // Check branch
    if (!data.branchSystemId) {
      toast.error('Thiếu chi nhánh', { 
        description: 'Vui lòng chọn chi nhánh xử lý',
        duration: 4000
      });
      return false;
    }
    
    // Check employee
    if (!data.employeeSystemId) {
      toast.error('Thiếu nhân viên', { 
        description: 'Vui lòng chọn nhân viên xử lý',
        duration: 4000
      });
      return false;
    }
    
    // Check warranty ID duplicate (only if provided)
    if (!isEditing && data.id && data.id.trim() !== '') {
      const idToCheck = data.id.trim();
      const existingTicket = allTickets.find(t => t.id === idToCheck);
      if (existingTicket) {
        toast.error('Mã phiếu đã tồn tại', { 
          description: `Mã "${data.id}" đã được sử dụng. Vui lòng nhập mã khác hoặc để trống để tự động tạo.`,
          duration: 5000
        });
        return false;
      }
    }
    
    // Check tracking code
    if (!data.trackingCode || data.trackingCode.trim() === '') {
      toast.error('Thiếu mã vận đơn', { 
        description: 'Vui lòng nhập mã vận đơn',
        duration: 4000
      });
      return false;
    }
    
    // Check images
    if (!data.receivedImages || data.receivedImages.length === 0) {
      toast.error('Thiếu hình ảnh', { 
        description: 'Vui lòng chụp hình đơn hàng lúc nhận (tối thiểu 1 ảnh)',
        duration: 4000
      });
      return false;
    }
    
    // Check notes for "return" resolution products
    const returnProducts = data.products.filter(p => p.resolution === 'return');
    const returnProductsWithoutNotes = returnProducts.filter(p => !p.issueDescription || p.issueDescription.trim() === '');
    if (returnProductsWithoutNotes.length > 0) {
      toast.error('Thiếu ghi chú cho sản phẩm trả lại', { 
        description: `Có ${returnProductsWithoutNotes.length} sản phẩm có kết quả "Trả lại" nhưng chưa ghi rõ lý do. Vui lòng bổ sung ghi chú.`,
        duration: 5000
      });
      return false;
    }
    
    return true;
  }, [isEditing, allTickets]);

  // Helper: Calculate summary
  const calculateSummary = React.useCallback((products: WarrantyProduct[]) => {
    // Gộp "out_of_stock" và "deduct" thành "Hết hàng (Khấu trừ)"
    const outOfStockProducts = products.filter(p => p.resolution === 'out_of_stock' || p.resolution === 'deduct');
    
    const totalSettlement = outOfStockProducts.reduce((sum, p) => {
      if (p.resolution === 'deduct') return sum + (p.deductionAmount || 0);
      if (p.resolution === 'out_of_stock') return sum + ((p.quantity || 1) * (p.unitPrice || 0));
      return sum;
    }, 0);
    
    return {
      totalProducts: products.length,
      totalReplaced: products.filter(p => p.resolution === 'replace').reduce((sum, p) => sum + (p.quantity || 1), 0),
      totalReturned: products.filter(p => p.resolution === 'return').reduce((sum, p) => sum + (p.quantity || 1), 0),
      totalDeduction: totalSettlement, // Tổng tiền khấu trừ (gộp cả deduct + out_of_stock)
      totalOutOfStock: outOfStockProducts.reduce((sum, p) => sum + (p.quantity || 1), 0), // Số lượng SP hết hàng
      totalSettlement: totalSettlement,
    };
  }, []);

  // Submit handler
  const onSubmit = async (data: WarrantyFormValues) => {
    setIsSubmitting(true);
    
    try {
      // ===== VALIDATION =====
      if (!validateFormData(data)) {
        setIsSubmitting(false);
        return;
      }

    // ===== LOOKUP DATA =====
    const branch = branches.find(b => b.systemId === data.branchSystemId);
    const employee = employees.find(e => e.systemId === data.employeeSystemId);

    if (!branch) {
      toast.error('Lỗi dữ liệu', { 
        description: `Không tìm thấy chi nhánh với ID: ${data.branchSystemId}`,
        duration: 5000
      });
      setIsSubmitting(false);
      return;
    }
    if (!employee) {
      toast.error('Lỗi dữ liệu', { 
        description: `Không tìm thấy nhân viên với ID: ${data.employeeSystemId}`,
        duration: 5000
      });
      setIsSubmitting(false);
      return;
    }

    // ===== EXTRACT CUSTOMER DATA (SAFE) =====
    const selectedAddress = data.customer?.addresses?.[0];
    const customerAddress = selectedAddress 
      ? `${selectedAddress.street}, ${selectedAddress.ward}, ${selectedAddress.province}`
      : '';

    // ===== CALCULATE SUMMARY =====
    const summary = calculateSummary(data.products);
    const _totalSettlement = summary.totalSettlement;

    // ===== CONFIRM STAGING FILES → PERMANENT =====
    // Note: For CREATE mode, pre-generate systemId for image confirmation
    let finalReceivedImageUrls: string[] = [];
    let finalProcessedImageUrls: string[] = [];
    let productsWithConfirmedImages: WarrantyProduct[] = data.products || []; // Initialize with original products
    let targetWarrantyId: string | null = isEditing && ticket ? ticket.systemId : null;

    // Pre-generate systemId for new ticket (used for image confirmation)
    let preGeneratedSystemId: string | null = null;
    if (!isEditing) {
      preGeneratedSystemId = generateNextSystemId ? generateNextSystemId() : `WARRANTY${Date.now()}`; // Generate ID without creating ticket
      targetWarrantyId = preGeneratedSystemId;
    }

    try {
      // ===== FILTER OUT DELETED FILES (warranty files don't have database IDs like Employee) =====
      // Warranty chỉ lưu URL, không có file database ID như Employee
      // Nên chỉ filter ra khỏi list thôi, không gọi deleteFile API
      const cleanedReceivedFiles = receivedPermanentFiles.filter(file => !receivedFilesToDelete.includes(file.id));
      const cleanedProcessedFiles = processedPermanentFiles.filter(file => !processedFilesToDelete.includes(file.id));
      
      // Clear deletion marks
      if (receivedFilesToDelete.length > 0 || processedFilesToDelete.length > 0) {
        toast.success('✓ Đã đánh dấu xóa files', {
          description: `${receivedFilesToDelete.length + processedFilesToDelete.length} file sẽ bị xóa khỏi phiếu`,
        });
        setReceivedFilesToDelete([]);
        setProcessedFilesToDelete([]);
      }

      // Prepare warranty info for smart filename (like Employee's employeeInfo)
      const warrantyInfo = {
        name: data.customer?.name || '',
        phone: data.customer?.phone || '',
        trackingCode: data.trackingCode || '',
        warrantyId: targetWarrantyId || ''
      };

      // Confirm received images if there are NEW staging files - EXACTLY like Employee
      if (receivedSessionId && receivedStagingFiles.length > 0 && receivedStagingFiles.some(img => img.sessionId)) {
        const confirmToast = toast.loading('Đang lưu hình ảnh lúc nhận...');
        try {
          const confirmedFiles = await FileUploadAPI.confirmStagingFiles(
            receivedSessionId,
            targetWarrantyId!,
            'warranty',
            'received',
            warrantyInfo
          );
          // Combine confirmed new files + existing permanent files (AFTER filtering deleted ones)
          finalReceivedImageUrls = [
            ...cleanedReceivedFiles.map(f => f.url),
            ...confirmedFiles.map(f => f.url)
          ];
          toast.success('✓ Đã lưu hình ảnh lúc nhận', { id: confirmToast });
          
          // Cleanup staging files after successful confirmation
          try {
            await FileUploadAPI.deleteStagingFiles(receivedSessionId);
          } catch (cleanupError) {
            console.warn('Failed to cleanup received staging files (non-critical):', cleanupError);
          }
        } catch (error) {
          toast.error('Lỗi lưu hình ảnh lúc nhận', { id: confirmToast });
          throw error;
        }
      } else {
        // Use existing permanent URLs (for edit mode with no new uploads) - AFTER filtering deleted ones
        finalReceivedImageUrls = cleanedReceivedFiles.map(img => img.url);
      }

      // Confirm processed images if there are NEW staging files - EXACTLY like Employee
      if (processedSessionId && processedStagingFiles.length > 0 && processedStagingFiles.some(img => img.sessionId)) {
        const confirmToast = toast.loading('Đang lưu hình ảnh đã xử lý...');
        try {
          const confirmedFiles = await FileUploadAPI.confirmStagingFiles(
            processedSessionId,
            targetWarrantyId!,
            'warranty',
            'processed',
            warrantyInfo
          );
          // Combine confirmed new files + existing permanent files (AFTER filtering deleted ones)
          finalProcessedImageUrls = [
            ...cleanedProcessedFiles.map(f => f.url),
            ...confirmedFiles.map(f => f.url)
          ];
          toast.success('✓ Đã lưu hình ảnh đã xử lý', { id: confirmToast });
          
          // Cleanup staging files after successful confirmation
          try {
            await FileUploadAPI.deleteStagingFiles(processedSessionId);
          } catch (cleanupError) {
            console.warn('Failed to cleanup processed staging files (non-critical):', cleanupError);
          }
        } catch (error) {
          toast.error('Lỗi lưu hình ảnh đã xử lý', { id: confirmToast });
          throw error;
        }
      } else {
        // Use existing permanent URLs (for edit mode with no new uploads) - AFTER filtering deleted ones
        finalProcessedImageUrls = cleanedProcessedFiles.map(img => img.url);
      }

      // ===== CONFIRM PRODUCT IMAGES =====
      // Use state from WarrantyProductsSection (like receivedImages pattern)
      productsWithConfirmedImages = await Promise.all(
        (data.products || []).map(async (product, index) => {
          const productSystemId = product.systemId;
          if (!productSystemId) return product;
          
          // Get state for this product
          const sessionId = productImagesState.productSessionIds[productSystemId];
          const stagingFiles = productImagesState.productStagingFiles[productSystemId] || [];
          const permanentFiles = productImagesState.productPermanentFiles[productSystemId] || [];
          const filesToDelete = productImagesState.productFilesToDelete[productSystemId] || [];
          
          // Filter out marked-for-deletion permanent files
          const cleanedPermanentFiles = permanentFiles.filter(f => !filesToDelete.includes(f.id));
          
          // Check if has staging files to confirm
          if (!sessionId || stagingFiles.length === 0 || !stagingFiles.some(f => f.sessionId)) {
            // No staging files - use cleaned permanent URLs only
            return {
              ...product,
              productImages: cleanedPermanentFiles.map(f => f.url),
            };
          }
          
          // Confirm staging files
          const confirmToast = toast.loading(`Đang lưu hình ảnh sản phẩm ${index + 1}/${data.products.length}...`);
          
          try {
            const confirmedFiles = await FileUploadAPI.confirmStagingFiles(
              sessionId,
              targetWarrantyId!,
              'warranty',
              `product-${index}`,
              {
                ...warrantyInfo,
                productName: product.productName,
                productIndex: index
              }
            );
            
            // Combine cleaned permanent + confirmed staging
            const finalProductImageUrls = [
              ...cleanedPermanentFiles.map(f => f.url),
              ...confirmedFiles.map(f => f.url)
            ];
            
            toast.success(`✓ Đã lưu hình ảnh SP ${index + 1}`, { id: confirmToast });
            
            // Cleanup staging files
            try {
              await FileUploadAPI.deleteStagingFiles(sessionId);
            } catch (cleanupError) {
              console.warn(`Failed to cleanup product ${index} staging files (non-critical):`, cleanupError);
            }
            
            // Return product with confirmed image URLs
            return {
              ...product,
              productImages: finalProductImageUrls
            };
          } catch (error) {
            console.error(`Failed to confirm product ${index} images:`, error);
            toast.error(`Lỗi lưu hình ảnh SP ${index + 1}`, { id: confirmToast });
            // Fallback: keep staging URLs
            return product;
          }
        })
      );
      
    } catch (confirmError) {
      console.error('Failed to confirm staging files:', confirmError);
      setIsSubmitting(false);
      return;
    }

    // ===== PREPARE DATA =====
    const ticketData = {
      id: isEditing && ticket ? ticket.id : (data.id?.trim() || ''), // Empty string triggers auto-generation
      branchSystemId: data.branchSystemId,
      branchName: branch.name,
      employeeSystemId: data.employeeSystemId,
      employeeName: employee.fullName,
      customerName: data.customer?.name || '', // Safe access
      customerPhone: data.customer?.phone || '', // Safe access
      customerAddress: customerAddress,
      trackingCode: data.trackingCode.trim(),
      shippingFee: data.shippingFee || 0,
      referenceUrl: data.referenceUrl?.trim() || undefined,
      externalReference: data.externalReference?.trim() || undefined,
      receivedImages: finalReceivedImageUrls,
      products: productsWithConfirmedImages || [], // ← Use confirmed product images
      processedImages: finalProcessedImageUrls,
      // Auto determine status based on products
      status: (productsWithConfirmedImages && productsWithConfirmedImages.length > 0) 
        ? 'pending' as const   // Có sản phẩm → Chưa xử lý
        : 'incomplete' as const, // Chưa có sản phẩm → Chưa đầy đủ
      summary,
      settlement: data.settlementMethod ? {
        systemId: `SET_${Date.now()}`,
        warrantyId: '', // Will be set after ticket created
        settlementType: data.settlementMethod as SettlementType,
        totalAmount: 0,
        settledAmount: 0,
        remainingAmount: 0,
        unsettledProducts: [],
        linkedOrderId: undefined,
        voucherCode: data.settlementVoucherCode,
        status: 'pending' as const,
        notes: data.notes || '',
        createdAt: toISODateTime(getCurrentDate()),
      } : undefined,
      history: [],
      comments: [], // ===== COMMENT SYSTEM: Khởi tạo rỗng =====
      notes: data.notes || '',
      createdBy: user?.name || 'Admin',
      createdAt: toISODateTime(getCurrentDate()),
      updatedAt: toISODateTime(getCurrentDate()),
    };

      if (isEditing && ticket) {
        // ===== UPDATE EXISTING TICKET =====
        
        // REMOVED: generateChangeLog - let store auto-history handle it with proper Vietnamese labels
        // The store.update() method already tracks all field changes with proper names lookup
        
        // CRITICAL: Remove history/comments from updates to preserve existing data
        const { history: _history, comments: _comments, createdAt: _createdAt, createdBy: _createdBy, ...updateData } = ticketData;
        
        // Auto transition status if products added
        const _hadProducts = ticket.products && ticket.products.length > 0;
        const hasProducts = productsWithConfirmedImages && productsWithConfirmedImages.length > 0;
        const shouldTransitionToComplete = ticket.status === 'incomplete' && hasProducts;
        
        if (shouldTransitionToComplete) {
          updateData.status = 'pending';
        }
        
        // Update ticket (history will be auto-generated by store)
        update(ticket.systemId, updateData as unknown as Parameters<typeof update>[1]);
        
        if (shouldTransitionToComplete) {
          toast.success('Đã cập nhật phiếu và chuyển sang "Chưa xử lý"', {
            description: `Mã: ${ticket.id}`,
            duration: 3000
          });
        } else {
          toast.success('Đã cập nhật phiếu', {
            description: `Mã: ${ticket.id}`,
            duration: 3000
          });
        }
        
        // Navigate back to detail page
        router.push(`/warranty/${ticket.systemId}`);
      } else {
        // ===== CREATE NEW TICKET =====
        // Now create ticket with all confirmed images in one go
        const finalTicket = add({
          id: asBusinessId(''),
          systemId: preGeneratedSystemId!, // Use pre-generated ID
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
          receivedImages: finalReceivedImageUrls, // Already confirmed
          products: productsWithConfirmedImages, // Already confirmed
          processedImages: finalProcessedImageUrls, // Already confirmed
          // Auto determine status based on products
          status: (productsWithConfirmedImages && productsWithConfirmedImages.length > 0) 
            ? 'pending' as const   // Có sản phẩm → Chưa xử lý
            : 'incomplete' as const, // Chưa có sản phẩm → Chưa đầy đủ
          summary,
          settlement: data.settlementMethod ? {
            systemId: `SET_${Date.now()}`,
            warrantyId: preGeneratedSystemId!, // Use pre-generated ID
            settlementType: data.settlementMethod as SettlementType,
            totalAmount: 0,
            settledAmount: 0,
            remainingAmount: 0,
            unsettledProducts: [],
            linkedOrderSystemId: data.linkedOrderSystemId, // CHỈ systemId
            voucherCode: data.settlementVoucherCode,
            status: 'pending' as const,
            notes: data.notes || '',
            createdAt: toISODateTime(getCurrentDate()),
          } : undefined,
          history: [],
          comments: [],
          notes: data.notes || '',
          createdBy: user?.name || 'Admin',
          createdAt: toISODateTime(getCurrentDate()),
          updatedAt: toISODateTime(getCurrentDate()),
        } as unknown as Parameters<typeof add>[0]);
        
        toast.success('Đã tạo phiếu bảo hành', { 
          description: `Mã: ${finalTicket?.id || finalTicket?.systemId} - Khách: ${data.customer?.name}`,
          duration: 3000
        });
        
        // Navigate immediately - no race condition since we only create once
        router.push(`/warranty/${preGeneratedSystemId}`);
      }
    } catch (error) {
      console.error('Error saving warranty ticket:', error);
      
      // Detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
      
      toast.error('Lỗi lưu phiếu bảo hành', { 
        description: `Chi tiết: ${errorMessage}. Vui lòng kiểm tra lại thông tin.`,
        duration: 6000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Page header - Memoize actions to prevent infinite loop
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
      disabled={isReadOnly || isSubmitting}
      size="sm"
      className="h-9"
    >
      {isSubmitting ? 'Đang lưu...' : (isEditing ? 'Lưu thay đổi' : 'Tạo phiếu')}
    </Button>,
  ], [router, isReadOnly, isSubmitting, isEditing]);

  // Set page header with title and breadcrumb
  React.useEffect(() => {
    const title = isUpdateMode
      ? `Cập nhật thông tin phiếu ${ticket?.id || ''}`
      : isEditing && ticket 
      ? `Chỉnh sửa phiếu ${ticket.id}` 
      : 'Thêm phiếu bảo hành mới';
    
    const breadcrumb = isUpdateMode && ticket
      ? [
          { label: 'Trang chủ', href: '/', isCurrent: false },
          { label: 'Bảo hành', href: '/warranty', isCurrent: false },
          { label: ticket.id, href: `/warranty/${ticket.systemId}`, isCurrent: false },
          { label: 'Cập nhật thông tin', href: '', isCurrent: true },
        ]
      : isEditing && ticket
      ? [
          { label: 'Trang chủ', href: '/', isCurrent: false },
          { label: 'Bảo hành', href: '/warranty', isCurrent: false },
          { label: ticket.id, href: `/warranty/${ticket.systemId}`, isCurrent: false },
          { label: 'Chỉnh sửa', href: '', isCurrent: true },
        ]
      : [
          { label: 'Trang chủ', href: '/', isCurrent: false },
          { label: 'Bảo hành', href: '/warranty', isCurrent: false },
          { label: 'Thêm mới', href: '', isCurrent: true },
        ];
    
    setPageHeader({
      title,
      breadcrumb,
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

            {/* ===== NEW LAYOUT: 4 ROWS ===== */}
            
            {/* Hàng 1: Thông tin khách hàng (70%) + Thông tin bổ sung (30%) */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-[70%]">
                <CustomerSelector disabled={isReadOnly || isUpdateMode} />
              </div>
              <div className="w-full md:w-[30%]">
                <WarrantyFormInfoCard disabled={isReadOnly || isUpdateMode} />
              </div>
            </div>

            {/* Hàng 2: Hình ảnh đơn hàng - 2 cards riêng biệt 50-50 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Hình ảnh lúc nhận */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-h4">Hình ảnh lúc nhận</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {/* Existing permanent files */}
                  {isEditing && receivedPermanentFiles.length > 0 && (
                    <div className="space-y-2">
                      <ExistingDocumentsViewer
                        files={receivedPermanentFiles}
                        onChange={setReceivedPermanentFiles}
                        disabled={isReadOnly || isUpdateMode}
                        onMarkForDeletion={handleMarkReceivedForDeletion}
                        markedForDeletion={receivedFilesToDelete}
                        hideFileInfo={true}
                      />
                    </div>
                  )}
                  
                  {/* New staging files upload section */}
                  <div className="space-y-2">
                    {isEditing && receivedPermanentFiles.length > 0 && (
                      <div className="flex items-center gap-2 text-body-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded">
                        <span>📤</span>
                        <span>Thêm file mới (tạm thời)</span>
                      </div>
                    )}
                    <NewDocumentsUpload
                      maxFiles={50}
                      maxTotalSize={50 * 1024 * 1024} // 50MB
                      existingFileCount={receivedPermanentFiles.length}
                      value={receivedStagingFiles}
                      onChange={setReceivedStagingFiles}
                      sessionId={receivedSessionId || undefined}
                      onSessionChange={setReceivedSessionId}
                      disabled={isReadOnly || isUpdateMode}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Hình ảnh đã xử lý */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-h4">Hình ảnh đã xử lý</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {/* Existing permanent files */}
                  {isEditing && processedPermanentFiles.length > 0 && (
                    <div className="space-y-2">
                      <ExistingDocumentsViewer
                        files={processedPermanentFiles}
                        onChange={setProcessedPermanentFiles}
                        disabled={isReadOnly}
                        onMarkForDeletion={handleMarkProcessedForDeletion}
                        markedForDeletion={processedFilesToDelete}
                        hideFileInfo={true}
                      />
                    </div>
                  )}
                  
                  {/* New staging files upload section */}
                  <div className="space-y-2">
                    {isEditing && processedPermanentFiles.length > 0 && (
                      <div className="flex items-center gap-2 text-body-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded">
                        <span>📤</span>
                        <span>Thêm file mới (tạm thời)</span>
                      </div>
                    )}
                    <NewDocumentsUpload
                      maxFiles={50}
                      maxTotalSize={50 * 1024 * 1024} // 50MB
                      existingFileCount={processedPermanentFiles.length}
                      value={processedStagingFiles}
                      onChange={setProcessedStagingFiles}
                      sessionId={processedSessionId || undefined}
                      onSessionChange={setProcessedSessionId}
                      disabled={isReadOnly}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hàng 3: Danh sách sản phẩm bảo hành */}
            <WarrantyProductsSection 
              disabled={isReadOnly} 
              onProductImagesStateChange={setProductImagesState}
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

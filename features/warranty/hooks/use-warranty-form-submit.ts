'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

import { useAuth } from '../../../contexts/auth-context';
import { getCurrentDate, toISODateTime } from '../../../lib/date-utils';
import { FileUploadAPI, type StagingFile } from '../../../lib/file-upload-api';
import { generateSubEntityId } from '../../../lib/id-utils';

import type { WarrantyFormValues, WarrantyProduct, SettlementType, WarrantyTicket } from '../types';
import type { ProductImagesState } from './use-warranty-form-state';
import type { SimpleImageFile } from './use-product-images-state';
import { validateWarrantyFormData, validateBranchAndEmployee } from '../utils/warranty-form-validation';
import { calculateWarrantySummary, extractCustomerAddress } from '../utils/warranty-form-helpers';
import { createWarranty, updateWarranty, fetchWarranties } from '../api/warranties-api';
import { warrantyKeys } from './use-warranties';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { logError } from '@/lib/logger'

// Type for the ref-based getter function
type GetProductImagesStateFn = () => {
  productPermanentFiles: Record<string, SimpleImageFile[]>;
  productStagingFiles: Record<string, StagingFile[]>;
  productSessionIds: Record<string, string>;
  productFilesToDelete: Record<string, string[]>;
};

// Type for received/processed images ref-based getter
type GetImagesStateFn = () => {
  stagingFiles: StagingFile[];
  sessionId: string | null;
  permanentFiles: StagingFile[];
  filesToDelete: string[];
};

export interface UseWarrantyFormSubmitOptions {
  isEditing: boolean;
  ticket: WarrantyTicket | null;
  branches: Array<{ systemId: string; name: string }>;
  employees: Array<{ systemId: string; fullName: string }>;
  selectedEmployeeRef?: React.RefObject<{ systemId: string; fullName: string } | null>;
  // Legacy callbacks - no longer used but kept for backward compatibility
  add?: (data: unknown) => WarrantyTicket | undefined;
  update?: (systemId: string, data: unknown) => void;
  // Legacy props - kept for backward compatibility but prefer using refs
  receivedPermanentFiles: StagingFile[];
  receivedStagingFiles: StagingFile[];
  receivedSessionId: string | null;
  receivedFilesToDelete: string[];
  setReceivedFilesToDelete: React.Dispatch<React.SetStateAction<string[]>>;
  processedPermanentFiles: StagingFile[];
  processedStagingFiles: StagingFile[];
  processedSessionId: string | null;
  processedFilesToDelete: string[];
  setProcessedFilesToDelete: React.Dispatch<React.SetStateAction<string[]>>;
  // ✅ Use ref-based getter instead of state prop (avoids stale closure issues)
  getProductImagesStateRef?: React.MutableRefObject<GetProductImagesStateFn | null>;
  // ✅ Ref-based getter for received/processed images
  getReceivedImagesStateRef?: React.MutableRefObject<GetImagesStateFn | null>;
  getProcessedImagesStateRef?: React.MutableRefObject<GetImagesStateFn | null>;
  // Legacy prop - kept for backward compatibility but not used
  productImagesState?: ProductImagesState;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  // ✅ Ref để lấy warranty check results (luôn lấy giá trị mới nhất khi submit)
  warrantyCheckResultsRef?: React.MutableRefObject<Record<string, {
    warnings: string[];
    isValid: boolean;
    totalClaimed: number;
    availableQuantity: number;
  }> | null>;
}

/**
 * Hook xử lý submit cho warranty form
 * Sử dụng React Query mutations để gọi API
 */
export function useWarrantyFormSubmit(options: UseWarrantyFormSubmitOptions) {
  const {
    isEditing,
    ticket,
    branches,
    employees,
    receivedPermanentFiles: receivedPermanentFilesFallback,
    receivedStagingFiles: receivedStagingFilesFallback,
    receivedSessionId: receivedSessionIdFallback,
    receivedFilesToDelete: receivedFilesToDeleteFallback,
    setReceivedFilesToDelete,
    processedPermanentFiles: processedPermanentFilesFallback,
    processedStagingFiles: processedStagingFilesFallback,
    processedSessionId: processedSessionIdFallback,
    processedFilesToDelete: processedFilesToDeleteFallback,
    setProcessedFilesToDelete,
    getProductImagesStateRef,
    getReceivedImagesStateRef,
    getProcessedImagesStateRef,
    setIsSubmitting,
    selectedEmployeeRef,
    warrantyCheckResultsRef,
  } = options;
  
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const onSubmit = React.useCallback(async (data: WarrantyFormValues) => {
    // ✅ Get received/processed images state from refs at submit time (avoids stale closure)
    const receivedImagesState = getReceivedImagesStateRef?.current?.() ?? {
      stagingFiles: receivedStagingFilesFallback,
      sessionId: receivedSessionIdFallback,
      permanentFiles: receivedPermanentFilesFallback,
      filesToDelete: receivedFilesToDeleteFallback,
    };
    
    const processedImagesState = getProcessedImagesStateRef?.current?.() ?? {
      stagingFiles: processedStagingFilesFallback,
      sessionId: processedSessionIdFallback,
      permanentFiles: processedPermanentFilesFallback,
      filesToDelete: processedFilesToDeleteFallback,
    };
    
    // Use values from refs
    const receivedStagingFiles = receivedImagesState.stagingFiles;
    const _receivedSessionId = receivedImagesState.sessionId;
    const receivedPermanentFiles = receivedImagesState.permanentFiles;
    const receivedFilesToDelete = receivedImagesState.filesToDelete;
    
    const processedStagingFiles = processedImagesState.stagingFiles;
    const _processedSessionId = processedImagesState.sessionId;
    const processedPermanentFiles = processedImagesState.permanentFiles;
    const processedFilesToDelete = processedImagesState.filesToDelete;
    
    // DEBUG: Log images state at submit time
    
    setIsSubmitting(true);
    
    // ✅ Get product images state from ref at submit time (avoids stale closure)
    const currentProductImagesState = getProductImagesStateRef?.current?.() ?? {
      productPermanentFiles: {},
      productStagingFiles: {},
      productSessionIds: {},
      productFilesToDelete: {},
    };
    
    // DEBUG: Log product images state
    
    try {
      // ===== VALIDATION =====
      // ✅ OPTIMIZED: Fetch allTickets on-demand at submit time instead of eagerly on mount
      const allTickets = await queryClient.ensureQueryData({
        queryKey: [...warrantyKeys.all, 'all'],
        queryFn: () => fetchAllPages((p) => fetchWarranties(p)),
        staleTime: 2 * 60 * 1000,
      });
      if (!validateWarrantyFormData(data, isEditing, allTickets)) {
        setIsSubmitting(false);
        return;
      }

      // ✅ Validate warranty check results
      // Luôn lấy giá trị mới nhất từ ref khi submit (tránh stale closure)
      const currentWarrantyCheckResults = warrantyCheckResultsRef?.current;
      const products = data.products || [];
      
      // Check 1: Nếu có sản phẩm nhưng chưa bấm kiểm tra BH (results empty)
      if (products.length > 0 && (!currentWarrantyCheckResults || Object.keys(currentWarrantyCheckResults).length === 0)) {
        toast.error('Chưa kiểm tra bảo hành', {
          description: 'Vui lòng bấm "Kiểm tra BH" trước khi tạo phiếu.',
          duration: 5000
        });
        setIsSubmitting(false);
        return;
      }
      
      // Check 2: Block nếu có sản phẩm chưa được check (không có trong results)
      for (const product of products) {
        if (!currentWarrantyCheckResults![product.productName]) {
          toast.error('Chưa kiểm tra bảo hành', {
            description: `Sản phẩm "${product.productName}" chưa được kiểm tra. Vui lòng bấm "Kiểm tra BH" trước.`,
            duration: 5000
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      // Check 3: Block nếu có cảnh báo nghiêm trọng (❌)
      for (const product of products) {
        const result = currentWarrantyCheckResults![product.productName];
        if (result) {
          const hasCriticalWarning = result.warnings.some((w: string) => w.includes('❌'));
          
          if (hasCriticalWarning) {
            toast.error('Không thể tạo phiếu', {
              description: `Sản phẩm "${product.productName}" có cảnh báo nghiêm trọng. Vui lòng kiểm tra lại.`,
              duration: 6000
            });
            setIsSubmitting(false);
            return;
          }
        }
      }

      // ===== LOOKUP DATA =====
      // ✅ Read employee ref at submit time to avoid stale closure
      const currentEmployees = selectedEmployeeRef?.current
        ? [selectedEmployeeRef.current]
        : employees;
      const { branch, employee } = validateBranchAndEmployee(
        data.branchSystemId,
        data.employeeSystemId,
        branches,
        currentEmployees
      );
      
      if (!branch || !employee) {
        setIsSubmitting(false);
        return;
      }

      // ===== EXTRACT CUSTOMER DATA =====
      const customerAddress = extractCustomerAddress(data.customer);

      // ===== CALCULATE SUMMARY =====
      const summary = calculateWarrantySummary(data.products);

      // ===== CONFIRM STAGING FILES → PERMANENT =====
      let finalReceivedImageUrls: string[] = [];
      let finalProcessedImageUrls: string[] = [];
      let productsWithConfirmedImages: WarrantyProduct[] = data.products || [];
      let targetWarrantyId: string | null = isEditing && ticket ? ticket.systemId : null;

      // Pre-generate systemId for new ticket (for file uploads)
      // Note: Actual systemId will be generated by API, this is just for file path
      let preGeneratedSystemId: string | null = null;
      if (!isEditing) {
        // Generate a temporary ID for file uploads - will be replaced by API-generated ID
        preGeneratedSystemId = generateSubEntityId('WARRANTY');
        targetWarrantyId = preGeneratedSystemId;
      }

      try {
        // ===== FILTER OUT DELETED FILES =====
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

        // Warranty info for smart filename
        const warrantyInfo = {
          name: data.customer?.name || '',
          phone: data.customer?.phone || '',
          trackingCode: data.trackingCode || '',
          warrantyId: targetWarrantyId || ''
        };

        // Confirm received images - get sessionId directly from files (like employees)
        const receivedFilesWithSession = receivedStagingFiles.filter(f => f.sessionId);
        const actualReceivedSessionId = receivedFilesWithSession[0]?.sessionId;
        
        
        if (actualReceivedSessionId && receivedFilesWithSession.length > 0) {
          const confirmToast = toast.loading('Đang lưu hình ảnh lúc nhận...');
          try {
            const confirmedFiles = await FileUploadAPI.confirmStagingFiles(
              actualReceivedSessionId,
              targetWarrantyId!,
              'warranty',
              'received',
              warrantyInfo
            );
            
            
            finalReceivedImageUrls = [
              ...cleanedReceivedFiles.map(f => f.url),
              ...confirmedFiles.map(f => f.url)
            ];
            
            
            toast.success('✓ Đã lưu hình ảnh lúc nhận', { id: confirmToast });
            
            try {
              await FileUploadAPI.deleteStagingFiles(actualReceivedSessionId);
            } catch (_cleanupError) {
              // Ignore cleanup errors
            }
          } catch (error) {
            toast.error('Lỗi lưu hình ảnh lúc nhận', { id: confirmToast });
            throw error;
          }
        } else {
          finalReceivedImageUrls = cleanedReceivedFiles.map(img => img.url);
        }

        // Confirm processed images - get sessionId directly from files (like employees)
        const processedFilesWithSession = processedStagingFiles.filter(f => f.sessionId);
        const actualProcessedSessionId = processedFilesWithSession[0]?.sessionId;
        
        if (actualProcessedSessionId && processedFilesWithSession.length > 0) {
          const confirmToast = toast.loading('Đang lưu hình ảnh đã xử lý...');
          try {
            const confirmedFiles = await FileUploadAPI.confirmStagingFiles(
              actualProcessedSessionId,
              targetWarrantyId!,
              'warranty',
              'processed',
              warrantyInfo
            );
            finalProcessedImageUrls = [
              ...cleanedProcessedFiles.map(f => f.url),
              ...confirmedFiles.map(f => f.url)
            ];
            toast.success('✓ Đã lưu hình ảnh đã xử lý', { id: confirmToast });
            
            try {
              await FileUploadAPI.deleteStagingFiles(actualProcessedSessionId);
            } catch (_cleanupError) {
              // Ignore cleanup errors
            }
          } catch (error) {
            toast.error('Lỗi lưu hình ảnh đã xử lý', { id: confirmToast });
            throw error;
          }
        } else {
          finalProcessedImageUrls = cleanedProcessedFiles.map(img => img.url);
        }

        // ===== CONFIRM PRODUCT IMAGES =====
        productsWithConfirmedImages = await Promise.all(
          (data.products || []).map(async (product, index) => {
            const productSystemId = product.systemId;
            if (!productSystemId) return product;
            
            const stagingFiles = currentProductImagesState.productStagingFiles[productSystemId] || [];
            const permanentFiles = currentProductImagesState.productPermanentFiles[productSystemId] || [];
            const filesToDelete = currentProductImagesState.productFilesToDelete[productSystemId] || [];
            
            const cleanedPermanentFiles = permanentFiles.filter(f => !filesToDelete.includes(f.id));
            
            // Get sessionId directly from staging files (like employees)
            const filesWithSession = stagingFiles.filter(f => f.sessionId);
            const actualSessionId = filesWithSession[0]?.sessionId;
            
            
            if (!actualSessionId || filesWithSession.length === 0) {
              return {
                ...product,
                productImages: cleanedPermanentFiles.map(f => f.url),
              };
            }
            
            const confirmToast = toast.loading(`Đang lưu hình ảnh sản phẩm ${index + 1}/${data.products.length}...`);
            
            try {
              const confirmedFiles = await FileUploadAPI.confirmStagingFiles(
                actualSessionId,
                targetWarrantyId!,
                'warranty',
                `product-${index}`,
                {
                  ...warrantyInfo,
                  productName: product.productName,
                  productIndex: index
                }
              );
              
              const finalProductImageUrls = [
                ...cleanedPermanentFiles.map(f => f.url),
                ...confirmedFiles.map(f => f.url)
              ];
              
              toast.success(`✓ Đã lưu hình ảnh SP ${index + 1}`, { id: confirmToast });
              
              try {
                await FileUploadAPI.deleteStagingFiles(actualSessionId);
              } catch (_cleanupError) {
                // Ignore cleanup errors
              }
              
              return {
                ...product,
                productImages: finalProductImageUrls
              };
            } catch (error) {
              logError(`Failed to confirm product ${index} images`, error);
              toast.error(`Lỗi lưu hình ảnh SP ${index + 1}`, { id: confirmToast });
              return product;
            }
          })
        );
        
      } catch (confirmError) {
        logError('Failed to confirm staging files', confirmError);
        setIsSubmitting(false);
        return;
      }

      // ===== PREPARE DATA =====
      const ticketData = {
        id: isEditing && ticket ? ticket.id : (data.id?.trim() || ''),
        branchSystemId: data.branchSystemId,
        branchName: branch.name,
        employeeSystemId: data.employeeSystemId,
        employeeName: employee.fullName,
        customerId: data.customer?.systemId || undefined,
        customerName: data.customer?.name || '',
        customerPhone: data.customer?.phone || '',
        customerAddress: customerAddress,
        trackingCode: data.trackingCode.trim(),
        shippingFee: data.shippingFee || 0,
        referenceUrl: data.referenceUrl?.trim() || undefined,
        externalReference: data.externalReference?.trim() || undefined,
        receivedImages: finalReceivedImageUrls,
        products: productsWithConfirmedImages || [],
        processedImages: finalProcessedImageUrls,
        status: (productsWithConfirmedImages && productsWithConfirmedImages.length > 0) 
          ? 'PROCESSING' as const
          : 'RECEIVED' as const,
        summary,
        settlement: data.settlementMethod ? {
          systemId: generateSubEntityId('SET'),
          warrantyId: '',
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
        comments: [],
        notes: data.notes || '',
        createdBy: user?.name || 'Admin',
        createdAt: toISODateTime(getCurrentDate()),
        updatedAt: toISODateTime(getCurrentDate()),
      };

      if (isEditing && ticket) {
        // ===== UPDATE EXISTING TICKET (via API) =====
        const { history: _history, comments: _comments, createdAt: _createdAt, createdBy: _createdBy, ...updateData } = ticketData;
        
        const hasProducts = productsWithConfirmedImages && productsWithConfirmedImages.length > 0;
        const shouldTransitionToProcessing = ticket.status === 'RECEIVED' && hasProducts;
        
        if (shouldTransitionToProcessing) {
          (updateData as Record<string, unknown>).status = 'PROCESSING';
        } else {
          // ✅ Preserve existing status during edit — don't reset RETURNED/COMPLETED etc.
          (updateData as Record<string, unknown>).status = ticket.status;
        }
        
        // DEBUG: Log data before sending to API
        
        // Call API to update
        const updatedWarranty = await updateWarranty(ticket.systemId, updateData as unknown as Partial<WarrantyTicket>);
        
        // Invalidate queries to refetch
        invalidateRelated(queryClient, 'warranties');
        
        if (shouldTransitionToProcessing) {
          toast.success('Đã cập nhật phiếu và chuyển sang "Đang xử lý"', {
            description: `Mã: ${updatedWarranty.id}`,
            duration: 3000
          });
        } else {
          toast.success('Đã cập nhật phiếu', {
            description: `Mã: ${updatedWarranty.id}`,
            duration: 3000
          });
        }
        
        router.push(`/warranty/${ticket.systemId}`);
      } else {
        // ===== CREATE NEW TICKET (via API) =====
        const createPayload = {
          branchSystemId: data.branchSystemId,
          branchName: branch.name,
          employeeSystemId: data.employeeSystemId,
          employeeName: employee.fullName,
          customerId: data.customer?.systemId || undefined,
          customerName: data.customer?.name || '',
          customerPhone: data.customer?.phone || '',
          customerAddress: customerAddress,
          trackingCode: data.trackingCode.trim(),
          shippingFee: data.shippingFee || 0,
          referenceUrl: data.referenceUrl?.trim() || undefined,
          externalReference: data.externalReference?.trim() || undefined,
          receivedImages: finalReceivedImageUrls,
          products: productsWithConfirmedImages,
          processedImages: finalProcessedImageUrls,
          status: (productsWithConfirmedImages && productsWithConfirmedImages.length > 0) 
            ? 'PROCESSING' as const
            : 'RECEIVED' as const,
          summary,
          settlement: data.settlementMethod ? {
            systemId: generateSubEntityId('SET'),
            warrantyId: '',
            settlementType: data.settlementMethod as SettlementType,
            totalAmount: 0,
            settledAmount: 0,
            remainingAmount: 0,
            unsettledProducts: [],
            linkedOrderSystemId: data.linkedOrderSystemId,
            voucherCode: data.settlementVoucherCode,
            status: 'pending' as const,
            notes: data.notes || '',
            createdAt: toISODateTime(getCurrentDate()),
          } : undefined,
          history: [],
          comments: [],
          notes: data.notes || '',
          createdBy: user?.name || 'Admin',
        };
        
        // Call API to create
        const createdWarranty = await createWarranty(createPayload as Partial<WarrantyTicket>);
        
        // Invalidate queries to refetch
        invalidateRelated(queryClient, 'warranties');
        
        toast.success('Đã tạo phiếu bảo hành', { 
          description: `Mã: ${createdWarranty.id} - Khách: ${data.customer?.name}`,
          duration: 3000
        });
        
        router.push(`/warranty/${createdWarranty.systemId}`);
      }
    } catch (error) {
      logError('Error saving warranty ticket', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
      
      toast.error('Lỗi lưu phiếu bảo hành', { 
        description: `Chi tiết: ${errorMessage}. Vui lòng kiểm tra lại thông tin.`,
        duration: 6000
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isEditing,
    ticket,
    branches,
    employees,
    // ✅ Use refs instead of state values to avoid stale closures
    getReceivedImagesStateRef,
    getProcessedImagesStateRef,
    getProductImagesStateRef,
    // Fallback values (only used if refs not provided)
    receivedPermanentFilesFallback,
    receivedStagingFilesFallback,
    receivedSessionIdFallback,
    receivedFilesToDeleteFallback,
    processedPermanentFilesFallback,
    processedStagingFilesFallback,
    processedSessionIdFallback,
    processedFilesToDeleteFallback,
    setReceivedFilesToDelete,
    setProcessedFilesToDelete,
    setIsSubmitting,
    router,
    user,
    queryClient,
    warrantyCheckResultsRef,
    selectedEmployeeRef,
  ]);
  
  return { onSubmit };
}

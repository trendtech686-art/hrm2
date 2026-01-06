'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useAuth } from '../../../contexts/auth-context';
import { asBusinessId } from '../../../lib/id-types';
import { getCurrentDate, toISODateTime } from '../../../lib/date-utils';
import { FileUploadAPI, type StagingFile } from '../../../lib/file-upload-api';

import type { WarrantyFormValues, WarrantyProduct, SettlementType, WarrantyTicket } from '../types';
import type { ProductImagesState } from './use-warranty-form-state';
import { validateWarrantyFormData, validateBranchAndEmployee } from '../utils/warranty-form-validation';
import { calculateWarrantySummary, extractCustomerAddress } from '../utils/warranty-form-helpers';

export interface UseWarrantyFormSubmitOptions {
  isEditing: boolean;
  ticket: WarrantyTicket | null;
  allTickets: WarrantyTicket[];
  branches: Array<{ systemId: string; name: string }>;
  employees: Array<{ systemId: string; fullName: string }>;
  generateNextSystemId: () => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  add: (data: any) => WarrantyTicket | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: (systemId: string, data: any) => void;
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
  productImagesState: ProductImagesState;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Hook xử lý submit cho warranty form
 * Tách riêng logic submit để giảm kích thước file form page chính
 */
export function useWarrantyFormSubmit(options: UseWarrantyFormSubmitOptions) {
  const {
    isEditing,
    ticket,
    allTickets,
    branches,
    employees,
    generateNextSystemId,
    add,
    update,
    receivedPermanentFiles,
    receivedStagingFiles,
    receivedSessionId,
    receivedFilesToDelete,
    setReceivedFilesToDelete,
    processedPermanentFiles,
    processedStagingFiles,
    processedSessionId,
    processedFilesToDelete,
    setProcessedFilesToDelete,
    productImagesState,
    setIsSubmitting,
  } = options;
  
  const router = useRouter();
  const { user } = useAuth();
  
  const onSubmit = React.useCallback(async (data: WarrantyFormValues) => {
    setIsSubmitting(true);
    
    try {
      // ===== VALIDATION =====
      if (!validateWarrantyFormData(data, isEditing, allTickets)) {
        setIsSubmitting(false);
        return;
      }

      // ===== LOOKUP DATA =====
      const { branch, employee } = validateBranchAndEmployee(
        data.branchSystemId,
        data.employeeSystemId,
        branches,
        employees
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

      // Pre-generate systemId for new ticket
      let preGeneratedSystemId: string | null = null;
      if (!isEditing) {
        preGeneratedSystemId = generateNextSystemId ? generateNextSystemId() : `WARRANTY${Date.now()}`;
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

        // Confirm received images
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
            finalReceivedImageUrls = [
              ...cleanedReceivedFiles.map(f => f.url),
              ...confirmedFiles.map(f => f.url)
            ];
            toast.success('✓ Đã lưu hình ảnh lúc nhận', { id: confirmToast });
            
            try {
              await FileUploadAPI.deleteStagingFiles(receivedSessionId);
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

        // Confirm processed images
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
            finalProcessedImageUrls = [
              ...cleanedProcessedFiles.map(f => f.url),
              ...confirmedFiles.map(f => f.url)
            ];
            toast.success('✓ Đã lưu hình ảnh đã xử lý', { id: confirmToast });
            
            try {
              await FileUploadAPI.deleteStagingFiles(processedSessionId);
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
            
            const sessionId = productImagesState.productSessionIds[productSystemId];
            const stagingFiles = productImagesState.productStagingFiles[productSystemId] || [];
            const permanentFiles = productImagesState.productPermanentFiles[productSystemId] || [];
            const filesToDelete = productImagesState.productFilesToDelete[productSystemId] || [];
            
            const cleanedPermanentFiles = permanentFiles.filter(f => !filesToDelete.includes(f.id));
            
            if (!sessionId || stagingFiles.length === 0 || !stagingFiles.some(f => f.sessionId)) {
              return {
                ...product,
                productImages: cleanedPermanentFiles.map(f => f.url),
              };
            }
            
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
              
              const finalProductImageUrls = [
                ...cleanedPermanentFiles.map(f => f.url),
                ...confirmedFiles.map(f => f.url)
              ];
              
              toast.success(`✓ Đã lưu hình ảnh SP ${index + 1}`, { id: confirmToast });
              
              try {
                await FileUploadAPI.deleteStagingFiles(sessionId);
              } catch (_cleanupError) {
                // Ignore cleanup errors
              }
              
              return {
                ...product,
                productImages: finalProductImageUrls
              };
            } catch (error) {
              console.error(`Failed to confirm product ${index} images:`, error);
              toast.error(`Lỗi lưu hình ảnh SP ${index + 1}`, { id: confirmToast });
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
        products: productsWithConfirmedImages || [],
        processedImages: finalProcessedImageUrls,
        status: (productsWithConfirmedImages && productsWithConfirmedImages.length > 0) 
          ? 'pending' as const
          : 'incomplete' as const,
        summary,
        settlement: data.settlementMethod ? {
          systemId: `SET_${Date.now()}`,
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
        // ===== UPDATE EXISTING TICKET =====
        const { history: _history, comments: _comments, createdAt: _createdAt, createdBy: _createdBy, ...updateData } = ticketData;
        
        const hasProducts = productsWithConfirmedImages && productsWithConfirmedImages.length > 0;
        const shouldTransitionToComplete = ticket.status === 'incomplete' && hasProducts;
        
        if (shouldTransitionToComplete) {
          updateData.status = 'pending';
        }
        
        update(ticket.systemId, updateData);
        
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
        
        router.push(`/warranty/${ticket.systemId}`);
      } else {
        // ===== CREATE NEW TICKET =====
        const finalTicket = add({
          id: asBusinessId(''),
          systemId: preGeneratedSystemId!,
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
          products: productsWithConfirmedImages,
          processedImages: finalProcessedImageUrls,
          status: (productsWithConfirmedImages && productsWithConfirmedImages.length > 0) 
            ? 'pending' as const
            : 'incomplete' as const,
          summary,
          settlement: data.settlementMethod ? {
            systemId: `SET_${Date.now()}`,
            warrantyId: preGeneratedSystemId!,
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
          createdAt: toISODateTime(getCurrentDate()),
          updatedAt: toISODateTime(getCurrentDate()),
        });
        
        toast.success('Đã tạo phiếu bảo hành', { 
          description: `Mã: ${finalTicket?.id || finalTicket?.systemId} - Khách: ${data.customer?.name}`,
          duration: 3000
        });
        
        router.push(`/warranty/${preGeneratedSystemId}`);
      }
    } catch (error) {
      console.error('Error saving warranty ticket:', error);
      
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
    allTickets,
    branches,
    employees,
    generateNextSystemId,
    add,
    update,
    receivedPermanentFiles,
    receivedStagingFiles,
    receivedSessionId,
    receivedFilesToDelete,
    setReceivedFilesToDelete,
    processedPermanentFiles,
    processedStagingFiles,
    processedSessionId,
    processedFilesToDelete,
    setProcessedFilesToDelete,
    productImagesState,
    setIsSubmitting,
    router,
    user,
  ]);
  
  return { onSubmit };
}

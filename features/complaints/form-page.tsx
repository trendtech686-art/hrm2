'use client'

import * as React from "react";
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { asSystemId } from '@/lib/id-types';
import { formatDateForDisplay } from '@/lib/date-utils';

// Types & Store
import type { Complaint, ComplaintType } from "./types";
import { useComplaintStore } from "./store";
import { complaintTypeLabels } from "./types";
import type { StagingFile } from "../../lib/file-upload-api";
import { complaintNotifications } from "./notification-utils";

// Product image & type
import { useProductImage } from '../products/components/product-image';
import { useProductStore } from '../products/store';
import { useProductTypeStore } from '../settings/inventory/product-type-store';
import { Package, Eye, StickyNote } from 'lucide-react';

// Settings
import { loadComplaintTypes, type ComplaintType as ComplaintTypeSetting } from "../settings/complaints/complaints-settings-page";

// UI Components
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { VirtualizedCombobox, type ComboboxOption } from "../../components/ui/virtualized-combobox";
import { CurrencyInput } from "../../components/ui/currency-input";
import { NewDocumentsUpload } from "../../components/ui/new-documents-upload";
import { ExistingDocumentsViewer } from "../../components/ui/existing-documents-viewer";
import { ImagePreviewDialog } from "../../components/ui/image-preview-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

// Hooks & Context
import { usePageHeader } from "../../contexts/page-header-context";
import { useOrderStore } from "../orders/store";
import { useSalesReturnStore } from "../sales-returns/store";
import { useBranchStore } from "../settings/branches/store";
import { useEmployeeStore } from "../employees/store";
import { useCustomerStore } from "../customers/store";
import { useNotificationStore } from "../../components/ui/notification-center";
import { FileUploadAPI } from "../../lib/file-upload-api";
import { useAuth } from "../../contexts/auth-context";
import { ROUTES, generatePath } from "../../lib/router";
import type { BreadcrumbItem } from "../../lib/breadcrumb-system";


interface ComplaintFormValues {
  id?: string; // Mã phiếu khiếu nại (optional - tự tạo nếu không điền)
  orderSystemId: string; // ⭐ SystemId của đơn hàng
  branchSystemId: string; // ⭐ SystemId của chi nhánh (lấy từ order)
  branchName: string; // Tên chi nhánh (lấy từ order)
  customerSystemId: string; // ⭐ SystemId của khách hàng
  customerName: string;
  customerPhone: string;
  type: ComplaintType;
  description?: string; // Optional - no longer required in UI
  priority: "low" | "medium" | "high" | "urgent";
  orderValue: number;
  images: string[];
  videoLinks?: string; // Video links from customer (YouTube, Google Drive, etc.)
}

// Product type fallback labels
const productTypeFallbackLabels: Record<string, string> = {
  physical: 'Hàng hóa',
  service: 'Dịch vụ', 
  digital: 'Sản phẩm số',
  combo: 'Combo'
};

// ProductThumbnailCell component for displaying product images
const ProductThumbnailCell = ({ 
    productSystemId, 
    product,
    productName,
    size = 'sm',
    onPreview
}: { 
    productSystemId: string; 
    product?: { thumbnailImage?: string; galleryImages?: string[]; images?: string[]; name?: string } | null;
    productName: string;
    size?: 'sm' | 'md';
    onPreview?: (image: string, title: string) => void;
}) => {
    const imageUrl = useProductImage(productSystemId, product);
    
    const sizeClasses = size === 'sm' 
        ? 'w-10 h-9' 
        : 'w-12 h-10';
    const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-4 w-4';
    
    if (imageUrl) {
        return (
            <div
                className={`group/thumbnail relative ${sizeClasses} rounded border overflow-hidden bg-muted ${onPreview ? 'cursor-pointer' : ''}`}
                onClick={() => onPreview?.(imageUrl, productName)}
            >
                <img src={imageUrl} alt={productName} className="w-full h-full object-cover transition-all group-hover/thumbnail:brightness-75" />
                {onPreview && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumbnail:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4 text-white drop-shadow-md" />
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <div className={`${sizeClasses} bg-muted rounded flex items-center justify-center`}>
            <Package className={`${iconSize} text-muted-foreground`} />
        </div>
    );
};

/**
 * Form Page - Tạo/Sửa khiếu nại
 */
export function ComplaintFormPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { setPageHeader } = usePageHeader();
  
  const { getComplaintById, addComplaint, updateComplaint } = useComplaintStore();
  const { data: orders } = useOrderStore();
  const { data: salesReturns } = useSalesReturnStore();
  const { data: branches } = useBranchStore();
  const { data: employees } = useEmployeeStore();
  const { data: customers } = useCustomerStore();
  const { addNotification } = useNotificationStore();
  const { employee } = useAuth();
  
  // Product & ProductType for image/type display
  const { findById: findProductById } = useProductStore();
  const { findById: findProductTypeById } = useProductTypeStore();
  
  // Helper to get product type label
  const getProductTypeLabel = React.useCallback((product: any) => {
    if (!product) return 'Hàng hóa';
    if (product.productTypeSystemId) {
      const productType = findProductTypeById(product.productTypeSystemId);
      if (productType?.name) return productType.name;
    }
    return productTypeFallbackLabels[product.type] || 'Hàng hóa';
  }, [findProductTypeById]);
  
  const isEditing = !!systemId;
  const complaint = isEditing && systemId ? getComplaintById(asSystemId(systemId)) : null;
  
  // Check if complaint has been verified (can only edit note)
  const isVerified = complaint?.verification !== 'pending-verification';
  const canOnlyEditNote = isEditing && isVerified;
  
  // Current user (from auth context)
  const currentUser = employee 
    ? { systemId: employee.systemId, name: employee.fullName }
    : { systemId: asSystemId('SYSTEM'), name: 'Guest User' };

  // ⭐ Load complaint types from Settings và map với enum
  const complaintTypes = React.useMemo(() => {
    try {
      const types = loadComplaintTypes();
      
      // Map các loại phổ biến từ settings → enum
      // Nếu không match, fallback về 'product-condition'
      const nameToEnumMap: Record<string, ComplaintType> = {
        'sản phẩm lỗi': 'product-condition',
        'giao hàng chậm': 'warehouse-defect',
        'sai sản phẩm': 'wrong-product',
        'sai hàng': 'wrong-product',
        'thiếu hàng': 'missing-items',
        'đóng gói sai': 'wrong-packaging',
        'lỗi do kho': 'warehouse-defect',
        'tình trạng hàng': 'product-condition',
        'dịch vụ chăm sóc': 'product-condition',
        'khác': 'product-condition',
      };
      
      const mappedTypes = types
        .filter(t => t.isActive)
        .sort((a, b) => a.order - b.order)
        .map(t => {
          const normalizedName = t.name.toLowerCase().trim();
          const enumValue = nameToEnumMap[normalizedName] || 'product-condition';
          
          return {
            value: enumValue as ComplaintType,
            label: t.name,
          };
        });
      
      if (mappedTypes.length > 0) {
        return mappedTypes;
      }
    } catch (e) {
      console.error('Failed to load complaint types:', e);
    }
    
    // Fallback to hardcoded types from complaintTypeLabels
    return [
      { value: 'wrong-product' as ComplaintType, label: 'Sai hàng' },
      { value: 'missing-items' as ComplaintType, label: 'Thiếu hàng' },
      { value: 'wrong-packaging' as ComplaintType, label: 'Đóng gói sai quy cách' },
      { value: 'warehouse-defect' as ComplaintType, label: 'Trả hàng lỗi do kho' },
      { value: 'product-condition' as ComplaintType, label: 'Khách phàn nàn về tình trạng hàng' },
    ];
  }, []);
  
  // State
  const [selectedOrder, setSelectedOrder] = React.useState<ComboboxOption | null>(null);
  const [packagingEmployee, setPackagingEmployee] = React.useState<string>("");
  const [packagingEmployeeName, setPackagingEmployeeName] = React.useState<string>("");
  const [isLoadingComplaint, setIsLoadingComplaint] = React.useState(false); // Flag để tránh conflict
  
  // ⭐ NEW: Quản lý sản phẩm bị ảnh hưởng
  const [affectedProducts, setAffectedProducts] = React.useState<Array<{
    productSystemId: string;
    productId: string;
    productName: string;
    unitPrice: number;
    quantityOrdered: number;
    quantityReceived: number;
    quantityMissing: number;
    quantityDefective: number;
    quantityExcess: number;
    issueType: 'excess' | 'missing' | 'defective' | 'other';
    note: string;
    resolutionType: 'refund' | 'replacement' | 'ignore';
  }>>([]);
  
  // ============ CUSTOMER IMAGES (Hình từ khách hàng) ============
  const [customerPermanentFiles, setCustomerPermanentFiles] = React.useState<StagingFile[]>([]);
  const [customerStagingFiles, setCustomerStagingFiles] = React.useState<StagingFile[]>([]);
  const [customerSessionId, setCustomerSessionId] = React.useState<string | null>(null);
  const [customerFilesToDelete, setCustomerFilesToDelete] = React.useState<string[]>([]);
  
  // ============ EMPLOYEE IMAGES (Hình từ nhân viên) ============
  const [employeePermanentFiles, setEmployeePermanentFiles] = React.useState<StagingFile[]>([]);
  const [employeeStagingFiles, setEmployeeStagingFiles] = React.useState<StagingFile[]>([]);
  const [employeeSessionId, setEmployeeSessionId] = React.useState<string | null>(null);
  const [employeeFilesToDelete, setEmployeeFilesToDelete] = React.useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Image preview state
  const [previewState, setPreviewState] = React.useState<{ open: boolean; image: string; title: string }>({
    open: false,
    image: '',
    title: ''
  });
  
  const handlePreview = React.useCallback((image: string, title: string) => {
    setPreviewState({ open: true, image, title });
  }, []);
  
  // Form
  const form = useForm<ComplaintFormValues>({
    defaultValues: {
      id: "",
      orderSystemId: "", // ⭐ SystemId
      branchSystemId: "", // ⭐ SystemId chi nhánh
      branchName: "", // Tên chi nhánh
      customerSystemId: "", // ⭐ SystemId
      customerName: "",
      customerPhone: "",
      type: "missing-items",
      description: "",
      priority: "medium",
      orderValue: 0,
      images: [],
      videoLinks: "",
    },
  });
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;
  const complaintId = watch("id");
  const orderValue = watch("orderValue");
  
  // Order options for VirtualizedCombobox
  const orderOptions = React.useMemo<ComboboxOption[]>(() => {
    return orders.map((order) => ({
      value: order.systemId, // ⭐ Dùng systemId làm value
      label: `${order.id} - ${order.customerName}`, // Hiển thị business ID
      subtitle: `${formatDateForDisplay(order.orderDate)} • ${order.grandTotal?.toLocaleString('vi-VN')} đ`,
    }));
  }, [orders]);
  
  // Auto-fill khi chọn order (chỉ chạy khi user chọn thủ công, không chạy khi load complaint)
  React.useEffect(() => {
    if (selectedOrder && !isLoadingComplaint) {
      const order = orders.find(o => o.systemId === selectedOrder.value); // ⭐ Dùng systemId
      if (order) {
        setValue("orderSystemId", order.systemId); // ⭐ Lưu systemId
        setValue("branchSystemId", order.branchSystemId); // ⭐ Lưu branchSystemId từ order
        setValue("branchName", order.branchName); // ⭐ Lưu branchName từ order
        setValue("customerSystemId", order.customerSystemId); // ⭐ Lưu customerSystemId
        setValue("customerName", order.customerName);
        
        // Lấy số điện thoại từ Customer store
        const customer = customers.find(c => c.systemId === order.customerSystemId);
        setValue("customerPhone", customer?.phone || "");
        
        setValue("orderValue", order.grandTotal || 0);
        
        // Lấy nhân viên đóng gói từ packaging
        if (order.packagings && order.packagings.length > 0) {
          const packaging = order.packagings[0];
          const empId = packaging.assignedEmployeeId || packaging.confirmingEmployeeId;
          const empName = packaging.assignedEmployeeName || packaging.confirmingEmployeeName;
          
          if (empId && empName) {
            setPackagingEmployee(empId);
            setPackagingEmployeeName(empName);
          }
        }
      }
    }
  }, [selectedOrder, orders, customers, setValue, isLoadingComplaint]);
  
  // Load complaint data for editing
  React.useEffect(() => {
    if (complaint) {
      setIsLoadingComplaint(true); // Bật flag để tránh auto-fill override data
      
      setValue("id", complaint.id);
      setValue("orderSystemId", complaint.orderSystemId); // ⭐ Load systemId
      setValue("branchSystemId", complaint.branchSystemId || ""); // ⭐ Load branchSystemId
      setValue("branchName", complaint.branchName || ""); // ⭐ Load branchName
      setValue("customerSystemId", complaint.customerSystemId); // ⭐ Load customerSystemId
      setValue("customerName", complaint.customerName);
      setValue("customerPhone", complaint.customerPhone);
      setValue("type", complaint.type);
      setValue("description", complaint.description);
      setValue("priority", complaint.priority);
      setValue("orderValue", complaint.orderValue || 0);
      setValue("videoLinks", (complaint as any).videoLinks || "");
      
      // Set selected order - dùng orderSystemId
      const order = orders.find(o => o.systemId === complaint.orderSystemId); // ⭐ Dùng systemId
      if (order) {
        setSelectedOrder({
          value: order.systemId, // ⭐ Value là systemId
          label: `${order.id} - ${order.customerName}`, // Label hiển thị business ID
          subtitle: `${formatDateForDisplay(order.orderDate)} • ${order.grandTotal?.toLocaleString('vi-VN')} đ`,
        });
      }
      
      // ⭐ Load affected products
      if (complaint.affectedProducts && complaint.affectedProducts.length > 0) {
        const order = orders.find(o => o.systemId === complaint.orderSystemId); // ⭐ Dùng systemId
        setAffectedProducts(complaint.affectedProducts.map(p => {
          // Lấy lại unitPrice từ order nếu không có
          const orderItem = order?.lineItems?.find(item => item.productSystemId === p.productSystemId);
          return {
            ...p,
            unitPrice: p.unitPrice || orderItem?.unitPrice || 0,
            quantityMissing: p.quantityMissing || 0,
            quantityDefective: p.quantityDefective || 0,
            quantityExcess: p.quantityExcess || 0,
            issueType: p.issueType || 'missing',
            note: p.note || '',
            resolutionType: p.resolutionType || 'ignore',
          };
        }));
      }
      
      // Set customer images (hình từ khách hàng) - filter by type 'initial'
      if (complaint.images && complaint.images.length > 0) {
        const customerImages = complaint.images.filter(img => img.type === 'initial');
        console.log('Loading customer images:', customerImages.length, customerImages);
        
        if (customerImages.length > 0) {
          const stagingFiles: StagingFile[] = customerImages.map((img, idx) => ({
            id: img.id || `existing-customer-${idx}`,
            name: img.url.split('/').pop() || `image_${idx}.jpg`,
            originalName: img.url.split('/').pop() || `image_${idx}.jpg`,
            slug: img.url.split('/').pop()?.replace(/\.[^/.]+$/, '') || `image-${idx}`,
            filename: img.url.split('/').pop() || `image_${idx}.jpg`,
            size: 0,
            type: 'image/jpeg',
            url: img.url,
            status: 'permanent' as const,
            sessionId: '',
            uploadedAt: typeof img.uploadedAt === 'string' 
              ? img.uploadedAt 
              : img.uploadedAt instanceof Date 
                ? img.uploadedAt.toISOString() 
                : new Date().toISOString(),
            metadata: '',
          }));
          setCustomerPermanentFiles(stagingFiles);
          console.log('Set customer permanent files:', stagingFiles.length);
        }
      }
      
      // Set employee images (hình từ nhân viên) - from employeeImages field
      if ((complaint as any).employeeImages && (complaint as any).employeeImages.length > 0) {
        console.log('Loading employee images:', (complaint as any).employeeImages.length, (complaint as any).employeeImages);
        
        const stagingFiles: StagingFile[] = (complaint as any).employeeImages.map((img: any, idx: number) => ({
          id: img.id || `existing-employee-${idx}`,
          name: img.url.split('/').pop() || `employee_${idx}.jpg`,
          originalName: img.url.split('/').pop() || `employee_${idx}.jpg`,
          slug: img.url.split('/').pop()?.replace(/\.[^/.]+$/, '') || `employee-${idx}`,
          filename: img.url.split('/').pop() || `employee_${idx}.jpg`,
          size: 0,
          type: 'image/jpeg',
          url: img.url,
          status: 'permanent' as const,
          sessionId: '',
          uploadedAt: typeof img.uploadedAt === 'string' 
            ? img.uploadedAt 
            : img.uploadedAt instanceof Date 
              ? img.uploadedAt.toISOString() 
              : new Date().toISOString(),
          metadata: '',
        }));
        setEmployeePermanentFiles(stagingFiles);
        console.log('Set employee permanent files:', stagingFiles.length);
      }
      
      // Set packaging employee if assigned
      if (complaint.assignedTo) {
        const emp = employees.find(e => e.systemId === complaint.assignedTo);
        if (emp) {
          setPackagingEmployee(emp.systemId);
          setPackagingEmployeeName(emp.fullName);
        }
      }
      
      // Tắt flag sau khi load xong để cho phép auto-fill hoạt động bình thường
      setTimeout(() => {
        setIsLoadingComplaint(false);
      }, 100);
    }
  }, [complaint, setValue, orders, employees]);
  
  // ⚠️ REMOVED: Không cleanup trong useEffect unmount
  // Lý do: Nếu cleanup chạy trước khi confirm → 404 error
  // Thay vào đó: Chỉ cleanup SAU KHI confirm thành công (trong onSubmit)
  // Server sẽ tự động cleanup staging files cũ sau 24h
  
  // ============ HANDLERS: Mark/Unmark for Delete ============
  
  // Handler: Mark customer image for deletion
  const handleMarkCustomerForDeletion = React.useCallback((fileId: string) => {
    setCustomerFilesToDelete(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)  // Unmark
        : [...prev, fileId]                 // Mark
    );
  }, []);
  
  // Handler: Mark employee image for deletion
  const handleMarkEmployeeForDeletion = React.useCallback((fileId: string) => {
    setEmployeeFilesToDelete(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)  // Unmark
        : [...prev, fileId]                 // Mark
    );
  }, []);
  
  // Page header
  const selectedOrderEntity = React.useMemo(() => {
    if (!selectedOrder) return null;
    return orders.find(o => o.systemId === selectedOrder.value) ?? null;
  }, [orders, selectedOrder]);

  const headerActions = React.useMemo(() => ([
    <Button
      key="cancel"
      variant="outline"
      size="sm"
      className="h-9"
      onClick={() => router.push(ROUTES.INTERNAL.COMPLAINTS)}
      disabled={isSubmitting}
    >
      Hủy
    </Button>,
    <Button
      key="submit"
      size="sm"
      className="h-9"
      onClick={() => {
        const form = document.querySelector('form[data-complaint-form]') as HTMLFormElement;
        if (form) form.requestSubmit();
      }}
      disabled={isSubmitting || !selectedOrder}
    >
      {isSubmitting ? "Đang lưu..." : isEditing ? "Cập nhật" : "Tạo khiếu nại"}
    </Button>,
  ]), [isEditing, isSubmitting, router, selectedOrder]);

  const headerSubtitle = React.useMemo(() => {
    if (complaint) {
      return [
        `Phiếu ${complaint.id}`,
        complaint.customerName && `Khách ${complaint.customerName}`,
        (complaint.orderCode || complaint.orderSystemId) && `Đơn ${complaint.orderCode || complaint.orderSystemId}`,
      ].filter(Boolean).join(' • ');
    }
    if (selectedOrderEntity) {
      return [
        `Đơn ${selectedOrderEntity.id}`,
        selectedOrderEntity.customerName && `Khách ${selectedOrderEntity.customerName}`,
        selectedOrderEntity.branchName && `Chi nhánh ${selectedOrderEntity.branchName}`,
      ].filter(Boolean).join(' • ');
    }
    return 'Điền thông tin đơn hàng, khách hàng và ảnh bằng chứng theo checklist.';
  }, [complaint, selectedOrderEntity]);

  const breadcrumb = React.useMemo<BreadcrumbItem[]>(() => {
    if (complaint) {
      const detailPath = generatePath(ROUTES.INTERNAL.COMPLAINT_VIEW, { systemId: complaint.systemId as unknown as string });
      const editPath = generatePath(ROUTES.INTERNAL.COMPLAINT_EDIT, { systemId: complaint.systemId as unknown as string });
      return [
        { label: "Trang chủ", href: ROUTES.ROOT },
        { label: "Quản lý Khiếu nại", href: ROUTES.INTERNAL.COMPLAINTS },
        { label: complaint.id, href: detailPath },
        { label: "Chỉnh sửa", href: editPath },
      ];
    }
    return [
      { label: "Trang chủ", href: ROUTES.ROOT },
      { label: "Quản lý Khiếu nại", href: ROUTES.INTERNAL.COMPLAINTS },
      { label: "Tạo mới", href: ROUTES.INTERNAL.COMPLAINT_NEW },
    ];
  }, [complaint]);

  React.useEffect(() => {
    setPageHeader({
      title: complaint ? "Chỉnh sửa khiếu nại" : "Tạo khiếu nại",
      subtitle: headerSubtitle,
      breadcrumb,
      showBackButton: true,
      backPath: ROUTES.INTERNAL.COMPLAINTS,
      actions: headerActions,
    });
  }, [breadcrumb, complaint, headerActions, headerSubtitle, setPageHeader]);
  
  // Submit handler
  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      
      if (!selectedOrder) {
        toast.error("Vui lòng chọn đơn hàng");
        return;
      }
      
      if (!packagingEmployee) {
        toast.error("Không tìm thấy nhân viên đóng gói cho đơn hàng này");
        return;
      }
      
      // ===== TẠO COMPLAINT ID DUY NHẤT CHO CẢ 2 LOẠI ẢNH =====
      let targetComplaintId = data.id;
      if (!targetComplaintId && !isEditing) {
        targetComplaintId = 'TEMP_' + Date.now(); // ⭐ Tạo 1 lần duy nhất
      } else if (isEditing && systemId) {
        targetComplaintId = systemId;
      }

      if (!targetComplaintId) {
        throw new Error('Không xác định được complaintId để đồng bộ file.');
      }
      
      // ===== XỬ LÝ CUSTOMER IMAGES =====
      let finalCustomerImageUrls: string[] = [];
      
      // Filter deleted files
      const cleanedCustomerPermanent = customerPermanentFiles.filter(
        f => !customerFilesToDelete.includes(f.id)
      );
      
      console.log('🖼️ Customer images processing:', {
        total: customerPermanentFiles.length + customerStagingFiles.length,
        permanent: customerPermanentFiles.length,
        staging: customerStagingFiles.length,
        deleted: customerFilesToDelete.length,
        cleanedPermanent: cleanedCustomerPermanent.length,
        sessionId: customerSessionId,
        targetComplaintId: targetComplaintId,
        willConfirm: !!(customerSessionId && customerStagingFiles.length > 0)
      });
      
      // Confirm staging files nếu có NEW files với sessionId (như WARRANTY pattern)
      // ⚠️ FIX: Chỉ cần check customerSessionId và customerStagingFiles.length > 0
      // Không cần check .some(img => img.sessionId) vì tất cả files đều có chung sessionId
      if (customerSessionId && customerStagingFiles.length > 0) {
        console.log('🔄 Confirming customer staging files:', {
          sessionId: customerSessionId,
          fileCount: customerStagingFiles.length,
          targetId: targetComplaintId,
          files: customerStagingFiles.map(f => ({ id: f.id, name: f.name, sessionId: f.sessionId }))
        });
        
        const commitToastId = toast.loading("Đang lưu hình ảnh từ khách hàng...");
        try {
          // ✅ Dùng API chuẩn giống WARRANTY
          const result = await FileUploadAPI.confirmStagingFiles(
            // @ts-ignore
            (customerSessionId as any), 
            targetComplaintId,
            'complaint',        // entityType
            'customer-images',  // subCategory
            {
              orderSystemId: data.orderSystemId ?? "", // ⭐ Dùng systemId
              customerName: data.customerName ?? "",
            }
          );
          
          console.log('✅ Customer confirm result:', result);
          
          const newUrls = result
            .filter((file: any) => file && file.url)
            .map((file: any) => file.url);
          
          console.log('✅ Customer new URLs:', newUrls);
          
          // Combine cleaned permanent + newly confirmed
          finalCustomerImageUrls = [
            ...cleanedCustomerPermanent.map(f => f.url),
            ...newUrls
          ];
          
          console.log('✅ Final customer URLs:', finalCustomerImageUrls);
          
          toast.success(`Đã lưu ${newUrls.length} hình ảnh mới`, { id: commitToastId });
          
          // Cleanup staging files sau khi confirm thành công
          try {
            await FileUploadAPI.deleteStagingSession(customerSessionId);
          } catch (cleanupError) {
            console.warn('Failed to cleanup customer staging files:', cleanupError);
          }
        } catch (error) {
          console.error("Failed to commit customer files:", error);
          toast.error("Lỗi khi lưu hình ảnh khách hàng", { id: commitToastId });
          // Fallback: use staging URLs
          finalCustomerImageUrls = [
            ...cleanedCustomerPermanent.map(f => f.url),
            ...customerStagingFiles.map(f => f.url)
          ];
        }
      } else {
        // No NEW staging files, just use cleaned permanent URLs
        finalCustomerImageUrls = cleanedCustomerPermanent.map(f => f.url);
      }
      
      // ===== XỬ LÝ EMPLOYEE IMAGES =====
      let finalEmployeeImageUrls: string[] = [];
      
      // Filter deleted files
      const cleanedEmployeePermanent = employeePermanentFiles.filter(
        f => !employeeFilesToDelete.includes(f.id)
      );
      
      console.log('👤 Employee images processing:', {
        total: employeePermanentFiles.length + employeeStagingFiles.length,
        permanent: employeePermanentFiles.length,
        staging: employeeStagingFiles.length,
        deleted: employeeFilesToDelete.length,
        cleanedPermanent: cleanedEmployeePermanent.length,
        sessionId: employeeSessionId,
        targetComplaintId: targetComplaintId,
        willConfirm: !!(employeeSessionId && employeeStagingFiles.length > 0)
      });
      
      // Confirm staging files nếu có NEW files với sessionId (như WARRANTY pattern)
      // ⚠️ FIX: Chỉ cần check employeeSessionId và employeeStagingFiles.length > 0
      if (employeeSessionId && employeeStagingFiles.length > 0) {
        console.log('🔄 Confirming employee staging files:', {
          sessionId: employeeSessionId,
          fileCount: employeeStagingFiles.length,
          targetId: targetComplaintId,
          files: employeeStagingFiles.map(f => ({ id: f.id, name: f.name, sessionId: f.sessionId }))
        });
        
        const commitToastId = toast.loading("Đang lưu hình ảnh từ nhân viên...");
        try {
          // ✅ Dùng API chuẩn giống WARRANTY
          const result = await FileUploadAPI.confirmStagingFiles(
            // @ts-ignore
            (employeeSessionId as any), 
            targetComplaintId,
            'complaint',        // entityType
            'employee-images',  // subCategory
            {
              orderSystemId: data.orderSystemId ?? "", // ⭐ Dùng systemId
              customerName: data.customerName ?? "",
              employeeName: packagingEmployeeName,
            }
          );
          
          console.log('✅ Employee confirm result:', result);
          
          const newUrls = result
            .filter((file: any) => file && file.url)
            .map((file: any) => file.url);
          
          console.log('✅ Employee new URLs:', newUrls);
          
          // Combine cleaned permanent + newly confirmed
          finalEmployeeImageUrls = [
            ...cleanedEmployeePermanent.map(f => f.url),
            ...newUrls
          ];
          
          console.log('✅ Final employee URLs:', finalEmployeeImageUrls);
          
          toast.success(`Đã lưu ${newUrls.length} hình ảnh nhân viên`, { id: commitToastId });
          
          // Cleanup staging files sau khi confirm thành công
          try {
            await FileUploadAPI.deleteStagingSession(employeeSessionId);
          } catch (cleanupError) {
            console.warn('Failed to cleanup employee staging files:', cleanupError);
          }
        } catch (error) {
          console.error("Failed to commit employee files:", error);
          toast.error("Lỗi khi lưu hình ảnh nhân viên", { id: commitToastId });
          // Fallback: use staging URLs
          finalEmployeeImageUrls = [
            ...cleanedEmployeePermanent.map(f => f.url),
            ...employeeStagingFiles.map(f => f.url)
          ];
        }
      } else {
        // No NEW staging files, just use cleaned permanent URLs
        finalEmployeeImageUrls = cleanedEmployeePermanent.map(f => f.url);
      }
      
      const complaintData = {
        id: data.id,
        orderSystemId: data.orderSystemId, // ⭐ Lưu systemId
        orderCode: selectedOrder ? orders.find(o => o.systemId === data.orderSystemId)?.id : undefined, // ⭐ Optional display code
        orderValue: data.orderValue,
        branchSystemId: data.branchSystemId, // ⭐ Lưu branchSystemId từ order
        branchName: data.branchName, // ⭐ Lưu branchName từ order
        customerSystemId: data.customerSystemId, // ⭐ Lưu systemId
        customerId: selectedOrder ? orders.find(o => o.systemId === data.orderSystemId)?.customerId : undefined, // ⭐ Optional display code
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        type: data.type,
        description: data.description || "", // Default to empty string
        priority: data.priority,
        videoLinks: data.videoLinks?.trim() || "", // Video links from customer
        // CUSTOMER IMAGES - Lưu vào complaint.images với type 'initial'
        images: finalCustomerImageUrls
          .filter(url => url && url.trim() !== '') // ⭐ Filter empty URLs
          .map((url, idx) => ({
            id: asSystemId(`complaint-image-${Date.now()}-${idx}`),
            url,
            uploadedBy: currentUser.systemId,
            uploadedAt: new Date(),
            type: "initial" as const, // ✅ Customer images type
          })),
        // EMPLOYEE IMAGES - Lưu vào field riêng employeeImages
        employeeImages: finalEmployeeImageUrls
          .filter(url => url && url.trim() !== '') // ⭐ Filter empty URLs
          .map((url, idx) => ({
            id: asSystemId(`complaint-employee-image-${Date.now()}-${idx}`),
            url,
            uploadedBy: packagingEmployee,
            uploadedAt: new Date(),
          })),
        // ⭐ NEW: Affected products
        affectedProducts: affectedProducts.length > 0 ? affectedProducts : undefined,
        assignedTo: packagingEmployee,
        assignedAt: new Date(),
        createdBy: currentUser.systemId,
      };
      
      if (isEditing && systemId) {
        updateComplaint(asSystemId(systemId), complaintData as any);
        toast.success("Đã cập nhật khiếu nại");
        router.push(`/complaints/${systemId}`); // Navigate to detail page
      } else {
        const newSystemId = addComplaint(complaintData as any);
        
        // Lấy orderCode để hiển thị
        const order = orders.find(o => o.systemId === data.orderSystemId);
        const orderCode = order?.id || data.orderSystemId;
        
        // Gửi thông báo cho nhân viên đóng gói
        addNotification({
          type: "system",
          title: "Khiếu nại mới cần xử lý",
          message: `Bạn được giao xử lý khiếu nại cho đơn hàng ${orderCode}. Độ ưu tiên: ${data.priority}`,
          link: `/complaints/${newSystemId}`,
          createdBy: currentUser.systemId,
          metadata: {
            recipientId: packagingEmployee,
            complaintId: newSystemId,
            orderSystemId: data.orderSystemId, // ⭐ Lưu systemId
            priority: data.priority,
          }
        });
        
        complaintNotifications.onCreate("Đã tạo khiếu nại mới và gửi thông báo cho nhân viên");
        router.push(`/complaints/${newSystemId}`); // Navigate to detail page
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error("Có lỗi xảy ra khi lưu khiếu nại");
    } finally {
      setIsSubmitting(false);
    }
  });
  
  return (
    <div className="w-full h-full">
      <form onSubmit={onSubmit} className="space-y-6" data-complaint-form>
        {/* Main Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-h4">
              {isEditing ? "Chỉnh sửa khiếu nại" : "Tạo khiếu nại mới"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {canOnlyEditNote && (
              <div className="bg-muted/50 border border-muted-foreground/20 rounded-md p-3 text-body-sm text-muted-foreground">
                ℹ️ Khiếu nại đã được xác minh. Chỉ có thể chỉnh sửa ghi chú.
              </div>
            )}
            {/* Mã phiếu khiếu nại (optional) */}
            <div>
              <Label htmlFor="id" className="text-body-sm">Mã phiếu khiếu nại (tùy chọn)</Label>
              <Input
                id="id"
                placeholder="Để trống để tự động tạo mã"
                className="h-9"
                disabled={canOnlyEditNote}
                {...register("id")}
              />
              <p className="text-body-xs text-muted-foreground mt-1">
                Nếu không điền, hệ thống sẽ tự động tạo mã
              </p>
            </div>
            
            {/* Chọn đơn hàng */}
            <div>
              <Label className="text-body-sm">Chọn đơn hàng *</Label>
              <VirtualizedCombobox
                value={selectedOrder}
                onChange={setSelectedOrder}
                options={orderOptions}
                placeholder="Tìm và chọn đơn hàng..."
                searchPlaceholder="Tìm theo mã đơn, tên khách..."
                disabled={canOnlyEditNote}
              />
              {!selectedOrder && (
                <p className="text-body-xs text-destructive mt-1">Vui lòng chọn đơn hàng</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card: Thông tin đơn hàng */}
        {selectedOrder && orders.find(o => o.systemId === selectedOrder.value) && (() => {
          const order = orders.find(o => o.systemId === selectedOrder.value)!;
          return (
            <Card>
              <CardHeader>
                <CardTitle className="text-h4">Thông tin đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-body-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mã đơn hàng:</span>
                    <span className="font-medium">{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mã vận đơn:</span>
                    <span className="font-medium">{order.packagings?.[0]?.trackingCode || "Chưa có"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Khách hàng:</span>
                    <span className="font-medium">{order.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Số điện thoại:</span>
                    <span className="font-medium">{watch("customerPhone") || "Chưa có"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Địa chỉ giao hàng:</span>
                    <span className="font-medium text-right">{order.shippingAddress || "Chưa có"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chi nhánh:</span>
                    <span className="font-medium">{order.branchName || "Chưa có"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Người tạo đơn:</span>
                    <span className="font-medium">{order.salesperson || "Chưa có"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày bán:</span>
                    <span className="font-medium">{formatDateForDisplay(order.orderDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Giá trị đơn:</span>
                    <span className="font-medium">{(order.grandTotal || 0).toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thời gian giao hàng:</span>
                    <span className="font-medium">
                      {order.expectedDeliveryDate ? formatDateForDisplay(order.expectedDeliveryDate) : "Chưa có"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thời gian xuất kho:</span>
                    <span className="font-medium">
                      {order.packagings?.[0]?.requestDate ? formatDateForDisplay(order.packagings[0].requestDate) : "Chưa xuất"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nhân viên xử lý:</span>
                    <span className="font-medium">{packagingEmployeeName || "Chưa xác định"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })()}

        {/* ⭐ NEW: Card Sản phẩm bị ảnh hưởng */}
        {selectedOrder && orders.find(o => o.systemId === selectedOrder.value) && (() => {
          const order = orders.find(o => o.systemId === selectedOrder.value)!;
          const orderProducts = order.lineItems || [];
          
          // Tính số lượng đã trả cho từng sản phẩm từ các phiếu trả hàng
          const returnedQuantities: Record<string, number> = {};
          salesReturns
            .filter(sr => sr.orderSystemId === order.systemId)
            .forEach(sr => {
              sr.items.forEach(item => {
                const key = item.productSystemId;
                returnedQuantities[key] = (returnedQuantities[key] || 0) + item.returnQuantity;
              });
            });
          
          // Lọc sản phẩm: chỉ hiện những SP còn hàng (chưa trả hết)
          const availableProducts = orderProducts.filter(item => {
            const returnedQty = returnedQuantities[item.productSystemId] || 0;
            return item.quantity > returnedQty; // Còn hàng để khiếu nại
          });
          
          return (
            <Card>
              <CardHeader>
                <CardTitle className="text-h4">Sản phẩm bị ảnh hưởng</CardTitle>
                <p className="text-body-sm text-muted-foreground mt-1">
                  Chọn sản phẩm và nhập số lượng thừa/thiếu/hỏng
                </p>
              </CardHeader>
              <CardContent>
                {availableProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Tất cả sản phẩm trong đơn hàng đã được trả lại.</p>
                    <p className="text-body-sm mt-1">Không thể tạo khiếu nại cho đơn hàng này.</p>
                  </div>
                ) : (
                <div className="border rounded-lg overflow-x-auto">
                  <table className="w-full text-body-sm">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="text-left p-2 font-medium w-12">Chọn</th>
                        <th className="text-center p-2 font-medium w-12">Ảnh</th>
                        <th className="text-left p-2 font-medium min-w-[220px]">Tên sản phẩm</th>
                        <th className="text-right p-2 font-medium w-24">Đơn giá</th>
                        <th className="text-center p-2 font-medium w-20">Số lượng</th>
                        <th className="text-left p-2 font-medium w-28">Loại KN</th>
                        <th className="text-center p-2 font-medium w-20">Thừa</th>
                        <th className="text-center p-2 font-medium w-20">Thiếu</th>
                        <th className="text-center p-2 font-medium w-20">Hỏng</th>
                        <th className="text-right p-2 font-medium w-28">Tổng tiền</th>
                        <th className="text-left p-2 font-medium min-w-[180px]">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableProducts.map((item, idx) => {
                        const returnedQty = returnedQuantities[item.productSystemId] || 0;
                        const remainingQty = item.quantity - returnedQty; // Số lượng còn lại có thể khiếu nại
                        const affected = affectedProducts.find(p => p.productSystemId === item.productSystemId);
                        const isSelected = !!affected;
                        
                        // Tính tổng tiền bị ảnh hưởng
                        const totalAffectedAmount = affected 
                          ? (affected.quantityMissing + affected.quantityDefective + affected.quantityExcess) * item.unitPrice
                          : 0;
                        
                        // Get product info for image and type
                        const product = findProductById(item.productSystemId);
                        const productTypeLabel = getProductTypeLabel(product);
                        const isCombo = !!(product?.type === 'combo' && product.comboItems?.length);
                        
                        return (
                          <tr key={idx} className="border-b last:border-0 hover:bg-muted/20">
                            <td className="p-2">
                              <Checkbox
                                checked={isSelected}
                                disabled={canOnlyEditNote}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    console.log('Checkbox checked - item data:', {
                                      productId: item.productId,
                                      unitPrice: item.unitPrice,
                                      price: item.price,
                                      fullItem: item
                                    });
                                    setAffectedProducts(prev => [...prev, {
                                      productSystemId: item.productSystemId,
                                      productId: item.productId,
                                      productName: item.productName,
                                      unitPrice: item.unitPrice || item.price || 0,
                                      quantityOrdered: remainingQty, // Sử dụng số lượng còn lại
                                      quantityReceived: item.quantity,
                                      quantityMissing: 0,
                                      quantityDefective: 0,
                                      quantityExcess: 0,
                                      issueType: 'missing',
                                      note: '',
                                      resolutionType: 'ignore',
                                    }]);
                                  } else {
                                    setAffectedProducts(prev => 
                                      prev.filter(p => p.productSystemId !== item.productSystemId)
                                    );
                                  }
                                }}
                              />
                            </td>
                            <td className="p-2">
                              <ProductThumbnailCell
                                productSystemId={item.productSystemId}
                                product={product}
                                productName={item.productName}
                                onPreview={handlePreview}
                              />
                            </td>
                            <td className="p-2">
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-body-sm">{item.productName}</span>
                                  {isCombo && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold">
                                      COMBO
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-body-xs text-muted-foreground flex-wrap">
                                  <span>{productTypeLabel}</span>
                                  <span>-</span>
                                  <Link 
                                    href={`/products/${item.productSystemId}`} 
                                    className="text-primary hover:underline"
                                  >
                                    {item.productId}
                                  </Link>
                                  {item.note && (
                                    <>
                                      <StickyNote className="h-3 w-3 text-amber-600 ml-1" />
                                      <span className="text-amber-600 italic">{item.note}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-2 text-right text-body-sm">
                              {(item.unitPrice || 0).toLocaleString('vi-VN')}đ
                            </td>
                            <td className="p-2 text-center">
                              {returnedQty > 0 ? (
                                <span title={`Đặt ${item.quantity}, đã trả ${returnedQty}`}>
                                  {remainingQty} <span className="text-muted-foreground text-body-xs">/ {item.quantity}</span>
                                </span>
                              ) : (
                                item.quantity
                              )}
                            </td>
                            <td className="p-2">
                              <Select
                                disabled={!isSelected || canOnlyEditNote}
                                value={affected?.issueType || 'missing'}
                                onValueChange={(value: 'excess' | 'missing' | 'defective' | 'other') => {
                                  setAffectedProducts(prev => prev.map(p => {
                                    if (p.productSystemId === item.productSystemId) {
                                      // Reset tất cả số lượng về 0 khi đổi loại
                                      return {
                                        ...p,
                                        issueType: value,
                                        quantityExcess: 0,
                                        quantityMissing: 0,
                                        quantityDefective: 0,
                                      };
                                    }
                                    return p;
                                  }));
                                }}
                              >
                                <SelectTrigger className="h-9 text-body-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="excess">Thừa</SelectItem>
                                  <SelectItem value="missing">Thiếu</SelectItem>
                                  <SelectItem value="defective">Hỏng</SelectItem>
                                  <SelectItem value="other">Khác</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="p-2">
                              <Input
                                type="number"
                                min={0}
                                disabled={!isSelected || (affected?.issueType !== 'excess' && affected?.issueType !== 'other') || canOnlyEditNote}
                                className="h-9 w-full text-center text-body-xs"
                                value={affected?.quantityExcess ?? 0}
                                onChange={(e) => {
                                  const excess = Math.max(0, Number(e.target.value));
                                  setAffectedProducts(prev => prev.map(p => 
                                    p.productSystemId === item.productSystemId 
                                      ? { ...p, quantityExcess: excess }
                                      : p
                                  ));
                                }}
                              />
                            </td>
                            <td className="p-2">
                              <Input
                                type="number"
                                min={0}
                                max={remainingQty}
                                disabled={!isSelected || (affected?.issueType !== 'missing' && affected?.issueType !== 'other') || canOnlyEditNote}
                                className="h-9 w-full text-center text-body-xs"
                                value={affected?.quantityMissing ?? 0}
                                onChange={(e) => {
                                  const missing = Math.min(Math.max(0, Number(e.target.value)), remainingQty);
                                  setAffectedProducts(prev => prev.map(p => 
                                    p.productSystemId === item.productSystemId 
                                      ? { ...p, quantityMissing: missing }
                                      : p
                                  ));
                                }}
                              />
                            </td>
                            <td className="p-2">
                              <Input
                                type="number"
                                min={0}
                                max={remainingQty}
                                disabled={!isSelected || (affected?.issueType !== 'defective' && affected?.issueType !== 'other') || canOnlyEditNote}
                                className="h-9 w-full text-center text-body-xs"
                                value={affected?.quantityDefective ?? 0}
                                onChange={(e) => {
                                  const defective = Math.min(Math.max(0, Number(e.target.value)), remainingQty);
                                  setAffectedProducts(prev => prev.map(p => 
                                    p.productSystemId === item.productSystemId 
                                      ? { ...p, quantityDefective: defective }
                                      : p
                                  ));
                                }}
                              />
                            </td>
                            <td className="p-2 text-right">
                              <span className={`font-semibold text-body-sm ${totalAffectedAmount > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                {totalAffectedAmount.toLocaleString('vi-VN')}đ
                              </span>
                            </td>
                            <td className="p-2">
                              <Input
                                type="text"
                                disabled={!isSelected || canOnlyEditNote}
                                placeholder="Ghi chú..."
                                className="h-9 text-body-xs"
                                value={affected?.note || ''}
                                onChange={(e) => {
                                  setAffectedProducts(prev => prev.map(p => 
                                    p.productSystemId === item.productSystemId 
                                      ? { ...p, note: e.target.value }
                                      : p
                                  ));
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                )}
              </CardContent>
            </Card>
          );
        })()}

        {/* Card: Tổng kết sản phẩm */}
        {affectedProducts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-h4">Tổng kết sản phẩm bị ảnh hưởng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Thừa */}
                {(() => {
                  const excessItems = affectedProducts.filter(p => p.issueType === 'excess' && (p.quantityExcess || 0) > 0);
                  const totalExcessQty = excessItems.reduce((sum, p) => sum + (p.quantityExcess || 0), 0);
                  const totalExcessAmount = excessItems.reduce((sum, p) => {
                    const qty = p.quantityExcess || 0;
                    const price = p.unitPrice || 0;
                    console.log('Excess calculation:', { productId: p.productId, qty, price, total: qty * price });
                    return sum + (qty * price);
                  }, 0);
                  
                  if (totalExcessQty === 0) return null;
                  
                  return (
                    <div className="space-y-2 p-4 rounded-lg border bg-card">
                      <p className="text-body-xs font-medium text-muted-foreground uppercase">Thừa</p>
                      <p className="text-h3 font-bold tracking-tight">{totalExcessQty}</p>
                      <p className="text-body-sm font-medium text-foreground">
                        {totalExcessAmount.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  );
                })()}
                
                {/* Thiếu */}
                {(() => {
                  const missingItems = affectedProducts.filter(p => p.issueType === 'missing' && (p.quantityMissing || 0) > 0);
                  const totalMissingQty = missingItems.reduce((sum, p) => sum + (p.quantityMissing || 0), 0);
                  const totalMissingAmount = missingItems.reduce((sum, p) => {
                    const qty = p.quantityMissing || 0;
                    const price = p.unitPrice || 0;
                    console.log('Missing calculation:', { productId: p.productId, qty, price, total: qty * price });
                    return sum + (qty * price);
                  }, 0);
                  
                  if (totalMissingQty === 0) return null;
                  
                  return (
                    <div className="space-y-2 p-4 rounded-lg border bg-card">
                      <p className="text-body-xs font-medium text-muted-foreground uppercase">Thiếu</p>
                      <p className="text-h3 font-bold tracking-tight">{totalMissingQty}</p>
                      <p className="text-body-sm font-medium text-foreground">
                        {totalMissingAmount.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  );
                })()}
                
                {/* Hỏng */}
                {(() => {
                  const defectiveItems = affectedProducts.filter(p => p.issueType === 'defective' && (p.quantityDefective || 0) > 0);
                  const totalDefectiveQty = defectiveItems.reduce((sum, p) => sum + (p.quantityDefective || 0), 0);
                  const totalDefectiveAmount = defectiveItems.reduce((sum, p) => {
                    const qty = p.quantityDefective || 0;
                    const price = p.unitPrice || 0;
                    console.log('Defective calculation:', { productId: p.productId, qty, price, total: qty * price });
                    return sum + (qty * price);
                  }, 0);
                  
                  if (totalDefectiveQty === 0) return null;
                  
                  return (
                    <div className="space-y-2 p-4 rounded-lg border bg-card">
                      <p className="text-body-xs font-medium text-muted-foreground uppercase">Hỏng</p>
                      <p className="text-h3 font-bold tracking-tight">{totalDefectiveQty}</p>
                      <p className="text-body-sm font-medium text-foreground">
                        {totalDefectiveAmount.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  );
                })()}
                
                {/* Khác */}
                {(() => {
                  const otherItems = affectedProducts.filter(p => p.issueType === 'other');
                  
                  if (otherItems.length === 0) return null;
                  
                  return (
                    <div className="space-y-2 p-4 rounded-lg border bg-card">
                      <p className="text-body-xs font-medium text-muted-foreground uppercase">Khác</p>
                      <p className="text-h3 font-bold tracking-tight">{otherItems.length}</p>
                      <p className="text-body-sm font-medium text-foreground">
                        Xem ghi chú
                      </p>
                    </div>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Card: Thông tin khiếu nại */}
        <Card>
          <CardHeader>
            <CardTitle className="text-h4">Thông tin khiếu nại</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Type + Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type" className="text-body-sm">Loại khiếu nại *</Label>
                <Select
                  value={watch("type")}
                  onValueChange={(value) => setValue("type", value as ComplaintType)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Chọn loại khiếu nại" />
                  </SelectTrigger>
                  <SelectContent>
                    {complaintTypes.map((type, idx) => (
                      <SelectItem key={idx} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {complaintTypes.length === 0 && (
                  <p className="text-body-xs text-muted-foreground mt-1">
                    Chưa có loại khiếu nại nào. Vui lòng thêm trong Cài đặt.
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="priority" className="text-body-sm">Mức độ ưu tiên *</Label>
                <Select
                  value={watch("priority")}
                  onValueChange={(value) => setValue("priority", value as any)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="urgent">Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 6: Video Links */}
            <div>
              <Label htmlFor="videoLinks" className="text-body-sm">Link video từ khách hàng (tùy chọn)</Label>
              <Textarea
                id="videoLinks"
                rows={3}
                placeholder="Dán link video (YouTube, Google Drive, v.v.) - mỗi link một dòng..."
                {...register("videoLinks")}
              />
              <p className="text-body-xs text-muted-foreground mt-1">
                Có thể dán nhiều link, mỗi link một dòng
              </p>
            </div>
            
            {/* Images Row - 2 columns: Customer Images (50%) | Employee Images (50%) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Customer Images - Hình ảnh từ khách hàng */}
              <div className="space-y-4">
                <div>
                  <Label className="text-body-sm">Hình ảnh từ khách hàng</Label>
                  <p className="text-body-xs text-muted-foreground mb-2">
                    Tải lên ảnh bằng chứng từ khách hàng (tối đa 10 ảnh, mỗi ảnh max 10MB)
                  </p>
                </div>
                
                {/* ⭐ Component 1: ExistingDocumentsViewer cho permanent files */}
                {customerPermanentFiles.length > 0 && (
                  <ExistingDocumentsViewer
                    files={customerPermanentFiles}
                    onMarkForDeletion={handleMarkCustomerForDeletion}
                    markedForDeletion={customerFilesToDelete}
                  />
                )}
                
                {/* ⭐ Component 2: NewDocumentsUpload cho staging files */}
                <NewDocumentsUpload
                  accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] }}
                  maxSize={10 * 1024 * 1024}
                  maxFiles={10}
                  value={customerStagingFiles}
                  onChange={setCustomerStagingFiles}
                  sessionId={customerSessionId ?? undefined}
                  onSessionChange={setCustomerSessionId}
                />
              </div>
              
              {/* Employee Images - Hình ảnh từ nhân viên */}
              <div className="space-y-4">
                <div>
                  <Label className="text-body-sm">Hình ảnh kiểm tra từ nhân viên</Label>
                  <p className="text-body-xs text-muted-foreground mb-2">
                    Nhân viên chụp ảnh xác nhận tình trạng sau khi kiểm tra (tối đa 10 ảnh, mỗi ảnh max 10MB)
                  </p>
                </div>
                
                {/* ⭐ Component 1: ExistingDocumentsViewer cho permanent files */}
                {employeePermanentFiles.length > 0 && (
                  <ExistingDocumentsViewer
                    files={employeePermanentFiles}
                    onMarkForDeletion={handleMarkEmployeeForDeletion}
                    markedForDeletion={employeeFilesToDelete}
                  />
                )}
                
                {/* ⭐ Component 2: NewDocumentsUpload cho staging files */}
                <NewDocumentsUpload
                  accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] }}
                  maxSize={10 * 1024 * 1024}
                  maxFiles={10}
                  value={employeeStagingFiles}
                  onChange={setEmployeeStagingFiles}
                  sessionId={employeeSessionId ?? undefined}
                  onSessionChange={setEmployeeSessionId}
                />
              </div>
              
            </div>
          </CardContent>
        </Card>

      </form>
      
      {/* Image Preview Dialog */}
      <ImagePreviewDialog
        images={previewState.image ? [previewState.image] : []}
        title={previewState.title}
        open={previewState.open}
        onOpenChange={(open) => setPreviewState(prev => ({ ...prev, open }))}
      />
    </div>
  );
}
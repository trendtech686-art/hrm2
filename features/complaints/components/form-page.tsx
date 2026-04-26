'use client'

import * as React from "react";
import { useRouter, useParams } from 'next/navigation';
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { asSystemId, asBusinessId, type BusinessId } from '@/lib/id-types';
import { generateSubEntityId, generateTempId } from '@/lib/id-utils';
import { formatDateForDisplay } from '@/lib/date-utils';

// Types & Store
import type { Complaint, ComplaintType } from "../types";
import { useComplaintMutations, useComplaint } from "../hooks/use-complaints";
import { useComplaintFinder } from "../hooks/use-all-complaints";
import type { StagingFile } from "@/lib/file-upload-api";
import { complaintNotifications } from "../notification-utils";

// Product image & type
import { useProductImage } from '@/features/products/components/product-image';
import { useAllProducts, useProductFinder } from '@/features/products/hooks/use-all-products';
import { useProductTypeFinder } from '@/features/settings/inventory/hooks/use-all-product-types';
import { useCustomerStats } from '@/features/customers/hooks/use-customer-stats';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Package, Eye, Loader2 } from 'lucide-react';

// Settings
import { useComplaintsSettings } from "@/features/settings/complaints/hooks/use-complaints-settings";

// UI Components
import { FormPageShell, mobileBleedCardClass } from "@/components/layout/page-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { VirtualizedCombobox, type ComboboxOption } from "@/components/ui/virtualized-combobox";
import { NewDocumentsUpload } from "@/components/ui/new-documents-upload";
import { ExistingDocumentsViewer } from "@/components/ui/existing-documents-viewer";
import { ImagePreviewDialog } from "@/components/ui/image-preview-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LazyImage } from "@/components/ui/lazy-image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Hooks & Context
import { usePageHeader } from "@/contexts/page-header-context";
import { searchOrders } from "@/features/orders/order-search-api";
import { fetchOrder } from "@/features/orders/api/orders-api";
import type { Order } from "@/lib/types/prisma-extended";
import { useAllSalesReturns } from "@/features/sales-returns/hooks/use-all-sales-returns";
import { useAllBranches } from "@/features/settings/branches/hooks/use-all-branches";
import { useAllEmployees } from "@/features/employees/hooks/use-all-employees";
import { useAllCustomers } from "@/features/customers/hooks/use-all-customers";
import { useNotificationStore } from "@/components/ui/notification-center";
import { FileUploadAPI } from "@/lib/file-upload-api";
import { useAuth } from "@/contexts/auth-context";
import { ROUTES, generatePath } from "@/lib/router";
import type { BreadcrumbItem } from "@/lib/breadcrumb-system";
import type { Product } from '@/features/products/types';

interface EmployeeImageFile {
  id?: string;
  url: string;
  uploadedAt?: string | Date;
  uploadedBy?: string;
}

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
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; // ✅ Match Prisma ComplaintPriority enum
  orderValue: number;
  images: string[];
}

// Product type fallback labels
const productTypeFallbackLabels: Record<string, string> = {
  physical: 'Hàng hóa',
  service: 'Dịch vụ', 
  digital: 'Sản phẩm số',
  combo: 'Combo'
};

// ProductThumbnailCell component for displaying product images - ✅ Match warranty UI
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    
    // ✅ Match warranty sizes: md = 12x12 (48px), sm = 10x9 (40x36)
    const sizeClasses = size === 'md' 
        ? 'w-12 h-12' 
        : 'w-10 h-9';
    const iconSize = size === 'md' ? 'h-5 w-5' : 'h-4 w-4';
    
    if (imageUrl) {
        return (
            <div
                className={`group/thumbnail relative ${sizeClasses} shrink-0 rounded-md overflow-hidden border border-muted ${onPreview ? 'cursor-pointer' : ''}`}
                onClick={() => onPreview?.(imageUrl, productName)}
            >
                <OptimizedImage 
                    src={imageUrl} 
                    alt={productName} 
                    className="w-full h-full object-cover transition-all group-hover/thumbnail:brightness-75" 
                    width={size === 'md' ? 48 : 40} 
                    height={size === 'md' ? 48 : 36} 
                />
                {onPreview && (
                    <div className="absolute inset-0 flex items-center justify-center md:opacity-0 md:group-hover/thumbnail:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4 text-white drop-shadow-md" />
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <div className={`${sizeClasses} shrink-0 bg-muted rounded-md flex items-center justify-center`}>
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
  
  const isEditing = !!systemId;
  const { create: createMutation, update: updateMutation } = useComplaintMutations({
    onCreateSuccess: (complaint) => {
      toast.success('Đã tạo khiếu nại mới');
      router.push(`/complaints/${complaint.systemId}`);
    },
    onUpdateSuccess: () => {
      toast.success('Đã cập nhật khiếu nại');
      if (systemId) router.push(`/complaints/${systemId}`);
    },
    onError: (err) => toast.error(err.message)
  });
  const { getComplaintById } = useComplaintFinder();
  const { data: complaintFromQuery } = useComplaint(isEditing ? systemId : undefined);
  // Server-side order search state
  const [orderSearchQuery, setOrderSearchQuery] = React.useState('');
  const [orderSearchResults, setOrderSearchResults] = React.useState<ComboboxOption[]>([]);
  const [isSearchingOrders, setIsSearchingOrders] = React.useState(false);
  const [isLoadingMoreOrders, setIsLoadingMoreOrders] = React.useState(false);
  const [orderSearchPage, setOrderSearchPage] = React.useState(1);
  const [hasMoreOrders, setHasMoreOrders] = React.useState(false);
  const [orderEntity, setOrderEntity] = React.useState<Order | null>(null);
  const { data: salesReturns } = useAllSalesReturns();
  const { data: _branches } = useAllBranches();
  const { data: employees } = useAllEmployees();
  const { data: customers = [] } = useAllCustomers();
  const { addNotification } = useNotificationStore();
  const { employee } = useAuth();
  
  // Product & ProductType for image/type display — fetch enabled to ensure images load
  useAllProducts();
  const { findById: findProductById } = useProductFinder();
  const { findById: findProductTypeById } = useProductTypeFinder();
  
  // Helper to get product type label
  const getProductTypeLabel = React.useCallback((product: Product | null | undefined) => {
    if (!product) return 'Hàng hóa';
    if (product.productTypeSystemId) {
      const productType = findProductTypeById(product.productTypeSystemId);
      if (productType?.name) return productType.name;
    }
    return (product.type && productTypeFallbackLabels[product.type]) || 'Hàng hóa';
  }, [findProductTypeById]);
  
  // ✅ Use direct API fetch (enriched data) as primary, fallback to list cache
  const complaint = complaintFromQuery || (isEditing && systemId ? getComplaintById(asSystemId(systemId)) : null);
  
  // Check if complaint has been verified (can only edit note)
  const isVerified = complaint?.verification !== 'pending-verification';
  const canOnlyEditNote = isEditing && isVerified;
  
  // Current user (from auth context)
  const currentUser = employee 
    ? { systemId: employee.systemId, name: employee.fullName }
    : { systemId: asSystemId('SYSTEM'), name: 'Guest User' };

  // ⭐ Load complaint types from Settings và map với enum
  const { data: complaintsSettings } = useComplaintsSettings();
  const complaintTypes = React.useMemo(() => {
    try {
      const types = complaintsSettings.complaintTypes;
      
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
            // Add unique id for deduplication
            uniqueKey: `${enumValue}-${t.name}`,
          };
        });
      
      // Deduplicate by value - keep first occurrence (highest priority by order)
      const seenValues = new Set<string>();
      const deduplicatedTypes = mappedTypes.filter(t => {
        if (seenValues.has(t.value)) {
          return false;
        }
        seenValues.add(t.value);
        return true;
      });
      
      if (deduplicatedTypes.length > 0) {
        return deduplicatedTypes;
      }
    } catch (e) {
      console.error('Failed to load complaint types:', e);
    }
    
    // Fallback to hardcoded types from complaintTypeLabels
    return [
      { value: 'wrong-product' as ComplaintType, label: 'Sai hàng', uniqueKey: 'wrong-product' },
      { value: 'missing-items' as ComplaintType, label: 'Thiếu hàng', uniqueKey: 'missing-items' },
      { value: 'wrong-packaging' as ComplaintType, label: 'Đóng gói sai quy cách', uniqueKey: 'wrong-packaging' },
      { value: 'warehouse-defect' as ComplaintType, label: 'Trả hàng lỗi do kho', uniqueKey: 'warehouse-defect' },
      { value: 'product-condition' as ComplaintType, label: 'Khách phàn nàn về tình trạng hàng', uniqueKey: 'product-condition' },
    ];
  }, [complaintsSettings.complaintTypes]);
  
  // State
  const [selectedOrder, setSelectedOrder] = React.useState<ComboboxOption | null>(null);
  const [packagingEmployee, setPackagingEmployee] = React.useState<string>("");
  const [packagingEmployeeName, setPackagingEmployeeName] = React.useState<string>("");
  const [isLoadingComplaint, setIsLoadingComplaint] = React.useState(false); // Flag để tránh conflict
  
  // ⭐ NEW: Quản lý sản phẩm bị ảnh hưởng
  // ✅ Fix: Thêm lineItemIndex để xử lý trường hợp trùng productSystemId (cùng SP nhiều dòng)
  const [affectedProducts, setAffectedProducts] = React.useState<Array<{
    lineItemIndex: number; // ⭐ Index duy nhất trong order lineItems
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
      priority: "MEDIUM", // ✅ Match Prisma enum
      orderValue: 0,
      images: [],
    },
  });
  
  const { register, handleSubmit, watch, setValue, formState: { errors: _errors } } = form;
  const _complaintId = watch("id");
  const _orderValue = watch("orderValue");
  
  // Customer stats for info card
  const customerSystemId = watch('customerSystemId');
  const { data: customerStats, isLoading: isLoadingStats } = useCustomerStats(customerSystemId || undefined);
  
  // Server-side order search
  const ORDER_PAGE_SIZE = 50;
  React.useEffect(() => {
    const performSearch = async () => {
      setIsSearchingOrders(true);
      setOrderSearchPage(1);
      try {
        const results = await searchOrders({ query: orderSearchQuery, limit: ORDER_PAGE_SIZE });
        const mapped = results.map(r => ({ value: r.value, label: r.label, subtitle: r.subtitle }));
        setOrderSearchResults(mapped);
        setHasMoreOrders(mapped.length >= ORDER_PAGE_SIZE);
      } catch {
        setOrderSearchResults([]);
        setHasMoreOrders(false);
      } finally {
        setIsSearchingOrders(false);
      }
    };
    performSearch();
  }, [orderSearchQuery]);

  // Load more orders (infinite scroll)
  const handleLoadMoreOrders = React.useCallback(async () => {
    if (isLoadingMoreOrders || !hasMoreOrders) return;
    setIsLoadingMoreOrders(true);
    const nextPage = orderSearchPage + 1;
    try {
      const results = await searchOrders({ query: orderSearchQuery, limit: ORDER_PAGE_SIZE, page: nextPage });
      const mapped = results.map(r => ({ value: r.value, label: r.label, subtitle: r.subtitle }));
      setOrderSearchResults(prev => [...prev, ...mapped]);
      setOrderSearchPage(nextPage);
      setHasMoreOrders(mapped.length >= ORDER_PAGE_SIZE);
    } catch {
      setHasMoreOrders(false);
    } finally {
      setIsLoadingMoreOrders(false);
    }
  }, [isLoadingMoreOrders, hasMoreOrders, orderSearchPage, orderSearchQuery]);
  
  // Fetch full order detail when user selects an order
  React.useEffect(() => {
    if (!selectedOrder) {
      setOrderEntity(null);
      return;
    }
    let cancelled = false;
    fetchOrder(selectedOrder.value).then(order => {
      if (!cancelled) setOrderEntity(order);
    }).catch(() => {
      if (!cancelled) setOrderEntity(null);
    });
    return () => { cancelled = true; };
  }, [selectedOrder?.value]);
  
  // Auto-fill khi chọn order (chỉ chạy khi user chọn thủ công, không chạy khi load complaint)
  React.useEffect(() => {
    if (orderEntity && !isLoadingComplaint) {
      setValue("orderSystemId", orderEntity.systemId);
      setValue("branchSystemId", orderEntity.branchSystemId);
      setValue("branchName", orderEntity.branchName);
      setValue("customerSystemId", orderEntity.customerSystemId);
      setValue("customerName", orderEntity.customerName);
      
      const customer = customers.find(c => c.systemId === orderEntity.customerSystemId);
      setValue("customerPhone", customer?.phone || "");
      
      setValue("orderValue", orderEntity.grandTotal || 0);
      
      if (orderEntity.packagings && orderEntity.packagings.length > 0) {
        const packaging = orderEntity.packagings[0];
        const empId = packaging.assignedEmployeeId || packaging.confirmingEmployeeId || packaging.requestingEmployeeId;
        const empName = packaging.assignedEmployeeName || packaging.confirmingEmployeeName || packaging.requestingEmployeeName;
        
        if (empId && empName) {
          setPackagingEmployee(empId);
          setPackagingEmployeeName(empName);
        }
      }
    }
  }, [orderEntity, customers, setValue, isLoadingComplaint]);
  
  // Track if complaint data has been initialized
  const hasInitializedRef = React.useRef(false);
  const hasSetOrderRef = React.useRef(false);
  
  // Load complaint data for editing - only once
  React.useEffect(() => {
    if (complaint && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
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
      
      // Set customer images (hình từ khách hàng) - filter by type 'initial'
      if (complaint.images && complaint.images.length > 0) {
        const customerImages = complaint.images.filter(img => img.type === 'initial');
        
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
        }
      }
      
      // Set employee images (hình từ nhân viên) - from employeeImages field
      if ((complaint as { employeeImages?: EmployeeImageFile[] }).employeeImages && (complaint as { employeeImages?: EmployeeImageFile[] }).employeeImages!.length > 0) {
        
        const stagingFiles: StagingFile[] = (complaint as { employeeImages?: EmployeeImageFile[] }).employeeImages!.map((img: EmployeeImageFile, idx: number) => ({
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
  }, [complaint, setValue, employees]);
  
  // ⭐ Separate effect for setting order and affected products when editing
  React.useEffect(() => {
    if (!complaint || hasSetOrderRef.current) return;
    
    const orderIdToFind = complaint.orderSystemId || (complaint as unknown as { orderId?: string }).orderId || complaint.orderCode;
    
    if (!orderIdToFind) {
      hasSetOrderRef.current = true;
      return;
    }
    
    let cancelled = false;
    fetchOrder(orderIdToFind).then(order => {
      if (cancelled || hasSetOrderRef.current) return;
      hasSetOrderRef.current = true;
      
      setOrderEntity(order);
      setSelectedOrder({
        value: order.systemId,
        label: `${order.id} - ${order.customerName}`,
        subtitle: `${formatDateForDisplay(order.orderDate)} • ${order.grandTotal?.toLocaleString('vi-VN')} đ`,
      });
        
      if (complaint.affectedProducts && complaint.affectedProducts.length > 0) {
        setAffectedProducts(complaint.affectedProducts.map(p => {
          const orderItemIndex = order.lineItems?.findIndex(item => item.productSystemId === p.productSystemId) ?? -1;
          const orderItem = orderItemIndex >= 0 ? order.lineItems?.[orderItemIndex] : undefined;
          return {
            ...p,
            lineItemIndex: orderItemIndex,
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
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [complaint]);
  
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
  
  // Page header - use primitive value to avoid infinite loops
  const hasSelectedOrder = !!selectedOrder;
  
  const selectedOrderEntity = orderEntity;

  const headerActions = React.useMemo(() => ([
    <Button
      key="cancel"
      variant="outline"
      size="sm"
      onClick={() => router.push(ROUTES.INTERNAL.COMPLAINTS)}
      disabled={isSubmitting}
    >
      Hủy
    </Button>,
    <Button
      key="submit"
      size="sm"
      onClick={() => {
        const form = document.querySelector('form[data-complaint-form]') as HTMLFormElement;
        if (form) form.requestSubmit();
      }}
      disabled={isSubmitting || !hasSelectedOrder}
    >
      {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...</> : isEditing ? "Cập nhật" : "Tạo khiếu nại"}
    </Button>,
  ]), [isEditing, isSubmitting, router, hasSelectedOrder]);

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
        targetComplaintId = generateTempId('TEMP'); // ⭐ Tạo 1 lần duy nhất
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
      
      
      // Confirm staging files nếu có NEW files với sessionId (như WARRANTY pattern)
      // ⚠️ FIX: Chỉ cần check customerSessionId và customerStagingFiles.length > 0
      // Không cần check .some(img => img.sessionId) vì tất cả files đều có chung sessionId
      if (customerSessionId && customerStagingFiles.length > 0) {
        
        const commitToastId = toast.loading("Đang lưu hình ảnh từ khách hàng...");
        try {
          // ✅ Dùng API chuẩn giống WARRANTY
          const result = await FileUploadAPI.confirmStagingFiles(
            (customerSessionId as string), 
            targetComplaintId,
            'complaint',        // entityType
            'customer-images',  // subCategory
            {
              orderSystemId: data.orderSystemId ?? "", // ⭐ Dùng systemId
              customerName: data.customerName ?? "",
            }
          );
          
          
          const newUrls = result
            .filter((file) => file && typeof file.url === 'string')
            .map((file) => file.url);
          
          
          // Combine cleaned permanent + newly confirmed
          finalCustomerImageUrls = [
            ...cleanedCustomerPermanent.map(f => f.url),
            ...newUrls
          ];
          
          
          toast.success(`Đã lưu ${newUrls.length} hình ảnh mới`, { id: commitToastId });
          
          // Cleanup staging files sau khi confirm thành công
          try {
            await FileUploadAPI.deleteStagingSession(customerSessionId);
          } catch (_cleanupError) {
            // Ignore cleanup errors
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
      
      
      // Confirm staging files nếu có NEW files với sessionId (như WARRANTY pattern)
      // ⚠️ FIX: Chỉ cần check employeeSessionId và employeeStagingFiles.length > 0
      if (employeeSessionId && employeeStagingFiles.length > 0) {
        
        const commitToastId = toast.loading("Đang lưu hình ảnh từ nhân viên...");
        try {
          // ✅ Dùng API chuẩn giống WARRANTY
          const result = await FileUploadAPI.confirmStagingFiles(
            (employeeSessionId as string), 
            targetComplaintId,
            'complaint',        // entityType
            'employee-images',  // subCategory
            {
              orderSystemId: data.orderSystemId ?? "", // ⭐ Dùng systemId
              customerName: data.customerName ?? "",
              employeeName: packagingEmployeeName,
            }
          );
          
          
          const newUrls = result
            .filter((file: { url?: string }) => file && file.url)
            .map((file: { url: string }) => file.url);
          
          
          // Combine cleaned permanent + newly confirmed
          finalEmployeeImageUrls = [
            ...cleanedEmployeePermanent.map(f => f.url),
            ...newUrls
          ];
          
          
          toast.success(`Đã lưu ${newUrls.length} hình ảnh nhân viên`, { id: commitToastId });
          
          // Cleanup staging files sau khi confirm thành công
          try {
            await FileUploadAPI.deleteStagingSession(employeeSessionId);
          } catch (_cleanupError) {
            // Ignore cleanup errors
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
        id: data.id ? asBusinessId(data.id) : undefined,
        orderSystemId: data.orderSystemId, // ⭐ Lưu systemId
        orderCode: selectedOrder ? orderEntity?.id : undefined, // ⭐ Optional display code
        orderValue: data.orderValue,
        branchSystemId: data.branchSystemId, // ⭐ Lưu branchSystemId từ order
        branchName: data.branchName, // ⭐ Lưu branchName từ order
        customerSystemId: data.customerSystemId, // ⭐ Lưu systemId
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        type: data.type,
        description: data.description || undefined, // Optional — no min length required
        priority: data.priority,
        // CUSTOMER IMAGES - Lưu vào complaint.images với type 'initial'
        images: finalCustomerImageUrls
          .filter(url => url && url.trim() !== '') // ⭐ Filter empty URLs
          .map((url, _idx) => ({
            id: asSystemId(generateSubEntityId('IMG')),
            url,
            uploadedBy: currentUser.systemId,
            uploadedAt: new Date(),
            type: "initial" as const, // ✅ Customer images type
          })),
        // EMPLOYEE IMAGES - Lưu vào field riêng employeeImages
        employeeImages: finalEmployeeImageUrls
          .filter(url => url && url.trim() !== '') // ⭐ Filter empty URLs
          .map((url, _idx) => ({
            id: asSystemId(generateSubEntityId('IMG')),
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
        updateMutation.mutate({ 
          systemId: asSystemId(systemId), 
          data: complaintData as unknown as Partial<Complaint> 
        });
      } else {
        createMutation.mutate(complaintData as unknown as Omit<Complaint, "systemId" | "createdAt" | "updatedAt" | "timeline" | "id"> & { id?: BusinessId }, {
          onSuccess: (newComplaint) => {
            // Lấy orderCode để hiển thị
            const orderCode = orderEntity?.id || data.orderSystemId;
            
            // Gửi thông báo cho nhân viên đóng gói
            addNotification({
              type: "system",
              title: "Khiếu nại mới cần xử lý",
              message: `Bạn được giao xử lý khiếu nại cho đơn hàng ${orderCode}. Độ ưu tiên: ${data.priority}`,
              link: `/complaints/${newComplaint.systemId}`,
              recipientId: packagingEmployee,
              senderId: currentUser.systemId,
              metadata: {
                complaintId: newComplaint.systemId,
                orderSystemId: data.orderSystemId,
                priority: data.priority,
              }
            });
            
            complaintNotifications.onCreate("Đã tạo khiếu nại mới và gửi thông báo cho nhân viên");
          }
        });
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error("Có lỗi xảy ra khi lưu khiếu nại");
    } finally {
      setIsSubmitting(false);
    }
  });
  
  return (
    <FormPageShell className="w-full h-full">
      <form onSubmit={onSubmit} className="space-y-3 md:space-y-6 pt-2 md:pt-0" data-complaint-form>
        {/* Main Form Card */}
        <Card className={mobileBleedCardClass}>
          <CardHeader>
            <CardTitle>
              {isEditing ? "Chỉnh sửa khiếu nại" : "Tạo khiếu nại mới"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {canOnlyEditNote && (
              <div className="bg-muted/50 border border-muted-foreground/20 rounded-md p-3 text-sm text-muted-foreground">
                ℹ️ Khiếu nại đã được xác minh. Chỉ có thể chỉnh sửa ghi chú.
              </div>
            )}
            {/* Mã phiếu khiếu nại (optional) */}
            <div>
              <Label htmlFor="id" className="text-sm">Mã phiếu khiếu nại (tùy chọn)</Label>
              <Input
                id="id"
                placeholder="Để trống để tự động tạo mã"
                disabled={canOnlyEditNote}
                {...register("id")}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Nếu không điền, hệ thống sẽ tự động tạo mã
              </p>
            </div>
            
            {/* Chọn đơn hàng */}
            <div>
              <Label className="text-sm">Chọn đơn hàng *</Label>
              <VirtualizedCombobox
                value={selectedOrder}
                onChange={setSelectedOrder}
                options={orderSearchResults}
                onSearchChange={setOrderSearchQuery}
                isLoading={isSearchingOrders}
                onLoadMore={handleLoadMoreOrders}
                hasMore={hasMoreOrders}
                isLoadingMore={isLoadingMoreOrders}
                placeholder="Tìm và chọn đơn hàng..."
                searchPlaceholder="Tìm theo mã đơn, tên khách..."
                disabled={canOnlyEditNote}
              />
              {!selectedOrder && (
                <p className="text-xs text-destructive mt-1">Vui lòng chọn đơn hàng</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card: Thông tin đơn hàng */}
        {selectedOrder && orderEntity && (() => {
          const order = orderEntity;
          return (
            <Card className={mobileBleedCardClass}>
              <CardHeader>
                <CardTitle>Thông tin đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
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
                    <span className="font-medium text-right">{typeof order.shippingAddress === 'string' ? order.shippingAddress : (order.shippingAddress?.formattedAddress || "Chưa có")}</span>
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
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Nhân viên xử lý:</span>
                    {packagingEmployeeName ? (
                      <span className="font-medium">{packagingEmployeeName}</span>
                    ) : (
                      <Select
                        value={packagingEmployee || undefined}
                        onValueChange={(val) => {
                          const emp = employees.find(e => e.systemId === val);
                          if (emp) {
                            setPackagingEmployee(emp.systemId);
                            setPackagingEmployeeName(emp.fullName);
                          }
                        }}
                      >
                        <SelectTrigger className="h-7 w-48 text-xs">
                          <SelectValue placeholder="Chọn nhân viên..." />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map(emp => (
                            <SelectItem key={emp.systemId} value={emp.systemId}>
                              {emp.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })()}

        {/* Card: Thông tin khách hàng — style giống order detail page */}
        {selectedOrder && customerSystemId && (
          <Card className={mobileBleedCardClass}>
            <CardHeader>
              <CardTitle>Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <p className="text-sm text-muted-foreground">Đang tải...</p>
              ) : (() => {
                const customer = customerStats.customer;
                const formatMoney = (v?: number) => (v ?? 0).toLocaleString('vi-VN');
                return (
                  <div className="space-y-3">
                    {/* Tên + SĐT */}
                    <div>
                      <p className="font-semibold text-lg">{customer?.name || watch('customerName')}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {customer?.phone || watch('customerPhone') || 'Chưa có SĐT'}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="text-sm space-y-1.5 border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nhóm KH:</span>
                        <span className="font-medium">{customerStats.customerGroupName || '---'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">NV phụ trách:</span>
                        <span className="font-medium">{customer?.accountManagerName || '---'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Công nợ/Hạn mức:</span>
                        <div className="text-right">
                          <span className={`font-medium ${customerStats.financial.currentDebt > 0 ? 'text-red-500' : ''}`}>
                            {formatMoney(customerStats.financial.currentDebt)}
                          </span>
                          <span className="text-muted-foreground mx-1">/</span>
                          <span className="font-medium">{formatMoney(customer?.maxDebt)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tổng chi tiêu:</span>
                        <span className="font-medium">{formatMoney(customerStats.financial.totalSpent)}</span>
                      </div>

                      <div className="border-t border-dashed my-2" />

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tổng số đơn đặt:</span>
                        <span className="font-medium">{customerStats.orders.total}</span>
                      </div>
                      <p className="text-xs text-muted-foreground text-right -mt-1">
                        {customerStats.orders.pending} đặt hàng, {customerStats.orders.inProgress} đang giao dịch, {customerStats.orders.completed} hoàn thành, {customerStats.orders.cancelled} đã hủy
                      </p>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bảo hành (đã trả/tổng):</span>
                        <span className="font-medium">
                          {customerStats.warranties.total > 0
                            ? `${customerStats.warranties.total - customerStats.warranties.active}/${customerStats.warranties.total}`
                            : '0'}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Khiếu nại (đã xử lý/tổng):</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {customerStats.complaints.total > 0
                              ? `${customerStats.complaints.total - customerStats.complaints.active}/${customerStats.complaints.total}`
                              : '0'}
                          </span>
                          {customerStats.complaints.active > 0 && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-destructive/15 text-destructive font-medium">
                              {customerStats.complaints.active} chưa xử lý
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lần đặt đơn gần nhất:</span>
                        <span className="font-medium">
                          {customerStats.orders.lastOrderDate ? formatDateForDisplay(customerStats.orders.lastOrderDate) : '---'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* ⭐ NEW: Card Sản phẩm bị ảnh hưởng */}
        {selectedOrder && orderEntity && (() => {
          const order = orderEntity;
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
          
          // Check all logic
          const isAllSelected = availableProducts.length > 0 && affectedProducts.length === availableProducts.length;
          const isSomeSelected = affectedProducts.length > 0 && affectedProducts.length < availableProducts.length;
          
          const handleSelectAll = (checked: boolean) => {
            if (checked) {
              // Select all products
              setAffectedProducts(availableProducts.map((item, idx) => {
                const returnedQty = returnedQuantities[item.productSystemId] || 0;
                const remainingQty = item.quantity - returnedQty;
                return {
                  lineItemIndex: idx,
                  productSystemId: item.productSystemId,
                  productId: item.productId,
                  productName: item.productName,
                  unitPrice: item.unitPrice || 0,
                  quantityOrdered: remainingQty,
                  quantityReceived: item.quantity,
                  quantityMissing: 0,
                  quantityDefective: 0,
                  quantityExcess: 0,
                  issueType: 'missing' as const,
                  note: '',
                  resolutionType: 'ignore' as const,
                };
              }));
            } else {
              // Deselect all
              setAffectedProducts([]);
            }
          };
          
          return (
            <Card className={mobileBleedCardClass}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Sản phẩm bị ảnh hưởng</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Chọn sản phẩm và nhập số lượng thừa/thiếu/hỏng
                </p>
              </CardHeader>
              <CardContent>
                {availableProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">Tất cả sản phẩm đã được trả lại.</p>
                    <p className="text-xs mt-1">Không thể tạo khiếu nại.</p>
                  </div>
                ) : (
                <>
                  {/* ===== DESKTOP: Table view ===== */}
                  <div className="hidden md:block border rounded-lg overflow-x-auto">
                    <Table className="text-xs">
                      <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableHead className="w-10">
                            <Checkbox
                              checked={isAllSelected}
                              ref={(el) => {
                                if (el) (el as unknown as HTMLButtonElement).dataset.state = isSomeSelected ? 'indeterminate' : isAllSelected ? 'checked' : 'unchecked';
                              }}
                              disabled={canOnlyEditNote}
                              onCheckedChange={handleSelectAll}
                              aria-label="Chọn tất cả"
                            />
                          </TableHead>
                          <TableHead className="min-w-50">Sản phẩm</TableHead>
                          <TableHead className="w-24 text-right">Đơn giá</TableHead>
                          <TableHead className="w-16 text-center">SL</TableHead>
                          <TableHead className="w-24">Loại KN</TableHead>
                          <TableHead className="w-24 text-center">Thừa</TableHead>
                          <TableHead className="w-24 text-center">Thiếu</TableHead>
                          <TableHead className="w-24 text-center">Hỏng</TableHead>
                          <TableHead className="w-24 text-right">Tổng tiền</TableHead>
                          <TableHead className="min-w-30">Ghi chú</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                      {availableProducts.map((item, idx) => {
                        const returnedQty = returnedQuantities[item.productSystemId] || 0;
                        const remainingQty = item.quantity - returnedQty;
                        const affected = affectedProducts.find(p => p.lineItemIndex === idx);
                        const isSelected = !!affected;
                        
                        const totalAffectedAmount = affected 
                          ? (affected.quantityMissing + affected.quantityDefective + affected.quantityExcess) * item.unitPrice
                          : 0;
                        
                        const product = findProductById(item.productSystemId);
                        const productTypeLabel = getProductTypeLabel(product);
                        const isCombo = !!(product?.type === 'combo' && product.comboItems?.length);
                        const uniqueKey = `${item.productSystemId}-${idx}`;
                        
                        // ✅ Get product image URL like warranty module
                        const productImageUrl = product?.thumbnailImage || product?.galleryImages?.[0] || product?.images?.[0];
                        
                        return (
                          <TableRow key={uniqueKey} className="hover:bg-muted/30">
                            <TableCell className="align-top pt-3">
                              <Checkbox
                                id={`checkbox-${uniqueKey}`}
                                checked={isSelected}
                                disabled={canOnlyEditNote}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setAffectedProducts(prev => [...prev, {
                                      lineItemIndex: idx, // ⭐ Lưu index unique
                                      productSystemId: item.productSystemId,
                                      productId: item.productId,
                                      productName: item.productName,
                                      unitPrice: item.unitPrice || 0,
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
                                      prev.filter(p => p.lineItemIndex !== idx)
                                    );
                                  }
                                }}
                              />
                            </TableCell>
                            {/* ✅ Product cell with image + name + SKU like warranty */}
                            <TableCell className="align-top pt-2">
                              <div className="flex items-start gap-2">
                                {/* Ảnh sản phẩm - giống warranty */}
                                {productImageUrl ? (
                                  <div
                                    className="group/img relative w-10 h-10 shrink-0 rounded-md overflow-hidden border border-muted cursor-pointer"
                                    onClick={() => handlePreview(productImageUrl, item.productName)}
                                  >
                                    <LazyImage
                                      src={productImageUrl}
                                      alt={item.productName}
                                      className="w-full h-full object-cover transition-all group-hover/img:brightness-75"
                                      loading="lazy"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center md:opacity-0 md:group-hover/img:opacity-100 transition-opacity">
                                      <Eye className="w-3 h-3 text-white drop-shadow-md" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 shrink-0 bg-muted rounded-md flex items-center justify-center">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                )}
                                {/* Thông tin sản phẩm */}
                                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-medium text-foreground line-clamp-2">
                                      {item.productName}
                                    </span>
                                    {isCombo && (
                                      <span className="text-xs px-1 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold shrink-0">
                                        COMBO
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <span className="text-primary font-medium">{item.productId}</span>
                                    <span className="mx-0.5">•</span>
                                    <span>{productTypeLabel}</span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="align-top pt-3 text-right text-xs">
                              {(item.unitPrice || 0).toLocaleString('vi-VN')}đ
                            </TableCell>
                            <TableCell className="align-top pt-3 text-center text-xs">
                              {returnedQty > 0 ? (
                                <span title={`Đặt ${item.quantity}, đã trả ${returnedQty}`}>
                                  {remainingQty} <span className="text-muted-foreground">/{item.quantity}</span>
                                </span>
                              ) : (
                                item.quantity
                              )}
                            </TableCell>
                            <TableCell className="align-top pt-2">
                              <Select
                                disabled={!isSelected || canOnlyEditNote}
                                value={affected?.issueType || 'missing'}
                                onValueChange={(value: 'excess' | 'missing' | 'defective' | 'other') => {
                                  setAffectedProducts(prev => prev.map(p => {
                                    if (p.lineItemIndex === idx) {
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
                                <SelectTrigger className="h-7 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="excess">Thừa</SelectItem>
                                  <SelectItem value="missing">Thiếu</SelectItem>
                                  <SelectItem value="defective">Hỏng</SelectItem>
                                  <SelectItem value="other">Khác</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="align-top pt-2">
                              <Input
                                type="number"
                                min={0}
                                disabled={!isSelected || (affected?.issueType !== 'excess' && affected?.issueType !== 'other') || canOnlyEditNote}
                                className="h-7 w-full text-center text-xs"
                                value={affected?.quantityExcess ?? 0}
                                onChange={(e) => {
                                  const excess = Math.max(0, Number(e.target.value));
                                  setAffectedProducts(prev => prev.map(p => 
                                    p.lineItemIndex === idx 
                                      ? { ...p, quantityExcess: excess }
                                      : p
                                  ));
                                }}
                              />
                            </TableCell>
                            <TableCell className="align-top pt-2">
                              <Input
                                type="number"
                                min={0}
                                max={remainingQty}
                                disabled={!isSelected || (affected?.issueType !== 'missing' && affected?.issueType !== 'other') || canOnlyEditNote}
                                className="h-7 w-full text-center text-xs"
                                value={affected?.quantityMissing ?? 0}
                                onChange={(e) => {
                                  const missing = Math.min(Math.max(0, Number(e.target.value)), remainingQty);
                                  setAffectedProducts(prev => prev.map(p => 
                                    p.lineItemIndex === idx 
                                      ? { ...p, quantityMissing: missing }
                                      : p
                                  ));
                                }}
                              />
                            </TableCell>
                            <TableCell className="align-top pt-2">
                              <Input
                                type="number"
                                min={0}
                                max={remainingQty}
                                disabled={!isSelected || (affected?.issueType !== 'defective' && affected?.issueType !== 'other') || canOnlyEditNote}
                                className="h-7 w-full text-center text-xs"
                                value={affected?.quantityDefective ?? 0}
                                onChange={(e) => {
                                  const defective = Math.min(Math.max(0, Number(e.target.value)), remainingQty);
                                  setAffectedProducts(prev => prev.map(p => 
                                    p.lineItemIndex === idx 
                                      ? { ...p, quantityDefective: defective }
                                      : p
                                  ));
                                }}
                              />
                            </TableCell>
                            <TableCell className="align-top pt-3 text-right">
                              <span className={`font-semibold text-xs ${totalAffectedAmount > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                {totalAffectedAmount.toLocaleString('vi-VN')}đ
                              </span>
                            </TableCell>
                            <TableCell className="align-top pt-2">
                              <Input
                                type="text"
                                disabled={!isSelected || canOnlyEditNote}
                                placeholder="Ghi chú..."
                                className="h-7 text-xs"
                                value={affected?.note || ''}
                                onChange={(e) => {
                                  setAffectedProducts(prev => prev.map(p => 
                                    p.lineItemIndex === idx 
                                      ? { ...p, note: e.target.value }
                                      : p
                                  ));
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  </div>

                  {/* ===== MOBILE: Card stack view ===== */}
                  <div className="md:hidden space-y-3">
                    {availableProducts.map((item, idx) => {
                      const returnedQty = returnedQuantities[item.productSystemId] || 0;
                      const remainingQty = item.quantity - returnedQty;
                      const affected = affectedProducts.find(p => p.lineItemIndex === idx);
                      const isSelected = !!affected;
                      const product = findProductById(item.productSystemId);
                      const productImageUrl = product?.thumbnailImage || product?.galleryImages?.[0] || product?.images?.[0];

                      return (
                        <div
                          key={`mobile-${item.productSystemId}-${idx}`}
                          className="border rounded-lg p-3 bg-card"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <Checkbox
                              checked={isSelected}
                              disabled={canOnlyEditNote}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setAffectedProducts(prev => [...prev, {
                                    lineItemIndex: idx,
                                    productSystemId: item.productSystemId,
                                    productId: item.productId,
                                    productName: item.productName,
                                    unitPrice: item.unitPrice || 0,
                                    quantityOrdered: remainingQty,
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
                                    prev.filter(p => p.lineItemIndex !== idx)
                                  );
                                }
                              }}
                            />
                            {productImageUrl && (
                              <img
                                src={productImageUrl}
                                alt={item.productName}
                                className="w-12 h-12 rounded-md object-cover border"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium line-clamp-2">{item.productName}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.productId} • {(item.unitPrice || 0).toLocaleString('vi-VN')}đ • SL: {remainingQty}
                              </p>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="space-y-2 pl-8">
                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <label className="text-xs text-muted-foreground">Loại KN</label>
                                  <Select
                                    value={affected?.issueType || 'missing'}
                                    onValueChange={(value: 'excess' | 'missing' | 'defective' | 'other') => {
                                      setAffectedProducts(prev => prev.map(p => {
                                        if (p.lineItemIndex === idx) {
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
                                    <SelectTrigger className="h-9 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="excess">Thừa</SelectItem>
                                      <SelectItem value="missing">Thiếu</SelectItem>
                                      <SelectItem value="defective">Hỏng</SelectItem>
                                      <SelectItem value="other">Khác</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                {affected?.issueType === 'missing' || affected?.issueType === 'defective' ? (
                                  <div>
                                    <label className="text-xs text-muted-foreground">
                                      {affected.issueType === 'missing' ? 'Thiếu' : 'Hỏng'}
                                    </label>
                                    <Input
                                      type="number"
                                      min={0}
                                      max={remainingQty}
                                      value={affected.issueType === 'missing' ? (affected?.quantityMissing ?? 0) : (affected?.quantityDefective ?? 0)}
                                      onChange={(e) => {
                                        const val = Math.min(Math.max(0, Number(e.target.value)), remainingQty);
                                        setAffectedProducts(prev => prev.map(p =>
                                          p.lineItemIndex === idx
                                            ? {
                                                ...p,
                                                [affected.issueType === 'missing' ? 'quantityMissing' : 'quantityDefective']: val,
                                              }
                                            : p
                                        ));
                                      }}
                                      className="h-9 text-center"
                                    />
                                  </div>
                                ) : affected?.issueType === 'excess' ? (
                                  <div>
                                    <label className="text-xs text-muted-foreground">Thừa</label>
                                    <Input
                                      type="number"
                                      min={0}
                                      value={affected?.quantityExcess ?? 0}
                                      onChange={(e) => {
                                        const val = Math.max(0, Number(e.target.value));
                                        setAffectedProducts(prev => prev.map(p =>
                                          p.lineItemIndex === idx
                                            ? { ...p, quantityExcess: val }
                                            : p
                                        ));
                                      }}
                                      className="h-9 text-center"
                                    />
                                  </div>
                                ) : (
                                  <div />
                                )}
                              </div>
                              <Input
                                type="text"
                                placeholder="Ghi chú..."
                                value={affected?.note || ''}
                                onChange={(e) => {
                                  setAffectedProducts(prev => prev.map(p =>
                                    p.lineItemIndex === idx
                                      ? { ...p, note: e.target.value }
                                      : p
                                  ));
                                }}
                                className="h-9 text-sm"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
                )}
              </CardContent>
            </Card>
          );
        })()}

        {/* Card: Tổng kết sản phẩm */}
        {affectedProducts.length > 0 && (
          <Card className={mobileBleedCardClass}>
            <CardHeader>
              <CardTitle>Tổng kết sản phẩm bị ảnh hưởng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {/* Thừa */}
                {(() => {
                  const excessItems = affectedProducts.filter(p => p.issueType === 'excess' && (p.quantityExcess || 0) > 0);
                  const totalExcessQty = excessItems.reduce((sum, p) => sum + (p.quantityExcess || 0), 0);
                  const totalExcessAmount = excessItems.reduce((sum, p) => {
                    const qty = p.quantityExcess || 0;
                    const price = p.unitPrice || 0;
                    return sum + (qty * price);
                  }, 0);
                  
                  if (totalExcessQty === 0) return null;
                  
                  return (
                    <div className="space-y-2 p-4 rounded-xl border border-border/50 bg-card">
                      <p className="text-xs font-medium text-muted-foreground uppercase">Thừa</p>
                      <p className="text-h3 font-bold tracking-tight">{totalExcessQty}</p>
                      <p className="text-sm font-medium text-foreground">
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
                    return sum + (qty * price);
                  }, 0);
                  
                  if (totalMissingQty === 0) return null;
                  
                  return (
                    <div className="space-y-2 p-4 rounded-xl border border-border/50 bg-card">
                      <p className="text-xs font-medium text-muted-foreground uppercase">Thiếu</p>
                      <p className="text-h3 font-bold tracking-tight">{totalMissingQty}</p>
                      <p className="text-sm font-medium text-foreground">
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
                    return sum + (qty * price);
                  }, 0);
                  
                  if (totalDefectiveQty === 0) return null;
                  
                  return (
                    <div className="space-y-2 p-4 rounded-xl border border-border/50 bg-card">
                      <p className="text-xs font-medium text-muted-foreground uppercase">Hỏng</p>
                      <p className="text-h3 font-bold tracking-tight">{totalDefectiveQty}</p>
                      <p className="text-sm font-medium text-foreground">
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
                    <div className="space-y-2 p-4 rounded-xl border border-border/50 bg-card">
                      <p className="text-xs font-medium text-muted-foreground uppercase">Khác</p>
                      <p className="text-h3 font-bold tracking-tight">{otherItems.length}</p>
                      <p className="text-sm font-medium text-foreground">
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
        <Card className={mobileBleedCardClass}>
          <CardHeader>
            <CardTitle>Thông tin khiếu nại</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Type + Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type" className="text-sm">Loại khiếu nại *</Label>
                <Select
                  value={watch("type")}
                  onValueChange={(value) => setValue("type", value as ComplaintType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại khiếu nại" />
                  </SelectTrigger>
                  <SelectContent>
                    {complaintTypes.map((type) => (
                      <SelectItem key={type.uniqueKey} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {complaintTypes.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Chưa có loại khiếu nại nào. Vui lòng thêm trong Cài đặt.
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="priority" className="text-sm">Mức độ ưu tiên *</Label>
                <Select
                  value={watch("priority")}
                  onValueChange={(value) => setValue("priority", value as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Thấp</SelectItem>
                    <SelectItem value="MEDIUM">Trung bình</SelectItem>
                    <SelectItem value="HIGH">Cao</SelectItem>
                    <SelectItem value="CRITICAL">Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Images Row - Mobile: stacked, Desktop: 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              
              {/* Customer Images - Hình ảnh từ khách hàng */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">Hình ảnh từ khách hàng</Label>
                  <p className="text-xs text-muted-foreground mb-2">
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
                  <Label className="text-sm">Hình ảnh kiểm tra từ nhân viên</Label>
                  <p className="text-xs text-muted-foreground mb-2">
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
    </FormPageShell>
  );
}
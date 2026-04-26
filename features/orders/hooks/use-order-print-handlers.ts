/**
 * Hook DUY NHẤT cho TẤT CẢ print handlers của module Orders
 * Bao gồm: in đơn hàng, phiếu nhặt, phiếu kiểm, đóng gói, tem phụ,
 * phiếu chi (payment), phiếu thu (receipt), in hàng loạt.
 * Dùng chung cho: page.tsx (danh sách), order-detail-page.tsx (chi tiết), order-print-button.tsx
 */
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Order, Branch } from '@/lib/types/prisma-extended';
import type { TemplateType, PaperSize } from '@/features/settings/printer/types';
import type { PrintOptions } from '@/lib/use-print';
import { usePrint } from '@/lib/use-print';
import { getSalesSettings } from '@/features/settings/sales/sales-management-service';
import { useCustomerFinder } from '@/features/customers/hooks/use-all-customers';
import { fetchProductsByIds } from '@/features/products/api/products-api';
import { productKeys } from '@/features/products/hooks/use-products';
import { fetchImporters } from '@/features/settings/inventory/api/inventory-settings-api';
import { inventorySettingsKeys } from '@/features/settings/inventory/hooks/use-inventory-settings';
import type { Importer } from '@/lib/types/prisma-extended';
// ✅ LAZY: branding, storeInfo, branches fetched on-demand in print callbacks (not on mount)
import { brandingCache, fetchBranding, getFullLogoUrl } from '@/hooks/use-branding';
import { storeInfoKeys } from '@/features/settings/store-info/hooks/use-store-info';
import { fetchStoreInfo } from '@/features/settings/store-info/api/store-info-api';
import { branchKeys } from '@/features/settings/branches/hooks/use-branches';
import { fetchBranches } from '@/features/settings/branches/api/branches-api';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { mapProductToLabelPrintData } from '@/lib/print-mappers/product-label.mapper';
import { mapPaymentToPrintData, type PaymentForPrint } from '@/lib/print-mappers/payment.mapper';
import { mapReceiptToPrintData, type ReceiptForPrint } from '@/lib/print-mappers/receipt.mapper';
import { type StoreSettings, numberToWords, formatTime } from '@/lib/print-service';
import { formatDateTime } from '@/lib/date-utils';
import { 
  convertOrderForPrint,
  convertPackagingToDeliveryForPrint,
  convertToShippingLabelForPrint,
  convertToPackingForPrint,
  mapOrderToPrintData,
  mapOrderLineItems,
  mapDeliveryToPrintData,
  mapDeliveryLineItems,
  mapShippingLabelToPrintData,
  mapPackingToPrintData,
  mapPackingLineItems,
  createStoreSettings,
} from '@/lib/print/order-print-helper';
import type { PrintOptionsResult, OrderPrintTemplateType } from '@/components/shared/print-options-dialog';

/** Dữ liệu phiếu chi/thu cần truyền vào để in */
export interface OrderTransactionForPrint {
  id: string;
  date: string | Date;
  amount: number;
  description: string;
  paymentMethodName: string;
  createdBy: string;
}

/** Dữ liệu customer tối thiểu cho in phiếu chi/thu */
export interface OrderCustomerForPrint {
  phone?: string;
  addresses?: Array<{ street?: string }>;
}

/**
 * Hook DUY NHẤT — chứa TẤT CẢ logic in ấn liên quan đến đơn hàng.
 * Bao gồm: in đơn, in đóng gói, in nhãn giao hàng, in phiếu giao,
 * in tem phụ, in phiếu chi, in phiếu thu, in hàng loạt.
 */
export function useOrderPrintHandlers() {
  const queryClient = useQueryClient();
  const { print, printMultiple, printMixedDocuments, getDefaultSize } = usePrint();
  const { findById: findCustomerById } = useCustomerFinder();

  // ✅ LAZY DATA HELPERS — fetch from React Query cache or on-demand (no eager API calls)
  const ensureBranches = React.useCallback(async (): Promise<Branch[]> => {
    return queryClient.ensureQueryData({
      queryKey: [...branchKeys.all, 'all'],
      queryFn: () => fetchAllPages((p) => fetchBranches(p)),
      staleTime: 10 * 60 * 1000,
    }) as Promise<Branch[]>;
  }, [queryClient]);

  const findBranchById = React.useCallback(async (systemId?: string) => {
    if (!systemId) return undefined;
    const branches = await ensureBranches();
    return branches.find(b => b.systemId === systemId);
  }, [ensureBranches]);

  const ensureStoreInfo = React.useCallback(async () => {
    return queryClient.ensureQueryData({
      queryKey: storeInfoKeys.info(),
      queryFn: fetchStoreInfo,
      staleTime: 30 * 60 * 1000,
    });
  }, [queryClient]);

  const ensureBranding = React.useCallback(async () => {
    if (brandingCache) return brandingCache;
    return fetchBranding();
  }, []);

  // ── Helper: tạo StoreSettings từ storeInfo (dùng cho phiếu chi/thu) ──
  const getStoreSettingsFromInfo = React.useCallback(async (): Promise<StoreSettings> => {
    const storeInfo = await ensureStoreInfo();
    return {
      name: storeInfo?.brandName || storeInfo?.companyName || '',
      address: storeInfo?.headquartersAddress,
      phone: storeInfo?.hotline,
      email: storeInfo?.email,
      province: storeInfo?.province,
    };
  }, [ensureStoreInfo]);

  // ── Fallback data cho tem phụ (dùng khi không tìm thấy product) ──
  const createFallbackLabelData = React.useCallback((item: { productName: string; productId?: string; unitPrice: number }) => ({
    '{product_name}': item.productName,
    '{product_name_vat}': item.productName,
    '{product_sku}': item.productId || '',
    '{product_price}': new Intl.NumberFormat('vi-VN').format(item.unitPrice) + ' đ',
    '{product_barcode}': item.productId || '',
    '{product_brand}': '',
    '{product_origin}': '',
    '{product_usage_guide}': '',
    '{product_importer_name}': '',
    '{product_importer_address}': '',
    '{product_barcode_image}': '',
  }), []);

  // ════════════════════════════════════════════════
  // 1. IN ĐƠN HÀNG (có thể chọn paperSize)
  // ════════════════════════════════════════════════
  const handlePrintOrder = React.useCallback(async (order: Order, paperSize?: PaperSize, templateType?: TemplateType) => {
    const customer = order.customer || findCustomerById(order.customerSystemId);
    const [branch, branding] = await Promise.all([
      findBranchById(order.branchSystemId),
      ensureBranding(),
    ]);
    const storeSettings = createStoreSettings(branch, { logo: getFullLogoUrl(branding.logoUrl) });
    // salesperson name comes from order.salesperson directly (no employee lookup needed)
    const orderData = convertOrderForPrint(order, { customer });
    
    const printType = templateType || 'order';
    let printData = mapOrderToPrintData(orderData, storeSettings);

    // Bổ sung thông tin pháp lý cho hợp đồng mua bán / biên bản giao nhận
    if (printType === 'sales-contract' || printType === 'goods-handover-report') {
      const storeInfo = await ensureStoreInfo();
      printData = {
        ...printData,
        '{store_company_name}': storeInfo?.companyName || storeSettings.name || '',
        '{store_representative}': storeInfo?.representativeName || '',
        '{store_representative_title}': storeInfo?.representativeTitle || '',
        '{store_tax_code}': storeInfo?.taxCode || '',
        '{store_bank_account}': storeInfo?.bankAccountNumber || '',
        '{store_bank_name}': storeInfo?.bankName || '',
        '{store_bank_account_name}': storeInfo?.bankAccountName || '',
      };
    }

    const printOptions: PrintOptions = {
      data: printData,
      lineItems: mapOrderLineItems(orderData.items),
      entityType: 'order',
      entityId: order.systemId,
      paperSize,
    };

    // Read printCopies from sales management settings
    const salesSettings = await getSalesSettings();
    const copies = parseInt(salesSettings.printCopies, 10) || 1;

    if (copies > 1) {
      // Duplicate print options for each copy (page break between copies)
      printMultiple(printType, Array.from({ length: copies }, () => printOptions));
    } else {
      print(printType, printOptions);
    }
    // Invalidate orders cache after printStatus is updated server-side
    setTimeout(() => queryClient.invalidateQueries({ queryKey: ['orders'] }), 1500);
    toast.success(`Đang in đơn hàng ${order.id}`);
  }, [findCustomerById, findBranchById, ensureBranding, ensureStoreInfo, print, printMultiple, queryClient]);

  // ════════════════════════════════════════════════
  // 2. IN PHIẾU ĐÓNG GÓI (packing)
  // ════════════════════════════════════════════════
  const handlePrintPacking = React.useCallback(async (order: Order) => {
    const packaging = order.packagings?.[order.packagings.length - 1];
    if (!packaging) {
      toast.error('Đơn hàng chưa có phiếu đóng gói');
      return;
    }
    
    const customer = order.customer || findCustomerById(order.customerSystemId);
    const branch = await findBranchById(order.branchSystemId);
    const storeSettings = createStoreSettings(branch);
    const packingData = convertToPackingForPrint(order, packaging, { customer });
    
    print('packing', {
      data: mapPackingToPrintData(packingData, storeSettings),
      lineItems: mapPackingLineItems(packingData.items),
      entityType: 'packaging',
      entityId: packaging.systemId,
    });
    toast.success(`Đang in phiếu đóng gói ${packaging.id}`);
  }, [findCustomerById, findBranchById, print]);

  // ════════════════════════════════════════════════
  // 3. IN NHÃN GIAO HÀNG (shipping-label)
  // ════════════════════════════════════════════════
  const handlePrintShippingLabel = React.useCallback(async (order: Order) => {
    const packaging = order.packagings?.find(p => p.status === 'Đã đóng gói');
    if (!packaging) {
      toast.error('Đơn hàng chưa có đóng gói xác nhận');
      return;
    }
    
    const customer = order.customer || findCustomerById(order.customerSystemId);
    const branch = await findBranchById(order.branchSystemId);
    const storeSettings = createStoreSettings(branch);
    const labelData = convertToShippingLabelForPrint(order, packaging, { customer });
    
    print('shipping-label', {
      data: mapShippingLabelToPrintData(labelData, storeSettings),
      entityType: 'packaging',
      entityId: packaging.systemId,
    });
    toast.success(`Đang in nhãn giao hàng ${order.id}`);
  }, [findCustomerById, findBranchById, print]);

  // ════════════════════════════════════════════════
  // 4. IN PHIẾU GIAO HÀNG (delivery)
  // ════════════════════════════════════════════════
  const handlePrintDelivery = React.useCallback(async (order: Order) => {
    const packaging = order.packagings?.find(p => p.status === 'Đã đóng gói');
    if (!packaging) {
      toast.error('Đơn hàng chưa có đóng gói xác nhận');
      return;
    }
    
    const customer = order.customer || findCustomerById(order.customerSystemId);
    const branch = await findBranchById(order.branchSystemId);
    const storeSettings = createStoreSettings(branch);
    const deliveryData = convertPackagingToDeliveryForPrint(order, packaging, { customer });
    
    print('delivery', {
      data: mapDeliveryToPrintData(deliveryData, storeSettings),
      lineItems: mapDeliveryLineItems(deliveryData.items),
      entityType: 'packaging',
      entityId: packaging.systemId,
    });
    toast.success(`Đang in phiếu giao hàng ${order.id}`);
  }, [findCustomerById, findBranchById, print]);

  // ════════════════════════════════════════════════
  // 5. IN TEM PHỤ (product-label) — mỗi đơn vị 1 tem
  // ════════════════════════════════════════════════
  // ✅ LAZY: fetch products by IDs on-demand (cache-first)
  const ensureProductsByIds = React.useCallback(async (systemIds: string[]) => {
    const uniqueIds = [...new Set(systemIds.filter(Boolean))];
    if (!uniqueIds.length) return [];
    return queryClient.ensureQueryData({
      queryKey: productKeys.byIds(uniqueIds),
      queryFn: () => fetchProductsByIds(uniqueIds),
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  // ✅ LAZY: fetch importers on-demand (cache-first) — fallback cho tem phụ
  const ensureImporters = React.useCallback(async (): Promise<Importer[]> => {
    return queryClient.ensureQueryData({
      queryKey: inventorySettingsKeys.importers(),
      queryFn: fetchImporters,
      staleTime: 10 * 60 * 1000,
    });
  }, [queryClient]);

  const handlePrintProductLabels = React.useCallback(async (order: Order) => {
    if (!order.lineItems?.length) {
      toast.error('Đơn hàng không có sản phẩm');
      return;
    }
    const branch = await findBranchById(order.branchSystemId);
    const storeSettings = createStoreSettings(branch);
    // Fetch product data on-demand (not cache-only)
    const productIds = order.lineItems.map(item => item.productSystemId).filter(Boolean);
    const [products, importers] = await Promise.all([
      ensureProductsByIds(productIds),
      ensureImporters(),
    ]);
    const productMap = new Map(products.map(p => [p.systemId, p]));
    const importerMap = new Map(importers.map(i => [i.systemId, i]));
    // Only print labels for products that have nameVat configured AND printLabel is not disabled
    const eligibleItems = order.lineItems.filter(item => {
      const product = productMap.get(item.productSystemId);
      return product?.nameVat && product?.printLabel !== false;
    });
    if (!eligibleItems.length) {
      toast.error('Không có sản phẩm nào được cài đặt Tên hàng hóa (VAT)', {
        description: 'Vui lòng vào chi tiết sản phẩm > Tab Tem & Nhãn để cài đặt.',
      });
      return;
    }
    const labelOpts = eligibleItems.flatMap(item => {
      const qty = Math.max(1, item.quantity || 1);
      const product = productMap.get(item.productSystemId)!;
      // Fallback từ importer setting nếu product thiếu thông tin tem phụ
      const importer = product.importerSystemId ? importerMap.get(product.importerSystemId) : undefined;
      const overrides: Record<string, unknown> = { price: item.unitPrice };
      if (!product.usageGuide && importer?.usageGuide) overrides.usageGuide = importer.usageGuide;
      if (!product.origin && importer?.origin) overrides.origin = importer.origin;
      if (!product.importerName && importer?.name) overrides.importerName = importer.name;
      if (!product.importerAddress && importer?.address) overrides.importerAddress = importer.address;
      const labelData = mapProductToLabelPrintData(product, storeSettings, overrides);
      return Array.from({ length: qty }, () => ({ data: labelData, paperSize: '50x30' as const, branchId: order.branchSystemId }));
    });
    const totalLabels = labelOpts.length;
    const skipped = order.lineItems.length - eligibleItems.length;
    const desc = skipped > 0 ? `Bỏ qua ${skipped} SP (chưa có Tên VAT hoặc đã tắt in tem phụ)` : undefined;

    // Gộp tất cả tem phụ + tem khách hàng vào 1 lệnh in duy nhất
    const allDocuments: Array<{ type: TemplateType; options: PrintOptions }> = [];

    // Thêm tem phụ sản phẩm (first one carries entityType/entityId for logging)
    labelOpts.forEach((opt, idx) => {
      allDocuments.push({
        type: 'product-label',
        options: idx === 0
          ? { ...opt, entityType: 'order', entityId: order.systemId }
          : opt,
      });
    });

    // Thêm tem đánh dấu khách hàng ở cuối (cùng khổ giấy 50x30)
    const customer = order.customer || findCustomerById(order.customerSystemId);
    allDocuments.push({
      type: 'customer-mark-label',
      options: {
        data: {
          '{order_code}': order.id || '',
          '{customer_name}': customer?.name || order.customerName || '',
          '{customer_phone_number}': customer?.phone || order.customerPhone || '',
        },
        paperSize: '50x30',
        branchId: order.branchSystemId,
      },
    });

    printMixedDocuments(allDocuments);

    toast.success(`Đang in ${totalLabels} tem phụ + tem khách hàng (${eligibleItems.length} mã SP)`, { description: desc });
  }, [ensureImporters, ensureProductsByIds, findBranchById, findCustomerById, printMixedDocuments]);

  // ════════════════════════════════════════════════
  // 6. IN PHIẾU CHI (payment / refund)
  // ════════════════════════════════════════════════
  const handlePrintPayment = React.useCallback(async (
    order: Order,
    payment: OrderTransactionForPrint,
    customer?: OrderCustomerForPrint | null,
  ) => {
    const [branch, storeSettings] = await Promise.all([
      findBranchById(order.branchSystemId),
      getStoreSettingsFromInfo(),
    ]);

    const paymentData: PaymentForPrint = {
      code: payment.id,
      createdAt: payment.date,
      issuedAt: payment.date,
      createdBy: (payment as unknown as Record<string, unknown>).createdByName as string || payment.createdBy,
      recipientName: order.customerName,
      recipientPhone: customer?.phone || '',
      recipientAddress: customer?.addresses?.[0]?.street || '',
      recipientType: 'Khách hàng',
      amount: payment.amount,
      description: payment.description,
      paymentMethod: payment.paymentMethodName,
      documentRootCode: order.id,
      note: payment.description,
      location: branch ? {
        name: branch.name,
        address: branch.address,
        province: branch.province,
      } : undefined,
    };

    const printData = mapPaymentToPrintData(paymentData, storeSettings);
    printData['amount_text'] = numberToWords(payment.amount);
    printData['print_date'] = formatDateTime(new Date());
    printData['print_time'] = formatTime(new Date());

    print('payment', { data: printData, entityType: 'order', entityId: order.systemId });
  }, [findBranchById, getStoreSettingsFromInfo, print]);

  // ════════════════════════════════════════════════
  // 7. IN PHIẾU THU (receipt)
  // ════════════════════════════════════════════════
  const handlePrintReceipt = React.useCallback(async (
    order: Order,
    receipt: OrderTransactionForPrint,
    customer?: OrderCustomerForPrint | null,
  ) => {
    const [branch, storeSettings] = await Promise.all([
      findBranchById(order.branchSystemId),
      getStoreSettingsFromInfo(),
    ]);

    const receiptData: ReceiptForPrint = {
      code: receipt.id,
      createdAt: receipt.date,
      issuedAt: receipt.date,
      createdBy: (receipt as unknown as Record<string, unknown>).createdByName as string || receipt.createdBy,
      payerName: order.customerName,
      payerPhone: customer?.phone || '',
      payerAddress: customer?.addresses?.[0]?.street || '',
      payerType: 'Khách hàng',
      amount: receipt.amount,
      description: receipt.description,
      paymentMethod: receipt.paymentMethodName,
      documentRootCode: order.id,
      note: receipt.description,
      location: branch ? {
        name: branch.name,
        address: branch.address,
        province: branch.province,
      } : undefined,
    };

    const printData = mapReceiptToPrintData(receiptData, storeSettings);
    printData['amount_text'] = numberToWords(receipt.amount);
    printData['print_date'] = formatDateTime(new Date());
    printData['print_time'] = formatTime(new Date());

    print('receipt', { data: printData, entityType: 'order', entityId: order.systemId });
  }, [findBranchById, getStoreSettingsFromInfo, print]);

  // ════════════════════════════════════════════════
  // 8. IN HÀNG LOẠT (bulk print)
  // ════════════════════════════════════════════════
  const handleBulkPrintConfirm = React.useCallback(async (
    pendingPrintOrders: Order[],
    options: PrintOptionsResult
  ) => {
    const { branchSystemId, paperSize, printOrder, printDelivery, printPacking, printShippingLabel, printProductLabel } = options;
    const ordersToProcess = pendingPrintOrders;
    const printMessages: string[] = [];
    const allDocuments: Array<{ type: TemplateType; options: PrintOptions }> = [];

    // ✅ Pre-fetch branches once for bulk operations
    const branches = await ensureBranches();
    const findBranch = (id?: string) => id ? branches.find(b => b.systemId === id) : undefined;

    // ✅ Pre-fetch products for label printing
    const allProductIds = printProductLabel
      ? [...new Set(ordersToProcess.flatMap(o => o.lineItems?.map(i => i.productSystemId) || []).filter(Boolean))]
      : [];
    const products = allProductIds.length > 0 ? await ensureProductsByIds(allProductIds) : [];
    const productMap = new Map(products.map(p => [p.systemId, p]));

    // ✅ Pre-fetch importers for label fallback data
    const importers = printProductLabel ? await ensureImporters() : [];
    const importerMap = new Map(importers.map(i => [i.systemId, i]));

    const createOrderPrintOptions = (order: Order) => {
      const customer = order.customer || findCustomerById(order.customerSystemId);
      const branch = branchSystemId
        ? findBranch(branchSystemId)
        : findBranch(order.branchSystemId);
      const storeSettings = createStoreSettings(branch);
      const orderData = convertOrderForPrint(order, { customer });
      return {
        data: mapOrderToPrintData(orderData, storeSettings),
        lineItems: mapOrderLineItems(orderData.items),
        paperSize,
      };
    };

    const createDeliveryPrintOptions = (order: Order) => {
      const packaging = order.packagings?.find(p => p.status === 'Đã đóng gói')
        ?? order.packagings?.[order.packagings.length - 1];
      if (!packaging) return null;
      const customer = order.customer || findCustomerById(order.customerSystemId);
      const branch = branchSystemId
        ? findBranch(branchSystemId)
        : findBranch(order.branchSystemId);
      const storeSettings = createStoreSettings(branch);
      const deliveryData = convertPackagingToDeliveryForPrint(order, packaging, { customer });
      return {
        data: mapDeliveryToPrintData(deliveryData, storeSettings),
        lineItems: mapDeliveryLineItems(deliveryData.items),
        paperSize,
      };
    };

    const createPackingPrintOptions = (order: Order) => {
      const packaging = order.packagings?.[order.packagings.length - 1];
      if (!packaging) return null;
      const customer = order.customer || findCustomerById(order.customerSystemId);
      const branch = branchSystemId
        ? findBranch(branchSystemId)
        : findBranch(order.branchSystemId);
      const storeSettings = createStoreSettings(branch);
      const packingData = convertToPackingForPrint(order, packaging, { customer });
      return {
        data: mapPackingToPrintData(packingData, storeSettings),
        lineItems: mapPackingLineItems(packingData.items),
        paperSize,
      };
    };

    const createShippingLabelPrintOptions = (order: Order) => {
      const packaging = order.packagings?.find(p => p.status === 'Đã đóng gói');
      if (!packaging) return null;
      const customer = order.customer || findCustomerById(order.customerSystemId);
      const branch = branchSystemId
        ? findBranch(branchSystemId)
        : findBranch(order.branchSystemId);
      const storeSettings = createStoreSettings(branch);
      const labelData = convertToShippingLabelForPrint(order, packaging, { customer });
      return {
        data: mapShippingLabelToPrintData(labelData, storeSettings),
        paperSize,
      };
    };

    ordersToProcess.forEach(order => {
      if (printOrder) {
        allDocuments.push({ type: 'order', options: { ...createOrderPrintOptions(order), entityType: 'order', entityId: order.systemId } });
      }
      if (printPacking && order.packagings?.length > 0) {
        const opts = createPackingPrintOptions(order);
        if (opts) allDocuments.push({ type: 'packing', options: { ...opts, entityType: 'order', entityId: order.systemId } });
      }
      if (printDelivery && order.packagings?.length > 0) {
        const opts = createDeliveryPrintOptions(order);
        if (opts) allDocuments.push({ type: 'delivery', options: { ...opts, entityType: 'order', entityId: order.systemId } });
      }
      if (printShippingLabel && order.packagings?.some(p => p.status === 'Đã đóng gói')) {
        const opts = createShippingLabelPrintOptions(order);
        if (opts) allDocuments.push({ type: 'shipping-label', options: opts });
      }
      if (printProductLabel && order.lineItems?.length > 0) {
        const branch = branchSystemId
          ? findBranch(branchSystemId)
          : findBranch(order.branchSystemId);
        const storeSettings = createStoreSettings(branch);
        // Only print labels for products that have nameVat configured AND printLabel is not disabled
        order.lineItems.forEach(item => {
          const product = productMap.get(item.productSystemId);
          if (!product?.nameVat || product?.printLabel === false) return; // Skip products without VAT name or with printLabel disabled
          const qty = Math.max(1, item.quantity || 1);
          // Fallback từ importer setting
          const importer = product.importerSystemId ? importerMap.get(product.importerSystemId) : undefined;
          const overrides: Record<string, unknown> = { price: item.unitPrice };
          if (!product.usageGuide && importer?.usageGuide) overrides.usageGuide = importer.usageGuide;
          if (!product.origin && importer?.origin) overrides.origin = importer.origin;
          if (!product.importerName && importer?.name) overrides.importerName = importer.name;
          if (!product.importerAddress && importer?.address) overrides.importerAddress = importer.address;
          const labelData = mapProductToLabelPrintData(product, storeSettings, overrides);
          for (let i = 0; i < qty; i++) {
            allDocuments.push({ type: 'product-label', options: { data: labelData, branchId: order.branchSystemId } });
          }
        });
      }
    });

    // Thống kê
    if (printOrder) printMessages.push(`${ordersToProcess.length} đơn hàng`);
    const ordersWithPackaging = ordersToProcess.filter(o => o.packagings?.length > 0);
    if (printPacking && ordersWithPackaging.length > 0) printMessages.push(`${ordersWithPackaging.length} phiếu đóng gói`);
    if (printDelivery && ordersWithPackaging.length > 0) printMessages.push(`${ordersWithPackaging.length} phiếu giao hàng`);
    const ordersWithConfirmedPackaging = ordersToProcess.filter(o => o.packagings?.some(p => p.status === 'Đã đóng gói'));
    if (printShippingLabel && ordersWithConfirmedPackaging.length > 0) printMessages.push(`${ordersWithConfirmedPackaging.length} nhãn giao hàng`);
    if (printProductLabel) {
      const totalLabels = ordersToProcess.reduce((sum, o) => sum + (o.lineItems?.reduce((s, item) => s + Math.max(1, item.quantity || 1), 0) || 0), 0);
      if (totalLabels > 0) printMessages.push(`${totalLabels} tem phụ`);
    }

    if (allDocuments.length > 0) {
      printMixedDocuments(allDocuments);
      toast.success(`Đang in ${printMessages.join(', ')}`);
    } else {
      toast.error('Không có dữ liệu phù hợp để in');
    }
  }, [findCustomerById, ensureBranches, ensureImporters, ensureProductsByIds, createFallbackLabelData, printMixedDocuments]);

  // ── printActions object cho DataTable columns ──
  const printActions = React.useMemo(() => ({
    onPrintOrder: handlePrintOrder,
    onPrintPacking: handlePrintPacking,
    onPrintShippingLabel: handlePrintShippingLabel,
    onPrintDelivery: handlePrintDelivery,
    onPrintProductLabels: handlePrintProductLabels,
  }), [handlePrintOrder, handlePrintPacking, handlePrintShippingLabel, handlePrintDelivery, handlePrintProductLabels]);

  return {
    // In đơn lẻ
    handlePrintOrder,
    handlePrintPacking,
    handlePrintShippingLabel,
    handlePrintDelivery,
    handlePrintProductLabels,
    // In phiếu chi / phiếu thu
    handlePrintPayment,
    handlePrintReceipt,
    // In hàng loạt
    handleBulkPrintConfirm,
    // Tiện ích
    getDefaultSize,
    printActions,
  };
}

export type { OrderPrintTemplateType };

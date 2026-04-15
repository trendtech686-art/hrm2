/**
 * Public Warranty Tracking API
 * No authentication required - returns limited warranty data for customer tracking
 * 
 * GET /api/public/warranty-tracking?code=BH000006-KXWX7D
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger'
import { checkRateLimit } from '@/lib/security-utils'

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const rateLimit = checkRateLimit(`public-warranty:${ip}`, 30, 60_000)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)) } }
      )
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Missing tracking code' },
        { status: 400 }
      );
    }

    // Load tracking settings - check both settings keys
    const [trackingSettings, publicTrackingSettings] = await Promise.all([
      prisma.setting.findUnique({
        where: { key_group: { key: 'warranty_tracking_settings', group: 'warranty' } },
      }),
      prisma.setting.findUnique({
        where: { key_group: { key: 'warranty_public_tracking', group: 'warranty' } },
      }),
    ]);

    const trackingVal = trackingSettings?.value as {
      enabled?: boolean;
      showEmployeeName?: boolean;
      showTimeline?: boolean;
      allowCustomerComments?: boolean;
      showProductList?: boolean;
      showSummary?: boolean;
      showPayment?: boolean;
      showReceivedImages?: boolean;
      showProcessedImages?: boolean;
      showHistory?: boolean;
    } | null;

    const publicVal = publicTrackingSettings?.value as {
      enabled?: boolean;
      showTimeline?: boolean;
      showEmployeeName?: boolean;
      allowCustomerComments?: boolean;
      showProductList?: boolean;
      showSummary?: boolean;
      showPayment?: boolean;
      showReceivedImages?: boolean;
      showProcessedImages?: boolean;
      showHistory?: boolean;
    } | null;

    // Feature is enabled if EITHER setting has enabled: true
    const isEnabled = trackingVal?.enabled || publicVal?.enabled;

    if (!isEnabled) {
      return NextResponse.json(
        { error: 'Tính năng tracking bảo hành chưa được bật' },
        { status: 403 }
      );
    }

    // Merge settings: prefer trackingVal, fallback to publicVal
    const settings = {
      enabled: true,
      showEmployeeName: trackingVal?.showEmployeeName ?? publicVal?.showEmployeeName ?? true,
      showTimeline: trackingVal?.showTimeline ?? publicVal?.showTimeline ?? true,
      allowCustomerComments: trackingVal?.allowCustomerComments ?? publicVal?.allowCustomerComments ?? false,
    };

    // Find warranty by publicTrackingCode, systemId, or businessId
    const warranty = await prisma.warranty.findFirst({
      where: {
        isDeleted: false,
        OR: [
          { publicTrackingCode: code },
          { systemId: code },
          { id: code },
        ],
      },
    });

    if (!warranty) {
      return NextResponse.json(
        { error: 'Không tìm thấy phiếu bảo hành với mã tra cứu này' },
        { status: 404 }
      );
    }

    // Parse JSON fields safely
    const products = Array.isArray(warranty.products)
      ? (warranty.products as Array<Record<string, unknown>>)
      : [];

    const history = Array.isArray(warranty.history)
      ? (warranty.history as Array<Record<string, unknown>>)
      : [];

    // Look up product catalog images for SKU/productSystemId
    const productSkus = products
      .map(p => p.sku as string)
      .filter(Boolean);
    const productSystemIds = products
      .map(p => p.productSystemId as string)
      .filter(Boolean);
    
    const catalogProductMap = new Map<string, { id: string; thumbnailImage: string | null; imageUrl: string | null; galleryImages: string[] }>();
    if (productSkus.length > 0 || productSystemIds.length > 0) {
      const catalogProducts = await prisma.product.findMany({
        where: {
          OR: [
            ...(productSkus.length > 0 ? [{ id: { in: productSkus } }] : []),
            ...(productSystemIds.length > 0 ? [{ systemId: { in: productSystemIds } }] : []),
          ],
        },
        select: { systemId: true, id: true, thumbnailImage: true, imageUrl: true, galleryImages: true },
      });
      catalogProducts.forEach(p => {
        catalogProductMap.set(p.id, p);
        catalogProductMap.set(p.systemId, p);
      });
    }

    const comments = Array.isArray(warranty.comments)
      ? (warranty.comments as Array<Record<string, unknown>>)
      : [];

    const settlement = warranty.settlement as Record<string, unknown> | null;
    const summary = warranty.summary as Record<string, unknown> | null;

    // Resolve employee names from history performedBy
    const uniqueEmployeeIds = [...new Set(
      history
        .map(h => h.performedBy as string)
        .filter(id => id && id !== 'CUSTOMER' && id !== 'SYSTEM')
    )];

    let employeeNameMap: Record<string, string> = {};
    if (uniqueEmployeeIds.length > 0) {
      const employees = await prisma.employee.findMany({
        where: { systemId: { in: uniqueEmployeeIds } },
        select: { systemId: true, fullName: true },
      });
      employeeNameMap = Object.fromEntries(
        employees.map(e => [e.systemId, e.fullName])
      );
    }

    const getDisplayName = (id: unknown): string | undefined => {
      if (!id || typeof id !== 'string') return undefined;
      if (id === 'CUSTOMER') return 'Khách hàng';
      if (id === 'SYSTEM') return 'Hệ thống';
      return employeeNameMap[id] || (id as string);
    };

    // Filter timeline based on settings
    const filteredHistory = settings.showTimeline
      ? history.map(h => ({
          ...h,
          performedBy: settings.showEmployeeName ? h.performedBy : undefined,
          performedByName: settings.showEmployeeName ? getDisplayName(h.performedBy) : undefined,
        }))
      : [];

    // Process comments with display names
    const processedComments = comments.map(c => ({
      ...c,
      createdByName: getDisplayName(c.createdBy || c.createdBySystemId) || 'Khách hàng',
    }));

    // Fetch related payments (non-cancelled)
    const payments = await prisma.payment.findMany({
      where: {
        linkedWarrantySystemId: warranty.systemId,
        cancelledAt: null,
        status: 'completed',
      },
      select: {
        systemId: true,
        id: true,
        amount: true,
        description: true,
        paymentMethodName: true,
        paymentDate: true,
        linkedOrderSystemId: true,
        createdAt: true,
        status: true,
      },
    });

    // Fetch related receipts (non-cancelled)
    const receipts = await prisma.receipt.findMany({
      where: {
        linkedWarrantySystemId: warranty.systemId,
        cancelledAt: null,
        status: 'completed',
      },
      select: {
        systemId: true,
        id: true,
        amount: true,
        description: true,
        paymentMethodName: true,
        receiptDate: true,
        createdAt: true,
        status: true,
      },
    });

    // Fetch related order if exists
    let relatedOrder: Record<string, unknown> | null = null;
    if (warranty.linkedOrderSystemId) {
      const order = await prisma.order.findFirst({
        where: {
          OR: [
            { systemId: warranty.linkedOrderSystemId },
            { id: warranty.linkedOrderSystemId },
          ],
        },
        select: {
          systemId: true,
          id: true,
          customerName: true,
          grandTotal: true,
          orderDate: true,
        },
      });
      if (order) {
        relatedOrder = {
          ...order,
          grandTotal: order.grandTotal ? Number(order.grandTotal) : 0,
        };
      }
    }

    // Fetch default branch for hotline
    const defaultBranch = await prisma.branch.findFirst({
      where: warranty.branchSystemId
        ? { systemId: warranty.branchSystemId }
        : { isDefault: true },
      select: { name: true, phone: true },
    });

    // Build public ticket data
    const publicTicket = {
      systemId: warranty.systemId,
      id: warranty.id,
      status: warranty.status,
      publicTrackingCode: warranty.publicTrackingCode,
      trackingCode: warranty.trackingCode,
      customerName: warranty.customerName,
      customerPhone: warranty.customerPhone,
      customerAddress: warranty.customerAddress,
      shippingFee: warranty.shippingFee ? Number(warranty.shippingFee) : 0,
      receivedImages: warranty.receivedImages || [],
      processedImages: warranty.processedImages || [],
      notes: warranty.notes,
      linkedOrderSystemId: warranty.linkedOrderSystemId,
      createdAt: warranty.createdAt,
      processingStartedAt: warranty.processingStartedAt,
      processedAt: warranty.processedAt,
      returnedAt: warranty.returnedAt,
      completedAt: warranty.completedAt,
      cancelledAt: warranty.cancelledAt,
      cancelReason: warranty.cancelReason,
      employeeName: settings.showEmployeeName ? warranty.employeeName : undefined,
      branchName: warranty.branchName,
      products: products.map(p => {
        const catalogProduct = (p.sku ? catalogProductMap.get(p.sku as string) : null)
          || (p.productSystemId ? catalogProductMap.get(p.productSystemId as string) : null);
        const catalogImage = catalogProduct?.thumbnailImage 
          || catalogProduct?.imageUrl 
          || catalogProduct?.galleryImages?.[0] 
          || null;
        return {
          systemId: p.systemId,
          productName: p.productName,
          sku: p.sku || null,
          quantity: p.quantity,
          resolution: p.resolution,
          unitPrice: p.unitPrice ? Number(p.unitPrice) : 0,
          deductionAmount: p.deductionAmount ? Number(p.deductionAmount) : 0,
          issueDescription: p.issueDescription,
          notes: p.notes || null,
          productImages: p.productImages || [],
          catalogImage,
        };
      }),
      history: filteredHistory,
      settlement: settlement ? {
        totalAmount: Number((settlement as Record<string, unknown>).totalAmount || 0),
        settledAmount: Number((settlement as Record<string, unknown>).settledAmount || 0),
        remainingAmount: Number((settlement as Record<string, unknown>).remainingAmount || 0),
        methods: Array.isArray((settlement as Record<string, unknown>).methods)
          ? ((settlement as Record<string, unknown>).methods as Array<Record<string, unknown>>)
              .filter((m: Record<string, unknown>) => m.status === 'completed')
              .map((m: Record<string, unknown>) => ({
                systemId: m.systemId,
                type: m.type,
                amount: Math.abs(Number(m.amount || 0)),
                status: m.status,
                notes: m.notes,
                linkedOrderSystemId: m.linkedOrderSystemId,
                paymentVoucherId: m.paymentVoucherId,
                createdAt: m.createdAt,
              }))
          : [],
      } : undefined,
      summary: summary || { totalProducts: 0, totalReplaced: 0, totalDeduction: 0 },
    };

    return NextResponse.json({
      ticket: publicTicket,
      comments: processedComments,
      payments: payments.map(p => ({
        systemId: p.systemId,
        id: p.id,
        amount: Number(p.amount || 0),
        description: p.description,
        paymentMethodName: p.paymentMethodName,
        linkedOrderSystemId: p.linkedOrderSystemId,
        createdAt: p.createdAt,
        status: p.status,
      })),
      receipts: receipts.map(r => ({
        systemId: r.systemId,
        id: r.id,
        amount: Number(r.amount || 0),
        description: r.description,
        paymentMethodName: r.paymentMethodName,
        createdAt: r.createdAt,
        status: r.status,
      })),
      orders: relatedOrder ? [relatedOrder] : [],
      settings: {
        enabled: true,
        showEmployeeName: settings.showEmployeeName ?? true,
        showTimeline: settings.showTimeline ?? true,
        allowCustomerComments: settings.allowCustomerComments ?? false,
        // Card visibility - default all visible
        showProductList: trackingVal?.showProductList ?? publicVal?.showProductList ?? true,
        showSummary: trackingVal?.showSummary ?? publicVal?.showSummary ?? true,
        showPayment: trackingVal?.showPayment ?? publicVal?.showPayment ?? true,
        showReceivedImages: trackingVal?.showReceivedImages ?? publicVal?.showReceivedImages ?? true,
        showProcessedImages: trackingVal?.showProcessedImages ?? publicVal?.showProcessedImages ?? true,
        showHistory: trackingVal?.showHistory ?? publicVal?.showHistory ?? true,
      },
      hotline: defaultBranch?.phone || '',
      companyName: defaultBranch?.name || 'Công ty',
    });
  } catch (error) {
    logError('[PUBLIC-WARRANTY-TRACKING] Error', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi tải thông tin' },
      { status: 500 }
    );
  }
}

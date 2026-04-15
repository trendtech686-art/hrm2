/**
 * Public Complaint Tracking API
 * No authentication required - returns limited complaint data for customer tracking
 * 
 * GET /api/public/complaint-tracking?code=TKMLYTVFZC
 * POST /api/public/complaint-tracking - Add customer comment
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSubEntityId } from '@/lib/id-utils';
import { logError } from '@/lib/logger'
import { checkRateLimit } from '@/lib/security-utils'

// Map Prisma ComplaintStatus enum (UPPERCASE) to frontend ComplaintStatus type (lowercase)
const PRISMA_TO_FRONTEND_STATUS: Record<string, string> = {
  OPEN: 'pending',
  IN_PROGRESS: 'investigating',
  RESOLVED: 'resolved',
  CLOSED: 'ended',
};

function normalizeStatus(prismaStatus: string): string {
  return PRISMA_TO_FRONTEND_STATUS[prismaStatus] || prismaStatus.toLowerCase();
}

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const rateLimit = checkRateLimit(`public-complaint:${ip}`, 30, 60_000)
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

    // Load tracking settings first to check if feature is enabled
    const trackingSettings = await prisma.setting.findUnique({
      where: { key_group: { key: 'complaints_tracking_settings', group: 'complaints' } },
    });

    const settings = trackingSettings?.value as {
      enabled?: boolean;
      showEmployeeName?: boolean;
      showTimeline?: boolean;
      allowCustomerComments?: boolean;
      showOrderInfo?: boolean;
      showProducts?: boolean;
      showImages?: boolean;
      showResolution?: boolean;
    } | null;

    if (!settings?.enabled) {
      return NextResponse.json(
        { error: 'Tính năng tracking chưa được bật' },
        { status: 403 }
      );
    }

    // Find complaint by publicTrackingCode, systemId, or businessId
    const complaint = await prisma.complaint.findFirst({
      where: {
        isDeleted: false,
        OR: [
          { publicTrackingCode: code },
          { systemId: code },
          { id: code },
        ],
      },
    });

    if (!complaint) {
      return NextResponse.json(
        { error: 'Không tìm thấy khiếu nại với mã tra cứu này' },
        { status: 404 }
      );
    }

    // Fetch related order if exists
    let relatedOrder: Record<string, unknown> | null = null;
    if (complaint.orderId) {
      const order = await prisma.order.findFirst({
        where: {
          OR: [
            { systemId: complaint.orderId },
            { id: complaint.orderId },
          ],
        },
        select: {
          systemId: true,
          id: true,
          customerName: true,
          shippingAddress: true,
          salespersonName: true,
          orderDate: true,
          grandTotal: true,
          expectedDeliveryDate: true,
          packagings: {
            select: {
              trackingCode: true,
              requestDate: true,
            },
            take: 1,
          },
        },
      });
      if (order) {
        relatedOrder = {
          ...order,
          salesperson: order.salespersonName,
          grandTotal: order.grandTotal ? Number(order.grandTotal) : 0,
        };
      }
    }

    // Fetch default branch for hotline
    const defaultBranch = await prisma.branch.findFirst({
      where: { isDefault: true },
      select: { name: true, phone: true },
    });

    // Parse JSON fields safely
    const timeline = Array.isArray(complaint.timeline)
      ? (complaint.timeline as Array<Record<string, unknown>>)
      : [];

    const rawAffectedProducts = Array.isArray(complaint.affectedProducts)
      ? (complaint.affectedProducts as Array<Record<string, unknown>>)
      : [];

    // Enrich affected products with images and business ID from Product model
    // Note: productId in the JSON is actually the systemId (e.g. PROD112654)
    const productIds = rawAffectedProducts
      .map(p => (p.productSystemId || p.productId) as string)
      .filter(Boolean);

    let productDataMap: Record<string, { image: string; businessId: string }> = {};
    if (productIds.length > 0) {
      const products = await prisma.product.findMany({
        where: { systemId: { in: productIds } },
        select: { systemId: true, id: true, thumbnailImage: true, imageUrl: true },
      });
      productDataMap = Object.fromEntries(
        products.map(p => [
          p.systemId,
          {
            image: p.thumbnailImage || p.imageUrl || '',
            businessId: p.id,
          },
        ])
      );
    }

    const affectedProducts = rawAffectedProducts.map(p => {
      const lookupId = (p.productSystemId || p.productId) as string;
      const productData = productDataMap[lookupId];
      return {
        ...p,
        productImage: productData?.image || '',
        productBusinessId: productData?.businessId || '',
      };
    });

    const employeeImages = Array.isArray(complaint.employeeImages)
      ? complaint.employeeImages
      : [];

    // Resolve employee names from performedBy systemIds
    const uniqueEmployeeIds = [...new Set(
      timeline
        .map(a => a.performedBy as string)
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

    // Helper to get display name
    const getDisplayName = (id: unknown): string | undefined => {
      if (!id || typeof id !== 'string') return undefined;
      if (id === 'CUSTOMER') return 'Khách hàng';
      if (id === 'SYSTEM') return 'Hệ thống';
      return employeeNameMap[id] || (id as string);
    };

    // Filter timeline based on settings
    const filteredTimeline = settings.showTimeline
      ? timeline.map(action => ({
          ...action,
          performedBy: settings.showEmployeeName ? action.performedBy : undefined,
          performedByName: settings.showEmployeeName ? getDisplayName(action.performedBy) : undefined,
        }))
      : [];

    // Extract comments from timeline
    const comments = timeline
      .filter(a => a.actionType === 'commented')
      .map(c => ({
        systemId: c.id,
        content: c.note || '',
        contentText: c.note || '',
        createdBy: getDisplayName(c.performedBy) || 'Khách hàng',
        createdBySystemId: c.performedBy,
        createdAt: c.performedAt,
        attachments: c.images || [],
        mentions: [],
        isEdited: false,
        parentId: undefined,
      }));

    // Timeline actions (non-comment) 
    const timelineActions = filteredTimeline.filter(a => (a as Record<string, unknown>).actionType !== 'commented');

    // Fetch compensation payments linked to this complaint (only active, non-cancelled refunds)
    let compensationAmount = 0;
    let compensationDescription = '';
    if (complaint.resolution === 'refund') {
      const refundPayments = await prisma.payment.findMany({
        where: {
          linkedComplaintSystemId: complaint.systemId,
          category: 'complaint_refund',
          cancelledAt: null,
          status: 'completed',
        },
        select: { amount: true, description: true },
      });
      compensationAmount = refundPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
      compensationDescription = refundPayments[0]?.description || '';
    }

    // Map DB fields to frontend Complaint type (matching /api/complaints mapping)
    const normalizedStatus = normalizeStatus(complaint.status);
    const publicData = {
      systemId: complaint.systemId,
      id: complaint.id,
      publicTrackingCode: complaint.publicTrackingCode,
      status: normalizedStatus,
      priority: complaint.priority,
      type: complaint.type,
      description: complaint.description,
      title: complaint.title,
      customerName: complaint.customerName,
      customerPhone: complaint.customerPhone,
      customerEmail: complaint.customerEmail,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
      resolvedAt: complaint.resolvedAt,
      endedAt: complaint.endedAt,
      // Map DB field names to frontend names
      orderSystemId: complaint.orderId,
      orderCode: complaint.orderCode,
      orderValue: complaint.orderValue ? Number(complaint.orderValue) : null,
      branchName: complaint.branchName,
      // Conditionally show employee info
      assignedTo: settings.showEmployeeName ? complaint.assigneeId : undefined,
      assigneeName: settings.showEmployeeName ? complaint.assigneeName : undefined,
      // Investigation & resolution
      verification: complaint.verification,
      investigationNote: complaint.investigationNote,
      resolutionNote: complaint.resolutionNote,
      resolution: complaint.resolution,
      proposedSolution: complaint.proposedSolution,
      // Compensation
      compensationAmount: compensationAmount > 0 ? compensationAmount : null,
      compensationDescription: compensationDescription || null,
      // Products & images
      affectedProducts,
      images: complaint.images || [],
      employeeImages,
      evidenceImages: complaint.evidenceImages || [],
      // Workflow
      timeline: filteredTimeline,
    };

    return NextResponse.json({
      complaint: publicData,
      relatedOrder,
      comments,
      timelineActions,
      settings: {
        enabled: true,
        showEmployeeName: settings.showEmployeeName ?? true,
        showTimeline: settings.showTimeline ?? true,
        allowCustomerComments: settings.allowCustomerComments ?? false,
        showOrderInfo: settings.showOrderInfo ?? true,
        showProducts: settings.showProducts ?? true,
        showImages: settings.showImages ?? true,
        showResolution: settings.showResolution ?? true,
      },
      hotline: defaultBranch?.phone || '',
      companyName: defaultBranch?.name || 'Công ty',
    });
  } catch (error) {
    logError('[PUBLIC-COMPLAINT-TRACKING] Error', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi tải thông tin' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/public/complaint-tracking - Add customer comment
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const rateLimit = checkRateLimit(`public-complaint-comment:${ip}`, 10, 60_000)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)) } }
      )
    }

    const body = await request.json();
    const { trackingCode, comment } = body as { trackingCode?: string; comment?: string };

    if (!trackingCode || !comment) {
      return NextResponse.json(
        { error: 'Missing trackingCode or comment' },
        { status: 400 }
      );
    }

    // Check tracking settings 
    const trackingSettings = await prisma.setting.findUnique({
      where: { key_group: { key: 'complaints_tracking_settings', group: 'complaints' } },
    });
    const settings = trackingSettings?.value as {
      enabled?: boolean;
      allowCustomerComments?: boolean;
    } | null;

    if (!settings?.enabled || !settings?.allowCustomerComments) {
      return NextResponse.json(
        { error: 'Bình luận không được phép' },
        { status: 403 }
      );
    }

    // Find complaint
    const complaint = await prisma.complaint.findFirst({
      where: {
        isDeleted: false,
        OR: [
          { publicTrackingCode: trackingCode },
          { systemId: trackingCode },
          { id: trackingCode },
        ],
      },
    });

    if (!complaint) {
      return NextResponse.json(
        { error: 'Không tìm thấy khiếu nại' },
        { status: 404 }
      );
    }

    // Add comment to timeline
    const timeline = Array.isArray(complaint.timeline)
      ? (complaint.timeline as unknown[])
      : [];

    const newAction = {
      id: generateSubEntityId('act-cust'),
      actionType: 'commented',
      performedBy: 'CUSTOMER',
      performedAt: new Date().toISOString(),
      note: comment,
      images: [] as string[],
      metadata: {},
    };

    await prisma.complaint.update({
      where: { systemId: complaint.systemId },
      data: {
        timeline: [...timeline, newAction] as unknown as import('@/generated/prisma/client').Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ success: true, action: newAction });
  } catch (error) {
    logError('[PUBLIC-COMPLAINT-TRACKING] POST Error', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    );
  }
}

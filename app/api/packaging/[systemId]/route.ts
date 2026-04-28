import { z } from 'zod'
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { logError } from '@/lib/logger'

const paramsSchema = z.object({
  systemId: z.string().min(1, 'systemId is required'),
})

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// GET /api/packaging/[systemId] - Get packaging detail with full order and product info
export async function GET(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const { systemId: rawParams } = await params;
  const validation = paramsSchema.safeParse(rawParams);
  if (!validation.success) {
    return apiError(validation.error.issues[0]?.message || 'Invalid params', 400);
  }
  const { systemId } = validation.data;

  try {

    // Find packaging by systemId or business id
    const packaging = await prisma.packaging.findFirst({
      where: {
        OR: [
          { systemId },
          { id: systemId },
        ],
      },
      select: {
        systemId: true,
        id: true,
        requestDate: true,
        confirmDate: true,
        cancelDate: true,
        deliveredDate: true,
        requestingEmployeeId: true,
        requestingEmployeeName: true,
        confirmingEmployeeId: true,
        confirmingEmployeeName: true,
        cancelingEmployeeId: true,
        cancelingEmployeeName: true,
        assignedEmployeeId: true,
        assignedEmployeeName: true,
        status: true,
        printStatus: true,
        cancelReason: true,
        notes: true,
        deliveryMethod: true,
        deliveryStatus: true,
        carrier: true,
        service: true,
        trackingCode: true,
        partnerStatus: true,
        shippingFeeToPartner: true,
        codAmount: true,
        weight: true,
        requestorName: true,
        requestorPhone: true,
        requestorId: true,
        orderId: true,
        assignedEmployee: {
          select: {
            systemId: true,
            fullName: true,
          },
        },
        shipment: {
          select: {
            systemId: true,
            id: true,
            carrier: true,
            trackingNumber: true,
            trackingCode: true,
            status: true,
            shippingFee: true,
            createdAt: true,
          },
        },
      },
    });

    if (!packaging) {
      return apiNotFound('Packaging');
    }

    // Fetch employee names if IDs exist but names are missing
    const employeeIds = [
      packaging.requestingEmployeeId,
      packaging.confirmingEmployeeId,
      packaging.cancelingEmployeeId,
    ].filter((id): id is string => !!id);
    
    const employees = employeeIds.length > 0 
      ? await prisma.employee.findMany({
          where: { systemId: { in: employeeIds } },
          select: { systemId: true, fullName: true },
        })
      : [];
    
    const employeeMap = new Map(employees.map(e => [e.systemId, e.fullName]));

    // Fetch order separately for optimization
    if (!packaging.orderId) {
      return apiError('Packaging không thuộc đơn hàng nào', 400);
    }

    const [order] = await Promise.all([
      prisma.order.findFirst({
        where: {
          OR: [
            { systemId: packaging.orderId },
            { id: packaging.orderId },
          ],
        },
        select: {
          systemId: true,
          id: true,
          customerId: true,
          customerName: true,
          branchId: true,
          branchName: true,
          notes: true,
          subtotal: true,
          shippingFee: true,
          tax: true,
          discount: true,
          grandTotal: true,
          paidAmount: true,
          branch: {
            select: {
              systemId: true,
              id: true,
              name: true,
            },
          },
          lineItems: {
            select: {
              productId: true,
              productName: true,
              quantity: true,
              unitPrice: true,
              discount: true,
              discountType: true,
              tax: true,
              total: true,
              note: true,
              product: {
                select: {
                  systemId: true,
                  id: true,
                  name: true,
                  imageUrl: true,
                  thumbnailImage: true,
                  galleryImages: true,
                  barcode: true,
                },
              },
            },
          },
          payments: {
            select: {
              systemId: true,
              id: true,
              date: true,
              method: true,
              amount: true,
              description: true,
            },
          },
        },
      }),
    ]);

    if (!order) {
      return apiError('Packaging không thuộc đơn hàng nào', 400);
    }

    // Fetch customer using order's customerId
    const customerData = order.customerId 
      ? await prisma.customer.findFirst({
          where: {
            OR: [
              { systemId: order.customerId },
              { id: order.customerId },
            ],
          },
          select: {
            systemId: true,
            id: true,
            name: true,
            phone: true,
            address: true,
            ward: true,
            district: true,
            province: true,
          },
        })
      : null;

    // Status maps
    const statusMap: Record<string, string> = {
      'PENDING': 'Chờ đóng gói',
      'IN_PROGRESS': 'Chờ đóng gói',
      'COMPLETED': 'Đã đóng gói',
      'CANCELLED': 'Hủy đóng gói',
    };
    const deliveryStatusMap: Record<string, string> = {
      'PENDING_PACK': 'Chờ đóng gói',
      'PACKED': 'Đã đóng gói',
      'PENDING_SHIP': 'Chờ lấy hàng',
      'SHIPPING': 'Đang giao hàng',
      'DELIVERED': 'Đã giao hàng',
      'RESCHEDULED': 'Chờ giao lại',
      'CANCELLED': 'Đã hủy',
    };
    const deliveryMethodMap: Record<string, string> = {
      'SHIPPING': 'Dịch vụ giao hàng',
      'PICKUP': 'Lấy tại kho',
      'IN_STORE_PICKUP': 'Nhận tại cửa hàng',
    };
    const printStatusMap: Record<string, string> = {
      'PRINTED': 'Đã in',
      'NOT_PRINTED': 'Chưa in',
    };

    // Transform response
    const response = {
      packaging: {
        systemId: packaging.systemId,
        id: packaging.id,
        requestDate: packaging.requestDate?.toISOString(),
        confirmDate: packaging.confirmDate?.toISOString(),
        cancelDate: packaging.cancelDate?.toISOString(),
        deliveredDate: packaging.deliveredDate?.toISOString(),
        requestingEmployeeId: packaging.requestingEmployeeId,
        requestingEmployeeName: packaging.requestingEmployeeName 
          || (packaging.requestingEmployeeId ? employeeMap.get(packaging.requestingEmployeeId) : null) 
          || '',
        confirmingEmployeeId: packaging.confirmingEmployeeId,
        confirmingEmployeeName: packaging.confirmingEmployeeName 
          || (packaging.confirmingEmployeeId ? employeeMap.get(packaging.confirmingEmployeeId) : null) 
          || '',
        cancelingEmployeeId: packaging.cancelingEmployeeId,
        cancelingEmployeeName: packaging.cancelingEmployeeName 
          || (packaging.cancelingEmployeeId ? employeeMap.get(packaging.cancelingEmployeeId) : null) 
          || '',
        assignedEmployeeId: packaging.assignedEmployeeId,
        assignedEmployeeName: packaging.assignedEmployee?.fullName || packaging.assignedEmployeeName || '',
        status: statusMap[packaging.status] || packaging.status,
        printStatus: packaging.printStatus ? (printStatusMap[packaging.printStatus] || packaging.printStatus) : 'Chưa in',
        cancelReason: packaging.cancelReason,
        notes: packaging.notes,
        deliveryMethod: packaging.deliveryMethod ? (deliveryMethodMap[packaging.deliveryMethod] || packaging.deliveryMethod) : undefined,
        deliveryStatus: packaging.deliveryStatus ? (deliveryStatusMap[packaging.deliveryStatus] || packaging.deliveryStatus) : undefined,
        carrier: packaging.carrier,
        service: packaging.service,
        trackingCode: packaging.trackingCode,
        partnerStatus: packaging.partnerStatus,
        shippingFeeToPartner: packaging.shippingFeeToPartner ? Number(packaging.shippingFeeToPartner) : undefined,
        codAmount: packaging.codAmount ? Number(packaging.codAmount) : undefined,
        weight: packaging.weight ? Number(packaging.weight) : undefined,
        requestorName: packaging.requestorName,
        requestorPhone: packaging.requestorPhone,
        requestorId: packaging.requestorId,
        shipment: packaging.shipment,
      },
      order: {
        systemId: order.systemId,
        id: order.id,
        customerSystemId: order.customerId,
        customerName: customerData?.name || order.customerName || '',
        branchSystemId: order.branchId,
        branchName: order.branch?.name || order.branchName || '',
        notes: order.notes,
        subtotal: Number(order.subtotal),
        shippingFee: Number(order.shippingFee),
        tax: Number(order.tax),
        discount: Number(order.discount),
        grandTotal: Number(order.grandTotal),
        paidAmount: Number(order.paidAmount),
        // Line items with full product info
        lineItems: order.lineItems.map(item => ({
          productSystemId: item.productId,
          productId: item.product?.id || '',
          productName: item.product?.name || item.productName || '',
          barcode: item.product?.barcode || '',
          thumbnailImage: item.product?.thumbnailImage || item.product?.imageUrl || item.product?.galleryImages?.[0] || '',
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          discount: Number(item.discount),
          discountType: item.discountType as 'fixed' | 'percentage',
          tax: Number(item.tax),
          total: Number(item.total),
          note: item.note,
        })),
        payments: order.payments.map(p => ({
          systemId: p.systemId,
          id: p.id,
          date: p.date?.toISOString(),
          method: p.method,
          amount: Number(p.amount),
          description: p.description,
        })),
      },
      customer: customerData ? {
        systemId: customerData.systemId,
        id: customerData.id,
        fullName: customerData.name,
        phone: customerData.phone,
        // Shipping address - use address + province/district/ward
        shippingAddress: [
          customerData.address,
          customerData.ward,
          customerData.district,
          customerData.province,
        ].filter(Boolean).join(', ') || '',
        shippingAddress_street: customerData.address,
        shippingAddress_ward: customerData.ward,
        shippingAddress_district: customerData.district,
        shippingAddress_province: customerData.province,
      } : null,
    };

    return apiSuccess(response);
  } catch (error) {
    logError('Failed to fetch packaging', error);
    return apiError('Internal server error', 500);
  }
}

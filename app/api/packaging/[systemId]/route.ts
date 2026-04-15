import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { logError } from '@/lib/logger'

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// GET /api/packaging/[systemId] - Get packaging detail with full order and product info
export async function GET(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    // Find packaging by systemId or business id
    const packaging = await prisma.packaging.findFirst({
      where: {
        OR: [
          { systemId },
          { id: systemId },
        ],
      },
      include: {
        order: {
          include: {
            customer: true,
            branch: true,
            lineItems: {
              include: {
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
            payments: true,
          },
        },
        assignedEmployee: {
          select: {
            systemId: true,
            fullName: true,
          },
        },
        shipment: true,
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

    const order = packaging.order;
    if (!order) {
      return apiError('Packaging không thuộc đơn hàng nào', 400);
    }
    const customer = order.customer;

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
        customerName: customer?.name || order.customerName || '',
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
      customer: customer ? {
        systemId: customer.systemId,
        id: customer.id,
        fullName: customer.name,
        phone: customer.phone,
        // Shipping address - use address + province/district/ward
        shippingAddress: [
          customer.address,
          customer.ward,
          customer.district,
          customer.province,
        ].filter(Boolean).join(', ') || '',
        shippingAddress_street: customer.address,
        shippingAddress_ward: customer.ward,
        shippingAddress_district: customer.district,
        shippingAddress_province: customer.province,
      } : null,
    };

    return apiSuccess(response);
  } catch (error) {
    logError('Failed to fetch packaging', error);
    return apiError('Internal server error', 500);
  }
}

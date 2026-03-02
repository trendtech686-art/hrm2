import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createPaymentSchema } from './validation'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { updateCustomerDebt } from '@/lib/services/customer-debt-service'

// GET /api/payments - List all payments (phiếu chi)
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const supplierId = searchParams.get('supplierId')
    const linkedOrderSystemId = searchParams.get('linkedOrderSystemId')
    const linkedSalesReturnSystemId = searchParams.get('linkedSalesReturnSystemId')
    const customerSystemId = searchParams.get('customerSystemId')
    const purchaseOrderSystemId = searchParams.get('purchaseOrderSystemId')
    const linkedWarrantySystemId = searchParams.get('linkedWarrantySystemId')
    const branchId = searchParams.get('branchId')
    const accountId = searchParams.get('accountId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    const where: Prisma.PaymentWhereInput = {}

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { suppliers: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (supplierId) {
      where.supplierId = supplierId
    }

    if (linkedOrderSystemId) {
      where.linkedOrderSystemId = linkedOrderSystemId
    }

    if (linkedSalesReturnSystemId) {
      where.linkedSalesReturnSystemId = linkedSalesReturnSystemId
    }

    if (customerSystemId) {
      where.customerSystemId = customerSystemId
    }

    // ⚡ Filter for purchase order detail page
    if (purchaseOrderSystemId) {
      where.purchaseOrderSystemId = purchaseOrderSystemId
    }

    // ⚡ Filter for warranty detail page
    if (linkedWarrantySystemId) {
      where.linkedWarrantySystemId = linkedWarrantySystemId
    }

    // ⚡ Server-side filters for payments list page
    if (branchId) {
      where.branchSystemId = branchId
    }

    if (accountId) {
      where.accountSystemId = accountId
    }

    if (startDate || endDate) {
      where.paymentDate = {}
      if (startDate) where.paymentDate.gte = new Date(startDate)
      if (endDate) where.paymentDate.lte = new Date(endDate)
    }

    // Map sortBy to Prisma field
    const sortFieldMap: Record<string, string> = {
      date: 'paymentDate',
      amount: 'amount',
      createdAt: 'createdAt',
      id: 'id',
      status: 'status',
    }
    const orderByField = sortFieldMap[sortBy] || 'createdAt'

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderByField]: sortOrder },
        include: {
          purchaseOrder: {
            select: { systemId: true, id: true },
          },
          suppliers: {
            select: { systemId: true, id: true, name: true },
          },
        },
      }),
      prisma.payment.count({ where }),
    ])

    // Fetch employee names for createdBy
    const creatorIds = [...new Set(payments.map(p => p.createdBy).filter(Boolean))] as string[];
    const employees = creatorIds.length > 0 
      ? await prisma.employee.findMany({
          where: { systemId: { in: creatorIds } },
          select: { systemId: true, fullName: true },
        })
      : [];
    const employeeMap = new Map(employees.map(e => [e.systemId, e.fullName]));

    // Transform payments: convert dates and amounts
    const transformedPayments = payments.map(p => ({
      ...p,
      date: p.paymentDate?.toISOString() || p.createdAt?.toISOString(),
      createdAt: p.createdAt?.toISOString(),
      amount: Number(p.amount),
      createdByName: p.createdBy ? employeeMap.get(p.createdBy) || p.createdBy : undefined,
    }));

    return apiPaginated(transformedPayments, { page, limit, total })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return apiError('Failed to fetch payments', 500)
  }
}

// POST /api/payments - Create new payment
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createPaymentSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    // Determine branchId - use branchSystemId if provided, otherwise branchId
    const branchId = body.branchSystemId || body.branchId
    if (!branchId) {
      return apiError('Branch ID is required', 400)
    }

    // Determine payment type
    const paymentType = body.linkedPayrollBatchSystemId ? 'EMPLOYEE_PAYMENT' : 'SUPPLIER_PAYMENT'

    const payment = await prisma.$transaction(async (tx) => {
      // Generate IDs using unified ID system
      const { systemId, businessId } = await generateNextIdsWithTx(
        tx,
        'payments',
        body.id?.trim() || undefined
      );

      return tx.payment.create({
        data: {
          systemId,
          id: businessId,
          supplierId: body.supplierId,
          purchaseOrderId: body.purchaseOrderId,
          // Additional linking fields for purchase order matching
          purchaseOrderSystemId: body.purchaseOrderSystemId || body.purchaseOrderId,
          purchaseOrderBusinessId: body.purchaseOrderBusinessId || body.originalDocumentId,
          originalDocumentId: body.originalDocumentId,
          branchId: branchId,
          type: paymentType,
          amount: body.amount,
          paymentMethod: body.method || body.paymentMethod || 'CASH',
          paymentDate: body.date ? new Date(body.date) : (body.paymentDate ? new Date(body.paymentDate) : new Date()),
          description: body.description,
          // Extended fields for payroll payments
          recipientTypeSystemId: body.recipientTypeSystemId,
          recipientTypeName: body.recipientTypeName,
          recipientName: body.recipientName,
          recipientSystemId: body.recipientSystemId,
          paymentMethodSystemId: body.paymentMethodSystemId,
          paymentMethodName: body.paymentMethodName,
          accountSystemId: body.accountSystemId,
          paymentReceiptTypeSystemId: body.paymentReceiptTypeSystemId,
          paymentReceiptTypeName: body.paymentReceiptTypeName,
          branchSystemId: body.branchSystemId,
          branchName: body.branchName,
          createdBy: body.createdBy,
          status: body.status || 'completed',
          category: body.category,
          affectsDebt: body.affectsDebt ?? true,
          linkedPayrollBatchSystemId: body.linkedPayrollBatchSystemId,
          linkedPayslipSystemId: body.linkedPayslipSystemId,
        },
        include: {
          purchaseOrder: true,
          suppliers: true,
        },
      });
    });

    // Create audit log with sequential systemId
    const lastAuditLog = await prisma.auditLog.findFirst({
      where: { systemId: { startsWith: 'LOG' } },
      orderBy: { systemId: 'desc' },
      select: { systemId: true },
    })
    const auditLogCounter = lastAuditLog?.systemId 
      ? parseInt(lastAuditLog.systemId.replace('LOG', '')) + 1
      : 1

    await prisma.auditLog.create({
      data: {
        systemId: `LOG${String(auditLogCounter).padStart(10, '0')}`,
        action: 'CREATE',
        entityType: 'Payment',
        entityId: payment.systemId,
        userId: body.createdBy || session.user?.id || 'SYSTEM',
        userName: session.user?.name || session.user?.email || 'Hệ thống',
        changes: {
          type: paymentType,
          amount: body.amount,
          recipientName: body.recipientName,
          description: body.description,
          linkedPayrollBatchSystemId: body.linkedPayrollBatchSystemId,
        },
      },
    })

    // Update customer debt if payment affects debt and has a customer
    if (payment.affectsDebt && !payment.linkedSalesReturnSystemId) {
      const customerSystemId = payment.customerSystemId || payment.recipientSystemId;
      if (customerSystemId) {
        await updateCustomerDebt(customerSystemId).catch(err => {
          console.error('[Create Payment] Failed to update customer debt:', err);
        });
      }
    }

    // Serialize for client (convert Decimal to number)
    const serialized = {
      ...payment,
      amount: Number(payment.amount),
      runningBalance: payment.runningBalance !== null ? Number(payment.runningBalance) : null,
    };

    return apiSuccess(serialized, 201)
  } catch (error) {
    console.error('Error creating payment:', error)
    const message = error instanceof Error ? error.message : 'Failed to create payment'
    return apiError(message, 500)
  }
}

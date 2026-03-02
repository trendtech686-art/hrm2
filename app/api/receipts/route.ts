import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createReceiptSchema } from './validation'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { updateCustomerDebt } from '@/lib/services/customer-debt-service'

// GET /api/receipts - List all receipts (phiếu thu)
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')
    const linkedOrderSystemId = searchParams.get('linkedOrderSystemId')
    const linkedSalesReturnSystemId = searchParams.get('linkedSalesReturnSystemId')
    const customerSystemId = searchParams.get('customerSystemId')
    const supplierId = searchParams.get('supplierId')
    const linkedWarrantySystemId = searchParams.get('linkedWarrantySystemId')
    const branchId = searchParams.get('branchId')
    const accountId = searchParams.get('accountId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    const where: Prisma.ReceiptWhereInput = {}

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { customers: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (customerId) {
      where.customerId = customerId
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

    // ⚡ Filter by supplier (payer) for supplier detail page
    if (supplierId) {
      where.payerSystemId = supplierId
    }

    // ⚡ Filter by warranty for warranty detail page
    if (linkedWarrantySystemId) {
      where.linkedWarrantySystemId = linkedWarrantySystemId
    }

    // ⚡ Server-side filters for receipts list page
    if (branchId) {
      where.branchSystemId = branchId
    }

    if (accountId) {
      where.accountSystemId = accountId
    }

    if (startDate || endDate) {
      where.receiptDate = {}
      if (startDate) where.receiptDate.gte = new Date(startDate)
      if (endDate) where.receiptDate.lte = new Date(endDate)
    }

    // Map sortBy to Prisma field
    const sortFieldMap: Record<string, string> = {
      date: 'receiptDate',
      amount: 'amount',
      createdAt: 'createdAt',
      id: 'id',
      status: 'status',
    }
    const orderByField = sortFieldMap[sortBy] || 'createdAt'

    const [receipts, total] = await Promise.all([
      prisma.receipt.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderByField]: sortOrder },
        include: {
          order: {
            select: { systemId: true, id: true },
          },
          customers: {
            select: { systemId: true, id: true, name: true },
          },
        },
      }),
      prisma.receipt.count({ where }),
    ])

    // Fetch employee names for createdBy
    const creatorIds = [...new Set(receipts.map(r => r.createdBy).filter(Boolean))] as string[];
    const employees = creatorIds.length > 0 
      ? await prisma.employee.findMany({
          where: { systemId: { in: creatorIds } },
          select: { systemId: true, fullName: true },
        })
      : [];
    const employeeMap = new Map(employees.map(e => [e.systemId, e.fullName]));

    // Transform receipts: map receiptDate -> date, convert Decimal -> number
    const transformedReceipts = receipts.map(r => ({
      ...r,
      date: r.receiptDate?.toISOString() || r.createdAt?.toISOString(),
      createdAt: r.createdAt?.toISOString(),
      amount: Number(r.amount),
      createdByName: r.createdBy ? employeeMap.get(r.createdBy) || r.createdBy : undefined,
    }));

    return apiPaginated(transformedReceipts, { page, limit, total })
  } catch (error) {
    console.error('Error fetching receipts:', error)
    return apiError('Failed to fetch receipts', 500)
  }
}

// POST /api/receipts - Create new receipt
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createReceiptSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    // Support both legacy (branchId) and new (branchSystemId) formats
    const branchId = body.branchId || body.branchSystemId;
    if (!branchId) {
      return apiError('Branch ID is required', 400)
    }

    const receipt = await prisma.$transaction(async (tx) => {
      // Generate IDs using unified ID system
      const { systemId, businessId } = await generateNextIdsWithTx(
        tx,
        'receipts',
        body.id?.trim() || undefined
      );

      return tx.receipt.create({
        data: {
          systemId,
          id: businessId,
          customerId: body.customerId || body.customerSystemId,
          orderId: body.orderId,
          branchId: branchId,
          type: body.category === 'customer_payment' ? 'CUSTOMER_PAYMENT' : 'OTHER_INCOME',
          amount: body.amount,
          paymentMethod: body.method || body.paymentMethod || body.paymentMethodSystemId || 'CASH',
          receiptDate: body.date ? new Date(body.date) : (body.receiptDate ? new Date(body.receiptDate) : new Date()),
          description: body.description,
          // Payer info
          payerTypeSystemId: body.payerTypeSystemId,
          payerTypeName: body.payerTypeName,
          payerName: body.payerName,
          payerSystemId: body.payerSystemId,
          // Payment method info
          paymentMethodSystemId: body.paymentMethodSystemId,
          paymentMethodName: body.paymentMethodName,
          // Account and receipt type
          accountSystemId: body.accountSystemId,
          paymentReceiptTypeSystemId: body.paymentReceiptTypeSystemId,
          paymentReceiptTypeName: body.paymentReceiptTypeName,
          // Branch info
          branchSystemId: body.branchSystemId,
          branchName: body.branchName,
          // Customer info
          customerSystemId: body.customerSystemId,
          customerName: body.customerName,
          // Other
          affectsDebt: body.affectsDebt ?? true,
          status: body.status || 'completed',
          category: body.category,
          createdBy: body.createdBy || session.user?.id,
        },
        include: {
          order: true,
          customers: true,
        },
      });
    });

    // Update customer debt if receipt affects debt and has a customer
    if (receipt.affectsDebt) {
      const customerSystemId = receipt.customerSystemId || receipt.payerSystemId;
      if (customerSystemId) {
        await updateCustomerDebt(customerSystemId).catch(err => {
          console.error('[Create Receipt] Failed to update customer debt:', err);
        });
      }
    }

    // Serialize Decimal fields before returning to client
    const serialized = {
      ...receipt,
      amount: Number(receipt.amount),
      runningBalance: receipt.runningBalance !== null ? Number(receipt.runningBalance) : null,
    };

    return apiSuccess(serialized, 201)
  } catch (error) {
    console.error('Error creating receipt:', error)
    return apiError('Failed to create receipt', 500)
  }
}

import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { apiSuccess, apiPaginated, apiError, parsePagination, validateBody } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { createPaymentSchema } from './validation'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { updateCustomerDebt } from '@/lib/services/customer-debt-service'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { buildSearchWhere } from '@/lib/search/build-search-where'

// GET /api/payments - List all payments (phiếu chi)
export const GET = apiHandler(async (request, { session }) => {

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const category = searchParams.get('category') // Supports comma-separated values: purchase,supplier_payment
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
    // Advanced filters
    const recipientTypeSystemId = searchParams.get('recipientTypeSystemId')
    const paymentMethodSystemId = searchParams.get('paymentMethodSystemId')
    const paymentReceiptTypeSystemId = searchParams.get('paymentReceiptTypeSystemId')
    const createdBy = searchParams.get('createdBy')
    const type = searchParams.get('type')

    const where: Prisma.PaymentWhereInput = {}

    const searchWhere = buildSearchWhere<Prisma.PaymentWhereInput>(search, [
      'id',
      'suppliers.name',
    ])
    if (searchWhere) Object.assign(where, searchWhere)

    if (status) {
      where.status = status
    }

    // ⚡ Support single category or comma-separated list: category=purchase,supplier_payment
    if (category) {
      const categories = category.split(',').map(c => c.trim()).filter(Boolean)
      if (categories.length === 1) {
        where.category = categories[0]
      } else if (categories.length > 1) {
        where.category = { in: categories }
      }
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
      const customerName = searchParams.get('customerName')
      const broadMatch = searchParams.get('customerMatchBroad') === 'true'
      if (broadMatch) {
        // Broad match: customerSystemId OR recipientSystemId OR (recipientTypeName=Khách hàng AND recipientName=customerName)
        const orConditions: Prisma.PaymentWhereInput[] = [
          { customerSystemId },
          { recipientSystemId: customerSystemId },
        ]
        if (customerName) {
          orConditions.push({ recipientTypeName: 'Khách hàng', recipientName: customerName })
        }
        where.OR = where.OR ? [...(Array.isArray(where.OR) ? where.OR : [where.OR]), ...orConditions] : orConditions
      } else {
        where.customerSystemId = customerSystemId
      }
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

    // Advanced filters
    if (recipientTypeSystemId) {
      where.recipientTypeSystemId = recipientTypeSystemId
    }

    if (paymentMethodSystemId) {
      where.paymentMethodSystemId = paymentMethodSystemId
    }

    if (paymentReceiptTypeSystemId) {
      where.paymentReceiptTypeSystemId = paymentReceiptTypeSystemId
    }

    if (createdBy) {
      where.createdBy = createdBy
    }

    if (type) {
      where.type = type as Prisma.EnumPaymentTypeFilter
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
    logError('Error fetching payments', error)
    return apiError('Không thể tải danh sách phiếu chi', 500)
  }
})

// POST /api/payments - Create new payment
export const POST = apiHandler(async (request, { session }) => {
  const validation = await validateBody(request, createPaymentSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    // Determine branchId - use branchSystemId if provided, otherwise branchId
    const branchId = body.branchSystemId || body.branchId
    if (!branchId) {
      return apiError('Vui lòng chọn chi nhánh', 400)
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
          affectsBusinessReport: body.affectsBusinessReport ?? false,
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
        entityType: 'payment',
        entityId: payment.systemId,
        userId: body.createdBy || session!.user.id || 'SYSTEM',
        userName: session!.user.name || session!.user.email || 'Hệ thống',
        changes: {
          'Loại': paymentType,
          'Số tiền': body.amount,
          'Người nhận': body.recipientName,
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
          logError('[Create Payment] Failed to update customer debt', err);
        });
      }
    }

    // Serialize for client (convert Decimal to number)
    const serialized = {
      ...payment,
      amount: Number(payment.amount),
      runningBalance: payment.runningBalance !== null ? Number(payment.runningBalance) : null,
    };

    // ✅ Notify recipient for salary/advance payments
    if (payment.recipientSystemId && payment.category && ['salary', 'advance', 'bonus'].includes(payment.category) && payment.recipientSystemId !== session!.user.employeeId) {
      createNotification({
        type: 'payment',
        title: 'Phiếu chi mới',
        message: `Phiếu chi ${payment.id || payment.systemId} - ${payment.recipientName || ''} - ${Number(payment.amount).toLocaleString('vi-VN')}đ`,
        link: `/payments/${payment.systemId}`,
        recipientId: payment.recipientSystemId,
        senderId: session!.user.employeeId,
        senderName: session!.user.name,
        settingsKey: 'payment:received',
      }).catch(e => logError('[Payments POST] notification failed', e))
    }

    // Log activity with amount details
    getUserNameFromDb(session!.user.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'payment',
          entityId: serialized.systemId,
          action: 'created',
          actionType: 'create',
          note: `Tạo phiếu chi: ${payment.id || payment.systemId} - Số tiền: ${Number(payment.amount).toLocaleString('vi-VN')}đ`,
          metadata: { userName, amount: Number(payment.amount), recipientName: payment.recipientName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] payment create failed', e))
    return apiSuccess(serialized, 201)
  } catch (error) {
    logError('Error creating payment', error)
    const message = error instanceof Error ? error.message : 'Không thể tạo phiếu chi'
    return apiError(message, 500)
  }
})

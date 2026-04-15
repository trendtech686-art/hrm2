import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { apiSuccess, apiPaginated, apiError, parsePagination, validateBody } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { createReceiptSchema } from './validation'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { updateCustomerDebt } from '@/lib/services/customer-debt-service'
import { serializeReceipt } from './serialize'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

// GET /api/receipts - List all receipts (phiếu thu)
export const GET = apiHandler(async (request, { session }) => {

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
    const purchaseOrderSystemId = searchParams.get('purchaseOrderSystemId')
    const branchId = searchParams.get('branchId')
    const accountId = searchParams.get('accountId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
    // Advanced filters
    const payerTypeSystemId = searchParams.get('payerTypeSystemId')
    const paymentMethodSystemId = searchParams.get('paymentMethodSystemId')
    const paymentReceiptTypeSystemId = searchParams.get('paymentReceiptTypeSystemId')
    const createdBy = searchParams.get('createdBy')
    const type = searchParams.get('type')

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
      const customerName = searchParams.get('customerName')
      const broadMatch = searchParams.get('customerMatchBroad') === 'true'
      if (broadMatch) {
        // Broad match: customerSystemId OR payerSystemId OR (payerTypeName=Khách hàng AND payerName=customerName)
        const orConditions: Prisma.ReceiptWhereInput[] = [
          { customerSystemId },
          { payerSystemId: customerSystemId },
        ]
        if (customerName) {
          orConditions.push({ payerTypeName: 'Khách hàng', payerName: customerName })
        }
        where.OR = where.OR ? [...(Array.isArray(where.OR) ? where.OR : [where.OR]), ...orConditions] : orConditions
      } else {
        where.customerSystemId = customerSystemId
      }
    }

    // ⚡ Filter by supplier (payer) for supplier detail page
    if (supplierId) {
      where.payerSystemId = supplierId
    }

    // ⚡ Filter by warranty for warranty detail page
    if (linkedWarrantySystemId) {
      where.linkedWarrantySystemId = linkedWarrantySystemId
    }

    // ⚡ Filter by purchase order for PO detail page
    if (purchaseOrderSystemId) {
      where.purchaseOrderSystemId = purchaseOrderSystemId
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

    // Advanced filters
    if (payerTypeSystemId) {
      where.payerTypeSystemId = payerTypeSystemId
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
      where.type = type as Prisma.EnumReceiptTypeFilter
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
    logError('Error fetching receipts', error)
    return apiError('Không thể tải danh sách phiếu thu', 500)
  }
})

// POST /api/receipts - Create new receipt
export const POST = apiHandler(async (request, { session }) => {

  const validation = await validateBody(request, createReceiptSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    // Support both legacy (branchId) and new (branchSystemId) formats
    const branchId = body.branchId || body.branchSystemId;
    if (!branchId) {
      return apiError('Vui lòng chọn chi nhánh', 400)
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
          // Purchase order link (for supplier refund receipts)
          purchaseOrderSystemId: body.purchaseOrderSystemId,
          purchaseOrderId: body.purchaseOrderId,
          // Other
          affectsDebt: body.affectsDebt ?? true,
          affectsBusinessReport: body.affectsBusinessReport ?? false,
          status: body.status || 'completed',
          category: body.category,
          createdBy: body.createdBy || session!.user.id,
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
          logError('[Create Receipt] Failed to update customer debt', err);
        });
      }
    }

    // ✅ Update supplier debt if receipt is a supplier refund
    // Supplier refund = supplier trả tiền lại → giảm công nợ với NCC
    if (receipt.affectsDebt && receipt.category === 'supplier_refund') {
      const supplierSystemId = receipt.payerSystemId;
      if (supplierSystemId) {
        await prisma.supplier.update({
          where: { systemId: supplierSystemId },
          data: {
            currentDebt: { decrement: Number(receipt.amount) || 0 },
          },
        }).catch(err => {
          logError('[Create Receipt] Failed to update supplier debt', err);
        });
      }
    }

    // Update PurchaseOrder refundStatus if receipt is linked to a purchase order
    if (receipt.purchaseOrderSystemId) {
      try {
        // Get PO and all receipts for this PO
        const [purchaseOrder, allReceipts] = await Promise.all([
          prisma.purchaseOrder.findUnique({
            where: { systemId: receipt.purchaseOrderSystemId },
            select: { systemId: true, total: true, supplierSystemId: true, supplierName: true },
          }),
          prisma.receipt.findMany({
            where: {
              purchaseOrderSystemId: receipt.purchaseOrderSystemId,
              status: { not: 'cancelled' },
            },
            select: { amount: true },
          }),
        ]);

        if (purchaseOrder) {
          // Order total (grandTotal)
          const orderTotal = Number(purchaseOrder.total || 0);

          // Calculate total received from supplier (all receipts linked to this PO)
          const totalReceived = allReceipts.reduce(
            (sum, r) => sum + Number(r.amount || 0),
            0
          );

          // Determine refund status based on order total
          // - "Chưa hoàn tiền": No refund received
          // - "Hoàn tiền một phần": Received some refund but less than order total
          // - "Hoàn tiền toàn bộ": Received refund >= order total
          let refundStatus = 'Chưa hoàn tiền';
          if (totalReceived > 0) {
            if (orderTotal > 0 && totalReceived >= orderTotal) {
              refundStatus = 'Hoàn tiền toàn bộ';
            } else {
              refundStatus = 'Hoàn tiền một phần';
            }
          }

          await prisma.purchaseOrder.update({
            where: { systemId: receipt.purchaseOrderSystemId },
            data: { refundStatus },
          });
        }
      } catch (err) {
        logError('[Create Receipt] Failed to update PO refundStatus', err);
      }
    }

    // Serialize Decimal fields before returning to client
    const serialized = serializeReceipt(receipt)

    // ✅ Notify creator about receipt creation (if different from session user)
    if (receipt.createdBy && receipt.createdBy !== session!.user.employeeId) {
      createNotification({
        type: 'receipt',
        settingsKey: 'receipt:updated',
        title: 'Phiếu thu mới',
        message: `Phiếu thu ${receipt.id || receipt.systemId} - ${receipt.payerName || ''} - ${Number(receipt.amount).toLocaleString('vi-VN')}đ`,
        link: `/receipts/${receipt.systemId}`,
        recipientId: receipt.createdBy,
        senderId: session!.user.employeeId,
        senderName: session!.user.name,
      }).catch(e => logError('[Receipts POST] notification failed', e))
    }

    // Log activity
    getUserNameFromDb(session!.user.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'receipt',
          entityId: serialized.systemId,
          action: 'created',
          actionType: 'create',
          note: `Tạo phiếu thu`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] receipt create failed', e))
    return apiSuccess(serialized, 201)
  } catch (error) {
    logError('Error creating receipt', error)
    return apiError('Không thể tạo phiếu thu', 500)
  }
})

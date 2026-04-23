'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES, generatePath } from '../../../lib/router';
import { formatDateCustom } from '../../../lib/date-utils';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { TouchButton } from '../../../components/mobile/touch-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import {
  MobileCard,
  MobileCardBody,
  MobileCardHeader,
} from '../../../components/mobile/mobile-card';
import { DollarSign, CreditCard, MoreHorizontal, Trash, Edit, Eye } from 'lucide-react';
import type { CashbookTransaction } from '../columns';

const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

type CashbookTransactionWithBalance = CashbookTransaction & { runningBalance?: number };

interface MobileTransactionCardProps {
  transaction: CashbookTransactionWithBalance;
  branches: Array<{ systemId: string; name: string }>;
  receiptTypes: Array<{ systemId: string; name: string }>;
  paymentTypes: Array<{ systemId: string; name: string }>;
  onEdit: (transaction: CashbookTransaction) => void;
  onCancel: (systemId: string) => void;
  canEdit?: boolean;
  canCancel?: boolean;
}

export function MobileTransactionCard({
  transaction,
  branches,
  receiptTypes: _receiptTypes,
  paymentTypes: _paymentTypes,
  onEdit,
  onCancel,
  canEdit = true,
  canCancel = true,
}: MobileTransactionCardProps) {
  const router = useRouter();
  const branch = branches.find(b => b.systemId === transaction.branchSystemId);
  const isReceipt = transaction.type === 'receipt';
  const voucherTypeName = transaction.paymentReceiptTypeName;
  const viewRoute = isReceipt ? ROUTES.FINANCE.RECEIPT_VIEW : ROUTES.FINANCE.PAYMENT_VIEW;

  return (
    <MobileCard
      onClick={() => router.push(generatePath(viewRoute, { systemId: transaction.systemId }))}
    >
      <MobileCardHeader className="items-start justify-between">
        <div className="flex items-start gap-2 min-w-0 flex-1">
          <Avatar className={`h-10 w-10 shrink-0 ${isReceipt ? 'bg-emerald-500/10' : 'bg-destructive/10'}`}>
            <AvatarFallback className={isReceipt ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'}>
              {isReceipt ? <DollarSign className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              {isReceipt ? 'Phiếu thu' : 'Phiếu chi'}
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <div className="text-sm font-semibold text-foreground truncate font-mono">
                {transaction?.id || 'N/A'}
              </div>
              <Badge variant={isReceipt ? 'default' : 'destructive'} className="text-xs shrink-0">
                {isReceipt ? 'Thu' : 'Chi'}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-1 shrink-0">
          <div className="text-right">
            <div className={`text-xl font-bold leading-none ${isReceipt ? 'text-emerald-600' : 'text-destructive'}`}>
              {isReceipt ? '+' : '-'}{formatCurrency(transaction.amount)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Số tiền</div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <TouchButton
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 -mr-2 -mt-1"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </TouchButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(generatePath(viewRoute, { systemId: transaction.systemId })); }}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              {canEdit && (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(transaction); }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
              )}
              {canCancel && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onCancel(transaction.systemId); }} className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Hủy giao dịch
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </MobileCardHeader>

      <MobileCardBody>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Ngày</dt>
            <dd className="font-medium">{formatDateCustom(new Date(transaction.date), 'dd/MM/yyyy')}</dd>
          </div>
          {branch && (
            <div>
              <dt className="text-xs text-muted-foreground">Chi nhánh</dt>
              <dd className="font-medium truncate">{branch.name}</dd>
            </div>
          )}
          {transaction.targetName && (
            <div className="col-span-2">
              <dt className="text-xs text-muted-foreground">Đối tượng</dt>
              <dd className="font-medium truncate">{transaction.targetName}</dd>
            </div>
          )}
          {voucherTypeName && (
            <div className="col-span-2">
              <dt className="text-xs text-muted-foreground">Loại phiếu</dt>
              <dd className="font-medium truncate">{voucherTypeName}</dd>
            </div>
          )}
          {transaction.originalDocumentId && (
            <div className="col-span-2">
              <dt className="text-xs text-muted-foreground">Chứng từ</dt>
              <dd className="font-medium font-mono truncate">{transaction.originalDocumentId}</dd>
            </div>
          )}
        </dl>
      </MobileCardBody>
    </MobileCard>
  );
}

'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES, generatePath } from '../../../lib/router';
import { formatDateCustom } from '../../../lib/date-utils';
import { Card, CardContent, CardTitle } from '../../../components/ui/card';
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
import { DollarSign, CreditCard, Calendar, User, Building2, FileText, MoreHorizontal, Trash, Edit, Eye } from 'lucide-react';
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
}

export function MobileTransactionCard({
  transaction,
  branches,
  receiptTypes: _receiptTypes,
  paymentTypes: _paymentTypes,
  onEdit,
  onCancel,
}: MobileTransactionCardProps) {
  const router = useRouter();
  const branch = branches.find(b => b.systemId === transaction.branchSystemId);
  const isReceipt = transaction.type === 'receipt';
  // CashbookTransaction has paymentReceiptTypeName directly, no need for lookup
  const voucherTypeName = transaction.paymentReceiptTypeName;

  const viewRoute = isReceipt ? ROUTES.FINANCE.RECEIPT_VIEW : ROUTES.FINANCE.PAYMENT_VIEW;

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => router.push(generatePath(viewRoute, { systemId: transaction.systemId }))}
    >
      <CardContent className="p-4">
        {/* Header: Icon + ID + Type + Menu */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Avatar className={`h-8 w-8 shrink-0 ${isReceipt ? 'bg-emerald-500/10' : 'bg-destructive/10'}`}>
              <AvatarFallback className={isReceipt ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'}>
                {isReceipt ? <DollarSign className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <CardTitle className="font-semibold text-sm">{transaction?.id || 'N/A'}</CardTitle>
              <Badge variant={isReceipt ? "default" : "destructive"} className="text-xs">
                {isReceipt ? 'Thu' : 'Chi'}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <TouchButton
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 shrink-0"
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
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(transaction); }}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onCancel(transaction.systemId); }} className="text-red-600">
                <Trash className="mr-2 h-4 w-4" />
                Hủy giao dịch
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Amount + Date */}
        <div className="mb-3">
          <div className={`text-lg font-bold ${isReceipt ? 'text-emerald-600' : 'text-destructive'}`}>
            {isReceipt ? '+' : '-'}{formatCurrency(transaction.amount)}
          </div>
          <div className="text-xs text-muted-foreground flex items-center mt-1">
            <Calendar className="h-3 w-3 mr-1.5" />
            {formatDateCustom(new Date(transaction.date), 'dd/MM/yyyy')}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t mb-3" />

        {/* Details */}
        <div className="space-y-2">
          {transaction.targetName && (
            <div className="flex items-center text-xs text-muted-foreground">
              <User className="h-3 w-3 mr-1.5 shrink-0" />
              <span className="truncate">{transaction.targetName}</span>
            </div>
          )}
          {voucherTypeName && (
            <div className="flex items-center text-xs text-muted-foreground">
              <FileText className="h-3 w-3 mr-1.5 shrink-0" />
              <span className="truncate">{voucherTypeName}</span>
            </div>
          )}
          {branch && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Building2 className="h-3 w-3 mr-1.5 shrink-0" />
              <span className="truncate">{branch.name}</span>
            </div>
          )}
          {transaction.originalDocumentId && (
            <div className="text-xs text-muted-foreground">
              CT: <span className="font-mono font-medium">{transaction.originalDocumentId}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

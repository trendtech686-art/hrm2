import React, { useState } from 'react';
import Link from 'next/link';
import { formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import { Button } from '@/components/ui/button';
import { Banknote, Truck, Printer, ChevronRight, ChevronDown } from 'lucide-react';
import { DetailField } from '@/components/ui/detail-field';
import type { PaymentCategory } from '@/lib/types/prisma-extended';

interface PaymentItemProps {
    item: {
        type: 'payment' | 'refund';
        systemId: string;
        id: string;
        date: string;
        amount: number;
        method: string;
        creator: string;
        description: string;
        category?: PaymentCategory;
    };
    onPrint: (e: React.MouseEvent, item: PaymentItemProps['item']) => void;
}

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

export function PurchaseOrderPaymentItem({ item, onPrint }: PaymentItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Use createdByName from API data, fall back to raw creator ID
    const creatorName = (item as unknown as Record<string, unknown>).createdByName as string || item.creator;
    const creatorSystemId = (item as unknown as Record<string, unknown>).creatorSystemId as string || item.creator;

    // Determine item type: payment, expense, or refund
    const isRefund = item.type === 'refund';
    const isExpense = !isRefund && item.category === 'expense';
    const IconComponent = isExpense ? Truck : Banknote;
    const iconColor = isRefund ? 'text-blue-500' : isExpense ? 'text-orange-500' : 'text-green-500';
    const amountColor = isRefund ? 'text-blue-600' : isExpense ? 'text-orange-600' : 'text-green-600';
    
    // Parse expense type from description
    const getLabel = () => {
      if (isRefund) return 'Phiếu thu NCC hoàn tiền';
      if (!isExpense) return 'Thanh toán NCC';
      const desc = item.description?.toLowerCase() || '';
      if (desc.includes('vận chuyển') || desc.includes('shipping')) return 'Phí vận chuyển';
      if (desc.includes('chi phí khác')) return 'Chi phí khác';
      return 'Chi phí';
    };
    const categoryLabel = getLabel();

    return (
        <div className="border rounded-md bg-background text-sm">
             {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- expand/collapse row */}
             <div className="flex flex-col md:flex-row md:items-center p-3 cursor-pointer gap-1 md:gap-0" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center min-w-0">
                    <IconComponent className={`h-4 w-4 ${iconColor} mr-3 shrink-0`} />
                    <Link href={item.type === 'payment' ? `/payments/${item.systemId}` : `/receipts/${item.systemId}`}
                      className="font-semibold font-mono text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.id}
                    </Link>
                    {(isExpense || isRefund) && (
                      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${isRefund ? 'text-info-foreground bg-info/10' : 'text-warning-foreground bg-warning/10'}`}>{categoryLabel}</span>
                    )}
                </div>
                <div className="flex items-center ml-7 md:ml-0 md:grow">
                    <div className="text-muted-foreground md:grow md:text-right md:px-4">
                      {formatDateCustom(parseDate(item.date) || getCurrentDate(), "dd/MM/yyyy")}
                    </div>
                    <div className={`ml-auto md:ml-0 md:w-28 text-right font-semibold ${amountColor}`}>
                      +{formatCurrency(item.amount)}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-11 w-11 ml-2 shrink-0" 
                      title="In phiếu"
                      onClick={(e) => onPrint(e, item)}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-11 w-11 ml-2 shrink-0" aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}>
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
            
            {isExpanded && (
                <div className="p-4 border-t bg-muted/50 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                        <DetailField label="Loại" value={categoryLabel} className="py-1 border-0" />
                        <DetailField label="Phương thức" value={item.method} className="py-1 border-0" />
                        <DetailField 
                            label="Người tạo" 
                            className="py-1 border-0"
                            value={creatorSystemId ? (
                                <Link href={`/employees/${creatorSystemId}`} className="text-primary hover:underline">
                                    {creatorName}
                                </Link>
                            ) : item.creator}
                        />
                        <DetailField label="Diễn giải" value={item.description} className="py-1 border-0 col-span-2" />
                    </div>
                </div>
            )}
        </div>
    );
}

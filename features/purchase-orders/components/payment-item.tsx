import * as React from 'react';
import Link from 'next/link';
import { formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import { Button } from '@/components/ui/button';
import { Banknote, Truck, Printer, ChevronRight, ChevronDown } from 'lucide-react';
import { DetailField } from '@/components/ui/detail-field';
import { useAllEmployees, useEmployeeFinder } from '../../employees/hooks/use-all-employees';
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
    const [isExpanded, setIsExpanded] = React.useState(false);
    const { findById: findEmployeeById } = useEmployeeFinder();
    const { data: employees } = useAllEmployees();

    const creator = React.useMemo(() => {
        const bySystemId = findEmployeeById(item.creator);
        if (bySystemId) return bySystemId;
        return employees.find(e => e.id === (item.creator as unknown as string));
    }, [findEmployeeById, employees, item.creator]);

    // Determine if this is an expense (shipping/other fee) vs supplier payment
    const isExpense = item.category === 'expense';
    const IconComponent = isExpense ? Truck : Banknote;
    const iconColor = isExpense ? 'text-orange-500' : 'text-green-500';
    const amountColor = isExpense ? 'text-orange-600' : 'text-green-600';
    
    // Parse expense type from description
    const getExpenseLabel = () => {
      if (!isExpense) return 'Thanh toán NCC';
      const desc = item.description?.toLowerCase() || '';
      if (desc.includes('vận chuyển') || desc.includes('shipping')) return 'Phí vận chuyển';
      if (desc.includes('chi phí khác')) return 'Chi phí khác';
      return 'Chi phí';
    };
    const categoryLabel = getExpenseLabel();

    return (
        <div className="border rounded-md bg-background text-sm">
             <div className="flex items-center p-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <IconComponent className={`h-4 w-4 ${iconColor} mr-3 shrink-0`} />
                <Link href={item.type === 'payment' ? `/payments/${item.systemId}` : `/receipts/${item.systemId}`}
                  className="font-semibold font-mono text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.id}
                </Link>
                {isExpense && (
                  <span className="ml-2 text-xs text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">{categoryLabel}</span>
                )}
                <div className="grow text-right text-muted-foreground px-4">
                  {formatDateCustom(parseDate(item.date) || getCurrentDate(), "dd/MM/yyyy")}
                </div>
                <div className={`w-28 text-right font-semibold ${amountColor}`}>
                  +{formatCurrency(item.amount)}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 ml-2 shrink-0" 
                  title="In phiếu"
                  onClick={(e) => onPrint(e, item)}
                >
                  <Printer className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 ml-2 shrink-0">
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
            </div>
            
            {isExpanded && (
                <div className="p-4 border-t bg-muted/50 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                        <DetailField label="Loại" value={categoryLabel} className="py-1 border-0" />
                        <DetailField label="Phương thức" value={item.method} className="py-1 border-0" />
                        <DetailField 
                            label="Người tạo" 
                            className="py-1 border-0"
                            value={creator ? (
                                <Link href={`/employees/${creator.systemId}`} className="text-primary hover:underline">
                                    {creator.fullName}
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

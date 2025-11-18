import * as React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import type { OrderPayment } from '../types.ts';
import { Button } from '../../../components/ui/button.tsx';
import { DetailField } from '../../../components/ui/detail-field.tsx';
import { cn } from '../../../lib/utils.ts';
import { ChevronRight, ChevronDown, Printer, Banknote, Minus } from 'lucide-react';
import { Badge } from '../../../components/ui/badge.tsx';
const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};



interface PaymentInfoProps {
    payment: OrderPayment;
}

export function PaymentInfo({ payment }: PaymentInfoProps) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    
    // Determine if this is a payment (negative amount) or receipt (positive amount)
    const isPayment = payment.amount < 0;
    const isWarrantyPayment = !!(payment as any).linkedWarrantySystemId;
    const detailLink = isPayment ? `/payments/${payment.systemId}` : `/receipts/${payment.systemId}`;

    return (
        <div className="border rounded-md bg-background text-sm">
            {/* Header */}
            <div className="flex items-center p-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                {isPayment ? (
                    <Minus className="h-4 w-4 text-red-500 mr-3 flex-shrink-0" />
                ) : (
                    <Banknote className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                )}
                <Link 
                    to={detailLink} 
                    className="font-semibold font-mono text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()} // Prevent collapsing when clicking link
                >
                    {payment.id}
                </Link>
                {isWarrantyPayment && (
                    <Badge variant="secondary" className="ml-2 text-xs">Bảo hành</Badge>
                )}
                <div className="flex-grow text-right text-muted-foreground px-4">
                    {formatDate(payment.date)}
                </div>
                <div className={cn(
                    "w-28 text-right font-semibold",
                    isPayment ? "text-red-600" : "text-green-600"
                )}>
                    {isPayment ? '-' : '+'}{formatCurrency(Math.abs(payment.amount))}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 ml-2 flex-shrink-0">
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
            </div>
            
            {/* Content */}
            {isExpanded && (
                <div className="p-4 border-t bg-muted/50 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                        <DetailField label="Phương thức" value={payment.method} className="py-1 border-0" />
                        <DetailField label="Người tạo" value={payment.createdBy} className="py-1 border-0" />
                        <DetailField label="Diễn giải" value={payment.description} className="py-1 border-0 col-span-2" />
                        {isWarrantyPayment && (payment as any).linkedWarrantySystemId && (
                            <DetailField 
                                label="Liên kết" 
                                value={
                                    <Link 
                                        to={`/warranty/${(payment as any).linkedWarrantySystemId}`}
                                        className="text-primary hover:underline"
                                    >
                                        Xem phiếu bảo hành
                                    </Link>
                                } 
                                className="py-1 border-0 col-span-2" 
                            />
                        )}
                    </div>
                    <div className="flex justify-end pt-2">
                         <Button variant="ghost" size="sm" onClick={() => alert('Chức năng đang phát triển')}><Printer className="mr-2 h-4 w-4" /> In phiếu</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

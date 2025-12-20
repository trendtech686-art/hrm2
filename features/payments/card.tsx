import * as React from "react";
import { formatDateCustom } from '../../lib/date-utils';
import type { Payment } from './types';
import type { SystemId } from '../../lib/id-types';
import { Card, CardContent, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { TouchButton } from "../../components/mobile/touch-button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { MoreHorizontal, Calendar, User, Building2, FileText, XCircle, Eye, Pencil } from "lucide-react";

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return formatDateCustom(date, "dd/MM/yyyy");
};

const getStatusBadge = (status?: Payment['status']) => {
    const normalizedStatus: Payment['status'] = status === 'cancelled' ? 'cancelled' : 'completed';
    const variants: Record<Payment['status'], { label: string; variant: 'default' | 'destructive' }> = {
        completed: { label: 'Hoàn thành', variant: 'default' },
        cancelled: { label: 'Đã hủy', variant: 'destructive' },
    };
    const config = variants[normalizedStatus];
    return <Badge variant={config.variant}>{config.label}</Badge>;
};

export interface MobilePaymentCardProps {
    payment: Payment;
    onCancel: (systemId: SystemId) => void;
    navigate: (path: string) => void;
    handleRowClick: (payment: Payment) => void;
}

export const MobilePaymentCard = ({ payment, onCancel, navigate, handleRowClick }: MobilePaymentCardProps) => {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleRowClick(payment)}
        >
            <CardContent className="p-4">
                {/* Header: ID + Amount + Menu */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <CardTitle className="font-semibold text-sm truncate">{payment.id}</CardTitle>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-sm font-medium text-destructive">{formatCurrency(payment.amount)} ₫</span>
                        </div>
                    </div>
                    {payment.status !== 'cancelled' && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <TouchButton
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 w-10 p-0 flex-shrink-0"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </TouchButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/payments/${payment.systemId}`); }}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/payments/${payment.systemId}/edit`); }}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onClick={(e) => { e.stopPropagation(); onCancel(payment.systemId); }}
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Hủy phiếu
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* Recipient + Payment Method */}
                <div className="text-xs text-muted-foreground mb-3 flex items-center">
                    <User className="h-3 w-3 mr-1.5 flex-shrink-0" />
                    <span className="truncate">{payment.recipientName} • {payment.paymentMethodName}</span>
                </div>

                {/* Divider */}
                <div className="border-t mb-3" />

                {/* Details */}
                <div className="space-y-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1.5 flex-shrink-0" />
                        <span>{formatDateDisplay(payment.date)}</span>
                    </div>
                    {payment.branchName && (
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Building2 className="h-3 w-3 mr-1.5 flex-shrink-0" />
                            <span className="truncate">{payment.branchName}</span>
                        </div>
                    )}
                    {payment.description && (
                        <div className="flex items-center text-xs text-muted-foreground">
                            <FileText className="h-3 w-3 mr-1.5 flex-shrink-0" />
                            <span className="truncate">{payment.description}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between text-xs pt-1">
                        <div className="flex items-center text-muted-foreground">
                            {payment.paymentReceiptTypeName && (
                                <span className="text-xs">{payment.paymentReceiptTypeName}</span>
                            )}
                        </div>
                        {getStatusBadge(payment.status)}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

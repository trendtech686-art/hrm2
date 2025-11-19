import * as React from "react";
import { formatDate, formatDateCustom } from '@/lib/date-utils';
import type { Receipt } from './types';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TouchButton } from "@/components/mobile/touch-button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Calendar, DollarSign, User, Building2, FileText, XCircle, Eye, Pencil } from "lucide-react";
import type { SystemId } from '@/lib/id-types';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return formatDateCustom(date, "dd/MM/yyyy");
};

const getStatusBadge = (status?: Receipt['status']) => {
    const normalizedStatus: Receipt['status'] = status === 'cancelled' ? 'cancelled' : 'completed';
    const variants: Record<Receipt['status'], { label: string; variant: 'default' | 'destructive' }> = {
        completed: { label: 'Hoàn thành', variant: 'default' },
        cancelled: { label: 'Đã hủy', variant: 'destructive' },
    };
    const config = variants[normalizedStatus];
    return <Badge variant={config.variant}>{config.label}</Badge>;
};

export interface MobileReceiptCardProps {
    receipt: Receipt;
    onCancel: (systemId: SystemId) => void;
    navigate: (path: string) => void;
    handleRowClick: (receipt: Receipt) => void;
}

export const MobileReceiptCard = ({ receipt, onCancel, navigate, handleRowClick }: MobileReceiptCardProps) => {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleRowClick(receipt)}
        >
            <CardContent className="p-4">
                {/* Header: ID + Amount + Menu */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <h3 className="font-semibold text-sm truncate">{receipt.id}</h3>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-sm font-medium text-green-600">{formatCurrency(receipt.amount)} ₫</span>
                        </div>
                    </div>
                    {receipt.status !== 'cancelled' && (
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
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/receipts/${receipt.systemId}`); }}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/receipts/${receipt.systemId}/edit`); }}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onClick={(e) => { e.stopPropagation(); onCancel(receipt.systemId); }}
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Hủy phiếu
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* Payer + Payment Method */}
                <div className="text-xs text-muted-foreground mb-3 flex items-center">
                    <User className="h-3 w-3 mr-1.5 flex-shrink-0" />
                    <span className="truncate">{receipt.payerName} • {receipt.paymentMethodName}</span>
                </div>

                {/* Divider */}
                <div className="border-t mb-3" />

                {/* Details */}
                <div className="space-y-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1.5 flex-shrink-0" />
                        <span>{formatDateDisplay(receipt.date)}</span>
                    </div>
                    {receipt.branchName && (
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Building2 className="h-3 w-3 mr-1.5 flex-shrink-0" />
                            <span className="truncate">{receipt.branchName}</span>
                        </div>
                    )}
                    {receipt.description && (
                        <div className="flex items-center text-xs text-muted-foreground">
                            <FileText className="h-3 w-3 mr-1.5 flex-shrink-0" />
                            <span className="truncate">{receipt.description}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between text-xs pt-1">
                        <div className="flex items-center text-muted-foreground">
                            {receipt.paymentReceiptTypeName && (
                                <span className="text-xs">{receipt.paymentReceiptTypeName}</span>
                            )}
                        </div>
                        {getStatusBadge(receipt.status)}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

import * as React from "react";
import { formatDateCustom } from '@/lib/date-utils';
import type { Receipt } from './types';
import type { CashAccount } from "../cashbook/types";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from '@/components/data-table/types';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, RotateCcw, Eye, MoreHorizontal, CheckCircle, XCircle, Printer } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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

const formatDateTimeDisplay = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return formatDateCustom(date, "dd/MM/yyyy HH:mm");
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

export const getColumns = (
    accounts: CashAccount[],
    onCancel: (systemId: SystemId) => void,
    navigate: (path: string) => void,
    onPrint?: (receipt: Receipt) => void
): ColumnDef<Receipt>[] => [
    {
        id: "select",
        header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
            <Checkbox
                checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
                onCheckedChange={(value) => onToggleAll?.(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ onToggleSelect, isSelected }) => (
            <Checkbox
                checked={isSelected}
                onCheckedChange={onToggleSelect}
                aria-label="Select row"
            />
        ),
        size: 48,
        meta: {
            displayName: "Chọn",
            sticky: "left",
        }
    },
    {
        id: "id",
        accessorKey: "id",
        header: ({ sorting, setSorting }) => (
            <DataTableColumnHeader
                title="Mã phiếu"
                sortKey="id"
                isSorted={sorting?.id === 'id'}
                sortDirection={sorting?.desc ? 'desc' : 'asc'}
                onSort={() => setSorting?.((s: any) => ({ id: 'id', desc: s.id === 'id' ? !s.desc : false }))}
            />
        ),
        cell: ({ row }) => <div className="font-medium">{row.id}</div>,
        meta: {
            displayName: "Mã phiếu",
            group: "Thông tin chung"
        },
    },
    {
        id: "date",
        accessorKey: "date",
        header: ({ sorting, setSorting }) => (
            <DataTableColumnHeader
                title="Ngày thu"
                sortKey="date"
                isSorted={sorting?.id === 'date'}
                sortDirection={sorting?.desc ? 'desc' : 'asc'}
                onSort={() => setSorting?.((s: any) => ({ id: 'date', desc: s.id === 'date' ? !s.desc : false }))}
            />
        ),
        cell: ({ row }) => formatDateDisplay(row.date),
        meta: {
            displayName: "Ngày thu",
            group: "Thông tin chung"
        },
    },
    {
        id: "amount",
        accessorKey: "amount",
        header: ({ sorting, setSorting }) => (
            <DataTableColumnHeader
                title="Số tiền"
                sortKey="amount"
                isSorted={sorting?.id === 'amount'}
                sortDirection={sorting?.desc ? 'desc' : 'asc'}
                onSort={() => setSorting?.((s: any) => ({ id: 'amount', desc: s.id === 'amount' ? !s.desc : false }))}
            />
        ),
        cell: ({ row }) => (
            <div className="text-right font-medium text-green-600">
                {formatCurrency(row.amount)} ₫
            </div>
        ),
        meta: {
            displayName: "Số tiền",
            group: "Thông tin chung"
        },
    },
    {
        id: "payerName",
        accessorKey: "payerName",
        header: "Người nộp",
        cell: ({ row }) => (
            <div className="max-w-[200px] truncate" title={row.payerName}>
                {row.payerName}
            </div>
        ),
        meta: {
            displayName: "Người nộp",
            group: "Thông tin người nộp"
        },
    },
    {
        id: "payerTypeName",
        accessorKey: "payerTypeName",
        header: "Loại người nộp",
        cell: ({ row }) => row.payerTypeName,
        meta: {
            displayName: "Loại người nộp",
            group: "Thông tin người nộp"
        },
    },
    {
        id: "paymentMethodName",
        accessorKey: "paymentMethodName",
        header: "Hình thức",
        cell: ({ row }) => row.paymentMethodName,
        meta: {
            displayName: "Hình thức thanh toán",
            group: "Thông tin thanh toán"
        },
    },
    {
        id: "accountSystemId",
        accessorKey: "accountSystemId",
        header: "Tài khoản",
        cell: ({ row }) => {
            const account = accounts.find(a => a.systemId === row.accountSystemId);
            return (
                <div className="max-w-[150px] truncate" title={account?.name}>
                    {account?.name || row.accountSystemId}
                </div>
            );
        },
        meta: {
            displayName: "Tài khoản",
            group: "Thông tin thanh toán"
        },
    },
    {
        id: "paymentReceiptTypeName",
        accessorKey: "paymentReceiptTypeName",
        header: "Loại phiếu",
        cell: ({ row }) => row.paymentReceiptTypeName,
        meta: {
            displayName: "Loại phiếu thu",
            group: "Phân loại"
        },
    },
    {
        id: "status",
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => getStatusBadge(row.status),
        meta: {
            displayName: "Trạng thái",
            group: "Thông tin chung"
        },
    },
    {
        id: "branchName",
        accessorKey: "branchName",
        header: "Chi nhánh",
        cell: ({ row }) => row.branchName,
        meta: {
            displayName: "Chi nhánh",
            group: "Thông tin chi nhánh"
        },
    },
    {
        id: "description",
        accessorKey: "description",
        header: "Diễn giải",
        cell: ({ row }) => (
            <div className="max-w-[300px] truncate" title={row.description}>
                {row.description}
            </div>
        ),
        meta: {
            displayName: "Diễn giải",
            group: "Thông tin chung"
        },
    },
    {
        id: "originalDocumentId",
        accessorKey: "originalDocumentId",
        header: "Chứng từ gốc",
        cell: ({ row }) => row.originalDocumentId,
        meta: {
            displayName: "Chứng từ gốc",
            group: "Liên kết"
        },
    },
    {
        id: "customerName",
        accessorKey: "customerName",
        header: "Khách hàng",
        cell: ({ row }) => row.customerName || '-',
        meta: {
            displayName: "Khách hàng",
            group: "Liên kết"
        },
    },
    {
        id: "affectsDebt",
        accessorKey: "affectsDebt",
        header: "Ảnh hưởng CN",
        cell: ({ row }) => row.affectsDebt ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-gray-400" />,
        meta: {
            displayName: "Ảnh hưởng công nợ",
            group: "Tài chính"
        },
    },
    {
        id: "runningBalance",
        accessorKey: "runningBalance",
        header: "Số dư",
        cell: ({ row }) => row.runningBalance != null ? (
            <div className="text-right">{formatCurrency(row.runningBalance)} ₫</div>
        ) : '-',
        meta: {
            displayName: "Số dư",
            group: "Tài chính"
        },
    },
    {
        id: "recognitionDate",
        accessorKey: "recognitionDate",
        header: "Ngày ghi nhận",
        cell: ({ row }) => formatDateDisplay(row.recognitionDate),
        meta: {
            displayName: "Ngày ghi nhận",
            group: "Thông tin bổ sung"
        },
    },
    {
        id: "createdBy",
        accessorKey: "createdBy",
        header: "Người tạo",
        cell: ({ row }) => row.createdBy,
        meta: {
            displayName: "Người tạo",
            group: "Thông tin hệ thống"
        },
    },
    {
        id: "createdAt",
        accessorKey: "createdAt",
        header: ({ sorting, setSorting }) => (
            <DataTableColumnHeader
                title="Ngày tạo"
                sortKey="createdAt"
                isSorted={sorting?.id === 'createdAt'}
                sortDirection={sorting?.desc ? 'desc' : 'asc'}
                onSort={() => setSorting?.((s: any) => ({ id: 'createdAt', desc: s.id === 'createdAt' ? !s.desc : false }))}
            />
        ),
        cell: ({ row }) => formatDateTimeDisplay(row.createdAt),
        meta: {
            displayName: "Ngày tạo",
            group: "Thông tin hệ thống"
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Hành động</div>,
        cell: ({ row }) => {
            const receipt = row as unknown as Receipt;
            const isCancelled = receipt.status === 'cancelled';

            return (
                <div className="flex items-center justify-center gap-0.5">
                    {isCancelled ? (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="text-xs text-muted-foreground px-2">Đã hủy</div>
                                </TooltipTrigger>
                                <TooltipContent>Phiếu đã bị hủy</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 p-0"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPrint?.(receipt);
                                    }}
                                >
                                    <Printer className="mr-2 h-4 w-4" />
                                    In phiếu
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/receipts/${receipt.systemId}/edit`);
                                    }}
                                >
                                    Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onCancel(receipt.systemId);
                                    }}
                                >
                                    Hủy phiếu
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            );
        },
        size: 90,
        meta: {
            displayName: "Hành động",
            sticky: "right",
        },
    },
];

'use client'

import * as React from "react"
import { useRouter } from 'next/navigation';
import { formatDate, formatDateTime } from '@/lib/date-utils'
import { toast } from "sonner"
import { usePageHeader } from "../../contexts/page-header-context";
import { useCustomerStore } from "./store"
import { getColumns } from "./trash-columns"
import { GenericTrashPage } from "../../components/shared/generic-trash-page"
import { Card, CardContent } from "../../components/ui/card"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { ArrowLeft, RotateCcw, Trash2, Phone, Mail, Building2 } from "lucide-react"
import type { Customer } from "@/lib/types/prisma-extended"
import type { SystemId } from '@/lib/id-types'

export function CustomersTrashPage() {
  const { data, getDeleted, restore, remove } = useCustomerStore();
  const router = useRouter();
  
  usePageHeader({
    title: 'Thùng rác khách hàng',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Khách hàng', href: '/customers', isCurrent: false },
      { label: 'Thùng rác', href: '', isCurrent: true },
    ],
    showBackButton: false,
    actions: [
      <Button key="back" variant="outline" size="sm" className="h-9" onClick={() => router.push('/customers')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>,
    ],
  });
  
  // React to store changes by depending on data array
  const deletedCustomers = React.useMemo(() => getDeleted(), [data]);

  // Handlers for column actions
  const handleRestoreFromColumn = React.useCallback((systemId: SystemId) => {
    restore(systemId);
    toast.success("Đã khôi phục khách hàng");
  }, [restore]);

  const handleDeleteFromColumn = React.useCallback(async (systemId: SystemId) => {
    try {
      remove(systemId);
      toast.success("Đã xóa vĩnh viễn khách hàng");
    } catch (error) {
      toast.error("Có lỗi khi xóa khách hàng");
      console.error(error);
    }
  }, [remove]);

  const columns = React.useMemo(
    () => getColumns(router, handleRestoreFromColumn, handleDeleteFromColumn),
    [router, handleRestoreFromColumn, handleDeleteFromColumn, data]
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Custom mobile card for customers - shadcn style
  const renderMobileCard = (customer: Customer) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {getInitials(customer.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold truncate">{customer.name}</h3>
              <Badge variant="outline" className="shrink-0 text-xs">{customer.id}</Badge>
            </div>
            
            {customer.company && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Building2 className="h-3 w-3" />
                <span className="truncate">{customer.company}</span>
              </div>
            )}
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {customer.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {customer.phone}
                </span>
              )}
              {customer.email && (
                <span className="flex items-center gap-1 truncate">
                  <Mail className="h-3 w-3" />
                  {customer.email}
                </span>
              )}
            </div>
            
            {customer.deletedAt && (
              <p className="text-xs text-muted-foreground">
                Đã xóa: {formatDateTime(customer.deletedAt)}
              </p>
            )}
          </div>
          
          <div className="flex flex-col gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={(e) => {
                e.stopPropagation();
                handleRestoreFromColumn(customer.systemId);
              }}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFromColumn(customer.systemId);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <GenericTrashPage
      deletedItems={deletedCustomers}
      onRestore={restore}
      onPermanentDelete={async (systemId) => {
        remove(systemId);
      }}
      title="Thùng rác khách hàng"
      entityName="khách hàng"
      backUrl="/customers"
      columns={columns}
      renderMobileCard={renderMobileCard}
      getItemDisplayName={(customer) => customer.name}
    />
  );
}

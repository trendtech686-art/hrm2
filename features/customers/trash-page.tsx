import * as React from "react"
import { useNavigate } from 'react-router-dom';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils'
import { toast } from "sonner"
import { usePageHeader } from "../../contexts/page-header-context.tsx";
import { useCustomerStore } from "./store.ts"
import { getColumns } from "./trash-columns.tsx"
import { GenericTrashPage } from "../../components/shared/generic-trash-page.tsx"
import { Card, CardContent } from "../../components/ui/card.tsx"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar.tsx"
import type { Customer } from "./types.ts"

export function CustomersTrashPage() {
  const { data, getDeleted, restore, remove } = useCustomerStore();
  const navigate = useNavigate();
  
  usePageHeader();
  
  // React to store changes by depending on data array
  const deletedCustomers = React.useMemo(() => getDeleted(), [data]);

  // Handlers for column actions (these will be called from column buttons)
  const handleRestoreFromColumn = React.useCallback((systemId: string) => {
    restore(systemId);
    toast.success("Đã khôi phục khách hàng");
  }, [restore]);

  const handleDeleteFromColumn = React.useCallback(async (systemId: string) => {
    try {
      remove(systemId);
      toast.success("Đã xóa vĩnh viễn khách hàng");
    } catch (error) {
      toast.error("Có lỗi khi xóa khách hàng");
      console.error(error);
    }
  }, [remove]);

  const columns = React.useMemo(
    () => {
      // Pass real handlers to columns for button clicks
      return getColumns(navigate, handleRestoreFromColumn, handleDeleteFromColumn);
    },
    [navigate, handleRestoreFromColumn, handleDeleteFromColumn, data] // Add data to re-create columns on store update
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Custom mobile card for customers
  const renderMobileCard = (customer: Customer) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{customer.name}</h3>
              <p className="text-sm text-muted-foreground">{customer.id}</p>
              {customer.company && (
                <div className="text-sm text-muted-foreground mt-1">
                  {customer.company}
                </div>
              )}
            </div>
          </div>
          {customer.deletedAt && (
            <div className="text-xs text-muted-foreground">
              Xóa: {formatDateTime(customer.deletedAt)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <GenericTrashPage
      deletedItems={deletedCustomers}
      onRestore={restore}
      onPermanentDelete={async (systemId: string) => {
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

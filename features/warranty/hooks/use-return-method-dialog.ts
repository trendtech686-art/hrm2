import * as React from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import type { ComboboxOption } from '../../../components/ui/virtualized-combobox';
import type { WarrantyTicket } from '../types';
import type { Order } from '../../orders/types';
import { updateReturnMethodAction, updateWarrantyStatusAction } from '../../../app/actions/warranty';
import { logError } from '@/lib/logger';
import { useOrderSelection } from './use-order-selection';

type ReturnMethod = 'direct' | 'order' | null;

interface UseReturnMethodDialogOptions {
  ticket: WarrantyTicket | null;
  linkedOrder?: Order | undefined | null;
  currentUserName: string;
}

export interface ReturnMethodDialogState {
  isOpen: boolean;
  returnMethod: ReturnMethod;
  selectedOrderValue: ComboboxOption | null;
  orderSearchResults: import('../../orders/order-search-api').OrderSearchResult[];
  orderSearchQuery: string;
  isSearchingOrders: boolean;
  totalOrderCount: number;
  currentMethodLabel: string | null;
  hasMoreOrders: boolean;
  isLoadingMoreOrders: boolean;
}

export interface ReturnMethodDialogApi extends ReturnMethodDialogState {
  openDialog: () => void;
  handleOpenChange: (open: boolean) => void;
  handleReturnMethodChange: (method: ReturnMethod) => void;
  handleOrderSelect: (option: ComboboxOption | null) => void;
  handleOrderSearchChange: (query: string) => void;
  handleConfirmDirect: () => void;
  handleConfirmWithOrder: () => Promise<void>;
  handleLoadMoreOrders: () => void;
  resetDialog: () => void;
}

export function useReturnMethodDialog({
  ticket,
  linkedOrder,
}: UseReturnMethodDialogOptions): ReturnMethodDialogApi {
  const queryClient = useQueryClient();
  const invalidateWarranty = React.useCallback(() => {
    if (!ticket) return;
    invalidateRelated(queryClient, 'warranties');
    queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
  }, [queryClient, ticket]);

  const [isOpen, setIsOpen] = React.useState(false);
  const [returnMethod, setReturnMethod] = React.useState<ReturnMethod>(null);

  // Resolve customer systemId from warranty ticket
  const customerSystemId = ticket?.customerSystemId ?? (ticket as unknown as Record<string, string> | null)?.customerId;

  // Use shared order selection hook
  const orderSelection = useOrderSelection({
    branchSystemId: ticket?.branchSystemId,
    customerSystemId,
    initialSelectedOrderId: ticket?.linkedOrderSystemId,
    autoSearch: false, // We'll control when to search
  });

  // Track triggerSearch for useEffect without causing re-renders
  const triggerSearchRef = React.useRef(orderSelection.triggerSearch);
  triggerSearchRef.current = orderSelection.triggerSearch;

  // Trigger search when dialog opens (only when isOpen changes)
  React.useEffect(() => {
    if (isOpen) {
      triggerSearchRef.current();
    }
  }, [isOpen]);

  // Computed: selectedOrderValue maps to the hook's selectedOrder
  const selectedOrderValue = orderSelection.selectedOrder;

  // If linkedOrder is available, enhance the selected order display
  const selectedOrderWithLinkedOrder = React.useMemo<ComboboxOption | null>(() => {
    if (!selectedOrderValue) return null;
    if (linkedOrder && linkedOrder.systemId === selectedOrderValue.value) {
      return {
        value: linkedOrder.systemId,
        label: `${linkedOrder.id} - ${linkedOrder.customerName}`,
        subtitle: `${(linkedOrder.grandTotal || 0).toLocaleString('vi-VN')} đ`,
      };
    }
    return selectedOrderValue;
  }, [linkedOrder, selectedOrderValue]);

  const currentMethodLabel = React.useMemo(() => {
    if (!ticket) return null;
    if (ticket.linkedOrderSystemId) {
      return `Giao qua đơn hàng (${linkedOrder?.id || 'N/A'})`;
    }
    if (ticket.status === 'RETURNED') {
      return 'Khách lấy trực tiếp tại cửa hàng';
    }
    return null;
  }, [linkedOrder?.id, ticket]);

  const resetDialog = React.useCallback(() => {
    orderSelection.reset();
    setReturnMethod(null);
  }, [orderSelection]);

  const openDialog = React.useCallback(() => {
    if (ticket?.linkedOrderSystemId) {
      setReturnMethod('order');
    } else {
      setReturnMethod('direct');
    }
    orderSelection.reset();
    setIsOpen(true);
  }, [ticket?.linkedOrderSystemId, orderSelection]);

  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    if (!nextOpen) {
      resetDialog();
    }
    setIsOpen(nextOpen);
  }, [resetDialog]);

  const handleReturnMethodChange = React.useCallback((method: ReturnMethod) => {
    setReturnMethod(method);
  }, []);

  const handleOrderSelect = React.useCallback((option: ComboboxOption | null) => {
    orderSelection.setSelectedOrder(option);
  }, [orderSelection]);

  const handleOrderSearchChange = React.useCallback((query: string) => {
    orderSelection.setSearchQuery(query);
  }, [orderSelection]);

  const handleLoadMoreOrders = React.useCallback(() => {
    orderSelection.loadMore();
  }, [orderSelection]);

  const handleConfirmDirect = React.useCallback(async () => {
    if (!ticket) return;

    try {
      if (ticket.status === 'RETURNED') {
        const result = await updateReturnMethodAction({
          systemId: ticket.systemId,
          method: 'direct',
        });

        if (!result.success) {
          toast.error(result.error || 'Không thể cập nhật');
          return;
        }

        invalidateWarranty();
        toast.success('Đã cập nhật phương thức trả hàng', {
          description: 'Đổi sang: Khách lấy trực tiếp tại cửa hàng.',
        });
      } else {
        const result = await updateWarrantyStatusAction({
          systemId: ticket.systemId,
          newStatus: 'RETURNED',
          note: 'Khách lấy trực tiếp tại cửa hàng',
        });

        if (!result.success) {
          toast.error(result.error || 'Không thể trả hàng');
          return;
        }

        invalidateWarranty();
        toast.success('Đã trả hàng cho khách', {
          description: 'Khách đã lấy hàng trực tiếp tại cửa hàng.',
        });
      }

      resetDialog();
      setIsOpen(false);
    } catch (error) {
      logError('Failed to mark as returned', error);
      toast.error('Không thể cập nhật');
    }
  }, [ticket, invalidateWarranty, resetDialog]);

  const handleConfirmWithOrder = React.useCallback(async () => {
    if (!ticket) return;
    const selectedOrderId = orderSelection.getSelectedOrderId();
    if (!selectedOrderId) {
      toast.error('Vui lòng chọn đơn hàng');
      return;
    }

    // Find the order from results to get the business ID
    const selectedOrderResult = orderSelection.searchResults.find((o) => o.value === selectedOrderId);
    const orderIdFromLabel = selectedOrderResult?.label.split(' - ')[0] || selectedOrderId;

    try {
      if (ticket.status === 'RETURNED') {
        const result = await updateReturnMethodAction({
          systemId: ticket.systemId,
          method: 'order',
          linkedOrderSystemId: selectedOrderId,
          linkedOrderId: orderIdFromLabel,
        });

        if (!result.success) {
          toast.error(result.error || 'Không thể cập nhật');
          return;
        }

        invalidateWarranty();
        toast.success('Đã cập nhật phương thức trả hàng', {
          description: `Đổi sang: Giao qua đơn hàng ${orderIdFromLabel}.`,
        });
      } else {
        const result = await updateWarrantyStatusAction({
          systemId: ticket.systemId,
          newStatus: 'RETURNED',
          note: `Liên kết với đơn hàng ${orderIdFromLabel}`,
        });

        if (!result.success) {
          toast.error(result.error || 'Không thể trả hàng');
          return;
        }

        await updateReturnMethodAction({
          systemId: ticket.systemId,
          method: 'order',
          linkedOrderSystemId: selectedOrderId,
          linkedOrderId: orderIdFromLabel,
        });

        invalidateWarranty();
        toast.success('Đã trả hàng cho khách', {
          description: `Đã liên kết với đơn hàng ${orderIdFromLabel}.`,
        });
      }

      resetDialog();
      setIsOpen(false);
    } catch (error) {
      logError('Failed to link order', error);
      toast.error('Không thể cập nhật');
    }
  }, [ticket, orderSelection, invalidateWarranty, resetDialog]);

  return {
    isOpen,
    returnMethod,
    selectedOrderValue: selectedOrderWithLinkedOrder,
    orderSearchResults: orderSelection.searchResults,
    orderSearchQuery: orderSelection.searchQuery,
    isSearchingOrders: orderSelection.isSearching,
    totalOrderCount: orderSelection.totalCount,
    currentMethodLabel,
    hasMoreOrders: orderSelection.hasMore,
    isLoadingMoreOrders: orderSelection.isLoadingMore,
    openDialog,
    handleOpenChange,
    handleReturnMethodChange,
    handleOrderSelect,
    handleOrderSearchChange,
    handleConfirmDirect,
    handleConfirmWithOrder,
    handleLoadMoreOrders,
    resetDialog,
  };
}

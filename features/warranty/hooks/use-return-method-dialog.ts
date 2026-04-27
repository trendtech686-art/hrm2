import * as React from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import { searchOrdersPaginated, type OrderSearchResult } from '../../orders/order-search-api';
import type { ComboboxOption } from '../../../components/ui/virtualized-combobox';
import type { WarrantyTicket } from '../types';
import type { Order } from '../../orders/types';
import { updateReturnMethodAction, updateWarrantyStatusAction } from '../../../app/actions/warranty';
import { logError } from '@/lib/logger'

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
  orderSearchResults: OrderSearchResult[];
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
    // Direct await (not useMutation) → MutationCache doesn't fire → manual invalidate
    queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
  }, [queryClient, ticket]);

  const [isOpen, setIsOpen] = React.useState(false);
  const [returnMethod, setReturnMethod] = React.useState<ReturnMethod>(null);
  const [selectedOrderId, setSelectedOrderId] = React.useState('');
  const [orderSearchQuery, setOrderSearchQuery] = React.useState('');
  const [orderSearchResults, setOrderSearchResults] = React.useState<OrderSearchResult[]>([]);
  const [isSearchingOrders, setIsSearchingOrders] = React.useState(false);
  const [totalOrderCount, setTotalOrderCount] = React.useState(0);
  const [hasMoreOrders, setHasMoreOrders] = React.useState(false);
  const [isLoadingMoreOrders, setIsLoadingMoreOrders] = React.useState(false);
  const [orderPage, setOrderPage] = React.useState(1);

  const ORDER_PAGE_SIZE = 30;

  // VirtualizedCombobox already debounces at 300ms — no need for additional hook-level debounce

  const selectedOrderValue = React.useMemo<ComboboxOption | null>(() => {
    if (!selectedOrderId) return null;
    const option = orderSearchResults.find((item) => item.value === selectedOrderId);
    if (option) return option;
    if (linkedOrder && linkedOrder.systemId === selectedOrderId) {
      return {
        value: linkedOrder.systemId,
        label: `${linkedOrder.id} - ${linkedOrder.customerName}`,
        subtitle: `${(linkedOrder.grandTotal || 0).toLocaleString('vi-VN')} đ`,
      };
    }
    return null;
  }, [linkedOrder, orderSearchResults, selectedOrderId]);

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
    setSelectedOrderId('');
    setOrderSearchQuery('');
    setReturnMethod(null);
    setOrderPage(1);
    setOrderSearchResults([]);
    setHasMoreOrders(false);
    setTotalOrderCount(0);
  }, []);

  const openDialog = React.useCallback(() => {
    if (ticket?.linkedOrderSystemId) {
      setReturnMethod('order');
      setSelectedOrderId(ticket.linkedOrderSystemId);
    } else {
      setReturnMethod('direct');
      setSelectedOrderId('');
    }
    setOrderSearchQuery('');
    setIsOpen(true);
  }, [ticket?.linkedOrderSystemId]);

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
    setSelectedOrderId(option?.value || '');
  }, []);

  const handleOrderSearchChange = React.useCallback((query: string) => {
    setOrderSearchQuery(query);
    setOrderPage(1);
  }, []);

  // Resolve customer systemId from warranty ticket (may be customerSystemId or customerId in runtime data)
  const customerSystemId = ticket?.customerSystemId ?? (ticket as unknown as Record<string, string> | null)?.customerId;

  // Fetch orders with pagination (page 1 on query change, append on load more)
  React.useEffect(() => {
    if (!isOpen) return;
    
    let isCancelled = false;

    async function fetchOrders() {
      if (orderPage === 1) {
        setIsSearchingOrders(true);
      } else {
        setIsLoadingMoreOrders(true);
      }
      try {
        const { results, total, hasMore } = await searchOrdersPaginated({
          query: orderSearchQuery || '',
          limit: ORDER_PAGE_SIZE,
          page: orderPage,
          branchSystemId: ticket?.branchSystemId,
          customerSystemId: customerSystemId || undefined,
        });
        if (!isCancelled) {
          setOrderSearchResults(prev => orderPage === 1 ? results : [...prev, ...results]);
          setTotalOrderCount(total);
          setHasMoreOrders(hasMore);
        }
      } catch (error) {
        if (!isCancelled) {
          logError('Failed to search orders', error);
          toast.error('Không thể tìm đơn hàng, vui lòng thử lại');
        }
      } finally {
        if (!isCancelled) {
          setIsSearchingOrders(false);
          setIsLoadingMoreOrders(false);
        }
      }
    }

    fetchOrders();
    return () => {
      isCancelled = true;
    };
  }, [isOpen, orderSearchQuery, orderPage, ticket?.branchSystemId, customerSystemId]);

  const handleLoadMoreOrders = React.useCallback(() => {
    if (!hasMoreOrders || isLoadingMoreOrders) return;
    setOrderPage(prev => prev + 1);
  }, [hasMoreOrders, isLoadingMoreOrders]);

  const handleConfirmDirect = React.useCallback(async () => {
    if (!ticket) return;

    try {
      if (ticket.status === 'RETURNED') {
        // Update return method on already-returned ticket
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
        // First-time return: change status to RETURNED
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
    if (!ticket || !selectedOrderId) {
      toast.error('Vui lòng chọn đơn hàng');
      return;
    }

    const selectedOrderResult = orderSearchResults.find((o) => o.value === selectedOrderId);
    if (!selectedOrderResult) {
      toast.error('Không tìm thấy đơn hàng');
      return;
    }

    const orderIdFromLabel = selectedOrderResult.label.split(' - ')[0];

    try {
      if (ticket.status === 'RETURNED') {
        // Update return method on already-returned ticket
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
        // First-time return: change status to RETURNED + link order
        const result = await updateWarrantyStatusAction({
          systemId: ticket.systemId,
          newStatus: 'RETURNED',
          note: `Liên kết với đơn hàng ${orderIdFromLabel}`,
        });

        if (!result.success) {
          toast.error(result.error || 'Không thể trả hàng');
          return;
        }

        // Also set the linked order
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
  }, [
    ticket,
    selectedOrderId,
    orderSearchResults,
    invalidateWarranty,
    resetDialog,
  ]);

  return {
    isOpen,
    returnMethod,
    selectedOrderValue,
    orderSearchResults,
    orderSearchQuery,
    isSearchingOrders,
    totalOrderCount,
    currentMethodLabel,
    hasMoreOrders,
    isLoadingMoreOrders,
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

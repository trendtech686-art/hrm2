import * as React from 'react';
import { toast } from 'sonner';
import { useDebounce } from '../../../hooks/use-debounce';
import { searchOrders, type OrderSearchResult } from '../../orders/order-search-api';
import type { ComboboxOption } from '../../../components/ui/virtualized-combobox';
import type { WarrantyTicket } from '../types';
import type { Order } from '../../orders/types';
import { useWarrantyMutations } from './use-warranties';
import { getCurrentDate, toISODateTime } from '../../../lib/date-utils';
import { asSystemId } from '@/lib/id-types';

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
}

export interface ReturnMethodDialogApi extends ReturnMethodDialogState {
  openDialog: () => void;
  handleOpenChange: (open: boolean) => void;
  handleReturnMethodChange: (method: ReturnMethod) => void;
  handleOrderSelect: (option: ComboboxOption | null) => void;
  handleOrderSearchChange: (query: string) => void;
  handleConfirmDirect: () => void;
  handleConfirmWithOrder: () => Promise<void>;
  resetDialog: () => void;
}

export function useReturnMethodDialog({
  ticket,
  linkedOrder,
  currentUserName,
}: UseReturnMethodDialogOptions): ReturnMethodDialogApi {
  const { update: updateMutation } = useWarrantyMutations();
  
  // Wrapper functions for legacy interface
  const update = React.useCallback((systemId: string, data: Partial<WarrantyTicket>) => {
    updateMutation.mutate({ systemId, data });
  }, [updateMutation]);
  
  const updateStatus = React.useCallback((systemId: string, status: WarrantyTicket['status'], reason?: string) => {
    updateMutation.mutate({ systemId, data: { status, ...(reason && { statusReason: reason }) } });
  }, [updateMutation]);
  
  const addHistory = React.useCallback((systemId: string, action: string, performedBy: string) => {
    if (!ticket?.history) return;
    const newEntry = {
      action,
      performedBy,
      performedAt: toISODateTime(getCurrentDate()),
    };
    const newHistory = [...ticket.history, newEntry];
    updateMutation.mutate({ systemId, data: { history: newHistory as unknown as WarrantyTicket['history'] } });
  }, [ticket?.history, updateMutation]);

  const [isOpen, setIsOpen] = React.useState(false);
  const [returnMethod, setReturnMethod] = React.useState<ReturnMethod>(null);
  const [selectedOrderId, setSelectedOrderId] = React.useState('');
  const [orderSearchQuery, setOrderSearchQuery] = React.useState('');
  const [orderSearchResults, setOrderSearchResults] = React.useState<OrderSearchResult[]>([]);
  const [isSearchingOrders, setIsSearchingOrders] = React.useState(false);

  const debouncedOrderQuery = useDebounce(orderSearchQuery, 400);

  // ⚡ OPTIMIZED: Removed totalOrderCount dependency on all orders - not needed for functionality
  const totalOrderCount = 0;

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
  }, []);

  // ✅ FIX: Only fetch orders when dialog is open to avoid unnecessary API calls
  React.useEffect(() => {
    // Don't fetch if dialog is not open
    if (!isOpen) return;
    
    let isCancelled = false;

    async function fetchOrders() {
      setIsSearchingOrders(true);
      try {
        // ⚡ OPTIMIZED: Use API search instead of client-side filtering
        const results = await searchOrders({
          query: debouncedOrderQuery || '',
          limit: 50,
          branchSystemId: ticket?.branchSystemId,
        });
        if (!isCancelled) {
          setOrderSearchResults(results);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Failed to search orders', error);
          toast.error('Không thể tìm đơn hàng, vui lòng thử lại');
        }
      } finally {
        if (!isCancelled) {
          setIsSearchingOrders(false);
        }
      }
    }

    fetchOrders();
    return () => {
      isCancelled = true;
    };
  }, [isOpen, debouncedOrderQuery, ticket?.branchSystemId]);

  const handleConfirmDirect = React.useCallback(() => {
    if (!ticket) return;

    try {
      if (ticket.status === 'RETURNED') {
        update(ticket.systemId, {
          linkedOrderSystemId: undefined,
        });

        addHistory(
          ticket.systemId,
          'Đổi phương thức trả hàng: Giao qua đơn hàng → Khách lấy trực tiếp',
          currentUserName,
        );

        toast.success('Đã cập nhật phương thức trả hàng', {
          description: 'Đổi sang: Khách lấy trực tiếp tại cửa hàng.',
          duration: 5000,
        });
      } else {
        updateStatus(ticket.systemId, 'RETURNED', 'Khách lấy trực tiếp tại cửa hàng');

        update(ticket.systemId, {
          returnedAt: toISODateTime(getCurrentDate()),
        });

        toast.success('Đã trả hàng cho khách', {
          description: 'Khách đã lấy hàng trực tiếp tại cửa hàng.',
          duration: 5000,
        });
      }

      resetDialog();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to mark as returned:', error);
      toast.error('Không thể cập nhật');
    }
  }, [ticket, update, updateStatus, addHistory, currentUserName, resetDialog]);

  const handleConfirmWithOrder = React.useCallback(async () => {
    if (!ticket || !selectedOrderId) {
      toast.error('Vui lòng chọn đơn hàng');
      return;
    }

    // ⚡ NOTE: orderSearchResults contains OrderSearchResult which has value (systemId), label, subtitle
    // We only need systemId and id (from label) for the update
    const selectedOrderResult = orderSearchResults.find((o) => o.value === selectedOrderId);

    if (!selectedOrderResult) {
      toast.error('Không tìm thấy đơn hàng');
      return;
    }

    // Extract order ID from label (format: "DH000001 - Customer Name")
    const orderIdFromLabel = selectedOrderResult.label.split(' - ')[0];

    try {
      if (ticket.status === 'RETURNED') {
        update(ticket.systemId, {
          linkedOrderSystemId: asSystemId(selectedOrderId),
        });

        const oldMethod = ticket.linkedOrderSystemId
          ? `đơn hàng ${linkedOrder?.id || 'N/A'}`
          : 'Khách lấy trực tiếp';

        addHistory(
          ticket.systemId,
          `Đổi phương thức trả hàng: ${oldMethod} → Giao qua đơn hàng ${orderIdFromLabel}`,
          currentUserName,
        );

        toast.success('Đã cập nhật phương thức trả hàng', {
          description: `Đổi sang: Giao qua đơn hàng ${orderIdFromLabel}.`,
          duration: 5000,
        });
      } else {
        updateStatus(ticket.systemId, 'RETURNED', `Liên kết với đơn hàng ${orderIdFromLabel}`);

        update(ticket.systemId, {
          linkedOrderSystemId: asSystemId(selectedOrderId),
          returnedAt: toISODateTime(getCurrentDate()),
        });

        toast.success('Đã trả hàng cho khách', {
          description: `Đã liên kết với đơn hàng ${orderIdFromLabel}.`,
          duration: 5000,
        });
      }

      resetDialog();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to link order:', error);
      toast.error('Không thể cập nhật');
    }
  }, [
    ticket,
    selectedOrderId,
    orderSearchResults,
    update,
    updateStatus,
    addHistory,
    linkedOrder?.id,
    currentUserName,
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
    openDialog,
    handleOpenChange,
    handleReturnMethodChange,
    handleOrderSelect,
    handleOrderSearchChange,
    handleConfirmDirect,
    handleConfirmWithOrder,
    resetDialog,
  };
}

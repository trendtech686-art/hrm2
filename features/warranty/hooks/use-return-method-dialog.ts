import * as React from 'react';
import { toast } from 'sonner';
import { useDebounce } from '../../../hooks/use-debounce';
import { searchOrders, type OrderSearchResult } from '../../orders/order-search-api';
import type { ComboboxOption } from '../../../components/ui/virtualized-combobox';
import type { WarrantyTicket } from '../types';
import type { Order } from '../../orders/types';
import { useWarrantyStore } from '../store';
import { getCurrentDate, toISODateTime } from '../../../lib/date-utils';

type ReturnMethod = 'direct' | 'order' | null;

interface UseReturnMethodDialogOptions {
  ticket: WarrantyTicket | null;
  linkedOrder?: Order | undefined;
  orders: Order[];
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
  orders,
  currentUserName,
}: UseReturnMethodDialogOptions): ReturnMethodDialogApi {
  const update = useWarrantyStore((state) => state.update);
  const updateStatus = useWarrantyStore((state) => state.updateStatus);
  const addHistory = useWarrantyStore((state) => state.addHistory);

  const [isOpen, setIsOpen] = React.useState(false);
  const [returnMethod, setReturnMethod] = React.useState<ReturnMethod>(null);
  const [selectedOrderId, setSelectedOrderId] = React.useState('');
  const [orderSearchQuery, setOrderSearchQuery] = React.useState('');
  const [orderSearchResults, setOrderSearchResults] = React.useState<OrderSearchResult[]>([]);
  const [isSearchingOrders, setIsSearchingOrders] = React.useState(false);

  const debouncedOrderQuery = useDebounce(orderSearchQuery, 400);

  const totalOrderCount = orders.length;

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
    if (ticket.status === 'returned') {
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

  React.useEffect(() => {
    let isCancelled = false;

    async function fetchOrders() {
      setIsSearchingOrders(true);
      try {
        const results = await searchOrders(
          { query: debouncedOrderQuery || '', limit: 50, branchSystemId: ticket?.branchSystemId },
          orders,
        );
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
  }, [debouncedOrderQuery, orders, ticket?.branchSystemId]);

  const handleConfirmDirect = React.useCallback(() => {
    if (!ticket) return;

    try {
      if (ticket.status === 'returned') {
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
        updateStatus(ticket.systemId, 'returned', 'Khách lấy trực tiếp tại cửa hàng');

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

    const selectedOrder = orders.find((o) => o.systemId === selectedOrderId);

    if (!selectedOrder) {
      toast.error('Không tìm thấy đơn hàng');
      return;
    }

    if (
      (selectedOrder as any).linkedWarrantySystemId &&
      (selectedOrder as any).linkedWarrantySystemId !== ticket.systemId
    ) {
      toast.error('Đơn hàng này đã được liên kết với phiếu bảo hành khác', {
        description: 'Vui lòng chọn đơn hàng khác',
        duration: 5000,
      });
      return;
    }

    try {
      if (ticket.status === 'returned') {
        update(ticket.systemId, {
          linkedOrderSystemId: selectedOrder.systemId,
        });

        const oldMethod = ticket.linkedOrderSystemId
          ? `đơn hàng ${linkedOrder?.id || 'N/A'}`
          : 'Khách lấy trực tiếp';

        addHistory(
          ticket.systemId,
          `Đổi phương thức trả hàng: ${oldMethod} → Giao qua đơn hàng ${selectedOrder.id}`,
          currentUserName,
        );

        toast.success('Đã cập nhật phương thức trả hàng', {
          description: `Đổi sang: Giao qua đơn hàng ${selectedOrder.id}.`,
          duration: 5000,
        });
      } else {
        updateStatus(ticket.systemId, 'returned', `Liên kết với đơn hàng ${selectedOrder.id}`);

        update(ticket.systemId, {
          linkedOrderSystemId: selectedOrder.systemId,
          returnedAt: toISODateTime(getCurrentDate()),
        });

        toast.success('Đã trả hàng cho khách', {
          description: `Đã liên kết với đơn hàng ${selectedOrder.id}.`,
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
    orders,
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

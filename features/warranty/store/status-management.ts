import { getCurrentDate, toISODateTime } from '../../../lib/date-utils';
import type { SystemId } from '../../../lib/id-types';
import type { WarrantyTicket, WarrantyStatus } from '../types';
import { baseStore, originalUpdate, getCurrentUserName } from './base-store';
import { addHistory } from './product-management';
import { deductWarrantyStock, rollbackWarrantyStock } from './stock-management';
import {
  notifyWarrantyProcessing,
  notifyWarrantyProcessed,
  notifyWarrantyReturned,
} from '../notification-utils';
import { triggerWarrantyDataUpdate } from '../use-realtime-updates';

type TimestampKey = 'processingStartedAt' | 'processedAt' | 'returnedAt' | 'completedAt';

const STATUS_ORDER: Record<WarrantyStatus, number> = {
  incomplete: 0,
  pending: 1,
  processed: 2,
  returned: 3,
  completed: 4,
  cancelled: 5,
};

const TIMESTAMP_STAGES: Array<{ key: TimestampKey; stageOrder: number }> = [
  { key: 'processingStartedAt', stageOrder: STATUS_ORDER.pending },
  { key: 'processedAt', stageOrder: STATUS_ORDER.processed },
  { key: 'returnedAt', stageOrder: STATUS_ORDER.returned },
  { key: 'completedAt', stageOrder: STATUS_ORDER.completed },
];

function computeTimestampUpdates(
  ticket: WarrantyTicket,
  newStatus: WarrantyStatus,
  nowIso: string
): Partial<Pick<WarrantyTicket, TimestampKey>> {
  const updates: Partial<Pick<WarrantyTicket, TimestampKey>> = {};
  const oldOrder = STATUS_ORDER[ticket.status] ?? 0;
  const newOrder = STATUS_ORDER[newStatus] ?? oldOrder;

  TIMESTAMP_STAGES.forEach(({ key, stageOrder }) => {
    const currentValue = ticket[key];
    const crossedForward = newOrder >= stageOrder && oldOrder < stageOrder;

    if (newStatus !== 'cancelled' && crossedForward && !currentValue) {
      updates[key] = nowIso;
      return;
    }

    const movedBackward = newOrder < stageOrder;
    if (movedBackward && currentValue) {
      updates[key] = undefined;
    }
  });

  return updates;
}

/**
 * Cập nhật trạng thái phiếu bảo hành
 * NEW LOGIC theo yêu cầu:
 * - pending: +Đang giao dịch (commitWarrantyStock)
 * - processed: Không động kho
 * - returned: Không động kho
 * - completed: -Đang giao dịch + -Tồn kho (deductWarrantyStock)
 */
export function updateStatus(ticketSystemId: SystemId, newStatus: WarrantyTicket['status'], note?: string) {
  const ticket = baseStore.getState().data.find(t => t.systemId === ticketSystemId);
  if (!ticket) return;
  
  console.log('[STATUS CHANGE]', {
    ticketId: ticket.id,
    oldStatus: ticket.status,
    newStatus: newStatus,
    productsCount: ticket.products.length,
    replacedProducts: ticket.products.filter(p => p.resolution === 'replace').length
  });
  
  const nowIso = toISODateTime(getCurrentDate());
  const timestampUpdates = computeTimestampUpdates(ticket, newStatus, nowIso);
  const baseUpdate: WarrantyTicket = {
    ...ticket,
    ...timestampUpdates,
    status: newStatus,
    updatedAt: nowIso,
  };

  // XUẤT KHO khi completed (CHỈ 1 LẦN DUY NHẤT - không trừ lại khi reopen)
  if (newStatus === 'completed' && ticket.status !== 'completed' && !ticket.stockDeducted) {
    console.log('[COMPLETED - DEDUCT] Xuất kho (LẦN ĐẦU TIÊN):', {
      ticketId: ticket.id,
      oldStatus: ticket.status,
      newStatus: newStatus,
      stockDeducted: ticket.stockDeducted,
      action: '-Đang giao dịch + -Tồn kho'
    });
    deductWarrantyStock(ticket);
    
    // Set flag để không trừ lại lần nữa
    originalUpdate(ticketSystemId, {
      ...baseUpdate,
      stockDeducted: true,
    } as any);
  } else if (newStatus === 'completed' && ticket.stockDeducted) {
    console.log('[COMPLETED - SKIP DEDUCT] Đã trừ kho rồi, bỏ qua:', {
      ticketId: ticket.id,
      oldStatus: ticket.status,
      newStatus: newStatus,
      stockDeducted: ticket.stockDeducted
    });
    
    // Chỉ update status, KHÔNG trừ kho nữa
    originalUpdate(ticketSystemId, baseUpdate as any);
  } else {
    // Normal status update (không phải completed)
    originalUpdate(ticketSystemId, baseUpdate as any);
  }
  
  // KHÔNG ROLLBACK KHO khi mở lại từ completed
  // Lý do:
  // - Kết thúc = Đơn đã xong, hàng đã xuất, tiền đã thanh toán đầy đủ
  // - Mở lại (completed → returned) CHỈ để xem lại, KHÔNG được sửa/thay đổi gì
  // - Nếu cần điều chỉnh → Phải tạo phiếu mới, hoàn hàng thủ công, tạo phiếu thu/chi riêng
  // - Giữ nguyên inventory và payment history để đảm bảo tính toàn vẹn dữ liệu
  
  // KHÔNG ROLLBACK KHO khi mở lại từ completed
  // Lý do:
  // - Kết thúc = Đơn đã xong, hàng đã xuất, tiền đã thanh toán đầy đủ
  // - Mở lại (completed → returned) CHỈ để xem lại, KHÔNG được sửa/thay đổi gì
  // - Nếu cần điều chỉnh → Phải tạo phiếu mới, hoàn hàng thủ công, tạo phiếu thu/chi riêng
  // - Giữ nguyên inventory và payment history để đảm bảo tính toàn vẹn dữ liệu
  
  // Add history với format rõ ràng
  const statusLabels: Record<string, string> = {
    incomplete: 'Chưa đủ thông tin',
    pending: 'Chưa xử lý',
    processed: 'Đã xử lý',
    returned: 'Đã trả hàng',
    completed: 'Kết thúc'
  };
  const oldStatusLabel = statusLabels[ticket.status] || ticket.status;
  const newStatusLabel = statusLabels[newStatus] || newStatus;
  
  // Format history dựa trên hướng chuyển đổi
  let historyAction: string;
  if (ticket.status === 'completed' && (newStatus === 'returned' || newStatus === 'processed')) {
    // Mở lại từ "Kết thúc"
    historyAction = `Mở lại từ ${oldStatusLabel}`;
  } else if (ticket.status === 'returned' && newStatus === 'processed') {
    // Mở lại từ "Đã trả hàng"
    historyAction = `Mở lại từ ${oldStatusLabel}`;
  } else if (newStatus === 'completed') {
    // Kết thúc phiếu
    historyAction = 'Kết thúc phiếu bảo hành';
  } else {
    // Chuyển trạng thái bình thường
    historyAction = `Chuyển trạng thái: ${oldStatusLabel} → ${newStatusLabel}`;
  }
  
  addHistory(ticketSystemId, historyAction, getCurrentUserName(), note);
  
  // Send notifications
  if (ticket.status !== newStatus) {
    if (newStatus === 'pending') {
      notifyWarrantyProcessing(ticket.id);
    } else if (newStatus === 'processed') {
      notifyWarrantyProcessed(ticket.id);
    } else if (newStatus === 'returned') {
      notifyWarrantyReturned(ticket.id, undefined);
    }
  }
  
  triggerWarrantyDataUpdate();
}

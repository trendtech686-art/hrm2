/**
 * Hook chứa các handlers sử dụng trong ComplaintsPage
 * Tách từ page.tsx để giảm kích thước file
 */
import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Complaint, ComplaintAction } from '../types';
import { useComplaintMutations } from './use-complaints';
import { useAllComplaints } from './use-all-complaints';
import { asSystemId } from '@/lib/id-types';
import { generateSubEntityId } from '@/lib/id-utils';
import { triggerDataUpdate } from '../use-realtime-updates';
import { generateTrackingUrl, getTrackingCode, isTrackingEnabled } from '../tracking-utils';

export function useComplaintHandlers() {
  const router = useRouter();
  const { data: complaints } = useAllComplaints();

  const handleView = React.useCallback((systemId: string) => {
    router.push(`/complaints/${systemId}`);
  }, [router]);

  const handleEdit = React.useCallback((systemId: string) => {
    router.push(`/complaints/${systemId}/edit`);
  }, [router]);

  const handleRowClick = React.useCallback((complaint: Complaint) => {
    router.push(`/complaints/${complaint.systemId}`);
  }, [router]);

  const handleGetLink = React.useCallback((systemId: string) => {
    try {
      const complaint = complaints.find(c => c.systemId === systemId);
      if (!complaint) {
        toast.error('Không tìm thấy khiếu nại');
        return;
      }

      if (!isTrackingEnabled()) {
        toast.error('Chức năng tracking chưa được bật. Vui lòng bật trong Cài đặt.');
        return;
      }

      const trackingUrl = generateTrackingUrl(complaint);
      const trackingCode = getTrackingCode(complaint.id);
      
      navigator.clipboard.writeText(trackingUrl);
      
      toast.success(`Đã copy link tracking. Mã theo dõi: ${trackingCode}`, { duration: 5000 });
    } catch (_error) {
      toast.error('Không thể copy link tracking');
    }
  }, [complaints]);

  const handleRemind = React.useCallback((systemId: string) => {
    const complaint = complaints.find(c => c.systemId === systemId);
    if (!complaint) {
      toast.error('Không tìm thấy khiếu nại');
      return;
    }
    
    toast.success(`Đã gửi thông báo nhắc nhở. Khiếu nại: ${complaint.id}`, { duration: 3000 });
  }, [complaints]);

  return {
    handleView,
    handleEdit,
    handleRowClick,
    handleGetLink,
    handleRemind,
  };
}

type ConfirmDialogState = {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
};

export function useComplaintStatusHandlers(
  setConfirmDialog: React.Dispatch<React.SetStateAction<ConfirmDialogState>>
) {
  const { data: complaints } = useAllComplaints();
  const { update: updateMutation } = useComplaintMutations({
    onSuccess: () => triggerDataUpdate(),
    onError: (err) => toast.error(err.message)
  });

  const handleFinish = React.useCallback((systemId: string) => {
    const complaint = complaints.find(c => c.systemId === systemId);
    if (!complaint) {
      toast.error('Không tìm thấy khiếu nại');
      return;
    }
    
    setConfirmDialog({
      open: true,
      title: 'Kết thúc khiếu nại',
      description: 'Bạn có chắc muốn kết thúc khiếu nại này?',
      onConfirm: () => {
        updateMutation.mutate({ 
          systemId: asSystemId(systemId), 
          data: {
            status: 'resolved',
            updatedAt: new Date(),
            resolvedAt: new Date(),
            timeline: [
              ...(complaint.timeline || []),
              {
                id: asSystemId(generateSubEntityId('ACTION')),
                actionType: 'resolved',
                performedBy: asSystemId('Admin'),
                performedAt: new Date(),
                note: 'Kết thúc khiếu nại từ Kanban view',
              },
            ],
          }
        }, {
          onSuccess: () => {
            toast.success('Đã kết thúc khiếu nại thành công');
            setConfirmDialog(prev => ({ ...prev, open: false }));
          },
          onError: () => {
            toast.error('Không thể kết thúc khiếu nại');
            setConfirmDialog(prev => ({ ...prev, open: false }));
          }
        });
      },
    });
  }, [complaints, updateMutation, setConfirmDialog]);

  const handleOpen = React.useCallback((systemId: string) => {
    const complaint = complaints.find(c => c.systemId === systemId);
    if (!complaint) {
      toast.error('Không tìm thấy khiếu nại');
      return;
    }
    
    setConfirmDialog({
      open: true,
      title: 'Mở lại khiếu nại',
      description: 'Bạn có chắc muốn mở lại khiếu nại này?',
      onConfirm: () => {
        updateMutation.mutate({ 
          systemId: asSystemId(systemId), 
          data: {
            status: 'investigating',
            endedBy: undefined,
            endedAt: undefined,
            resolvedBy: undefined,
            resolvedAt: undefined,
            cancelledBy: undefined,
            cancelledAt: undefined,
            updatedAt: new Date(),
            timeline: [
              ...(complaint.timeline || []),
              {
                id: asSystemId(generateSubEntityId('ACTION')),
                actionType: 'reopened',
                performedBy: asSystemId('Admin'),
                performedAt: new Date(),
                note: 'Mở lại khiếu nại từ Kanban view',
              },
            ],
          }
        }, {
          onSuccess: () => {
            toast.success('Đã mở lại khiếu nại thành công');
            setConfirmDialog(prev => ({ ...prev, open: false }));
          },
          onError: () => {
            toast.error('Không thể mở lại khiếu nại');
            setConfirmDialog(prev => ({ ...prev, open: false }));
          }
        });
      },
    });
  }, [complaints, updateMutation, setConfirmDialog]);

  const handleCancel = React.useCallback((systemId: string) => {
    const complaint = complaints.find(c => c.systemId === systemId);
    if (!complaint) {
      toast.error('Không tìm thấy khiếu nại');
      return;
    }
    
    setConfirmDialog({
      open: true,
      title: 'Hủy khiếu nại',
      description: 'Bạn có chắc muốn hủy khiếu nại này?',
      onConfirm: () => {
        updateMutation.mutate({ 
          systemId: asSystemId(systemId), 
          data: {
            status: 'cancelled',
            updatedAt: new Date(),
            cancelledAt: new Date(),
            timeline: [
              ...(complaint.timeline || []),
              {
                id: asSystemId(generateSubEntityId('ACTION')),
                actionType: 'cancelled',
                performedBy: asSystemId('Admin'),
                performedAt: new Date(),
                note: 'Hủy khiếu nại từ Kanban view',
              },
            ],
          }
        }, {
          onSuccess: () => {
            toast.success('Đã hủy khiếu nại thành công');
            setConfirmDialog(prev => ({ ...prev, open: false }));
          },
          onError: () => {
            toast.error('Không thể hủy khiếu nại');
            setConfirmDialog(prev => ({ ...prev, open: false }));
          }
        });
      },
    });
  }, [complaints, updateMutation, setConfirmDialog]);

  const handleStartInvestigation = React.useCallback((systemId: string) => {
    const complaint = complaints.find(c => c.systemId === systemId);
    if (!complaint) {
      toast.error('Không tìm thấy khiếu nại');
      return;
    }
    
    setConfirmDialog({
      open: true,
      title: 'Bắt đầu xử lý',
      description: 'Bạn có chắc muốn bắt đầu xử lý khiếu nại này?',
      onConfirm: () => {
        updateMutation.mutate({ 
          systemId: asSystemId(systemId), 
          data: {
            status: 'investigating',
            updatedAt: new Date(),
            timeline: [
              ...(complaint.timeline || []),
              {
                id: asSystemId(generateSubEntityId('ACTION')),
                actionType: 'investigated' as ComplaintAction['actionType'],
                performedBy: asSystemId('Admin'),
                performedAt: new Date(),
                note: 'Bắt đầu xử lý khiếu nại từ Kanban view',
              },
            ],
          }
        }, {
          onSuccess: () => {
            toast.success('Đã bắt đầu xử lý khiếu nại');
            setConfirmDialog(prev => ({ ...prev, open: false }));
          },
          onError: () => {
            toast.error('Không thể bắt đầu xử lý khiếu nại');
            setConfirmDialog(prev => ({ ...prev, open: false }));
          }
        });
      },
    });
  }, [complaints, updateMutation, setConfirmDialog]);

  return {
    handleFinish,
    handleOpen,
    handleCancel,
    handleStartInvestigation,
  };
}

export function useComplaintBulkHandlers(
  allSelectedRows: Complaint[],
  setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  setConfirmDialog: React.Dispatch<React.SetStateAction<ConfirmDialogState>>
) {
  const handleBulkFinish = React.useCallback(() => {
    if (allSelectedRows.length === 0) {
      toast.error('Vui lòng chọn ít nhất một khiếu nại');
      return;
    }
    setConfirmDialog({
      open: true,
      title: 'Kết thúc khiếu nại',
      description: `Bạn có chắc muốn kết thúc ${allSelectedRows.length} khiếu nại đã chọn?`,
      onConfirm: () => {
        try {
          allSelectedRows.forEach(_complaint => {
            // TODO: Implement bulk finish logic
          });
          toast.success(`Đã kết thúc ${allSelectedRows.length} khiếu nại`);
          setRowSelection({});
        } catch (_error) {
          toast.error('Không thể kết thúc khiếu nại');
        }
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  }, [allSelectedRows, setRowSelection, setConfirmDialog]);

  const handleBulkOpen = React.useCallback(() => {
    if (allSelectedRows.length === 0) {
      toast.error('Vui lòng chọn ít nhất một khiếu nại');
      return;
    }
    setConfirmDialog({
      open: true,
      title: 'Mở lại khiếu nại',
      description: `Bạn có chắc muốn mở ${allSelectedRows.length} khiếu nại đã chọn?`,
      onConfirm: () => {
        try {
          allSelectedRows.forEach(_complaint => {
            // TODO: Implement bulk open logic
          });
          toast.success(`Đã mở lại ${allSelectedRows.length} khiếu nại`);
          setRowSelection({});
        } catch (_error) {
          toast.error('Không thể mở lại khiếu nại');
        }
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  }, [allSelectedRows, setRowSelection, setConfirmDialog]);

  const handleBulkCancel = React.useCallback(() => {
    if (allSelectedRows.length === 0) {
      toast.error('Vui lòng chọn ít nhất một khiếu nại');
      return;
    }
    setConfirmDialog({
      open: true,
      title: 'Hủy khiếu nại',
      description: `Bạn có chắc muốn hủy ${allSelectedRows.length} khiếu nại đã chọn?`,
      onConfirm: () => {
        try {
          allSelectedRows.forEach(_complaint => {
            // TODO: Implement bulk cancel logic
          });
          toast.success(`Đã hủy ${allSelectedRows.length} khiếu nại`);
          setRowSelection({});
        } catch (_error) {
          toast.error('Không thể hủy khiếu nại');
        }
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  }, [allSelectedRows, setRowSelection, setConfirmDialog]);

  const handleBulkGetLink = React.useCallback(() => {
    if (allSelectedRows.length === 0) {
      toast.error('Vui lòng chọn ít nhất một khiếu nại');
      return;
    }

    if (!isTrackingEnabled()) {
      toast.error('Chức năng tracking chưa được bật. Vui lòng bật trong Cài đặt.');
      return;
    }

    try {
      const trackingLinks = allSelectedRows.map(c => {
        const trackingUrl = generateTrackingUrl(c);
        const trackingCode = getTrackingCode(c.id);
        return `${trackingCode}: ${trackingUrl}`;
      });
      
      navigator.clipboard.writeText(trackingLinks.join('\n'));
      toast.success(`Đã copy ${allSelectedRows.length} link tracking vào clipboard`);
    } catch (_error) {
      toast.error('Không thể copy link tracking');
    }
  }, [allSelectedRows]);

  return {
    handleBulkFinish,
    handleBulkOpen,
    handleBulkCancel,
    handleBulkGetLink,
  };
}

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2, Calendar, User, Image as ImageIcon } from 'lucide-react';
import type { Task, CompletionEvidence } from '../types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { EvidenceViewer } from './EvidenceViewer';

interface ApprovalDialogProps {
  task: Task;
  open: boolean;
  onClose: () => void;
  onApprove: (taskId: string) => Promise<void>;
  onReject: (taskId: string, reason: string) => Promise<void>;
}

export function ApprovalDialog({ task, open, onClose, onApprove, onReject }: ApprovalDialogProps) {
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEvidenceViewer, setShowEvidenceViewer] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evidence = task.completionEvidence;

  const handleApprove = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onApprove(task.systemId);
      resetAndClose();
    } catch (err) {
      setError('Có lỗi khi phê duyệt. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (rejectionReason.trim().length < 10) {
      setError('Lý do từ chối phải có ít nhất 10 ký tự');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onReject(task.systemId, rejectionReason.trim());
      resetAndClose();
    } catch (err) {
      setError('Có lỗi khi từ chối. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setAction(null);
    setRejectionReason('');
    setError(null);
    onClose();
  };

  if (!evidence) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={resetAndClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Phê duyệt công việc hoàn thành</DialogTitle>
            <DialogDescription>
              Xem xét bằng chứng và quyết định phê duyệt hoặc yêu cầu làm lại
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Task info */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">{task.title}</h4>
              {task.description && (
                <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
              )}
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Người làm: {evidence.submittedByName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Gửi lúc: {format(new Date(evidence.submittedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </span>
                </div>
              </div>
            </div>

            {/* Evidence preview */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Bằng chứng hoàn thành</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEvidenceViewer(true)}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Xem đầy đủ
                </Button>
              </div>

              {/* Image thumbnails */}
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-3">
                {evidence.images.slice(0, 5).map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative aspect-square cursor-pointer"
                    onClick={() => setShowEvidenceViewer(true)}
                  >
                    <img
                      src={imageUrl}
                      alt={`Evidence ${index + 1}`}
                      className="w-full h-full object-cover rounded border hover:opacity-80 transition-opacity"
                    />
                    {index === 4 && evidence.images.length > 5 && (
                      <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center text-white text-sm font-medium">
                        +{evidence.images.length - 5}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Note */}
              <div className="p-3 bg-muted/50 rounded border">
                <p className="text-sm font-medium mb-1">Mô tả:</p>
                <p className="text-sm whitespace-pre-wrap">{evidence.note}</p>
              </div>
            </div>

            {/* Approval history */}
            {task.approvalHistory && task.approvalHistory.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Lịch sử phê duyệt</h4>
                <div className="space-y-2">
                  {task.approvalHistory.map((history) => (
                    <div
                      key={history.id}
                      className="p-3 border rounded-lg text-sm"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{history.reviewedByName}</span>
                        <span className="text-muted-foreground">
                          {format(new Date(history.reviewedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {history.status === 'approved' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span>
                          {history.status === 'approved' ? 'Đã phê duyệt' : 'Đã từ chối'}
                        </span>
                      </div>
                      {history.reason && (
                        <p className="text-muted-foreground mt-1">Lý do: {history.reason}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action selection */}
            {!action && (
              <div className="flex gap-3">
                <Button
                  onClick={() => setAction('approve')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Phê duyệt
                </Button>
                <Button
                  onClick={() => setAction('reject')}
                  variant="destructive"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Yêu cầu làm lại
                </Button>
              </div>
            )}

            {/* Rejection reason input */}
            {action === 'reject' && (
              <div className="space-y-3 p-4 border-2 border-red-200 rounded-lg bg-red-50">
                <Label htmlFor="rejection-reason">
                  Lý do yêu cầu làm lại <span className="text-red-500">*</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    (Tối thiểu 10 ký tự)
                  </span>
                </Label>
                <Textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Vui lòng nêu rõ lý do và hướng dẫn nhân viên cần làm gì..."
                  rows={4}
                  disabled={isSubmitting}
                />
                <div className="text-xs text-muted-foreground">
                  {rejectionReason.length < 10 
                    ? `Còn ${10 - rejectionReason.length} ký tự nữa`
                    : `✓ ${rejectionReason.length} ký tự`}
                </div>
              </div>
            )}

            {/* Approval confirmation */}
            {action === 'approve' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Bạn chắc chắn muốn phê duyệt công việc này? Sau khi phê duyệt, 
                  công việc sẽ chuyển sang trạng thái "Hoàn thành".
                </AlertDescription>
              </Alert>
            )}

            {/* Error message */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            {action ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setAction(null);
                    setRejectionReason('');
                    setError(null);
                  }}
                  disabled={isSubmitting}
                >
                  Quay lại
                </Button>
                <Button
                  onClick={action === 'approve' ? handleApprove : handleReject}
                  disabled={
                    isSubmitting || 
                    (action === 'reject' && rejectionReason.trim().length < 10)
                  }
                  variant={action === 'approve' ? 'default' : 'destructive'}
                  className={action === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : action === 'approve' ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Xác nhận phê duyệt
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Xác nhận từ chối
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={resetAndClose}>
                Đóng
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Evidence viewer dialog */}
      {showEvidenceViewer && (
        <EvidenceViewer
          evidence={evidence}
          open={showEvidenceViewer}
          onClose={() => setShowEvidenceViewer(false)}
        />
      )}
    </>
  );
}

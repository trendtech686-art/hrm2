import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import type { Complaint } from '../types';

interface Props {
  complaint: Complaint;
  onProcessCompensation: () => void;
  onProcessInventory: () => void;
}

export const ComplaintProcessingCard: React.FC<Props> = React.memo(({ 
  complaint,
  onProcessCompensation,
  onProcessInventory
}) => {
  // Hide when complaint is ended/resolved/cancelled
  if (complaint.status === 'resolved' || complaint.status === 'ended' || complaint.status === 'cancelled') {
    return null;
  }

  // Check if there are unprocessed action buttons to show
  let hasUnprocessedButtons = false;
  if (complaint.verification === 'verified-correct') {
    const lastVerifiedCorrect = [...(complaint.timeline || [])]
      .reverse()
      .find(a => a.actionType === 'verified-correct');
    if (lastVerifiedCorrect) {
      const actionMetadata = lastVerifiedCorrect.metadata as { paymentSystemId?: string; receiptSystemId?: string; inventoryCheckSystemId?: string; penaltySystemIds?: string[] } | undefined;
      const hasPaymentOrReceipt = actionMetadata?.paymentSystemId || actionMetadata?.receiptSystemId || ((actionMetadata?.penaltySystemIds?.length ?? 0) > 0);
      const hasInventoryCheck = actionMetadata?.inventoryCheckSystemId;
      hasUnprocessedButtons = !hasPaymentOrReceipt || !hasInventoryCheck;
    }
  }

  const hasNotes = !!complaint.investigationNote || !!complaint.proposedSolution;

  // Only show if there are unprocessed buttons OR notes to display
  if (!hasUnprocessedButtons && !hasNotes) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Xử lý khiếu nại
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Action Buttons - Show ONLY if complaint is currently verified-correct AND not processed yet */}
          {hasUnprocessedButtons && (
            <div className="flex flex-col sm:flex-row gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
              {complaint.verification === 'verified-correct' && (() => {
                const lastVerifiedCorrect = [...(complaint.timeline || [])]
                  .reverse()
                  .find(a => a.actionType === 'verified-correct');
                const actionMetadata = lastVerifiedCorrect?.metadata as { paymentSystemId?: string; receiptSystemId?: string; inventoryCheckSystemId?: string; penaltySystemIds?: string[] } | undefined;
                const hasPaymentOrReceipt = actionMetadata?.paymentSystemId || actionMetadata?.receiptSystemId || ((actionMetadata?.penaltySystemIds?.length ?? 0) > 0);
                const hasInventoryCheck = actionMetadata?.inventoryCheckSystemId;
                return (
                  <>
                    {!hasPaymentOrReceipt && (
                      <Button
                        onClick={onProcessCompensation}
                        variant="default"
                        size="lg"
                        className="h-9 flex-1"
                      >
                        Xử lý bù trừ
                      </Button>
                    )}
                    {!hasInventoryCheck && (
                      <Button
                        onClick={onProcessInventory}
                        variant="default"
                        size="lg"
                        className="h-9 flex-1"
                      >
                        Xử lý tồn kho
                      </Button>
                    )}
                  </>
                );
              })()}
            </div>
          )}

            {/* Investigation note */}
            {complaint.investigationNote && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Ghi chú kiểm tra</Label>
                <div className="text-sm bg-blue-50 dark:bg-blue-950 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                  {complaint.investigationNote}
                </div>
              </div>
            )}

            {/* Proposed solution */}
            {complaint.proposedSolution && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Đề xuất giải pháp</Label>
                <div className="text-sm bg-green-50 dark:bg-green-950 p-3 rounded-md border border-green-200 dark:border-green-800">
                  {complaint.proposedSolution}
                </div>
              </div>
            )}
          </div>
      </CardContent>
    </Card>
  );
});

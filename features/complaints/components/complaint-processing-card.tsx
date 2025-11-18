import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { Label } from "../../../components/ui/label.tsx";
import { ComplaintVerificationHistory } from "./complaint-verification-history.tsx";
import type { Complaint } from '../types.ts';

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
  // Check if there's any compensation/inventory history (even if cancelled)
  const hasCompensationHistory = (complaint as any).compensationMetadata || (complaint as any).cancelledPaymentsReceipts?.length > 0;
  const hasInventoryHistory = (complaint as any).inventoryAdjustment || (complaint as any).inventoryHistory?.length > 0;
  
  // Check if there's a verified-correct action in timeline
  const hasVerifiedCorrect = complaint.timeline.some(a => a.actionType === 'verified-correct');
  
  // Check if CURRENTLY verified-incorrect
  const isCurrentlyIncorrect = complaint.verification === 'verified-incorrect';
  
  // LOGIC MOI: Hien accordion bu tru NEU:
  // - Da co history (compensationMetadata hoac inventoryAdjustment)
  // - Hoac timeline co verified-correct (da tung xac nhan dung)
  const shouldShowCompensationAccordion = hasVerifiedCorrect || hasCompensationHistory || hasInventoryHistory;
  
  // Only show if there's any processing info OR if has been verified correct before (even if reopened)
  if (!complaint.investigationNote && 
      !complaint.proposedSolution && 
      !complaint.resolution &&
      !hasVerifiedCorrect &&
      !hasCompensationHistory &&
      !hasInventoryHistory &&
      !(complaint as any).evidenceVideoLinks) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Xử lý khiếu nại
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Action Buttons - Show ONLY if complaint is currently verified-correct AND not processed yet */}
          {complaint.verification === 'verified-correct' && (() => {
              // Get LAST verified-correct action from timeline
              const lastVerifiedCorrect = [...complaint.timeline]
                .reverse()
                .find(a => a.actionType === 'verified-correct');
              
              if (!lastVerifiedCorrect) return null; // No verified-correct action yet
              
              // Check if this action has metadata (already processed)
              const actionMetadata = lastVerifiedCorrect.metadata;
              const hasPaymentOrReceipt = actionMetadata?.paymentSystemId || actionMetadata?.receiptSystemId;
              const hasInventoryCheck = actionMetadata?.inventoryCheckSystemId;
              
              // Show buttons if NOT yet processed
              if (!hasPaymentOrReceipt || !hasInventoryCheck) {
                return (
                  <div className="flex flex-col sm:flex-row gap-3 p-4 bg-muted/50 rounded-lg border">
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
                  </div>
                );
              }
              return null;
            })()}

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

          {/* Right column: All verification accordions */}
          <div className="space-y-6">
            <ComplaintVerificationHistory complaint={complaint} />
        </div>
      </CardContent>
    </Card>
  );
});

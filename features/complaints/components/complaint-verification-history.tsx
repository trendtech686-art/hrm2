import React from "react";
import { ComplaintCompensationSection } from "./complaint-compensation-section";
import { ComplaintVerifiedIncorrectSection } from "./complaint-verified-incorrect-section";
import type { Complaint } from "../types";
import { formatDateTimeForDisplay } from '@/lib/date-utils';

interface Props {
  complaint: Complaint;
}

/**
 * Component hien thi tat ca accordion verification theo thu tu thoi gian
 * 
 * LOGIC:
 * - Lay tat ca action verified-correct va verified-incorrect tu timeline
 * - Sap xep theo thoi gian (moi nhat truoc)
 * - Render accordion tuong ung cho moi action
 */
export const ComplaintVerificationHistory: React.FC<Props> = ({ complaint }) => {
  // Lay tat ca verification actions
  const verificationActions = complaint.timeline
    .filter(a => a.actionType === 'verified-correct' || a.actionType === 'verified-incorrect')
    .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()); // Moi nhat truoc
  
  console.log('[VerificationHistory] Actions:', {
    total: verificationActions.length,
    actions: verificationActions.map(a => ({
      type: a.actionType,
      time: formatDateTimeForDisplay(a.performedAt),
    })),
  });
  
  if (verificationActions.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      {verificationActions.map((action, index) => {
        if (action.actionType === 'verified-correct') {
          return (
            <ComplaintCompensationSection 
              key={`${action.id}-${index}`}
              complaint={complaint}
              actionTimestamp={action.performedAt}
            />
          );
        } else {
          return (
            <ComplaintVerifiedIncorrectSection 
              key={`${action.id}-${index}`}
              complaint={complaint}
              actionTimestamp={action.performedAt}
            />
          );
        }
      })}
    </div>
  );
};

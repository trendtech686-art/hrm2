import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { XCircle } from "lucide-react";
import type { Complaint } from "../types";

interface Props {
  complaint: Complaint;
  actionTimestamp?: Date | string; // Neu co truyen timestamp cu the, dung cai do thay vi tim tu timeline
}

export const ComplaintVerifiedIncorrectSection: React.FC<Props> = ({ complaint, actionTimestamp }) => {
  // Neu co actionTimestamp truyen vao, dung cai do
  // Nguoc lai tim action verified-incorrect moi nhat
  let verifiedDateTime = "N/A";
  let verificationNote = "";
  
  if (actionTimestamp) {
    verifiedDateTime = new Date(actionTimestamp).toLocaleString("vi-VN", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    
    // Tim action tuong ung voi timestamp nay de lay note
    const matchingAction = complaint.timeline.find(
      a => a.actionType === 'verified-incorrect' && 
           new Date(a.performedAt).getTime() === new Date(actionTimestamp).getTime()
    );
    verificationNote = matchingAction?.note || "Khieu nai khong hop le";
  } else {
    const verifyIncorrectAction = [...complaint.timeline]
      .reverse()
      .find(a => a.actionType === 'verified-incorrect');
    
    verifiedDateTime = verifyIncorrectAction
      ? new Date(verifyIncorrectAction.performedAt).toLocaleString("vi-VN", {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      : "N/A";
    
    verificationNote = verifyIncorrectAction?.note || "Khieu nai khong hop le";
  }
  
  // Badge "Đã hủy" - kiểm tra timeline
  const hasBeenCancelled = 
    complaint.timeline.some(a => a.actionType === 'cancelled') ||
    complaint.status === 'cancelled';
  
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="incorrect-evidence" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3 flex-1">
            <XCircle className="h-4 w-4 text-red-600" />
            <div className="text-left flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">Xác nhận khách hàng sai - {verifiedDateTime}</span>
                <Badge variant="destructive" className="text-xs">
                  Không bù trừ
                </Badge>
                {hasBeenCancelled && (
                  <Badge variant="destructive" className="text-xs">
                    Đã hủy
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {verificationNote}
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 pt-4">
            <div className="text-sm text-muted-foreground italic bg-red-50 dark:bg-red-950/20 p-4 rounded-md border border-red-200 dark:border-red-800">
              <div className="font-medium mb-2">Khách hàng phản hồi sai:</div>
              <div>
                Sau khi kiểm tra, xác nhận khiếu nại không hợp lệ. 
                Xem chi tiết bằng chứng tại mục <span className="font-medium">"Hình ảnh kiểm tra từ nhân viên"</span> bên dưới.
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

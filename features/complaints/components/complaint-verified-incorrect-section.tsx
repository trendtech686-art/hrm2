import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { XCircle, ExternalLink, Video } from "lucide-react";
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
  let evidenceVideos: string[] = [];
  let evidenceNote = "";
  
  // Find the matching action to extract metadata
  const findMatchingAction = () => {
    if (actionTimestamp) {
      return complaint.timeline?.find(
        a => a.actionType === 'verified-incorrect' && 
             new Date(a.performedAt).getTime() === new Date(actionTimestamp).getTime()
      );
    }
    return [...(complaint.timeline || [])]
      .reverse()
      .find(a => a.actionType === 'verified-incorrect');
  };
  
  const matchingAction = findMatchingAction();
  
  if (actionTimestamp) {
    verifiedDateTime = new Date(actionTimestamp).toLocaleString("vi-VN", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } else if (matchingAction) {
    verifiedDateTime = new Date(matchingAction.performedAt).toLocaleString("vi-VN", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  verificationNote = matchingAction?.note || "Khiếu nại không hợp lệ";
  
  // Extract evidence videos and note from metadata or verificationEvidence
  const metadata = matchingAction?.metadata as { evidenceVideos?: string[]; evidenceImages?: string[] } | undefined;
  const verificationEvidence = (complaint as unknown as { verificationEvidence?: { videos?: string[]; note?: string; images?: string[] } }).verificationEvidence;
  
  evidenceVideos = metadata?.evidenceVideos || verificationEvidence?.videos || [];
  evidenceNote = verificationEvidence?.note || "";
  
  // Badge "Đã hủy" - kiểm tra timeline - ✅ Add null check
  const hasBeenCancelled = 
    complaint.timeline?.some(a => a.actionType === 'cancelled') ||
    complaint.status === 'cancelled';
  
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="incorrect-evidence" className="-mx-4 border-y border-x-0 rounded-none px-0 md:mx-0 md:border md:rounded-lg md:px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3 flex-1">
            <XCircle className="h-4 w-4 text-red-600" />
            <div className="text-left flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">Xác nhận khách hàng sai - {verifiedDateTime}</span>
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
            {/* Evidence note */}
            {evidenceNote && (
              <div className="text-sm bg-muted/50 p-4 rounded-md border border-border">
                <div className="font-medium mb-1 text-muted-foreground">Ghi chú bằng chứng:</div>
                <div className="whitespace-pre-wrap">{evidenceNote}</div>
              </div>
            )}
            
            {/* Video links */}
            {evidenceVideos.length > 0 && (
              <div className="text-sm bg-blue-50 dark:bg-blue-950/20 p-4 rounded-md border border-blue-200 dark:border-blue-800">
                <div className="font-medium mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Video className="h-4 w-4" />
                  Link video bằng chứng:
                </div>
                <div className="space-y-1">
                  {evidenceVideos.map((link, idx) => (
                    <a
                      key={idx}
                      href={link}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline break-all"
                    >
                      <ExternalLink className="h-3 w-3 shrink-0" />
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* Fallback message if no evidence details */}
            {!evidenceNote && evidenceVideos.length === 0 && (
              <div className="text-sm text-muted-foreground italic bg-red-50 dark:bg-red-950/20 p-4 rounded-md border border-red-200 dark:border-red-800">
                <div className="font-medium mb-2">Khách hàng phản hồi sai:</div>
                <div>
                  Sau khi kiểm tra, xác nhận khiếu nại không hợp lệ.
                  Xem chi tiết bằng chứng tại mục <span className="font-medium">&quot;Hình ảnh kiểm tra từ nhân viên&quot;</span> bên dưới.
                </div>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

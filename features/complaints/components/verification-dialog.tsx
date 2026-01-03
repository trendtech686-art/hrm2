import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NewDocumentsUpload } from "@/components/ui/new-documents-upload";
import type { StagingFile } from "@/lib/file-upload-api";
import { CheckCircle as _CheckCircle, XCircle, Upload as _Upload, MessageSquare as _MessageSquare, AlertCircle as _AlertCircle, Info as _Info } from "lucide-react";
import { toast } from "sonner";
import type { Complaint } from "../types";
import type { SystemId } from "@/lib/id-types";

interface VerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "correct" | "incorrect" | null; // Keep for backward compatibility but only use "incorrect"
  complaint: Complaint | null;
  onSubmitCorrect: (
    method: "refund" | "replace", 
    cost: number, 
    incurredCost: number, 
    reason: string, 
    confirmedQuantities?: Record<SystemId, number>,
    inventoryAdjustments?: Record<SystemId, number>
  ) => void;
  onSubmitIncorrect: (files: StagingFile[], videoLinks: string[], note: string) => void;
}

export function VerificationDialog({
  open,
  onOpenChange,
  mode,
  complaint: _complaint,
  onSubmitCorrect: _onSubmitCorrect,
  onSubmitIncorrect,
}: VerificationDialogProps) {
  // ⚠️ NOTE: This dialog is NOW ONLY used for mode="incorrect" (Xác nhận sai)
  // For mode="correct", use ConfirmCorrectDialog instead
  
  // Evidence files - Using staging pattern
  const [evidenceStagingFiles, setEvidenceStagingFiles] = React.useState<StagingFile[]>([]);
  const [evidenceSessionId, setEvidenceSessionId] = React.useState<string | null>(null);
  const [evidenceVideoLinks, setEvidenceVideoLinks] = React.useState<string>("");
  const [evidenceNote, setEvidenceNote] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setEvidenceStagingFiles([]);
      setEvidenceSessionId(null);
      setEvidenceVideoLinks("");
      setEvidenceNote("");
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    // Prevent double submission
    if (isSubmitting) return;
    
    // ⚠️ This dialog NOW ONLY handles mode="incorrect"
    if (mode === "incorrect") {
      // Parse video links (split by newline, filter empty)
      const videoLinks = evidenceVideoLinks
        .split('\n')
        .map(link => link.trim())
        .filter(link => link.length > 0);
      
      // Validation for incorrect mode
      if (evidenceStagingFiles.length === 0 && videoLinks.length === 0 && !evidenceNote.trim()) {
        toast.error("Vui lòng tải lên file bằng chứng hoặc dán link video hoặc ghi chú");
        return;
      }
      
      setIsSubmitting(true);
      try {
        await onSubmitIncorrect(evidenceStagingFiles, videoLinks, evidenceNote);
        onOpenChange(false);
      } catch (error) {
        console.error('[VERIFICATION-DIALOG] Submit error:', error);
        toast.error("Có lỗi xảy ra khi lưu bằng chứng");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Xác nhận khiếu nại sai
          </DialogTitle>
          <DialogDescription>
            Tải bằng chứng (video/ảnh) và ghi chú chi tiết
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Tải ảnh bằng chứng</Label>
            <NewDocumentsUpload
              value={evidenceStagingFiles}
              onChange={setEvidenceStagingFiles}
              sessionId={evidenceSessionId ?? undefined}
              onSessionChange={setEvidenceSessionId}
              accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] }}
              maxSize={10 * 1024 * 1024}
              maxFiles={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoLinks">Hoặc dán link video (YouTube, Google Drive...)</Label>
            <Textarea
              id="videoLinks"
              placeholder="Dán link video, mỗi link một dòng&#10;VD: https://youtube.com/watch?v=xxx&#10;https://drive.google.com/file/d/xxx"
              value={evidenceVideoLinks}
              onChange={(e) => setEvidenceVideoLinks(e.target.value)}
              rows={3}
              className="resize-none font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              💡 Tiết kiệm dung lượng server bằng cách dán link YouTube, Google Drive, Dropbox...
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea
              id="note"
              placeholder="Mô tả chi tiết lý do khiếu nại sai..."
              value={evidenceNote}
              onChange={(e) => setEvidenceNote(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu..." : "Lưu bằng chứng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

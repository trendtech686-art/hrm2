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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CurrencyInput } from "@/components/ui/currency-input";
import { NewDocumentsUpload } from "@/components/ui/new-documents-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StagingFile } from "@/lib/file-upload-api";
import { CheckCircle, XCircle, Upload, MessageSquare, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";
import type { Complaint } from "./types.ts";

// Response template interface
interface ResponseTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  order: number;
}

// Load templates from localStorage
function loadTemplates(): ResponseTemplate[] {
  try {
    const stored = localStorage.getItem('complaints-templates');
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load templates:', e);
  }
  // Default templates if none saved
  return [
    {
      id: '1',
      name: 'Xin lỗi - Lỗi sản phẩm',
      content: 'Kính chào Anh/Chị,\n\nChúng tôi xin chân thành xin lỗi về sản phẩm bị lỗi mà Anh/Chị đã nhận được. Đây là sự cố đáng tiếc và chúng tôi hiểu sự bất tiện mà điều này gây ra.\n\nChúng tôi đang xử lý khiếu nại của Anh/Chị và sẽ sớm có phương án giải quyết hợp lý nhất.\n\nTrân trọng,',
      category: 'product-defect',
      order: 1,
    },
    {
      id: '2',
      name: 'Xin lỗi - Giao hàng chậm',
      content: 'Kính chào Anh/Chị,\n\nChúng tôi xin lỗi vì đơn hàng của Anh/Chị đã bị giao chậm hơn so với dự kiến. Chúng tôi đã liên hệ với đơn vị vận chuyển để làm rõ nguyên nhân.\n\nChúng tôi sẽ có phương án bù trừ hợp lý cho sự chậm trễ này.\n\nTrân trọng,',
      category: 'shipping-delay',
      order: 2,
    },
    {
      id: '3',
      name: 'Xác nhận đang xử lý',
      content: 'Kính chào Anh/Chị,\n\nChúng tôi đã nhận được khiếu nại của Anh/Chị và đang tiến hành xác minh thông tin.\n\nChúng tôi sẽ phản hồi lại trong thời gian sớm nhất. Xin Anh/Chị vui lòng theo dõi.\n\nTrân trọng,',
      category: 'general',
      order: 3,
    },
  ];
}

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
    confirmedQuantities?: Record<string, number>,
    inventoryAdjustments?: Record<string, number>
  ) => void;
  onSubmitIncorrect: (files: StagingFile[], videoLinks: string[], note: string) => void;
}

export function VerificationDialog({
  open,
  onOpenChange,
  mode,
  complaint,
  onSubmitCorrect,
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
              sessionId={evidenceSessionId}
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

/**
 * Warranty Reminder Dialog
 * Modal for sending reminders for warranty tickets
 * Pattern copied from Complaints system
 */

import * as React from 'react';
import { Bell, Send } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { WarrantyTicket } from '../../types.ts';
import type { ReminderTemplate } from '../../hooks/use-warranty-reminders.ts';
import { formatReminderMessage } from '../../hooks/use-warranty-reminders.ts';

interface WarrantyReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: WarrantyTicket | null;
  templates: ReminderTemplate[];
  onSendReminder: (
    ticket: WarrantyTicket,
    templateId: string,
    customMessage?: string | undefined,
  ) => Promise<boolean>;
}

export function WarrantyReminderDialog({
  open,
  onOpenChange,
  ticket,
  templates,
  onSendReminder,
}: WarrantyReminderDialogProps) {
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>('');
  const [customMessage, setCustomMessage] = React.useState<string>('');
  const [isSending, setIsSending] = React.useState(false);

  // Reset state when modal opens
  React.useEffect(() => {
    if (open && ticket) {
      // Default to first template
      const defaultTemplate = templates.find(t => t.id === 'follow-up') || templates[0];
      setSelectedTemplateId(defaultTemplate?.id || '');
      setCustomMessage('');
    }
  }, [open, ticket, templates]);

  // Update message preview when template changes
  React.useEffect(() => {
    if (!selectedTemplateId || !ticket) return;

    const template = templates.find(t => t.id === selectedTemplateId);
    if (!template) return;

    // For custom template, keep user input
    if (template.id === 'custom') {
      return;
    }

    // Auto-fill message from template
    const formatted = formatReminderMessage(template.message, ticket);
    setCustomMessage(formatted);
  }, [selectedTemplateId, ticket, templates]);

  const handleSend = async () => {
    if (!ticket) return;

    if (!customMessage.trim()) {
      toast.error('Vui lòng nhập nội dung nhắc nhở');
      return;
    }

    setIsSending(true);
    try {
      const success = await onSendReminder(ticket, selectedTemplateId, customMessage);
      
      if (success) {
        toast.success('Đã gửi nhắc nhở thành công');
        onOpenChange(false);
      } else {
        toast.error('Không thể gửi nhắc nhở');
      }
    } catch (error) {
      console.error('Send reminder error:', error);
      toast.error('Có lỗi xảy ra khi gửi nhắc nhở');
    } finally {
      setIsSending(false);
    }
  };

  if (!ticket) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Gửi nhắc nhở - {ticket.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Ticket Info */}
          <div className="rounded-lg border p-3 bg-muted/50 space-y-1 text-sm">
            <div className="font-medium">{ticket.customerName}</div>
            <div className="text-muted-foreground">{ticket.customerPhone}</div>
            <div className="text-muted-foreground">
              {ticket.summary.totalProducts} sản phẩm
            </div>
          </div>

          {/* Template Selection */}
          <div className="space-y-2">
            <Label htmlFor="template">Mẫu nhắc nhở</Label>
            <Select
              value={selectedTemplateId}
              onValueChange={setSelectedTemplateId}
            >
              <SelectTrigger id="template">
                <SelectValue placeholder="Chọn mẫu..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <Label htmlFor="message">Nội dung nhắc nhở</Label>
            <Textarea
              id="message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Nhập nội dung nhắc nhở..."
              rows={6}
              className="resize-none"
            />
            <div className="text-xs text-muted-foreground">
              Có thể dùng: {'{ticketId}'}, {'{customerName}'}, {'{customerPhone}'}, {'{trackingCode}'}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSend}
            disabled={isSending || !customMessage.trim()}
          >
            <Send className="h-4 w-4 mr-2" />
            {isSending ? 'Đang gửi...' : 'Gửi nhắc nhở'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

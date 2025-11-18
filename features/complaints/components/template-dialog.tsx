import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { showNotification } from '../notification-utils.ts';

interface ResponseTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  order: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: ResponseTemplate[];
}

export const TemplateDialog: React.FC<Props> = ({ open, onOpenChange, templates }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mẫu phản hồi khiếu nại</DialogTitle>
          <DialogDescription>
            Chọn mẫu phản hồi để copy nội dung
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9"
                    onClick={() => {
                      navigator.clipboard.writeText(template.content);
                      showNotification('success', 'Đã copy nội dung');
                    }}
                  >
                    Sao chép
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                  {template.content}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

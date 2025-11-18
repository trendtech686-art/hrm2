import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import type { CompletionEvidence } from '../types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface EvidenceViewerProps {
  evidence: CompletionEvidence;
  open: boolean;
  onClose: () => void;
}

export function EvidenceViewer({ evidence, open, onClose }: EvidenceViewerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bằng chứng hoàn thành công việc</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Meta info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{evidence.submittedByName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(evidence.submittedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                </span>
              </div>
              <Badge variant="outline">
                {evidence.images.length} ảnh
              </Badge>
            </div>

            {/* Images grid */}
            <div>
              <h4 className="font-medium mb-3">Ảnh bằng chứng</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {evidence.images.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedImage(imageUrl)}
                  >
                    <img
                      src={imageUrl}
                      alt={`Evidence ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg border hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                        Xem lớn
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div>
              <h4 className="font-medium mb-2">Mô tả</h4>
              <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
                {evidence.note}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full image viewer */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
            <div className="relative bg-black">
              <img
                src={selectedImage}
                alt="Evidence full"
                className="w-full h-full object-contain max-h-[95vh]"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-black rounded-full p-2 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              
              {/* Navigation */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/90 rounded-full px-4 py-2">
                {evidence.images.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(url)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      url === selectedImage ? "bg-black" : "bg-gray-400"
                    )}
                  />
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, X, CheckCircle2 } from 'lucide-react';
import type { Task } from '../types';
import { cn } from '@/lib/utils';
import { FileUploadAPI, type UploadedAsset } from '@/lib/file-upload-api.ts';
import { loadEvidenceSettings } from '@/features/settings/tasks/tasks-settings-page.tsx';

interface CompletionDialogProps {
  task: Task;
  open: boolean;
  onClose: () => void;
  onSubmit: (taskId: string, evidence: { images: string[]; note: string }) => Promise<void>;
}

type EvidenceFile = UploadedAsset;

export function CompletionDialog({ task, open, onClose, onSubmit }: CompletionDialogProps) {
  const [note, setNote] = useState('');
  const [images, setImages] = useState<EvidenceFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load evidence settings from settings page
  const evidenceSettings = useMemo(() => loadEvidenceSettings(), []);
  const maxImages = evidenceSettings.maxImages;
  const minNoteLength = evidenceSettings.minNoteLength;
  const maxSizeMB = evidenceSettings.imageMaxSizeMB;
  const requireNote = evidenceSettings.requireNoteWithImages;

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError(null);
    
    if (images.length + files.length > maxImages) {
      setError(`Chỉ được upload tối đa ${maxImages} ảnh`);
      return;
    }

    // Check file size
    const oversizedFiles = files.filter(f => f.size > maxSizeMB * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`Mỗi ảnh không được vượt quá ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);
    try {
      const uploaded = await FileUploadAPI.uploadTaskEvidence(task.systemId, files);
      setImages(prev => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi khi upload ảnh. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    const target = images.find(img => img.id === imageId);
    if (!target) return;
    setIsUploading(true);
    try {
      await FileUploadAPI.deleteFile(target.id);
      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa file. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);

    // Validation
    if (images.length === 0) {
      setError('Vui lòng upload ít nhất 1 ảnh bằng chứng');
      return;
    }

    if (requireNote && note.trim().length < minNoteLength) {
      setError(`Ghi chú phải có ít nhất ${minNoteLength} ký tự`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(task.systemId, {
        images: images.map(img => img.url),
        note: note.trim(),
      });
      
      // Reset form
      setNote('');
      setImages([]);
      onClose();
    } catch (err) {
      setError('Có lỗi khi gửi bằng chứng. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setNote('');
      setError(null);
      setImages([]);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Hoàn thành công việc</DialogTitle>
          <DialogDescription>
            Vui lòng upload ảnh bằng chứng và mô tả công việc đã hoàn thành
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Task info */}
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium mb-1">{task.title}</h4>
            {task.description && (
              <p className="text-body-sm text-muted-foreground">{task.description}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>
              Ảnh bằng chứng <span className="text-red-500">*</span>
              <span className="text-body-xs text-muted-foreground ml-2">
                (Tối thiểu 1 ảnh, tối đa {maxImages} ảnh, mỗi ảnh tối đa {maxSizeMB}MB)
              </span>
            </Label>
            
            {/* Preview grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt="Evidence"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(image.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-1 right-1 bg-black/50 text-white text-body-xs px-1.5 py-0.5 rounded">
                      {(image.size / 1024).toFixed(0)} KB
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            {images.length < maxImages && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  id="evidence-upload"
                  disabled={isUploading || isSubmitting}
                />
                <label htmlFor="evidence-upload">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isUploading || isSubmitting}
                    asChild
                  >
                    <span>
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang upload...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Chọn ảnh ({images.length}/{maxImages})
                        </>
                      )}
                    </span>
                  </Button>
                </label>
              </div>
            )}
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="completion-note">
              Mô tả công việc đã hoàn thành {requireNote && <span className="text-red-500">*</span>}
              {minNoteLength > 0 && (
                <span className="text-body-xs text-muted-foreground ml-2">
                  (Tối thiểu {minNoteLength} ký tự)
                </span>
              )}
            </Label>
            <Textarea
              id="completion-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Mô tả chi tiết những gì bạn đã làm để hoàn thành công việc này..."
              rows={5}
              disabled={isSubmitting}
              className={cn(
                requireNote && note.length > 0 && note.length < minNoteLength && "border-red-500"
              )}
            />
            <div className="flex justify-between text-body-xs text-muted-foreground">
              <span>
                {requireNote && minNoteLength > 0 && (
                  note.length < minNoteLength 
                    ? `Còn ${minNoteLength - note.length} ký tự nữa`
                    : '✓ Đủ ký tự'
                )}
              </span>
              <span>{note.length} ký tự</span>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Info message */}
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Sau khi gửi, admin sẽ xem xét và phê duyệt công việc của bạn.
              Bạn sẽ nhận được thông báo khi admin duyệt hoặc yêu cầu làm lại.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={
              isSubmitting || 
              isUploading || 
              images.length === 0 || 
              (requireNote && note.trim().length < minNoteLength)
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi...
              </>
            ) : (
              'Hoàn thành công việc'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

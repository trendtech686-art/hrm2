import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, X, CheckCircle2 } from 'lucide-react';
import type { Task } from '../types';
import { cn } from '@/lib/utils';

interface CompletionDialogProps {
  task: Task;
  open: boolean;
  onClose: () => void;
  onSubmit: (taskId: string, evidence: { images: string[]; note: string }) => Promise<void>;
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  size: number;
}

export function CompletionDialog({ task, open, onClose, onSubmit }: CompletionDialogProps) {
  const [note, setNote] = useState('');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError(null);
    
    if (images.length + files.length > 5) {
      setError('Chỉ được upload tối đa 5 ảnh');
      return;
    }

    setIsUploading(true);
    try {
      const newImages: ImageFile[] = files.map(file => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview: URL.createObjectURL(file),
        size: file.size,
      }));
      
      setImages(prev => [...prev, ...newImages]);
    } catch (err) {
      setError('Có lỗi khi xử lý ảnh. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      // Revoke object URL to prevent memory leak
      const removed = prev.find(img => img.id === imageId);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  };

  // Convert images to base64 or data URLs for storage
  const convertImagesToDataUrls = async (): Promise<string[]> => {
    const promises = images.map(img => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(img.file);
      });
    });
    return Promise.all(promises);
  };

  const handleSubmit = async () => {
    setError(null);

    // Validation
    if (images.length === 0) {
      setError('Vui lòng upload ít nhất 1 ảnh bằng chứng');
      return;
    }

    if (note.trim().length < 10) {
      setError('Ghi chú phải có ít nhất 10 ký tự');
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert images to data URLs
      const imageDataUrls = await convertImagesToDataUrls();
      
      await onSubmit(task.systemId, {
        images: imageDataUrls,
        note: note.trim(),
      });
      
      // Reset form
      setNote('');
      images.forEach(img => URL.revokeObjectURL(img.preview));
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
      images.forEach(img => URL.revokeObjectURL(img.preview));
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
              <p className="text-sm text-muted-foreground">{task.description}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>
              Ảnh bằng chứng <span className="text-red-500">*</span>
              <span className="text-xs text-muted-foreground ml-2">
                (Tối thiểu 1 ảnh, tối đa 5 ảnh)
              </span>
            </Label>
            
            {/* Preview grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.preview}
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
                    <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                      {(image.size / 1024).toFixed(0)} KB
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            {images.length < 5 && (
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
                          Chọn ảnh ({images.length}/5)
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
              Mô tả công việc đã hoàn thành <span className="text-red-500">*</span>
              <span className="text-xs text-muted-foreground ml-2">
                (Tối thiểu 10 ký tự)
              </span>
            </Label>
            <Textarea
              id="completion-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Mô tả chi tiết những gì bạn đã làm để hoàn thành công việc này..."
              rows={5}
              disabled={isSubmitting}
              className={cn(
                note.length > 0 && note.length < 10 && "border-red-500"
              )}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {note.length < 10 
                  ? `Còn ${10 - note.length} ký tự nữa`
                  : '✓ Đủ ký tự'}
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
              note.trim().length < 10
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

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';

interface CancelPackagingDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (reason: string) => void;
}

export function CancelPackagingDialog({ isOpen, onOpenChange, onConfirm }: CancelPackagingDialogProps) {
    const [reason, setReason] = React.useState('');

    const handleConfirm = () => {
        onConfirm(reason);
        onOpenChange(false);
    };
    
    React.useEffect(() => {
        if (!isOpen) {
            setReason('');
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Hủy yêu cầu đóng gói</DialogTitle>
                    <DialogDescription>
                        Vui lòng nhập lý do hủy. Hành động này sẽ cập nhật trạng thái của phiếu đóng gói thành "Hủy đóng gói".
                    </DialogDescription>
                </DialogHeader>
                <div className="pt-4">
                    <Label htmlFor="cancel-reason-packaging">Lý do hủy</Label>
                    <Textarea
                        id="cancel-reason-packaging"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="mt-2"
                        placeholder="Nhập lý do..."
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Thoát</Button>
                    <Button variant="destructive" onClick={handleConfirm}>Xác nhận Hủy</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

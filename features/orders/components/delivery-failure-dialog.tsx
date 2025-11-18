import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../../components/ui/dialog.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { Textarea } from '../../../components/ui/textarea.tsx';
import { Label } from '../../../components/ui/label.tsx';

interface DeliveryFailureDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (reason: string) => void;
}

export function DeliveryFailureDialog({ isOpen, onOpenChange, onConfirm }: DeliveryFailureDialogProps) {
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
                    <DialogTitle>Báo giao hàng thất bại</DialogTitle>
                    <DialogDescription>
                        Nhập lý do giao hàng thất bại. Hàng sẽ được hoàn về kho và có thể tạo lại đơn giao hàng mới.
                    </DialogDescription>
                </DialogHeader>
                <div className="pt-4">
                    <Label htmlFor="failure-reason-delivery">Lý do</Label>
                    <Textarea
                        id="failure-reason-delivery"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="mt-2"
                        placeholder="VD: Khách không nghe máy, sai địa chỉ..."
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Thoát</Button>
                    <Button variant="destructive" onClick={handleConfirm}>Xác nhận</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

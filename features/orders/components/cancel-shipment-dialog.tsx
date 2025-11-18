import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../../components/ui/dialog.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { AlertTriangle } from 'lucide-react';

interface CancelShipmentDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onCancelShipment: () => void;
    onCancelAndRestock: () => void;
}

export function CancelShipmentDialog({ isOpen, onOpenChange, onCancelShipment, onCancelAndRestock }: CancelShipmentDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Hủy giao hàng
                    </DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn hủy đơn giao hàng?
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-4">
                    <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg p-4 leading-relaxed">
                        <p className="font-semibold mb-1.5">⚠️ Lưu ý quan trọng:</p>
                        <p>Yêu cầu hủy đơn có thể <span className="font-semibold">không được đối tác tiếp nhận</span> ở trạng thái hiện tại. Vui lòng hủy trên hệ thống đối tác hoặc liên hệ bộ phận hỗ trợ (nếu đẩy đơn qua Sapo Express)</p>
                    </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                        className="w-full sm:w-auto order-last sm:order-first"
                    >
                        Thoát
                    </Button>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button 
                            variant="outline" 
                            onClick={onCancelAndRestock}
                            className="w-full sm:w-auto border-orange-300 text-orange-700 hover:bg-orange-50"
                        >
                            Hủy giao và nhận lại hàng
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={onCancelShipment}
                            className="w-full sm:w-auto"
                        >
                            Hủy giao hàng
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

import * as React from 'react';
import { toast } from 'sonner';
import { PlusCircle, Gift } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface ProductTableBottomToolbarProps {
    onAddService?: (() => void) | undefined;
    onApplyPromotion?: (() => void) | undefined;
    disabled?: boolean | undefined;
}

export function ProductTableBottomToolbar({ onAddService, onApplyPromotion, disabled }: ProductTableBottomToolbarProps) {
    const handleAddService = () => {
        if (onAddService) {
            onAddService();
        }
    };

    const handleApplyPromotion = () => {
        if (onApplyPromotion) {
            onApplyPromotion();
        } else {
            toast.info('Tính năng áp dụng chương trình khuyến mãi đang được phát triển');
        }
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 px-4 bg-muted/30 border-t">
            <Button
                type="button"
                variant="link"
                className="text-primary h-auto p-0 justify-start sm:justify-center"
                onClick={handleAddService}
                disabled={disabled}
            >
                <PlusCircle className="h-4 w-4 mr-2 shrink-0" />
                <span className="truncate">Thêm dịch vụ khác <span className="hidden sm:inline">(F9)</span></span>
            </Button>

            <Button
                type="button"
                variant="link"
                className="text-primary h-auto p-0 justify-start sm:justify-center"
                onClick={handleApplyPromotion}
                disabled={disabled}
            >
                <Gift className="h-4 w-4 mr-2 shrink-0" />
                <span className="truncate">Áp dụng khuyến mại</span>
            </Button>
        </div>
    );
}

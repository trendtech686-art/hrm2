import * as React from 'react';
import { PlusCircle, Gift } from 'lucide-react';
import { Button } from '../../../components/ui/button.tsx';

interface ProductTableBottomToolbarProps {
    onAddService?: () => void;
    onApplyPromotion?: () => void;
    disabled?: boolean;
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
            alert('Tính năng áp dụng chương trình khuyến mãi đang được phát triển');
        }
    };

    return (
        <div className="flex items-center justify-between py-3 px-4 bg-muted/30 border-t">
            <Button
                type="button"
                variant="link"
                className="text-primary h-auto p-0"
                onClick={handleAddService}
                disabled={disabled}
            >
                <PlusCircle className="h-4 w-4 mr-2" />
                Thêm dịch vụ khác (F9)
            </Button>
            
            <Button
                type="button"
                variant="link"
                className="text-primary h-auto p-0"
                onClick={handleApplyPromotion}
                disabled={disabled}
            >
                <Gift className="h-4 w-4 mr-2" />
                Áp dụng chương trình khuyến mại
            </Button>
        </div>
    );
}

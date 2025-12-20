import * as React from 'react';
import { cn } from '../../../lib/utils';

interface SummaryStatProps {
    value: number;
    label: string;
    className?: string;
}

export const SummaryStat: React.FC<SummaryStatProps> = ({ value, label, className }) => {
    return (
        <div className={cn("text-center", className)}>
            <div className="font-semibold text-body-xs">{value}</div>
            <div className="text-[10px] text-muted-foreground leading-tight">{label}</div>
        </div>
    );
};

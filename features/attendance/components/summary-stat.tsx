import * as React from 'react';
import { cn } from '../../../lib/utils.ts';

interface SummaryStatProps {
    value: number;
    label: string;
    className?: string;
}

export const SummaryStat: React.FC<SummaryStatProps> = ({ value, label, className }) => {
    return (
        <div className={cn("text-center", className)}>
            <div className="font-semibold text-[11px]">{value}</div>
            <div className="text-[9px] text-muted-foreground leading-tight">{label}</div>
        </div>
    );
};

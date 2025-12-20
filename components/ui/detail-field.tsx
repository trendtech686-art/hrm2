import * as React from 'react';
import { cn } from '../../lib/utils';

export const DetailField = ({ label, value, children, className }: { label: string, value?: React.ReactNode, children?: React.ReactNode, className?: string }) => {
    const content = value ?? children;
    
    return (
        <div className={cn("grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-2 border-b", className)}>
            <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
            <dd className="col-span-2 text-sm text-foreground break-words">
                {(content !== null && content !== undefined && content !== '') ? content : '-'}
            </dd>
        </div>
    );
};

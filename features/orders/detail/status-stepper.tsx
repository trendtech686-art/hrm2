'use client'

import * as React from 'react';
import { formatDateTime } from '@/lib/date-utils';
import type { Order } from '@/lib/types/prisma-extended';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusStepperProps {
  order: Order;
}

export function StatusStepper({ order }: StatusStepperProps) {
    // Check packaging statuses (both Vietnamese and English) - cast to string for comparison
    const isPackaged = order.packagings.some(p => {
        const statusStr = String(p.status || '');
        return statusStr === 'Đã đóng gói' || statusStr === 'PACKED' || statusStr === 'COMPLETED';
    });
    const packagingConfirmDate = isPackaged 
        ? order.packagings.find(p => {
            const statusStr = String(p.status || '');
            return statusStr === 'Đã đóng gói' || statusStr === 'PACKED' || statusStr === 'COMPLETED';
        })?.confirmDate 
        : undefined;
    
    const steps = [
        { name: 'Đặt hàng', date: order.orderDate },
        { name: 'Duyệt', date: order.approvedDate },
        { name: 'Đóng gói', date: packagingConfirmDate },
        { name: 'Xuất kho', date: order.dispatchedDate },
        { name: 'Hoàn thành', date: order.completedDate }
    ];

    // Check for both Vietnamese and English status values
    const statusIsCompleted = order.status === 'Hoàn thành' || order.status === 'COMPLETED';
    const isCancelled = order.status === 'Đã hủy' || order.status === 'CANCELLED';
    
    // ✅ FIX: Only consider completed if actually went through workflow
    // Order is truly completed if: status is COMPLETED AND (dispatched OR delivered)
    const isActuallyCompleted = statusIsCompleted && (
        order.dispatchedDate || 
        order.deliveryStatus === 'Đã giao hàng' || 
        order.deliveryStatus === 'DELIVERED' ||
        order.stockOutStatus === 'Xuất kho toàn bộ' ||
        order.stockOutStatus === 'FULLY_STOCKED_OUT'
    );

    let currentStepIndex = 0; // Default to 'Đặt hàng'
    if (isActuallyCompleted) {
        currentStepIndex = 5; // All 5 steps (0-4) are completed.
    } else if (order.dispatchedDate || ['Đang giao hàng', 'Đã giao hàng', 'SHIPPING', 'DELIVERED'].includes(order.deliveryStatus)) {
        currentStepIndex = 4; // Current step is 'Hoàn thành' (index 4)
    } else if (isPackaged || ['Đã đóng gói', 'PACKED'].includes(order.deliveryStatus)) {
        currentStepIndex = 3; // Current step is 'Xuất kho' (index 3)
    } else if (order.approvedDate) {
        currentStepIndex = 2; // Current step is 'Đóng gói' (index 2)
    } else if (order.orderDate) {
        currentStepIndex = 1; // Current step is 'Duyệt' (index 1)
    }

    if (isCancelled) {
        let lastValidStep = -1;
        if (order.dispatchedDate) lastValidStep = 3;
        else if (isPackaged) lastValidStep = 2;
        else if (order.approvedDate) lastValidStep = 1;
        else if (order.orderDate) lastValidStep = 0;
        currentStepIndex = lastValidStep;
    }

    return (
        <div className="flex items-start justify-between w-full px-4 pt-4">
            {steps.map((step, index) => {
                const isStepCompleted = index < currentStepIndex;
                const isStepCurrent = index === currentStepIndex;
                const isStepCancelled = isCancelled && isStepCurrent;
                const Icon = Check;

                return (
                    <React.Fragment key={step.name}>
                        <div className="flex flex-col items-center text-center w-24">
                            <div className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm",
                                isStepCancelled ? "bg-red-100 border-red-500 text-red-500" :
                                isStepCompleted ? "bg-primary border-primary text-primary-foreground" :
                                isStepCurrent ? "border-primary text-primary" :
                                "border-border bg-muted text-muted-foreground"
                            )}>
                                {isStepCompleted ? <Icon className="h-4 w-4" /> : index + 1}
                            </div>
                            <p className={cn("text-sm mt-2 font-medium", isStepCompleted || isStepCurrent ? "text-foreground" : "text-foreground")}>{step.name}</p>
                            <p className="text-xs text-foreground mt-1">{step.date ? formatDateTime(step.date) : '-'}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={cn(
                                "flex-1 mt-4 h-0.5",
                                index < currentStepIndex ? "bg-primary" : "bg-border",
                            )} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

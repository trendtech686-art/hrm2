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
    const isPackaged = order.packagings.some(p => p.status === 'Đã đóng gói');
    const steps = [
        { name: 'Đặt hàng', date: order.orderDate },
        { name: 'Duyệt', date: order.approvedDate },
        { name: 'Đóng gói', date: isPackaged ? order.packagings.find(p=>p.status === 'Đã đóng gói')?.confirmDate : undefined },
        { name: 'Xuất kho', date: order.dispatchedDate },
        { name: 'Hoàn thành', date: order.completedDate }
    ];

    let currentStepIndex = 0; // Default to 'Đặt hàng'
    if (order.status === 'Hoàn thành') {
        currentStepIndex = 5; // All 5 steps (0-4) are completed.
    } else if (order.dispatchedDate || ['Đang giao hàng', 'Đã giao hàng'].includes(order.deliveryStatus)) {
        currentStepIndex = 4; // Current step is 'Hoàn thành' (index 4)
    } else if (isPackaged || order.deliveryStatus === 'Đã đóng gói') {
        currentStepIndex = 3; // Current step is 'Xuất kho' (index 3)
    } else if (order.approvedDate) {
        currentStepIndex = 2; // Current step is 'Đóng gói' (index 2)
    } else if (order.orderDate) {
        currentStepIndex = 1; // Current step is 'Duyệt' (index 1)
    }

    if (order.status === 'Đã hủy') {
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
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isCancelled = order.status === 'Đã hủy' && isCurrent;
                const Icon = Check;

                return (
                    <React.Fragment key={step.name}>
                        <div className="flex flex-col items-center text-center w-24">
                            <div className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-body-sm",
                                isCancelled ? "bg-red-100 border-red-500 text-red-500" :
                                isCompleted ? "bg-primary border-primary text-primary-foreground" :
                                isCurrent ? "border-primary text-primary" :
                                "border-gray-300 bg-gray-100 text-gray-400"
                            )}>
                                {isCompleted ? <Icon className="h-4 w-4" /> : index + 1}
                            </div>
                            <p className={cn("text-body-sm mt-2 font-medium", isCompleted || isCurrent ? "text-foreground" : "text-foreground")}>{step.name}</p>
                            <p className="text-body-xs text-foreground mt-1">{step.date ? formatDateTime(step.date) : '-'}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={cn(
                                "flex-1 mt-4 h-0.5",
                                index < currentStepIndex ? "bg-primary" : "bg-gray-300",
                            )} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

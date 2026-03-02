import * as React from 'react';
import { formatDateCustom } from '@/lib/date-utils';
import { cn } from '../../../lib/utils';

interface StatusTimelineProps {
  status: string;
  deliveryStatus: string;
  orderDate: string;
}

export function StatusTimeline({ status, deliveryStatus, orderDate }: StatusTimelineProps) {
  let currentStep = 0;
  if (status === 'Hoàn thành' || status === 'Kết thúc' || status === 'Đã trả hàng') {
    currentStep = 2;
  } else if (deliveryStatus === 'Đã nhập') {
    currentStep = 1;
  }

  const steps = [
    { name: 'Tạo đơn', date: formatDateCustom(orderDate, "dd/MM/yyyy HH:mm") }, 
    { name: 'Nhập hàng' }, 
    { name: 'Hoàn thành' }
  ];

  return (
    <div className="flex items-start justify-center pt-2">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center text-center w-28">
            <div className={cn(
              "flex items-center justify-center w-10 h-9 rounded-full border-2 text-body-sm font-bold",
              index <= currentStep ? "bg-primary border-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground"
            )}>
              <span>{index + 1}</span>
            </div>
            <p className={cn("text-body-sm mt-2 font-medium", index <= currentStep ? "text-foreground" : "text-muted-foreground")}>{step.name}</p>
            {step.date && <p className="text-body-xs text-muted-foreground">{step.date}</p>}
          </div>
          {index < steps.length - 1 && (
            <div className={cn("flex-1 mt-5 border-t-2", index < currentStep ? "border-primary" : "border-border")} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

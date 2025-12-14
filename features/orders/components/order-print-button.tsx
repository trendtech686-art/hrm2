/**
 * Order Print Button with Dropdown
 * Nút In với dropdown menu để chọn khổ giấy
 */

import * as React from 'react';
import { Button } from '../../../components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../../components/ui/dropdown-menu';
import { Printer, ChevronDown, Check } from 'lucide-react';
import { usePrint } from '../../../lib/use-print';
import type { PaperSize } from '../../settings/printer/types';
import type { Order } from '../types';
import type { Customer } from '../../customers/types';
import type { Branch } from '../../settings/branches/types';
import type { Employee } from '../../employees/types';
import { 
  convertOrderForPrint,
  mapOrderToPrintData,
  mapOrderLineItems,
  createStoreSettings,
} from '../../../lib/print/order-print-helper';

const PAPER_SIZES: { value: PaperSize; label: string }[] = [
  { value: 'K57', label: 'K57 (57mm)' },
  { value: 'K80', label: 'K80 (80mm)' },
  { value: 'A5', label: 'A5' },
  { value: 'A4', label: 'A4' },
];

interface OrderPrintButtonProps {
  order: Order;
  customer?: Customer | null;
  branch?: Branch | null;
  createdByEmployee?: Employee | null;
  logoUrl?: string | null;
}

export function OrderPrintButton({
  order,
  customer,
  branch,
  createdByEmployee,
  logoUrl,
}: OrderPrintButtonProps) {
  const { print, getDefaultSize } = usePrint(branch?.systemId);

  const handlePrint = React.useCallback((paperSize?: PaperSize) => {
    const storeSettings = createStoreSettings(branch, { logo: logoUrl });
    const size = paperSize || getDefaultSize('order');
    const orderData = convertOrderForPrint(order, { customer, createdByEmployee });
    
    print('order', {
      data: mapOrderToPrintData(orderData, storeSettings),
      lineItems: mapOrderLineItems(orderData.items),
      paperSize: size,
    });
  }, [order, customer, branch, createdByEmployee, logoUrl, print, getDefaultSize]);

  // In đơn hàng mặc định
  const handleDefaultPrint = React.useCallback(() => {
    handlePrint();
  }, [handlePrint]);

  const defaultSize = getDefaultSize('order');

  return (
    <div className="flex">
      {/* Nút In chính - In đơn hàng với khổ giấy mặc định */}
      <Button
        variant="outline"
        size="sm"
        className="h-7 rounded-r-none border-r-0"
        onClick={handleDefaultPrint}
      >
        <Printer className="mr-2 h-4 w-4" />
        In
      </Button>

      {/* Dropdown để chọn khổ giấy */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-1.5 rounded-l-none"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {PAPER_SIZES.map((size) => (
            <DropdownMenuItem 
              key={size.value}
              onClick={() => handlePrint(size.value)}
            >
              {size.value === defaultSize && <Check className="mr-2 h-4 w-4" />}
              {size.value !== defaultSize && <span className="mr-6" />}
              {size.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

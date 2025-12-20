import * as React from 'react';
import { useTaxStore } from '../../settings/taxes/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

interface TaxSelectorProps {
  value: string; // tax systemId
  onChange: (taxId: string, rate: number) => void;
  type: 'purchase' | 'sale';
}

export function TaxSelector({ value, onChange, type }: TaxSelectorProps) {
  const { data: taxes, getDefaultSale, getDefaultPurchase } = useTaxStore();
  
  // Show all taxes
  const availableTaxes = React.useMemo(() => taxes, [taxes]);

  // Get default if no value
  React.useEffect(() => {
    if (!value) {
      const defaultTax = type === 'sale' ? getDefaultSale() : getDefaultPurchase();
      if (defaultTax) {
        onChange(defaultTax.systemId, defaultTax.rate);
      }
    }
  }, [value, type, getDefaultSale, getDefaultPurchase, onChange]);

  const handleChange = (taxId: string) => {
    const tax = taxes.find((t) => t.systemId === taxId);
    if (tax) {
      onChange(tax.systemId, tax.rate);
    }
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px] h-9">
        <SelectValue placeholder="Chọn thuế" />
      </SelectTrigger>
      <SelectContent>
        {availableTaxes.map((tax) => (
          <SelectItem key={tax.systemId} value={tax.systemId}>
            {tax.name} ({tax.rate}%)
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

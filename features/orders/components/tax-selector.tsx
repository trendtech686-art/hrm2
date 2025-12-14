import * as React from 'react';
import { useTaxStore } from '../../settings/taxes/store.ts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select.tsx';

interface TaxSelectorProps {
  value: string; // tax systemId
  onChange: (taxId: string, rate: number) => void;
  disabled?: boolean;
}

export function TaxSelector({ value, onChange, disabled }: TaxSelectorProps) {
  const { data: taxes, getDefaultSale } = useTaxStore();
  
  // Show all taxes
  const availableTaxes = React.useMemo(() => taxes, [taxes]);

  // Get default if no value
  React.useEffect(() => {
    if (!value) {
      const defaultTax = getDefaultSale();
      if (defaultTax) {
        onChange(defaultTax.systemId, defaultTax.rate);
      }
    }
  }, [value, getDefaultSale, onChange]);

  const handleChange = (taxId: string) => {
    const tax = taxes.find((t) => t.systemId === taxId);
    if (tax) {
      onChange(tax.systemId, tax.rate);
    }
  };

  return (
    <Select value={value} onValueChange={handleChange} disabled={disabled}>
      <SelectTrigger className="w-full h-9">
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

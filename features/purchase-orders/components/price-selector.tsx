import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { useProductLastPurchasePrice } from "../hooks/use-product-last-purchase-price";

interface PriceSelectorProps {
  productId: string;
  supplierId?: string;
  value: number;
  onChange: (price: number) => void;
  className?: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export function PriceSelector({
  productId,
  supplierId: _supplierId,
  value,
  onChange,
  className,
}: PriceSelectorProps) {
  const [mode, setMode] = React.useState<"preset" | "custom">("preset");
  const [customValue, setCustomValue] = React.useState(value.toString());

  // Get price options from last purchase price data
  const { data: priceData } = useProductLastPurchasePrice(
    productId,
    value // Use current value as fallback lastPurchasePrice
  );

  // Get price options
  const priceOptions = React.useMemo(() => {
    const options = [];

    // Last purchase price option
    if (priceData?.lastPrice && priceData.lastPrice > 0) {
      options.push({
        label: "Giá nhập gần nhất",
        value: priceData.lastPrice,
        date: priceData.lastOrderDate,
        supplier: priceData.lastSupplierName,
      });
    }

    // Average price option
    if (priceData?.averagePrice && priceData.averagePrice > 0) {
      options.push({
        label: "Giá trung bình",
        value: priceData.averagePrice,
      });
    }

    // Current/default price
    if (value > 0) {
      options.push({
        label: "Giá mặc định",
        value: value,
      });
    }

    return options;
  }, [priceData, value]);

  React.useEffect(() => {
    setCustomValue(value.toString());
  }, [value]);

  const handlePresetChange = (presetValue: string) => {
    const numValue = Number(presetValue);
    onChange(numValue);
    setMode("preset");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setCustomValue(inputValue);
    
    const numValue = Number(inputValue);
    if (!isNaN(numValue) && numValue >= 0) {
      onChange(numValue);
    }
  };

  if (mode === "custom") {
    return (
      <div className="flex gap-2">
        <Input
          type="number"
          min="0"
          step="1"
          value={customValue}
          onChange={handleCustomChange}
          onBlur={() => {
            // Validate on blur
            const numValue = Number(customValue);
            if (isNaN(numValue) || numValue < 0) {
              setCustomValue(value.toString());
            }
          }}
          className={className}
          placeholder="Nhập giá..."
        />
        <Select value="preset" onValueChange={() => setMode("preset")}>
          <SelectTrigger className="w-30">
            <SelectValue placeholder="Tùy chỉnh" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="preset">Giá mặc định</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <Select value={value.toString()} onValueChange={handlePresetChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Chọn giá">
          {formatCurrency(value)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {priceOptions.map((option, idx) => (
          <SelectItem key={idx} value={option.value.toString()}>
            {option.label}: {formatCurrency(option.value)}
          </SelectItem>
        ))}
        <SelectItem value="custom" onClick={() => setMode("custom")}>
          Nhập giá khác...
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

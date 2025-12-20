import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";

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
  supplierId,
  value,
  onChange,
  className,
}: PriceSelectorProps) {
  const [mode, setMode] = React.useState<"preset" | "custom">("preset");
  const [customValue, setCustomValue] = React.useState(value.toString());

  // Get price options
  // TODO: Implement logic to get last purchase price and pricing settings
  const priceOptions = React.useMemo(() => {
    // For now, return basic options
    // In real implementation, fetch from:
    // 1. Last purchase price from purchase history
    // 2. Pricing settings for this product + supplier combo
    
    return [
      {
        label: "Giá nhập gần nhất",
        value: value || 0, // Placeholder
      },
      {
        label: "Giá nhập",
        value: value || 0, // Placeholder
      },
    ];
  }, [productId, supplierId, value]);

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
          <SelectTrigger className="w-[120px] h-9">
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
      <SelectTrigger className={`${className} h-9`}>
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

import * as React from 'react';
import { Button } from './button';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '../../lib/utils';

// Tailwind color palette
const TAILWIND_COLORS = {
  slate: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  gray: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  zinc: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  neutral: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  stone: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  red: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  orange: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  amber: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  yellow: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  lime: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  green: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  emerald: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  teal: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  cyan: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  sky: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  blue: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  indigo: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  violet: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  purple: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  fuchsia: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  pink: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  rose: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
};

interface TailwindColorPickerProps {
  value: string; // e.g., "bg-red-50 border-red-400"
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export function TailwindColorPicker({ value, onChange, label, placeholder }: TailwindColorPickerProps) {
  const [bgColor, setBgColor] = React.useState('');
  const [borderColor, setBorderColor] = React.useState('');
  const [open, setOpen] = React.useState(false);

  // Parse current value
  React.useEffect(() => {
    const parts = value.split(' ');
    const bg = parts.find(p => p.startsWith('bg-'));
    const border = parts.find(p => p.startsWith('border-'));
    
    if (bg) setBgColor(bg);
    if (border) setBorderColor(border);
  }, [value]);

  const handleColorSelect = (type: 'bg' | 'border', colorName: string, shade: number) => {
    const newColor = `${type}-${colorName}-${shade}`;
    
    if (type === 'bg') {
      const newValue = [newColor, borderColor].filter(Boolean).join(' ');
      onChange(newValue);
    } else {
      const newValue = [bgColor, newColor].filter(Boolean).join(' ');
      onChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder || "Ví dụ: bg-red-50 border-red-400"}
          className="flex-1"
        />
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-10 h-9 p-0">
              <div className={cn("w-6 h-6 rounded border", value || "bg-gray-100")} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[600px] p-4" align="end">
            <div className="space-y-4">
              {/* Background Color */}
              <div>
                <h4 className="font-semibold mb-2">Màu nền (bg)</h4>
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {Object.entries(TAILWIND_COLORS).map(([colorName, shades]) => (
                    <div key={colorName} className="space-y-1">
                      <p className="text-xs font-medium capitalize">{colorName}</p>
                      <div className="flex gap-1 flex-wrap">
                        {shades.map((shade) => {
                          const colorClass = `bg-${colorName}-${shade}`;
                          const isSelected = bgColor === colorClass;
                          return (
                            <button
                              key={shade}
                              onClick={() => handleColorSelect('bg', colorName, shade)}
                              className={cn(
                                "w-8 h-8 rounded border transition-all",
                                colorClass,
                                isSelected && "ring-2 ring-primary ring-offset-2"
                              )}
                              title={`bg-${colorName}-${shade}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Border Color */}
              <div>
                <h4 className="font-semibold mb-2">Màu viền (border)</h4>
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {Object.entries(TAILWIND_COLORS).map(([colorName, shades]) => (
                    <div key={colorName} className="space-y-1">
                      <p className="text-xs font-medium capitalize">{colorName}</p>
                      <div className="flex gap-1 flex-wrap">
                        {shades.map((shade) => {
                          const colorClass = `border-${colorName}-${shade}`;
                          const isSelected = borderColor === colorClass;
                          return (
                            <button
                              key={shade}
                              onClick={() => handleColorSelect('border', colorName, shade)}
                              className={cn(
                                "w-8 h-8 rounded border-2 bg-white transition-all",
                                `border-${colorName}-${shade}`,
                                isSelected && "ring-2 ring-primary ring-offset-2"
                              )}
                              title={`border-${colorName}-${shade}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Xem trước:</p>
                <div className={cn("p-4 rounded-lg border text-center", value)}>
                  Mẫu card khiếu nại
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Kết quả: <code className="bg-muted px-1 rounded">{value}</code>
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

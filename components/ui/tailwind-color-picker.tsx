import * as React from 'react';
import { Button } from './button';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '../../lib/utils';

// Tailwind color hex values for inline rendering
const TAILWIND_HEX: Record<string, Record<number, string>> = {
  slate:   { 50:'#f8fafc',100:'#f1f5f9',200:'#e2e8f0',300:'#cbd5e1',400:'#94a3b8',500:'#64748b',600:'#475569',700:'#334155',800:'#1e293b',900:'#0f172a' },
  gray:    { 50:'#f9fafb',100:'#f3f4f6',200:'#e5e7eb',300:'#d1d5db',400:'#9ca3af',500:'#6b7280',600:'#4b5563',700:'#374151',800:'#1f2937',900:'#111827' },
  zinc:    { 50:'#fafafa',100:'#f4f4f5',200:'#e4e4e7',300:'#d4d4d8',400:'#a1a1aa',500:'#71717a',600:'#52525b',700:'#3f3f46',800:'#27272a',900:'#18181b' },
  neutral: { 50:'#fafafa',100:'#f5f5f5',200:'#e5e5e5',300:'#d4d4d4',400:'#a3a3a3',500:'#737373',600:'#525252',700:'#404040',800:'#262626',900:'#171717' },
  stone:   { 50:'#fafaf9',100:'#f5f5f4',200:'#e7e5e4',300:'#d6d3d1',400:'#a8a29e',500:'#78716c',600:'#57534e',700:'#44403c',800:'#292524',900:'#1c1917' },
  red:     { 50:'#fef2f2',100:'#fee2e2',200:'#fecaca',300:'#fca5a5',400:'#f87171',500:'#ef4444',600:'#dc2626',700:'#b91c1c',800:'#991b1b',900:'#7f1d1d' },
  orange:  { 50:'#fff7ed',100:'#ffedd5',200:'#fed7aa',300:'#fdba74',400:'#fb923c',500:'#f97316',600:'#ea580c',700:'#c2410c',800:'#9a3412',900:'#7c2d12' },
  amber:   { 50:'#fffbeb',100:'#fef3c7',200:'#fde68a',300:'#fcd34d',400:'#fbbf24',500:'#f59e0b',600:'#d97706',700:'#b45309',800:'#92400e',900:'#78350f' },
  yellow:  { 50:'#fefce8',100:'#fef9c3',200:'#fef08a',300:'#fde047',400:'#facc15',500:'#eab308',600:'#ca8a04',700:'#a16207',800:'#854d0e',900:'#713f12' },
  lime:    { 50:'#f7fee7',100:'#ecfccb',200:'#d9f99d',300:'#bef264',400:'#a3e635',500:'#84cc16',600:'#65a30d',700:'#4d7c0f',800:'#3f6212',900:'#365314' },
  green:   { 50:'#f0fdf4',100:'#dcfce7',200:'#bbf7d0',300:'#86efac',400:'#4ade80',500:'#22c55e',600:'#16a34a',700:'#15803d',800:'#166534',900:'#14532d' },
  emerald: { 50:'#ecfdf5',100:'#d1fae5',200:'#a7f3d0',300:'#6ee7b7',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857',800:'#065f46',900:'#064e3b' },
  teal:    { 50:'#f0fdfa',100:'#ccfbf1',200:'#99f6e4',300:'#5eead4',400:'#2dd4bf',500:'#14b8a6',600:'#0d9488',700:'#0f766e',800:'#115e59',900:'#134e4a' },
  cyan:    { 50:'#ecfeff',100:'#cffafe',200:'#a5f3fc',300:'#67e8f9',400:'#22d3ee',500:'#06b6d4',600:'#0891b2',700:'#0e7490',800:'#155e75',900:'#164e63' },
  sky:     { 50:'#f0f9ff',100:'#e0f2fe',200:'#bae6fd',300:'#7dd3fc',400:'#38bdf8',500:'#0ea5e9',600:'#0284c7',700:'#0369a1',800:'#075985',900:'#0c4a6e' },
  blue:    { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a' },
  indigo:  { 50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',300:'#a5b4fc',400:'#818cf8',500:'#6366f1',600:'#4f46e5',700:'#4338ca',800:'#3730a3',900:'#312e81' },
  violet:  { 50:'#f5f3ff',100:'#ede9fe',200:'#ddd6fe',300:'#c4b5fd',400:'#a78bfa',500:'#8b5cf6',600:'#7c3aed',700:'#6d28d9',800:'#5b21b6',900:'#4c1d95' },
  purple:  { 50:'#faf5ff',100:'#f3e8ff',200:'#e9d5ff',300:'#d8b4fe',400:'#c084fc',500:'#a855f7',600:'#9333ea',700:'#7e22ce',800:'#6b21a8',900:'#581c87' },
  fuchsia: { 50:'#fdf4ff',100:'#fae8ff',200:'#f5d0fe',300:'#f0abfc',400:'#e879f9',500:'#d946ef',600:'#c026d3',700:'#a21caf',800:'#86198f',900:'#701a75' },
  pink:    { 50:'#fdf2f8',100:'#fce7f3',200:'#fbcfe8',300:'#f9a8d4',400:'#f472b6',500:'#ec4899',600:'#db2777',700:'#be185d',800:'#9d174d',900:'#831843' },
  rose:    { 50:'#fff1f2',100:'#ffe4e6',200:'#fecdd3',300:'#fda4af',400:'#fb7185',500:'#f43f5e',600:'#e11d48',700:'#be123c',800:'#9f1239',900:'#881337' },
};

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

/** Get hex value for a Tailwind color class */
export function getTailwindHex(colorName: string, shade: number): string {
  return TAILWIND_HEX[colorName]?.[shade] ?? '#e5e7eb';
}

/** Parse a Tailwind class like "bg-red-50" → { color: "red", shade: 50, hex: "#fef2f2" } */
export function parseTailwindClass(cls: string): { color: string; shade: number; hex: string } | null {
  const match = cls.match(/^(?:bg|border|text)-([a-z]+)-(\d+)$/);
  if (!match) return null;
  const [, color, shadeStr] = match;
  const shade = parseInt(shadeStr);
  const hex = getTailwindHex(color, shade);
  return { color, shade, hex };
}

interface TailwindColorPickerProps {
  value: string; // e.g., "bg-red-50 border-red-400"
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

/** Convert Tailwind class value to inline styles */
function tailwindValueToStyle(value: string): React.CSSProperties {
  const parts = value.split(' ').filter(Boolean);
  const style: React.CSSProperties = {};
  for (const part of parts) {
    const parsed = parseTailwindClass(part);
    if (!parsed) continue;
    if (part.startsWith('bg-')) style.backgroundColor = parsed.hex;
    else if (part.startsWith('border-')) style.borderColor = parsed.hex;
  }
  return style;
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

  // Compute preview style from current value
  const previewStyle = tailwindValueToStyle(value);

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
              <div
                className="w-6 h-6 rounded border"
                style={{
                  backgroundColor: previewStyle.backgroundColor || '#f3f4f6',
                  borderColor: previewStyle.borderColor,
                }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-150 p-4" align="end">
            <div className="space-y-4">
              {/* Background Color */}
              <div>
                <h4 className="font-semibold mb-2">Màu nền (bg)</h4>
                <div className="max-h-75 overflow-y-auto space-y-2">
                  {Object.keys(TAILWIND_HEX).map((colorName) => (
                    <div key={colorName} className="space-y-1">
                      <p className="text-xs font-medium capitalize">{colorName}</p>
                      <div className="flex gap-1 flex-wrap">
                        {SHADES.map((shade) => {
                          const colorClass = `bg-${colorName}-${shade}`;
                          const hex = getTailwindHex(colorName, shade);
                          const isSelected = bgColor === colorClass;
                          return (
                            <button
                              key={shade}
                              onClick={() => handleColorSelect('bg', colorName, shade)}
                              className={cn(
                                "w-8 h-8 rounded border transition-all",
                                isSelected && "ring-2 ring-primary ring-offset-2"
                              )}
                              style={{ backgroundColor: hex }}
                              title={colorClass}
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
                <div className="max-h-75 overflow-y-auto space-y-2">
                  {Object.keys(TAILWIND_HEX).map((colorName) => (
                    <div key={colorName} className="space-y-1">
                      <p className="text-xs font-medium capitalize">{colorName}</p>
                      <div className="flex gap-1 flex-wrap">
                        {SHADES.map((shade) => {
                          const colorClass = `border-${colorName}-${shade}`;
                          const hex = getTailwindHex(colorName, shade);
                          const isSelected = borderColor === colorClass;
                          return (
                            <button
                              key={shade}
                              onClick={() => handleColorSelect('border', colorName, shade)}
                              className={cn(
                                "w-8 h-8 rounded bg-white transition-all",
                                isSelected && "ring-2 ring-primary ring-offset-2"
                              )}
                              style={{ borderWidth: 2, borderStyle: 'solid', borderColor: hex }}
                              title={colorClass}
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
                <div
                  className="p-4 rounded-lg text-center"
                  style={{
                    backgroundColor: previewStyle.backgroundColor || 'transparent',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: previewStyle.borderColor || 'var(--border)',
                  }}
                >
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

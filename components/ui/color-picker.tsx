import * as React from 'react'
import { cn } from '../../lib/utils.ts'
import { Input } from './input.tsx'
import { Label } from './label.tsx'
import { Button } from './button.tsx'

function hsvaToRgba(h: number, s: number, v: number, a: number) {
  s /= 100;
  v /= 100;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255), a };
}

function rgbaToHsva(r: number, g: number, b: number, a: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h, s: s * 100, v: v * 100, a };
}

function rgbaToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function hexToRgba(hex: string) {
    if (!hex) {
        return { r: 0, g: 0, b: 0, a: 1 };
    }
    let c: any;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return {r:(c>>16)&255, g:(c>>8)&255, b:c&255, a:1};
    }
    return {r:0, g:0, b:0, a:1};
}

// Preset colors palette
const presetColors = [
    // Grays
    '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6', '#FFFFFF',
    // Primary colors
    '#EF4444', '#F97316', '#EAB308', '#22C55E', '#14B8A6', '#3B82F6', '#8B5CF6', '#EC4899',
    // Light variants
    '#FCA5A5', '#FDBA74', '#FDE047', '#86EFAC', '#5EEAD4', '#93C5FD', '#C4B5FD', '#F9A8D4',
    // Dark variants  
    '#991B1B', '#C2410C', '#A16207', '#15803D', '#0F766E', '#1D4ED8', '#6D28D9', '#BE185D',
];

export const ColorPicker = ({ color = '#FF0000', onChange }: { color?: string; onChange: (color: string) => void }) => {
    const [hsva, setHsva] = React.useState({ h: 0, s: 100, v: 100, a: 1 });
    const [rgba, setRgba] = React.useState({ r: 255, g: 0, b: 0, a: 1 });
    const [hex, setHex] = React.useState("#FF0000");
    const [isDragging, setIsDragging] = React.useState(false);
    const saturationRef = React.useRef<HTMLDivElement>(null);
    const hueRef = React.useRef<HTMLDivElement>(null);
    const rafRef = React.useRef<number>(0);
    const pendingHsvaRef = React.useRef<typeof hsva | null>(null);

    React.useEffect(() => {
        // Skip external updates while dragging
        if (isDragging) return;
        
        let r = 255, g = 0, b = 0, a = 1;
        let successfulParse = false;
        const safeColor = (color ?? '#FF0000').trim() || '#FF0000';
        
        if (safeColor.startsWith('#')) {
            ({r, g, b, a} = hexToRgba(safeColor));
            successfulParse = true;
        } else if (safeColor.startsWith('rgb')) {
            const parts = safeColor.match(/[\d.]+/g) || [];
            if (parts.length >= 3) {
                r = parseInt(parts[0]!, 10);
                g = parseInt(parts[1]!, 10);
                b = parseInt(parts[2]!, 10);
                a = parts[3] ? parseFloat(parts[3]) : 1;
                successfulParse = true;
            }
        } else if (safeColor.startsWith('oklch')) {
            const tempEl = document.createElement('div');
            tempEl.style.color = safeColor;
            document.body.appendChild(tempEl);
            const computedColor = window.getComputedStyle(tempEl).color;
            document.body.removeChild(tempEl);
            
            const parts = computedColor.match(/[\d.]+/g) || [];
            if (parts.length >= 3) {
                r = parseInt(parts[0]!, 10);
                g = parseInt(parts[1]!, 10);
                b = parseInt(parts[2]!, 10);
                a = parts[3] ? parseFloat(parts[3]) : 1;
                successfulParse = true;
            }
        }

        if(successfulParse) {
            setRgba({r,g,b,a});
            setHex(rgbaToHex(r,g,b));
            setHsva(rgbaToHsva(r,g,b,a));
        }
    }, [color, isDragging]);

    // Local update only (no onChange) - for smooth dragging
    const updateLocalFromHsva = React.useCallback((newHsva: typeof hsva) => {
        setHsva(newHsva);
        const newRgba = hsvaToRgba(newHsva.h, newHsva.s, newHsva.v, newHsva.a);
        setRgba(newRgba);
        setHex(rgbaToHex(newRgba.r, newRgba.g, newRgba.b));
    }, []);

    // Commit to parent (calls onChange)
    const commitColor = React.useCallback((newRgba: typeof rgba) => {
        onChange(`rgba(${newRgba.r}, ${newRgba.g}, ${newRgba.b}, ${newRgba.a})`);
    }, [onChange]);

    const handleSaturationMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        let currentHsva = { ...hsva };
        
        const handleMove = (moveEvent: MouseEvent) => {
            if (!saturationRef.current) return;
            
            // Cancel previous RAF
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            
            rafRef.current = requestAnimationFrame(() => {
                const rect = saturationRef.current!.getBoundingClientRect();
                const x = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width));
                const y = Math.max(0, Math.min(1, (moveEvent.clientY - rect.top) / rect.height));
                currentHsva = { ...currentHsva, s: x * 100, v: (1 - y) * 100 };
                pendingHsvaRef.current = currentHsva;
                updateLocalFromHsva(currentHsva);
            });
        };
        
        const handleUp = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleUp);
            
            // Commit final color on mouse up
            if (pendingHsvaRef.current) {
                const finalRgba = hsvaToRgba(
                    pendingHsvaRef.current.h,
                    pendingHsvaRef.current.s,
                    pendingHsvaRef.current.v,
                    pendingHsvaRef.current.a
                );
                commitColor(finalRgba);
                pendingHsvaRef.current = null;
            }
        };
        
        handleMove(e.nativeEvent);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleUp);
    };

    const handleHueMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        let currentHsva = { ...hsva };
        
        const handleMove = (moveEvent: MouseEvent) => {
            if (!hueRef.current) return;
            
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            
            rafRef.current = requestAnimationFrame(() => {
                const rect = hueRef.current!.getBoundingClientRect();
                const x = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width));
                currentHsva = { ...currentHsva, h: x };
                pendingHsvaRef.current = currentHsva;
                updateLocalFromHsva(currentHsva);
            });
        };
        
        const handleUp = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleUp);
            
            if (pendingHsvaRef.current) {
                const finalRgba = hsvaToRgba(
                    pendingHsvaRef.current.h,
                    pendingHsvaRef.current.s,
                    pendingHsvaRef.current.v,
                    pendingHsvaRef.current.a
                );
                commitColor(finalRgba);
                pendingHsvaRef.current = null;
            }
        };
        
        handleMove(e.nativeEvent);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleUp);
    };

    const handlePresetClick = (presetColor: string) => {
        const {r, g, b} = hexToRgba(presetColor);
        setRgba({r, g, b, a: 1});
        setHex(presetColor);
        setHsva(rgbaToHsva(r, g, b, 1));
        commitColor({r, g, b, a: 1});
    };

    const hueColor = `hsl(${hsva.h * 360}, 100%, 50%)`;

    return (
        <div className="p-3 space-y-3 w-[280px]">
            {/* Saturation/Value picker */}
            <div 
                ref={saturationRef}
                className="relative h-40 rounded-md cursor-crosshair"
                style={{ backgroundColor: hueColor }}
                onMouseDown={handleSaturationMouseDown}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent rounded-md" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-md" />
                <div 
                    className="absolute w-4 h-4 border-2 border-white rounded-full shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ 
                        left: `${hsva.s}%`, 
                        top: `${100 - hsva.v}%`,
                        backgroundColor: `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`
                    }}
                />
            </div>

            {/* Hue slider */}
            <div 
                ref={hueRef}
                className="relative h-3 rounded-full cursor-pointer"
                style={{ 
                    background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
                }}
                onMouseDown={handleHueMouseDown}
            >
                <div 
                    className="absolute w-4 h-4 border-2 border-white rounded-full shadow-md -translate-x-1/2 -translate-y-1/4 pointer-events-none"
                    style={{ 
                        left: `${hsva.h * 100}%`,
                        backgroundColor: hueColor
                    }}
                />
            </div>

            {/* Preset colors */}
            <div className="grid grid-cols-8 gap-1">
                {presetColors.map((presetColor) => (
                    <button
                        key={presetColor}
                        type="button"
                        className={cn(
                            "w-6 h-6 rounded-md border border-border hover:scale-110 transition-transform",
                            hex.toUpperCase() === presetColor && "ring-2 ring-ring ring-offset-1"
                        )}
                        style={{ backgroundColor: presetColor }}
                        onClick={() => handlePresetClick(presetColor)}
                    />
                ))}
            </div>

            {/* Hex and OKLCH inputs */}
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <Label className="text-xs">Hex</Label>
                    <Input 
                        value={hex} 
                        className="h-8 text-xs font-mono"
                        onChange={(e) => {
                            const newHex = e.target.value ?? '';
                            setHex(newHex);
                            if (/^#([A-Fa-f0-9]{6})$/.test(newHex)) {
                                const {r,g,b} = hexToRgba(newHex);
                                setRgba({r, g, b, a: 1});
                                setHsva(rgbaToHsva(r, g, b, 1));
                                commitColor({r, g, b, a: 1});
                            }
                        }} 
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">OKLCH</Label>
                    <Input 
                        value={color ?? ''} 
                        className="h-8 text-xs font-mono"
                        onChange={(e) => onChange(e.target.value ?? '#000000')} 
                    />
                </div>
            </div>

            {/* RGBA inputs */}
            <div className="grid grid-cols-4 gap-1">
                <div className="space-y-1">
                    <Label className="text-xs">R</Label>
                    <Input 
                        type="number" 
                        value={rgba.r} 
                        min={0}
                        max={255}
                        className="h-8 text-xs"
                        onChange={(e) => {
                            const r = Math.min(255, Math.max(0, parseInt(e.target.value, 10) || 0));
                            const newRgba = { ...rgba, r };
                            setRgba(newRgba);
                            setHex(rgbaToHex(newRgba.r, newRgba.g, newRgba.b));
                            setHsva(rgbaToHsva(newRgba.r, newRgba.g, newRgba.b, newRgba.a));
                            commitColor(newRgba);
                        }} 
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">G</Label>
                    <Input 
                        type="number" 
                        value={rgba.g}
                        min={0}
                        max={255}
                        className="h-8 text-xs"
                        onChange={(e) => {
                            const g = Math.min(255, Math.max(0, parseInt(e.target.value, 10) || 0));
                            const newRgba = { ...rgba, g };
                            setRgba(newRgba);
                            setHex(rgbaToHex(newRgba.r, newRgba.g, newRgba.b));
                            setHsva(rgbaToHsva(newRgba.r, newRgba.g, newRgba.b, newRgba.a));
                            commitColor(newRgba);
                        }} 
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">B</Label>
                    <Input 
                        type="number" 
                        value={rgba.b}
                        min={0}
                        max={255}
                        className="h-8 text-xs"
                        onChange={(e) => {
                            const b = Math.min(255, Math.max(0, parseInt(e.target.value, 10) || 0));
                            const newRgba = { ...rgba, b };
                            setRgba(newRgba);
                            setHex(rgbaToHex(newRgba.r, newRgba.g, newRgba.b));
                            setHsva(rgbaToHsva(newRgba.r, newRgba.g, newRgba.b, newRgba.a));
                            commitColor(newRgba);
                        }} 
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs">A</Label>
                    <Input 
                        type="number" 
                        step="0.1" 
                        max="1" 
                        min="0" 
                        value={rgba.a}
                        className="h-8 text-xs"
                        onChange={(e) => {
                            const a = Math.min(1, Math.max(0, parseFloat(e.target.value) || 0));
                            const newRgba = { ...rgba, a };
                            setRgba(newRgba);
                            commitColor(newRgba);
                        }} 
                    />
                </div>
            </div>
        </div>
    );
};

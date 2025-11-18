import * as React from 'react'
import { cn } from '../../lib/utils.ts'
import { Input } from './input.tsx'
// FIX: Import the Label component to resolve 'Cannot find name' errors.
import { Label } from './label.tsx'

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
    let c: any;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return {r:(c>>16)&255, g:(c>>8)&255, b:c&255, a:1};
    }
    return {r:0, g:0, b:0, a:1}; // Invalid hex
}

// Simple oklch parser
function parseOklch(oklchStr: string) {
    const match = oklchStr.match(/oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+%?)(?:\s*\/\s*([\d.]+%?))?\s*\)/);
    if (match) {
        return {
            l: parseFloat(match[1]),
            c: parseFloat(match[2]),
            h: parseFloat(match[3]),
            a: match[4] ? parseFloat(match[4]) : 1,
        }
    }
    return null;
}

export const ColorPicker = ({ color, onChange }: { color: string; onChange: (color: string) => void }) => {
    const [hsva, setHsva] = React.useState({ h: 0, s: 100, v: 100, a: 1 });
    const [rgba, setRgba] = React.useState({ r: 255, g: 0, b: 0, a: 1 });
    const [hex, setHex] = React.useState("#FF0000");

    React.useEffect(() => {
        let r = 255, g = 0, b = 0, a = 1;
        let successfulParse = false;
        
        if (color.startsWith('#')) {
            ({r, g, b, a} = hexToRgba(color));
            successfulParse = true;
        } else if (color.startsWith('rgb')) {
            const parts = color.match(/[\d.]+/g) || [];
            if (parts && parts.length >= 3) {
                r = parseInt(parts[0], 10);
                g = parseInt(parts[1], 10);
                b = parseInt(parts[2], 10);
                a = parts.length > 3 ? parseFloat(parts[3]) : 1;
                successfulParse = true;
            }
        } else if (color.startsWith('oklch')) {
            const tempEl = document.createElement('div');
            tempEl.style.color = color;
            document.body.appendChild(tempEl);
            const computedColor = window.getComputedStyle(tempEl).color;
            document.body.removeChild(tempEl);
            
            const parts = computedColor.match(/[\d.]+/g) || [];
            if (parts && parts.length >= 3) {
                r = parseInt(parts[0], 10);
                g = parseInt(parts[1], 10);
                b = parseInt(parts[2], 10);
                a = parts.length > 3 ? parseFloat(parts[3]) : 1;
                successfulParse = true;
            }
        }

        if(successfulParse) {
            setRgba({r,g,b,a});
            setHex(rgbaToHex(r,g,b));
            setHsva(rgbaToHsva(r,g,b,a));
        }
    }, [color]);

    // FIX: Add return statement to the component.
    return (
        <div className="p-4 space-y-4">
            { /* Saturation/Value Grid, Hue Slider, Alpha Slider, etc. would go here */ }
            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <Label>Hex</Label>
                    <Input value={hex} onChange={(e) => {
                        const newHex = e.target.value;
                        setHex(newHex);
                        const {r,g,b} = hexToRgba(newHex);
                        // FIX: Change output format to rgb() to avoid errors with oklch conversion.
                        onChange(`rgb(${r}, ${g}, ${b})`);
                    }} />
                </div>
                <div className="space-y-1">
                    <Label>OKLCH</Label>
                    <Input value={color} onChange={(e) => onChange(e.target.value)} />
                </div>
            </div>
             <div className="grid grid-cols-4 gap-2">
                <div className="space-y-1">
                    <Label>R</Label>
                    <Input type="number" value={rgba.r} onChange={(e) => {
                        const r = parseInt(e.target.value, 10);
                        const newRgba = { ...rgba, r };
                        setRgba(newRgba);
                        // FIX: Change output format to rgba() to avoid errors with oklch conversion.
                        onChange(`rgba(${newRgba.r}, ${newRgba.g}, ${newRgba.b}, ${newRgba.a})`);
                    }} />
                </div>
                <div className="space-y-1">
                    <Label>G</Label>
                     <Input type="number" value={rgba.g} onChange={(e) => {
                        const g = parseInt(e.target.value, 10);
                        const newRgba = { ...rgba, g };
                        setRgba(newRgba);
                        // FIX: Change output format to rgba() to avoid errors with oklch conversion.
                        onChange(`rgba(${newRgba.r}, ${newRgba.g}, ${newRgba.b}, ${newRgba.a})`);
                    }} />
                </div>
                <div className="space-y-1">
                    <Label>B</Label>
                    <Input type="number" value={rgba.b} onChange={(e) => {
                        const b = parseInt(e.target.value, 10);
                        const newRgba = { ...rgba, b };
                        setRgba(newRgba);
                        // FIX: Change output format to rgba() to avoid errors with oklch conversion.
                         onChange(`rgba(${newRgba.r}, ${newRgba.g}, ${newRgba.b}, ${newRgba.a})`);
                    }} />
                </div>
                 <div className="space-y-1">
                    <Label>A</Label>
                    <Input type="number" step="0.1" max="1" min="0" value={rgba.a} onChange={(e) => {
                        const a = parseFloat(e.target.value);
                        const newRgba = { ...rgba, a };
                        setRgba(newRgba);
                        // FIX: Change output format to rgba() to avoid errors with oklch conversion.
                         onChange(`rgba(${newRgba.r}, ${newRgba.g}, ${newRgba.b}, ${newRgba.a})`);
                    }} />
                </div>
            </div>
        </div>
    );
};

import * as React from 'react';
import type { CustomThemeConfig, FontSize } from './store';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/ui/accordion';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Slider } from '../../../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { ColorPicker } from '../../../components/ui/color-picker';
import { ToggleGroup, ToggleGroupItem } from '../../../components/ui/toggle-group';


const ColorInputWithPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (value: string) => void }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="space-y-1.5">
            <Label className="text-sm truncate">{label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <div className="relative">
                    <Input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => setOpen(true)}
                        className="pl-8 text-sm font-mono h-9"
                        placeholder="e.g., oklch(0.2 0 0)"
                    />
                    <PopoverTrigger asChild>
                        <button 
                            type="button"
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md border" 
                            style={{ backgroundColor: value }}
                        />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-none" onOpenAutoFocus={(e) => e.preventDefault()}>
                        <ColorPicker color={value} onChange={onChange} />
                    </PopoverContent>
                </div>
            </Popover>
        </div>
    );
};

const colorSettings: { id: keyof CustomThemeConfig, label: string }[] = [
    { id: '--primary', label: 'Primary' },
    { id: '--primary-foreground', label: 'Primary Foreground' },
    { id: '--secondary', label: 'Secondary' },
    { id: '--secondary-foreground', label: 'Secondary Foreground' },
    { id: '--accent', label: 'Accent' },
    { id: '--accent-foreground', label: 'Accent Foreground' },
    { id: '--background', label: 'Background' },
    { id: '--foreground', label: 'Foreground' },
    { id: '--card', label: 'Card' },
    { id: '--card-foreground', label: 'Card Foreground' },
    { id: '--popover', label: 'Popover' },
    { id: '--popover-foreground', label: 'Popover Foreground' },
    { id: '--muted', label: 'Muted' },
    { id: '--muted-foreground', label: 'Muted Foreground' },
    { id: '--destructive', label: 'Destructive' },
    { id: '--destructive-foreground', label: 'Destructive Foreground' },
    { id: '--border', label: 'Border' },
    { id: '--input', label: 'Input' },
    { id: '--ring', label: 'Ring' },
    { id: '--chart-1', label: 'Chart 1' },
    { id: '--chart-2', label: 'Chart 2' },
    { id: '--chart-3', label: 'Chart 3' },
    { id: '--chart-4', label: 'Chart 4' },
    { id: '--chart-5', label: 'Chart 5' },
    { id: '--sidebar', label: 'Sidebar' },
    { id: '--sidebar-foreground', label: 'Sidebar Foreground' },
    { id: '--sidebar-primary', label: 'Sidebar Primary' },
    { id: '--sidebar-primary-foreground', label: 'Sidebar Primary FG' },
    { id: '--sidebar-accent', label: 'Sidebar Accent' },
    { id: '--sidebar-accent-foreground', label: 'Sidebar Accent FG' },
    { id: '--sidebar-border', label: 'Sidebar Border' },
    { id: '--sidebar-ring', label: 'Sidebar Ring' },
];

const fontOptions = [
    { label: 'Inter', value: 'Inter' },
    { label: 'Poppins', value: 'Poppins' },
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Source Sans 3', value: 'Source Sans 3' },
    { label: 'Source Serif 4', value: 'Source Serif 4' },
    { label: 'Geist Mono', value: 'Geist Mono' },
]

type CustomThemeFormProps = {
    config: CustomThemeConfig;
    onConfigChange: (config: Partial<CustomThemeConfig>) => void;
    fontSize: FontSize;
    onFontSizeChange: (size: FontSize) => void;
};


export function CustomThemeForm({ config, onConfigChange, fontSize, onFontSizeChange }: CustomThemeFormProps) {
    
    const handleConfigValueChange = (key: keyof CustomThemeConfig, value: any) => {
        onConfigChange({ [key]: value });
    };

    const handleRadiusChange = (value: readonly number[]) => {
        const remValue = (value[0] / 100 * 1.5).toFixed(3);
        onConfigChange({ '--radius': `${remValue}rem` });
    };
    
    const handleShadowSliderChange = (key: keyof CustomThemeConfig, value: readonly number[]) => {
        onConfigChange({ [key]: `${value[0]}px` });
    }

    const radiusValue = parseFloat(config['--radius']) || 0.5;
    const radiusSliderValue = (radiusValue / 1.5) * 100;
    
    return (
        <Accordion type="multiple" defaultValue={['colors']} className="w-full space-y-1">
            <AccordionItem value="colors">
                <AccordionTrigger>Màu sắc</AccordionTrigger>
                <AccordionContent>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-2">
                        {/* FIX: Wrapped component in a React.Fragment to move the `key` prop, resolving an error where `key` was incorrectly checked against the component's props. */}
                        {colorSettings.map(setting => (
                            <React.Fragment key={setting.id}>
                                <ColorInputWithPicker
                                    label={setting.label}
                                    value={config[setting.id]}
                                    onChange={value => handleConfigValueChange(setting.id, value)}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="typography">
                <AccordionTrigger>Kiểu chữ</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                     <div className="space-y-4">
                        <div>
                            <Label>Font Sans</Label>
                            <Select value={config['--font-sans']} onValueChange={v => handleConfigValueChange('--font-sans', v)}>
                                <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>{fontOptions.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Font Serif</Label>
                            <Select value={config['--font-serif']} onValueChange={v => handleConfigValueChange('--font-serif', v)}>
                                <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>{fontOptions.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Font Mono</Label>
                            <Select value={config['--font-mono']} onValueChange={v => handleConfigValueChange('--font-mono', v)}>
                                <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>{fontOptions.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label>Cỡ chữ</Label>
                        <ToggleGroup 
                            type="single" 
                            value={fontSize} 
                            onValueChange={(value: FontSize) => {
                                if (value) onFontSizeChange(value);
                            }}
                            className="w-full"
                        >
                            <ToggleGroupItem value="sm" className="w-full">Nhỏ</ToggleGroupItem>
                            <ToggleGroupItem value="base" className="w-full">Vừa</ToggleGroupItem>
                            <ToggleGroupItem value="lg" className="w-full">Lớn</ToggleGroupItem>
                        </ToggleGroup>
                     </div>

                     <div className="space-y-4 pt-4 border-t">
                        <Label>Cỡ chữ tiêu đề (Headings)</Label>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            {[1, 2, 3, 4, 5, 6].map((level) => {
                                const key = `--font-size-h${level}` as keyof CustomThemeConfig;
                                const valStr = config[key] || '1rem';
                                const valNum = parseFloat(valStr);
                                
                                return (
                                    <div key={level} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs text-muted-foreground">Heading {level} (H{level})</Label>
                                            <span className="text-xs font-mono text-muted-foreground">{valStr}</span>
                                        </div>
                                        <Slider 
                                            value={[valNum]} 
                                            min={0.5} 
                                            max={4} 
                                            step={0.125}
                                            onValueChange={(v) => handleConfigValueChange(key, `${v[0]}rem`)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                     </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="other">
                <AccordionTrigger>Khác</AccordionTrigger>
                <AccordionContent className="pt-4 space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Độ bo góc (Radius)</Label>
                            <span className="text-sm font-mono text-muted-foreground">{config['--radius']}</span>
                        </div>
                        <Slider
                            value={[radiusSliderValue]}
                            max={100}
                            step={1}
                            onValueChange={handleRadiusChange}
                        />
                    </div>
                    <div className="space-y-3">
                         <Label>Bóng đổ (Shadow)</Label>
                         <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm text-muted-foreground">X Offset</Label>
                                <span className="text-sm font-mono text-muted-foreground">{config['--shadow-x']}</span>
                            </div>
                            <Slider value={[parseInt(config['--shadow-x'])]} onValueChange={v => handleShadowSliderChange('--shadow-x', v)} min={-10} max={10} step={1} />

                            <div className="flex items-center justify-between">
                                <Label className="text-sm text-muted-foreground">Y Offset</Label>
                                <span className="text-sm font-mono text-muted-foreground">{config['--shadow-y']}</span>
                            </div>
                            <Slider value={[parseInt(config['--shadow-y'])]} onValueChange={v => handleShadowSliderChange('--shadow-y', v)} min={-10} max={10} step={1} />
                            
                            <div className="flex items-center justify-between">
                                <Label className="text-sm text-muted-foreground">Blur</Label>
                                <span className="text-sm font-mono text-muted-foreground">{config['--shadow-blur']}</span>
                            </div>
                            <Slider value={[parseInt(config['--shadow-blur'])]} onValueChange={v => handleShadowSliderChange('--shadow-blur', v)} min={0} max={20} step={1} />

                            <div className="flex items-center justify-between">
                                <Label className="text-sm text-muted-foreground">Spread</Label>
                                <span className="text-sm font-mono text-muted-foreground">{config['--shadow-spread']}</span>
                            </div>
                            <Slider value={[parseInt(config['--shadow-spread'])]} onValueChange={v => handleShadowSliderChange('--shadow-spread', v)} min={-10} max={10} step={1} />

                            <ColorInputWithPicker
                                label="Color"
                                value={config['--shadow-color']}
                                onChange={v => handleConfigValueChange('--shadow-color', v)}
                            />
                         </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

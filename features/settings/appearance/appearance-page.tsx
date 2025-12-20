import * as React from 'react'
import { Moon, Sun, ChevronsUpDown } from 'lucide-react'
import { toast } from 'sonner'
import { useSettingsPageHeader } from '../use-settings-page-header';
import { useAppearanceStore, type Theme, type FontSize, type CustomThemeConfig, type ColorMode } from './store'
import { getThemeConfig } from './themes';
import { Button } from '../../../components/ui/button'
import { SettingsActionButton } from '../../../components/settings/SettingsActionButton'
import { cn } from '../../../lib/utils'
import { CustomThemeForm } from './custom-theme-form'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../../components/ui/resizable'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { ScrollArea } from '../../../components/ui/scroll-area'
import { ToggleGroup, ToggleGroupItem } from '../../../components/ui/toggle-group';

import { PreviewCards } from '../previews/cards'
import { PreviewDashboard } from '../previews/dashboard'
import { PreviewAuthentication } from '../previews/authentication'

type PreviewComponent = 'Cards' | 'Dashboard' | 'Authentication';

const themeOptions: { name: Exclude<Theme, 'custom'>; color: string }[] = [
    { name: 'slate', color: 'bg-slate-900' },
    { name: 'blue', color: 'bg-blue-500' },
    { name: 'green', color: 'bg-green-500' },
    { name: 'amber', color: 'bg-amber-500' },
    { name: 'rose', color: 'bg-rose-500' },
    { name: 'purple', color: 'bg-violet-500' },
    { name: 'orange', color: 'bg-orange-500' },
    { name: 'teal', color: 'bg-teal-500' },
];

const PreviewComponents: Record<PreviewComponent, React.ComponentType> = {
    'Cards': PreviewCards,
    'Dashboard': PreviewDashboard,
    'Authentication': PreviewAuthentication,
};

export function AppearancePage() {
    // =====================================================
    // LOCAL STATE for preview only - NOT applied to system
    // Only save to store (and apply) when user clicks "Lưu"
    // =====================================================
    
    // Get SAVED values from store (what's currently applied to system)
    const savedTheme = useAppearanceStore(s => s.theme);
    const savedFontSize = useAppearanceStore(s => s.fontSize);
    const savedCustomThemeConfig = useAppearanceStore(s => s.customThemeConfig);
    const savedColorMode = useAppearanceStore(s => s.colorMode);
    
    // LOCAL state for live preview (not yet saved)
    const [localTheme, setLocalTheme] = React.useState<Theme>(savedTheme);
    const [localFontSize, setLocalFontSize] = React.useState<FontSize>(savedFontSize);
    const [localCustomThemeConfig, setLocalCustomThemeConfig] = React.useState<CustomThemeConfig>(savedCustomThemeConfig);
    const [localColorMode, setLocalColorMode] = React.useState<ColorMode>(savedColorMode);
    
    // Track if we just saved to prevent useEffect from resetting
    const justSavedRef = React.useRef(false);
    
    // Keep track of latest state in a ref to avoid recreating handleSave constantly
    // This fixes the issue where the header action button becomes stale because
    // the page header context doesn't update when event handlers change
    const stateRef = React.useRef({ 
        localTheme, 
        localFontSize, 
        localColorMode, 
        localCustomThemeConfig 
    });

    React.useEffect(() => {
        stateRef.current = { 
            localTheme, 
            localFontSize, 
            localColorMode, 
            localCustomThemeConfig 
        };
    }, [localTheme, localFontSize, localColorMode, localCustomThemeConfig]);
    
    // Sync local state when store changes (e.g., on initial mount/hydration)
    // But NOT right after we save (to prevent resetting to old values)
    React.useEffect(() => {
        if (justSavedRef.current) {
            return;
        }
        setLocalTheme(savedTheme);
        setLocalFontSize(savedFontSize);
        setLocalCustomThemeConfig(savedCustomThemeConfig);
        setLocalColorMode(savedColorMode);
    }, [savedTheme, savedFontSize, savedCustomThemeConfig, savedColorMode]);
    
    // Store actions - only called on Save
    const setTheme = useAppearanceStore(s => s.setTheme);
    const setFontSize = useAppearanceStore(s => s.setFontSize);
    const setColorMode = useAppearanceStore(s => s.setColorMode);
    const setCustomThemeConfig = useAppearanceStore(s => s.setCustomThemeConfig);
    const updateAppearance = useAppearanceStore(s => s.updateAppearance);
    
    // Preview panel state (UI only)
    const [previewComponent, setPreviewComponent] = React.useState<PreviewComponent>('Dashboard');

    // SAVE: Apply to store (which applies to system via ThemeProvider)
    const handleSave = React.useCallback(() => {
        const { localTheme, localFontSize, localColorMode, localCustomThemeConfig } = stateRef.current;
        
        console.log('[AppearancePage] Saving:', { localTheme, localColorMode, primary: localCustomThemeConfig['--primary'] });
        
        // Mark that we just saved so useEffect doesn't reset our values
        justSavedRef.current = true;
        // Reset after a small delay to allow all updates to propagate
        setTimeout(() => {
            justSavedRef.current = false;
        }, 100);
        
        updateAppearance({
            theme: localTheme,
            fontSize: localFontSize,
            colorMode: localColorMode,
            customThemeConfig: localCustomThemeConfig
        });
        
        toast.success('Đã lưu giao diện thành công!');
    }, [updateAppearance]);

    const headerActions = React.useMemo(() => [
        <SettingsActionButton key="save" onClick={handleSave}>
            Lưu
        </SettingsActionButton>,
    ], [handleSave]);

    useSettingsPageHeader({
        title: 'Giao diện',
        subtitle: 'Tùy chỉnh theme và giao diện ứng dụng',
        actions: headerActions,
    });

    const handleConfigChange = (newConfig: Partial<CustomThemeConfig>) => {
        setLocalTheme('custom');
        setLocalCustomThemeConfig(prev => ({ ...prev, ...newConfig }));
    };
    
    const handlePresetSelect = (themeName: Exclude<Theme, 'custom'>) => {
        setLocalTheme(themeName);
        const presetConfig = getThemeConfig(themeName, localColorMode);
        setLocalCustomThemeConfig(presetConfig);
    };
    
    const handleColorModeChange = (mode: ColorMode) => {
        setLocalColorMode(mode);
        if (localTheme !== 'custom') {
            const presetConfig = getThemeConfig(localTheme, mode);
            setLocalCustomThemeConfig(presetConfig);
        }
    };

    const ActivePreview = PreviewComponents[previewComponent];

    // Create preview style from LOCAL config (not saved yet)
    const previewStyle: React.CSSProperties = React.useMemo(() => {
        const shadow = `${localCustomThemeConfig['--shadow-x']} ${localCustomThemeConfig['--shadow-y']} ${localCustomThemeConfig['--shadow-blur']} ${localCustomThemeConfig['--shadow-spread']} ${localCustomThemeConfig['--shadow-color']}`;
        const vars = Object.fromEntries(
            Object.entries(localCustomThemeConfig).map(([key, value]) => [key, value])
        );
        return { ...vars, '--shadow': shadow } as React.CSSProperties;
    }, [localCustomThemeConfig]);
    
    return (
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0 p-4 border-b bg-card space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <h4 className="text-h6 font-medium text-muted-foreground mb-2">Theme</h4>
                        <div className="flex flex-wrap gap-2">
                            {themeOptions.map((t) => (
                                <Button
                                    key={t.name}
                                    variant={localTheme === t.name ? 'secondary' : 'outline'}
                                    size="sm"
                                    className="h-8"
                                    onClick={() => handlePresetSelect(t.name)}
                                >
                                    <div className={cn("h-4 w-4 rounded-full mr-2 border", t.color)} />
                                    <span className="capitalize">{t.name}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-h6 font-medium text-muted-foreground mb-2">Preview Mode</h4>
                        <ToggleGroup 
                            type="single" 
                            value={localColorMode} 
                            onValueChange={(value) => value && handleColorModeChange(value as ColorMode)}
                            className="bg-muted rounded-md p-1"
                        >
                            <ToggleGroupItem value="light" className="h-8 px-3 data-[state=on]:bg-background">
                                <Sun className="h-4 w-4 mr-1" />
                                Light
                            </ToggleGroupItem>
                            <ToggleGroupItem value="dark" className="h-8 px-3 data-[state=on]:bg-background">
                                <Moon className="h-4 w-4 mr-1" />
                                Dark
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </div>
            </div>
            <ResizablePanelGroup direction="horizontal" className="flex-grow">
                <ResizablePanel defaultSize={30} minSize={20}>
                    <ScrollArea className="h-full">
                        <div className="p-4 space-y-8">
                            <CustomThemeForm 
                                config={localCustomThemeConfig} 
                                onConfigChange={handleConfigChange}
                                fontSize={localFontSize}
                                onFontSizeChange={setLocalFontSize}
                            />
                        </div>
                    </ScrollArea>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={70}>
                    <div className="h-full flex flex-col bg-muted/40">
                        <div className="flex-shrink-0 flex items-center justify-between p-2 border-b bg-card">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="gap-1">
                                        Preview
                                        <span className="text-muted-foreground">/</span>
                                        {previewComponent}
                                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onSelect={() => setPreviewComponent('Cards')}>Cards</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setPreviewComponent('Dashboard')}>Dashboard</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setPreviewComponent('Authentication')}>Authentication</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <span className="text-xs text-muted-foreground">
                                {localColorMode === 'light' ? 'Light Mode' : 'Dark Mode'}
                            </span>
                        </div>
                        <ScrollArea className="flex-grow p-4 sm:p-6 lg:p-8">
                            <div 
                                style={{
                                    ...previewStyle,
                                    backgroundColor: localCustomThemeConfig['--background'],
                                    color: localCustomThemeConfig['--foreground'],
                                }}
                                className={cn(
                                    'rounded-lg p-6 min-h-[600px]',
                                    localColorMode === 'dark' ? 'dark' : '',
                                    `font-size-${localFontSize}`
                                )}
                            >
                                <ActivePreview />
                            </div>
                        </ScrollArea>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

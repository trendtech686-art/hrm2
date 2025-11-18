import * as React from 'react'
// FIX: Use named imports for react-router-dom to fix module export errors.
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, ChevronsUpDown } from 'lucide-react'
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { useAppearanceStore, type Theme, type FontSize, type CustomThemeConfig } from './store.ts'
import { themes as themePresets } from './themes.ts';
import { Button } from '../../../components/ui/button.tsx'
import { cn } from '../../../lib/utils.ts'
import { CustomThemeForm } from './custom-theme-form.tsx'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../../components/ui/resizable.tsx'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu.tsx';
import { ScrollArea } from '../../../components/ui/scroll-area.tsx';

import { PreviewCards } from '../previews/cards.tsx'
import { PreviewDashboard } from '../previews/dashboard.tsx'
import { PreviewAuthentication } from '../previews/authentication.tsx'

type PreviewComponent = 'Cards' | 'Dashboard' | 'Authentication';

const themes: { name: Exclude<Theme, 'custom'>; color: string }[] = [
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
    const store = useAppearanceStore();
    const navigate = useNavigate();
    
    usePageHeader({
        title: 'Giao diện',
        subtitle: 'Tùy chỉnh theme và giao diện ứng dụng',
        breadcrumb: [
            { label: 'Trang chủ', href: '/' },
            { label: 'Cài đặt', href: '/settings' },
            { label: 'Giao diện', href: '/settings/appearance', isCurrent: true }
        ]
    });
    
    // Local state for live preview
    const [localTheme, setLocalTheme] = React.useState<Theme>(store.theme);
    const [localFontSize, setLocalFontSize] = React.useState<FontSize>(store.fontSize);
    const [localCustomThemeConfig, setLocalCustomThemeConfig] = React.useState<CustomThemeConfig>(store.customThemeConfig);
    
    // Preview panel specific state
    const [previewComponent, setPreviewComponent] = React.useState<PreviewComponent>('Cards');
    const [previewMode, setPreviewMode] = React.useState<'light' | 'dark'>('light');

    React.useEffect(() => {
        setLocalTheme(store.theme);
        setLocalFontSize(store.fontSize);
        setLocalCustomThemeConfig(store.customThemeConfig);
    }, [store.theme, store.fontSize, store.customThemeConfig]);

    const handleSave = () => {
        store.setTheme(localTheme);
        store.setFontSize(localFontSize);
        // Always save the custom config, regardless of theme type
        store.setCustomThemeConfig(localCustomThemeConfig);
        navigate('/settings');
    };

    const handleConfigChange = (newConfig: Partial<CustomThemeConfig>) => {
        setLocalTheme('custom');
        setLocalCustomThemeConfig(prev => ({ ...prev, ...newConfig }));
    };
    
    const handlePresetSelect = (themeName: Exclude<Theme, 'custom'>) => {
      setLocalTheme(themeName);
      const presetConfig = themePresets[themeName];
      if (presetConfig) {
        setLocalCustomThemeConfig(presetConfig);
      }
    };

    const ActivePreview = PreviewComponents[previewComponent];

    // Create a temporary theme for the preview panel
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
                 <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-semibold leading-none tracking-tight">Cài đặt giao diện</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Tùy chỉnh giao diện của ứng dụng và xem trước thay đổi.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => navigate('/settings')}>Thoát</Button>
                        <Button onClick={handleSave}>Lưu</Button>
                    </div>
                 </div>
                 <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Theme</h4>
                    <div className="flex flex-wrap gap-2">
                        {themes.map((t) => (
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

                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => setPreviewMode(m => m === 'light' ? 'dark' : 'light')}>
                                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </div>
                        </div>
                        <ScrollArea className="flex-grow p-4 sm:p-6 lg:p-8">
                            <div 
                                style={previewStyle}
                                className={cn(
                                    'rounded-lg',
                                    previewMode,
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

"use client";

import * as React from 'react'
import dynamic from 'next/dynamic'
import { Moon, Sun, ChevronsUpDown } from 'lucide-react'
import { useSettingsPageHeader } from '../use-settings-page-header';
import { useAppearanceSettings, useAppearanceMutations } from './hooks/use-appearance-settings';
import { defaultCustomTheme, type Theme, type FontSize, type CustomThemeConfig, type ColorMode } from './store'
import { getThemeConfig } from './themes';
import { Button } from '../../../components/ui/button'
import { SettingsActionButton } from '../../../components/settings/SettingsActionButton'
import { useDirtyState } from '@/hooks/use-dirty-state'
import { cn } from '../../../lib/utils'
import { CustomThemeForm } from './custom-theme-form'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../../components/ui/resizable'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { ScrollArea } from '../../../components/ui/scroll-area'
import { ToggleGroup, ToggleGroupItem } from '../../../components/ui/toggle-group';
import { SettingsHistoryContent } from '../../../components/settings/SettingsHistoryContent';

import { ThemePreviewProvider } from './preview-provider'

// Lazy load preview components for better performance
const PreviewCardsLazy = dynamic(() => import('../previews/cards').then(mod => ({ default: mod.PreviewCards })), { ssr: false })
const PreviewDashboardLazy = dynamic(() => import('../previews/dashboard').then(mod => ({ default: mod.PreviewDashboard })), { ssr: false })
const PreviewAuthenticationLazy = dynamic(() => import('../previews/authentication').then(mod => ({ default: mod.PreviewAuthentication })), { ssr: false })

type PreviewComponent = 'Cards' | 'Dashboard' | 'Authentication';

// Appearance state type for the reducer
interface AppearanceState {
    theme: Theme;
    fontSize: FontSize;
    colorMode: ColorMode;
    customThemeConfig: CustomThemeConfig;
    font: string;
}

// Action types for the reducer
type AppearanceAction =
    | { type: 'SET_STATE'; payload: AppearanceState }
    | { type: 'SET_THEME'; payload: Theme }
    | { type: 'SET_FONT_SIZE'; payload: FontSize }
    | { type: 'SET_COLOR_MODE'; payload: ColorMode }
    | { type: 'SET_CUSTOM_THEME_CONFIG'; payload: CustomThemeConfig }
    | { type: 'APPLY_PRESET'; payload: { themeName: Exclude<Theme, 'custom'>; config: CustomThemeConfig } }
    | { type: 'UPDATE_CUSTOM_CONFIG'; payload: Partial<CustomThemeConfig> };

// Reducer for all appearance state
function appearanceReducer(state: AppearanceState, action: AppearanceAction): AppearanceState {
    switch (action.type) {
        case 'SET_STATE':
            return { ...state, ...action.payload };
        case 'SET_THEME':
            return { ...state, theme: action.payload };
        case 'SET_FONT_SIZE':
            return { ...state, fontSize: action.payload };
        case 'SET_COLOR_MODE': {
            const newColorMode = action.payload;
            // If not custom theme, recalculate customThemeConfig for new color mode
            if (state.theme !== 'custom') {
                const presetConfig = getThemeConfig(state.theme, newColorMode);
                return { ...state, colorMode: newColorMode, customThemeConfig: presetConfig };
            }
            return { ...state, colorMode: newColorMode };
        }
        case 'SET_CUSTOM_THEME_CONFIG':
            return { ...state, customThemeConfig: action.payload };
        case 'APPLY_PRESET':
            return {
                ...state,
                theme: action.payload.themeName,
                customThemeConfig: action.payload.config,
            };
        case 'UPDATE_CUSTOM_CONFIG':
            return {
                ...state,
                theme: 'custom' as Theme,
                customThemeConfig: { ...state.customThemeConfig, ...action.payload },
            };
        default:
            return state;
    }
}

const themeOptions: { name: Exclude<Theme, 'custom'>; color: string }[] = [
    // eslint-disable-next-line hrm-theme/no-raw-palette-class -- Theme color swatches intentionally use Tailwind palette colors
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
    'Cards': PreviewCardsLazy,
    'Dashboard': PreviewDashboardLazy,
    'Authentication': PreviewAuthenticationLazy,
};

export function AppearancePage() {
    // =====================================================
    // DATA FROM REACT QUERY (from database)
    // =====================================================

    const { data: savedSettings } = useAppearanceSettings();
    const { saveMutation, resetMutation } = useAppearanceMutations();

    // =====================================================
    // LOCAL STATE for preview only - using useReducer as single source of truth
    // Only save to DB when user clicks "Lưu"
    // =====================================================

    const initialState: AppearanceState = {
        theme: savedSettings.theme,
        fontSize: savedSettings.fontSize,
        colorMode: savedSettings.colorMode,
        customThemeConfig: savedSettings.customThemeConfig,
        font: savedSettings.font,
    };

    const [state, dispatch] = React.useReducer(appearanceReducer, initialState);

    // Track if we just saved to prevent useEffect from resetting
    const justSavedRef = React.useRef(false);

    // Sync local state when saved data changes (e.g., initial load)
    // But NOT right after we save (to prevent resetting to old values)
    React.useEffect(() => {
        if (justSavedRef.current) {
            return;
        }
        dispatch({
            type: 'SET_STATE',
            payload: {
                theme: savedSettings.theme,
                fontSize: savedSettings.fontSize,
                colorMode: savedSettings.colorMode,
                customThemeConfig: savedSettings.customThemeConfig,
                font: savedSettings.font,
            },
        });
    }, [savedSettings.theme, savedSettings.fontSize, savedSettings.colorMode, savedSettings.customThemeConfig, savedSettings.font]);

    // Preview panel state (UI only)
    const [previewComponent, setPreviewComponent] = React.useState<PreviewComponent>('Dashboard');

    // SAVE: Save to database (which triggers theme-change event via React Query)
    const handleSave = React.useCallback(() => {
        const { theme, fontSize, colorMode, customThemeConfig, font } = state;

        // Mark that we just saved so useEffect doesn't reset our values
        justSavedRef.current = true;
        // Reset after a small delay to allow all updates to propagate
        setTimeout(() => {
            justSavedRef.current = false;
        }, 100);

        // Call React Query mutation to save to DB
        saveMutation.mutate({
            theme,
            fontSize,
            colorMode,
            font,
            customThemeConfig,
        });
    }, [saveMutation, state]);

    // RESET: Reset to default settings
    const handleReset = React.useCallback(() => {
        // Show confirmation dialog
        if (!window.confirm('Bạn có chắc muốn khôi phục giao diện về mặc định?')) {
            return;
        }

        const defaults = {
            theme: 'slate' as Theme,
            colorMode: 'light' as ColorMode,
            font: 'inter' as const,
            fontSize: 'base' as FontSize,
            customThemeConfig: defaultCustomTheme,
        };

        // Mark that we just saved so useEffect doesn't reset our values
        justSavedRef.current = true;
        setTimeout(() => {
            justSavedRef.current = false;
        }, 100);

        // Apply defaults to local state immediately
        dispatch({ type: 'SET_STATE', payload: defaults });

        // Call reset mutation to save to DB
        resetMutation.mutate();
    }, [resetMutation]);

    const storedAppearance = React.useMemo(
        () => ({ theme: savedSettings.theme, fontSize: savedSettings.fontSize, colorMode: savedSettings.colorMode, customThemeConfig: savedSettings.customThemeConfig }),
        [savedSettings.theme, savedSettings.fontSize, savedSettings.colorMode, savedSettings.customThemeConfig],
    );
    const localAppearance = React.useMemo(
        () => ({ theme: state.theme, fontSize: state.fontSize, colorMode: state.colorMode, customThemeConfig: state.customThemeConfig }),
        [state.theme, state.fontSize, state.colorMode, state.customThemeConfig],
    );
    const isDirty = useDirtyState(storedAppearance, localAppearance);

    const headerActions = React.useMemo(() => [
        <SettingsActionButton key="reset" onClick={handleReset} disabled={resetMutation.isPending}>
            Khôi phục mặc định
        </SettingsActionButton>,
        <SettingsActionButton key="save" onClick={handleSave} disabled={!isDirty}>
            Lưu
        </SettingsActionButton>,
    ], [handleSave, handleReset, isDirty, resetMutation.isPending]);

    useSettingsPageHeader({
        title: 'Giao diện',
        subtitle: 'Tùy chỉnh theme và giao diện ứng dụng',
        actions: headerActions,
    });

    const handleConfigChange = React.useCallback((newConfig: Partial<CustomThemeConfig>) => {
        dispatch({ type: 'UPDATE_CUSTOM_CONFIG', payload: newConfig });
    }, []);

    const handlePresetSelect = React.useCallback((themeName: Exclude<Theme, 'custom'>) => {
        const presetConfig = getThemeConfig(themeName, state.colorMode);
        dispatch({ type: 'APPLY_PRESET', payload: { themeName, config: presetConfig } });
    }, [state.colorMode]);

    const handleColorModeChange = React.useCallback((mode: ColorMode) => {
        dispatch({ type: 'SET_COLOR_MODE', payload: mode });
    }, []);

    const ActivePreview = PreviewComponents[previewComponent];
    
    return (
        <div className="h-full flex flex-col">
        <div className="flex-1 min-h-0">
        <div className="h-full flex flex-col">
            <div className="shrink-0 p-4 border-b bg-card space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <h4 className="text-h6 font-medium text-muted-foreground mb-2">Theme</h4>
                        <div className="flex flex-wrap gap-2">
                            {themeOptions.map((t) => (
                                <Button
                                    key={t.name}
                                    variant={state.theme === t.name ? 'secondary' : 'outline'}
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
                            value={state.colorMode} 
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
            <ResizablePanelGroup direction="horizontal" className="grow">
                <ResizablePanel defaultSize={30} minSize={20}>
                    <ScrollArea className="h-full">
                        <div className="p-4 space-y-8">
                            <CustomThemeForm 
                                config={state.customThemeConfig} 
                                onConfigChange={handleConfigChange}
                                fontSize={state.fontSize}
                                onFontSizeChange={(size) => dispatch({ type: 'SET_FONT_SIZE', payload: size })}
                            />
                        </div>
                    </ScrollArea>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={70}>
                    <div className="h-full flex flex-col bg-muted/40">
                        <div className="shrink-0 flex items-center justify-between p-2 border-b bg-card">
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
                                {state.colorMode === 'light' ? 'Light Mode' : 'Dark Mode'}
                            </span>
                        </div>
                        <ScrollArea className="grow p-4 sm:p-6 lg:p-8">
                            <ThemePreviewProvider 
                                config={state.customThemeConfig} 
                                colorMode={state.colorMode}
                            >
                                <div 
                                    className={cn(
                                        'rounded-lg p-6 min-h-150',
                                        state.colorMode === 'dark' ? 'dark' : '',
                                        `font-size-${state.fontSize}`
                                    )}
                                    style={{
                                        backgroundColor: state.customThemeConfig['--background'],
                                        color: state.customThemeConfig['--foreground'],
                                    }}
                                >
                                    <ActivePreview />
                                </div>
                            </ThemePreviewProvider>
                        </ScrollArea>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
        </div>

            <div className="mt-6">
                <SettingsHistoryContent entityTypes={['appearance']} />
            </div>
        </div>
    )
}

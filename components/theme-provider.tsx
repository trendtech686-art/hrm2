import * as React from 'react'
import { useAppearanceStore } from '../features/settings/appearance/store.ts'
import type { CustomThemeConfig } from '../features/settings/appearance/store.ts'

function applyTheme(customThemeConfig: CustomThemeConfig, colorMode: string, fontSize: string) {
  const root = window.document.documentElement;
  
  console.log('[ThemeProvider] Applying theme:', { colorMode, fontSize, primary: customThemeConfig['--primary'] });

  // Color Mode
  root.classList.remove('light', 'dark');
  root.classList.add(colorMode);

  // Font Size
  root.classList.remove('font-size-sm', 'font-size-base', 'font-size-lg');
  root.classList.add(`font-size-${fontSize}`);

  // Apply CSS variables directly to root element for highest specificity
  const cssVars = [
    '--background', '--foreground', '--card', '--card-foreground',
    '--popover', '--popover-foreground', '--primary', '--primary-foreground',
    '--secondary', '--secondary-foreground', '--muted', '--muted-foreground',
    '--accent', '--accent-foreground', '--destructive', '--destructive-foreground',
    '--border', '--input', '--ring',
    '--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5',
    '--sidebar', '--sidebar-foreground', '--sidebar-primary', '--sidebar-primary-foreground',
    '--sidebar-accent', '--sidebar-accent-foreground', '--sidebar-border', '--sidebar-ring',
    '--radius', '--font-sans', '--font-serif', '--font-mono',
    '--font-size-h1', '--font-size-h2', '--font-size-h3', '--font-size-h4', '--font-size-h5', '--font-size-h6'
  ] as const;
  
  cssVars.forEach(varName => {
    const value = customThemeConfig[varName];
    if (value) root.style.setProperty(varName, value);
  });

  // Shadow
  const shadow = `${customThemeConfig['--shadow-x'] || '0px'} ${customThemeConfig['--shadow-y'] || '1px'} ${customThemeConfig['--shadow-blur'] || '2px'} ${customThemeConfig['--shadow-spread'] || '0px'} ${customThemeConfig['--shadow-color'] || 'hsl(0 0% 0% / 0.05)'}`;
  root.style.setProperty('--shadow', shadow);
  
  // Force browser to recalculate styles by triggering a reflow
  root.style.display = 'none';
  void root.offsetHeight; // Force reflow
  root.style.display = '';
}

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const customThemeConfig = useAppearanceStore(s => s.customThemeConfig);
  const colorMode = useAppearanceStore(s => s.colorMode);
  const fontSize = useAppearanceStore(s => s.fontSize);

  // Apply theme whenever store values change
  React.useEffect(() => {
    if (!customThemeConfig) return;
    applyTheme(customThemeConfig, colorMode, fontSize);
  }, [customThemeConfig, colorMode, fontSize]);

  // Subscribe to store rehydration and apply theme
  React.useEffect(() => {
    // Apply immediately with current store values
    const state = useAppearanceStore.getState();
    if (state.customThemeConfig) {
      applyTheme(state.customThemeConfig, state.colorMode, state.fontSize);
    }

    // Also subscribe to any changes (including rehydration)
    const unsubscribe = useAppearanceStore.subscribe((state) => {
      if (state.customThemeConfig) {
        applyTheme(state.customThemeConfig, state.colorMode, state.fontSize);
      }
    });

    return unsubscribe;
  }, []);

  return <>{children}</>
}

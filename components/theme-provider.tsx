import * as React from 'react'
import { useAppearanceStore } from '../features/settings/appearance/store'
import type { CustomThemeConfig } from '../features/settings/appearance/store'

function applyTheme(customThemeConfig: CustomThemeConfig, colorMode: string, fontSize: string) {
  const root = window.document.documentElement;
  

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
  const font = useAppearanceStore(s => s.font);

  // Apply theme whenever store values change
  React.useEffect(() => {
    // Ensure font variables are applied even if customThemeConfig missing
    if (!customThemeConfig) return;
    applyTheme(customThemeConfig, colorMode, fontSize);
    // Apply font families from store (if defined) to root CSS vars
    const root = window.document.documentElement;
    if (font && typeof font === 'object' && 'sans' in font) {
      root.style.setProperty('--font-sans', (font as { sans?: string }).sans || '');
    }
    if (font && typeof font === 'object' && 'serif' in font) {
      root.style.setProperty('--font-serif', (font as { serif?: string }).serif || '');
    }
    if (font && typeof font === 'object' && 'mono' in font) {
      root.style.setProperty('--font-mono', (font as { mono?: string }).mono || '');
    }
  }, [customThemeConfig, colorMode, fontSize, font]);

  // Subscribe to store rehydration and apply theme
  React.useEffect(() => {
    const root = window.document.documentElement;
    // Apply immediately with current store values
    const state = useAppearanceStore.getState();
    if (state.customThemeConfig) {
      applyTheme(state.customThemeConfig, state.colorMode, state.fontSize);
    }
    // Apply font families on init
    if (state.font && typeof state.font === 'object' && 'sans' in state.font) {
      root.style.setProperty('--font-sans', (state.font as { sans?: string }).sans || '');
    }
    if (state.font && typeof state.font === 'object' && 'serif' in state.font) {
      root.style.setProperty('--font-serif', (state.font as { serif?: string }).serif || '');
    }
    if (state.font && typeof state.font === 'object' && 'mono' in state.font) {
      root.style.setProperty('--font-mono', (state.font as { mono?: string }).mono || '');
    }

    // Also subscribe to any changes (including rehydration)
    const unsubscribe = useAppearanceStore.subscribe((state) => {
      if (state.customThemeConfig) {
        applyTheme(state.customThemeConfig, state.colorMode, state.fontSize);
      }
      if (state.font && typeof state.font === 'object' && 'sans' in state.font) {
        root.style.setProperty('--font-sans', (state.font as { sans?: string }).sans || '');
      }
      if (state.font && typeof state.font === 'object' && 'serif' in state.font) {
        root.style.setProperty('--font-serif', (state.font as { serif?: string }).serif || '');
      }
      if (state.font && typeof state.font === 'object' && 'mono' in state.font) {
        root.style.setProperty('--font-mono', (state.font as { mono?: string }).mono || '');
      }
    });

    return unsubscribe;
  }, []);

  return <>{children}</>
}

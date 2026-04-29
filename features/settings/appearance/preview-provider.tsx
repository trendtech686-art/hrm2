/**
 * Theme Preview Provider
 * 
 * Wraps preview content to apply custom CSS variables for theme preview.
 * This is needed because Tailwind utility classes (bg-primary, text-primary, etc.)
 * read CSS variables from :root/documentElement, not from inline styles.
 * 
 * When user is editing a custom theme, we need to temporarily set these variables
 * on the document root so the preview components can see them.
 * 
 * @module features/settings/appearance/preview-provider
 */

'use client';

import * as React from 'react';
import type { CustomThemeConfig } from './store';

type ThemePreviewContextType = {
    previewConfig: CustomThemeConfig | null;
    colorMode: 'light' | 'dark';
};

const ThemePreviewContext = React.createContext<ThemePreviewContextType>({
    previewConfig: null,
    colorMode: 'light',
});

export function useThemePreview() {
    return React.useContext(ThemePreviewContext);
}

type ThemePreviewProviderProps = {
    children: React.ReactNode;
    config: CustomThemeConfig;
    colorMode: 'light' | 'dark';
};

/**
 * ThemePreviewProvider
 * 
 * Temporarily applies CSS variables to document.documentElement for preview purposes.
 * Saves the original values before applying new ones, and restores them when unmounting
 * or when values change.
 */
export function ThemePreviewProvider({ children, config, colorMode }: ThemePreviewProviderProps) {
    const prevConfigRef = React.useRef<CustomThemeConfig | null>(null);
    const prevColorModeRef = React.useRef<string | null>(null);
    const isPreviewActiveRef = React.useRef(false);

    React.useEffect(() => {
        const root = document.documentElement;
        const cssVarsToSync = [
            '--background', '--foreground', '--card', '--card-foreground',
            '--popover', '--popover-foreground', '--primary', '--primary-foreground',
            '--secondary', '--secondary-foreground', '--muted', '--muted-foreground',
            '--accent', '--accent-foreground', '--destructive', '--destructive-foreground',
            '--success', '--success-foreground', '--warning', '--warning-foreground', '--info', '--info-foreground',
            '--border', '--input', '--ring',
            '--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5',
            '--sidebar', '--sidebar-foreground', '--sidebar-primary', '--sidebar-primary-foreground',
            '--sidebar-accent', '--sidebar-accent-foreground', '--sidebar-border', '--sidebar-ring',
            '--radius',
            '--font-size-h1', '--font-size-h2', '--font-size-h3', '--font-size-h4', '--font-size-h5', '--font-size-h6',
            '--shadow-x', '--shadow-y', '--shadow-blur', '--shadow-spread', '--shadow-color',
        ];

        // Cleanup: Restore original values before applying new ones (handles config/colorMode changes)
        if (isPreviewActiveRef.current && prevConfigRef.current) {
            for (const [key, value] of Object.entries(prevConfigRef.current)) {
                if (value) {
                    root.style.setProperty(key, value);
                } else {
                    root.style.removeProperty(key);
                }
            }

            if (prevColorModeRef.current) {
                root.classList.remove('light', 'dark');
                root.classList.add(prevColorModeRef.current);
            }
        }

        // Save original values if not already saved (only on first mount)
        if (!prevConfigRef.current) {
            const originalValues: CustomThemeConfig = {} as unknown as CustomThemeConfig;
            for (const key of cssVarsToSync) {
                originalValues[key as keyof CustomThemeConfig] = root.style.getPropertyValue(key).trim() 
                    || getComputedStyle(root).getPropertyValue(key).trim()
                    || '';
            }
            prevConfigRef.current = originalValues;

            // Save original color mode
            prevColorModeRef.current = root.classList.contains('dark') ? 'dark' : 'light';
        }

        // Mark preview as active
        isPreviewActiveRef.current = true;

        // Apply new theme values
        for (const [key, value] of Object.entries(config)) {
            if (value) {
                root.style.setProperty(key, value);
            }
        }

        // Handle shadow combined variable
        const shadowX = config['--shadow-x'] || '0px';
        const shadowY = config['--shadow-y'] || '1px';
        const shadowBlur = config['--shadow-blur'] || '2px';
        const shadowSpread = config['--shadow-spread'] || '0px';
        const shadowColor = config['--shadow-color'] || 'hsl(0 0% 0% / 0.05)';
        root.style.setProperty('--shadow', `${shadowX} ${shadowY} ${shadowBlur} ${shadowSpread} ${shadowColor}`);

        // Apply color mode class
        root.classList.remove('light', 'dark');
        root.classList.add(colorMode);

        // Cleanup function (runs on unmount only)
        return () => {
            if (prevConfigRef.current) {
                for (const [key, value] of Object.entries(prevConfigRef.current)) {
                    if (value) {
                        root.style.setProperty(key, value);
                    } else {
                        root.style.removeProperty(key);
                    }
                }
            }

            if (prevColorModeRef.current) {
                root.classList.remove('light', 'dark');
                root.classList.add(prevColorModeRef.current);
            }

            // Reset preview active flag
            isPreviewActiveRef.current = false;
        };
    }, [config, colorMode]);

    return (
        <ThemePreviewContext.Provider value={{ previewConfig: config, colorMode }}>
            {children}
        </ThemePreviewContext.Provider>
    );
}

/**
 * Reset Theme Preview
 * 
 * Call this to immediately restore original theme and clear preview state.
 * Useful when user cancels or navigates away from the appearance settings page.
 */
export function resetThemePreview() {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    const originalConfig = (window as unknown as { _hrmOriginalThemeConfig?: CustomThemeConfig })._hrmOriginalThemeConfig;
    
    if (originalConfig) {
        for (const [key, value] of Object.entries(originalConfig)) {
            if (value) {
                root.style.setProperty(key, value);
            }
        }
        delete (window as unknown as { _hrmOriginalThemeConfig?: CustomThemeConfig })._hrmOriginalThemeConfig;
    }
}

import * as React from 'react'
import { useAppearanceStore } from '../features/settings/appearance/store.ts'

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const { theme, font, fontSize, customThemeConfig } = useAppearanceStore()

  React.useEffect(() => {
    const root = window.document.documentElement;

    // --- Font Size (unchanged) ---
    root.classList.remove('font-size-sm', 'font-size-base', 'font-size-lg');
    root.classList.add(`font-size-${fontSize}`);

    // --- Theme Handling ---
    // 1. Clean up previous theme state
    root.classList.remove('theme-slate', 'theme-blue', 'theme-green', 'theme-amber', 'theme-rose', 'theme-purple', 'theme-orange', 'theme-teal');
    
    let styleElement = document.getElementById('custom-theme-style');
    if (styleElement) {
        styleElement.remove();
    }
    // Reset individual properties explicitly
    root.style.removeProperty('--radius');
    root.style.removeProperty('--font-sans');
    root.style.removeProperty('--font-serif');
    root.style.removeProperty('--font-mono');


    // 2. Apply new theme state
    if (theme === 'custom' && customThemeConfig) {
        styleElement = document.createElement('style');
        styleElement.id = 'custom-theme-style';

        // Compose shadow variable from individual parts
        const shadow = `${customThemeConfig['--shadow-x'] || '0px'} ${customThemeConfig['--shadow-y'] || '1px'} ${customThemeConfig['--shadow-blur'] || '2px'} ${customThemeConfig['--shadow-spread'] || '0px'} ${customThemeConfig['--shadow-color'] || 'hsl(0 0% 0% / 0.05)'}`;

        const cssVariables = Object.entries(customThemeConfig)
            // Exclude properties that are handled separately or composed
            .filter(([key]) => ![
                '--radius', '--font-sans', '--font-serif', '--font-mono',
                '--shadow-x', '--shadow-y', '--shadow-blur', '--shadow-spread', '--shadow-color'
            ].includes(key))
            .map(([key, value]) => `${key}: ${value};`)
            .join('\n');
        
        styleElement.innerHTML = `:root { 
            ${cssVariables}
            --shadow: ${shadow};
        }`;
        document.head.appendChild(styleElement);

        // Apply properties directly to the root element's style
        root.style.setProperty('--radius', customThemeConfig['--radius']);
        root.style.setProperty('--font-sans', customThemeConfig['--font-sans']);
        root.style.setProperty('--font-serif', customThemeConfig['--font-serif']);
        root.style.setProperty('--font-mono', customThemeConfig['--font-mono']);

    } else {
        root.classList.add(`theme-${theme}`);
        // For preset themes, ensure custom font variables are set to their defaults
        root.style.setProperty('--font-sans', 'Inter');
        root.style.setProperty('--font-serif', 'Source Serif 4');
        root.style.setProperty('--font-mono', 'Geist Mono');
    }

    // This is the old font logic, we keep it for backward compatibility with presets
    // but custom themes will override it with CSS variables.
    root.classList.remove('font-inter', 'font-poppins', 'font-roboto', 'font-source-sans-3');
    if (theme !== 'custom') {
      root.classList.add(`font-${font}`);
    }


  }, [theme, font, fontSize, customThemeConfig]);

  return <>{children}</>
}

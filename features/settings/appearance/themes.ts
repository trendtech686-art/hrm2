import type { CustomThemeConfig } from './store.ts';

// Base light config shared across themes
const baseLightConfig: Omit<CustomThemeConfig, '--primary' | '--primary-foreground' | '--ring' | '--sidebar-primary' | '--sidebar-primary-foreground'> = {
    '--background': 'oklch(1 0 0)',
    '--foreground': 'oklch(0.145 0 0)',
    '--card': 'oklch(1 0 0)',
    '--card-foreground': 'oklch(0.145 0 0)',
    '--popover': 'oklch(1 0 0)',
    '--popover-foreground': 'oklch(0.145 0 0)',
    '--secondary': 'oklch(0.97 0 0)',
    '--secondary-foreground': 'oklch(0.205 0 0)',
    '--muted': 'oklch(0.97 0 0)',
    '--muted-foreground': 'oklch(0.556 0 0)',
    '--accent': 'oklch(0.97 0 0)',
    '--accent-foreground': 'oklch(0.205 0 0)',
    '--destructive': 'oklch(0.577 0.245 27.325)',
    '--destructive-foreground': 'oklch(0.985 0 0)',
    '--border': 'oklch(0.922 0 0)',
    '--input': 'oklch(0.922 0 0)',
    '--radius': '0.625rem',
    '--font-sans': 'Inter',
    '--font-serif': 'Source Serif 4',
    '--font-mono': 'Geist Mono',
    '--shadow-x': '0px',
    '--shadow-y': '1px',
    '--shadow-blur': '2px',
    '--shadow-spread': '0px',
    '--shadow-color': 'hsl(0 0% 0% / 0.05)',
    '--chart-1': 'oklch(0.646 0.222 41.116)',
    '--chart-2': 'oklch(0.6 0.118 184.704)',
    '--chart-3': 'oklch(0.398 0.07 227.392)',
    '--chart-4': 'oklch(0.828 0.189 84.429)',
    '--chart-5': 'oklch(0.769 0.188 70.08)',
    '--sidebar': 'oklch(0.985 0 0)',
    '--sidebar-foreground': 'oklch(0.145 0 0)',
    '--sidebar-accent': 'oklch(0.97 0 0)',
    '--sidebar-accent-foreground': 'oklch(0.205 0 0)',
    '--sidebar-border': 'oklch(0.922 0 0)',
    '--sidebar-ring': 'oklch(0.708 0 0)',
    // Default heading sizes
    '--font-size-h1': '2.25rem', // 36px
    '--font-size-h2': '1.875rem', // 30px
    '--font-size-h3': '1.5rem', // 24px
    '--font-size-h4': '1.25rem', // 20px
    '--font-size-h5': '1.125rem', // 18px
    '--font-size-h6': '1rem', // 16px
};

// Official shadcn/ui theme colors - extracted from https://ui.shadcn.com/docs/theming
export const themes: Record<string, CustomThemeConfig> = {
    // Slate - from shadcn docs
    slate: {
        ...baseLightConfig,
        '--background': 'oklch(1 0 0)',
        '--foreground': 'oklch(0.129 0.042 264.695)',
        '--card': 'oklch(1 0 0)',
        '--card-foreground': 'oklch(0.129 0.042 264.695)',
        '--popover': 'oklch(1 0 0)',
        '--popover-foreground': 'oklch(0.129 0.042 264.695)',
        '--primary': 'oklch(0.208 0.042 265.755)',
        '--primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--secondary': 'oklch(0.968 0.007 247.896)',
        '--secondary-foreground': 'oklch(0.208 0.042 265.755)',
        '--muted': 'oklch(0.968 0.007 247.896)',
        '--muted-foreground': 'oklch(0.554 0.046 257.417)',
        '--accent': 'oklch(0.968 0.007 247.896)',
        '--accent-foreground': 'oklch(0.208 0.042 265.755)',
        '--border': 'oklch(0.929 0.013 255.508)',
        '--input': 'oklch(0.929 0.013 255.508)',
        '--ring': 'oklch(0.704 0.04 256.788)',
        '--sidebar': 'oklch(0.984 0.003 247.858)',
        '--sidebar-foreground': 'oklch(0.129 0.042 264.695)',
        '--sidebar-primary': 'oklch(0.208 0.042 265.755)',
        '--sidebar-primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--sidebar-accent': 'oklch(0.968 0.007 247.896)',
        '--sidebar-accent-foreground': 'oklch(0.208 0.042 265.755)',
        '--sidebar-border': 'oklch(0.929 0.013 255.508)',
        '--sidebar-ring': 'oklch(0.704 0.04 256.788)',
    },
    
    // Blue - official shadcn blue theme
    blue: {
        ...baseLightConfig,
        '--primary': 'oklch(0.546 0.245 262.881)',
        '--primary-foreground': 'oklch(0.985 0 0)',
        '--ring': 'oklch(0.546 0.245 262.881)',
        '--sidebar-primary': 'oklch(0.546 0.245 262.881)',
        '--sidebar-primary-foreground': 'oklch(0.985 0 0)',
    },
    
    // Green - official shadcn green theme
    green: {
        ...baseLightConfig,
        '--primary': 'oklch(0.596 0.145 163.225)',
        '--primary-foreground': 'oklch(0.985 0 0)',
        '--ring': 'oklch(0.596 0.145 163.225)',
        '--sidebar-primary': 'oklch(0.596 0.145 163.225)',
        '--sidebar-primary-foreground': 'oklch(0.985 0 0)',
    },
    
    // Amber/Yellow - official shadcn yellow theme
    amber: {
        ...baseLightConfig,
        '--primary': 'oklch(0.795 0.184 86.047)',
        '--primary-foreground': 'oklch(0.421 0.095 57.708)',
        '--ring': 'oklch(0.795 0.184 86.047)',
        '--sidebar-primary': 'oklch(0.795 0.184 86.047)',
        '--sidebar-primary-foreground': 'oklch(0.421 0.095 57.708)',
    },
    
    // Rose - official shadcn rose theme
    rose: {
        ...baseLightConfig,
        '--primary': 'oklch(0.645 0.246 16.439)',
        '--primary-foreground': 'oklch(0.985 0 0)',
        '--ring': 'oklch(0.645 0.246 16.439)',
        '--sidebar-primary': 'oklch(0.645 0.246 16.439)',
        '--sidebar-primary-foreground': 'oklch(0.985 0 0)',
    },
    
    // Purple/Violet - official shadcn violet theme
    purple: {
        ...baseLightConfig,
        '--primary': 'oklch(0.606 0.25 292.717)',
        '--primary-foreground': 'oklch(0.985 0 0)',
        '--ring': 'oklch(0.606 0.25 292.717)',
        '--sidebar-primary': 'oklch(0.606 0.25 292.717)',
        '--sidebar-primary-foreground': 'oklch(0.985 0 0)',
    },
    
    // Orange - official shadcn orange theme
    orange: {
        ...baseLightConfig,
        '--primary': 'oklch(0.705 0.213 47.604)',
        '--primary-foreground': 'oklch(0.985 0 0)',
        '--ring': 'oklch(0.705 0.213 47.604)',
        '--sidebar-primary': 'oklch(0.705 0.213 47.604)',
        '--sidebar-primary-foreground': 'oklch(0.985 0 0)',
    },
    
    // Teal - based on shadcn cyan theme
    teal: {
        ...baseLightConfig,
        '--primary': 'oklch(0.715 0.143 215.221)',
        '--primary-foreground': 'oklch(0.282 0.066 243.157)',
        '--ring': 'oklch(0.715 0.143 215.221)',
        '--sidebar-primary': 'oklch(0.715 0.143 215.221)',
        '--sidebar-primary-foreground': 'oklch(0.282 0.066 243.157)',
    },
};

// Dark mode overrides for each theme
export const darkThemes: Record<string, Partial<CustomThemeConfig>> = {
    slate: {
        '--background': 'oklch(0.129 0.042 264.695)',
        '--foreground': 'oklch(0.984 0.003 247.858)',
        '--card': 'oklch(0.208 0.042 265.755)',
        '--card-foreground': 'oklch(0.984 0.003 247.858)',
        '--popover': 'oklch(0.208 0.042 265.755)',
        '--popover-foreground': 'oklch(0.984 0.003 247.858)',
        '--primary': 'oklch(0.929 0.013 255.508)',
        '--primary-foreground': 'oklch(0.208 0.042 265.755)',
        '--secondary': 'oklch(0.279 0.041 260.031)',
        '--secondary-foreground': 'oklch(0.984 0.003 247.858)',
        '--muted': 'oklch(0.279 0.041 260.031)',
        '--muted-foreground': 'oklch(0.704 0.04 256.788)',
        '--accent': 'oklch(0.279 0.041 260.031)',
        '--accent-foreground': 'oklch(0.984 0.003 247.858)',
        '--destructive': 'oklch(0.704 0.191 22.216)',
        '--border': 'oklch(1 0 0 / 10%)',
        '--input': 'oklch(1 0 0 / 15%)',
        '--ring': 'oklch(0.551 0.027 264.364)',
        '--sidebar': 'oklch(0.208 0.042 265.755)',
        '--sidebar-foreground': 'oklch(0.984 0.003 247.858)',
        '--sidebar-primary': 'oklch(0.488 0.243 264.376)',
        '--sidebar-primary-foreground': 'oklch(0.984 0.003 247.858)',
        '--sidebar-accent': 'oklch(0.279 0.041 260.031)',
        '--sidebar-accent-foreground': 'oklch(0.984 0.003 247.858)',
        '--sidebar-border': 'oklch(1 0 0 / 10%)',
        '--sidebar-ring': 'oklch(0.551 0.027 264.364)',
    },
    
    // Generic dark mode for colored themes
    _coloredDark: {
        '--background': 'oklch(0.145 0 0)',
        '--foreground': 'oklch(0.985 0 0)',
        '--card': 'oklch(0.205 0 0)',
        '--card-foreground': 'oklch(0.985 0 0)',
        '--popover': 'oklch(0.269 0 0)',
        '--popover-foreground': 'oklch(0.985 0 0)',
        '--secondary': 'oklch(0.269 0 0)',
        '--secondary-foreground': 'oklch(0.985 0 0)',
        '--muted': 'oklch(0.269 0 0)',
        '--muted-foreground': 'oklch(0.708 0 0)',
        '--accent': 'oklch(0.371 0 0)',
        '--accent-foreground': 'oklch(0.985 0 0)',
        '--destructive': 'oklch(0.704 0.191 22.216)',
        '--border': 'oklch(1 0 0 / 10%)',
        '--input': 'oklch(1 0 0 / 15%)',
        '--sidebar': 'oklch(0.205 0 0)',
        '--sidebar-foreground': 'oklch(0.985 0 0)',
        '--sidebar-accent': 'oklch(0.269 0 0)',
        '--sidebar-accent-foreground': 'oklch(0.985 0 0)',
        '--sidebar-border': 'oklch(1 0 0 / 10%)',
    },
};

// Get theme config for mode
export function getThemeConfig(themeName: string, mode: 'light' | 'dark'): CustomThemeConfig {
    const lightConfig = themes[themeName] || themes.slate;
    
    if (mode === 'light') {
        return lightConfig;
    }
    
    // For dark mode
    const darkOverrides = darkThemes[themeName] || darkThemes._coloredDark;
    return {
        ...lightConfig,
        ...darkOverrides,
        // Keep the primary color from light theme for colored themes (except slate)
        ...(themeName !== 'slate' ? {
            '--primary': lightConfig['--primary'],
            '--primary-foreground': lightConfig['--primary-foreground'],
            '--ring': lightConfig['--ring'],
            '--sidebar-primary': lightConfig['--sidebar-primary'],
            '--sidebar-primary-foreground': lightConfig['--sidebar-primary-foreground'],
        } : {}),
    };
}

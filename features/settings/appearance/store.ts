import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Theme = "slate" | "blue" | "green" | "amber" | "rose" | "purple" | "orange" | "teal" | "custom"
export type Font = "inter" | "poppins" | "roboto" | "source-sans-3"
export type FontSize = "sm" | "base" | "lg"
export type ColorMode = "light" | "dark"

export type CustomThemeConfig = {
    '--background': string;
    '--foreground': string;
    '--card': string;
    '--card-foreground': string;
    '--popover': string;
    '--popover-foreground': string;
    '--primary': string;
    '--primary-foreground': string;
    '--secondary': string;
    '--secondary-foreground': string;
    '--muted': string;
    '--muted-foreground': string;
    '--accent': string;
    '--accent-foreground': string;
    '--destructive': string;
    '--destructive-foreground': string;
    '--border': string;
    '--input': string;
    '--ring': string;
    '--radius': string;
    '--font-sans': string;
    '--font-serif': string;
    '--font-mono': string;
    '--shadow-x': string;
    '--shadow-y': string;
    '--shadow-blur': string;
    '--shadow-spread': string;
    '--shadow-color': string;
    '--chart-1': string;
    '--chart-2': string;
    '--chart-3': string;
    '--chart-4': string;
    '--chart-5': string;
    '--sidebar': string;
    '--sidebar-foreground': string;
    '--sidebar-primary': string;
    '--sidebar-primary-foreground': string;
    '--sidebar-accent': string;
    '--sidebar-accent-foreground': string;
    '--sidebar-border': string;
    '--sidebar-ring': string;
    // Heading sizes
    '--font-size-h1': string;
    '--font-size-h2': string;
    '--font-size-h3': string;
    '--font-size-h4': string;
    '--font-size-h5': string;
    '--font-size-h6': string;
};

const defaultCustomTheme: CustomThemeConfig = {
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
    '--destructive': 'oklch(0.577 0.245 27.325)',
    '--destructive-foreground': 'oklch(0.985 0 0)',
    '--border': 'oklch(0.929 0.013 255.508)',
    '--input': 'oklch(0.929 0.013 255.508)',
    '--ring': 'oklch(0.704 0.04 256.788)',
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
    '--sidebar': 'oklch(0.984 0.003 247.858)',
    '--sidebar-foreground': 'oklch(0.129 0.042 264.695)',
    '--sidebar-primary': 'oklch(0.208 0.042 265.755)',
    '--sidebar-primary-foreground': 'oklch(0.984 0.003 247.858)',
    '--sidebar-accent': 'oklch(0.968 0.007 247.896)',
    '--sidebar-accent-foreground': 'oklch(0.208 0.042 265.755)',
    '--sidebar-border': 'oklch(0.929 0.013 255.508)',
    '--sidebar-ring': 'oklch(0.704 0.04 256.788)',
    // Default heading sizes
    '--font-size-h1': '2.25rem', // 36px
    '--font-size-h2': '1.875rem', // 30px
    '--font-size-h3': '1.5rem', // 24px
    '--font-size-h4': '1.25rem', // 20px
    '--font-size-h5': '1.125rem', // 18px
    '--font-size-h6': '1rem', // 16px
};


type AppearanceState = {
  theme: Theme
  colorMode: ColorMode
  font: Font
  fontSize: FontSize
  customThemeConfig: CustomThemeConfig
  setTheme: (theme: Theme) => void
  setColorMode: (mode: ColorMode) => void
  setFont: (font: Font) => void
  setFontSize: (size: FontSize) => void
  setCustomThemeConfig: (config: CustomThemeConfig) => void
  updateAppearance: (settings: Partial<Omit<AppearanceState, 'setTheme' | 'setColorMode' | 'setFont' | 'setFontSize' | 'setCustomThemeConfig' | 'updateAppearance'>>) => void
}

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set) => ({
      theme: 'slate',
      colorMode: 'light',
      font: 'inter',
      fontSize: 'base',
      customThemeConfig: defaultCustomTheme,
      setTheme: (theme) => set({ theme }),
      setColorMode: (colorMode) => set({ colorMode }),
      setFont: (font) => set({ font }),
      setFontSize: (size) => set({ fontSize: size }),
      setCustomThemeConfig: (config) => set({ customThemeConfig: { ...config } }),
      updateAppearance: (settings) => set((state) => ({ ...state, ...settings })),
    }),
    {
      name: 'hrm-appearance-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Helper to get initial state from localStorage synchronously
export function getInitialAppearanceState() {
  try {
    const stored = localStorage.getItem('hrm-appearance-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state as Pick<AppearanceState, 'theme' | 'colorMode' | 'font' | 'fontSize' | 'customThemeConfig'>;
    }
  } catch {
    // ignore
  }
  return null;
}

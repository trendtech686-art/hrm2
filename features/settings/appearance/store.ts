import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Theme = "slate" | "blue" | "green" | "amber" | "rose" | "purple" | "orange" | "teal" | "custom"
export type Font = "inter" | "poppins" | "roboto" | "source-sans-3"
export type FontSize = "sm" | "base" | "lg"

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
};

const defaultCustomTheme: CustomThemeConfig = {
    '--background': 'oklch(1 0 0)',
    '--foreground': 'oklch(0.145 0 0)',
    '--card': 'oklch(1 0 0)',
    '--card-foreground': 'oklch(0.145 0 0)',
    '--popover': 'oklch(1 0 0)',
    '--popover-foreground': 'oklch(0.145 0 0)',
    '--primary': 'oklch(0.205 0 0)',
    '--primary-foreground': 'oklch(0.985 0 0)',
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
    '--ring': 'oklch(0.708 0 0)',
    '--radius': '0.5rem',
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
    '--sidebar-primary': 'oklch(0.205 0 0)',
    '--sidebar-primary-foreground': 'oklch(0.985 0 0)',
    '--sidebar-accent': 'oklch(0.97 0 0)',
    '--sidebar-accent-foreground': 'oklch(0.205 0 0)',
    '--sidebar-border': 'oklch(0.922 0 0)',
    '--sidebar-ring': 'oklch(0.708 0 0)',
};


type AppearanceState = {
  theme: Theme
  font: Font
  fontSize: FontSize
  setTheme: (theme: Theme) => void
  setFont: (font: Font) => void
  setFontSize: (size: FontSize) => void
  customThemeConfig: CustomThemeConfig
  setCustomThemeConfig: (config: Partial<CustomThemeConfig>) => void
}

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set) => ({
      theme: 'slate',
      font: 'inter',
      fontSize: 'base',
      customThemeConfig: defaultCustomTheme,
      setTheme: (theme) => set({ theme }),
      setFont: (font) => set({ font }),
      setFontSize: (size) => set({ fontSize: size }),
      setCustomThemeConfig: (config) => set((state) => ({ 
        customThemeConfig: { ...state.customThemeConfig, ...config } 
      })),
    }),
    {
      name: 'hrm-appearance-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

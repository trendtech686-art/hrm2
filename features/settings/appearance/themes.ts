import type { CustomThemeConfig } from './store';

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
    '--success': 'oklch(0.62 0.15 145)',
    '--success-foreground': 'oklch(0.99 0.01 145)',
    '--warning': 'oklch(0.88 0.12 85)',
    '--warning-foreground': 'oklch(0.28 0.06 65)',
    '--info': 'oklch(0.58 0.16 255)',
    '--info-foreground': 'oklch(0.99 0.01 255)',
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

// Official shadcn/ui theme colors — bản cập nhật theo trang https://ui.shadcn.com/themes
// Lưu ý: giá trị primary của mỗi preset đã được nâng độ sáng (L) so với bản cũ để nút/
// trạng thái tươi hơn trên mobile (bản cũ L quá thấp → "sỉn").
export const themes: Record<string, CustomThemeConfig> = {
    // Slate (neutral) — bản gốc của shadcn
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

    // Blue — shadcn blue (đã nâng L 0.546 → 0.623 để sáng hơn)
    blue: {
        ...baseLightConfig,
        '--primary': 'oklch(0.623 0.214 259.815)',
        '--primary-foreground': 'oklch(0.97 0.014 254.604)',
        '--ring': 'oklch(0.623 0.214 259.815)',
        '--sidebar-primary': 'oklch(0.623 0.214 259.815)',
        '--sidebar-primary-foreground': 'oklch(0.97 0.014 254.604)',
    },

    // Green — shadcn green (đã nâng L 0.596 → 0.723 — dùng chữ tối cho contrast)
    green: {
        ...baseLightConfig,
        '--primary': 'oklch(0.723 0.219 149.579)',
        '--primary-foreground': 'oklch(0.145 0 0)',
        '--ring': 'oklch(0.723 0.219 149.579)',
        '--sidebar-primary': 'oklch(0.723 0.219 149.579)',
        '--sidebar-primary-foreground': 'oklch(0.145 0 0)',
    },

    // Amber / Yellow — shadcn yellow (L cao → chữ tối)
    amber: {
        ...baseLightConfig,
        '--primary': 'oklch(0.828 0.189 84.429)',
        '--primary-foreground': 'oklch(0.145 0 0)',
        '--ring': 'oklch(0.828 0.189 84.429)',
        '--sidebar-primary': 'oklch(0.828 0.189 84.429)',
        '--sidebar-primary-foreground': 'oklch(0.145 0 0)',
    },

    // Rose — shadcn rose
    rose: {
        ...baseLightConfig,
        '--primary': 'oklch(0.645 0.246 16.439)',
        '--primary-foreground': 'oklch(0.969 0.015 12.422)',
        '--ring': 'oklch(0.645 0.246 16.439)',
        '--sidebar-primary': 'oklch(0.645 0.246 16.439)',
        '--sidebar-primary-foreground': 'oklch(0.969 0.015 12.422)',
    },

    // Purple / Violet — shadcn violet
    purple: {
        ...baseLightConfig,
        '--primary': 'oklch(0.606 0.25 292.717)',
        '--primary-foreground': 'oklch(0.969 0.016 293.756)',
        '--ring': 'oklch(0.606 0.25 292.717)',
        '--sidebar-primary': 'oklch(0.606 0.25 292.717)',
        '--sidebar-primary-foreground': 'oklch(0.969 0.016 293.756)',
    },

    // Orange — shadcn orange
    orange: {
        ...baseLightConfig,
        '--primary': 'oklch(0.705 0.213 47.604)',
        '--primary-foreground': 'oklch(0.98 0.016 73.684)',
        '--ring': 'oklch(0.705 0.213 47.604)',
        '--sidebar-primary': 'oklch(0.705 0.213 47.604)',
        '--sidebar-primary-foreground': 'oklch(0.98 0.016 73.684)',
    },

    // Teal — shadcn cyan/teal (đổi hue 215 → 182 để đậm teal hơn, bớt ngả cyan)
    teal: {
        ...baseLightConfig,
        '--primary': 'oklch(0.704 0.14 182.503)',
        '--primary-foreground': 'oklch(0.145 0 0)',
        '--ring': 'oklch(0.704 0.14 182.503)',
        '--sidebar-primary': 'oklch(0.704 0.14 182.503)',
        '--sidebar-primary-foreground': 'oklch(0.145 0 0)',
    },
};

// Base dark surface (shared giữa các preset có màu — chỉ nền/viền, KHÔNG ép primary)
const baseDarkSurface: Partial<CustomThemeConfig> = {
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
    '--destructive-foreground': 'oklch(0.985 0 0)',
    '--success': 'oklch(0.62 0.16 150)',
    '--success-foreground': 'oklch(0.12 0.03 150)',
    '--warning': 'oklch(0.78 0.12 80)',
    '--warning-foreground': 'oklch(0.2 0.05 70)',
    '--info': 'oklch(0.62 0.14 255)',
    '--info-foreground': 'oklch(0.98 0.01 255)',
    '--border': 'oklch(1 0 0 / 10%)',
    '--input': 'oklch(1 0 0 / 15%)',
    '--sidebar': 'oklch(0.205 0 0)',
    '--sidebar-foreground': 'oklch(0.985 0 0)',
    '--sidebar-accent': 'oklch(0.269 0 0)',
    '--sidebar-accent-foreground': 'oklch(0.985 0 0)',
    '--sidebar-border': 'oklch(1 0 0 / 10%)',
    // Dark charts — palette sáng hơn để biểu đồ dễ đọc trên nền tối
    '--chart-1': 'oklch(0.488 0.243 264.376)',
    '--chart-2': 'oklch(0.696 0.17 162.48)',
    '--chart-3': 'oklch(0.769 0.188 70.08)',
    '--chart-4': 'oklch(0.627 0.265 303.9)',
    '--chart-5': 'oklch(0.645 0.246 16.439)',
};

/**
 * Dark mode overrides — MỖI preset có bộ primary dark riêng (không ép từ light).
 * Primary dark được chọn với L cao (0.6-0.85) + C vừa để nút/trạng thái "pop" trên
 * nền đen thay vì bị tối sỉn như trước.
 */
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
        '--destructive-foreground': 'oklch(0.985 0 0)',
        '--success': 'oklch(0.62 0.16 150)',
        '--success-foreground': 'oklch(0.12 0.03 150)',
        '--warning': 'oklch(0.78 0.12 80)',
        '--warning-foreground': 'oklch(0.2 0.05 70)',
        '--info': 'oklch(0.62 0.14 255)',
        '--info-foreground': 'oklch(0.98 0.01 255)',
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
        // Dark charts — slate pattern
        '--chart-1': 'oklch(0.488 0.243 264.376)',
        '--chart-2': 'oklch(0.696 0.17 162.48)',
        '--chart-3': 'oklch(0.769 0.188 70.08)',
        '--chart-4': 'oklch(0.627 0.265 303.9)',
        '--chart-5': 'oklch(0.645 0.246 16.439)',
    },

    blue: {
        ...baseDarkSurface,
        '--primary': 'oklch(0.623 0.214 259.815)',
        '--primary-foreground': 'oklch(0.97 0.014 254.604)',
        '--ring': 'oklch(0.488 0.243 264.376)',
        '--sidebar-primary': 'oklch(0.546 0.245 262.881)',
        '--sidebar-primary-foreground': 'oklch(0.97 0.014 254.604)',
        '--sidebar-ring': 'oklch(0.488 0.243 264.376)',
    },

    green: {
        ...baseDarkSurface,
        '--primary': 'oklch(0.723 0.219 149.579)',
        '--primary-foreground': 'oklch(0.145 0 0)',
        '--ring': 'oklch(0.527 0.154 150.069)',
        '--sidebar-primary': 'oklch(0.696 0.17 162.48)',
        '--sidebar-primary-foreground': 'oklch(0.145 0 0)',
        '--sidebar-ring': 'oklch(0.527 0.154 150.069)',
    },

    amber: {
        ...baseDarkSurface,
        '--primary': 'oklch(0.828 0.189 84.429)',
        '--primary-foreground': 'oklch(0.145 0 0)',
        '--ring': 'oklch(0.554 0.135 66.442)',
        '--sidebar-primary': 'oklch(0.828 0.189 84.429)',
        '--sidebar-primary-foreground': 'oklch(0.145 0 0)',
        '--sidebar-ring': 'oklch(0.554 0.135 66.442)',
    },

    rose: {
        ...baseDarkSurface,
        '--primary': 'oklch(0.645 0.246 16.439)',
        '--primary-foreground': 'oklch(0.969 0.015 12.422)',
        '--ring': 'oklch(0.577 0.245 27.325)',
        '--sidebar-primary': 'oklch(0.645 0.246 16.439)',
        '--sidebar-primary-foreground': 'oklch(0.969 0.015 12.422)',
        '--sidebar-ring': 'oklch(0.577 0.245 27.325)',
    },

    purple: {
        ...baseDarkSurface,
        '--primary': 'oklch(0.606 0.25 292.717)',
        '--primary-foreground': 'oklch(0.969 0.016 293.756)',
        '--ring': 'oklch(0.541 0.281 293.009)',
        '--sidebar-primary': 'oklch(0.606 0.25 292.717)',
        '--sidebar-primary-foreground': 'oklch(0.969 0.016 293.756)',
        '--sidebar-ring': 'oklch(0.541 0.281 293.009)',
    },

    orange: {
        ...baseDarkSurface,
        '--primary': 'oklch(0.646 0.222 41.116)',
        '--primary-foreground': 'oklch(0.98 0.016 73.684)',
        '--ring': 'oklch(0.646 0.222 41.116)',
        '--sidebar-primary': 'oklch(0.646 0.222 41.116)',
        '--sidebar-primary-foreground': 'oklch(0.98 0.016 73.684)',
        '--sidebar-ring': 'oklch(0.646 0.222 41.116)',
    },

    teal: {
        ...baseDarkSurface,
        '--primary': 'oklch(0.704 0.14 182.503)',
        '--primary-foreground': 'oklch(0.145 0 0)',
        '--ring': 'oklch(0.6 0.118 184.704)',
        '--sidebar-primary': 'oklch(0.6 0.118 184.704)',
        '--sidebar-primary-foreground': 'oklch(0.145 0 0)',
        '--sidebar-ring': 'oklch(0.6 0.118 184.704)',
    },

    // Fallback chung (giữ để tương thích ngược với custom theme không khai báo dark riêng)
    _coloredDark: {
        ...baseDarkSurface,
    },
};

// Get theme config for mode
export function getThemeConfig(themeName: string, mode: 'light' | 'dark'): CustomThemeConfig {
    const lightConfig = themes[themeName] || themes.slate;

    if (mode === 'light') {
        return lightConfig;
    }

    // Dark: dùng bộ override riêng cho từng theme (có primary-dark riêng cho mỗi preset).
    const darkOverrides = darkThemes[themeName] || darkThemes._coloredDark;
    return {
        ...lightConfig,
        ...darkOverrides,
    };
}

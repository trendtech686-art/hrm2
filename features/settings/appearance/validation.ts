import { z } from 'zod';

// Theme Schema
export const themeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Tên theme không được để trống'),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Màu không hợp lệ'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Màu không hợp lệ').optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Màu không hợp lệ').optional(),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Màu không hợp lệ').optional(),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Màu không hợp lệ').optional(),
  borderRadius: z.number().min(0).max(20).optional(),
  fontFamily: z.string().optional(),
  fontSize: z.number().min(12).max(20).optional(),
  isDark: z.boolean().default(false),
});

// Custom Theme Schema
export const createCustomThemeSchema = themeSchema.omit({ id: true });
export const updateCustomThemeSchema = createCustomThemeSchema.partial();

// Appearance Settings
export const appearanceSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  themeId: z.string().optional(),
  sidebarCollapsed: z.boolean().default(false),
  compactMode: z.boolean().default(false),
  animationsEnabled: z.boolean().default(true),
  language: z.enum(['vi', 'en']).default('vi'),
});

// Types
export type Theme = z.infer<typeof themeSchema>;
export type CreateCustomThemeInput = z.infer<typeof createCustomThemeSchema>;
export type UpdateCustomThemeInput = z.infer<typeof updateCustomThemeSchema>;
export type AppearanceSettings = z.infer<typeof appearanceSettingsSchema>;

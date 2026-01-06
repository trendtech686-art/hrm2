import { z } from 'zod';

// General Settings Schema
export const generalSettingsSchema = z.object({
  companyName: z.string().min(1, 'Tên công ty không được để trống'),
  timezone: z.string().default('Asia/Ho_Chi_Minh'),
  dateFormat: z.enum(['dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd']).default('dd/MM/yyyy'),
  timeFormat: z.enum(['12h', '24h']).default('24h'),
  currency: z.string().default('VND'),
  language: z.enum(['vi', 'en']).default('vi'),
});

// Security Settings Schema
export const securitySettingsSchema = z.object({
  passwordMinLength: z.number().min(6).max(32).default(8),
  passwordRequireUppercase: z.boolean().default(true),
  passwordRequireNumber: z.boolean().default(true),
  passwordRequireSpecial: z.boolean().default(false),
  sessionTimeoutMinutes: z.number().min(5).max(480).default(60),
  maxLoginAttempts: z.number().min(3).max(10).default(5),
  lockoutDurationMinutes: z.number().min(5).max(60).default(15),
  twoFactorEnabled: z.boolean().default(false),
});

// Notification Settings Schema
export const notificationSettingsSchema = z.object({
  emailEnabled: z.boolean().default(true),
  smsEnabled: z.boolean().default(false),
  pushEnabled: z.boolean().default(true),
  orderNotifications: z.boolean().default(true),
  paymentNotifications: z.boolean().default(true),
  inventoryAlerts: z.boolean().default(true),
  lowStockThreshold: z.number().min(0).default(10),
});

// Email Template Schema
export const emailTemplateSchema = z.object({
  code: z.string().min(1, 'Mã template không được để trống'),
  name: z.string().min(1, 'Tên template không được để trống'),
  subject: z.string().min(1, 'Tiêu đề không được để trống'),
  body: z.string().min(1, 'Nội dung không được để trống'),
  variables: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

export const updateEmailTemplateSchema = emailTemplateSchema.partial();

// Integration Settings Schema
export const integrationSettingsSchema = z.object({
  googleAnalyticsId: z.string().optional(),
  facebookPixelId: z.string().optional(),
  zaloOaId: z.string().optional(),
  tawkToId: z.string().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.number().min(1).max(65535).optional(),
  smtpUser: z.string().optional(),
  smtpPassword: z.string().optional(),
  smtpSecure: z.boolean().default(true),
});

// Media Settings Schema
export const mediaSettingsSchema = z.object({
  maxUploadSizeMb: z.number().min(1).max(100).default(10),
  allowedImageTypes: z.array(z.string()).default(['jpg', 'jpeg', 'png', 'gif', 'webp']),
  allowedDocumentTypes: z.array(z.string()).default(['pdf', 'doc', 'docx', 'xls', 'xlsx']),
  imageCompression: z.boolean().default(true),
  imageMaxWidth: z.number().min(100).max(4000).default(1920),
  imageMaxHeight: z.number().min(100).max(4000).default(1080),
  thumbnailSize: z.number().min(50).max(500).default(150),
});

// Types
export type GeneralSettings = z.infer<typeof generalSettingsSchema>;
export type SecuritySettings = z.infer<typeof securitySettingsSchema>;
export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
export type EmailTemplate = z.infer<typeof emailTemplateSchema>;
export type UpdateEmailTemplateInput = z.infer<typeof updateEmailTemplateSchema>;
export type IntegrationSettings = z.infer<typeof integrationSettingsSchema>;
export type MediaSettings = z.infer<typeof mediaSettingsSchema>;
